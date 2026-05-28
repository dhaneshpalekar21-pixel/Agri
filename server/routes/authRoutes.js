const express = require('express')
const router = express.Router()
const { register, loginUser, getMe, forgotPassword } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', register)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPassword)
router.get('/me', protect, getMe)

module.exports = router
