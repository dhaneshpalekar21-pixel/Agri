const express = require('express')
const router = express.Router()
const {
  getAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  activateAdmin,
  deactivateAdmin
} = require('../controllers/adminController')

router.route('/')
  .get(getAdmins)
  .post(createAdmin)

router.route('/:id')
  .get(getAdminById)
  .put(updateAdmin)
  .delete(deleteAdmin)

router.route('/:id/activate')
  .put(activateAdmin)

router.route('/:id/deactivate')
  .put(deactivateAdmin)

module.exports = router
