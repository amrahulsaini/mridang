import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const colors = await query(`
      SELECT color_id, color_name
      FROM Colors
      ORDER BY color_name
    `)

    return NextResponse.json(colors)
  } catch (error) {
    console.error('Error fetching colors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch colors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { color_name } = await request.json()

    if (!color_name?.trim()) {
      return NextResponse.json(
        { error: 'Color name is required' },
        { status: 400 }
      )
    }

    const result = await query(`
      INSERT INTO Colors (color_name) VALUES (?)
    `, [color_name.trim()])

    return NextResponse.json({
      success: true,
      message: 'Color created successfully',
      colorId: (result as mysql.ResultSetHeader).insertId
    })
  } catch (error) {
    console.error('Error creating color:', error)
    return NextResponse.json(
      { error: 'Failed to create color' },
      { status: 500 }
    )
  }
}