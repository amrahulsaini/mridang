import { NextRequest, NextResponse } from 'next/server'

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

    // Create Cashfree order using REST API directly
    const orderRequest = {
      order_id: orderId,
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

    if (cashfreeResponse.ok && cashfreeData) {
      return NextResponse.json({
        success: true,
        orderId: cashfreeData.order_id,
        paymentSessionId: cashfreeData.payment_session_id,
        amount: amount,
        currency: currency
      })
    } else {
      throw new Error(cashfreeData.message || 'Failed to create Cashfree order')
    }

  } catch (error) {
    console.error('Error creating Cashfree order:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}