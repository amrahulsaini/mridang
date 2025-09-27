import { NextRequest, NextResponse } from 'next/server'

// Store SMS OTPs temporarily (in production, use Redis or database)
const smsOtpStore = new Map<string, { otp: string; expiresAt: number }>()

// Generate 4-digit OTP
const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Validate phone number (basic validation for Indian numbers)
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      )
    }

    // Clean phone number (remove +91 prefix if present, ensure it starts with country code)
    let cleanPhone = phone.replace(/\s+/g, '').replace(/^(\+91|91)/, '')
    if (!cleanPhone.startsWith('91')) {
      cleanPhone = '91' + cleanPhone
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = Date.now() + (10 * 60 * 1000) // 10 minutes

    // Store OTP (in production, use Redis or database)
    smsOtpStore.set(cleanPhone, { otp, expiresAt })

    // MSG91 API integration
    const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY
    const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID || 'MRIDNG'
    const MSG91_ROUTE = process.env.MSG91_ROUTE || '4'

    if (!MSG91_AUTH_KEY) {
      console.warn('MSG91_AUTH_KEY not configured, using mock SMS sending')
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully (mock mode)',
        otp: otp, // Only in development
        expiresIn: '10 minutes'
      })
    }

    try {
      // MSG91 API call
      const msg91Response = await fetch(`https://api.msg91.com/api/v5/otp?authkey=${MSG91_AUTH_KEY}&template_id=&mobile=${cleanPhone}&otp=${otp}&sender=${MSG91_SENDER_ID}&route=${MSG91_ROUTE}&country=91`, {
        method: 'GET', // MSG91 uses GET for OTP sending
      })

      const msg91Data = await msg91Response.json()

      if (msg91Response.ok && msg91Data.type === 'success') {
        return NextResponse.json({
          success: true,
          message: 'OTP sent successfully to your mobile number',
          expiresIn: '10 minutes'
        })
      } else {
        console.error('MSG91 API Error:', msg91Data)
        return NextResponse.json(
          { error: 'Failed to send OTP. Please try again.' },
          { status: 500 }
        )
      }
    } catch (apiError) {
      console.error('MSG91 API call failed:', apiError)
      return NextResponse.json(
        { error: 'SMS service temporarily unavailable. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in send-sms-otp:', error)
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}