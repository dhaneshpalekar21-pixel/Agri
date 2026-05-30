const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  village: { type: String, trim: true },
  cropType: { type: String, trim: true },
  landArea: { type: String, trim: true },
  address: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

customerSchema.index({ phone: 1 })

module.exports = mongoose.model('Customer', customerSchema)
