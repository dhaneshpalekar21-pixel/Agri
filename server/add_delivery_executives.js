const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://dhaneshpalekar21_db_user:VMoyMjpWbkGtgUvS@cluster0.g1atz2z.mongodb.net/?appName=Cluster0";

const newAccounts = [
  { name: 'Rahul Sharma', email: 'rahul.delivery@agroerp.com', designation: 'Delivery Executive', deId: 'DE-002' },
  { name: 'Amit Verma', email: 'amit.delivery@agroerp.com', designation: 'Delivery Executive', deId: 'DE-003' }
];

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: String,
      designation: String,
      isActive: { type: Boolean, default: true }
    }, { collection: 'users' });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    for (const acct of newAccounts) {
      const existing = await User.findOne({ email: acct.email });
      if (existing) {
        console.log(`Updating ${acct.email}...`);
        await User.updateOne(
          { email: acct.email },
          { $set: { name: acct.name, role: 'employee', designation: acct.designation, isActive: true } }
        );
        console.log(`Updated ${acct.email}`);
      } else {
        await User.create({
          name: acct.name,
          email: acct.email,
          password: hashedPassword,
          role: 'employee',
          designation: acct.designation,
          isActive: true
        });
        console.log(`Created: ${acct.email} (${acct.name})`);
      }
    }

    // Also ensure existing delivery executive is correct
    await User.updateOne(
      { email: 'deliveryboy@agroerp.com' },
      { $set: { name: 'Ravi Nair', role: 'employee', designation: 'Delivery Executive', isActive: true } }
    );
    console.log("Confirmed deliveryboy@agroerp.com as Ravi Nair");

    console.log("\n=== All Delivery Executive Accounts ===");
    const allDE = await User.find({ designation: 'Delivery Executive' }, { name: 1, email: 1, designation: 1 });
    allDE.forEach(u => console.log(`  ${u.name} — ${u.email}`));

    console.log("\nDone.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
