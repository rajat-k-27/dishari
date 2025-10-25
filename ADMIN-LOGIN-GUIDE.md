# 🔐 ADMIN LOGIN CREDENTIALS - DISHARI CYBER CAFÉ

## ✅ VERIFIED WORKING CREDENTIALS

**Email:** `admin@dishari.com`  
**Password:** `12345678`

---

## 🧪 TEST RESULTS

✅ **Database Connection:** Working  
✅ **Admin User Exists:** Confirmed (ID: 68f65db275ba2b54e4fab4cb)  
✅ **Password Hash:** Correct  
✅ **Password Verification:** Passed  
✅ **User Role:** admin  
✅ **User Status:** active  

---

## 🔍 HOW TO LOGIN

1. **Navigate to:** http://localhost:3000/admin/login

2. **Enter credentials:**
   - Email: `admin@dishari.com`
   - Password: `12345678`

3. **Click** "Sign In"

4. **You should be redirected to:** `/admin/dashboard`

---

## ⚠️ TROUBLESHOOTING

### If login says "Invalid credentials":

#### 1. Check Browser Console
- Open DevTools (F12)
- Go to Console tab
- Look for any errors
- Check Network tab for API responses

#### 2. Verify Session
- Go to: http://localhost:3000/api/auth/session
- Should return user data if logged in
- Should return `{}` if not logged in

#### 3. Clear Browser Data
```
1. Press Ctrl + Shift + Delete
2. Clear cookies and cached files
3. Try login again
```

#### 4. Check Server Logs
Look at your terminal running `npm run dev` for any error messages during login attempt.

#### 5. Test NextAuth Directly
Try this URL to test the built-in NextAuth signin:
```
http://localhost:3000/api/auth/signin
```

---

## 🔧 MANUAL PASSWORD RESET

If you need to reset the password, run:

```bash
node scripts/testAdminLogin.js
```

This will:
- Check if admin user exists
- Verify the password
- Update password if needed

---

## 📝 ADDITIONAL INFO

### Password Requirements:
- Minimum: 6 characters
- Current password: 8 characters (`12345678`)
- Hashed using bcrypt with salt rounds: 12

### User Details:
```json
{
  "id": "68f65db275ba2b54e4fab4cb",
  "name": "Admin",
  "email": "admin@dishari.com",
  "role": "admin",
  "active": true
}
```

---

## 🎯 NEXT STEPS AFTER LOGIN

Once logged in, you can:
1. ✅ Access the admin dashboard
2. ✅ View statistics
3. ⚠️ Manage products (CRUD UI needs to be added)
4. ⚠️ View orders (UI needs to be added)
5. ⚠️ View contact messages (UI needs to be added)

---

## 🚨 IMPORTANT SECURITY NOTES

1. **Change the default password** after first login
2. **Use a strong password** in production (min 12 characters, mixed case, numbers, symbols)
3. **Never commit** `.env.local` to git
4. **Enable 2FA** for production admin accounts

---

## 💡 TESTING THE LOGIN

### Method 1: Browser (Recommended)
1. Open http://localhost:3000/admin/login
2. Enter credentials
3. Click Sign In

### Method 2: API Test (Advanced)
```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dishari.com","password":"12345678"}'
```

### Method 3: Test Script
```bash
node scripts/testAdminLogin.js
```

---

## ✅ STATUS: READY TO LOGIN!

Your admin account is set up and verified. The credentials work correctly in the database. If you're still having issues logging in through the web interface, it might be a frontend/NextAuth session issue.

**Try these steps:**
1. Restart the dev server (`npm run dev`)
2. Clear browser cache
3. Try in an incognito/private window
4. Check browser console for errors

**Login URL:** http://localhost:3000/admin/login  
**Email:** admin@dishari.com  
**Password:** 12345678
