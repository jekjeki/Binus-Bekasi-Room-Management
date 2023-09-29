const router = require('express').Router()
const student  = require('../controller')

router.post('/student/add', student.student.addData)

module.exports = router


