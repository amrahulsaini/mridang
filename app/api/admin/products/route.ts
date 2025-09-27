import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'
import mysql from 'mysql2/promise'

interface ProductData {
  id?: number
  pro_id?: string
  model_name: string
  description?: string
  main_image_url?: string
  other_image_url_1?: string
  other_image_url_2?: string
  other_image_url_3?: string
  other_image_url_4?: string
  video_url?: string
  brand?: string
  model_number?: string
  pack_of?: number
  width_inch?: number
  depth_inch?: number
  height_inch?: number
  diameter_inch?: number
  weight_g?: number
  other_dimensions?: string
  brand_color?: string
  theme?: string
  design?: string
  finish?: string
  stand_included?: boolean
  embossment?: string
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
  gift_pack?: boolean
  supplier_image?: string
  is_fragile?: boolean
  category_id?: number
  regional_speciality_id?: number
  art_form_type_id?: number
}

// GET - Fetch all products with full details
export async function GET() {
  try {
    const products = await query(`
      SELECT
        p.*,
        c.category_name,
        rs.regional_speciality_name,
        aft.art_form_type_name,
        GROUP_CONCAT(DISTINCT kf.feature_text) as key_features,
        GROUP_CONCAT(DISTINCT m.material_name) as materials,
        GROUP_CONCAT(DISTINCT col.color_name) as colors,
        pp.original_price,
        pp.cut_price
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.category_id
      LEFT JOIN RegionalSpecialities rs ON p.regional_speciality_id = rs.regional_speciality_id
      LEFT JOIN ArtFormTypes aft ON p.art_form_type_id = aft.art_form_type_id
      LEFT JOIN Product_KeyFeatures pkf ON p.id = pkf.product_id
      LEFT JOIN KeyFeatures kf ON pkf.feature_id = kf.feature_id
      LEFT JOIN Product_Materials pm ON p.id = pm.product_id
      LEFT JOIN Materials m ON pm.material_id = m.material_id
      LEFT JOIN Product_Colors pc ON p.id = pc.product_id
      LEFT JOIN Colors col ON pc.color_id = col.color_id
      LEFT JOIN product_prices pp ON p.pro_id = pp.product_id AND pp.is_active = 1
      GROUP BY p.id
      ORDER BY p.id DESC
    `)

    return NextResponse.json(products)
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
      model_name,
      description,
      main_image_url,
      other_image_url_1,
      other_image_url_2,
      other_image_url_3,
      other_image_url_4,
      video_url,
      brand,
      model_number,
      pack_of,
      width_inch,
      depth_inch,
      height_inch,
      diameter_inch,
      weight_g,
      other_dimensions,
      brand_color,
      theme,
      design,
      finish,
      stand_included,
      embossment,
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
      gift_pack,
      supplier_image,
      is_fragile,
      category_id,
      regional_speciality_id,
      art_form_type_id
    } = productData

    const result = await query(`
      INSERT INTO Products (
        model_name, description, main_image_url, other_image_url_1, other_image_url_2,
        other_image_url_3, other_image_url_4, video_url, brand, model_number, pack_of,
        width_inch, depth_inch, height_inch, diameter_inch, weight_g, other_dimensions,
        brand_color, theme, design, finish, stand_included, embossment, dishwasher_safe,
        microwave_safe, cold_proof, other_features, domestic_warranty, domestic_warranty_unit,
        international_warranty, international_warranty_unit, warranty_summary,
        warranty_service_type, covered_in_warranty, not_covered_in_warranty, gift_pack,
        supplier_image, is_fragile, category_id, regional_speciality_id, art_form_type_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      model_name, description, main_image_url, other_image_url_1, other_image_url_2,
      other_image_url_3, other_image_url_4, video_url, brand, model_number, pack_of,
      width_inch, depth_inch, height_inch, diameter_inch, weight_g, other_dimensions,
      brand_color, theme, design, finish, stand_included, embossment, dishwasher_safe,
      microwave_safe, cold_proof, other_features, domestic_warranty, domestic_warranty_unit,
      international_warranty, international_warranty_unit, warranty_summary,
      warranty_service_type, covered_in_warranty, not_covered_in_warranty, gift_pack,
      supplier_image, is_fragile, category_id, regional_speciality_id, art_form_type_id
    ])

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      productId: (result as mysql.ResultSetHeader).insertId
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
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
      model_name,
      description,
      main_image_url,
      other_image_url_1,
      other_image_url_2,
      other_image_url_3,
      other_image_url_4,
      video_url,
      brand,
      model_number,
      pack_of,
      width_inch,
      depth_inch,
      height_inch,
      diameter_inch,
      weight_g,
      other_dimensions,
      brand_color,
      theme,
      design,
      finish,
      stand_included,
      embossment,
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
      gift_pack,
      supplier_image,
      is_fragile,
      category_id,
      regional_speciality_id,
      art_form_type_id
    } = productData

    await query(`
      UPDATE Products SET
        model_name = ?, description = ?, main_image_url = ?, other_image_url_1 = ?,
        other_image_url_2 = ?, other_image_url_3 = ?, other_image_url_4 = ?, video_url = ?,
        brand = ?, model_number = ?, pack_of = ?, width_inch = ?, depth_inch = ?,
        height_inch = ?, diameter_inch = ?, weight_g = ?, other_dimensions = ?,
        brand_color = ?, theme = ?, design = ?, finish = ?, stand_included = ?,
        embossment = ?, dishwasher_safe = ?, microwave_safe = ?, cold_proof = ?,
        other_features = ?, domestic_warranty = ?, domestic_warranty_unit = ?,
        international_warranty = ?, international_warranty_unit = ?, warranty_summary = ?,
        warranty_service_type = ?, covered_in_warranty = ?, not_covered_in_warranty = ?,
        gift_pack = ?, supplier_image = ?, is_fragile = ?, category_id = ?,
        regional_speciality_id = ?, art_form_type_id = ?
      WHERE id = ?
    `, [
      model_name, description, main_image_url, other_image_url_1, other_image_url_2,
      other_image_url_3, other_image_url_4, video_url, brand, model_number, pack_of,
      width_inch, depth_inch, height_inch, diameter_inch, weight_g, other_dimensions,
      brand_color, theme, design, finish, stand_included, embossment, dishwasher_safe,
      microwave_safe, cold_proof, other_features, domestic_warranty, domestic_warranty_unit,
      international_warranty, international_warranty_unit, warranty_summary,
      warranty_service_type, covered_in_warranty, not_covered_in_warranty, gift_pack,
      supplier_image, is_fragile, category_id, regional_speciality_id, art_form_type_id,
      id
    ])

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully'
    })
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

    await query('DELETE FROM Products WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}