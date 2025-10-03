# 🚀 Quick Start Guide - Cashfree Integration

## Immediate Next Steps

### 1️⃣ Install Dependencies (REQUIRED)
Run this command in your terminal:

```powershell
npm install
```

This will:
- Remove the old `razorpay` package
- Install the new `cashfree-pg` package (v3.0.3)
- Update package-lock.json

---

### 2️⃣ Setup Environment Variables (REQUIRED)

#### Option A: Create `.env.local` file manually
Create a file named `.env.local` in the root directory and add:

```env
# Cashfree Credentials (Get from https://merchant.cashfree.com)
CASHFREE_APP_ID=your_app_id_here
CASHFREE_SECRET_KEY=your_secret_key_here
CASHFREE_ENVIRONMENT=sandbox

# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=mridang
DB_PORT=3306

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Option B: Copy from template
```powershell
Copy-Item .env.local.example .env.local
```
Then edit `.env.local` and fill in your actual values.

---

### 3️⃣ Get Cashfree Credentials

1. **Go to:** [Cashfree Merchant Dashboard](https://merchant.cashfree.com/merchants/login)

2. **Sign up** or **Log in**

3. **Navigate to:** Developers → Credentials → **Sandbox**

4. **Copy:**
   - App ID
   - Secret Key

5. **Paste** these values in your `.env.local` file

---

### 4️⃣ Start Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

### 5️⃣ Test Payment Flow

1. **Add products to cart**
2. **Go to checkout**
3. **Fill in shipping details:**
   - Use any name and address
   - Use a real email (for OTP)
   - Use format: +91XXXXXXXXXX for phone

4. **Verify email with OTP**

5. **Click "Pay ₹..."**

6. **Use test card:**
   ```
   Card Number: 4111 1111 1111 1111
   CVV: 123
   Expiry: 12/25
   Name: Test User
   ```

7. **Enter OTP:** `123456`

8. **Complete payment**

9. **Verify:**
   - ✅ Payment successful message
   - ✅ Order saved in database
   - ✅ Email confirmation received
   - ✅ Redirected to success page

---

## 📋 Environment Setup Checklist

Before testing, ensure:

- [ ] Node modules installed (`npm install`)
- [ ] `.env.local` file created
- [ ] Cashfree App ID added
- [ ] Cashfree Secret Key added
- [ ] Environment set to `sandbox`
- [ ] Database credentials configured
- [ ] Database `checkout_orders` table exists
- [ ] Email credentials configured (for confirmations)
- [ ] Development server running (`npm run dev`)

---

## 🆘 Quick Troubleshooting

### Error: "Cannot find module 'cashfree-pg'"
**Fix:** Run `npm install`

### Error: "CASHFREE_APP_ID is not defined"
**Fix:** Create `.env.local` file and add Cashfree credentials

### Error: "Failed to create payment order"
**Fix:** 
- Check `.env.local` has correct Cashfree credentials
- Verify environment is set to `sandbox`
- Check internet connection

### Error: "Database connection failed"
**Fix:** 
- Verify database is running
- Check DB credentials in `.env.local`
- Ensure `checkout_orders` table exists

### Payment modal doesn't open
**Fix:**
- Check browser console for errors
- Verify Cashfree SDK loaded (check Network tab)
- Clear browser cache

### OTP not received
**Fix:**
- Check email spam folder
- Verify EMAIL_* variables in `.env.local`
- Check server logs for email sending errors

---

## 📚 Additional Resources

- **Detailed Setup Guide:** See `CASHFREE_SETUP.md`
- **Migration Details:** See `MIGRATION_SUMMARY.md`
- **Cashfree Docs:** https://docs.cashfree.com/
- **Cashfree Dashboard:** https://merchant.cashfree.com/

---

## 🎯 What Changed?

**In Short:**
- ❌ Removed Razorpay
- ✅ Added Cashfree
- ✅ All features still work the same
- ✅ Database unchanged
- ✅ UI/UX unchanged

**You need to:**
1. Install new packages
2. Get Cashfree credentials
3. Update environment variables
4. Test thoroughly

---

## ⚡ Commands Reference

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🔐 Security Reminders

- ⚠️ **Never commit** `.env.local` to Git
- ⚠️ **Keep credentials secret** (don't share screenshots)
- ⚠️ **Use sandbox** for testing only
- ⚠️ **Switch to production** only after thorough testing
- ⚠️ **Complete KYC** before going live

---

## ✅ Ready to Go Live?

Before deploying to production:

1. **Complete Cashfree KYC** verification
2. **Get production credentials** from Cashfree
3. **Update `.env` with production credentials**
4. **Set `CASHFREE_ENVIRONMENT=production`**
5. **Test with small real transaction**
6. **Monitor first few transactions**
7. **Set up error alerts**

---

Need help? Check the detailed guides in:
- `CASHFREE_SETUP.md` - Complete setup instructions
- `MIGRATION_SUMMARY.md` - Technical migration details

**Happy coding! 🎉**
