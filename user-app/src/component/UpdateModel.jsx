import React, { useEffect, useState } from "react";
import axios from "axios";

function UpdateModel({ btnUpdateModel, reservationTransactionId }) {
  const [okUpdateClick, setOkUpdateClick] = useState(false);
  const [arrFloor, setArrFloor] = useState([])
  const [arrRoom, setArrRoom] = useState([])
  const [arrShift, setArrShift] = useState([])

  const [floorId, setFloorId] = useState('FL001')
  const [roomId, setRoomId] = useState('RO001')
  const [shiftId, setShiftId] = useState('SH001')

  const [ratId, setRatId] = useState('')

  const [fetchRel, setFetchRel] = useState(0)

  // get all floor 
  const getFloor = async () => {
    axios.get(`http://localhost:8081/data/get-all-floor`)
    .then((res)=>{
        setArrFloor(res.data.data)
        console.log(res.data)
    })
  }

  // get all room 
  const getAllRoom = async () => {
    axios.get(`http://localhost:8081/data/get-all-room-isAvail`)
    .then((res)=>{
        console.log(res.data.data[0])
        setArrRoom(res.data.data)
    })
  }

  // get all shift 
  const getAllShift = async () => {
    axios.get(`http://localhost:8081/data/get-shift-room`)
    .then((res)=>{
      console.log(res.data)
      setArrShift(res.data.data)
    })
  }

  // get rat id 
  const getRatId = async () => {
    axios.get(`http://localhost:8081/data/get-rat-id/${floorId}/${roomId}/${shiftId}`)
    .then((res)=>{

      setRatId(res.data.data[0].RATId)
    })
  }

  // patch the reservation data
  const patchResservationData = async () => {


    await fetch(`http://localhost:8081/data/update-reservation-data/${reservationTransactionId}`, {
      method: 'PATCH',
      headers: {
        "Content-type": "application/json;charset=UTF-8",
      }, 
      body: JSON.stringify({
        RATId: ratId
      })
    })

    console.log('succes update')
  }

  useEffect(()=>{
    getFloor()
    getAllRoom()
    getAllShift()
  }, [])

  return (
    <div className="w-full h-2/4 relative flex">
      <div className="w-2/4 border rounded bg-white absolute top-10 right-[300px] left-[300px]">
        <div className="text-center font-bold py-2">
          <h3>Update Borrowing Data</h3>
        </div>
        <div className="w-full px-6 py-2">
          <div>
            <p>Floor</p>
          </div>
          <div>
            <select className="border rounded px-1 py-1 w-full"
            onChange={(e)=>{
              setFloorId(e.target.value)
              }}>
                {
                    arrFloor.map((fl,idx)=>{
                        return(
                            <option key={idx} value={fl.FloorId}>
                                {fl.FloorName}
                            </option>
                        )
                    })
                }
            </select>
          </div>
        </div>
        <div className="w-full px-6 py-2">
          <div>
            <p>Room</p>
          </div>
          <div>
            <select className="border rounded px-1 py-1 w-full"
              onChange={(e)=>{
                setRoomId(e.target.value)
              }}  
            >
              {
                arrRoom.map((ar, idx) => {
                  return(
                    <option key={idx} value={ar.RoomId}>
                      {ar.RoomName}
                    </option>
                  )
                })
              }
            </select>
          </div>
        </div>
        <div className="w-full px-6 py-2">
          <div>
            <p>Shift</p>
          </div>
          <div>
            <select className="border rounded px-1 py-1 w-full"
              onChange={(e)=>{
                setShiftId(e.target.value)
              }}
            >
              {
                arrShift.map((ar,idx)=>{
                  return(
                    <option key={idx} value={ar.ShiftId}>
                      {ar.ShiftName}
                    </option>
                  )
                })
              }
            </select>
          </div>
        </div>
        <div className="w-full font-bold flex items-center justify-center">
          <button
            className="px-2 py-2 bg-cyan-400 w-1/4 my-4 mx-1 rounded text-white"
            onClick={() => {
              setOkUpdateClick(true);
              btnUpdateModel(okUpdateClick);
              getRatId()
              console.log(ratId)
              if(ratId !== ''){
                patchResservationData()
              }
            }}
          >
            OK
          </button>
          <button
            className="px-2 py-2 bg-red-600 w-1/4 my-4 mx-1 rounded text-white"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateModel;
