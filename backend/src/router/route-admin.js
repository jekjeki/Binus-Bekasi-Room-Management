const router = require('express').Router()
const admin = require('../controller')
const multer = require('multer')

// config multer utk upload file

// Konfigurasi Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Folder untuk menyimpan file sementara
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });


const upload = multer({ storage });

router.get('/get-all-admin', admin.admin.getDataAdmin)
router.post('/login', admin.admin.loginAdmin)
router.get('/get-one-admin', admin.admin.getDataOneAdmin)
router.post('/send-email', admin.admin.sendEmail)
router.get('/get-borrower-data/:rtId', admin.admin.borrowerDataById)
router.post('/upload-excel',upload.single("file"),admin.uploadexcel.uploadExcelData)
router.post('/download-excel-data', admin.uploadexcel.downloadReportExcel)

module.exports = router