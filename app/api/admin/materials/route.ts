import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const materials = await query(`
      SELECT material_id, material_name
      FROM Materials
      ORDER BY material_name
    `)

    return NextResponse.json(materials)
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { material_name } = await request.json()

    if (!material_name?.trim()) {
      return NextResponse.json(
        { error: 'Material name is required' },
        { status: 400 }
      )
    }

    const result = await query(`
      INSERT INTO Materials (material_name) VALUES (?)
    `, [material_name.trim()])

    return NextResponse.json({
      success: true,
      message: 'Material created successfully',
      materialId: (result as mysql.ResultSetHeader).insertId
    })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json(
      { error: 'Failed to create material' },
      { status: 500 }
    )
  }
}