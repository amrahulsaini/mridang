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
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^(\+91|91)/, '')
    // For MSG91, let's try with country code in the mobile parameter
    const mobileWithCountry = '91' + cleanPhone

    console.log('Original phone:', phone)
    console.log('Clean phone:', cleanPhone)
    console.log('Mobile with country:', mobileWithCountry)

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = Date.now() + (10 * 60 * 1000) // 10 minutes

    // Store OTP (in production, use Redis or database)
    smsOtpStore.set(cleanPhone, { otp, expiresAt })

    // MSG91 API integration
    const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY
    const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID || 'MSGOTP' // Try MSGOTP as it's commonly approved
    const MSG91_ROUTE = process.env.MSG91_ROUTE || '4' // Route 4 is for transactional SMS

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
      // Use MSG91 Send SMS API for more control over message content
      const msg91Url = `https://api.msg91.com/api/sendhttp.php`

      // Prepare form data for MSG91
      const formData = new URLSearchParams()
      formData.append('authkey', MSG91_AUTH_KEY)
      formData.append('mobiles', mobileWithCountry) // Use phone with country code
      formData.append('message', `Your Mridang verification code is: ${otp}. Valid for 10 minutes.`)
      formData.append('sender', MSG91_SENDER_ID)
      formData.append('route', MSG91_ROUTE)
      formData.append('country', '91')

      console.log('MSG91 Request Details:')
      console.log('URL:', msg91Url)
      console.log('Phone:', mobileWithCountry)
      console.log('Sender:', MSG91_SENDER_ID)
      console.log('Route:', MSG91_ROUTE)
      console.log('OTP:', otp)

      const msg91Response = await fetch(msg91Url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      })

      const msg91Data = await msg91Response.text()
      console.log('MSG91 Response Status:', msg91Response.status)
      console.log('MSG91 Response:', msg91Data)

      // MSG91 send SMS response format: request_id or error message
      if (msg91Response.ok && msg91Data && !msg91Data.includes('error') && !msg91Data.includes('Error')) {
        return NextResponse.json({
          success: true,
          message: 'OTP sent successfully to your mobile number',
          requestId: msg91Data,
          expiresIn: '10 minutes'
        })
      } else {
        console.error('MSG91 API Error Response:', msg91Data)
        return NextResponse.json(
          { error: `Failed to send OTP: ${msg91Data || 'Unknown error'} (Status: ${msg91Response.status})` },
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