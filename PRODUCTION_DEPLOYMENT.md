# 🚀 Production Deployment Guide - Cashfree Live Mode

## ✅ Complete Checklist for Going Live

---

## 📋 Pre-Deployment Checklist

### 1️⃣ **Complete Cashfree KYC** ✨

**Before you can accept real payments, you MUST complete KYC:**

1. **Login to Cashfree Dashboard:**
   - Go to: https://merchant.cashfree.com/merchants/login
   
2. **Navigate to Settings → Business Details**
   - Upload business documents
   - Upload ID proof (Aadhaar/PAN)
   - Upload address proof
   - Upload bank account proof
   
3. **Wait for Approval**
   - Usually takes 24-48 hours
   - You'll receive email confirmation
   - Status will change to "Verified"

4. **Get Production Credentials:**
   - After KYC approval, go to: **Developers → Credentials**
   - Switch to **"Production"** tab
   - Copy your Production **App ID**
   - Copy your Production **Secret Key**

---

### 2️⃣ **Update Environment Variables** 🔧

**In your `.env.local` file, update ONLY these values:**

```env
# ============================================
# CASHFREE - PRODUCTION MODE
# ============================================

# Backend Configuration (Server-side)
CASHFREE_APP_ID=your_production_app_id_here
CASHFREE_SECRET_KEY=your_production_secret_key_here
CASHFREE_ENVIRONMENT=production  # ← Change from 'sandbox' to 'production'

# Frontend Configuration (Client-side)
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production  # ← Change from 'sandbox' to 'production'

# Application URL
NEXT_PUBLIC_APP_URL=https://mridang.co.in  # ← Your production domain
```

**⚠️ IMPORTANT:**
- ✅ **CASHFREE_ENVIRONMENT** must be `production`
- ✅ **NEXT_PUBLIC_CASHFREE_ENVIRONMENT** must be `production`
- ✅ Both MUST match (either both 'sandbox' or both 'production')
- ❌ **DO NOT** mix sandbox and production

---

### 3️⃣ **What Changes Automatically** 🤖

**The code is already configured to switch automatically!**

When you change the environment variables, the following happens:

#### **Backend API (`create-payment-order/route.ts`):**
```typescript
// Automatically selects the correct API endpoint
const apiEndpoint = process.env.CASHFREE_ENVIRONMENT === 'production'
  ? 'https://api.cashfree.com/pg/orders'           // ✅ Production
  : 'https://sandbox.cashfree.com/pg/orders'       // 🧪 Sandbox
```

#### **Backend Verification (`verify-payment/route.ts`):**
```typescript
// Automatically selects the correct verification endpoint
const apiEndpoint = process.env.CASHFREE_ENVIRONMENT === 'production'
  ? `https://api.cashfree.com/pg/orders/${orderId}/payments`      // ✅ Production
  : `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`  // 🧪 Sandbox
```

#### **Frontend Checkout (`checkout/page.tsx`):**
```typescript
// Reads from NEXT_PUBLIC_CASHFREE_ENVIRONMENT
const cashfreeEnv = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || 'sandbox'

// Initializes Cashfree SDK with correct mode
const cashfree = await window.Cashfree({ 
  mode: cashfreeEnv  // ✅ 'production' or 🧪 'sandbox'
})
```

**✨ You don't need to change any code - just update the environment variables!**

---

## 🔄 Environment Variable Reference

### **Sandbox Mode (Testing):**
```env
CASHFREE_APP_ID=TEST...
CASHFREE_SECRET_KEY=cfsk_ma_test_...
CASHFREE_ENVIRONMENT=sandbox
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox
```

### **Production Mode (Live):**
```env
CASHFREE_APP_ID=<your_prod_app_id>
CASHFREE_SECRET_KEY=<your_prod_secret_key>
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
```

---

## 🧪 Testing Before Going Live

### **Test in Sandbox Mode First:**

1. **Set environment to sandbox:**
   ```env
   CASHFREE_ENVIRONMENT=sandbox
   NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox
   ```

2. **Run your app:**
   ```powershell
   npm run dev
   ```

3. **Test complete flow:**
   - ✅ Add products to cart
   - ✅ Go to checkout
   - ✅ Fill shipping details
   - ✅ Verify OTP
   - ✅ Make payment with test card:
     - Card: `4111 1111 1111 1111`
     - CVV: `123`
     - Expiry: `12/25`
     - OTP: `123456`
   - ✅ Verify order saved to database
   - ✅ Check email confirmation received

4. **Check logs:**
   - Look for: `✅ Using Cashfree sandbox environment`
   - Verify API calls go to `sandbox.cashfree.com`

---

## 🚀 Deploying to Production

### **Step 1: Update Environment Variables**

In your production server/hosting (Vercel, AWS, etc.), set:

```env
CASHFREE_APP_ID=<production_app_id>
CASHFREE_SECRET_KEY=<production_secret_key>
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_APP_URL=https://mridang.co.in
```

### **Step 2: Deploy**

```powershell
# Build for production
npm run build

# Start production server
npm start
```

Or deploy to your hosting platform (Vercel, Netlify, etc.)

### **Step 3: Test with Small Transaction**

**IMPORTANT: Test with a SMALL amount first!**

1. Make a real payment of ₹10-50
2. Use a real card
3. Verify:
   - ✅ Payment completes successfully
   - ✅ Order saves to database
   - ✅ Email confirmation sent
   - ✅ Amount deducted from card
   - ✅ Amount appears in Cashfree dashboard

### **Step 4: Monitor Closely**

For the first few days:
- Check Cashfree dashboard regularly
- Monitor database for order storage
- Verify email deliveries
- Watch for any errors in logs

---

## 🔒 Security Best Practices

### **Environment Variables:**
- ✅ **NEVER** commit `.env.local` to Git
- ✅ Use different credentials for dev and production
- ✅ Store production secrets securely
- ✅ Rotate keys periodically
- ✅ Use environment variables in hosting platform

### **API Security:**
- ✅ Backend credentials are server-side only (secure)
- ✅ Frontend only gets `NEXT_PUBLIC_*` variables
- ✅ Payment verification happens on backend
- ✅ Never trust frontend payment status

---

## 📊 Monitoring Production

### **Cashfree Dashboard:**
https://merchant.cashfree.com/merchants/dashboard

**Monitor:**
- Transaction success rate
- Failed payments
- Settlement status
- Refund requests

### **Application Logs:**

Look for these in production:
```
✅ Using Cashfree production environment
✅ Order created: order_...
✅ Payment verified: SUCCESS
✅ Order saved to database: ORD-...
✅ Email sent successfully
```

### **Database Monitoring:**

Check `checkout_orders` table:
```sql
-- Recent orders
SELECT * FROM checkout_orders 
ORDER BY order_date DESC 
LIMIT 10;

-- Payment status distribution
SELECT payment_status, COUNT(*) 
FROM checkout_orders 
GROUP BY payment_status;

-- Today's revenue
SELECT SUM(total_amount) as today_revenue 
FROM checkout_orders 
WHERE DATE(order_date) = CURDATE() 
AND payment_status = 'SUCCESS';
```

---

## 🆘 Troubleshooting Production

### **Issue 1: Payments Failing**

**Check:**
- ✅ KYC status is approved
- ✅ Production credentials are correct
- ✅ Both environment variables set to 'production'
- ✅ API endpoint is `api.cashfree.com` (not sandbox)

**Debug:**
```typescript
console.log('Environment:', process.env.CASHFREE_ENVIRONMENT)
console.log('API Endpoint:', apiEndpoint)
console.log('App ID:', process.env.CASHFREE_APP_ID?.substring(0, 10) + '...')
```

### **Issue 2: "Invalid credentials" Error**

**Cause:** Using sandbox credentials in production mode

**Solution:**
1. Go to Cashfree Dashboard → Developers → Credentials
2. Switch to **Production** tab
3. Copy production credentials
4. Update `.env.local`
5. Restart server

### **Issue 3: Payment Success but Order Not Saving**

**Check:**
- ✅ Database connection working
- ✅ Webhook/verification endpoint accessible
- ✅ No errors in backend logs
- ✅ Email service configured

**Debug:**
```sql
-- Check if order exists in database
SELECT * FROM checkout_orders 
WHERE notes LIKE '%order_id_here%';
```

### **Issue 4: Checkout Modal Not Opening**

**Check:**
- ✅ `NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production` set
- ✅ Cashfree SDK loaded (check network tab)
- ✅ No console errors
- ✅ Production credentials valid

**Debug:**
```javascript
console.log('Cashfree Environment:', process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT)
console.log('SDK Loaded:', typeof window.Cashfree !== 'undefined')
```

---

## 📞 Support

### **Cashfree Support:**
- Dashboard: https://merchant.cashfree.com/merchants/support
- Email: care@cashfree.com
- Phone: +91-80-6854-5867
- Docs: https://docs.cashfree.com

### **Common Links:**
- **KYC Status:** https://merchant.cashfree.com/merchants/settings/business-details
- **Credentials:** https://merchant.cashfree.com/merchants/developers/credentials
- **Transactions:** https://merchant.cashfree.com/merchants/transactions
- **Settlements:** https://merchant.cashfree.com/merchants/settlements
- **API Docs:** https://docs.cashfree.com/reference/pgcreateorder

---

## ✅ Final Checklist

Before going live, ensure:

- [ ] ✅ KYC completed and approved
- [ ] ✅ Production credentials obtained
- [ ] ✅ `.env.local` updated with production values
- [ ] ✅ Both environment variables set to 'production'
- [ ] ✅ Tested in sandbox successfully
- [ ] ✅ Tested in production with small amount
- [ ] ✅ Database saving orders correctly
- [ ] ✅ Email confirmations working
- [ ] ✅ Monitoring dashboard active
- [ ] ✅ Support contacts saved
- [ ] ✅ Backup plan in place

---

## 🎯 Quick Switch Guide

### **Switch to Production:**
1. Update `.env.local`:
   ```env
   CASHFREE_ENVIRONMENT=production
   NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
   ```
2. Restart server: `npm run dev` or `npm start`
3. ✅ Done! Now using production mode

### **Switch back to Sandbox:**
1. Update `.env.local`:
   ```env
   CASHFREE_ENVIRONMENT=sandbox
   NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox
   ```
2. Restart server
3. ✅ Back to testing mode

**Remember:** Always restart the server after changing environment variables!

---

## 🎉 You're Ready!

Your Cashfree integration is production-ready! Just update the environment variables and you're good to go! 🚀

**Happy Selling! 💰**
