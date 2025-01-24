import React, { useCallback, useEffect, useState } from "react";
import SuccessModal from "./SuccessModal";
import axios from "axios";
import { getQrCode } from "../../../backend/src/utils/generatorQrCode";
import Notification from "./notification/Notification";
import { useNavigate } from "react-router-dom";

function FormEvent({setNextClick, eventNameTofront, eventDescToFront, roomIdToFront, shiftIdToFront, reservationDateToFront}) {
  
  const [eventName, setEventName] = useState('')
  const [eventDesc, setEventDesc] = useState('')
  const [facilityid, setFacilityid] = useState('')
  const [meetingTimes, setMeetingTimes] = useState('')
  const [getDate, setDate] = useState('')
  const [error, setError] = useState('')
  const [facilities, setFacilities] = useState([])

  const minDate = () => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  };

   // shift data
   const shiftDatas = [
    '07.20 - 09.00', 
    '09.20 - 11.00', 
    '11.20 - 13.00', 
    '13.20 - 15.00', 
    '15.20 - 17.00', 
    '17.20 - 19.00'
  ]

  // get data facility 
  const getFacilities = () => {
    axios.get(`http://localhost:8081/data/get-facilities`)
    .then((res)=>{
      setFacilityid(res.data.data[0]?.FacilityID)
      setFacilities(res.data.data)
      setMeetingTimes(shiftDatas[0])
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  //validation form event borrow
  const validateFormEvent = () => {
    axios.post(`http://localhost:8081/data/validation-form-event-room-data`, {
      "eventName": eventName,
      "eventDescription": eventDesc,
      "facilityid": facilityid,
      "meeting_times": meetingTimes,
      "start_date": getDate
    })
    .then((res)=>{
      console.log(res.data.statuscode == 200)
      console.log({
        eventName, 
        eventDesc, 
        facilityid, 
        meetingTimes, 
        getDate
      })
      // status code 200
        if(res.data.status== 200){

          setNextClick(2)
          eventNameTofront(eventName)
          eventDescToFront(eventDesc)
          roomIdToFront(facilityid)
          shiftIdToFront(meetingTimes)
          reservationDateToFront(getDate)
          // ke summary
        
        }
        // (nextClick) ? nextButtonClick(1) : 0
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    getFacilities()
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
              onChange={(e)=>setEventName(e.target.value)}
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
              onChange={(e)=>setEventDesc(e.target.value)}
            ></textarea>
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
              value={facilityid}
              onChange={(e)=>setFacilityid(e.target.value)}
            >
              {facilities.map((fa)=>(
                <option key={fa.FacilityID} value={fa.FacilityID}>{fa.FacilityID}</option>
              ))}
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
              value={meetingTimes}
              onChange={(e)=>setMeetingTimes(e.target.value)}
            >
              {shiftDatas.map((sh)=>(
                <option key={sh} value={sh}>{sh}</option>
              ))}
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
              // value={}getDate
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="px-5 py-2 flex justify-center align-center">
          <button 
          onClick={()=>{
            validateFormEvent()
            
          }}className="bg-[#57B4FF] text-white font-bold w-28 rounded-[20px] px-1 py-2"
          >Next</button>
        </div>
        {
        // error.length != 0 ? 
        // <div className="text-xl text-red text-center">
        //   <h1></h1>
        // </div>
        // :
        // <></>
      }
      </div>
      {/* {saveClick && <Notification />} */}
    </div>
  );
}

export default FormEvent;
