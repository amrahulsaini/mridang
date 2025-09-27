import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { otpStore } from '../../../lib/otp-store'

// Email template for OTP
const createOTPEmailTemplate = (otp: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification - Mridang</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #8B4513;
            margin-bottom: 10px;
        }
        .otp-container {
            background-color: #f8f9fa;
            border: 2px dashed #8B4513;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #8B4513;
            letter-spacing: 5px;
            font-family: 'Courier New', monospace;
        }
        .message {
            margin: 20px 0;
            text-align: center;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .contact {
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">MRIDANG</div>
            <h2>Email Verification</h2>
        </div>

        <div class="message">
            <p>Hello,</p>
            <p>Thank you for choosing Mridang! To complete your verification, please use the following One-Time Password (OTP):</p>
        </div>

        <div class="otp-container">
            <div class="otp-code">${otp}</div>
        </div>

        <div class="warning">
            <strong>Important:</strong> This OTP will expire in 10 minutes. Please do not share this code with anyone.
        </div>

        <div class="message">
            <p>If you didn't request this verification, please ignore this email.</p>
            <p>Best regards,<br>The Mridang Team</p>
        </div>

        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <div class="contact">
                <p>Need help? Contact us at support@mridang.co.in</p>
                <p>&copy; 2025 Mridang. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
`

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'mail.mridang.co.in',
    port: 587, // or 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Additional options for some email providers
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    }
  })
}

// Generate 4-digit OTP
const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = Date.now() + (10 * 60 * 1000) // 10 minutes

    // Store OTP (in production, use Redis or database)
    otpStore.set(email, { otp, expiresAt })

    console.log(`OTP stored for ${email}: ${otp} (expires: ${new Date(expiresAt).toISOString()})`)

    // Create email content
    const htmlContent = createOTPEmailTemplate(otp)

    // Create transporter
    const transporter = createTransporter()

    // Email options
    const mailOptions = {
      from: `"Mridang" <verify@mridang.co.in>`,
      to: email,
      subject: 'Your OTP for Email Verification - Mridang',
      html: htmlContent,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: '10 minutes'
    })

  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    )
  }
}