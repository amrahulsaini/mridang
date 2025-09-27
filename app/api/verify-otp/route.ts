import { NextRequest, NextResponse } from 'next/server'
import { otpStore } from '../../../lib/otp-store'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Get stored OTP data
    const storedData = otpStore.get(email)

    console.log(`Verifying OTP for ${email}:`, {
      providedOtp: otp,
      hasStoredData: !!storedData,
      storedData: storedData ? {
        otp: storedData.otp,
        expiresAt: new Date(storedData.expiresAt).toISOString(),
        isExpired: Date.now() > storedData.expiresAt
      } : null
    })

    if (!storedData) {
      return NextResponse.json(
        { error: 'OTP not found. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email) // Clean up expired OTP
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
    otpStore.delete(email)

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      verified: true
    })

  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    )
  }
}