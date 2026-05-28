const express = require('express')
const router = express.Router()
const { getSalesAnalytics, getTopProducts, getDashboardStats } = require('../controllers/analyticsController')
const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.use(protect)
router.use(authorize('admin', 'superadmin'))
router.get('/sales', getSalesAnalytics)
router.get('/top-products', getTopProducts)
router.get('/dashboard', getDashboardStats)

module.exports = router
