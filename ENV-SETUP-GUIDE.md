# 🔐 ENVIRONMENT VARIABLES SETUP GUIDE

This guide will walk you through obtaining all the required API keys and credentials for your Dishari Cyber Café application.

---

## 📋 REQUIRED ENVIRONMENT VARIABLES

Your `.env.local` file needs these variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Cloudinary (Image Upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# NextAuth (Authentication)
NEXTAUTH_SECRET=generate_a_random_32_character_string
NEXTAUTH_URL=http://localhost:3000

# Email (Optional but recommended)
EMAIL_SERVER=smtp://username:password@smtp.gmail.com:587
EMAIL_FROM=noreply@dishari.com

# Admin Account
ADMIN_EMAIL=admin@dishari.com
ADMIN_PASSWORD=YourSecurePassword123!

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗄️ 1. MONGODB (Database)

### Option A: MongoDB Atlas (FREE - Recommended)

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** for a free account
3. **Create a Cluster:**
   - Click "Build a Database"
   - Select **FREE tier (M0)**
   - Choose a cloud provider (AWS/Google/Azure)
   - Select a region closest to you
   - Click "Create Cluster"
   
4. **Create Database User:**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `dishari_admin`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Setup Network Access:**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your current IP address
   - Click "Confirm"

6. **Get Connection String:**
   - Go to "Database" in left sidebar
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Select Driver: **Node.js** and Version: **5.5 or later**
   - Copy the connection string, it looks like:
     ```
     mongodb+srv://dishari_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://dishari_admin:password@cluster0.xxxxx.mongodb.net/dishari?retryWrites=true&w=majority`

7. **Add to `.env.local`:**
   ```env
   MONGODB_URI=mongodb+srv://dishari_admin:YourPassword@cluster0.xxxxx.mongodb.net/dishari?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB

1. **Download:** https://www.mongodb.com/try/download/community
2. **Install** MongoDB Community Server
3. **Start MongoDB** service
4. **Add to `.env.local`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/dishari
   ```

---

## 📸 2. CLOUDINARY (Image Upload & Management)

1. **Go to:** https://cloudinary.com/users/register_free
2. **Sign up** for a free account (up to 25GB storage FREE)
3. **After logging in**, you'll see your **Dashboard**
4. **Find your credentials** on the dashboard:
   - **Cloud Name:** (e.g., `dxxx123abc`)
   - **API Key:** (e.g., `123456789012345`)
   - **API Secret:** Click "👁️ Reveal" to see it (e.g., `abcdef123456...`)

5. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

**Note:** The cloud name is PUBLIC (used in frontend), but API Key and Secret should be kept private!

---

## 💳 3. STRIPE (Payment Processing)

### Get Test Keys (FREE for testing)

1. **Go to:** https://dashboard.stripe.com/register
2. **Sign up** for a free account
3. **Skip activation** (you can test without activating your account)
4. **Toggle "Test Mode"** (switch in top right corner should say "TEST DATA")
5. **Get API Keys:**
   - Go to: https://dashboard.stripe.com/test/apikeys
   - You'll see:
     - **Publishable key:** `pk_test_51Xxxx...`
     - **Secret key:** Click "Reveal test key" → `sk_test_51Xxxx...`

6. **Get Webhook Secret** (for payment confirmations):
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `http://localhost:3000/api/webhooks/stripe` (for local testing)
   - For production: `https://yourdomain.com/api/webhooks/stripe`
   - Events to send: Select these events:
     - ✅ `payment_intent.succeeded`
     - ✅ `payment_intent.payment_failed`
   - Click "Add endpoint"
   - Click on your newly created endpoint
   - Click "Reveal" under "Signing secret" → `whsec_xxxxx...`

7. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Xxxxx
   STRIPE_SECRET_KEY=sk_test_51Xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

### Test Credit Card Numbers:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- Any future expiry date (e.g., 12/34)
- Any 3-digit CVC (e.g., 123)
- Any 5-digit ZIP (e.g., 12345)

---

## 🔐 4. NEXTAUTH SECRET (Authentication)

Generate a random 32-character secret key:

### Option A: Using PowerShell (Windows)
```powershell
# Run in PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Option B: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option C: Online Generator
Go to: https://generate-secret.vercel.app/32

**Add to `.env.local`:**
```env
NEXTAUTH_SECRET=your_generated_32_char_secret_here
NEXTAUTH_URL=http://localhost:3000
```

**⚠️ IMPORTANT:** Change `NEXTAUTH_URL` to your production domain when deploying!

---

## 📧 5. EMAIL (Optional - for order confirmations)

### Option A: Gmail (Easy for testing)

1. **Use your Gmail account**
2. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

3. **Create App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" → Type "Dishari App"
   - Click "Generate"
   - You'll get a 16-character password (e.g., `abcd efgh ijkl mnop`)

4. **Add to `.env.local`:**
   ```env
   EMAIL_SERVER=smtp://youremail@gmail.com:abcdefghijklmnop@smtp.gmail.com:587
   EMAIL_FROM=youremail@gmail.com
   ```
   **Note:** Remove spaces from the app password!

### Option B: SendGrid (Better for production)

1. **Go to:** https://signup.sendgrid.com/
2. **Sign up** for free account (100 emails/day FREE)
3. **Create API Key:**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name: "Dishari App"
   - Permissions: "Full Access"
   - Click "Create & View"
   - Copy the API key (starts with `SG.xxxx`)

4. **Add to `.env.local`:**
   ```env
   EMAIL_SERVER=smtp://apikey:YOUR_SENDGRID_API_KEY@smtp.sendgrid.net:587
   EMAIL_FROM=noreply@yourdomain.com
   ```

### Option C: Skip Email (Testing only)
If you want to skip email setup for now, you can comment out email-related code or just leave these empty:
```env
EMAIL_SERVER=
EMAIL_FROM=noreply@dishari.com
```

---

## 👤 6. ADMIN ACCOUNT

Set your admin credentials:

```env
ADMIN_EMAIL=admin@dishari.com
ADMIN_PASSWORD=YourSecurePassword123!
```

**⚠️ IMPORTANT:** Use a STRONG password with:
- At least 12 characters
- Uppercase and lowercase letters
- Numbers
- Special characters

---

## 🚀 QUICK START: COMPLETE `.env.local` FILE

Create a file named `.env.local` in your project root and paste this template:

```env
# ================================
# DATABASE
# ================================
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dishari?retryWrites=true&w=majority

# ================================
# CLOUDINARY (Images)
# ================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret

# ================================
# STRIPE (Payments)
# ================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Xxxxx
STRIPE_SECRET_KEY=sk_test_51Xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# ================================
# NEXTAUTH (Authentication)
# ================================
NEXTAUTH_SECRET=your_32_character_random_string
NEXTAUTH_URL=http://localhost:3000

# ================================
# EMAIL (Optional)
# ================================
EMAIL_SERVER=smtp://email:password@smtp.gmail.com:587
EMAIL_FROM=noreply@dishari.com

# ================================
# ADMIN ACCOUNT
# ================================
ADMIN_EMAIL=admin@dishari.com
ADMIN_PASSWORD=YourSecurePassword123!

# ================================
# APP CONFIG
# ================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ✅ VERIFICATION CHECKLIST

After setting up your `.env.local` file:

- [ ] MongoDB URI is correct and cluster is running
- [ ] Cloudinary credentials are from your dashboard
- [ ] Stripe keys are in TEST mode (pk_test_ and sk_test_)
- [ ] NEXTAUTH_SECRET is at least 32 characters
- [ ] Email credentials are correct (or commented out for testing)
- [ ] Admin password is STRONG
- [ ] All URLs use `http://localhost:3000` for development

---

## 🧪 TEST YOUR SETUP

After creating `.env.local`, run these commands:

```bash
# 1. Restart the development server
npm run dev

# 2. Create admin user (in a new terminal)
npm run create-admin

# 3. Test MongoDB connection
# Visit: http://localhost:3000/admin/login
# Try logging in with your admin credentials
```

---

## 🔒 SECURITY BEST PRACTICES

1. **NEVER commit `.env.local`** to git (already in .gitignore)
2. **Use different keys** for development and production
3. **Rotate secrets** periodically
4. **Use strong passwords** for admin accounts
5. **Enable 2FA** on all service accounts (Stripe, MongoDB, etc.)
6. **Restrict IP access** on MongoDB Atlas in production
7. **Use environment variables** on your hosting platform (Vercel, Netlify, etc.)

---

## 🚨 TROUBLESHOOTING

### MongoDB Connection Issues:
- ✅ Check if IP address is whitelisted
- ✅ Verify password doesn't contain special characters (or encode them)
- ✅ Ensure cluster is active (not paused)
- ✅ Test connection string format

### Stripe Webhook Issues:
- ✅ Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- ✅ Verify endpoint URL is correct
- ✅ Check webhook signing secret matches

### Email Not Sending:
- ✅ Verify app password (not regular password)
- ✅ Check Gmail "Less secure app access" is enabled
- ✅ Test SMTP credentials separately

---

## 📞 NEED HELP?

If you get stuck:

1. **Check service status pages:**
   - MongoDB: https://status.cloud.mongodb.com/
   - Stripe: https://status.stripe.com/
   - Cloudinary: https://status.cloudinary.com/

2. **Review error messages** in your terminal carefully

3. **Test each service individually** before combining them

---

## 🎉 NEXT STEPS

Once your `.env.local` is configured:

1. ✅ Run `npm run dev` to start the server
2. ✅ Run `npm run create-admin` to create admin user
3. ✅ Visit http://localhost:3000/admin/login
4. ✅ Login with your admin credentials
5. ✅ Add some products via admin dashboard
6. ✅ Test the complete e-commerce flow!

**Your Dishari Cyber Café is ready to go! 🚀**
