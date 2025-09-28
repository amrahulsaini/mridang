import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const artFormTypes = await query(`
      SELECT art_form_type_id, art_form_type_name
      FROM ArtFormTypes
      ORDER BY art_form_type_name
    `)

    return NextResponse.json(artFormTypes)
  } catch (error) {
    console.error('Error fetching art form types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch art form types' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { art_form_type_name } = await request.json()

    if (!art_form_type_name?.trim()) {
      return NextResponse.json(
        { error: 'Art form type name is required' },
        { status: 400 }
      )
    }

    const result = await query(`
      INSERT INTO ArtFormTypes (art_form_type_name) VALUES (?)
    `, [art_form_type_name.trim()])

    return NextResponse.json({
      success: true,
      message: 'Art form type created successfully',
      artFormTypeId: (result as mysql.ResultSetHeader).insertId
    })
  } catch (error) {
    console.error('Error creating art form type:', error)
    return NextResponse.json(
      { error: 'Failed to create art form type' },
      { status: 500 }
    )
  }
}