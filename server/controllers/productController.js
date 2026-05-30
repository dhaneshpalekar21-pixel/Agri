const Product = require('../models/Product')

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query
    const query = { shopId: req.user.shopId, isActive: true }
    if (category) query.category = category
    if (search) query.name = { $regex: search, $options: 'i' }

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
    const product = await Product.findOne({ _id: req.params.id, shopId: req.user.shopId })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) { next(err) }
}

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body, shopId: req.user.shopId })
    res.status(201).json(product)
  } catch (err) { next(err) }
}

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, shopId: req.user.shopId },
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
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, shopId: req.user.shopId },
      { isActive: false },
      { new: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (err) { next(err) }
}

// GET /api/products/expiring?days=30
const getExpiringProducts = async (req, res, next) => {
  try {
    const days = Number(req.query.days) || 30
    const threshold = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    const products = await Product.find({
      shopId: req.user.shopId,
      isActive: true,
      expiryDate: { $lte: threshold, $gte: new Date() },
    }).sort({ expiryDate: 1 })
    res.json(products)
  } catch (err) { next(err) }
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getExpiringProducts }
