import PDFDocument from 'pdfkit'
import { Readable } from 'stream'

interface InvoiceData {
  orderId: string
  orderDate: string
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
  }>
  pricing: {
    subtotal: number
    shippingCost: number
    totalAmount: number
  }
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margin: 50,
        bufferPages: true
      })

      const buffers: Buffer[] = []

      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers)
        resolve(pdfBuffer)
      })
      doc.on('error', reject)

      // Header - Company Info
      doc
        .fillColor('#8b4513')
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('MRIDANG', 50, 50)

      doc
        .fontSize(10)
        .fillColor('#666')
        .font('Helvetica')
        .text('Traditional Musical Instruments', 50, 85)
        .text('orders@mridang.co.in', 50, 98)
        .text('https://mridang.co.in', 50, 111)

      // Invoice Title
      doc
        .fontSize(24)
        .fillColor('#000')
        .font('Helvetica-Bold')
        .text('TAX INVOICE', 400, 50, { align: 'right' })

      // Invoice Details Box
      doc
        .fontSize(10)
        .fillColor('#666')
        .font('Helvetica')
        .text(`Invoice No: ${invoiceData.orderId}`, 400, 85, { align: 'right' })
        .text(`Date: ${new Date(invoiceData.orderDate).toLocaleDateString('en-IN')}`, 400, 98, { align: 'right' })

      // Line separator
      doc
        .strokeColor('#8b4513')
        .lineWidth(2)
        .moveTo(50, 140)
        .lineTo(545, 140)
        .stroke()

      // Billing Details Section
      doc
        .fontSize(12)
        .fillColor('#8b4513')
        .font('Helvetica-Bold')
        .text('BILL TO:', 50, 160)

      doc
        .fontSize(10)
        .fillColor('#000')
        .font('Helvetica')
        .text(`${invoiceData.customer.firstName} ${invoiceData.customer.lastName}`, 50, 180)
        .text(invoiceData.customer.address, 50, 195)
        .text(`${invoiceData.customer.city}, ${invoiceData.customer.state} - ${invoiceData.customer.pincode}`, 50, 210)
        .text(`${invoiceData.customer.country}`, 50, 225)
        .text(`Phone: ${invoiceData.customer.phone}`, 50, 240)
        .text(`Email: ${invoiceData.customer.email}`, 50, 255)

      // Shipping Details (same as billing for now)
      doc
        .fontSize(12)
        .fillColor('#8b4513')
        .font('Helvetica-Bold')
        .text('SHIP TO:', 320, 160)

      doc
        .fontSize(10)
        .fillColor('#000')
        .font('Helvetica')
        .text(`${invoiceData.customer.firstName} ${invoiceData.customer.lastName}`, 320, 180)
        .text(invoiceData.customer.address, 320, 195)
        .text(`${invoiceData.customer.city}, ${invoiceData.customer.state} - ${invoiceData.customer.pincode}`, 320, 210)
        .text(`${invoiceData.customer.country}`, 320, 225)

      // Products Table
      const tableTop = 300
      const itemCodeX = 50
      const descriptionX = 120
      const quantityX = 320
      const priceX = 380
      const amountX = 480

      // Table Header
      doc
        .fontSize(10)
        .fillColor('#fff')
        .font('Helvetica-Bold')

      doc
        .rect(50, tableTop, 495, 25)
        .fillAndStroke('#8b4513', '#8b4513')

      doc
        .fillColor('#fff')
        .text('S.No', itemCodeX, tableTop + 8)
        .text('DESCRIPTION', descriptionX, tableTop + 8)
        .text('QTY', quantityX, tableTop + 8)
        .text('PRICE', priceX, tableTop + 8)
        .text('AMOUNT', amountX, tableTop + 8)

      // Table Rows
      doc.font('Helvetica').fillColor('#000')

      let yPosition = tableTop + 30
      invoiceData.products.forEach((product, index) => {
        const itemTotal = product.price * product.quantity

        doc
          .fontSize(9)
          .text(String(index + 1), itemCodeX, yPosition)
          .text(product.name, descriptionX, yPosition, { width: 180 })
          .text(String(product.quantity), quantityX, yPosition)
          .text(`₹${product.price.toLocaleString('en-IN')}`, priceX, yPosition)
          .text(`₹${itemTotal.toLocaleString('en-IN')}`, amountX, yPosition)

        // Draw line
        yPosition += 25
        doc
          .strokeColor('#ddd')
          .lineWidth(0.5)
          .moveTo(50, yPosition - 5)
          .lineTo(545, yPosition - 5)
          .stroke()
      })

      // Totals Section
      yPosition += 10

      // Subtotal
      doc
        .fontSize(10)
        .font('Helvetica')
        .text('Subtotal:', 380, yPosition)
        .text(`₹${invoiceData.pricing.subtotal.toLocaleString('en-IN')}`, amountX, yPosition)

      yPosition += 20

      // Shipping
      doc
        .text('Shipping:', 380, yPosition)
        .text(invoiceData.pricing.shippingCost === 0 ? 'FREE' : `₹${invoiceData.pricing.shippingCost.toLocaleString('en-IN')}`, amountX, yPosition)

      yPosition += 20

      // Calculate GST (18%)
      const gstRate = 0.18
      const amountBeforeGST = invoiceData.pricing.subtotal / (1 + gstRate)
      const cgst = (amountBeforeGST * (gstRate / 2))
      const sgst = (amountBeforeGST * (gstRate / 2))
      const igst = (amountBeforeGST * gstRate)

      // CGST
      doc
        .fontSize(9)
        .text('CGST (9%):', 380, yPosition)
        .text(`₹${cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, amountX, yPosition)

      yPosition += 18

      // SGST
      doc
        .text('SGST (9%):', 380, yPosition)
        .text(`₹${sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, amountX, yPosition)

      yPosition += 25

      // Total line
      doc
        .strokeColor('#8b4513')
        .lineWidth(1)
        .moveTo(380, yPosition - 5)
        .lineTo(545, yPosition - 5)
        .stroke()

      // Grand Total
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#8b4513')
        .text('TOTAL:', 380, yPosition + 5)
        .text(`₹${invoiceData.pricing.totalAmount.toLocaleString('en-IN')}`, amountX, yPosition + 5)

      // Total in words
      yPosition += 35
      const totalInWords = numberToWords(invoiceData.pricing.totalAmount)
      doc
        .fontSize(9)
        .fillColor('#000')
        .font('Helvetica-Italic')
        .text(`Amount in words: ${totalInWords} Rupees Only`, 50, yPosition)

      // Payment Status
      yPosition += 30
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#2d8c3c')
        .text('✓ PAID', 50, yPosition)

      // Terms & Conditions
      yPosition += 40
      doc
        .fontSize(9)
        .fillColor('#8b4513')
        .font('Helvetica-Bold')
        .text('Terms & Conditions:', 50, yPosition)

      doc
        .fontSize(8)
        .fillColor('#666')
        .font('Helvetica')
        .text('1. Goods once sold cannot be returned or exchanged.', 50, yPosition + 15)
        .text('2. All disputes are subject to local jurisdiction only.', 50, yPosition + 28)
        .text('3. This is a computer-generated invoice and does not require a signature.', 50, yPosition + 41)

      // Footer
      const footerY = 750
      doc
        .strokeColor('#ddd')
        .lineWidth(1)
        .moveTo(50, footerY)
        .lineTo(545, footerY)
        .stroke()

      doc
        .fontSize(8)
        .fillColor('#666')
        .text('Thank you for your business!', 50, footerY + 10, { align: 'center', width: 495 })
        .text('For any queries, contact us at orders@mridang.co.in', 50, footerY + 23, { align: 'center', width: 495 })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

// Helper function to convert number to words
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']

  if (num === 0) return 'Zero'

  const crore = Math.floor(num / 10000000)
  const lakh = Math.floor((num % 10000000) / 100000)
  const thousand = Math.floor((num % 100000) / 1000)
  const hundred = Math.floor((num % 1000) / 100)
  const remainder = num % 100

  let result = ''

  if (crore > 0) {
    result += convertLessThanThousand(crore) + ' Crore '
  }

  if (lakh > 0) {
    result += convertLessThanThousand(lakh) + ' Lakh '
  }

  if (thousand > 0) {
    result += convertLessThanThousand(thousand) + ' Thousand '
  }

  if (hundred > 0) {
    result += ones[hundred] + ' Hundred '
  }

  if (remainder > 0) {
    if (remainder < 10) {
      result += ones[remainder]
    } else if (remainder < 20) {
      result += teens[remainder - 10]
    } else {
      result += tens[Math.floor(remainder / 10)]
      if (remainder % 10 > 0) {
        result += ' ' + ones[remainder % 10]
      }
    }
  }

  return result.trim()
}

function convertLessThanThousand(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']

  if (num === 0) return ''

  const hundred = Math.floor(num / 100)
  const remainder = num % 100

  let result = ''

  if (hundred > 0) {
    result += ones[hundred] + ' Hundred '
  }

  if (remainder > 0) {
    if (remainder < 10) {
      result += ones[remainder]
    } else if (remainder < 20) {
      result += teens[remainder - 10]
    } else {
      result += tens[Math.floor(remainder / 10)]
      if (remainder % 10 > 0) {
        result += ' ' + ones[remainder % 10]
      }
    }
  }

  return result.trim()
}
