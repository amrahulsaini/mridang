import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'

interface SampleProductRow {
  description: string | null
  other_features: string | null
  custom_key_features: string | null
  weight_g: number | null
  width_inch: number | null
  height_inch: number | null
  depth_inch: number | null
  diameter_inch: number | null
  other_dimensions: string | null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryIdRaw = searchParams.get('category_id')

    if (!categoryIdRaw) {
      return NextResponse.json(
        { error: 'category_id is required' },
        { status: 400 }
      )
    }

    const categoryId = Number.parseInt(categoryIdRaw, 10)
    if (Number.isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'category_id must be a number' },
        { status: 400 }
      )
    }

    // Grab the newest product in this category to use as a template.
    // We only return the fields that the admin "new product" page auto-fills.
    console.log('🔍 Fetching sample product for category_id:', categoryId);
    
    const rows = await query(
      `
      SELECT
        description,
        other_features,
        custom_key_features,
        weight_g,
        width_inch,
        height_inch,
        depth_inch,
        diameter_inch,
        other_dimensions
      FROM Products
      WHERE category_id = ?
      ORDER BY id DESC
      LIMIT 1
      `,
      [categoryId]
    )

    console.log('📊 Query returned rows:', Array.isArray(rows) ? rows.length : 0);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.log('⚠️ No products found for category_id:', categoryId);
      return NextResponse.json(null)
    }

    const [sample] = rows as SampleProductRow[]
    console.log('✅ Sample product:', {
      has_description: !!sample.description,
      has_other_features: !!sample.other_features,
      has_custom_key_features: !!sample.custom_key_features,
      custom_key_features_length: sample.custom_key_features?.length || 0,
      custom_key_features_preview: sample.custom_key_features?.substring(0, 50)
    });
    
    return NextResponse.json(sample)
  } catch (error) {
    console.error('Error fetching sample product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sample product' },
      { status: 500 }
    )
  }
}
