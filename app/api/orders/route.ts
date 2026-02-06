import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
}

// Type definitions
interface DatabaseOrderRow {
  id: number
  order_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  products: string
  subtotal: string
  shipping_cost: string
  total_amount: string
  status: string
  payment_status: string
  created_at: Date
  completed_at: Date | null
  bride_name: string | null
  groom_name: string | null
  engagement_date: Date | null
}

export async function GET(request: NextRequest) {
  let connection

  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    console.log('Fetching orders for email:', email)

    connection = await mysql.createConnection(dbConfig)

    // Fetch orders for the user
    const [rows] = await connection.execute(
      `SELECT
        id,
        order_id,
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        country,
        products,
        subtotal,
        shipping_cost,
        total_amount,
        status,
        payment_status,
        created_at,
        completed_at,
        bride_name,
        groom_name,
        engagement_date
      FROM checkout_orders
      WHERE email = ?
      ORDER BY created_at DESC`,
      [email]
    )

    const ordersData = rows as DatabaseOrderRow[]
    console.log(`Found ${ordersData.length} orders for ${email}`)

    // Format the response
    const orders = ordersData.map((order: DatabaseOrderRow) => ({
      id: order.id,
      orderId: order.order_id,
      customer: {
        firstName: order.first_name,
        lastName: order.last_name,
        email: order.email,
        phone: order.phone,
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        country: order.country,
      },
      products: JSON.parse(order.products || '[]'),
      pricing: {
        subtotal: parseFloat(order.subtotal),
        shippingCost: parseFloat(order.shipping_cost),
        totalAmount: parseFloat(order.total_amount),
      },
      customization: (order.bride_name || order.groom_name || order.engagement_date) ? {
        brideName: order.bride_name || undefined,
        groomName: order.groom_name || undefined,
        engagementDate: order.engagement_date || undefined,
      } : undefined,
      status: order.status,
      paymentStatus: order.payment_status,
      createdAt: order.created_at,
      completedAt: order.completed_at,
    }))

    return NextResponse.json({
      success: true,
      orders,
      total: orders.length
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}