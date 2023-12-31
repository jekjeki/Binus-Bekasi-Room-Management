const router = require('express').Router()
const admin = require('../controller')


router.get('/get-all-admin', admin.admin.getDataAdmin)
router.post('/login', admin.admin.loginAdmin)
router.post('/get-one-admin', admin.admin.getDataOneAdmin)
router.post('/send-email', admin.admin.sendEmail)
router.get('/get-borrower-data/:rtId', admin.admin.borrowerDataById)

module.exports = router