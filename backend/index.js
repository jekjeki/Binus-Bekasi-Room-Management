const express = require('express')
const bodyParser = require('body-parser')
const app = express()
var cors = require('cors')
const nodemailer = require('nodemailer')


app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const appRoute = require('./src/router/route-student')
const adminRoute = require('./src/router/route-admin')
const dataRoute = require('./src/router/route-data-event')
app.use('/', appRoute)
app.use('/admin', adminRoute)
app.use('/data', dataRoute)


app.listen(8081, ()=>{
    console.log('run in port:8081')
})

