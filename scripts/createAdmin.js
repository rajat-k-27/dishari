// Script to create the initial admin user
// Run with: node scripts/createAdmin.js

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

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@dishari.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!', salt);

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@dishari.com',
      password: hashedPassword,
      role: 'admin',
      active: true,
    });

    console.log('Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password:', process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!');
    console.log('\n⚠️  Remember to change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
