const Employee = require('../models/Employee')
const User = require('../models/User')

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
exports.getEmployees = async (req, res, next) => {
  try {
    let query = {}
    if (req.user && req.user.role === 'admin' && req.user.companyId) {
      query.companyId = req.user.companyId
    }
    const employees = await Employee.find(query).sort({ createdAt: -1 })
    res.json(employees)
  } catch (error) {
    next(error)
  }
}

// @desc    Create an employee
// @route   POST /api/employees
// @access  Private/Admin
exports.createEmployee = async (req, res, next) => {
  try {
    const { name, email, phone, role, designation, joiningDate, password } = req.body

    if (!name || !email || !role || !password) {
      return res.status(400).json({ message: 'Name, email, role, and password are required' })
    }

    const existingEmployee = await Employee.findOne({ email })
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' })
    }

    const employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`

    // Multi-tenant check
    const companyId = req.user ? req.user.companyId : undefined
    const companyName = req.user ? req.user.companyName : undefined

    // Create Employee record
    const employee = new Employee({
      employeeId,
      name,
      email,
      phone,
      role,
      designation,
      joiningDate: joiningDate || Date.now(),
      status: 'active',
      companyId
    })

    const createdEmployee = await employee.save()

    // Create corresponding User record for login
    const user = new User({
      name,
      email,
      password,
      role, // Pass the employee role or map it as needed
      designation,
      phone,
      isActive: true,
      companyId,
      companyName
    })
    await user.save()

    res.status(201).json(createdEmployee)
  } catch (error) {
    next(error)
  }
}

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
exports.updateEmployee = async (req, res, next) => {
  try {
    const { name, phone, role, designation, status } = req.body
    
    const employee = await Employee.findById(req.params.id)
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    if (name) employee.name = name
    if (phone) employee.phone = phone
    if (role) employee.role = role
    if (designation) employee.designation = designation
    if (status) employee.status = status

    const updatedEmployee = await employee.save()

    // Also update corresponding User status/role if necessary
    const user = await User.findOne({ email: employee.email })
    if (user) {
      if (name) user.name = name
      if (role) user.role = role
      if (status) user.isActive = status === 'active'
      await user.save()
    }

    res.json(updatedEmployee)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    // Delete corresponding User
    const user = await User.findOne({ email: employee.email })
    if (user) {
      await user.deleteOne()
    }

    await employee.deleteOne()
    res.json({ message: 'Employee removed' })
  } catch (error) {
    next(error)
  }
}
