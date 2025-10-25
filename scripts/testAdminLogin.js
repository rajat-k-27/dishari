import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config({ path: '.env.local' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// User Schema (inline for testing)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  role: String,
  active: Boolean,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function testAdminLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dishari.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '12345678';

    console.log('\n🔍 Testing with credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

    const user = await User.findOne({ email: adminEmail }).select('+password');

    if (!user) {
      console.log('\n❌ User not found in database!');
      console.log('Creating admin user now...');
      
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const newUser = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        active: true,
      });
      
      console.log('✅ Admin user created successfully!');
      console.log(`ID: ${newUser._id}`);
      
    } else {
      console.log('\n✅ User found in database!');
      console.log(`ID: ${user._id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Active: ${user.active}`);
      console.log(`Password Hash: ${user.password.substring(0, 20)}...`);

      // Test password comparison
      console.log('\n🔐 Testing password...');
      const isMatch = await bcrypt.compare(adminPassword, user.password);
      
      if (isMatch) {
        console.log('✅ Password is CORRECT!');
      } else {
        console.log('❌ Password does NOT match!');
        console.log('\nUpdating password...');
        
        const newHashedPassword = await bcrypt.hash(adminPassword, 12);
        user.password = newHashedPassword;
        await User.updateOne({ _id: user._id }, { password: newHashedPassword });
        
        console.log('✅ Password updated successfully!');
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Test completed');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

testAdminLogin();
