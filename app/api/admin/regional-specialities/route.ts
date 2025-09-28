import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const regionalSpecialities = await query(`
      SELECT regional_speciality_id, regional_speciality_name
      FROM RegionalSpecialities
      ORDER BY regional_speciality_name
    `)

    return NextResponse.json(regionalSpecialities)
  } catch (error) {
    console.error('Error fetching regional specialities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch regional specialities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { regional_speciality_name } = await request.json()

    if (!regional_speciality_name?.trim()) {
      return NextResponse.json(
        { error: 'Regional speciality name is required' },
        { status: 400 }
      )
    }

    const result = await query(`
      INSERT INTO RegionalSpecialities (regional_speciality_name)
      VALUES (?)
    `, [regional_speciality_name.trim()])

    return NextResponse.json({
      success: true,
      message: 'Regional speciality created successfully',
      specialityId: (result as mysql.ResultSetHeader).insertId
    })
  } catch (error) {
    console.error('Error creating regional speciality:', error)
    return NextResponse.json(
      { error: 'Failed to create regional speciality' },
      { status: 500 }
    )
  }
}