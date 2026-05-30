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

// Request logger for debugging CORS/preflight
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
})

// Connect DB
connectDB()

// Security Middleware
app.use(helmet())

const allowedOrigins = [
  'https://agri-r32l.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? true : allowedOrigins,
  credentials: true,
}))

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: 'Too many requests, please try again later.',
})
app.use('/api/', limiter)

// Force UTF-8 Encoding for all responses
app.use((req, res, next) => {
  res.setHeader('charset', 'utf-8');
  // Ensure content type has charset set for JSON/text responses
  const oldWriteHead = res.writeHead;
  res.writeHead = function (statusCode, statusMessage, headers) {
    let contentType = res.getHeader('content-type');
    if (contentType && (contentType.includes('application/json') || contentType.includes('text/')) && !contentType.includes('charset')) {
      res.setHeader('content-type', `${contentType}; charset=utf-8`);
    }
    return oldWriteHead.apply(this, arguments);
  };
  next();
});

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
