const express = require('express')
const router = express.Router()
const { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer, getCustomerPurchases } = require('../controllers/customerController')
const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.use(protect)
router.use(authorize('admin', 'superadmin'))
router.route('/').get(getCustomers).post(createCustomer)
router.route('/:id').get(getCustomer).put(updateCustomer).delete(deleteCustomer)
router.get('/:id/purchases', getCustomerPurchases)

module.exports = router
