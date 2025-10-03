import { NextRequest, NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Cashfree } = require('cashfree-pg')
import mysql from 'mysql2/promise'
import { sendOrderConfirmationEmail } from '@/lib/email'

// Set Cashfree environment
Cashfree.XClientId = process.env.CASHFREE_APP_ID!
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT === 'production' 
  ? Cashfree.Environment.PRODUCTION 
  : Cashfree.Environment.SANDBOX

// Type definitions
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface OrderData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  items: CartItem[]
}

interface PaymentVerificationRequest {
  cashfree_order_id: string
  orderData: OrderData
}

// Database connection

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
    console.log('Starting payment verification...')
    console.log('Database config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    })

    const body = await request.json()
    const {
      cashfree_order_id,
      orderData
    }: PaymentVerificationRequest = body

    console.log('Payment verification request received:', {
      cashfree_order_id
    })

    // Verify payment with Cashfree
    console.log('Verifying payment with Cashfree...')
    const orderResponse = await Cashfree.PGOrderFetchPayments('2023-08-01', cashfree_order_id)
    
    if (!orderResponse || !orderResponse.data || orderResponse.data.length === 0) {
      console.log('No payment found for order')
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 400 }
      )
    }

    const payment = orderResponse.data[0]
    
    // Check if payment is successful
    if (payment.payment_status !== 'SUCCESS') {
      console.log('Payment verification failed - payment status:', payment.payment_status)
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    console.log('Payment verified successfully')

    // Get the Cashfree payment ID
    const cashfree_payment_id = payment.cf_payment_id

    // Generate unique order ID
    const orderId = generateOrderId()
    console.log('Generated order ID:', orderId)

    // Connect to database
    console.log('Attempting database connection...')
    connection = await mysql.createConnection(dbConfig)
    console.log('Database connection established successfully')

    // Calculate totals
    const subtotal = orderData.items.reduce((sum: number, item: CartItem) =>
      sum + (item.price * item.quantity), 0
    )
    const shippingCost = subtotal > 1000 ? 0 : 100 // Free shipping over ₹1000
    const totalAmount = subtotal + shippingCost

    // Prepare products JSON
    const productsJson = JSON.stringify(orderData.items.map((item: CartItem) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    })))

    // Insert order into database
    await connection.execute(
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
        `Payment ID: ${cashfree_payment_id}, Order ID: ${cashfree_order_id}`
      ]
    )

    console.log('Order saved successfully:', {
      orderId,
      paymentId: cashfree_payment_id,
      amount: totalAmount
    })

    // Send order confirmation email
    const emailOrderData = {
      orderId,
      customer: {
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        state: orderData.state,
        pincode: orderData.pincode,
        country: orderData.country,
      },
      products: orderData.items,
      pricing: {
        subtotal,
        shippingCost,
        totalAmount,
      },
      createdAt: new Date().toISOString(),
    }

    // Send email asynchronously (don't wait for it to complete)
    sendOrderConfirmationEmail(emailOrderData).then((result) => {
      if (result.success) {
        console.log('Order confirmation email sent successfully')
      } else {
        console.error('Failed to send order confirmation email:', result.error)
      }
    }).catch((error) => {
      console.error('Error sending order confirmation email:', error)
    })

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order placed successfully!',
      paymentId: cashfree_payment_id
    })

  } catch (error) {
    console.error('Error saving order:', error)

    // Provide more specific error messages
    let errorMessage = 'Failed to save order'
    if (error instanceof Error) {
      if (error.message.includes('Access denied')) {
        errorMessage = 'Database access denied - check credentials'
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Database connection refused - check host and port'
      } else if (error.message.includes('ER_NO_SUCH_TABLE')) {
        errorMessage = 'Database table does not exist'
      } else {
        errorMessage = `Database error: ${error.message}`
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}