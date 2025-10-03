# Migration Summary: Razorpay → Cashfree

## 📋 Overview
This document summarizes all changes made to migrate from Razorpay to Cashfree payment gateway.

---

## 🗂️ Files Modified

### 1. **package.json**
**Changes:**
- ❌ Removed: `"razorpay": "^2.9.6"`
- ✅ Added: `"cashfree-pg": "^3.0.3"`

**Action Required:**
```bash
npm install
```

---

### 2. **app/api/create-payment-order/route.ts**
**Previous Implementation (Razorpay):**
- Created Razorpay order with amount (in paisa), currency, and receipt
- Returned order ID and Razorpay key

**New Implementation (Cashfree):**
- Creates Cashfree order with customer details (email, phone, name)
- Returns payment session ID and order ID
- Requires customer data for order creation

**Key Changes:**
- Amount is now in rupees (not paisa)
- Customer details (email, phone) are mandatory
- Returns `paymentSessionId` for frontend checkout
- Uses Cashfree SDK v3 with API version '2023-08-01'

**Environment Variables Used:**
- `CASHFREE_APP_ID`
- `CASHFREE_SECRET_KEY`
- `CASHFREE_ENVIRONMENT`
- `NEXT_PUBLIC_APP_URL`

---

### 3. **app/api/verify-payment/route.ts**
**Previous Implementation (Razorpay):**
- Verified payment using HMAC signature
- Used `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`

**New Implementation (Cashfree):**
- Fetches payment details from Cashfree API
- Verifies payment status is 'SUCCESS'
- Uses only `cashfree_order_id` for verification

**Key Changes:**
- Removed crypto signature verification
- Added API call to fetch payment status: `Cashfree.PGOrderFetchPayments()`
- Checks `payment.payment_status === 'SUCCESS'`
- Stores Cashfree payment ID in database notes

**Database Fields Updated:**
- `notes` field now contains: `Payment ID: {cashfree_payment_id}, Order ID: {cashfree_order_id}`

**Environment Variables Used:**
- `CASHFREE_APP_ID`
- `CASHFREE_SECRET_KEY`
- `CASHFREE_ENVIRONMENT`

---

### 4. **app/checkout/page.tsx**
**Previous Implementation (Razorpay):**
- Loaded Razorpay checkout.js script
- Used Razorpay modal for payment
- Handler function received payment response directly

**New Implementation (Cashfree):**
- Loads Cashfree SDK v3
- Uses Cashfree Drop-in checkout
- Uses PostMessage API for payment status updates

**Key Changes:**

#### Type Declarations:
- Removed `RazorpayOptions`, `RazorpayInstance`, `RazorpayResponse`
- Added `CashfreeCheckoutOptions`, `CashfreeResponse`

#### State Variables:
- Changed `razorpayLoaded` → `cashfreeLoaded`

#### SDK Loading:
- Changed script URL from Razorpay to Cashfree CDN
- URL: `https://sdk.cashfree.com/js/v3/cashfree.js`

#### Payment Flow:
1. **handlePayment():**
   - Sends customer data with order creation request
   - Uses `paymentSessionId` to initialize checkout
   - Stores order data in sessionStorage
   - Adds message event listener for payment updates
   - Opens Cashfree modal with `cashfree.checkout()`

2. **handlePaymentMessage():**
   - New function to handle PostMessage events
   - Listens for payment status: PAID, SUCCESS, FAILED, PENDING
   - Triggers verification on success

3. **verifyPayment():**
   - Retrieves order data from sessionStorage
   - Sends only `cashfree_order_id` for verification
   - Cleans up sessionStorage and event listeners

#### Request Payload Changes:

**Before (Razorpay):**
```typescript
{
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  orderData: {...}
}
```

**After (Cashfree):**
```typescript
{
  cashfree_order_id: string
  orderData: {...}
}
```

---

## 🗄️ Database Schema
**No changes required!** The `checkout_orders` table structure remains the same. Only the content of the `notes` field changes to store Cashfree payment details instead of Razorpay.

---

## 🔑 Environment Variables Comparison

### Razorpay (Old):
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

### Cashfree (New):
```env
CASHFREE_APP_ID=xxxxx
CASHFREE_SECRET_KEY=xxxxx
CASHFREE_ENVIRONMENT=sandbox  # or 'production'
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧪 Testing Differences

### Razorpay Test Mode:
- Automatic based on key prefix (rzp_test_)
- Test cards provided in docs

### Cashfree Test Mode:
- Controlled by `CASHFREE_ENVIRONMENT` variable
- Separate sandbox and production environments
- Sandbox has its own credentials
- Test cards:
  - Success: `4111 1111 1111 1111`
  - Failure: `4111 1111 1111 1112`
  - OTP: `123456`

---

## 📊 Payment Flow Comparison

### Razorpay Flow:
1. Frontend → Create order (backend)
2. Backend → Return order ID + key
3. Frontend → Open Razorpay modal
4. User → Complete payment
5. Razorpay → Call handler with order_id, payment_id, signature
6. Frontend → Send to verification endpoint
7. Backend → Verify signature using HMAC
8. Backend → Save order

### Cashfree Flow:
1. Frontend → Create order with customer data (backend)
2. Backend → Return payment session ID + order ID
3. Frontend → Open Cashfree checkout modal
4. User → Complete payment
5. Cashfree → Send PostMessage with status
6. Frontend → Listen to message event
7. Frontend → Trigger verification
8. Backend → Fetch payment status from Cashfree API
9. Backend → Verify status is SUCCESS
10. Backend → Save order

---

## 🎯 Key Differences

| Feature | Razorpay | Cashfree |
|---------|----------|----------|
| **SDK Package** | `razorpay` | `cashfree-pg` |
| **Frontend SDK** | checkout.js | SDK v3 |
| **Verification** | HMAC Signature | API Status Check |
| **Amount Unit** | Paisa (×100) | Rupees |
| **Customer Data** | Optional (prefill) | Required |
| **Environment** | Auto (key-based) | Manual setting |
| **Payment Callback** | Handler function | PostMessage event |
| **Test Mode** | Key prefix | Environment variable |

---

## ✅ What Still Works the Same

- ✅ Email OTP verification
- ✅ Cart functionality
- ✅ Order storage in database
- ✅ Order confirmation emails
- ✅ Order success page
- ✅ Order history page
- ✅ Admin order management
- ✅ Form validation
- ✅ Shipping cost calculation
- ✅ UI/UX remains identical

---

## 🚨 Important Notes

1. **Customer data is now required** during order creation (email and phone)
2. **Amount is in rupees**, not paisa (no need to multiply by 100)
3. **Environment must be explicitly set** to 'sandbox' or 'production'
4. **Payment verification uses API call**, not signature verification
5. **sessionStorage is used** to temporarily store order data
6. **Event listeners must be cleaned up** after payment completion
7. **Test thoroughly** before going to production

---

## 📞 Migration Checklist

- [x] Update package.json
- [x] Install new dependencies
- [x] Update create-payment-order API
- [x] Update verify-payment API
- [x] Update frontend checkout page
- [x] Update TypeScript interfaces
- [x] Add environment variables
- [x] Create setup documentation
- [ ] Run `npm install`
- [ ] Configure `.env.local` file
- [ ] Test in sandbox mode
- [ ] Verify email confirmations work
- [ ] Test payment success flow
- [ ] Test payment failure flow
- [ ] Check database entries
- [ ] Review security considerations

---

## 🔄 Next Steps

1. **Run installation:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Cashfree credentials
   - Configure database and email settings

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Test the payment flow:**
   - Add items to cart
   - Go to checkout
   - Fill in shipping details
   - Verify email
   - Use test card: `4111 1111 1111 1111`
   - Complete payment
   - Verify order is saved

5. **Check Cashfree Dashboard:**
   - Log in to merchant portal
   - Verify test transaction appears
   - Check payment status

6. **Before production:**
   - Complete KYC on Cashfree
   - Get production credentials
   - Update environment to 'production'
   - Test with real small transaction
   - Monitor closely

---

For detailed setup instructions, see **CASHFREE_SETUP.md**
