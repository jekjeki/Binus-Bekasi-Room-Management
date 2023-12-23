import React, { useCallback, useEffect, useState } from "react";
import SuccessModal from "./SuccessModal";
import axios from "axios";
import { getQrCode } from "../../../backend/src/utils/generatorQrCode";
import Notification from "./notification/Notification";
import { useNavigate } from "react-router-dom";

function FormEvent({ nameBorrower, nimBorrower, emailBorrower, adminId, dataSetMenuFunc }) {
  const [floorArr, setFloorArr] = useState([]);
  const [getRoomArr, setRoomArr] = useState([]);
  const [getShiftArr, setShiftArr] = useState([]);
  const navigate = useNavigate();

  const [getSelectFloor, setSelectFloor] = useState("FL001");
  const [getSelectShift, setSelectShift] = useState("SH001");
  const [getRoomId, setRoomId] = useState("RO001");
  const [getDate, setDate] = useState("");

  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");

  const [floorClick, setFloorClick] = useState(false)

  const [saveClick, setSaveClick] = useState(false);

  const [okClickModal, setOkClickModal] = useState(false);
  const [qr, setQr] = useState("")
  const [roomAvailables, setRoomAvailables] = useState([])

  const minDate = () => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  };

  // generate id for borrower
  let id1 = Math.floor(Math.random() * 9) + 1;
  let id2 = Math.floor(Math.random() * 9) + 1;
  let id3 = Math.floor(Math.random() * 9) + 1;

  let id1_str = id1.toString();
  let id2_str = id2.toString();
  let id3_str = id3.toString();

  let fixedIdBorrower = "BR" + id1_str + id2_str + id3_str;

  // modal clicked ok
  // const OkClicked = (click) => {
  //   setOkClickModal(click);
  //   setSaveClick(false);
  // };

  // insert borrower data
  const insertDataBorrower = async () => {
    await fetch(`http://localhost:8080/data/insert-data-borrower`, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        borrowerId: fixedIdBorrower,
        borrowerName: nameBorrower,
        borrowerNim: nimBorrower,
        borrowerEmail: emailBorrower,
      }),
    }).then((res) => res.json());
  };

  // generate event id
  let ide1 = Math.floor(Math.random() * 9) + 1;
  let ide2 = Math.floor(Math.random() * 9) + 1;
  let ide3 = Math.floor(Math.random() * 9) + 1;

  let ide1_str = ide1.toString();
  let ide2_str = ide2.toString();
  let ide3_str = ide3.toString();

  let fixedEventId = "EV" + ide1_str + ide2_str + ide3_str;

  // insert event data
  const insertEventData = async () => {
    await fetch(`http://localhost:8080/data/insert-event-data`, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        eventId: fixedEventId,
        eventName: eventName,
        eventDescription: eventDesc,
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

        // masukkan data reservasi
        await fetch(`http://localhost:8080/data/insert-data-reservation`, {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            borrowerId: fixedIdBorrower,
            adminId: adminId,
            roomId: getRoomId,
            eventId: fixedEventId,
            reservationDate: getDate,
            shiftId : getSelectShift,
            status: "waiting approval",
            roomAvailableId: filters[0].RoomAvailableId
          }),
        });

        // api for update isAvail in table RoomAvailable
        await fetch(`http://localhost:8080/data/update-room-isavail/${filters[0].RoomAvailableId}`, {
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
      .get(`http://localhost:8080/data/get-all-floor`)
      .then((res) => {
        console.log(res);
        setFloorArr(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  //  get room data based floor
  const getRoomBaseFloor = async () => {

    axios
      .get(`http://localhost:8080/data/get-room-at-floor`)
      .then((res) => {
        setRoomArr(res.data.data);
      })
      .catch((err) => console.log(err));
  };

 

  // get all shift data
  const getAllShift = async () => {
    axios
      .get(`http://localhost:8080/data/get-shift-room`)
      .then((res) => {
        setShiftArr(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  // send the email base on borrower data 
  const sendEmailToBorrower = async () => {
    axios.post(`http://localhost:8080/admin/send-email`, {
      email: emailBorrower,
      borrowerName: nameBorrower,
      nim: nimBorrower,
      date: getDate,
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
    axios.get('http://localhost:8080/data/get-all-room-available')
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

  return (
    <div className={"w-3/5  "}>
      <div className={"w-full bg-white drop-shadow-2xl rounded"}>
        <div className="text-center font-bold py-2">
          <p>Event & Room Data</p>
        </div>
        <div className="px-5 py-2">
          <div>
            <label htmlFor="event">Event Name</label>
          </div>
          <div>
            <input
              id="event"
              className="bg-[#F0F0F0] w-full rounded border px-1 py-1"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => {
                setEventName(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="px-5 py-2">
          <div>
            <label htmlFor="nim">Event Description</label>
          </div>
          <div>
            <textarea
              className="bg-[#F0F0F0] w-full rounded border px-1 py-1"
              placeholder="Event Description"
              value={eventDesc}
              onChange={(e) => {
                setEventDesc(e.target.value);
              }}
            ></textarea>
          </div>
        </div>
        <div className="px-5 py-2">
          <div>
            <label htmlFor="floor">Floor</label>
          </div>
          <div>
            <select
              name=""
              id="floor"
              onChange={(e) => {
                setFloorClick(true)
                setSelectFloor(e.target.value)}}
              className="bg-[#F0F0F0] w-full rounded border px-1 py-1"
            >
              {floorArr.map((fl, idx) => {
                return (
                  <option key={idx}
                  value={fl.FloorId}>
                    {fl.FloorName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="px-5 py-2">
          <div>
            <label htmlFor="room">Room</label>
          </div>
          <div>
            <select
              name=""
              id="room"
              placeholder="room"
              className="bg-[#F0F0F0] w-full rounded border px-1 py-1"
              onChange={(e) => {
                setRoomId(e.target.value);
              }}
            >
              {getRoomArr.map((gr, idx) => {
                return (
                  <option key={idx} value={gr["RoomId"]}>
                    {gr["RoomName"]}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="px-5 py-2">
          <div>
            <label htmlFor="shift">Shift</label>
          </div>
          <div>
            <select
              name=""
              id="shift"
              placeholder="shift"
              className="bg-[#F0F0F0] w-full rounded border px-1 py-1"
              onChange={(e) => {
                setSelectShift(e.target.value);
              }}
            >
              {getShiftArr.map((gs, idx) => {
                return (
                  <option key={idx} value={gs["ShiftId"]}>
                    {gs["ShiftName"]}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="px-5 py-2">
          <div>
            <label htmlFor="date">Reservation Date</label>
          </div>
          <div>
            <input
              className="bg-[#F0F0F0] w-full rounded border px-1 py-1"
              type="date"
              name="date"
              id="date"
              min={minDate()}
              value={getDate}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="px-5 py-2 flex justify-center align-center">
          <button
            className=" px-1 py-1 rounded text-white font-bold w-[200px] bg-[#57B4FF]"
            onClick={() => {
              // getRoomAvailableTransaction();
              console.log(getDate);
              // console.log(getRatId[0].RATId);

              // if(getRatId.length != 0){
                
                insertEventData()
                insertDataBorrower()
                insertDataReservation()
                generateQRCode()
                sendEmailToBorrower()
                console.log('data saved')
                dataSetMenuFunc(true)

              // }

            }}
          >
            Save
          </button>
        </div>
      </div>
      {saveClick && <Notification />}
    </div>
  );
}

export default FormEvent;
