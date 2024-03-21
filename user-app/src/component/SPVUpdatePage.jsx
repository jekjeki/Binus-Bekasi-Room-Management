import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import HeaderDetail from './HeaderDetail'
import DetailComponent from './DetailComponent'
import axios from 'axios'

function SPVUpdatePage() {

    const { reservationTransactionId } = useParams()
    const [arrRes, setArrRes] = useState([])
    const [getRatId, setRatId] = useState('')
    const navigate = useNavigate()
    // get one reservation data
    const getOneReservation = async () => {
        await fetch(`http://localhost:8081/data/get-one-reservation/${reservationTransactionId}`,{
            method: 'GET', 
            headers: {
                "Content-type": "application/json;charset=UTF-8",
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data.data)
            setArrRes((arr)=>[...arr, data.data])
        })
    }

    // accept decline reservation data
    const AcceptDeclineData = async (value) => {
        await fetch(`http://localhost:8081/data/manager-update-reservation-status/${reservationTransactionId}`,{
            method: 'PATCH',
            headers: {
                "Content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
                newstatus: value
            })
        })

        // validate data 
        if(value == 'decline'){
          axios.patch(`http://localhost:8081/data/spv-update-isavail/${reservationTransactionId}`, {
            isAvail: 1
          })
          .then((res)=>{
            console.log(res.data)
          })
          .catch((error)=>{
            console.error(error)
          })
        } else {
         
        }

        setTimeout(()=>{
          navigate('/manager-dashboard')
        }, 3000)
    }

    useEffect(()=>{
        getOneReservation()
    },[])

  return (
    <div>
        <HeaderDetail reservationTransactionId={reservationTransactionId} />
        <div className='flex w-screen h-screen'>
        <div className="w-full flex">
            <div className="w-3/4 h-1/4 ">
              <div className="w-full h-full flex justify-center items-center">
                <table className="table-auto rounded">
                  <thead className="bg-cyan-400 text-white font-bold rounded">
                    <tr className="">
                      <th className="px-2 py-2">Reservation Date</th>
                      <th className="px-2 py-2">Room Name</th>
                      <th className="px-2 py-2">Reservation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arrRes.map((ar, idx) => {
                      // setRatId(ar[idx].RATId)
                      return (
                        <tr key={idx} className="border">
                          <td className="px-2 py-2">
                            {
                              new Date(ar[idx].ReservationDate)
                                .toISOString()
                                .split("T")[0]
                            }
                          </td>
                          <td className="px-2 py-2">{ar[idx].RoomName}</td>
                          <td className="px-2 py-2 flex">
                            {ar[idx].ReservationStatus}

                            {
                                (ar[idx].ReservationStatus=='reserved') ? (
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="rgb(46 171 90)"
                                    className="w-5 h-5"
                                    >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                    </svg>
                                ) : (
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="rgb(163 171 184)"
                                    className="w-5 h-5"
                                    >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                    </svg>
                                )
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="w-full flex justify-center items-center">
                <div className="mx-3">
                  <button
                    className="bg-red-600 text-white font-bold px-2 py-2 rounded"
                    onClick={() => {
                        
                        AcceptDeclineData('decline')
                    }}
                  >
                    Decline Reservation
                  </button>
                </div>
                <div className="mx-3">
                  <button className="bg-cyan-400 text-white font-bold px-2 py-2 rounded"
                    onClick={()=>{
                        AcceptDeclineData('reserved')
                        // accept()
                    }}>
                        Accept Reservation
                  </button>
                </div>
              </div>
              </div>
            <div className="w-1/4">
              <DetailComponent
                reservationTransactionId={reservationTransactionId}
              />
            </div>
          </div>
        </div>
    </div>
  )
}

export default SPVUpdatePage