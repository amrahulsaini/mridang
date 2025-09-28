import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const keyFeatures = await query(`
      SELECT feature_id, feature_text
      FROM KeyFeatures
      ORDER BY feature_text
    `)

    return NextResponse.json(keyFeatures)
  } catch (error) {
    console.error('Error fetching key features:', error)
    return NextResponse.json(
      { error: 'Failed to fetch key features' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { feature_text } = await request.json()

    if (!feature_text?.trim()) {
      return NextResponse.json(
        { error: 'Feature text is required' },
        { status: 400 }
      )
    }

    const result = await query(`
      INSERT INTO KeyFeatures (feature_text) VALUES (?)
    `, [feature_text.trim()])

    return NextResponse.json({
      success: true,
      message: 'Key feature created successfully',
      featureId: (result as mysql.ResultSetHeader).insertId
    })
  } catch (error) {
    console.error('Error creating key feature:', error)
    return NextResponse.json(
      { error: 'Failed to create key feature' },
      { status: 500 }
    )
  }
}