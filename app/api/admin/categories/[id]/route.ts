import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'

interface CategoryData {
  category_id?: number
  category_name: string
  product_count?: number
  image?: string
  kefeatures?: string
}

interface ProductCountResult {
  count: number
}

// GET - Fetch single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: categoryId } = await params

    const categories = await query(`
      SELECT
        c.*,
        COUNT(p.id) as product_count
      FROM Categories c
      LEFT JOIN Products p ON c.category_id = p.category_id
      WHERE c.category_id = ?
      GROUP BY c.category_id, c.category_name
    `, [categoryId])

    if (!categories || (categories as CategoryData[]).length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json((categories as CategoryData[])[0])
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT - Update single category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: categoryId } = await params
    const categoryData: CategoryData = await request.json()
    const { category_name, image, kefeatures } = categoryData

    if (!category_name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    console.log('Updating category:', categoryId, 'with data:', categoryData);

    await query(`
      UPDATE Categories 
      SET category_name = ?, 
          image = ?, 
          kefeatures = ? 
      WHERE category_id = ?
    `, [category_name, image || null, kefeatures || null, categoryId])

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully'
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE - Delete single category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: categoryId } = await params

    // Check if category has products
    const products = await query(`
      SELECT COUNT(*) as count FROM Products WHERE category_id = ?
    `, [categoryId])

    if ((products as ProductCountResult[])[0].count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing products' },
        { status: 400 }
      )
    }

    await query('DELETE FROM Categories WHERE category_id = ?', [categoryId])

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}