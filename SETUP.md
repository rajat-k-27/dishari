# Dishari Cyber Café - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your credentials:

**MongoDB (Required)**
- Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get connection string
- Replace `MONGODB_URI` in `.env.local`

**Cloudinary (Required for image uploads)**
- Sign up at [cloudinary.com](https://cloudinary.com)
- Get credentials from dashboard
- Update `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

**Stripe (Required for payments)**
- Sign up at [stripe.com](https://stripe.com)
- Get test API keys from dashboard
- Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`
- For webhooks (local testing): Install Stripe CLI
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```
- Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

**Email (Optional but recommended)**
- For Gmail: Generate app password (requires 2FA)
- Format: `smtp://youremail@gmail.com:app-password@smtp.gmail.com:587`

**Auth Secret**
- Generate random string (min 32 characters):
  ```bash
  openssl rand -base64 32
  ```
- Update `NEXTAUTH_SECRET`

### Step 3: Create Admin User
```bash
npm run create-admin
```

### Step 4: Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Testing the Application

### 1. Test Homepage
- Visit `http://localhost:3000`
- Check animations and navigation

### 2. Test Shop
- Visit `http://localhost:3000/shop`
- Note: No products yet (add via admin panel)

### 3. Test Admin Login
- Visit `http://localhost:3000/admin/login`
- Login with credentials:
  - Email: `admin@dishari.com`
  - Password: `ChangeThisPassword123!`

### 4. Add Sample Products
In admin panel:
1. Go to "Manage Products"
2. Click "Add Product"
3. Fill in details:
   - Title: "Energy Drink"
   - Price: 2.99
   - Category: "beverages"
   - Stock: 50
   - Description: "Refresh yourself with our energy drinks"
4. Upload image (optional)
5. Save

### 5. Test E-Commerce Flow
1. Visit shop and add product to cart
2. Go to cart
3. Proceed to checkout
4. Fill in shipping info
5. Use Stripe test card: `4242 4242 4242 4242`
6. Any future expiry, any CVC
7. Complete order
8. Check confirmation page

### 6. Test Stripe Webhook (Local)
In separate terminal:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Complete a test order - webhook should trigger.

## 📊 Admin Panel Features

Access: `http://localhost:3000/admin/dashboard`

### Available Sections:
1. **Dashboard** - Overview stats
2. **Products** - CRUD operations (create separate admin pages for full functionality)
3. **Orders** - View and manage orders
4. **Messages** - Contact form submissions

## 🛠️ Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:** 
- Check connection string format
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify database user has correct permissions

### Issue: Stripe Payment Not Working
**Solution:**
- Verify API keys are correct (test mode vs live mode)
- Check Stripe publishable key is public (starts with `pk_`)
- Ensure webhook secret matches

### Issue: Images Not Uploading
**Solution:**
- Verify Cloudinary credentials
- Check file size (default limit: 10MB)
- Ensure cloud name is correct

### Issue: Email Not Sending
**Solution:**
- For Gmail: Use app-specific password
- Check SMTP server settings
- Verify port (usually 587 for TLS)

### Issue: Admin Can't Login
**Solution:**
- Run `npm run create-admin` again
- Check MongoDB connection
- Verify NEXTAUTH_SECRET is set

## 📱 Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

**Important Production Settings:**
- Set `NEXTAUTH_URL` to your production URL
- Set `NEXT_PUBLIC_APP_URL` to your production URL
- Use production Stripe keys
- Update webhook endpoint in Stripe dashboard
- Generate new `NEXTAUTH_SECRET`

### Environment Variables Checklist
- [ ] MONGODB_URI (production cluster)
- [ ] CLOUDINARY credentials
- [ ] STRIPE production keys
- [ ] STRIPE_WEBHOOK_SECRET (production)
- [ ] NEXTAUTH_SECRET (new secret)
- [ ] NEXTAUTH_URL (production URL)
- [ ] EMAIL_SERVER (production SMTP)
- [ ] NEXT_PUBLIC_APP_URL (production URL)

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Change these values
    500: '#22c55e',
    600: '#16a34a',
    // ...
  }
}
```

### Add More Products
Via admin panel or directly in MongoDB:
```javascript
{
  title: "Product Name",
  description: "Description",
  price: 9.99,
  category: "snacks", // snacks, beverages, gaming, accessories, services
  stock: 100,
  images: [{ url: "image-url", public_id: "cloudinary-id" }],
  featured: true,
  active: true
}
```

## 📞 Need Help?

Check the main README.md for:
- Full API documentation
- Detailed feature list
- Architecture overview
- Testing instructions

## ✅ Verification Checklist

- [ ] MongoDB connected
- [ ] Admin user created
- [ ] Can login to admin panel
- [ ] Can create products
- [ ] Products visible on shop page
- [ ] Can add to cart
- [ ] Cart persists on refresh
- [ ] Checkout page loads
- [ ] Stripe Elements visible
- [ ] Test payment works
- [ ] Order confirmation received
- [ ] Email received (if configured)
- [ ] Admin can view orders
- [ ] Contact form works
- [ ] All animations working
- [ ] Mobile responsive

---

**🎉 Congratulations! Your cyber café website is ready!**

For full documentation, see README.md
