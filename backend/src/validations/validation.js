const { check } = require('express-validator')

exports.ratIdValidation = [
    check('ratId','ratId is required').not().isEmpty()
]