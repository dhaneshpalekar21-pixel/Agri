const Product = require('../models/Product')

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query
    const query = { status: 'Active' }
    if (category && category !== 'All') query.category = category
    if (search) query.productName = { $regex: search, $options: 'i' }
    if (req.user && req.user.role === 'admin' && req.user.companyId) {
      query.companyId = req.user.companyId
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Product.countDocuments(query)
    res.json({ products, total, page: Number(page) })
  } catch (err) { next(err) }
}

// GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) { next(err) }
}

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body }
    if (req.user && req.user.companyId) {
      productData.companyId = req.user.companyId
    }
    const product = await Product.create(productData)
    res.status(201).json(product)
  } catch (err) { next(err) }
}

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) { next(err) }
}

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (err) { next(err) }
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct }
