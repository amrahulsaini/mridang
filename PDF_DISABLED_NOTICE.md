# PDF Invoice Generation - Temporarily Disabled

## Status: DISABLED (January 4, 2025)

### Why is PDF Generation Disabled?

PDF invoice generation has been temporarily disabled due to a compatibility issue between:
- **PDFKit** library (and its dependency `fontkit`)
- **Next.js 15.5.3** with Turbopack bundler

### Error Details

```
Turbopack build failed with 1 errors:
./node_modules/fontkit/dist/module.mjs:3:1
Export applyDecoratedDescriptor doesn't exist in target module
```

The `fontkit` library (used by PDFKit for font handling) expects an export that doesn't exist in Next.js 15's bundled version of `@swc/helpers`.

### Current Behavior

✅ **Working:**
- Payment processing (Cashfree)
- Order creation and database storage
- Customer email confirmation (without PDF)
- Admin email notification (without PDF)
- All other site functionality

❌ **Not Working:**
- PDF invoice attachment in emails

### What Customers Receive

Customers still receive a professional HTML email with:
- Order confirmation details
- Complete product list with images
- Pricing breakdown (subtotal, shipping, total)
- Delivery address
- Order tracking information
- Contact information

**Missing:** PDF invoice attachment (customers can still view all order details in the email and on the website)

---

## Solutions (To Re-Enable PDF in Future)

### Option 1: Wait for Next.js 16 or PDFKit Update
- **Effort:** Low
- **Timeline:** Unknown (depends on library updates)
- **Action:** Monitor updates to PDFKit or Next.js that resolve the fontkit compatibility issue

### Option 2: Switch to Alternative PDF Library
- **Effort:** Medium
- **Libraries to Try:**
  - **jsPDF** - Pure JavaScript, no native dependencies
  - **Puppeteer + html-to-pdf** - Render HTML to PDF
  - **@react-pdf/renderer** - React-based PDF generation
  - **PDFMake** - Client/server PDF generation

### Option 3: Use External PDF API Service
- **Effort:** Low-Medium
- **Services:**
  - **PDFShift** - HTML to PDF API
  - **DocRaptor** - HTML to PDF conversion
  - **Bannerbear** - PDF generation API
  - **CloudConvert** - Document conversion API
- **Pros:** No build compatibility issues, maintained infrastructure
- **Cons:** External dependency, potential cost

### Option 4: Generate PDF on Client-Side
- **Effort:** Medium
- **Approach:** Use jsPDF or similar in browser after order placement
- **Pros:** Bypasses server-side build issues
- **Cons:** Less reliable, depends on client browser

### Option 5: Use Webpack Instead of Turbopack
- **Effort:** Low
- **Action:** Remove `--turbopack` flag from build command in `package.json`
- **Downside:** Slower build times (Turbopack is faster)
- **Command Change:**
  ```json
  "scripts": {
    "build": "next build"  // Remove --turbopack
  }
  ```

---

## Recommended Next Steps

### Immediate (Production Working)
✅ **Current state is production-ready**
- Payment and order processing working perfectly
- Customers receive detailed confirmation emails
- Admin receives order notifications
- No customer-facing issues

### Short-Term (1-2 weeks)
1. **Monitor customer feedback** - See if lack of PDF invoice is an issue
2. **Test Option 5** - Try building without Turbopack flag
3. **Research jsPDF** - Evaluate as PDFKit replacement

### Long-Term (1-3 months)
1. **Implement PDF alternative** if customers request invoice PDFs
2. **Add "Download Invoice" feature** on order history page
3. **Consider external API service** for professional invoices

---

## Technical Details

### Files Modified
- **lib/email.ts** - Commented out PDF generation code
  - Line 2: `import { generateInvoicePDF }` commented
  - Lines 66-84: PDF generation try-catch block commented
  - Lines 207-217: PDF attachment logic commented

### Files Unchanged (But Not Used)
- **lib/invoice-pdf.ts** - Complete PDF generation code still exists
  - Can be re-enabled when compatibility issue resolved
  - No changes needed to this file

### Dependencies Still Installed
```json
"pdfkit": "^0.13.0",
"@types/pdfkit": "^0.13.5"
```
These can be removed if PDF feature won't be used for extended period.

---

## Testing Status

### ✅ Verified Working
- [x] Order creation (Test Order: ORD-20251004-883)
- [x] Payment verification (Payment ID: 4412701287)
- [x] Database order storage
- [x] Customer email delivery (Message ID: 62736151-9fee-8323-7e4c-d2881d6c734b@mridang.co.in)
- [x] Admin email delivery (Message ID: d205a275-cc8d-6139-35ce-377d959cac38@mridang.co.in)
- [x] Production build (after PDF disabled)
- [x] PM2 deployment
- [x] Website functionality

### ❌ Temporarily Disabled
- [ ] PDF invoice generation
- [ ] PDF email attachments

---

## For Developers

### To Re-Enable PDF (When Fixed)
1. Uncomment in `lib/email.ts`:
   ```typescript
   import { generateInvoicePDF } from './invoice-pdf'  // Line 2
   ```

2. Uncomment PDF generation block (lines 66-84):
   ```typescript
   let pdfBuffer: Buffer | null = null
   try {
     console.log('Generating PDF invoice...')
     pdfBuffer = await generateInvoicePDF({...})
   } catch (pdfError) {
     console.error('Failed to generate PDF invoice:', pdfError)
   }
   ```

3. Uncomment attachment logic (lines 207-217):
   ```typescript
   if (pdfBuffer) {
     mailOptions.attachments = [{
       filename: `Invoice-${orderData.orderId}.pdf`,
       content: pdfBuffer,
       contentType: 'application/pdf'
     }]
   }
   ```

4. Test build:
   ```bash
   npm run build
   ```

5. If build succeeds, deploy:
   ```bash
   ./deploy.sh
   ```

### To Switch PDF Libraries (Example: jsPDF)
1. Install jsPDF:
   ```bash
   npm uninstall pdfkit @types/pdfkit
   npm install jspdf
   ```

2. Rewrite `lib/invoice-pdf.ts` using jsPDF API

3. Test build and deploy

---

## Support

- **Production Site:** https://mridang.co.in
- **Admin Email:** orders@mridang.co.in
- **Repository:** https://github.com/amrahulsaini/mridang

**Last Updated:** January 4, 2025
**Status:** PDF Disabled, All Other Features Working
