const express = require('express')
const router = express.Router()
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')

// Routes
router.route('/')
  .post(createOrder)
  .get(getOrders)

router.route('/:id')
  .get(getOrderById)
  .put(updateOrderStatus)
  .delete(deleteOrder)

module.exports = router
