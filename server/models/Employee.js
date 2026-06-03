const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  role: { 
    type: String, 
    required: true,
    enum: [
      'Sales Executive',
      'Inventory Manager',
      'Finance Executive',
      'Customer Support Executive',
      'HR Manager',
      'Delivery Coordinator',
      'Marketing Executive',
      'Warehouse Staff',
      'Delivery Executive',
      'Admin'
    ]
  },
  designation: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  joiningDate: { type: Date, default: Date.now },
  companyId: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Employee', employeeSchema)
