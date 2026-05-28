const express = require('express')
const router = express.Router()
const { createBill, getBills, getBill } = require('../controllers/billingController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)
router.route('/').get(getBills).post(createBill)
router.route('/:id').get(getBill)

module.exports = router
