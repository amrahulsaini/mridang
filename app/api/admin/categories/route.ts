import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'
import mysql from 'mysql2/promise'

interface CategoryData {
  category_id?: number
  category_name: string
  arrange_order?: number
}

interface CountResult {
  count: number
}

interface MaxOrderResult {
  max_order: number
}

// GET - Fetch all categories
export async function GET() {
  try {

    const categories = await query(`
      SELECT
        c.category_id,
        c.category_name,
        c.arrange_order,
        COUNT(p.id) as product_count
      FROM Categories c
      LEFT JOIN Products p ON c.category_id = p.category_id
      GROUP BY c.category_id, c.category_name, c.arrange_order
      ORDER BY c.arrange_order ASC, c.category_name ASC
    `)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const categoryData: CategoryData = await request.json()
    const { category_name, arrange_order } = categoryData

    if (!category_name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    const requestedOrder = Number.isFinite(arrange_order) ? Number(arrange_order) : null

    let finalOrder: number
    if (requestedOrder == null) {
      const maxRows = (await query(
        'SELECT COALESCE(MAX(arrange_order), 0) AS max_order FROM Categories'
      )) as MaxOrderResult[]
      finalOrder = Number(maxRows?.[0]?.max_order ?? 0) + 1
    } else {
      if (requestedOrder < 1) {
        return NextResponse.json(
          { error: 'Sort order must be 1 or higher' },
          { status: 400 }
        )
      }
      const dupRows = (await query(
        'SELECT COUNT(*) AS count FROM Categories WHERE arrange_order = ?'
        , [requestedOrder]
      )) as CountResult[]
      if (Number(dupRows?.[0]?.count ?? 0) > 0) {
        return NextResponse.json(
          { error: `Sort order ${requestedOrder} is already used by another category` },
          { status: 400 }
        )
      }
      finalOrder = requestedOrder
    }

    const result = await query(
      'INSERT INTO Categories (category_name, arrange_order) VALUES (?, ?)',
      [category_name, finalOrder]
    )

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      categoryId: (result as mysql.ResultSetHeader).insertId
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

// PUT - Update existing category
export async function PUT(request: NextRequest) {
  try {
    const categoryData: CategoryData = await request.json()
    const { category_id, category_name, arrange_order } = categoryData

    if (!category_id || !category_name) {
      return NextResponse.json(
        { error: 'Category ID and name are required' },
        { status: 400 }
      )
    }

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
        , [requestedOrder, category_id]
      )) as CountResult[]
      if (Number(dupRows?.[0]?.count ?? 0) > 0) {
        return NextResponse.json(
          { error: `Sort order ${requestedOrder} is already used by another category` },
          { status: 400 }
        )
      }

      await query(
        'UPDATE Categories SET category_name = ?, arrange_order = ? WHERE category_id = ?',
        [category_name, requestedOrder, category_id]
      )
    } else {
      await query(
        'UPDATE Categories SET category_name = ? WHERE category_id = ?',
        [category_name, category_id]
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

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('id')

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Check if category has products
    const products = await query(`
      SELECT COUNT(*) as count FROM Products WHERE category_id = ?
    `, [categoryId])

    if ((products as mysql.RowDataPacket[])[0].count > 0) {
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