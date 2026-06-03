const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }
}, { _id: false })

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ['cod', 'credit', 'online'], default: 'cod' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderStatus: { 
    type: String, 
    enum: [
      'Pending', 
      'Confirmed', 
      'Processing', 
      'Packed', 
      'Ready For Dispatch', 
      'Assigned', 
      'Out For Delivery', 
      'Delivered', 
      'Completed', 
      'Cancelled'
    ], 
    default: 'Pending' 
  },
  assignedDeliveryExecutive: { type: String, default: null },
  assignedDeliveryExecutiveId: { type: String, default: null },
  assignedDeliveryExecutiveName: { type: String, default: null },
  assignedDeliveryExecutiveEmail: { type: String, default: null },
  companyId: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)
