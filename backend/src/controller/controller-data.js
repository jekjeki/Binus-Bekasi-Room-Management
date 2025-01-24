const mysql = require("mysql");
const db = require("../configs/connection");
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto')
const nodemailer = require("nodemailer");

// test -> get room at floor selected 
const getRoomBaseSelect = (req, res) => {
  console.log(req.params.floorId)
  db.query(`
  SELECT RoomId, RoomName FROM Room WHERE FloorId = '${req.params.floorId}'
  `, (err, result)=>{
    if(err) throw err
    res.send({
      results: result
    })
  })
}

// get all room based on floor
const getAllRoom = (req, res) => {
  db.query(
    `
    SELECT r.RoomId ,r.RoomName FROM Room r;
    `,
    (error, results) => {
      if (error) throw error;
      res.status(200).send({
        status: "success",
        data: results,
      });
    }
  );
};



// get all shift based on available
const getAllShift = (req, res) => {
  db.query(
    `
    SELECT DISTINCT ra.ShiftId, s.ShiftName FROM Room r JOIN ReservationTransaction rt ON r.RoomId = rt.RoomId JOIN RoomAvailable ra ON ra.RoomId = rt.RoomId JOIN Shift s ON s.ShiftId=ra.ShiftId WHERE r.RoomId = '${req.params.roomId}' AND ra.isAvail = 1;
    `,
    (error, results) => {
      if (error) throw error;
      return res.status(200).send({
        msg: "success",
        data: results,
      });
    }
  );
};

// insert data to Borrower
const insertDataBorrower = (req, res) => {
  db.query(
    `
        INSERT INTO Borrower VALUES 
        ('${req.body.borrowerId}', '${req.body.borrowerName}', '${req.body.borrowerNim}', '${req.body.borrowerEmail}')
    `,
    (error, results) => {
      if (error) throw error;
      res.status(200).send({
        message: "success",
        data: results,
      });
    }
  );
};

// insert event data
const insertEventData = (req, res) => {
  db.query(
    `
        INSERT INTO EventData VALUES 
        ('${req.body.eventId}','${req.body.eventName}','${req.body.eventDescription}')
    `,
    (error, results) => {
      if (error) throw error;
      res.status(200).send({
        status: "success",
      });
    }
  );
};

// insert data to reservation table
const insertDataReservation = (req, res) => {
  let id1 = Math.floor(Math.random() * 9) + 1;
  let id2 = Math.floor(Math.random() * 9) + 1;
  let id3 = Math.floor(Math.random() * 9) + 1;

  let id1_str = id1.toString();
  let id2_str = id2.toString();
  let id3_str = id3.toString();

  let fixedId = "RT" + id1_str + id2_str + id3_str;

  db.query(
    `
        INSERT INTO ReservationTransaction VALUES
        ('${fixedId}', '${req.body.borrowerId}', '${req.body.adminId}','${req.body.roomId}','${req.body.eventId}',
        '${req.body.reservationDate}', '${req.body.status}', '${req.body.shiftId}', '${req.body.roomAvailableId}')
    `,
    (error, results) => {
      if (error) throw error;
      res.status(200).send({
        msg: "success",
        data: results,
      });
    }
  );
};

// get all booking reservation data
const getAllBookingReservation = (req, res) => {
  db.query(
    `
    SELECT rt.ReservationTransactionId, r.RoomName, ev.EventName, rt.ReservationDate, 
    s.ShiftName, rt.ReservationStatus, rt.RoomAvailableId FROM ReservationTransaction rt 
    JOIN Room r ON rt.RoomId = r.RoomId 
    JOIN EventData ev ON rt.EventId = ev.EventId JOIN Shift s ON rt.ShiftId = s.ShiftId;
    `,
    (error, result) => {
      if (error) throw error;
      res.status(200).send({
        msg: "success",
        data: result,
      });
    }
  );
};

// get RoomAvailableTransaction data
// const getRoomAvailableTransaction = (req, res) => {
//   db.query(
//     `
//     SELECT RATId FROM RoomAvailableTransaction'
//     `,
//     (error, result) => {
//       if (error) throw error;
//       res.status(200).send({
//         msg: "success",
//         data: result,
//       });
//     }
//   );
// };

// get one reservation based id reservation for detail
const getOneReservationDetailPage = (req, res) => {
  db.query(
    `
        SELECT 
        rt.ReservationTransactionId,r.RoomName,rt.ReservationDate,
        rt.ReservationStatus, sh.ShiftName, r.RoomID
        FROM ReservationTransaction rt JOIN 
        Borrower br ON rt.BorrowerId = br.BorrowerId 
        JOIN Room r ON r.RoomId = rt.RoomId 
        JOIN EventData ev ON rt.EventId = ev.EventId 
        JOIN Shift sh ON sh.ShiftId = rt.ShiftId
        WHERE rt.ReservationTransactionId = '${req.params.reservationTransactionId}'
        LIMIT 1
    `,
    (error, result) => {
      if (error) throw error;
      res.status(200).send({
        msg: "success",
        data: result,
      });
    }
  );
};

// get detail data for component reservation
const getDetailComponentReservation = (req, res) => {
  db.query(
    `
    SELECT 
    r.RoomName, f.FloorName,
    ev.EventName,
    ev.EventDescription, br.BorrowerName,
    br.BorrowerNIM, br.BorrowerEmail
    FROM ReservationTransaction rt JOIN 
    Borrower br ON rt.BorrowerId = br.BorrowerId 
    JOIN Room r ON r.RoomId = rt.RoomId 
    JOIN EventData ev ON rt.EventId = ev.EventId  
    JOIN Floor f ON r.FloorId = f.FloorId
    WHERE rt.ReservationTransactionId = '${req.params.reservationTransactionId}'
    LIMIT 1
    `,
    (error, results) => {
      if (error) throw error;
      res.status(200).send({
        msg: "success",
        data: results,
      });
    }
  );
};

// get data based on filter
const getDataBasedOnFilterDate = (req, res) => {

  // for mapping time slot 
  // Function to generate a full day schedule with meeting placeholders
  function generateFullDaySchedule(meetingData) {
    // Predefined time slots for a typical day
    const timeSlots = [
      '07.20 - 09.00',
      '09.20 - 11.00',
      '11.20 - 13.00',
      '13.20 - 15.00',
      '15.20 - 17.00',
      '17.20 - 19.00'
    ];

    // If no meeting data, return empty schedule
    if (!meetingData || meetingData.length === 0) {
      return timeSlots.map(timeSlot => ({
        MeetingTimes: timeSlot,
        ClassSection: '-',
        CourseDescription: '-',
        LecturerName: '-',
        FacilityID: '-'
      }));
    }

    // Create a map of existing meetings
    const meetingMap = new Map(
      meetingData.map(meeting => [meeting.MeetingTimes, meeting])
    );

    // Generate full schedule with existing or placeholder data
    return timeSlots.map(timeSlot => {
      const existingMeeting = meetingMap.get(timeSlot);
      
      if (existingMeeting) {
        return existingMeeting;
      }
      
      // If no meeting for this time slot, create a placeholder
      return {
        MeetingDay: meetingData[0]?.MeetingDay || null,
        MeetingTimes: timeSlot,
        ClassSection: '-',
        CourseDescription: '-',
        LecturerName: '-',
        FacilityID: '-',
        BinusianID: '-',
        StartDate: meetingData[0]?.StartDate || null // Use first meeting's date or null
      };
    });
  }

  const {date, facilityID} = req.query

  let query = `
        SELECT 
        m.MeetingID,
        m.MeetingDay, 
        m.MeetingTimes, 
        DATE(m.StartDate) AS StartDate, 
        m.FacilityID,
        m.ClassSection, 
        m.CourseDescription,
        l.BinusianID, 
        l.LectureName, 
        m.MeetCategory
        FROM 
        Meetings m JOIN 
        Lecturer l 
        ON m.LectureCode = l.LectureCode
        WHERE 1=1
    `

    if(date){
      query += ` AND m.StartDate = '${date}'`
    }

    if(facilityID){
      query += ` AND m.FacilityID = '${facilityID}'`
    }

    // Add ORDER BY for sorting MeetingTimes
    query += ` ORDER BY 
    CAST(SUBSTRING_INDEX(m.MeetingTimes, ' - ', 1) AS DECIMAL)`;

  db.query(
    query,
    (error, results) => {
      if (error) throw error;

      // generate schedule 
      const fullSchedule = generateFullDaySchedule(results)

      res.status(200).send({
        msg: "success",
        data: fullSchedule,
      });
    }
  );
};

// delete specific data
const deleteSpecificData = (req, res) => {
  db.query(
    `
        DELETE FROM ReservationTransaction WHERE ReservationTransactionId = '${req.params.reservationTransactionId}'
    `,
    (error, results) => {
      if (error) throw error;
      res.status(200).send({
        msg: "delete success",
      });
    }
  );
};

// update room available 
const updateRoomAvailableData = (req, res) => {
  db.query(`
    UPDATE RoomAvailable SET isAvail = ${req.body.isAvail} WHERE RoomId = '${req.params.roomId}'
  `,  (error, results)=>{
    if(error) throw error
    res.status(200).send({
      msg: "update success"
    })
  })
}

// update data
const updateSpecificData = (req, res) => {
  db.query(
    `
    UPDATE ReservationTransaction rt
    SET rt.RATId = '${req.body.RATId}'
    WHERE rt.ReservationTransactionId = '${req.params.reservationTransactionId}'
  `,
    (error, results) => {
      if (error) throw error;
      res.status(200).send({
        msg: "update success",
      });
    }
  );
};

// update reservation status data | reserved / decline 
const updateReservationStatusData = (req, res) => {
  db.query(`
    UPDATE ReservationTransaction 
    SET ReservationStatus = '${req.body.newstatus}'
    WHERE ReservationTransactionId = '${req.params.rtId}'
  `, (error, results)=>{
    if(error) throw error
    res.status(200).send({
      msg: 'update success'
    })
  })
}

// select RoomAvailableTransactionId base on RAT table
const getRatIdForUpdate = (req, res) => {
  db.query(
    `
    SELECT rat.RATId
    FROM RoomAvailableTransaction rat 
    WHERE rat.FloorId = '${req.params.floorId}'
    AND rat.RoomId = '${req.params.roomId}'
    AND rat.ShiftId = '${req.params.shiftId}'
  `,
    (error, results) => {
      if (error) throw error;
      res.status(200).send({
        msg: "success",
        data: results,
      });
    }
  );
};


// get all room available for borrow 
const getAllRoomAvail = (req, res) => {
  db.query(
    `SELECT rat.RATId, fl.FloorName, r.RoomName, s.ShiftName FROM RoomAvailableTransaction rat 
    JOIN Floor fl ON rat.FloorId=fl.FloorId JOIN 
    Room r ON r.RoomId=rat.RoomId JOIN Shift s ON s.ShiftId=rat.ShiftId
    ;`, (error, results)=>{
      if(error) throw error
      res.status(200).send({
        status: 'success', 
        data: results
      })
    })
}

// update status data Room Available Transaction
const updateStatusRatData = (req, res) => {
  db.query(
    `UPDATE RoomAvailableTransaction 
      SET RoomStatus = '${req.body.newStatus}'
      WHERE RATId = '${req.params.ratId}'
    `
  , (err, results)=>{
    if(err) throw err
    res.status(200).send({
      message: 'sucess'
    })

  })
}


// SPV update status rat 
const SPVUpdateStatusRat = (req, res) => {
  db.query(`
  UPDATE ReservationTransaction rt 
  JOIN RoomAvailableTransaction rat ON rt.RATId=rat.RATId
  SET rat.RoomStatus = '${req.body.newStatus}'
  WHERE rt.ReservationTransactionId = '${req.params.reservationTransactionId}'
  
  
  `, (error, result)=>{
    if(error) throw error
    res.status(200).send({
      msg: 'success'
    })
  })
}

// update isAvail in table RoomAvailable
const updateRoomIsAvail = (req, res) => {
  db.query(`
  UPDATE RoomAvailable 
  SET isAvail = ${req.body.isAvail}
  WHERE RoomAvailableId = '${req.params.roomAvailableId}'
  `, (error, result)=>{
    if(error) throw new Error(error.message)

    res.status(200).send({
      msg: 'success',
      data: result
    })
  })
}

// update room isAvail based on RT id after decline to 0
const updateRoomIsAvailDecline = (req, res) => {
  db.query(`

  UPDATE ReservationTransaction rt 
  JOIN RoomAvailable ra ON rt.RoomAvailableId = ra.RoomAvailableId 
  SET ra.isAvail = ${req.body.isAvail}
  WHERE rt.ReservationTransactionId = '${req.params.reservationTransactionId}'
  `, (error, result)=>{
    if(error) throw new Error(error.message)
    res.status(200).send({
      msg: 'success',
      data: result
    })
  })
}

// validasi next form borrower input 
const validationBorrower = (req, res) => {
  let name_borrower = req.body.name
  let nim_borrower = req.body.nim 
  let email_borrower = req.body.email
  let binusian_id = req.body.binusianid 

  let flag = 0

  // validate data name empty 
  if(name_borrower.length == 0) flag++
  if(nim_borrower.length == 0) flag++
  if(email_borrower.length == 0) flag++
  if(binusian_id.length == 0) flag++

  if(flag!=0){
    return res.status(400).send({
      status: 'error', 
      message: 'data cannot be empty !'
    })
  }

  return res.status(200).send({
    statuscode: 200, 
    status: 'success', 
  })
}

//validate event&room data
const validationRoomEventData = (req, res) => {
  let event_name = req.body.eventName
  let event_desc = req.body.eventDescription
  let facilityid_borrow = req.body.facilityid
  let meeting_times = req.body.meeting_times
  let start_date = req.body.start_date

  let flag = 0

  //validate empty
  if(event_name.length == 0) flag++
  if(event_desc.length == 0) flag++
  if(facilityid_borrow.length == 0) flag++
  if(meeting_times.length == 0) flag++
  if(start_date.length == 0) flag++

  if(flag!=0){
    return res.status(400).send({
      statuscode: 400, 
      status: 'error', 
      message: 'data cannot be empty !'
    })
  }

  // melakukan check apakah start_date, meet_times, dan facility id tersedia 
  let query = `
    SELECT 
	    m.MeetingID
    FROM Meetings m 
    WHERE 
      m.StartDate = '${start_date}'
    AND 
      m.MeetingTimes = '${meeting_times}'
    AND 
      m.FacilityID = '${facilityid_borrow}';
  `

  db.query(query, (err, results)=>{
    if(err){
      return res.status(400).send({
        "status": 400, 
        "message": err.message
      })
    }

    const formattedResults = results.map(row => ({ ...row }));

    // cek apakah data nya sudah ada, kalau sudah ada tidak bisa dipinjam 
    if(formattedResults.length != 0){
      return res.status(400).send({
        "message": "data has booked !"
      })
    }

    return res.status(200).send({
      "status": 200, 
      "message": "available for borrowing"
    })
  })
}

//validate inventory request
const validationInventoryRequest = (req, res) => {
  let inventory_request = req.body.inventoryId

  let flag = 0

  //validate empty
  if(inventory_request.length == 0) flag++

  if(flag!=0){
    return res.status(400).send({
      statuscode: 400,
      status: 'error', 
      message: 'data cannot be empty !'
    })
  }

  return res.status(200).send({
    statuscode: 200,
    status: 'success', 
  })

}


/**
 * 
 * v2 API Controller data
 * 
 *  */ 

/**
 * get all facility data 
 *
 */
const getAllFacility = (req, res) => {
  const query = `SELECT FacilityID FROM Facility`

  db.query(query, (error, results)=>{
    if(error){
      return res.status(404).send({
        "status": "failed", 
        "message": error.message
      })
    }

    return res.status(200).send({
      "status": "success", 
      "data": results 
    })
  })
}

/**
 * API for get all meetings data after excel is upload 
 */

const getAllMeetings = (req, res) => {

  const sqlQuery = `SELECT m.MeetingID ,m.MeetingDay, m.MeetingTimes, m.StartDate, m.FacilityID, m.ClassSection, m.CourseDescription, l.BinusianID, l.LectureName, m.MeetCategory FROM Meetings m JOIN Lecturer l ON m.LectureCode = l.LectureCode;`
  db.query(sqlQuery, (error, result)=>{
    if(error){
      return res.status(404).send({
        "message": error.message
      })
    }

    return res.status(200).send({
      "data": result
    })
  })
}

/**
 * insert data borrowing 
 * API for borrowing 
 */

const insertDataBorrowing = (req, res) => {

  console.log(req.body.facilityid)
  console.log(req.body.meetingtimes)
  console.log(req.body.startDate)

  // konversi data date ke hari
  const getDayName = (dateString) => {
    const date = new Date(dateString); // Konversi string menjadi Date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()]; // getDay() mengembalikan indeks hari (0 = Sunday, 6 = Saturday)
  };

  // generate uuid with crypto 
  const cryptoGenerateID = () => {
    return crypto.randomUUID()
  }

  // collect data for meetings table 
  const meetingid = uuidv4()
  const facilityid = req.body.facilityid
  const lectureCode = '-'
  const meetingday = getDayName(req.body.startDate)
  const meetingtimes = req.body.meetingtimes
  const startDate = req.body.startDate
  const classSection = '-'
  const courseDescription = req.body.eventName
  const meetCategory = 'Borrowing'

  // collect data for table borrower
  const borrowerId = cryptoGenerateID()
  const borrowerName = req.body.name
  const borrowerNim = req.body.nim
  const borrowerEmail = req.body.email

  // collect data for borrowing transaction 
  const eventDesc = req.body.eventDesc 

  // insert data to meetings
  const queryInsertMeetings = `
    INSERT INTO Meetings (MeetingID, FacilityID, MeetingDay, MeetingTimes, StartDate, ClassSection, CourseDescription, LectureCode, MeetCategory) VALUES 
    (?,?,?,?,?,?,?,?,?)
  `

  // insert data borrower 
  const queryInsertBorrower = `
    INSERT INTO Borrower (BorrowerID, BorrowerName, BorrowerNIM, BorrowerEmail)
    VALUES (?,?,?,?)
  `

  // query insert borrowingtransaction 
  const queryInsertBorrowingTransaction = `
    INSERT INTO BorrowingTransaction (MeetingID, BorrowerID, EventDesc)
    VALUES (?,?,?)
  `

  db.query(queryInsertMeetings, [
    meetingid, 
    facilityid, 
    meetingday, 
    meetingtimes, 
    startDate, 
    classSection, 
    courseDescription, 
    lectureCode, 
    meetCategory
  ], (error) => {
    if(error){
      return res.status(400).send({
        "message": error.message
      })
    }
  })

  // query insert borrower implementation
  db.query(queryInsertBorrower, [
    borrowerId, 
    borrowerName, 
    borrowerNim, 
    borrowerEmail
  ], (error)=>{
    if(error){
      return res.status(400).send({
        "message": error.message
      })
    }
    
  })

  db.query(queryInsertBorrowingTransaction, [
    meetingid, 
    borrowerId, 
    eventDesc
  ], (error)=>{
    if(error){
      return res.status(400).send({
        "message": error.message
      })
    }
  })

  return res.status(200).send({
    "message": "insert data has been successful !",
    "id_borrower": borrowerId
  })
}

/**
 * v2 get detail data meetings data
 */
const getDetailMeetingData = (req, res) => {
  const {meetingId} = req.params 

  // query detail data 
  let queryData = `
  SELECT 
    m.StartDate, 
    m.FacilityID, 
    m.MeetingTimes, 
    m.MeetCategory,
    m.ClassSection, 
    m.CourseDescription,
    CASE 
      WHEN bt.MeetingID IS NOT NULL THEN 'Borrowing'
      ELSE 'Lectures'
    END AS MeetingType,
    CASE 
      WHEN bt.MeetingID IS NOT NULL THEN 
        JSON_OBJECT(
          'BorrowerID', b.BorrowerID,
          'BorrowerName', b.BorrowerName
        )
      ELSE 
        JSON_OBJECT(
          'LectureCode', l.LectureCode, 
          'LectureName', l.LectureName
        )
    END AS DetailInfo
  FROM Meetings m
  LEFT JOIN BorrowingTransaction bt ON m.MeetingID = bt.MeetingID 
  LEFT JOIN Borrower b ON b.BorrowerID = bt.BorrowerID
  LEFT JOIN Lecturer l ON m.LectureCode = l.LectureCode
  WHERE m.MeetingID = ?
  `

  // implement query 
  db.query(queryData, [meetingId], (err, results)=>{
    if(err){
      return res.status(400).send({
        "message": err.message
      })
    }

    const processedResults = results.map(result => ({
      ...result,
      DetailInfo: typeof result.DetailInfo === 'string' 
        ? JSON.parse(result.DetailInfo) 
        : result.DetailInfo
    }));

    return res.status(200).send({
      "data": processedResults
    })
  })
}

// update data meeting based on StartDate, FacilityID, MeetingTimes
const updateMeetingData = (req, res) => {
  // Retrieve meeting ID
  const meetingId = req.params.meetingId;

  // Initialize query and input data
  let queryUpdateData = `UPDATE Meetings SET `;
  const inputDatas = [];
  const updates = [];

  // Validate if any fields are provided
  if (!req.body.StartDate && !req.body.FacilityID && !req.body.MeetingTimes) {
    return res.status(400).send({
      message: "Data cannot be empty",
    });
  }

  // Check and add StartDate to the query
  if (req.body.StartDate) {
    updates.push("StartDate = ?");
    inputDatas.push(req.body.StartDate);
  }

  // Check and add FacilityID to the query
  if (req.body.FacilityID) {
    updates.push("FacilityID = ?");
    inputDatas.push(req.body.FacilityID);
  }

  // Check and add MeetingTimes to the query
  if (req.body.MeetingTimes) {
    updates.push("MeetingTimes = ?");
    inputDatas.push(req.body.MeetingTimes);
  }

  // Combine updates with commas and add WHERE clause
  queryUpdateData += updates.join(", ") + " WHERE MeetingID = ?";
  inputDatas.push(meetingId);

  // Execute the query
  db.query(queryUpdateData, inputDatas, (err, results) => {
    if (err) {
      return res.status(500).send({
        message: "Error updating meeting data",
        error: err.message,
      });
    }

    // send email ketika sudah berhasil update 
    const getEmailData = `
      SELECT 
        b.BorrowerEmail, 
        bt.MeetingID, 
        m.FacilityID, 
        m.MeetingTimes, 
        m.StartDate
      FROM 
      Meetings m 
      JOIN 
      BorrowingTransaction bt 
      ON 
      m.MeetingID = bt.MeetingID
      JOIN 
      Borrower b 
      ON b.BorrowerID = bt.BorrowerID 
      WHERE bt.MeetingID = ?
    `

    // template html 
    const emailHtml = (borrowerEmail, meetingId, facilityId, meetingTimes, startDate) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        /* General styles for the email */
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          color: #333;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          background-color: #4CAF50;
          padding: 10px;
          border-radius: 8px 8px 0 0;
        }
        .header h1 {
          margin: 0;
          color: #ffffff;
        }
        .content {
          padding: 20px;
          line-height: 1.6;
        }
        .content p {
          margin: 0 0 10px;
        }
        .content .highlight {
          color: #4CAF50;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777;
          margin-top: 20px;
        }
        @media only screen and (max-width: 600px) {
          .email-container {
            width: 100%;
            padding: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Room Booking Update</h1>
        </div>
        <div class="content">
          <p>Dear <span class="highlight">${borrowerEmail}</span>,</p>
          <p>Your room booking has been successfully updated. Here are the updated details of your booking:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;">Meeting ID</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${meetingId}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;">Facility ID</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${facilityId}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;">Meeting Times</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${meetingTimes}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;">Start Date</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${startDate}</td>
            </tr>
          </table>
          <p>Thank you for using our service!</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Room Booking System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
`;


    db.query(getEmailData, [meetingId], (emailErr, emailResults) => {
      if (emailErr) {
        return res.status(500).send({
          message: "Error fetching borrower email",
          error: emailErr.message,
        });
      }

      if (emailResults.length === 0) {
        return res.status(404).send({
          message: "No borrower email found for this meeting",
        });
      }

      const borrowerEmail = emailResults[0].BorrowerEmail;

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
          to: `${borrowerEmail}`,
          attachDataUrls: true,
          subject: "Your Room Booking has been created !",
        html: emailHtml(
          borrowerEmail, 
          emailResults[0].MeetingID, 
          emailResults[0].FacilityID, 
          emailResults[0].MeetingTimes, 
          new Date(emailResults[0].StartDate).toLocaleDateString() 
        )
        }, (error, info) => {
          if(error) console.log(error)
    
          console.log(info)
        })
    })

    // Success response
    return res.status(200).send({
      message: "Update successful",
      data: inputDatas,
    });
  });
};


module.exports = {
  getDetailMeetingData, 
  getAllMeetings, 
  getAllRoom,
  getAllShift,
  insertDataBorrowing,
  insertDataReservation,
  insertDataBorrower,
  insertEventData,
  getAllBookingReservation,
  getOneReservationDetailPage,
  getDetailComponentReservation,
  getDataBasedOnFilterDate,
  deleteSpecificData,
  updateSpecificData,
  getRatIdForUpdate,
  updateReservationStatusData,
  getAllRoomAvail,
  updateStatusRatData,
  SPVUpdateStatusRat,
  updateRoomIsAvail,
  updateRoomAvailableData,
  updateRoomIsAvailDecline, 
  validationBorrower,
  validationRoomEventData,
  validationInventoryRequest, 
  getRoomBaseSelect, 
  getAllFacility, 
  updateMeetingData
};
