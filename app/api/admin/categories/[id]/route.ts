import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'

interface CategoryData {
  category_id?: number
  category_name: string
  product_count?: number
  arrange_order?: number
}

interface ProductCountResult {
  count: number
}

interface CountResult {
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
        c.category_id,
        c.category_name,
        c.arrange_order,
        COUNT(p.id) as product_count
      FROM Categories c
      LEFT JOIN Products p ON c.category_id = p.category_id
      WHERE c.category_id = ?
      GROUP BY c.category_id, c.category_name, c.arrange_order
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
    const { category_name, arrange_order } = categoryData

    if (!category_name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    console.log('Updating category:', categoryId, 'with data:', categoryData);

    const requestedOrder = Number.isFinite(arrange_order) ? Number(arrange_order) : null
    if (requestedOrder != null) {
      if (requestedOrder < 1) {
        return NextResponse.json(
          { error: 'Sort order must be 1 or higher' },
          { status: 400 }
        )
      }

      const dupRows = (await query(
        'SELECT COUNT(*) AS count FROM Categories WHERE arrange_order = ? AND category_id <> ?'
        , [requestedOrder, categoryId]
      )) as CountResult[]
      if (Number(dupRows?.[0]?.count ?? 0) > 0) {
        return NextResponse.json(
          { error: `Sort order ${requestedOrder} is already used by another category` },
          { status: 400 }
        )
      }

      await query(
        'UPDATE Categories SET category_name = ?, arrange_order = ? WHERE category_id = ?',
        [category_name, requestedOrder, categoryId]
      )
    } else {
      await query(
        'UPDATE Categories SET category_name = ? WHERE category_id = ?',
        [category_name, categoryId]
      )
    }

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