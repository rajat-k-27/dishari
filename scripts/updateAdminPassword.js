// Script to update admin password
// Run with: node scripts/updateAdminPassword.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  active: Boolean,
}, { timestamps: true });

async function updateAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dishari.com';
    const newPassword = process.env.ADMIN_PASSWORD || 'YourNewSecurePassword123!';

    // Find admin user
    const admin = await User.findOne({ email: adminEmail, role: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log(`Looking for: ${adminEmail}`);
      process.exit(1);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    console.log('✅ Admin password updated successfully!');
    console.log('Email:', admin.email);
    console.log('New Password:', newPassword);
    console.log('\n⚠️  Make sure to update ADMIN_PASSWORD in .env.local if you want to keep this password for future reference');

    process.exit(0);
  } catch (error) {
    console.error('Error updating admin password:', error);
    process.exit(1);
  }
}

updateAdminPassword();
