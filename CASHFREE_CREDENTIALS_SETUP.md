# 🎯 QUICK SETUP - Add Cashfree Credentials to .env.local

## What You Need to Do RIGHT NOW:

### 1. Get Your Cashfree Credentials

1. **Go to:** https://merchant.cashfree.com/merchants/login

2. **Sign up or Log in** with your business details

3. **Navigate to:** 
   - Click **"Developers"** in the left sidebar
   - Click **"Credentials"**
   - Click **"Sandbox"** tab (for testing)

4. **Copy your credentials:**
   - **App ID** (looks like: `TEST123456789abcdef...`)
   - **Secret Key** (looks like: `cfsk_ma_test_...`)

### 2. Update Your .env.local File

**Replace these placeholder values:**

```env
CASHFREE_APP_ID=your_cashfree_app_id_here
CASHFREE_SECRET_KEY=your_cashfree_secret_key_here
```

**With your actual credentials:**

```env
CASHFREE_APP_ID=TEST123456789abcdef...  ← Paste your App ID here
CASHFREE_SECRET_KEY=cfsk_ma_test_...    ← Paste your Secret Key here
```

### 3. Your Updated .env.local Should Look Like:

```env
# ... (keep all your existing MSG91, Database, Email configs)

# Cashfree Payment Gateway Configuration
CASHFREE_APP_ID=TEST123456789abcdef...
CASHFREE_SECRET_KEY=cfsk_ma_test_...
CASHFREE_ENVIRONMENT=sandbox
NEXT_PUBLIC_APP_URL=https://mridang.co.in

# Admin Configuration
ADMIN_PASSWORD=Mridang@123
```

---

## ✅ Installation Already Complete!

The `cashfree-pg` package (v5.0.8) is now installed! ✨

---

## 🧪 Test Your Integration

### Step 1: Start Development Server
```powershell
npm run dev
```

### Step 2: Test Payment Flow

1. Go to: http://localhost:3000
2. Add products to cart
3. Go to checkout
4. Fill in shipping details
5. Verify email with OTP
6. Click "Pay" button

### Step 3: Use Test Card

When the payment screen opens:

```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Cardholder Name: Test User
OTP: 123456
```

### Step 4: Verify Success

After payment:
- ✅ Payment successful message
- ✅ Order saved in database
- ✅ Email confirmation sent
- ✅ Redirected to success page

---

## 🚨 Common Issues

### Issue: "Failed to create payment order"
**Fix:** 
- Double-check your CASHFREE_APP_ID and CASHFREE_SECRET_KEY
- Make sure there are no extra spaces
- Verify you copied the full credential

### Issue: "Cashfree SDK not loaded" in browser
**Fix:**
- Check your internet connection
- Clear browser cache
- Try a different browser

### Issue: Payment modal doesn't open
**Fix:**
- Open browser console (F12)
- Check for JavaScript errors
- Verify Cashfree SDK loaded in Network tab

---

## 📊 Check Your Test Transactions

After testing, verify in Cashfree Dashboard:
1. Log in to https://merchant.cashfree.com
2. Go to **"Transactions"** (left sidebar)
3. You should see your test payment

---

## 🎉 When Ready for Production

1. **Complete KYC:** Upload business documents in Cashfree dashboard
2. **Wait for approval:** Usually 24-48 hours
3. **Get production credentials:**
   - Go to Developers → Credentials → **Production** tab
   - Copy production App ID and Secret Key
4. **Update .env.local:**
   ```env
   CASHFREE_APP_ID=your_production_app_id
   CASHFREE_SECRET_KEY=your_production_secret_key
   CASHFREE_ENVIRONMENT=production  ← Change to production
   ```
5. **Test with small real transaction**
6. **Monitor closely**

---

## 📞 Need Help?

- **Cashfree Docs:** https://docs.cashfree.com/
- **Cashfree Support:** support@cashfree.com
- **Dashboard:** https://merchant.cashfree.com

---

## 🔒 Security Reminder

⚠️ **NEVER commit .env.local to Git!**

Your `.env.local` file contains sensitive credentials. It's already in `.gitignore`, but double-check:

```powershell
git status
```

If you see `.env.local` in the list, run:
```powershell
git rm --cached .env.local
```

---

**You're all set! Just add your Cashfree credentials and start testing! 🚀**
