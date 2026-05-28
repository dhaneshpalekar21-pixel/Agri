const mongoose = require('mongoose')

const udhariSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' },
  totalDue: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueDate: { type: Date },
  status: { type: String, enum: ['pending', 'partial', 'cleared'], default: 'pending' },
  payments: [{
    amount: Number,
    mode: { type: String, enum: ['cash', 'upi', 'bank'] },
    note: String,
    paidAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true })

module.exports = mongoose.model('Udhari', udhariSchema)
