const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Fertilizer', 'Seeds', 'Pesticide', 'Herbicide', 'Tools', 'Equipment', 'Others'] },
  brand: { type: String, trim: true },
  quantity: { type: Number, required: true, default: 0, min: 0 },
  unit: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, min: 0 },
  expiryDate: { type: Date },
  batchNumber: { type: String, trim: true },
  lowStockThreshold: { type: Number, default: 5 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

productSchema.index({ shopId: 1 })
productSchema.index({ expiryDate: 1 })

module.exports = mongoose.model('Product', productSchema)
