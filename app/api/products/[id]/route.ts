import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'

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
    `, [productId])

    if (!products || (products as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = (products as any[])[0]

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}