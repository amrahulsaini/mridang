/**
 * Verify Dropbox Migration Script
 * 
 * This script checks the status of Dropbox image migration:
 * - How many images are still on Dropbox
 * - How many have been migrated to local storage
 * - Which products still need migration
 * 
 * Run with: npx tsx scripts/verify-migration-status.ts
 */

import mysql from 'mysql2/promise'

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'char_mridang',
  port: parseInt(process.env.DB_PORT || '3306')
}

// Check if URL is a Dropbox URL
function isDropboxUrl(url: string | null): boolean {
  if (!url) return false
  return url.includes('dropbox.com') || url.includes('dropboxusercontent.com')
}

// Check if URL is a local URL
function isLocalUrl(url: string | null): boolean {
  if (!url) return false
  return url.startsWith('/api/admin/serve-image/') || url.startsWith('/uploads/')
}

async function verifyMigrationStatus() {
  let connection: mysql.Connection | null = null
  
  try {
    console.log('🔍 Checking Dropbox migration status...\n')
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig)
    
    // Get all products
    const [allProducts] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT 
        id, 
        pro_id,
        main_image_url,
        other_image_url_1,
        other_image_url_2,
        other_image_url_3,
        other_image_url_4,
        supplier_image
      FROM Products`
    )
    
    // Count statistics
    let totalProducts = allProducts.length
    let productsWithDropbox = 0
    let productsFullyMigrated = 0
    let productsPartiallyMigrated = 0
    let productsNoImages = 0
    
    let totalDropboxUrls = 0
    let totalLocalUrls = 0
    let totalNullUrls = 0
    
    const productsNeedingMigration: any[] = []
    
    const imageFields = [
      'main_image_url',
      'other_image_url_1',
      'other_image_url_2',
      'other_image_url_3',
      'other_image_url_4',
      'supplier_image'
    ]
    
    for (const product of allProducts) {
      let hasDropbox = false
      let hasLocal = false
      let dropboxCount = 0
      let localCount = 0
      
      const dropboxFields: string[] = []
      
      for (const field of imageFields) {
        const url = product[field]
        
        if (!url) {
          totalNullUrls++
          continue
        }
        
        if (isDropboxUrl(url)) {
          hasDropbox = true
          dropboxCount++
          totalDropboxUrls++
          dropboxFields.push(field)
        } else if (isLocalUrl(url)) {
          hasLocal = true
          localCount++
          totalLocalUrls++
        }
      }
      
      if (hasDropbox) {
        productsWithDropbox++
        productsNeedingMigration.push({
          id: product.id,
          pro_id: product.pro_id || product.id,
          dropboxCount,
          localCount,
          dropboxFields
        })
      }
      
      if (hasDropbox && hasLocal) {
        productsPartiallyMigrated++
      } else if (hasLocal && !hasDropbox) {
        productsFullyMigrated++
      } else if (!hasDropbox && !hasLocal) {
        productsNoImages++
      }
    }
    
    // Display results
    console.log('=' .repeat(70))
    console.log('📊 MIGRATION STATUS REPORT')
    console.log('='.repeat(70))
    console.log('\n📦 PRODUCT STATISTICS:')
    console.log(`   Total Products: ${totalProducts}`)
    console.log(`   ✅ Fully Migrated (only local images): ${productsFullyMigrated}`)
    console.log(`   ⚠️  Partially Migrated (mix of local & Dropbox): ${productsPartiallyMigrated}`)
    console.log(`   ❌ Still Using Dropbox: ${productsWithDropbox}`)
    console.log(`   🚫 No Images: ${productsNoImages}`)
    
    console.log('\n🖼️  IMAGE URL STATISTICS:')
    console.log(`   Total Image Fields Checked: ${totalProducts * imageFields.length}`)
    console.log(`   ✅ Local URLs: ${totalLocalUrls}`)
    console.log(`   ❌ Dropbox URLs: ${totalDropboxUrls}`)
    console.log(`   ⚪ Null/Empty: ${totalNullUrls}`)
    
    if (productsWithDropbox > 0) {
      console.log('\n⚠️  PRODUCTS NEEDING MIGRATION:')
      console.log('   (Showing first 20)\n')
      
      productsNeedingMigration.slice(0, 20).forEach((product, index) => {
        console.log(`   ${index + 1}. Product #${product.pro_id}`)
        console.log(`      - Dropbox images: ${product.dropboxCount}`)
        console.log(`      - Local images: ${product.localCount}`)
        console.log(`      - Fields: ${product.dropboxFields.join(', ')}`)
      })
      
      if (productsNeedingMigration.length > 20) {
        console.log(`\n   ... and ${productsNeedingMigration.length - 20} more products`)
      }
      
      console.log('\n💡 To migrate these images, run:')
      console.log('   npx tsx scripts/migrate-dropbox-images.ts')
    } else {
      console.log('\n🎉 CONGRATULATIONS!')
      console.log('   All images have been successfully migrated to local storage!')
      console.log('   No Dropbox URLs remaining.')
    }
    
    // Migration progress percentage
    const migrationProgress = totalProducts > 0 
      ? ((productsFullyMigrated / totalProducts) * 100).toFixed(1)
      : '0.0'
    
    console.log('\n📈 MIGRATION PROGRESS:')
    console.log(`   ${migrationProgress}% of products fully migrated`)
    
    const bar = '█'.repeat(Math.floor(parseFloat(migrationProgress) / 5)) + 
                '░'.repeat(20 - Math.floor(parseFloat(migrationProgress) / 5))
    console.log(`   [${bar}] ${migrationProgress}%`)
    
    console.log('\n' + '='.repeat(70))
    
  } catch (error) {
    console.error('\n❌ Error checking migration status:', error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// Run the verification
if (require.main === module) {
  verifyMigrationStatus()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Verification script failed:', error)
      process.exit(1)
    })
}

export { verifyMigrationStatus }
