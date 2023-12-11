const mysql = require("mysql");
const db = require("../configs/connection");

// get floor data
const getFloor = (req, res) => {
  db.query(`SELECT * FROM Floor`, (error, results) => {
    if (error) throw error;
    return res.status(200).send({
      status: "success",
      data: results,
    });
  });
};

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
    SELECT * FROM Shift
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
        rt.ReservationStatus, sh.ShiftName
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
  db.query(
    `
        SELECT 
        rt.ReservationTransactionId,
        ro.RoomName,
        ev.EventName,
        rt.ReservationDate,
        rt.ReservationStatus,
        s.ShiftName
        FROM ReservationTransaction rt 
        JOIN Room ro ON rt.RoomId = ro.RoomId
        JOIN EventData ev ON rt.EventId = ev.EventId
        JOIN RoomAvailable ra ON rt.RoomAvailableId = ra.RoomAvailableId 
        JOIN Shift s ON s.ShiftId = ra.ShiftId
        WHERE ReservationDate = '${req.params.date}'
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


// get room available v2
const getRoomIsAvail = (req, res) => {
  db.query(`
    SELECT * FROM RoomAvailable ra JOIN Room r ON ra.RoomId=r.RoomId 
    JOIN Shift s ON ra.ShiftId = s.ShiftId JOIN Floor f ON r.FloorId=f.FloorId
  `, (error, result)=>{
    if(error) throw new Error(error.message)

    res.status(200).send({
      msg: 'success',
      data: result
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



module.exports = {
  getFloor,
  getAllRoom,
  getAllShift,
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
  getRoomIsAvail,
  updateRoomIsAvail
};
