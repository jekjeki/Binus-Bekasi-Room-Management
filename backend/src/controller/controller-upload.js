const mysql = require("mysql")
const config = require("../configs/database");
const conn = require("../configs/connection");
const jwt = require("jsonwebtoken")
const xlsx = require('xlsx')
const { v4: uuidv4 } = require('uuid');
const moment = require('moment')
const crypto = require('crypto');
const { error } = require("console");


// Fungsi untuk mengonversi serial number Excel ke format tanggal
function excelDateToJSDate(serial) {
    const epoch = new Date(1899, 11, 30); // Excel date epoch
    const days = Math.floor(serial); // Ambil bagian utuh
    const milliseconds = (serial - days) * 86400 * 1000; // Hitung bagian milidetik
    return new Date(epoch.getTime() + days * 86400 * 1000 + milliseconds)
      .toISOString()
      .split("T")[0]; // Format ke YYYY-MM-DD
  }

// upload excel data 
const uploadExcelData = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded" });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const meetingsData = [];
        const lecturersData = [];
        const facilitiesData = [];

        data.forEach((row) => {
            const startDate =
                typeof row["Start Date"] === "number"
                    ? excelDateToJSDate(row["Start Date"])
                    : row["Start Date"];
            const updatedStartDate = moment(startDate, ["DD-MMM-YY", "YYYY-MM-DD", "MM/DD/YYYY"]).format('YYYY-MM-DD');

            lecturersData.push({
                LectureCode: row['Lecture Code'] || 'dummy',
                LectureName: row['Lecture Name'] || '-',
                BinusianID: row['Binusian ID'] || '-',
            });

            meetingsData.push([
                uuidv4(),
                row['Meeting Day'] || '-',
                row['Facility ID'] || '-',
                row['Lecture Code'] || 'dummy',
                row['Meeting Times'] || '-',
                updatedStartDate,
                row['Class Section'] || '-',
                row['Course Description'] || '-',
                'Lectures',
            ]);

            facilitiesData.push([row['Facility ID'].toString()]);
        });

        // Hapus data meetings, lecturers, dan facilities
        await runQuery("DELETE FROM Meetings");
        await runQuery("DELETE FROM Lecturer");
        await runQuery("DELETE FROM Facility");

        console.log("Old data deleted successfully");

        // Insert facilities data
        for (const f of facilitiesData) {
            const insertQuery = `INSERT IGNORE INTO Facility (FacilityID) VALUES (?)`;
            await runQuery(insertQuery, [f]);
        }

        // Insert lecturers data
        for (const l of lecturersData) {
            const insertQuery = `INSERT IGNORE INTO Lecturer (LectureCode, LectureName, BinusianID) VALUES (?,?,?)`;
            await runQuery(insertQuery, [l.LectureCode, l.LectureName, l.BinusianID]);
        }

        // Insert meetings data
        const queryInsertMeet = `INSERT INTO Meetings 
            (MeetingID, MeetingDay, FacilityID, LectureCode, MeetingTimes, StartDate, ClassSection, CourseDescription, MeetCategory)
            VALUES ?`;
        await runQuery(queryInsertMeet, [meetingsData]);


        return res.status(200).send({ message: "New data successfully updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
};

// Helper function untuk menjalankan query
const runQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        conn.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

/**
 * download data untuk report excel 
 */
const downloadReportExcel = (req, res) => {
    const {startDate, endDate, meetCategory} = req.body

    console.log({
        startDate, 
        endDate, 
        meetCategory
    })

    // if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
    //     return res.status(401).send({message: "Unauthorized"})
    // }

    // const token = req.headers.authorization.split(" ")[1]
    // const decoded = jwt.verify(token, "the-super-strong-secret")
    // console.log(decoded)

    // string query untuk download 
    let queryDownload = `SELECT * FROM Meetings WHERE StartDate BETWEEN ? AND ? AND MeetCategory = ?`

    conn.query(queryDownload, [startDate, endDate, meetCategory], (err, results)=>{
        if(err){
            throw err
        }

        // Konversi data ke format Excel
      const worksheet = xlsx.utils.json_to_sheet(results);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Data");

      // Set header untuk mengunduh file Excel
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

      // Kirim file Excel sebagai response
      // Kirim workbook dengan stream
        const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });
        res.end(buffer);
    })
}


module.exports = {
    uploadExcelData, 
    downloadReportExcel
}

