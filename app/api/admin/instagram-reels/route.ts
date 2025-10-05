import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/database';

export async function POST(request: NextRequest) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin password not configured' },
        { status: 500 }
      );
    }

    const { password, reels } = await request.json();

    // Verify admin password
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    if (!Array.isArray(reels)) {
      return NextResponse.json(
        { error: 'Invalid reels data' },
        { status: 400 }
      );
    }

    // Start transaction
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Delete existing reels
      await connection.execute('DELETE FROM instagram_reels');

      // Insert new reels
      for (let i = 0; i < reels.length; i++) {
        const reel = reels[i];
        await connection.execute(
          'INSERT INTO instagram_reels (embed_code, display_order, is_active) VALUES (?, ?, ?)',
          [reel.embed_code, i + 1, 1]
        );
      }

      await connection.commit();

      return NextResponse.json({ success: true, message: 'Instagram reels updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating Instagram reels:', error);
    return NextResponse.json(
      { error: 'Failed to update Instagram reels' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [rows] = await pool.execute(
      'SELECT id, embed_code, display_order FROM instagram_reels ORDER BY display_order ASC'
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
