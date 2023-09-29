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

  let img = await qrcode.toDataURL('tes kirim email')

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
    //   text: `Hello student ! your borrowing data has been created. Please check
    // below information data: \n
    // Borrower name: ${req.body.borrowerName} \n
    // Student Id: ${req.body.nim} \n
    // Email: ${req.body.email} \n
    // Booking date: ${req.body.date} \n
    // \n
    // There is your booking data, dont forget to neat the room after time 
    // booking ended yaa !
    // `,
    html: `<div>
      <h1>Hey there !</h1>
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

// login admin
const loginAdmin = (req, res) => {
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
    return res.status.json({
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
};
