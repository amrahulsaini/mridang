/**
 * Dropbox Images Migration Script
 * 
 * This script downloads all images from Dropbox URLs and stores them locally,
 * then updates the database to use local paths.
 * 
 * Run with: npx tsx scripts/migrate-dropbox-images.ts
 */

import mysql from 'mysql2/promise'
import fs from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import https from 'https'
import http from 'http'

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'char_mridang',
  port: parseInt(process.env.DB_PORT || '3306')
}

// Convert Dropbox share link to direct download link
function convertDropboxUrl(url: string): string {
  if (!url) return url
  
  // Already a direct link
  if (url.includes('dl.dropboxusercontent.com')) {
    return url.replace('&dl=0', '&raw=1').replace('?dl=0', '?raw=1')
  }
  
  // Convert share link to direct link
  if (url.includes('dropbox.com')) {
    return url
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      .replace('?dl=0', '?raw=1')
      .replace('&dl=0', '&raw=1')
  }
  
  return url
}

// Download image from URL
function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        if (response.headers.location) {
          downloadImage(response.headers.location).then(resolve).catch(reject)
          return
        }
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`))
        return
      }
      
      const chunks: Buffer[] = []
      
      response.on('data', (chunk) => {
        chunks.push(chunk)
      })
      
      response.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
      
      response.on('error', reject)
    }).on('error', reject)
  })
}

// Get file extension from URL or content type
function getFileExtension(url: string, contentType?: string): string {
  // Try to get from URL first
  const urlMatch = url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)
  if (urlMatch) {
    return urlMatch[1].toLowerCase()
  }
  
  // Fallback to content type
  if (contentType) {
    const typeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp'
    }
    return typeMap[contentType.toLowerCase()] || 'jpg'
  }
  
  return 'jpg'
}

// Generate unique filename
function generateFileName(originalUrl: string, productId: number, fieldName: string): string {
  const timestamp = Date.now()
  const ext = getFileExtension(originalUrl)
  return `migrated_${productId}_${fieldName}_${timestamp}.${ext}`
}

// Save image locally
async function saveImageLocally(buffer: Buffer, fileName: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
  
  // Create directory if it doesn't exist
  if (!existsSync(uploadDir)) {
    await fs.mkdir(uploadDir, { recursive: true })
  }
  
  const filePath = path.join(uploadDir, fileName)
  await fs.writeFile(filePath, buffer)
  
  // Return the API route path (same format as upload-image uses)
  return `/api/admin/serve-image/${fileName}`
}

// Check if URL is a Dropbox URL
function isDropboxUrl(url: string | null): boolean {
  if (!url) return false
  return url.includes('dropbox.com') || url.includes('dropboxusercontent.com')
}

// Main migration function
async function migrateDropboxImages() {
  let connection: mysql.Connection | null = null
  let successCount = 0
  let failCount = 0
  let skippedCount = 0
  const errors: string[] = []
  
  try {
    console.log('🚀 Starting Dropbox images migration...\n')
    
    // Connect to database
    console.log('📊 Connecting to database...')
    connection = await mysql.createConnection(dbConfig)
    console.log('✅ Connected to database\n')
    
    // Get all products with Dropbox image URLs
    console.log('🔍 Fetching products with Dropbox images...')
    const [products] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT 
        id, 
        pro_id,
        main_image_url,
        other_image_url_1,
        other_image_url_2,
        other_image_url_3,
        other_image_url_4,
        supplier_image
      FROM Products
      WHERE 
        main_image_url LIKE '%dropbox%' OR
        other_image_url_1 LIKE '%dropbox%' OR
        other_image_url_2 LIKE '%dropbox%' OR
        other_image_url_3 LIKE '%dropbox%' OR
        other_image_url_4 LIKE '%dropbox%' OR
        supplier_image LIKE '%dropbox%'`
    )
    
    console.log(`📦 Found ${products.length} products with Dropbox images\n`)
    
    if (products.length === 0) {
      console.log('✨ No Dropbox images to migrate!')
      return
    }
    
    // Process each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const productId = product.id
      const proId = product.pro_id || productId
      
      console.log(`\n[${i + 1}/${products.length}] Processing product #${proId}...`)
      
      const imageFields = [
        'main_image_url',
        'other_image_url_1',
        'other_image_url_2',
        'other_image_url_3',
        'other_image_url_4',
        'supplier_image'
      ]
      
      const updates: Record<string, string> = {}
      
      for (const field of imageFields) {
        const url = product[field]
        
        if (!isDropboxUrl(url)) {
          continue // Skip non-Dropbox URLs
        }
        
        try {
          console.log(`  📥 Downloading ${field}...`)
          
          // Convert to direct link
          const directUrl = convertDropboxUrl(url)
          
          // Download image
          const imageBuffer = await downloadImage(directUrl)
          console.log(`  ✓ Downloaded (${(imageBuffer.length / 1024).toFixed(2)} KB)`)
          
          // Generate filename
          const fileName = generateFileName(url, productId, field)
          
          // Save locally
          const localPath = await saveImageLocally(imageBuffer, fileName)
          console.log(`  ✓ Saved as: ${localPath}`)
          
          // Store for database update
          updates[field] = localPath
          successCount++
          
          // Small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 500))
          
        } catch (error) {
          failCount++
          const errorMsg = `Failed to migrate ${field} for product #${proId}: ${error}`
          console.error(`  ❌ ${errorMsg}`)
          errors.push(errorMsg)
        }
      }
      
      // Update database if we have any successful downloads
      if (Object.keys(updates).length > 0) {
        try {
          const setClauses = Object.keys(updates)
            .map(field => `${field} = ?`)
            .join(', ')
          
          const values = [...Object.values(updates), productId]
          
          await connection.execute(
            `UPDATE Products SET ${setClauses} WHERE id = ?`,
            values
          )
          
          console.log(`  ✅ Database updated with ${Object.keys(updates).length} new local paths`)
        } catch (error) {
          console.error(`  ❌ Failed to update database for product #${proId}:`, error)
          errors.push(`Database update failed for product #${proId}: ${error}`)
        }
      } else {
        skippedCount++
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 MIGRATION SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Successfully migrated: ${successCount} images`)
    console.log(`❌ Failed: ${failCount} images`)
    console.log(`⏭️  Skipped: ${skippedCount} products`)
    console.log(`📦 Total products processed: ${products.length}`)
    
    if (errors.length > 0) {
      console.log('\n⚠️  ERRORS:')
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`)
      })
    }
    
    console.log('\n✨ Migration completed!')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log('\n🔌 Database connection closed')
    }
  }
}

// Run the migration
if (require.main === module) {
  migrateDropboxImages()
    .then(() => {
      console.log('\n🎉 All done!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Migration script failed:', error)
      process.exit(1)
    })
}

export { migrateDropboxImages }
