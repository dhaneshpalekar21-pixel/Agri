const User = require('../models/User')
const Shop = require('../models/Shop')
const generateToken = require('../utils/generateToken')
const crypto = require('crypto')

// @desc    Register new admin + create shop
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, shopName, gstNumber } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password, phone, role: 'admin' })

    const shop = await Shop.create({
      name: shopName || `${name}'s Shop`,
      ownerId: user._id,
      gstNumber,
      phone,
      email,
    })

    user.shopId = shop._id
    await user.save()

    const token = generateToken(user._id, user.role)

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, designation: user.designation, shopId: shop._id },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Login
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated' })

    const token = generateToken(user._id, user.role)

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, designation: user.designation, shopId: user.shopId },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user })
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).json({ message: 'No account found with that email' })

    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 min
    await user.save()

    // TODO: Send email with reset link
    res.json({ message: 'Password reset link sent to your email' })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, loginUser, getMe, forgotPassword }
