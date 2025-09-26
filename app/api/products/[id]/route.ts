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
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    // Fetch product by pro_id
    const products = await query(`
      SELECT p.*, c.category_name
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.category_id
      WHERE p.pro_id = ?
    `, [productId]) as ProductRow[]

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = products[0]

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}