import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { getQrCode } from "../../../backend/src/utils/generatorQrCode";
import Swal from 'sweetalert2'

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
        Swal.fire({
          title: "Data Saved !", 
          text: "Successful save the data !", 
          icon: "success",
          confirmButtonColor: "#3085d6"
        }).then((result)=>{
          if(result.isConfirmed){
            window.location.reload()
          }
        })

        

        insertDataBorrowing()
    }

    return (
      <div className="w-4/5 mx-auto">
      <div className="w-full bg-white drop-shadow-2xl rounded-[20px] p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-3xl text-gray-800">Summary</h1>
        </div>
  
        {/* Borrower Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <p className="font-semibold text-gray-600">Name:</p>
            <p className="text-gray-800">{borrower.name}</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gray-600">NIM:</p>
            <p className="text-gray-800">{borrower.nim}</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gray-600">Email:</p>
            <p className="text-gray-800">{borrower.email}</p>
          </div>
        </div>
  
        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <p className="font-semibold text-gray-600">Event Name:</p>
            <p className="text-gray-800">{events.eventName}</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gray-600">Event Description:</p>
            <p className="text-gray-800">{events.eventDesc}</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gray-600">Room:</p>
            <p className="text-gray-800">{events.facilityid}</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gray-600">Shift:</p>
            <p className="text-gray-800">{events.meetingTimes}</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gray-600">Reservation Date:</p>
            <p className="text-gray-800">{events.startDate}</p>
          </div>
        </div>
  
        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={saveBtnClick}
            className="bg-[#57B4FF] hover:bg-[#45A0E6] text-white font-bold rounded-[20px] px-6 py-3 transition duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
    
      );

}

export default Summary