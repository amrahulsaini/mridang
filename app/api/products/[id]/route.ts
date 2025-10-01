import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'

interface ProductRow {
  id: number
  pro_id: string
  model_name: string
  design?: string
  depth_inch?: number
  height_inch?: number
  weight_g?: number
  other_features?: string
  main_image_url?: string
  other_image_url_1?: string
  other_image_url_2?: string
  other_image_url_3?: string
  other_image_url_4?: string
  brand?: string
  description?: string
  category_id: number
  category_name?: string
  width_inch?: number
  diameter_inch?: number
  theme?: string
  finish?: string
  embossment?: string
  is_fragile?: number
  stand_included?: number
  original_price?: number
  cut_price?: number
  price?: number
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    // Fetch product by pro_id with pricing information
    const products = await query(`
      SELECT p.*, c.category_name,
             pp.original_price,
             pp.cut_price,
             COALESCE(pp.cut_price, pp.original_price) as price
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.category_id
      LEFT JOIN product_prices pp ON p.id = pp.product_id AND pp.is_active = 1
      WHERE p.pro_id = ?
    `, [productId]) as ProductRow[]

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = products[0]

    // Fetch materials
    const materials = await query(`
      SELECT m.material_name
      FROM Product_Materials pm
      JOIN Materials m ON pm.material_id = m.material_id
      WHERE pm.product_id = ?
    `, [product.id]) as { material_name: string }[]

    // Fetch colors
    const colors = await query(`
      SELECT c.color_name
      FROM Product_Colors pc
      JOIN Colors c ON pc.color_id = c.color_id
      WHERE pc.product_id = ?
    `, [product.id]) as { color_name: string }[]

    const productWithDetails = {
      ...product,
      materials: materials.map(m => m.material_name),
      colors: colors.map(c => c.color_name)
    }

    return NextResponse.json(productWithDetails)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}