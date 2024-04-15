const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const db = require("../configs/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const qrcode = require('qrcode')

pool.on("error", (err) => {
  console.log(err);
});

// send email
const sendEmail = async (req, res) => {

  let img = await qrcode.toDataURL('http://localhost:8081/admin/get-borrower-data/RT628')

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "yusufzaki013@gmail.com",
      pass: "zlwt fefg vocu vvfm",
    },
  });
  transporter.verify().then(console.log).catch(console.error);

  transporter.sendMail({
      from: '"zaky" <yusufzaki013@gmail.com>',
      to: `${req.body.email}`,
      attachDataUrls: true,
      subject: "Your Room Booking has been created !",
    html: `<div>
      <h1> 👋 Hey Students ! 👋</h1>
      <div>
        <p style="font-size:30px;">There are your borrowing data ! please check it out first. </p>
      </div>
      <div class="wrap-box-data">
        <div>
          <p>Borrower Name: ${req.body.borrowerName}</p>
        </div>
        <div>
          <p>Student Id: ${req.body.nim}</p>
        </div>
        <div>
          <p>Email: ${req.body.email}</p>
        </div>
        <div>
          <p>Booking date: ${req.body.date}</p>
        </div>
      </div>
      <div>
        <p style="font-weight:bold;">There is your booking data!, if you found any failures you can contact LSC first!<p>
      </div>
      <div>
        <img src="${img}" />
      </div>
    </div>`
    }, (error, info) => {
      if(error) console.log(error)

      console.log(info)
    })
};

const getDataAdmin = (req, res) => {
  pool.getConnection((err, con) => {
    if (err) throw err;
    con.query(
      `
            SELECT * FROM Admin
            `,
      (error, results) => {
        if (error) throw error;
        res.send({
          status: "success",
          message: "berhasil ambil data!",
          data: results,
        });
      }
    );
  });
};

// admin get specific data borrower 
const borrowerDataById = (req, res) => {
  db.query(`
    SELECT 
      br.BorrowerName, 
      rt.ReservationDate, 
      rt.ReservationStatus,
      ro.RoomName,
      s.ShiftName
    FROM Borrower br JOIN ReservationTransaction rt 
    ON br.BorrowerId=rt.BorrowerId 
    JOIN Room ro ON rt.RoomId = ro.RoomId
    JOIN RoomAvailableTransaction rat ON rt.RATId=rat.RATId
    JOIN Shift s ON s.ShiftId=rat.ShiftId
    WHERE rt.ReservationTransactionId = '${req.params.rtId}'
  `, (error, results)=>{
    if(error) throw error
    res.status(200).send({
      msg: 'success',
      data: results
    })
  })
}

// login admin
const loginAdmin = (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*')

  db.query(
    `
    SELECT * FROM Admin WHERE AdminName = ${db.escape(req.body.name)} 
    AND password = '${req.body.password}'
    `,
    (err, result) => {
      if (err) throw err;

      if (!result.length) {
        return res.status(401).send({
          msg: "username is invalid!",
        });
      }

      const token = jwt.sign({ id: result[0].id }, "the-super-strong-secret", {
        expiresIn: "1h",
      });

      res.status(200).send({
        msg: "success",
        result: result,
        token: token,
      });
    }
  );
};


// get data admin
const getDataOneAdmin = (req, res) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer") ||
    !req.headers.authorization.split(" ")[1]
  ) {
    return res.send.json({
      message: "eror token",
    });
  }

  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "the-super-strong-secret");
  console.log(decoded.id);
  db.query(
    `SELECT * FROM Admin WHERE id = ?`,
    decoded.id,
    function (error, results) {
      if (error) throw error;
      return res.send({ data: results[0] });
    }
  );
};

module.exports = {
  getDataAdmin,
  loginAdmin,
  getDataOneAdmin,
  sendEmail,
  borrowerDataById, 

};
