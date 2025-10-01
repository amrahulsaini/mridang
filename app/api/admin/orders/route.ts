import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'

// Define the order interface
interface OrderRow {
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
  products: string | unknown[] // Can be string from DB or parsed array
  subtotal: number
  shipping_cost: number
  total_amount: number
  email_verified: boolean
  phone_verified: boolean
  status: string
  payment_status: string
  created_at: string
  updated_at: string
  verified_at: string | null
  completed_at: string | null
  ip_address: string | null
  user_agent: string | null
  notes: string | null
}

// GET - Fetch all orders with details
export async function GET() {
  try {
    const orders = await query(`
      SELECT
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
        email_verified,
        phone_verified,
        status,
        payment_status,
        created_at,
        updated_at,
        verified_at,
        completed_at,
        ip_address,
        user_agent,
        notes
      FROM checkout_orders
      ORDER BY created_at DESC
    `)

    // Parse the JSON products field for each order
    const processedOrders = (orders as OrderRow[]).map((order: OrderRow) => ({
      ...order,
      products: typeof order.products === 'string' ? JSON.parse(order.products) : order.products
    }))

    return NextResponse.json(processedOrders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  try {
    const { orderId, status, paymentStatus, notes } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const updateFields = []
    const updateValues = []

    if (status) {
      updateFields.push('status = ?')
      updateValues.push(status)
    }

    if (paymentStatus) {
      updateFields.push('payment_status = ?')
      updateValues.push(paymentStatus)
    }

    if (notes !== undefined) {
      updateFields.push('notes = ?')
      updateValues.push(notes)
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    updateValues.push(orderId)

    await query(`
      UPDATE checkout_orders
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateValues)

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully'
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}