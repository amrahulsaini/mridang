import nodemailer from 'nodemailer'
// import { generateInvoicePDF } from './invoice-pdf' // Disabled due to Next.js 15 Turbopack compatibility issues

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

// Mail options interface
interface MailOptions {
  from: string
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType: string
  }>
}

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

    // PDF generation temporarily disabled due to Next.js 15 Turbopack compatibility issues
    // let pdfBuffer: Buffer | null = null
    // try {
    //   console.log('Generating PDF invoice...')
    //   pdfBuffer = await generateInvoicePDF({
    //     orderId: orderData.orderId,
    //     orderDate: orderData.createdAt,
    //     customer: orderData.customer,
    //     products: orderData.products,
    //     pricing: orderData.pricing
    //   })
    //   console.log('PDF invoice generated successfully')
    // } catch (pdfError) {
    //   console.error('Failed to generate PDF invoice:', pdfError)
    //   console.log('Continuing to send email without PDF attachment...')
    //   // Continue without PDF - don't fail the whole email
    // }

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

    // Build mail options
    const mailOptions: MailOptions = {
      from: `"Mridang Orders" <orders@mridang.co.in>`,
      to: orderData.customer.email,
      subject: `Order Confirmation - ${orderData.orderId} - Mridang`,
      html: emailHtml,
    }

    // PDF attachment temporarily disabled due to Next.js 15 Turbopack compatibility issues
    // if (pdfBuffer) {
    //   mailOptions.attachments = [
    //     {
    //       filename: `Invoice-${orderData.orderId}.pdf`,
    //       content: pdfBuffer,
    //       contentType: 'application/pdf'
    //     }
    //   ]
    //   console.log('PDF invoice will be attached to email')
    // } else {
    //   console.log('No PDF attachment - sending email only')
    // }
    console.log('Sending email without PDF attachment (PDF generation disabled)')

    const info = await transporter.sendMail(mailOptions)
    console.log('Order confirmation email sent successfully:', info.messageId)

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Send admin notification email when new order is placed
export async function sendAdminOrderNotification(orderData: OrderData) {
  try {
    console.log('Sending admin notification for order:', orderData.orderId)

    const productsHtml = orderData.products.map((product, index) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px;">${index + 1}</td>
        <td style="padding: 10px;">
          <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 10px;">
          <strong>${product.name}</strong>
        </td>
        <td style="padding: 10px; text-align: center;">${product.quantity}</td>
        <td style="padding: 10px; text-align: right;">₹${product.price.toLocaleString('en-IN')}</td>
        <td style="padding: 10px; text-align: right;"><strong>₹${(product.price * product.quantity).toLocaleString('en-IN')}</strong></td>
      </tr>
    `).join('')

    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Order Notification - ${orderData.orderId}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
          .container { max-width: 700px; margin: 20px auto; background: white; }
          .header { background: linear-gradient(135deg, #2c3e50, #34495e); color: white; padding: 25px; text-align: center; }
          .alert { background: #27ae60; color: white; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; }
          .content { padding: 30px; }
          .section { margin: 25px 0; padding: 20px; background: #f8f9fa; border-left: 4px solid #8b4513; }
          .section-title { font-size: 16px; font-weight: bold; color: #8b4513; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #34495e; color: white; padding: 12px; text-align: left; }
          .total-row { background: #fff3cd; font-weight: bold; font-size: 16px; }
          .customer-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info-item { padding: 10px; background: white; border: 1px solid #ddd; border-radius: 4px; }
          .info-label { font-size: 12px; color: #666; margin-bottom: 5px; }
          .info-value { font-size: 14px; font-weight: bold; color: #333; }
          .action-required { background: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #ecf0f1; padding: 20px; text-align: center; color: #7f8c8d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 NEW ORDER RECEIVED</h1>
            <p style="margin: 5px 0;">Mridang.co.in</p>
          </div>

          <div class="alert">
            🎉 Order #${orderData.orderId} - ₹${orderData.pricing.totalAmount.toLocaleString('en-IN')}
          </div>

          <div class="content">
            <div class="section">
              <div class="section-title">📋 ORDER DETAILS</div>
              <p><strong>Order ID:</strong> ${orderData.orderId}</p>
              <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</p>
              <p><strong>Payment Status:</strong> <span style="color: #27ae60; font-weight: bold;">✓ PAID</span></p>
            </div>

            <div class="section">
              <div class="section-title">👤 CUSTOMER INFORMATION</div>
              <div class="customer-info">
                <div class="info-item">
                  <div class="info-label">Name</div>
                  <div class="info-value">${orderData.customer.firstName} ${orderData.customer.lastName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${orderData.customer.email}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone</div>
                  <div class="info-value">${orderData.customer.phone}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">City, State</div>
                  <div class="info-value">${orderData.customer.city}, ${orderData.customer.state}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">📍 SHIPPING ADDRESS</div>
              <p style="margin: 0; line-height: 1.8;">
                ${orderData.customer.address}<br>
                ${orderData.customer.city}, ${orderData.customer.state} - ${orderData.customer.pincode}<br>
                ${orderData.customer.country}
              </p>
            </div>

            <div class="section">
              <div class="section-title">🛒 PRODUCTS ORDERED</div>
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px;">#</th>
                    <th>Product</th>
                    <th style="width: 80px; text-align: center;">Qty</th>
                    <th style="width: 100px; text-align: right;">Price</th>
                    <th style="width: 100px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsHtml}
                </tbody>
                <tfoot>
                  <tr style="border-top: 2px solid #333;">
                    <td colspan="4" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                    <td style="padding: 10px; text-align: right;"><strong>₹${orderData.pricing.subtotal.toLocaleString('en-IN')}</strong></td>
                  </tr>
                  <tr>
                    <td colspan="4" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                    <td style="padding: 10px; text-align: right;"><strong>${orderData.pricing.shippingCost === 0 ? 'FREE' : '₹' + orderData.pricing.shippingCost.toLocaleString('en-IN')}</strong></td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="4" style="padding: 15px; text-align: right; font-size: 18px;">TOTAL AMOUNT:</td>
                    <td style="padding: 15px; text-align: right; font-size: 18px; color: #27ae60;">₹${orderData.pricing.totalAmount.toLocaleString('en-IN')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="action-required">
              <h3 style="margin: 0 0 10px 0; color: #856404;">⚡ ACTION REQUIRED</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #856404;">
                <li><strong>Contact customer within 24 hours</strong> to confirm order</li>
                <li>Arrange delivery/shipping for the products</li>
                <li>Update order status in admin panel</li>
                <li>Send tracking information to customer</li>
              </ul>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: #e3f2fd; border-radius: 4px;">
              <p style="margin: 0; color: #1976d2;">
                <strong>📊 View Full Details:</strong> Login to admin panel at 
                <a href="https://mridang.co.in/adminorders" style="color: #1976d2;">mridang.co.in/adminorders</a>
              </p>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 5px 0;">This is an automated notification from Mridang.co.in</p>
            <p style="margin: 5px 0;">Do not reply to this email</p>
          </div>
        </div>
      </body>
      </html>
    `

    const adminMailOptions: MailOptions = {
      from: `"Mridang Orders" <orders@mridang.co.in>`,
      to: 'riddhiventuresjaipur@gmail.com, ammrahulsaini@gmail.com',
      subject: `🔔 New Order ${orderData.orderId} - ₹${orderData.pricing.totalAmount.toLocaleString('en-IN')}`,
      html: adminEmailHtml,
    }

    const info = await transporter.sendMail(adminMailOptions)
    console.log('Admin notification email sent successfully:', info.messageId)

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send admin notification email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}