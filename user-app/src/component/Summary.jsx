import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { getQrCode } from "../../../backend/src/utils/generatorQrCode";

const Summary = ({adminId, fixedIdBorrower, updateNextClick, name, nim, email, eventName, eventDescription, floorId, roomId, shiftId, reservationDate, inventoryId}) => {
    const [nextClick, setNextCLick] = useState(true)
    const [qr, setQr] = useState("")
    const [roomAvailables, setRoomAvailables] = useState([])
    const [saveClick, setSaveClick] = useState(false);
    const [floorArr, setFloorArr] = useState([]);
    const [getRoomArr, setRoomArr] = useState([]);
    const [getShiftArr, setShiftArr] = useState([]);
    const [getSelectShift, setSelectShift] = useState( "SH001" );



     // insert event data
  const insertEventData = async () => {
 // generate event id
 let ide1 = Math.floor(Math.random() * 9) + 1;
 let ide2 = Math.floor(Math.random() * 9) + 1;
 let ide3 = Math.floor(Math.random() * 9) + 1;

 let ide1_str = ide1.toString();
 let ide2_str = ide2.toString();
 let ide3_str = ide3.toString();

 let fixedEventId = "EV" + ide1_str + ide2_str + ide3_str;


    await fetch(`http://localhost:${process.env.PORT}/data/insert-event-data`, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        eventId: fixedEventId,
        eventName: eventName,
        eventDescription: eventDescription,
      }),
    }).then((res) => res.json());
  };

  const insertDataBorrower = async () => {

    // generate id for borrower
  let id1 = Math.floor(Math.random() * 9) + 1;
  let id2 = Math.floor(Math.random() * 9) + 1;
  let id3 = Math.floor(Math.random() * 9) + 1;

  let id1_str = id1.toString();
  let id2_str = id2.toString();
  let id3_str = id3.toString();

  let fixedIdBorrower = "BR" + id1_str + id2_str + id3_str;

    await fetch(`http://localhost:${process.env.PORT}/data/insert-data-borrower`, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        borrowerId: fixedIdBorrower,
        borrowerName: name,
        borrowerNim: nim,
        borrowerEmail: email,
      }),
    }).then((res) => res.json());
  };
  // insert data reservation
  const insertDataReservation = async () => {
    

    // data filter first 
    const filters = roomAvailables.filter((data)=>
      data.ShiftId == getSelectShift && data.RoomId == getRoomId
      )

      console.log(filters)

      if(filters[0].isAvail == 1){

      //   // masukkan data reservasi
        await fetch(`http://localhost:${process.env.PORT}/data/insert-data-reservation`, {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            borrowerId: fixedIdBorrower,
            adminId: adminId,
            roomId: roomId,
            eventId: eventName,
            reservationDate: reservationDate,
            shiftId : getSelectShift,
            status: "waiting approval",
            roomAvailableId: filters[0].RoomAvailableId
          }),
        });

      // //   // api for update isAvail in table RoomAvailable
        await fetch(`http://localhost:${process.env.PORT}/data/update-room-isavail/${filters[0].RoomAvailableId}`, {
          method: 'PATCH',
          headers: {
            "Content-type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            isAvail: 0
          })
        })
      }


    setSaveClick(true);
  };

  // get data floor
  const getAllFloor = async () => {
    axios
      .get(`http://localhost:${process.env.PORT}/data/get-all-floor`)
      .then((res) => {
      
        setFloorArr(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  //  get room data based floor
  const getRoomBaseFloor = async () => {

    axios
      .get(`http://localhost:${process.env.PORT}/data/get-room-at-floor`)
      .then((res) => {
        setRoomArr(res.data.data);
      })
      .catch((err) => console.log(err));
  };

 

  // get all shift data
  const getAllShift = async () => {
    axios
      .get(`http://localhost:${process.env.PORT}/data/get-shift-room`)
      .then((res) => {
        console.log(res.data.data)
        setShiftArr(res.data.data);
        console.log(res.data.data)

        getShiftArr.length == 0 ? setSelectShift(res.data.data[0]["ShiftId"]) : setSelectShift("SH001")
      })
      .catch((err) => console.log(err));
  };

  // send the email base on borrower data 
  const sendEmailToBorrower = async () => {
    axios.post(`http://localhost:8081/admin/send-email`, {
      email: email,
      borrowerName: name,
      nim: nim,
      date: reservationDate,
    })
    .then((res)=>{
      console.log(res)
    })
    .catch((err)=>{
      console.log(err)
    })
    
  }

  // generate QR CODE 
  const generateQRCode = useCallback(()=>{
    const qrVal = getQrCode(eventName)
    if(!qrVal) return
    setQr(eventName)
  }, [eventName, setQr])

  // get room available data 
  const getRoomAvailableData = async () => {
    axios.get(`http://localhost:${process.env.PORT}/data/get-all-room-available`)
    .then((res)=>{
      setRoomAvailables(res.data.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  useEffect(() => {
    getAllFloor();
    getRoomBaseFloor();
    getAllShift();
    getRoomAvailableData()

  }, []);

    // save button click 
    const saveBtnClick = () => {
        insertEventData()
        insertDataBorrower()
        insertDataReservation()
        generateQRCode()
        sendEmailToBorrower()
    }

    return (
        <div className={"w-4/5"}>
          <div className={"w-full bg-white drop-shadow-2xl rounded-[20px]"}>
            <div className="font-bold text-xl text-center py-6">
              <p>Summary</p>
            </div>
            <div className="flex">
            <div className="font-bold px-10 py-3">
                    <p>Name:</p>
                    <div className="font-normal ">
                        <p>{name}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3">
                    <p>NIM:</p>
                    <div className="font-normal">
                        <p>{nim}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3">
                    <p>email:</p>
                    <div className="font-normal">
                        <p>{email}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3 ">
                    <p>Event Name:</p>
                    <div className="font-normal ">
                        <p>{eventName}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3">
                    <p>Event Description:</p>
                    <div className="font-normal">
                        <p>{eventDescription}</p>
                        </div>
                </div>
                </div>

                <div className="flex">
                <div className="font-bold px-10 py-3">
                    <p>Floor:</p>
                    <div className="font-normal">
                        <p> {floorId}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3">
                    <p>Room:</p>
                    <div className="font-normal">
                        <p>{roomId}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3">
                    <p>Shift:</p>
                    <div className="font-normal">
                        <p>{shiftId}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3">
                    <p>Reservation Date:</p>
                    <div className="font-normal">
                        <p>{reservationDate}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3">
                    <p>Inventory Request:</p>
                    <div className="font-normal">
                        <p>{inventoryId}</p>
                        </div>
                </div>
                </div>

            <div className="px-5 py-4 flex justify-center align-center">
           <button 
              onClick={()=>{
                setNextCLick(true);
                (nextClick) ? updateNextClick(5) : 0
              }}className="bg-[#57B4FF] text-white font-bold w-28 rounded-[20px] px-1 py-2"
              >Save</button>
            </div>
            </div>
        </div>
    
      );

}

export default Summary