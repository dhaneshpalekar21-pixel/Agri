const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['expiry', 'stock', 'udhari', 'system', 'billing'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  severity: { type: String, enum: ['red', 'orange', 'yellow', 'blue', 'green'], default: 'blue' },
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)
