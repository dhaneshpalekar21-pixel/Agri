const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['Super Admin', 'Regional Admin', 'Inventory Admin', 'Finance Admin', 'Support Admin']
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  companyId: { type: String },
  companyName: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Admin', adminSchema)
