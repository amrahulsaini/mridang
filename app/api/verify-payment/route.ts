import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import mysql from 'mysql2/promise'

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
}

function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ORD-${date}-${random}`
}

export async function POST(request: NextRequest) {
  let connection

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = await request.json()

    // Verify payment signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex')

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Generate unique order ID
    const orderId = generateOrderId()

    // Connect to database
    connection = await mysql.createConnection(dbConfig)

    // Calculate totals
    const subtotal = orderData.items.reduce((sum: number, item: any) =>
      sum + (item.price * item.quantity), 0
    )
    const shippingCost = subtotal > 1000 ? 0 : 100 // Free shipping over ₹1000
    const totalAmount = subtotal + shippingCost

    // Prepare products JSON
    const productsJson = JSON.stringify(orderData.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    })))

    // Insert order into database
    const [result] = await connection.execute(
      `INSERT INTO checkout_orders (
        order_id, first_name, last_name, email, phone,
        address, city, state, pincode, country,
        products, subtotal, shipping_cost, total_amount,
        email_verified, payment_status, status,
        ip_address, user_agent, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        orderData.firstName,
        orderData.lastName,
        orderData.email,
        orderData.phone,
        orderData.address,
        orderData.city,
        orderData.state,
        orderData.pincode,
        orderData.country,
        productsJson,
        subtotal,
        shippingCost,
        totalAmount,
        true, // email_verified
        'paid', // payment_status
        'completed', // status
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        request.headers.get('user-agent') || 'unknown',
        `Payment ID: ${razorpay_payment_id}, Order ID: ${razorpay_order_id}`
      ]
    )

    console.log('Order saved successfully:', {
      orderId,
      paymentId: razorpay_payment_id,
      amount: totalAmount
    })

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order placed successfully!',
      paymentId: razorpay_payment_id
    })

  } catch (error) {
    console.error('Error saving order:', error)
    return NextResponse.json(
      { error: 'Failed to save order' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}