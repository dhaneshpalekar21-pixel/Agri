const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorMiddleware')

// Routes
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const billingRoutes = require('./routes/billingRoutes')
const customerRoutes = require('./routes/customerRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')

const app = express()

// Connect DB
connectDB()

// Security Middleware
app.use(helmet())
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: 'Too many requests, please try again later.',
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AgroERP API is running 🌾',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/bills', billingRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/analytics', analyticsRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

// Global error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`\n🌾 AgroERP Server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔗 API: http://localhost:${PORT}/api/health\n`)
})

module.exports = app
