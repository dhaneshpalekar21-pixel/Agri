require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const User = require('./models/User');

const uri = process.env.MONGODB_URI;

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    // Delete existing test admin if any
    await Admin.deleteOne({ email: 'testadmin@agroerp.com' });
    await User.deleteOne({ email: 'testadmin@agroerp.com' });
    console.log("Cleared existing testadmin records.");

    // Create the test admin
    const adminId = `ADM-${Math.floor(1000 + Math.random() * 9000)}`;
    const admin = new Admin({
      adminId,
      name: 'Test Admin',
      email: 'testadmin@agroerp.com',
      phone: '+91 9876543210',
      password: '123456',
      role: 'Super Admin',
      status: 'active'
    });
    await admin.save();
    console.log("Created Admin record in MongoDB.");

    const user = new User({
      name: 'Test Admin',
      email: 'testadmin@agroerp.com',
      password: '123456',
      role: 'admin',
      designation: 'Super Admin',
      phone: '+91 9876543210',
      isActive: true
    });
    await user.save();
    console.log("Created User record in MongoDB.");

  } catch (error) {
    console.error("Error seeding test admin:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
