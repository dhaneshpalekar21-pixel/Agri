const Order = require('../models/Order')

// @desc    Create new order
// @route   POST /api/orders
// @access  Public/Private (depending on auth middleware, currently allowing all to mimic previous behaviour)
exports.createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, paymentMethod, customerName, customerEmail, customerId } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' })
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Extract companyId
    const companyId = req.user ? req.user.companyId : undefined

    const order = new Order({
      orderId,
      customerId: customerId || 'guest',
      customerName: customerName || 'Guest User',
      customerEmail: customerEmail || '',
      items,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'Paid' : 'Pending',
      orderStatus: 'Pending',
      companyId
    })

    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  } catch (error) {
    next(error)
  }
}

// @desc    Get all orders (with optional filters)
// @route   GET /api/orders
// @access  Public/Private
exports.getOrders = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.customerId) {
      filter.customerId = req.query.customerId
    }
    if (req.query.assignedDeliveryExecutive) {
      filter.assignedDeliveryExecutive = req.query.assignedDeliveryExecutive
    }
    if (req.user && req.user.role === 'admin' && req.user.companyId) {
      filter.companyId = req.user.companyId
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    next(error)
  }
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public/Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (order) {
      res.json(order)
    } else {
      res.status(404).json({ message: 'Order not found' })
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Update order status or assignment
// @route   PUT /api/orders/:id
// @access  Private
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { 
      orderStatus, 
      assignedDeliveryExecutive, 
      paymentStatus,
      assignedDeliveryExecutiveId,
      assignedDeliveryExecutiveName,
      assignedDeliveryExecutiveEmail 
    } = req.body

    const order = await Order.findById(req.params.id)

    if (order) {
      if (orderStatus) order.orderStatus = orderStatus
      if (assignedDeliveryExecutive !== undefined) order.assignedDeliveryExecutive = assignedDeliveryExecutive
      if (paymentStatus) order.paymentStatus = paymentStatus
      
      if (assignedDeliveryExecutiveId !== undefined) order.assignedDeliveryExecutiveId = assignedDeliveryExecutiveId
      if (assignedDeliveryExecutiveName !== undefined) order.assignedDeliveryExecutiveName = assignedDeliveryExecutiveName
      if (assignedDeliveryExecutiveEmail !== undefined) order.assignedDeliveryExecutiveEmail = assignedDeliveryExecutiveEmail

      const updatedOrder = await order.save()
      res.json(updatedOrder)
    } else {
      res.status(404).json({ message: 'Order not found' })
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (order) {
      await order.deleteOne()
      res.json({ message: 'Order removed' })
    } else {
      res.status(404).json({ message: 'Order not found' })
    }
  } catch (error) {
    next(error)
  }
}
