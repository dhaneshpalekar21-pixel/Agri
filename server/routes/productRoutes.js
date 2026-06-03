const express = require('express')
const router = express.Router()
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

// Public routes
router.get('/', getProducts)
router.get('/:id', getProduct)

// Protected routes (Admin, Superadmin, Employee/Inventory Manager)
router.use(protect)
router.post('/', authorize('admin', 'superadmin', 'employee'), createProduct)
router.put('/:id', authorize('admin', 'superadmin', 'employee'), updateProduct)
router.delete('/:id', authorize('admin', 'superadmin', 'employee'), deleteProduct)

module.exports = router
