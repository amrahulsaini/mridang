import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const searchKeywords = await query(`
      SELECT keyword_id, keyword_text
      FROM SearchKeywords
      ORDER BY keyword_text
    `)

    return NextResponse.json(searchKeywords)
  } catch (error) {
    console.error('Error fetching search keywords:', error)
    return NextResponse.json(
      { error: 'Failed to fetch search keywords' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { keyword_text } = await request.json()

    if (!keyword_text?.trim()) {
      return NextResponse.json(
        { error: 'Keyword text is required' },
        { status: 400 }
      )
    }

    const result = await query(`
      INSERT INTO SearchKeywords (keyword_text) VALUES (?)
    `, [keyword_text.trim()])

    return NextResponse.json({
      success: true,
      message: 'Search keyword created successfully',
      keywordId: (result as mysql.ResultSetHeader).insertId
    })
  } catch (error) {
    console.error('Error creating search keyword:', error)
    return NextResponse.json(
      { error: 'Failed to create search keyword' },
      { status: 500 }
    )
  }
}