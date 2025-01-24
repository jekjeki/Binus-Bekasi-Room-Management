const student = require('./controller-student')
const admin = require('./controller-admin')
const data = require('./controller-data')
const uploadexcel = require('./controller-upload')

module.exports = {
    student,
    admin,
    data, 
    uploadexcel
}
