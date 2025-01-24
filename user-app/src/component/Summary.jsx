import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { getQrCode } from "../../../backend/src/utils/generatorQrCode";

const Summary = ({borrower, events}) => {

  console.log({
    borrower, 
    events
  })

  /**
   * insert data borrowing v2
   */
  const insertDataBorrowing = () => {
    
    axios.post(`http://localhost:8081/data/insert-data-borrowing`, {
      facilityid: events.facilityid, 
      meetingtimes: events.meetingTimes, 
      startDate: events.startDate, 
      eventName: events.eventName, 
      name: borrower.name, 
      nim: borrower.nim, 
      email: borrower.email, 
      eventDesc: events.eventDesc
    })
    .then((res)=>{
      console.log(res.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  }


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
  // const generateQRCode = useCallback(()=>{
  //   const qrVal = getQrCode(eventName)
  //   if(!qrVal) return
  //   setQr(eventName)
  // }, [eventName, setQr])


    // save button click 
    const saveBtnClick = () => {
        insertDataBorrowing()
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
                        <p>{borrower.name}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3">
                    <p>NIM:</p>
                    <div className="font-normal">
                        <p>{borrower.nim}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3">
                    <p>email:</p>
                    <div className="font-normal">
                        <p>{borrower.email}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3 ">
                    <p>Event Name:</p>
                    <div className="font-normal ">
                        <p>{events.eventName}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3">
                    <p>Event Description:</p>
                    <div className="font-normal">
                        <p>{events.eventDesc}</p>
                        </div>
                </div>
                </div>

                <div className="flex">
                <div className="font-bold px-10 py-3">
                    <p>Room:</p>
                    <div className="font-normal">
                        <p>{events.facilityid}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3">
                    <p>Shift:</p>
                    <div className="font-normal">
                        <p>{events.meetingTimes}</p>
                        </div>
                </div>
                <div className="font-bold px-10 py-3">
                    <p>Reservation Date:</p>
                    <div className="font-normal">
                        <p>{events.startDate}</p>
                        </div>
                </div>
              </div>

            <div className="px-5 py-4 flex justify-center align-center">
           <button 
              onClick={()=>{
                /**
                 * still empty
                 */
                saveBtnClick()
              }}className="bg-[#57B4FF] text-white font-bold w-28 rounded-[20px] px-1 py-2"
              >Save</button>
            </div>
            </div>
        </div>
    
      );

}

export default Summary