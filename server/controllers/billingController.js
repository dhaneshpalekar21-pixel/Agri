const Bill = require('../models/Bill')
const Product = require('../models/Product')
const Udhari = require('../models/Udhari')

// POST /api/bills — Create bill and deduct stock
const createBill = async (req, res, next) => {
  try {
    const { customerId, customerName, items, subtotal, gstAmount, discount, totalAmount, paymentType, notes } = req.body

    // Deduct stock for each item
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      })
    }

    const bill = await Bill.create({
      shopId: req.user.shopId,
      customerId,
      customerName,
      items,
      subtotal,
      gstAmount,
      discount,
      totalAmount,
      paymentType,
      status: paymentType === 'udhari' ? 'pending' : 'paid',
      createdBy: req.user._id,
      notes,
    })

    // If udhari, create udhari record
    if (paymentType === 'udhari' && customerId) {
      await Udhari.create({
        shopId: req.user.shopId,
        customerId,
        billId: bill._id,
        totalDue: totalAmount,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
    }

    res.status(201).json(bill)
  } catch (err) { next(err) }
}

// GET /api/bills
const getBills = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, from, to } = req.query
    const query = { shopId: req.user.shopId }
    if (status) query.status = status
    if (from || to) {
      query.createdAt = {}
      if (from) query.createdAt.$gte = new Date(from)
      if (to) query.createdAt.$lte = new Date(to)
    }

    const bills = await Bill.find(query)
      .populate('customerId', 'name phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Bill.countDocuments(query)
    res.json({ bills, total })
  } catch (err) { next(err) }
}

// GET /api/bills/:id
const getBill = async (req, res, next) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, shopId: req.user.shopId })
      .populate('customerId', 'name phone village')
      .populate('createdBy', 'name')
    if (!bill) return res.status(404).json({ message: 'Bill not found' })
    res.json(bill)
  } catch (err) { next(err) }
}

module.exports = { createBill, getBills, getBill }
