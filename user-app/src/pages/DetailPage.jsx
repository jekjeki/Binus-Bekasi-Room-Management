import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderDetail from "../component/HeaderDetail";
import DetailComponent from "../component/DetailComponent";
import axios from "axios";
import UpdateModel from "../component/UpdateModel";

function DetailPage() {
  const [arrRes, setArrRes] = useState([]);
  const { reservationTransactionId } = useParams();

  const [delClick, setDelClick] = useState(false);

  const [updateClick, setUpdateClick] = useState(false)

  const [btnUpdateModelClick, setBtnUpdateModelClick] = useState(false)

  const navigate = useNavigate()

  const btnUpdateModel = (value) => {
    setBtnUpdateModelClick(value)
  }

  // get all reservation data
  const getOneResevation = async () => {
    await fetch(
      `http://localhost:8080/data/get-one-reservation/${reservationTransactionId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json;charset=UTF-8",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setArrRes((arr) => [...arr, data.data]);
      });
  };

  // delete data 
  const deleteReservationTransaction = async () => {
    axios.delete(`http://localhost:8080/data/delete-specific-data/${reservationTransactionId}`)
    .then(()=>console.log('failed delete data!'))
    .catch((err)=>{
      console.log(err)
    })

    navigate('/home-lsc')
  }

  useEffect(() => {
    getOneResevation();
  }, []);

  return (
    <div className={"w-screen h-screen "}>
      <HeaderDetail reservationTransactionId={reservationTransactionId} />
      <div className={"flex w-screen h-screen "}>
        {
          updateClick ? (
            <UpdateModel reservationTransactionId={reservationTransactionId} 
            btnUpdateModel={btnUpdateModel} />
          ) : (
            <div className="w-full flex">
            <div className="w-3/4 h-1/4 ">
              <div className="w-full h-full flex justify-center items-center">
                <table className="table-auto rounded">
                  <thead className="bg-cyan-400 text-white font-bold rounded">
                    <tr className="">
                      <th className="px-2 py-2">Reservation Date</th>
                      <th className="px-2 py-2">Room Name</th>
                      <th className="px-2 py-2">Shift Borrowing</th>
                      <th className="px-2 py-2">Reservation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arrRes.map((ar, idx) => {
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
                          <td className="px-2 py-2">{ar[idx].ShiftName}</td>
                          <td className="px-2 py-2 flex">
                            {ar[idx].ReservationStatus}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="rgb(22 163 74)"
                              className="w-5 h-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
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
                      setDelClick(true)
                      deleteReservationTransaction()
                    }}
                  >
                    DELETE
                  </button>
                </div>
                <div className="mx-3">
                  <button className="bg-cyan-400 text-white font-bold px-2 py-2 rounded"
                    onClick={()=>setUpdateClick(true)}>
                    UPDATE
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
          )
        }
      </div>
    </div>
  );
}

export default DetailPage;
