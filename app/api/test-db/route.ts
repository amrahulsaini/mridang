import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
}

export async function GET() {
  let connection

  try {
    console.log('Testing database connection...')
    console.log('Config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    })

    connection = await mysql.createConnection(dbConfig)

    // Test query
    const [rows] = await connection.execute('SELECT 1 as test')
    console.log('Database connection test successful:', rows)

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      }
    })

  } catch (error) {
    console.error('Database connection test failed:', error)

    let errorMessage = 'Database connection failed'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        config: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          database: process.env.DB_NAME,
          port: process.env.DB_PORT
        }
      },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}