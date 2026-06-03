const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  brand: { type: String, trim: true },
  description: { type: String, trim: true },
  purchasePrice: { type: Number, min: 0 },
  sellingPrice: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, default: 0, min: 0 },
  image: { type: String, trim: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  companyId: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)
