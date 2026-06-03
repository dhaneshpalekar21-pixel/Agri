const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://dhaneshpalekar21_db_user:VMoyMjpWbkGtgUvS@cluster0.g1atz2z.mongodb.net/?appName=Cluster0";

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

    const existing = await User.findOne({ email: 'deliveryboy@agroerp.com' });
    if (existing) {
      console.log("User deliveryboy@agroerp.com already exists. Updating designation...");
      await User.updateOne(
        { email: 'deliveryboy@agroerp.com' },
        { $set: { role: 'employee', designation: 'Delivery Executive', isActive: true } }
      );
      console.log("Updated successfully.");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);

      await User.create({
        name: 'Ravi Nair',
        email: 'deliveryboy@agroerp.com',
        password: hashedPassword,
        role: 'employee',
        designation: 'Delivery Executive',
        isActive: true
      });
      console.log("Created Delivery Executive: deliveryboy@agroerp.com");
    }

    console.log("Done.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
