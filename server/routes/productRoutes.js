const express = require('express')
const router = express.Router()
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getExpiringProducts } = require('../controllers/productController')
const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.use(protect)

router.get('/expiring', getExpiringProducts)
router.route('/').get(getProducts).post(authorize('admin', 'superadmin'), createProduct)
router.route('/:id').get(getProduct).put(authorize('admin', 'superadmin'), updateProduct).delete(authorize('admin', 'superadmin'), deleteProduct)

module.exports = router
