import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'

// Type definitions
interface CartItem {
  id: string
  seller_sku_id?: string
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

    // Verify payment with Cashfree using REST API
    console.log('Verifying payment with Cashfree...')
    
    // Determine API endpoint based on environment
    const apiEndpoint = process.env.CASHFREE_ENVIRONMENT === 'production'
      ? `https://api.cashfree.com/pg/orders/${cashfree_order_id}/payments`
      : `https://sandbox.cashfree.com/pg/orders/${cashfree_order_id}/payments`

    const orderResponse = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!
      }
    })

    const paymentData = await orderResponse.json()
    
    if (!paymentData || !Array.isArray(paymentData) || paymentData.length === 0) {
      console.log('No payment found for order')
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 400 }
      )
    }

    const payment = paymentData[0]
    
    // Check if payment is successful
    if (payment.payment_status !== 'SUCCESS') {
      console.log('Payment verification failed - payment status:', payment.payment_status)
      
      // Update order status to failed if it exists
      try {
        connection = await mysql.createConnection(dbConfig)
        await connection.execute(
          `UPDATE checkout_orders 
           SET payment_status = ?, status = ?, notes = ?, updated_at = NOW()
           WHERE cashfree_order_id = ?`,
          [payment.payment_status.toLowerCase(), 'failed', `Payment failed with status: ${payment.payment_status}`, cashfree_order_id]
        )
        console.log('Updated order status to failed')
      } catch (dbError) {
        console.error('Error updating order status:', dbError)
      } finally {
        if (connection) {
          await connection.end()
          connection = undefined
        }
      }
      
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    console.log('Payment verified successfully')

    // Get the Cashfree payment ID
    const cashfree_payment_id = payment.cf_payment_id

    // Connect to database
    console.log('Attempting database connection...')
    connection = await mysql.createConnection(dbConfig)
    console.log('Database connection established successfully')

    // Check if order already exists with this cashfree_order_id
    const [existingOrders] = await connection.execute(
      'SELECT id, order_id FROM checkout_orders WHERE cashfree_order_id = ?',
      [cashfree_order_id]
    )
    
    const existingOrderRows = existingOrders as any[]
    let orderId: string

    if (existingOrderRows.length > 0) {
      // Update existing order
      orderId = existingOrderRows[0].order_id
      console.log('Updating existing order:', orderId)
      
      await connection.execute(
        `UPDATE checkout_orders 
         SET payment_status = ?, status = ?, notes = ?, updated_at = NOW(), completed_at = NOW()
         WHERE cashfree_order_id = ?`,
        ['paid', 'completed', `Payment ID: ${cashfree_payment_id}, Order ID: ${cashfree_order_id}`, cashfree_order_id]
      )
      
      console.log('Order updated successfully:', orderId)
    } else {
      // Create new order (fallback for old flow)
      orderId = generateOrderId()
      console.log('Generated order ID:', orderId)

      // Calculate totals
      const subtotal = orderData.items.reduce((sum: number, item: CartItem) =>
        sum + (item.price * item.quantity), 0
      )
      const shippingCost = 0 // Free shipping on all orders
      const totalAmount = subtotal + shippingCost

      // Prepare products JSON
      const productsJson = JSON.stringify(orderData.items.map((item: CartItem) => ({
        id: item.id,
        seller_sku_id: item.seller_sku_id,
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
          ip_address, user_agent, notes, cashfree_order_id, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
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
          `Payment ID: ${cashfree_payment_id}, Order ID: ${cashfree_order_id}`,
          cashfree_order_id
        ]
      )

      console.log('Order saved successfully:', {
        orderId,
        paymentId: cashfree_payment_id,
        amount: totalAmount
      })
    }

    // Calculate totals for email (need to recalculate for existing orders)
    const subtotal = orderData.items.reduce((sum: number, item: CartItem) =>
      sum + (item.price * item.quantity), 0
    )
    const shippingCost = 0
    const totalAmount = subtotal + shippingCost

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

    // Send customer confirmation email asynchronously (don't wait for it to complete)
    sendOrderConfirmationEmail(emailOrderData).then((result) => {
      if (result.success) {
        console.log('Order confirmation email sent successfully')
      } else {
        console.error('Failed to send order confirmation email:', result.error)
      }
    }).catch((error) => {
      console.error('Error sending order confirmation email:', error)
    })

    // Send admin notification email asynchronously
    sendAdminOrderNotification(emailOrderData).then((result) => {
      if (result.success) {
        console.log('Admin notification email sent successfully')
      } else {
        console.error('Failed to send admin notification email:', result.error)
      }
    }).catch((error) => {
      console.error('Error sending admin notification email:', error)
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