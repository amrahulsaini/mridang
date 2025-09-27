import { NextRequest, NextResponse } from 'next/server'

// This should be the same store as in send-sms-otp route
// In production, use a shared store like Redis
const smsOtpStore = new Map<string, { otp: string; expiresAt: number }>()

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json()

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      )
    }

    // Clean phone number (same logic as in send-sms-otp)
    let cleanPhone = phone.replace(/\s+/g, '').replace(/^(\+91|91)/, '')
    if (!cleanPhone.startsWith('91')) {
      cleanPhone = '91' + cleanPhone
    }

    // Get stored OTP data
    const storedData = smsOtpStore.get(cleanPhone)

    if (!storedData) {
      return NextResponse.json(
        { error: 'OTP not found. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expiresAt) {
      smsOtpStore.delete(cleanPhone) // Clean up expired OTP
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      )
    }

    // OTP is valid, remove it from store (one-time use)
    smsOtpStore.delete(cleanPhone)

    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully',
      verified: true
    })

  } catch (error) {
    console.error('Error verifying SMS OTP:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    )
  }
}