# 🧪 TESTING CHECKLIST

## ✅ **Test 1: Admin Panel Products Display**

**Steps:**
1. Go to `http://localhost:3000/admin/login`
2. Login: `admin@dishari.com` / `12345678`
3. Go to "Manage Products"
4. **Expected:** You should see all products in a table

**✅ PASS if:** Products appear with images, edit/delete buttons work

---

## ✅ **Test 2: Admin Protected Routes**

**Steps:**
1. Login as admin
2. Try to navigate to `/shop` (manually type in URL)
3. **Expected:** Automatically redirected to `/admin/dashboard`
4. Try to go to `/home`
5. **Expected:** Redirected to `/admin/dashboard`
6. Try to click any link in navbar
7. **Expected:** Should stay in admin area

**✅ PASS if:** Admin cannot leave admin section

---

## ✅ **Test 3: Regular User Cannot Access Admin**

**Steps:**
1. Open incognito/private browser window
2. Go to `http://localhost:3000/admin/products`
3. **Expected:** Redirected to `/admin/login`
4. Try to access any `/admin/*` route
5. **Expected:** Always redirected to login

**✅ PASS if:** Admin routes are protected

---

## ✅ **Test 4: User Must Login to Checkout**

**Steps:**
1. In incognito window, go to `/shop`
2. Add a product to cart
3. Go to `/cart`
4. Click "Proceed to Checkout"
5. **Expected:** Redirected to login page
6. **Expected:** URL has `callbackUrl=/checkout`

**✅ PASS if:** Cannot checkout without login

---

## ✅ **Test 5: Cart Persistence**

**Steps:**
1. Add 3 items to cart
2. Close browser completely
3. Reopen browser
4. Go to `/cart`
5. **Expected:** All 3 items still in cart

**✅ PASS if:** Cart items persist after browser restart

---

## ✅ **Test 6: User Checkout Flow**

**Steps:**
1. As guest, add items to cart
2. Click "Proceed to Checkout"
3. Login/Register with any email
4. **Expected:** Redirected to `/checkout`
5. **Expected:** Email field pre-filled
6. Fill in shipping details
7. Use test card: `4242 4242 4242 4242`
8. Submit order
9. **Expected:** Redirected to success page
10. **Expected:** Cart is cleared

**✅ PASS if:** Complete checkout works for logged-in users

---

## ✅ **Test 7: Admin Navbar Changes**

**Steps:**
1. Login as admin
2. Look at navbar
3. **Expected:** No cart icon visible
4. **Expected:** "Admin" button visible
5. Click "Admin" button
6. **Expected:** Goes to `/admin/dashboard`

**✅ PASS if:** Admin sees different navbar

---

## ✅ **Test 8: Regular User Navbar**

**Steps:**
1. In incognito, visit homepage
2. **Expected:** Cart icon visible
3. **Expected:** "Login" icon visible
4. Login as regular user
5. **Expected:** Cart icon still visible
6. **Expected:** "Logout" button visible

**✅ PASS if:** Regular users see cart and login/logout

---

## ✅ **Test 9: Product Management**

**Steps:**
1. Login as admin
2. Go to "Manage Products"
3. Click "Add New Product"
4. Fill details and upload image
5. **Expected:** Product created successfully
6. **Expected:** Product appears in list with image
7. Click edit (pencil icon)
8. Change title and save
9. **Expected:** Product updated
10. Click delete (trash icon)
11. **Expected:** Product deleted

**✅ PASS if:** Full CRUD operations work

---

## ✅ **Test 10: Image Display**

**Steps:**
1. Add product with image as admin
2. Go to `/shop`
3. **Expected:** Product appears with image
4. Click on product
5. **Expected:** Product detail page shows image
6. **Expected:** No "C" placeholder, actual image shown

**✅ PASS if:** Images display correctly everywhere

---

## 🐛 **Common Issues & Fixes:**

### Issue: Products not showing in admin
**Fix:** Check browser console for errors, verify API response

### Issue: Admin can still access shop
**Fix:** Clear browser cache and restart server

### Issue: Cart not persisting
**Fix:** Check if localStorage is enabled in browser

### Issue: Can't checkout
**Fix:** Make sure Stripe key is in `.env.local`

### Issue: Images not uploading
**Fix:** Verify Cloudinary credentials in `.env.local`

---

## 📊 **Quick Status Check:**

Run through all 10 tests and mark them:

- [ ] Test 1: Admin Panel Products Display
- [ ] Test 2: Admin Protected Routes
- [ ] Test 3: Regular User Cannot Access Admin
- [ ] Test 4: User Must Login to Checkout
- [ ] Test 5: Cart Persistence
- [ ] Test 6: User Checkout Flow
- [ ] Test 7: Admin Navbar Changes
- [ ] Test 8: Regular User Navbar
- [ ] Test 9: Product Management
- [ ] Test 10: Image Display

**Goal:** All 10 tests should pass ✅

---

## 🎯 **Expected Results Summary:**

✅ Admin stays in admin area
✅ Products show in admin panel
✅ Users must login to buy
✅ Cart persists in browser
✅ Images upload and display
✅ Edit/delete works
✅ Different UI for admin vs users
✅ Protected routes working

**If all tests pass, you're ready for production! 🚀**
