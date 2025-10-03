/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'
import mysql from 'mysql2/promise'

interface ProductData {
  id?: number
  pro_id?: string
  flipkart_serial_number?: string
  catalog_qc_status?: string
  qc_failed_reason?: string
  flipkart_product_link?: string
  product_data_status?: string
  disapproval_reason?: string
  seller_sku_id?: string
  brand?: string
  model_number?: string
  pack_of?: number
  width_inch?: number
  depth_inch?: number
  main_image_url?: string
  other_image_url_1?: string
  other_image_url_2?: string
  other_image_url_3?: string
  other_image_url_4?: string
  group_id?: string
  description?: string
  video_url?: string
  model_name: string
  brand_color?: string
  theme?: string
  design?: string
  finish?: string
  stand_included?: boolean
  embossment?: string
  regional_speciality_id?: number
  height_inch?: number
  art_form_type_id?: number
  diameter_inch?: number
  weight_g?: number
  other_dimensions?: string
  dishwasher_safe?: boolean
  microwave_safe?: boolean
  cold_proof?: boolean
  other_features?: string
  domestic_warranty?: number
  domestic_warranty_unit?: string
  international_warranty?: number
  international_warranty_unit?: string
  warranty_summary?: string
  warranty_service_type?: string
  covered_in_warranty?: string
  not_covered_in_warranty?: string
  ean_upc?: string
  gift_pack?: boolean
  supplier_image?: string
  is_fragile?: boolean
  category_id?: number
  // Pricing
  original_price?: number
  cut_price?: number
  // Relationships
  key_features?: number[]
  materials?: number[]
  colors?: number[]
  search_keywords?: number[]
}

// GET - Fetch all products with full details
export async function GET() {
  try {
    // First get all products with basic info
    const products = await query(`
      SELECT
        p.*,
        c.category_name,
        rs.regional_speciality_name,
        aft.art_form_type_name,
        pp.original_price,
        pp.cut_price
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.category_id
      LEFT JOIN RegionalSpecialities rs ON p.regional_speciality_id = rs.regional_speciality_id
      LEFT JOIN ArtFormTypes aft ON p.art_form_type_id = aft.art_form_type_id
  LEFT JOIN product_prices pp ON p.id = pp.product_id AND pp.is_active = 1
      ORDER BY p.id DESC
    `)

    // For each product, fetch relationships
    const productsWithRelationships = await Promise.all(
      (products as any[]).map(async (product: any) => {
        const keyFeatures = await query(`
          SELECT feature_id FROM Product_KeyFeatures WHERE product_id = ?
        `, [product.id]) as any

        const materials = await query(`
          SELECT material_id FROM Product_Materials WHERE product_id = ?
        `, [product.id]) as any

        const colors = await query(`
          SELECT color_id FROM Product_Colors WHERE product_id = ?
        `, [product.id]) as any

        const searchKeywords = await query(`
          SELECT keyword_id FROM Product_SearchKeywords WHERE product_id = ?
        `, [product.id]) as any

        return {
          ...product,
          key_features: keyFeatures.map((kf: any) => kf.feature_id),
          materials: materials.map((m: any) => m.material_id),
          colors: colors.map((c: any) => c.color_id),
          search_keywords: searchKeywords.map((sk: any) => sk.keyword_id)
        }
      })
    )

    return NextResponse.json(productsWithRelationships)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const productData: ProductData = await request.json()

    const {
      pro_id: _pro_id, // eslint-disable-line @typescript-eslint/no-unused-vars
      flipkart_serial_number,
      catalog_qc_status,
      qc_failed_reason,
      flipkart_product_link,
      product_data_status,
      disapproval_reason,
      seller_sku_id,
      brand,
      model_number,
      pack_of,
      width_inch,
      depth_inch,
      main_image_url,
      other_image_url_1,
      other_image_url_2,
      other_image_url_3,
      other_image_url_4,
      group_id,
      description,
      video_url,
      model_name,
      brand_color,
      theme,
      design,
      finish,
      stand_included,
      embossment,
      regional_speciality_id,
      height_inch,
      art_form_type_id,
      diameter_inch,
      weight_g,
      other_dimensions,
      dishwasher_safe,
      microwave_safe,
      cold_proof,
      other_features,
      domestic_warranty,
      domestic_warranty_unit,
      international_warranty,
      international_warranty_unit,
      warranty_summary,
      warranty_service_type,
      covered_in_warranty,
      not_covered_in_warranty,
      ean_upc,
      gift_pack,
      supplier_image,
      is_fragile,
      category_id,
      original_price,
      cut_price,
      key_features,
      materials,
      colors,
      search_keywords
    } = productData

    // Start transaction
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'mrid_mridang',
      password: process.env.DB_PASS || 'mridang',
      database: process.env.DB_NAME || 'mrid_mridang',
    })

    await connection.beginTransaction()

    try {
      // Insert main product
      const [result] = await connection.execute(`
        INSERT INTO Products (
          flipkart_serial_number, catalog_qc_status, qc_failed_reason,
          flipkart_product_link, product_data_status, disapproval_reason, seller_sku_id,
          brand, model_number, pack_of, width_inch, depth_inch, main_image_url,
          other_image_url_1, other_image_url_2, other_image_url_3, other_image_url_4,
          group_id, description, video_url, model_name, brand_color, theme, design,
          finish, stand_included, embossment, regional_speciality_id, height_inch,
          art_form_type_id, diameter_inch, weight_g, other_dimensions, dishwasher_safe,
          microwave_safe, cold_proof, other_features, domestic_warranty,
          domestic_warranty_unit, international_warranty, international_warranty_unit,
          warranty_summary, warranty_service_type, covered_in_warranty,
          not_covered_in_warranty, ean_upc, gift_pack, supplier_image, is_fragile,
          category_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        flipkart_serial_number, catalog_qc_status, qc_failed_reason,
        flipkart_product_link, product_data_status, disapproval_reason, seller_sku_id,
        brand, model_number, pack_of, width_inch, depth_inch, main_image_url,
        other_image_url_1, other_image_url_2, other_image_url_3, other_image_url_4,
        group_id, description, video_url, model_name, brand_color, theme, design,
        finish, stand_included, embossment, regional_speciality_id, height_inch,
        art_form_type_id, diameter_inch, weight_g, other_dimensions, dishwasher_safe,
        microwave_safe, cold_proof, other_features, domestic_warranty,
        domestic_warranty_unit, international_warranty, international_warranty_unit,
        warranty_summary, warranty_service_type, covered_in_warranty,
        not_covered_in_warranty, ean_upc, gift_pack, supplier_image, is_fragile,
        category_id
      ])

      const productId = (result as mysql.ResultSetHeader).insertId

      // Insert pricing if provided
      if (original_price !== undefined || cut_price !== undefined) {
        await connection.execute(`
          INSERT INTO product_prices (product_id, original_price, cut_price, is_active)
          VALUES (?, ?, ?, 1)
        `, [productId, original_price || 0, cut_price || 0])
      }

      // Insert relationships
      if (key_features && key_features.length > 0) {
        const values = key_features.map((featureId: number) => `(${productId}, ${featureId})`).join(', ')
        await connection.execute(`INSERT INTO Product_KeyFeatures (product_id, feature_id) VALUES ${values}`)
      }

      if (materials && materials.length > 0) {
        const values = materials.map((materialId: number) => `(${productId}, ${materialId})`).join(', ')
        await connection.execute(`INSERT INTO Product_Materials (product_id, material_id) VALUES ${values}`)
      }

      if (colors && colors.length > 0) {
        const values = colors.map((colorId: number) => `(${productId}, ${colorId})`).join(', ')
        await connection.execute(`INSERT INTO Product_Colors (product_id, color_id) VALUES ${values}`)
      }

      if (search_keywords && search_keywords.length > 0) {
        const values = search_keywords.map((keywordId: number) => `(${productId}, ${keywordId})`).join(', ')
        await connection.execute(`INSERT INTO Product_SearchKeywords (product_id, keyword_id) VALUES ${values}`)
      }

      await connection.commit()
      await connection.end()

      return NextResponse.json({
        success: true,
        message: 'Product created successfully',
        productId
      })
    } catch (error) {
      await connection.rollback()
      await connection.end()
      throw error
    }
  } catch (error) {
    console.error('Error creating product:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    )
  }
}

// PUT - Update existing product
export async function PUT(request: NextRequest) {
  try {
    const productData: ProductData = await request.json()
    const { id } = productData

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const {
      pro_id,
      flipkart_serial_number,
      catalog_qc_status,
      qc_failed_reason,
      flipkart_product_link,
      product_data_status,
      disapproval_reason,
      seller_sku_id,
      brand,
      model_number,
      pack_of,
      width_inch,
      depth_inch,
      main_image_url,
      other_image_url_1,
      other_image_url_2,
      other_image_url_3,
      other_image_url_4,
      group_id,
      description,
      video_url,
      model_name,
      brand_color,
      theme,
      design,
      finish,
      stand_included,
      embossment,
      regional_speciality_id,
      height_inch,
      art_form_type_id,
      diameter_inch,
      weight_g,
      other_dimensions,
      dishwasher_safe,
      microwave_safe,
      cold_proof,
      other_features,
      domestic_warranty,
      domestic_warranty_unit,
      international_warranty,
      international_warranty_unit,
      warranty_summary,
      warranty_service_type,
      covered_in_warranty,
      not_covered_in_warranty,
      ean_upc,
      gift_pack,
      supplier_image,
      is_fragile,
      category_id,
      original_price,
      cut_price,
      key_features,
      materials,
      colors,
      search_keywords
    } = productData

    // Start transaction
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'mrid_mridang',
      password: process.env.DB_PASS || 'mridang',
      database: process.env.DB_NAME || 'mrid_mridang',
    })

    await connection.beginTransaction()

    try {
      // Update main product
      await connection.execute(`
        UPDATE Products SET
          pro_id = ?, flipkart_serial_number = ?, catalog_qc_status = ?, qc_failed_reason = ?,
          flipkart_product_link = ?, product_data_status = ?, disapproval_reason = ?, seller_sku_id = ?,
          brand = ?, model_number = ?, pack_of = ?, width_inch = ?, depth_inch = ?, main_image_url = ?,
          other_image_url_1 = ?, other_image_url_2 = ?, other_image_url_3 = ?, other_image_url_4 = ?,
          group_id = ?, description = ?, video_url = ?, model_name = ?, brand_color = ?, theme = ?, design = ?,
          finish = ?, stand_included = ?, embossment = ?, regional_speciality_id = ?, height_inch = ?,
          art_form_type_id = ?, diameter_inch = ?, weight_g = ?, other_dimensions = ?, dishwasher_safe = ?,
          microwave_safe = ?, cold_proof = ?, other_features = ?, domestic_warranty = ?,
          domestic_warranty_unit = ?, international_warranty = ?, international_warranty_unit = ?,
          warranty_summary = ?, warranty_service_type = ?, covered_in_warranty = ?,
          not_covered_in_warranty = ?, ean_upc = ?, gift_pack = ?, supplier_image = ?, is_fragile = ?,
          category_id = ?
        WHERE id = ?
      `, [
        pro_id, flipkart_serial_number, catalog_qc_status, qc_failed_reason,
        flipkart_product_link, product_data_status, disapproval_reason, seller_sku_id,
        brand, model_number, pack_of, width_inch, depth_inch, main_image_url,
        other_image_url_1, other_image_url_2, other_image_url_3, other_image_url_4,
        group_id, description, video_url, model_name, brand_color, theme, design,
        finish, stand_included, embossment, regional_speciality_id, height_inch,
        art_form_type_id, diameter_inch, weight_g, other_dimensions, dishwasher_safe,
        microwave_safe, cold_proof, other_features, domestic_warranty,
        domestic_warranty_unit, international_warranty, international_warranty_unit,
        warranty_summary, warranty_service_type, covered_in_warranty,
        not_covered_in_warranty, ean_upc, gift_pack, supplier_image, is_fragile,
        category_id, id
      ])

      // Update pricing
      if (original_price !== undefined || cut_price !== undefined) {
        // First deactivate existing prices
        await connection.execute(`
          UPDATE product_prices SET is_active = 0 WHERE product_id = ?
        `, [id])

        // Insert new active price
        await connection.execute(`
          INSERT INTO product_prices (product_id, original_price, cut_price, is_active)
          VALUES (?, ?, ?, 1)
        `, [id, original_price || 0, cut_price || 0])
      }

      // Update relationships - delete existing and insert new
      await connection.execute('DELETE FROM Product_KeyFeatures WHERE product_id = ?', [id])
      if (key_features && key_features.length > 0) {
        const values = key_features.map((featureId: number) => `(${id}, ${featureId})`).join(', ')
        await connection.execute(`INSERT INTO Product_KeyFeatures (product_id, feature_id) VALUES ${values}`)
      }

      await connection.execute('DELETE FROM Product_Materials WHERE product_id = ?', [id])
      if (materials && materials.length > 0) {
        const values = materials.map((materialId: number) => `(${id}, ${materialId})`).join(', ')
        await connection.execute(`INSERT INTO Product_Materials (product_id, material_id) VALUES ${values}`)
      }

      await connection.execute('DELETE FROM Product_Colors WHERE product_id = ?', [id])
      if (colors && colors.length > 0) {
        const values = colors.map((colorId: number) => `(${id}, ${colorId})`).join(', ')
        await connection.execute(`INSERT INTO Product_Colors (product_id, color_id) VALUES ${values}`)
      }

      await connection.execute('DELETE FROM Product_SearchKeywords WHERE product_id = ?', [id])
      if (search_keywords && search_keywords.length > 0) {
        const values = search_keywords.map((keywordId: number) => `(${id}, ${keywordId})`).join(', ')
        await connection.execute(`INSERT INTO Product_SearchKeywords (product_id, keyword_id) VALUES ${values}`)
      }

      await connection.commit()
      await connection.end()

      return NextResponse.json({
        success: true,
        message: 'Product updated successfully'
      })
    } catch (error) {
      await connection.rollback()
      await connection.end()
      throw error
    }
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Start transaction
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'mrid_mridang',
      password: process.env.DB_PASS || 'mridang',
      database: process.env.DB_NAME || 'mrid_mridang',
    })

    await connection.beginTransaction()

    try {
      // Delete relationships first
      await connection.execute('DELETE FROM Product_KeyFeatures WHERE product_id = ?', [id])
      await connection.execute('DELETE FROM Product_Materials WHERE product_id = ?', [id])
      await connection.execute('DELETE FROM Product_Colors WHERE product_id = ?', [id])
      await connection.execute('DELETE FROM Product_SearchKeywords WHERE product_id = ?', [id])

      // Delete pricing
      await connection.execute('DELETE FROM product_prices WHERE product_id = ?', [id])

      // Delete main product
      await connection.execute('DELETE FROM Products WHERE id = ?', [id])

      await connection.commit()
      await connection.end()

      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully'
      })
    } catch (error) {
      await connection.rollback()
      await connection.end()
      throw error
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}