import React, { useCallback, useEffect, useState } from "react";
import SuccessModal from "./SuccessModal";
import axios from "axios";
import { getQrCode } from "../../../backend/src/utils/generatorQrCode";
import Notification from "./notification/Notification";
import { useNavigate } from "react-router-dom";

function FormEvent({ updateNextClick, eventNameTofront, eventDescToFront, floorIdToFront, roomIdToFront, shiftIdToFront, reservationDateToFront}) {
  const [floorArr, setFloorArr] = useState([]);
  const [getRoomArr, setRoomArr] = useState([]);
  const [getShiftArr, setShiftArr] = useState([]);
  const navigate = useNavigate();
  const [nextClick, setNextClick] = useState(true)
  const [floorClick, setFloorClick] = useState(false)
     const [okClickModal, setOkClickModal] = useState(false);

  const [getSelectFloor, setSelectFloor] = useState("FL001");
  const [getSelectShift, setSelectShift] = useState( "SH001" );
  const [getRoomId, setRoomId] = useState("RO001");
  const [getDate, setDate] = useState("");

  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");


  const [error, setError] = useState("")

 

  const minDate = () => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  };

  

  // modal clicked ok
  // const OkClicked = (click) => {
  //   setOkClickModal(click);
  //   setSaveClick(false);
  // };

  

  // get floor all data 
  const getAllFloorData = () => {
    axios.get(`http://localhost:8081/data/get-all-floor`)
    .then((data)=>{
      console.log(data.data.data)
      setFloorArr(data.data.data)
    })
  }

  // get room base floor 
  const getSelectedFloor = (e) => {
    axios.get(`http://localhost:8081/data/get-room-at-floor/${e.target.value}`)
    .then((data)=>{
      console.log(data.data.results)
      setRoomArr(data.data.results)
    })
  }

  // get shift data room
  const getShiftRoom = (e) => {
    axios.get(`http://localhost:8081/data/get-shift-room/${e.target.value}`)
    .then((res)=>{
      // console.log(res.data.data)
      setShiftArr(res.data.data)
    })
  }

  //validation form event borrow
  const validateFormEvent = () => {
    axios.post(`http://localhost:8081/data/validation-form-event-room-data`, {
      "eventName": eventName,
      "eventDescription": eventDesc,
      "floorId":  getSelectFloor,
      "roomId": getRoomId,
      "shiftId": getSelectShift,
      "reservationDate": getDate
    })
    .then((res)=>{
      console.log(res.data.statuscode == 200)
      // status code 200
        setNextClick(true);
        if(res.data.statuscode == 200){
          updateNextClick(2)
          eventNameTofront(eventName)
          eventDescToFront(eventDesc)
          floorIdToFront(getSelectFloor)
          roomIdToFront(getRoomId)
          shiftIdToFront(getSelectShift)
          reservationDateToFront(getDate)
          // ke summary
        
          // console.log('data saved')
          // dataSetMenuFunc(true)
        }
        // (nextClick) ? nextButtonClick(1) : 0
    })
    .catch((err)=>{
      console.log(err.response.data.message)
      setError(err.response.data.message)
    })
  }

  useEffect(()=>{
    getAllFloorData()
  }, [])

  return (
    <div className={"w-4/5"}>
      <div className={"w-full bg-white drop-shadow-2xl rounded-[20px]"}>
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
              className="w-full rounded-[10px] border border-2 px-3 py-1"
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
              className="w-full rounded-[10px] border border-2 px-3 py-1"
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
                console.log(e.target.value)
                getSelectedFloor(e)
                }}
              className="w-full rounded-[10px] border border-2 px-3 py-1"
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
              className="w-full rounded-[10px] border border-2 px-3 py-1"
              onChange={(e) => {
                getShiftRoom(e)
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
              className="w-full rounded-[10px] border border-2 px-3 py-1"
              onChange={(e) => {
                 setSelectShift(e.target.value) 
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
              className="w-full rounded-[10px] border border-2 px-3 py-1"
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
          {/* <button
            className=" px-1 py-2 rounded-[20px] text-white font-bold w-[200px] bg-[#57B4FF]"
            onClick={() => {
              // getRoomAvailableTransaction();
              console.log(getDate);
              // console.log(getRatId[0].RATId);

              // if(getRatId.length != 0){
               

              // }

            }}
          >
            Save
          </button> */}<button 
          onClick={()=>{
            validateFormEvent()
          }}className="bg-[#57B4FF] text-white font-bold w-28 rounded-[20px] px-1 py-2"
          >Next</button>
        </div>
        {
        error.length != 0 ? 
        <div className="text-xl text-red text-center">
          <h1>{error}</h1>
        </div>
        :
        <></>
      }
      </div>
      {/* {saveClick && <Notification />} */}
    </div>
  );
}

export default FormEvent;
