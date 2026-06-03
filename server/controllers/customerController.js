const Customer = require('../models/Customer')
const Bill = require('../models/Bill')

const getCustomers = async (req, res, next) => {
  try {
    const { search } = req.query
    const query = { shopId: req.user.shopId, isActive: true }
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { village: { $regex: search, $options: 'i' } },
    ]
    if (req.user && req.user.role === 'admin' && req.user.companyId) {
      query.companyId = req.user.companyId
    }
    const customers = await Customer.find(query).sort({ createdAt: -1 })
    res.json(customers)
  } catch (err) { next(err) }
}

const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, shopId: req.user.shopId })
    if (!customer) return res.status(404).json({ message: 'Customer not found' })
    res.json(customer)
  } catch (err) { next(err) }
}

const getCustomerPurchases = async (req, res, next) => {
  try {
    const bills = await Bill.find({ customerId: req.params.id, shopId: req.user.shopId })
      .sort({ createdAt: -1 }).limit(20)
    res.json(bills)
  } catch (err) { next(err) }
}

const createCustomer = async (req, res, next) => {
  try {
    const customerData = { ...req.body, shopId: req.user.shopId }
    if (req.user && req.user.companyId) {
      customerData.companyId = req.user.companyId
    }
    const customer = await Customer.create(customerData)
    res.status(201).json(customer)
  } catch (err) { next(err) }
}

const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, shopId: req.user.shopId },
      req.body, { new: true }
    )
    if (!customer) return res.status(404).json({ message: 'Customer not found' })
    res.json(customer)
  } catch (err) { next(err) }
}

const deleteCustomer = async (req, res, next) => {
  try {
    await Customer.findOneAndUpdate({ _id: req.params.id, shopId: req.user.shopId }, { isActive: false })
    res.json({ message: 'Customer removed' })
  } catch (err) { next(err) }
}

module.exports = { getCustomers, getCustomer, getCustomerPurchases, createCustomer, updateCustomer, deleteCustomer }
