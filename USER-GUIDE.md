# 🎯 QUICK REFERENCE GUIDE

## 🚀 **HOW TO USE THE WEBSITE**

### **FOR USERS (Customers):**

#### **Step 1: Browse Without Login**
```
✅ Visit http://localhost:3000
✅ Browse all pages (Home, About, Services, Shop, Contact)
✅ View products and details
✅ NO login required to browse
```

#### **Step 2: Login to Shop**
```
1. Click "Login" button in navbar
2. Or click "Cart" icon (will prompt login)
3. Login or Register with email
4. Now you can access cart
```

#### **Step 3: Add to Cart**
```
1. Browse /shop
2. Click on any product
3. Click "Add to Cart"
4. Cart count shows in navbar
5. Click cart icon to view cart
```

#### **Step 4: Checkout**
```
1. Go to cart
2. Click "Proceed to Checkout"
3. Fill shipping details
4. Enter payment info
5. Place order
6. Receive confirmation
```

---

### **FOR ADMIN:**

#### **Step 1: Access Admin Panel**
```
⚠️ There are NO admin links on the website
⚠️ You must type the URL manually

Type in browser:
http://localhost:3000/admin/login
```

#### **Step 2: Login**
```
Email: admin@dishari.com
Password: 12345678

Click "Login"
```

#### **Step 3: Manage Everything**
```
Dashboard → See stats
Products → Add/Edit/Delete products
Orders → View and manage orders
Contacts → See customer messages
```

#### **Step 4: Add Product**
```
1. Click "Add New Product"
2. Fill title, description, price, stock, category
3. Upload images (max 5)
4. Click "Create Product"
5. Product appears in shop
```

---

## 📱 **NAVBAR GUIDE**

### **What You See:**

```
┌─────────────────────────────────────────────────┐
│  🏠 Home  📖 About  💼 Services  🛍️ Shop  📞 Contact │
│                                   🛒 Cart  👤 Login │
└─────────────────────────────────────────────────┘
```

### **When Logged Out:**
- 🛒 Cart → Click shows "Please login" message
- 👤 Shows "Login" button

### **When Logged In:**
- 🛒 Cart → Shows item count, goes to cart page
- 👤 Shows "Logout" button

### **Admin is Invisible:**
- ❌ No "Admin" link
- ❌ No "Dashboard" button
- ❌ No way to access admin from UI
- ✅ Only accessible via direct URL

---

## 🔐 **AUTHENTICATION FLOW**

### **Guest User:**
```
Can Do:
✅ Browse website
✅ View products
✅ Read about services
✅ Submit contact form

Cannot Do:
❌ Access cart
❌ Add to cart (will prompt login)
❌ Checkout
❌ View orders
```

### **Logged In User:**
```
Can Do:
✅ Everything guest can do
✅ Access personal cart
✅ Add items to cart
✅ Proceed to checkout
✅ Place orders
✅ Logout

Cannot Do:
❌ Access admin panel
```

### **Admin User:**
```
Can Do:
✅ Access admin panel via URL
✅ Add/edit/delete products
✅ View all orders
✅ Update order status
✅ View contact messages
✅ See dashboard stats

Note:
⚠️ Admin must manually type /admin/login to access
```

---

## 🛒 **CART SYSTEM**

### **How It Works:**
```
1. User must be logged in
2. Each user has personal cart
3. Cart saved in browser (localStorage)
4. Cart persists across sessions
5. Cart clears after successful order
```

### **Cart Features:**
```
✅ Add/remove items
✅ Update quantities
✅ See total price
✅ See tax calculation
✅ Proceed to checkout
✅ Personal to each user
```

---

## 🎨 **PAGE STRUCTURE**

### **Public Pages:**
```
/                 → Home (Landing page)
/about            → About Us
/services         → Services Offered
/shop             → Browse Products
/shop/[id]        → Product Details
/contact          → Contact Form
```

### **Protected Pages (Login Required):**
```
/cart             → Shopping Cart
/checkout         → Checkout Page
/order-success    → Order Confirmation
```

### **Admin Pages (Hidden):**
```
/admin/login      → Admin Login (manual URL)
/admin/dashboard  → Admin Dashboard
/admin/products   → Product Management
/admin/orders     → Order Management
/admin/contacts   → Contact Messages
```

---

## ⚡ **QUICK COMMANDS**

### **Start Server:**
```bash
npm run dev
```

### **Access Website:**
```
User Site: http://localhost:3000
Admin Login: http://localhost:3000/admin/login
```

### **Test Credentials:**
```
Admin:
Email: admin@dishari.com
Password: 12345678

User:
Any email/password (register first)
```

---

## 🐛 **TROUBLESHOOTING**

### **Problem: Can't access cart**
```
Solution: You must be logged in
→ Click cart icon
→ Login
→ Access cart
```

### **Problem: Can't find admin panel**
```
Solution: Type URL manually
→ http://localhost:3000/admin/login
→ Admin is hidden by design
```

### **Problem: Products not showing**
```
Solution: Add products via admin
→ Login to admin
→ Go to Products
→ Click "Add New Product"
```

### **Problem: Can't checkout**
```
Solution: Must be logged in
→ Cart requires login
→ Checkout requires login
→ Login first
```

---

## ✨ **FEATURES SUMMARY**

### **User Features:**
✅ Browse products without login
✅ Beautiful responsive design
✅ Product search and filters
✅ Personal shopping cart (after login)
✅ Secure checkout with Stripe
✅ Order confirmation
✅ Contact form

### **Admin Features:**
✅ Complete product management (CRUD)
✅ Image upload to Cloudinary
✅ Order management
✅ Order status updates
✅ Contact message viewer
✅ Dashboard with stats
✅ Hidden from users
✅ Protected routes

### **Security Features:**
✅ NextAuth authentication
✅ Role-based access control
✅ Protected API routes
✅ Middleware protection
✅ Session management
✅ CSRF protection

---

## 🎯 **TESTING CHECKLIST**

Quick 5-minute test:

- [ ] 1. Browse shop as guest ✅
- [ ] 2. Click cart → Should prompt login ✅
- [ ] 3. Login with any email ✅
- [ ] 4. Add product to cart ✅
- [ ] 5. View cart ✅
- [ ] 6. Proceed to checkout ✅
- [ ] 7. Check navbar (no admin link) ✅
- [ ] 8. Type /admin/login in URL ✅
- [ ] 9. Login as admin ✅
- [ ] 10. Add a product with image ✅

**All 10 steps work? You're ready! 🎉**

---

## 📞 **SUPPORT**

If something doesn't work:
1. Check browser console for errors
2. Restart dev server: `npm run dev`
3. Clear browser cache
4. Check `.env.local` file has all keys
5. Verify MongoDB connection
6. Check Cloudinary credentials

---

**Everything is set up perfectly! Enjoy your cyber café website! 🚀**
