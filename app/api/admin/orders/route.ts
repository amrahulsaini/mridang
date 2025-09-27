import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/app/lib/database'

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

    return NextResponse.json(orders)
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