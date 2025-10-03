# 🎯 Quick Switch Guide - Sandbox ↔️ Production

## 📝 TLDR - What You Need To Do

### **To Go Live (Production Mode):**

1. **Complete KYC on Cashfree** (takes 24-48 hours)
2. **Get Production Credentials** from Cashfree Dashboard
3. **Update `.env.local` - ONLY these lines:**

```env
# Change these 4 values:
CASHFREE_APP_ID=<your_production_app_id>
CASHFREE_SECRET_KEY=<your_production_secret_key>
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
```

4. **Restart server:**
```powershell
npm run dev
```

5. **✅ Done! You're now accepting real payments!**

---

## 🔄 Environment Switching

### **Currently in SANDBOX** → Switch to PRODUCTION:

**Edit `.env.local`:**
```env
# Before (Sandbox - Testing):
CASHFREE_ENVIRONMENT=sandbox
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox

# After (Production - Live):
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
```

### **Currently in PRODUCTION** → Switch back to SANDBOX:

**Edit `.env.local`:**
```env
# Before (Production - Live):
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production

# After (Sandbox - Testing):
CASHFREE_ENVIRONMENT=sandbox
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox
```

**⚠️ Remember to restart the server after any change!**

---

## 📋 Your Complete `.env.local` Template

### **For TESTING (Sandbox Mode):**

```env
# Cashfree Sandbox Configuration
CASHFREE_APP_ID=TEST...your_sandbox_app_id
CASHFREE_SECRET_KEY=cfsk_ma_test_...your_sandbox_secret_key
CASHFREE_ENVIRONMENT=sandbox
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox

# App URL
NEXT_PUBLIC_APP_URL=https://mridang.co.in
```

### **For LIVE PAYMENTS (Production Mode):**

```env
# Cashfree Production Configuration
CASHFREE_APP_ID=<your_production_app_id_from_cashfree_dashboard>
CASHFREE_SECRET_KEY=<your_production_secret_key_from_cashfree_dashboard>
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production

# App URL
NEXT_PUBLIC_APP_URL=https://mridang.co.in
```

---

## ✅ Verification

### **How to know which mode you're in:**

1. **Check `.env.local`:**
   - Look at `CASHFREE_ENVIRONMENT` value
   - `sandbox` = Testing mode
   - `production` = Live mode

2. **Check browser Network tab:**
   - Sandbox: Calls to `sandbox.cashfree.com`
   - Production: Calls to `api.cashfree.com`

3. **Test payment:**
   - Sandbox: Test card `4111 1111 1111 1111` works
   - Production: Only real cards work

---

## 🚨 Important Reminders

### **BEFORE Going Live:**
- ✅ Complete Cashfree KYC
- ✅ Get production credentials
- ✅ Test thoroughly in sandbox
- ✅ Update environment variables
- ✅ Restart server
- ✅ Test with small real transaction (₹10-50)

### **Environment Variables MUST Match:**
```env
# ✅ CORRECT - Both are 'production'
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production

# ❌ WRONG - Mismatch will cause errors
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox
```

### **Always Restart Server:**
After changing `.env.local`:
```powershell
# Stop server (Ctrl+C)
npm run dev  # Start again
```

---

## 📚 Documentation Files Created

1. **`PRODUCTION_DEPLOYMENT.md`** - Complete production deployment guide
2. **`ENVIRONMENT_CONFIG.md`** - Environment variable verification
3. **`CASHFREE_CHECKOUT_FIX.md`** - How the checkout integration works
4. **`QUICK_START.md`** - Getting started guide
5. **`CASHFREE_SETUP.md`** - Initial setup instructions
6. **`MIGRATION_SUMMARY.md`** - Migration from Razorpay summary

---

## 🎯 What Changed in the Code

### **NOTHING! 🎉**

The code is **already** production-ready! It automatically:
- ✅ Detects environment from variables
- ✅ Switches API endpoints
- ✅ Initializes SDK correctly
- ✅ Handles both modes seamlessly

**You only need to update `.env.local` - that's it!**

---

## 🆘 Quick Troubleshooting

### **Problem: Payments not working in production**

**Solution:**
1. Check KYC is approved ✅
2. Verify production credentials are correct ✅
3. Ensure both env vars say 'production' ✅
4. Restart server ✅

### **Problem: Test cards not working**

**Solution:**
- You're probably in production mode
- Test cards only work in sandbox
- Switch back to sandbox or use real card

### **Problem: Changes not taking effect**

**Solution:**
- Did you restart the server?
- Changes to `.env.local` require restart

---

## 📞 Support

**Cashfree Support:**
- Email: care@cashfree.com
- Phone: +91-80-6854-5867
- Dashboard: https://merchant.cashfree.com

**Credentials:**
- https://merchant.cashfree.com/merchants/developers/credentials

**KYC Status:**
- https://merchant.cashfree.com/merchants/settings/business-details

---

## ✨ Summary

### **What You Update:**
```env
CASHFREE_ENVIRONMENT=production  # ← Just change this
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production  # ← And this
```

### **What Happens Automatically:**
- ✅ Backend uses production API
- ✅ Frontend opens production checkout
- ✅ Real money gets processed
- ✅ Orders save to database
- ✅ Emails send confirmation

### **Commands You Run:**
```powershell
npm run dev  # That's it!
```

**It's that simple! 🚀**

---

**Happy Selling! 💰**
