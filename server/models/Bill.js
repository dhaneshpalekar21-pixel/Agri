const mongoose = require('mongoose')

const billItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  quantity: { type: Number, required: true },
  unit: String,
  price: { type: Number, required: true },
  total: { type: Number, required: true },
})

const billSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  billNumber: { type: String, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: String,
  items: [billItemSchema],
  subtotal: { type: Number, required: true },
  gstAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentType: { type: String, enum: ['cash', 'upi', 'udhari', 'card'], default: 'cash' },
  status: { type: String, enum: ['paid', 'pending', 'partial'], default: 'paid' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
}, { timestamps: true })

billSchema.index({ shopId: 1, createdAt: -1 })

// Auto generate bill number
billSchema.pre('save', async function () {
  if (!this.billNumber) {
    const count = await mongoose.model('Bill').countDocuments({ shopId: this.shopId })
    this.billNumber = `INV-${String(count + 1).padStart(4, '0')}`
  }
})

module.exports = mongoose.model('Bill', billSchema)
