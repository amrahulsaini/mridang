# 🔍 Environment Configuration Verification

## Quick Check Script

Run this command to verify your environment is configured correctly:

```powershell
node -e "console.log('Backend Environment:', process.env.CASHFREE_ENVIRONMENT); console.log('Frontend Environment:', process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT); console.log('App URL:', process.env.NEXT_PUBLIC_APP_URL);"
```

---

## Environment Variables Summary

### **What You Need to Update in `.env.local`:**

When switching from **Sandbox** to **Production**, update these **TWO** variables:

```env
# Change these two lines:
CASHFREE_ENVIRONMENT=production              # ← Change from 'sandbox' to 'production'
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production  # ← Change from 'sandbox' to 'production'

# Also update credentials (from Cashfree Dashboard):
CASHFREE_APP_ID=your_production_app_id
CASHFREE_SECRET_KEY=your_production_secret_key
```

---

## How the Code Uses These Variables

### **1. Backend - Order Creation** (`app/api/create-payment-order/route.ts`)

```typescript
// Line 44-46: Determines which API to call
const apiEndpoint = process.env.CASHFREE_ENVIRONMENT === 'production'
  ? 'https://api.cashfree.com/pg/orders'           // Production API
  : 'https://sandbox.cashfree.com/pg/orders'       // Sandbox API
```

**Result:**
- `CASHFREE_ENVIRONMENT=sandbox` → Uses `sandbox.cashfree.com` ✅
- `CASHFREE_ENVIRONMENT=production` → Uses `api.cashfree.com` ✅

---

### **2. Backend - Payment Verification** (`app/api/verify-payment/route.ts`)

```typescript
// Line 74-77: Determines which verification endpoint to use
const apiEndpoint = process.env.CASHFREE_ENVIRONMENT === 'production'
  ? `https://api.cashfree.com/pg/orders/${cashfree_order_id}/payments`
  : `https://sandbox.cashfree.com/pg/orders/${cashfree_order_id}/payments`
```

**Result:**
- `CASHFREE_ENVIRONMENT=sandbox` → Verifies via sandbox ✅
- `CASHFREE_ENVIRONMENT=production` → Verifies via production ✅

---

### **3. Frontend - Checkout Page** (`app/checkout/page.tsx`)

```typescript
// Reads the frontend environment variable
const cashfreeEnv = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || 'sandbox'

// Initializes Cashfree SDK with correct mode
const cashfree = await window.Cashfree({ mode: cashfreeEnv })
```

**Result:**
- `NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox` → Opens sandbox checkout ✅
- `NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production` → Opens production checkout ✅

---

## Verification Steps

### **Step 1: Check Environment File**

Open `.env.local` and verify:

```env
# For TESTING (Sandbox):
CASHFREE_ENVIRONMENT=sandbox
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox

# For LIVE PAYMENTS (Production):
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
```

**⚠️ Both MUST match!**

---

### **Step 2: Verify in Browser Console**

After starting your app, open browser console and check:

```javascript
// Frontend check
console.log('Environment:', process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT)
// Should show: 'sandbox' or 'production'
```

---

### **Step 3: Check API Calls**

1. **Start the app:**
   ```powershell
   npm run dev
   ```

2. **Go through checkout process**

3. **Check browser Network tab:**
   - Look for calls to Cashfree
   - **Sandbox:** Should see `sandbox.cashfree.com`
   - **Production:** Should see `api.cashfree.com`

4. **Check server logs:**
   - Should see which environment is being used

---

## Expected Behavior

### **In Sandbox Mode:**

```
✅ Backend calls: https://sandbox.cashfree.com/pg/orders
✅ Frontend SDK: window.Cashfree({ mode: 'sandbox' })
✅ Test cards work (4111 1111 1111 1111)
✅ No real money charged
```

### **In Production Mode:**

```
✅ Backend calls: https://api.cashfree.com/pg/orders
✅ Frontend SDK: window.Cashfree({ mode: 'production' })
✅ Only real cards work
✅ Real money charged from customer's account
```

---

## Common Mistakes to Avoid

### ❌ **Mistake 1: Mismatched Environments**

```env
CASHFREE_ENVIRONMENT=production                    # Backend in production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox           # Frontend in sandbox
```

**Problem:** Backend creates production order, but frontend opens sandbox checkout!

**Solution:** Both MUST match:
```env
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
```

---

### ❌ **Mistake 2: Forgot to Restart Server**

After changing `.env.local`, you MUST restart the dev server!

```powershell
# Stop server (Ctrl+C)
# Then start again
npm run dev
```

---

### ❌ **Mistake 3: Using Sandbox Credentials in Production**

```env
# ❌ WRONG - Sandbox credentials with production mode
CASHFREE_APP_ID=TEST...
CASHFREE_SECRET_KEY=cfsk_ma_test_...
CASHFREE_ENVIRONMENT=production  # Won't work!
```

**Solution:** Use production credentials:
```env
# ✅ CORRECT
CASHFREE_APP_ID=<production_app_id>
CASHFREE_SECRET_KEY=<production_secret_key>
CASHFREE_ENVIRONMENT=production
```

---

### ❌ **Mistake 4: Missing NEXT_PUBLIC_ Prefix**

```env
# ❌ WRONG - Frontend won't see this
CASHFREE_ENVIRONMENT=production

# ✅ CORRECT - Frontend needs NEXT_PUBLIC_ prefix
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
```

**Remember:** Only variables with `NEXT_PUBLIC_` are accessible in the browser!

---

## Testing Checklist

Before switching to production:

- [ ] ✅ Both environment variables set to same value
- [ ] ✅ Server restarted after changing variables
- [ ] ✅ Browser console shows correct environment
- [ ] ✅ Network tab shows correct API endpoint
- [ ] ✅ Test transaction completes successfully

---

## Quick Reference

### **Current Code Locations:**

1. **Order Creation:** `app/api/create-payment-order/route.ts` (Line 44-46)
2. **Payment Verification:** `app/api/verify-payment/route.ts` (Line 74-77)
3. **Frontend Checkout:** `app/checkout/page.tsx` (SDK initialization)

### **Environment Variables Used:**

| Variable | Used By | Purpose |
|----------|---------|---------|
| `CASHFREE_APP_ID` | Backend | API authentication |
| `CASHFREE_SECRET_KEY` | Backend | API authentication |
| `CASHFREE_ENVIRONMENT` | Backend | Determines API endpoint |
| `NEXT_PUBLIC_CASHFREE_ENVIRONMENT` | Frontend | Determines SDK mode |
| `NEXT_PUBLIC_APP_URL` | Both | Return URL for payments |

---

## Summary

### **What You Control (in `.env.local`):**
✅ Cashfree credentials  
✅ Environment mode (sandbox/production)  

### **What the Code Does Automatically:**
✅ Selects correct API endpoint  
✅ Initializes SDK with correct mode  
✅ Handles all switching logic  

**You only need to update `.env.local` - the code handles the rest!** 🎉
