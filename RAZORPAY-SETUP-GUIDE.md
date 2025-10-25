# 💳 RAZORPAY PAYMENT SETUP GUIDE

Complete guide to integrate Razorpay payment gateway with UPI, Cards, NetBanking, and Wallets support for your Dishari Cyber Café application.

---

## 📋 WHAT YOU'LL GET

After completing this setup, your customers can pay using:
- ✅ **UPI** (PhonePe, Google Pay, Paytm, BHIM)
- ✅ **Credit/Debit Cards** (Visa, Mastercard, RuPay)
- ✅ **NetBanking** (All major Indian banks)
- ✅ **Wallets** (Paytm, PhonePe, Mobikwik, etc.)

---

## 🚀 STEP 1: CREATE RAZORPAY ACCOUNT

### 1.1 Sign Up for Razorpay

1. **Visit:** https://razorpay.com/
2. Click **"Sign Up"** button (top right)
3. Choose **"I'm a Merchant"**
4. Fill in your details:
   - Email address
   - Phone number
   - Create password
5. Click **"Get Started"**

### 1.2 Verify Your Account

1. Check your email for verification link
2. Click the verification link
3. Verify your phone number with OTP

### 1.3 Complete Business Details (For Test Mode)

For testing, you can skip full KYC and use **Test Mode**:
1. After login, click **"Skip for now"** on KYC prompt
2. You'll be in **Test Mode** automatically
3. This allows full integration testing without real money

---

## 🔑 STEP 2: GET YOUR API KEYS

### 2.1 Access API Keys Dashboard

1. **Login to:** https://dashboard.razorpay.com/
2. Click **"Settings"** in left sidebar
3. Click **"API Keys"** under "Developer Controls"

### 2.2 Generate Test Keys

1. You'll see **"Test Mode"** toggle at top
2. Make sure **Test Mode is ON** (blue toggle)
3. Click **"Generate Test Keys"** button
4. You'll get TWO keys:
   - **Key ID**: Starts with `rzp_test_` (public, safe for frontend)
   - **Key Secret**: Hidden by default (private, only for backend)

### 2.3 Copy Your Keys

```bash
# This is what you'll see:
Key ID: rzp_test_xxxxxxxxxxxxxxxx
Key Secret: ●●●●●●●●●●●●●●●● (click "Show" to reveal)
```

**Click "Show" next to Key Secret and copy it!**

---

## ⚙️ STEP 3: CONFIGURE YOUR APPLICATION

### 3.1 Install Razorpay Package

Open your terminal in the project directory and run:

```bash
npm install razorpay
```

### 3.2 Update Environment Variables

Open `.env.local` file and add/update these lines:

```env
# Razorpay Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_actual_secret_key_here
```

**⚠️ IMPORTANT:**
- Replace `rzp_test_xxxxxxxxxxxxxxxx` with your actual Key ID
- Replace `your_actual_secret_key_here` with your actual Key Secret
- **NEVER** commit `.env.local` to Git (it's in `.gitignore`)
- Key Secret should NEVER be exposed to frontend

### 3.3 Restart Development Server

```bash
# Stop the server (Ctrl + C)
# Start again
npm run dev
```

---

## 🧪 STEP 4: TEST PAYMENTS

### 4.1 Test Mode Details

In **Test Mode**:
- ✅ No real money is charged
- ✅ All payment methods work like production
- ✅ You can test success/failure scenarios
- ✅ Unlimited transactions

### 4.2 Test UPI Payments

**Use these test UPI IDs:**

| UPI ID | Result |
|--------|--------|
| `success@razorpay` | Payment succeeds |
| `failure@razorpay` | Payment fails |

**Steps to test:**
1. Go to checkout page on your site
2. Fill customer details
3. Click "Proceed to Payment"
4. In Razorpay modal, select **UPI**
5. Enter `success@razorpay`
6. Click Pay
7. Payment should succeed!

### 4.3 Test Card Payments

**Use these test cards:**

| Card Number | CVV | Expiry | Result |
|-------------|-----|--------|--------|
| `4111 1111 1111 1111` | Any 3 digits | Any future date | Success |
| `4012 0010 3714 1112` | Any 3 digits | Any future date | Success (International) |
| `5104 0600 0000 0008` | Any 3 digits | Any future date | Success (Mastercard) |

**Test a card payment:**
1. Go to checkout
2. Click "Proceed to Payment"
3. Select **Card** payment
4. Enter card number: `4111 1111 1111 1111`
5. CVV: `123`
6. Expiry: `12/25`
7. Click Pay
8. Payment succeeds!

### 4.4 Test NetBanking

1. Select **NetBanking** in payment modal
2. Choose any bank from dropdown
3. You'll see a test bank page
4. Click **Success** button
5. Payment completes!

### 4.5 Test Wallets

1. Select **Wallets** (Paytm, PhonePe, etc.)
2. Choose wallet
3. Test wallet page appears
4. Click **Success**
5. Payment done!

---

## 🔒 STEP 5: PAYMENT SECURITY

### 5.1 Understanding Payment Flow

```
User → Checkout Form → Create Order (Your DB) → 
Create Razorpay Order → Open Payment Modal → 
User Pays → Razorpay Callback → Verify Signature → 
Update Order Status → Success Page
```

### 5.2 Signature Verification

Your backend automatically verifies payment authenticity using:
- HMAC SHA256 algorithm
- Your secret key
- Razorpay order ID + payment ID

**This prevents:**
- ❌ Fake payment confirmations
- ❌ Tampered payment data
- ❌ Fraudulent orders

**Code location:** `lib/razorpay.js` → `verifyRazorpaySignature()`

---

## 📊 STEP 6: MONITOR PAYMENTS

### 6.1 Razorpay Dashboard

**View all test payments:**
1. Go to https://dashboard.razorpay.com/
2. Click **"Payments"** in sidebar
3. See all transactions with:
   - Payment ID
   - Amount
   - Status (Success/Failed)
   - Payment method (UPI/Card/etc)
   - Customer details

### 6.2 Your Admin Panel

**View orders in your app:**
1. Login as admin: http://localhost:3000/admin/login
2. Go to **"Orders"** section
3. See all orders with:
   - Payment status
   - Payment method
   - Customer info
   - Order items

---

## 🚀 STEP 7: GO LIVE (PRODUCTION)

### 7.1 Complete KYC

To accept real payments, complete KYC:
1. Go to Razorpay Dashboard
2. Click **"Account & Settings"**
3. Click **"Complete KYC"**
4. Submit required documents:
   - Business PAN
   - GST Certificate (if applicable)
   - Bank account details
   - Business proof
5. Wait 24-48 hours for approval

### 7.2 Get Live API Keys

After KYC approval:
1. Go to **Settings** → **API Keys**
2. Toggle to **"Live Mode"**
3. Click **"Generate Live Keys"**
4. Copy **Live Key ID** and **Live Key Secret**

### 7.3 Update Production Environment

In your production server (Vercel/Railway/etc):

```env
# Production Environment
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
```

**⚠️ CRITICAL:**
- Use Live keys ONLY in production
- Never expose Live Key Secret
- Enable webhook signature verification
- Test thoroughly in Test Mode first

---

## 🐛 TROUBLESHOOTING

### Issue: "Key ID is not valid"

**Solution:**
1. Check if Key ID starts with `rzp_test_` (for test mode)
2. Verify no extra spaces in `.env.local`
3. Restart dev server after changing .env

### Issue: Payment modal doesn't open

**Solution:**
1. Check browser console for errors
2. Verify Razorpay script loads:
   - Open DevTools → Network tab
   - Look for `checkout.js` from Razorpay
3. Make sure `window.Razorpay` is available

### Issue: "Signature verification failed"

**Solution:**
1. Ensure Key Secret matches in `.env.local`
2. Check order ID matches between create and verify
3. Don't modify payment response data

### Issue: UPI not showing

**Solution:**
1. Ensure currency is `INR` (not USD)
2. Check if amount is in paise (multiply by 100)
3. Clear browser cache

---

## 💰 PRICING & FEES

### Transaction Fees

**Domestic Payments:**
- UPI: 0% (Free till certain limit, then minimal)
- Cards: ~2%
- NetBanking: ~₹10-15 per transaction
- Wallets: 1.5-2%

**International Cards:** ~3% + GST

**Note:** Test mode has no fees. Actual pricing at: https://razorpay.com/pricing/

---

## 📚 USEFUL LINKS

- **Razorpay Dashboard:** https://dashboard.razorpay.com/
- **API Documentation:** https://razorpay.com/docs/api/
- **Payment Methods:** https://razorpay.com/docs/payments/
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/
- **Webhooks:** https://razorpay.com/docs/webhooks/
- **Support:** https://razorpay.com/support/

---

## ✅ VERIFICATION CHECKLIST

Before launching:
- [ ] Razorpay account created
- [ ] Test API keys obtained
- [ ] Keys added to `.env.local`
- [ ] `razorpay` npm package installed
- [ ] Dev server restarted
- [ ] Test UPI payment succeeds
- [ ] Test card payment succeeds
- [ ] Test NetBanking works
- [ ] Payment verification works
- [ ] Order status updates correctly
- [ ] Order success page shows
- [ ] Admin panel shows payment details
- [ ] Cart clears after payment

---

## 🎉 YOU'RE READY!

Your Dishari Cyber Café now accepts:
- 💳 All major cards
- 📱 UPI (PhonePe, Google Pay, etc.)
- 🏦 NetBanking from 50+ banks
- 💰 Popular wallets

**Test thoroughly in Test Mode before going live!**

Need help? Check the troubleshooting section or Razorpay documentation.

---

**Last Updated:** January 2025
