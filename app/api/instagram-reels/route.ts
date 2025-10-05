import { NextResponse } from 'next/server';
import pool from '@/app/lib/database';

export async function GET() {
  try {
    const [rows] = await pool.execute(
      'SELECT id, embed_code FROM instagram_reels WHERE is_active = 1 ORDER BY display_order ASC'
    );

    return NextResponse.json({ reels: rows });
  } catch (error) {
    console.error('Error fetching Instagram reels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram reels' },
      { status: 500 }
    );
  }
}
