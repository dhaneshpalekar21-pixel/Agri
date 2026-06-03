const Admin = require('../models/Admin')
const User = require('../models/User')

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private/SuperAdmin
exports.getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 })
    res.json(admins)
  } catch (error) {
    next(error)
  }
}

// @desc    Get admin by ID
// @route   GET /api/admins/:id
// @access  Private/SuperAdmin
exports.getAdminById = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }
    res.json(admin)
  } catch (error) {
    next(error)
  }
}

// @desc    Create an admin
// @route   POST /api/admins
// @access  Private/SuperAdmin
exports.createAdmin = async (req, res, next) => {
  try {
    const { name, email, phone, role, password, companyId, companyName } = req.body

    if (!name || !email || !role || !password) {
      return res.status(400).json({ message: 'Name, email, role, and password are required' })
    }

    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' })
    }

    const adminId = `ADM-${Math.floor(1000 + Math.random() * 9000)}`

    // Create Admin record
    const admin = new Admin({
      adminId,
      name,
      email,
      phone,
      password,
      role,
      status: 'active',
      companyId,
      companyName
    })

    const createdAdmin = await admin.save()

    // Create corresponding User record for login with role 'admin'
    const user = new User({
      name,
      email,
      password,
      role: 'admin',
      designation: role,
      phone,
      isActive: true,
      companyId,
      companyName
    })
    await user.save()

    res.status(201).json(createdAdmin)
  } catch (error) {
    next(error)
  }
}

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private/SuperAdmin
exports.updateAdmin = async (req, res, next) => {
  try {
    const { name, phone, role, status, companyId, companyName } = req.body

    const admin = await Admin.findById(req.params.id)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    if (name) admin.name = name
    if (phone) admin.phone = phone
    if (role) admin.role = role
    if (status) admin.status = status
    if (companyId) admin.companyId = companyId
    if (companyName) admin.companyName = companyName

    const updatedAdmin = await admin.save()

    // Sync with User
    const user = await User.findOne({ email: admin.email })
    if (user) {
      if (name) user.name = name
      if (role) user.designation = role
      if (status) user.isActive = status === 'active'
      if (companyId) user.companyId = companyId
      if (companyName) user.companyName = companyName
      await user.save()
    }

    res.json(updatedAdmin)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete admin
// @route   DELETE /api/admins/:id
// @access  Private/SuperAdmin
exports.deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    // Delete corresponding User
    const user = await User.findOne({ email: admin.email })
    if (user) {
      await user.deleteOne()
    }

    await admin.deleteOne()
    res.json({ message: 'Admin removed successfully' })
  } catch (error) {
    next(error)
  }
}

// @desc    Activate admin
// @route   PUT /api/admins/:id/activate
// @access  Private/SuperAdmin
exports.activateAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    admin.status = 'active'
    await admin.save()

    const user = await User.findOne({ email: admin.email })
    if (user) {
      user.isActive = true
      await user.save()
    }

    res.json({ message: 'Admin activated successfully', admin })
  } catch (error) {
    next(error)
  }
}

// @desc    Deactivate admin
// @route   PUT /api/admins/:id/deactivate
// @access  Private/SuperAdmin
exports.deactivateAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    admin.status = 'inactive'
    await admin.save()

    const user = await User.findOne({ email: admin.email })
    if (user) {
      user.isActive = false
      await user.save()
    }

    res.json({ message: 'Admin deactivated successfully', admin })
  } catch (error) {
    next(error)
  }
}
