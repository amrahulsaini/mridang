import { NextRequest, NextResponse } from 'next/server'
const { Cashfree } = require('cashfree-pg')

// Initialize Cashfree SDK
const cashfree = new Cashfree({
  mode: process.env.CASHFREE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', customerData } = await request.json()

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

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Create Cashfree order request
    const orderRequest = {
      order_id: orderId,
      order_amount: amount,
      order_currency: currency,
      customer_details: {
        customer_id: customerData.email.replace(/[^a-zA-Z0-9]/g, '_'),
        customer_email: customerData.email,
        customer_phone: customerData.phone.replace(/\D/g, '').slice(-10), // Last 10 digits only
        customer_name: customerData.name || 'Customer'
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cashfree-webhook`
      }
    }

    // Create order using Cashfree SDK v5
    const response = await cashfree.PGCreateOrder(
      '2023-08-01',
      orderRequest,
      process.env.CASHFREE_APP_ID!,
      process.env.CASHFREE_SECRET_KEY!
    )

    if (response && response.data) {
      return NextResponse.json({
        success: true,
        orderId: response.data.order_id,
        paymentSessionId: response.data.payment_session_id,
        amount: amount,
        currency: currency
      })
    } else {
      throw new Error('Failed to create Cashfree order')
    }

  } catch (error) {
    console.error('Error creating Cashfree order:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}