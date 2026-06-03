const mongoose = require('mongoose');

const uri = "mongodb+srv://dhaneshpalekar21_db_user:VMoyMjpWbkGtgUvS@cluster0.g1atz2z.mongodb.net/?appName=Cluster0";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");
    
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      role: String
    }, { collection: 'users' });
    
    const User = mongoose.model('User', userSchema);
    
    const emails = [
      'sales@agroerp.com',
      'inventory@agroerp.com',
      'warehouse@agroerp.com',
      'delivery@agroerp.com',
      'support@agroerp.com',
      'finance@agroerp.com',
      'hr@agroerp.com',
      'marketing@agroerp.com'
    ];
    
    const users = await User.find({ email: { $in: emails } });
    console.log("Found users:");
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
