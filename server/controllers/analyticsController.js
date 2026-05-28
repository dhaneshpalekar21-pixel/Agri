const Bill = require('../models/Bill')
const Product = require('../models/Product')

// GET /api/analytics/sales
const getSalesAnalytics = async (req, res, next) => {
  try {
    const { period = '7d' } = req.query
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const sales = await Bill.aggregate([
      {
        $match: {
          shopId: req.user.shopId,
          createdAt: { $gte: from },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json(sales)
  } catch (err) { next(err) }
}

// GET /api/analytics/top-products
const getTopProducts = async (req, res, next) => {
  try {
    const topProducts = await Bill.aggregate([
      { $match: { shopId: req.user.shopId } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ])
    res.json(topProducts)
  } catch (err) { next(err) }
}

// GET /api/analytics/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [todaySales, totalProducts, lowStock, pendingUdhari] = await Promise.all([
      Bill.aggregate([
        { $match: { shopId: req.user.shopId, createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      ]),
      Product.countDocuments({ shopId: req.user.shopId, isActive: true }),
      Product.countDocuments({ shopId: req.user.shopId, isActive: true, $expr: { $lte: ['$quantity', '$lowStockThreshold'] } }),
      Bill.aggregate([
        { $match: { shopId: req.user.shopId, status: 'pending' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ])

    res.json({
      todaySales: todaySales[0]?.total || 0,
      todayBills: todaySales[0]?.count || 0,
      totalProducts,
      lowStock,
      pendingUdhari: pendingUdhari[0]?.total || 0,
    })
  } catch (err) { next(err) }
}

module.exports = { getSalesAnalytics, getTopProducts, getDashboardStats }
