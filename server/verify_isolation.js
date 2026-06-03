require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Employee = require('./models/Employee');

const uri = process.env.MONGODB_URI;

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    // Define mock Admin users representing Admin A and Admin B
    const adminA = {
      _id: 'admin_a_id',
      email: 'admin_a@agroerp.com',
      role: 'admin',
      companyId: 'company_a',
      companyName: 'Company A'
    };

    const adminB = {
      _id: 'admin_b_id',
      email: 'admin_b@agroerp.com',
      role: 'admin',
      companyId: 'company_b',
      companyName: 'Company B'
    };

    // Clean up past employees
    await Employee.deleteMany({ email: { $in: ['empA@agroerp.com', 'empB@agroerp.com'] } });
    await User.deleteMany({ email: { $in: ['empA@agroerp.com', 'empB@agroerp.com'] } });

    // Seed Employee A created by Admin A
    const empA = new Employee({
      employeeId: 'EMP-9991',
      name: 'Employee A',
      email: 'empA@agroerp.com',
      role: 'Sales Executive',
      joiningDate: new Date(),
      status: 'active',
      companyId: adminA.companyId
    });
    await empA.save();
    console.log("Created Employee A under Company A.");

    // Seed Employee B created by Admin B
    const empB = new Employee({
      employeeId: 'EMP-9992',
      name: 'Employee B',
      email: 'empB@agroerp.com',
      role: 'Inventory Manager',
      joiningDate: new Date(),
      status: 'active',
      companyId: adminB.companyId
    });
    await empB.save();
    console.log("Created Employee B under Company B.");

    // Test querying as Admin A
    console.log("\n--- Testing queries as Admin A (Company A) ---");
    let queryA = {};
    if (adminA.role === 'admin' && adminA.companyId) {
      queryA.companyId = adminA.companyId;
    }
    const employeesForA = await Employee.find(queryA);
    console.log("Visible Employees for Admin A (Expected: 1, named Employee A):", employeesForA.map(e => e.name));

    // Test querying as Admin B
    console.log("\n--- Testing queries as Admin B (Company B) ---");
    let queryB = {};
    if (adminB.role === 'admin' && adminB.companyId) {
      queryB.companyId = adminB.companyId;
    }
    const employeesForB = await Employee.find(queryB);
    console.log("Visible Employees for Admin B (Expected: 1, named Employee B):", employeesForB.map(e => e.name));

  } catch (error) {
    console.error("Multi-tenant verification test failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
