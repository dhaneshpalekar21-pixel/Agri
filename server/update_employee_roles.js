const mongoose = require('mongoose');

const uri = "mongodb+srv://dhaneshpalekar21_db_user:VMoyMjpWbkGtgUvS@cluster0.g1atz2z.mongodb.net/?appName=Cluster0";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");
    
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      role: String,
      designation: String
    }, { collection: 'users' });
    
    const User = mongoose.model('User', userSchema);
    
    const mapping = {
      'sales@agroerp.com': 'Sales Executive',
      'inventory@agroerp.com': 'Inventory Manager',
      'warehouse@agroerp.com': 'Warehouse Staff',
      'delivery@agroerp.com': 'Delivery Coordinator',
      'support@agroerp.com': 'Customer Support Executive',
      'finance@agroerp.com': 'Finance Executive',
      'hr@agroerp.com': 'HR Manager',
      'marketing@agroerp.com': 'Marketing Executive'
    };
    
    for (const [email, designation] of Object.entries(mapping)) {
      const result = await User.updateOne(
        { email },
        { 
          $set: { 
            role: 'employee',
            designation: designation
          } 
        }
      );
      console.log(`Updated ${email}: matched ${result.matchedCount}, modified ${result.modifiedCount}`);
    }
    
    console.log("Update completed.");
  } catch (error) {
    console.error("Error updating employee roles:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
