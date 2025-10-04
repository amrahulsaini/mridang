import nodemailer from 'nodemailer'
import { generateInvoicePDF } from './invoice-pdf'

// Email configuration for order confirmations
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '9848f9001@smtp-brevo.com',
    pass: process.env.SMTP_PASS || 'WOsm8zLwJfaSFPXb',
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  },
}

// Create transporter
const transporter = nodemailer.createTransport(emailConfig)

interface OrderData {
  orderId: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  products: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  pricing: {
    subtotal: number
    shippingCost: number
    totalAmount: number
  }
  createdAt: string
}

export async function sendOrderConfirmationEmail(orderData: OrderData) {
  try {
    console.log('Sending order confirmation email to:', orderData.customer.email)

    // Generate PDF invoice
    console.log('Generating PDF invoice...')
    const pdfBuffer = await generateInvoicePDF({
      orderId: orderData.orderId,
      orderDate: orderData.createdAt,
      customer: orderData.customer,
      products: orderData.products,
      pricing: orderData.pricing
    })
    console.log('PDF invoice generated successfully')

    const productsHtml = orderData.products.map(product => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${product.name}</strong>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${product.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ₹${product.price.toLocaleString()}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ₹${(product.price * product.quantity).toLocaleString()}
        </td>
      </tr>
    `).join('')

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - Mridang</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b4513, #d2691e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
          .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .total { font-size: 18px; font-weight: bold; color: #8b4513; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #8b4513; color: white; padding: 12px; text-align: left; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Order Confirmed!</h1>
            <p>Thank you for shopping with Mridang</p>
          </div>

          <div class="content">
            <h2>Order Details</h2>
            <div class="order-details">
              <p><strong>Order ID:</strong> ${orderData.orderId}</p>
              <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p><strong>Customer:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
              <p><strong>Email:</strong> ${orderData.customer.email}</p>
              <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
            </div>

            <h3>Items Ordered</h3>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th class="text-center">Qty</th>
                  <th class="text-right">Price</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${productsHtml}
              </tbody>
            </table>

            <div style="text-align: right; margin-top: 20px;">
              <p><strong>Subtotal:</strong> ₹${orderData.pricing.subtotal.toLocaleString()}</p>
              <p><strong>Shipping:</strong> ₹${orderData.pricing.shippingCost.toLocaleString()}</p>
              <p class="total"><strong>Total: ₹${orderData.pricing.totalAmount.toLocaleString()}</strong></p>
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #856404;">📍 Delivery Address</h4>
              <p style="margin: 0; color: #856404;">
                ${orderData.customer.address}<br>
                ${orderData.customer.city}, ${orderData.customer.state} ${orderData.customer.pincode}<br>
                ${orderData.customer.country}
              </p>
            </div>

            <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #0c5460;">🚚 What's Next?</h4>
              <ul style="margin: 0; padding-left: 20px; color: #0c5460;">
                <li>Our team will contact you within 24 hours to arrange delivery</li>
                <li>You will receive tracking information once your order ships</li>
                <li>For any questions, contact us at support@mridang.co.in</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for choosing Mridang - Your trusted musical instrument partner</p>
            <p>Visit us at <a href="https://mridang.co.in">mridang.co.in</a></p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `"Mridang Orders" <orders@mridang.co.in>`,
      to: orderData.customer.email,
      subject: `Order Confirmation - ${orderData.orderId} - Mridang`,
      html: emailHtml,
      attachments: [
        {
          filename: `Invoice-${orderData.orderId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Order confirmation email sent successfully:', info.messageId)

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}