import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

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
  brideName?: string
  groomName?: string
  engagementDate?: string
}

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
    const { amount, currency = 'INR', customerData, orderData, items, subtotal, shippingCost }: {
      amount: number
      currency?: string
      customerData: { name: string; email: string; phone: string }
      orderData?: OrderData
      items?: CartItem[]
      subtotal?: number
      shippingCost?: number
    } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    if (!customerData || !customerData.email || !customerData.phone) {
      return NextResponse.json(
        { error: 'Customer email and phone are required' },
        { status: 400 }
      )
    }

    // Generate unique cashfree order ID
    const cashfreeOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    // Generate our internal order ID
    const internalOrderId = generateOrderId()

    // Create Cashfree order using REST API directly
    const orderRequest = {
      order_id: cashfreeOrderId,
      order_amount: amount,
      order_currency: currency,
      customer_details: {
        customer_id: customerData.email.replace(/[^a-zA-Z0-9]/g, '_'),
        customer_email: customerData.email,
        customer_phone: customerData.phone.replace(/\D/g, '').slice(-10),
        customer_name: customerData.name || 'Customer'
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`
      }
    }

    // Determine API endpoint based on environment
    const apiEndpoint = process.env.CASHFREE_ENVIRONMENT === 'production'
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders'

    // Make direct API call to Cashfree
    const cashfreeResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!
      },
      body: JSON.stringify(orderRequest)
    })

    const cashfreeData = await cashfreeResponse.json()

    if (!cashfreeResponse.ok || !cashfreeData) {
      throw new Error(cashfreeData.message || 'Failed to create Cashfree order')
    }

    // If order data is provided, create pending order in database
    if (orderData && items) {
      try {
        connection = await mysql.createConnection(dbConfig)
        
        const productsJson = JSON.stringify(items)
        
        await connection.execute(
          `INSERT INTO checkout_orders (
            order_id, first_name, last_name, email, phone,
            address, city, state, pincode, country,
            products, subtotal, shipping_cost, total_amount,
            email_verified, payment_status, status,
            cashfree_order_id, created_at,
            bride_name, groom_name, engagement_date
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)`,
          [
            internalOrderId,
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
            subtotal || 0,
            shippingCost || 0,
            amount,
            true, // email_verified (assuming verified before checkout)
            'pending', // payment_status
            'pending', // status
            cashfreeOrderId, // Store cashfree order ID for later verification
            orderData.brideName || null,
            orderData.groomName || null,
            orderData.engagementDate || null
          ]
        )
        
        console.log('Pending order created in database:', internalOrderId)
      } catch (dbError) {
        console.error('Error creating pending order in database:', dbError)
        // Continue even if database insert fails - we'll handle it in verify-payment
      } finally {
        if (connection) {
          await connection.end()
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderId: cashfreeData.order_id,
      internalOrderId: internalOrderId,
      paymentSessionId: cashfreeData.payment_session_id,
      amount: amount,
      currency: currency
    })

  } catch (error) {
    console.error('Error creating Cashfree order:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}