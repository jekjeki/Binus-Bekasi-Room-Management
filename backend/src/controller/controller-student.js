const config = require('../configs/database')
const mysql = require('mysql')
const pool = mysql.createPool(config)

pool.on('error', (err)=>{
    console.log(err)
})

const addData = (req, res) => {
    let data = {
        StudentId: req.body.id,
        StudentName: req.body.name,
        StudentGender: req.body.gender

    }

    pool.getConnection((err, con)=>{
        if(err) throw err
        con.query(
            `
                INSERT INTO student SET ?;
            `
            , [data],
            function(err, result){
                if(err) throw err 
                res.send({
                    status: 'success',
                    message: 'success add data'
                })
            }
        )
    })
}

module.exports = {
    addData
}