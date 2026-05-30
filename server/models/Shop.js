const mongoose = require('mongoose')

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, trim: true },
  gstNumber: { type: String, trim: true, uppercase: true },
  phone: { type: String },
  email: { type: String },
  subscriptionPlan: { type: String, enum: ['trial', 'starter', 'pro', 'enterprise'], default: 'trial' },
  subscriptionExpiry: { type: Date },
  isActive: { type: Boolean, default: true },
  settings: {
    lowStockThreshold: { type: Number, default: 5 },
    expiryAlertDays: { type: Number, default: 30 },
  },
}, { timestamps: true })

module.exports = mongoose.model('Shop', shopSchema)
