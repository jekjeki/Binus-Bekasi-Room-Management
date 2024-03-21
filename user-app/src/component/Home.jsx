import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [getAdminRole, setAdminRole] = useState("");
  const [arrReservation, setArrReservation] = useState([]);
  const [dateFilter, setDateFilter] = useState("");

  const [dateClick, setDateClick] = useState(false);
  const [getLen, setLen] = useState(0);

  const [getAllFilter, setAllFilter] = useState([]);

  // get manual id
  const [getTrId, setTrId] = useState("");

  // const get current user login
  const getCurrentLogin = async () => {
    await fetch(`http://localhost:8081/admin/get-one-admin`, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setAdminRole(data.data.AdminRole);
      });
  };

  const getAllReservationTransaction = async () => {
    axios
      .get(`http://localhost:8081/data/get-all-reservation`)
      .then((res) => {
        console.log(res);
        setArrReservation(res.data.data);
      })
      .catch((er) => console.log(er));
  };

  // get data based on filter date
  const filterDate = async () => {
    await fetch(
      `http://localhost:8081/data/filter-data-by-date/${dateFilter}`,
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
        setAllFilter((arr) => [...arr, data.data]);
        setLen(data.data.length);
        console.log(data.data.length);
        setTrId(data.data[0].ReservationTransactionId);
      });
  };

  // UPDATE isAvail with interval
  const updateisAvailWithInterval = () => {
    arrReservation.map(async (ar)=>{
      console.log(ar)
      
      var d = new Date(ar.ReservationDate).getDate()
      var m = new Date(ar.ReservationDate).getMonth()
       
       var curr = new Date().getDate()
       var currM = new Date().getMonth()

       // melakukan update
       if(currM > m || curr > d ){
        console.log(curr)
        console.log(currM)

        await fetch(`http://localhost:8081/data/update-room-isavail/${ar.RoomAvailableId}`, {
          method: 'PATCH',
          headers: {
            "Content-type": "application/json;charset=UTF-8",
          },
          body: {
            isAvail: 1
          }
        })
        .then((res)=>res.json())
        .then((data)=>console.log(data))
        

       }

    })
  }

  useEffect(() => {
    updateisAvailWithInterval()
    getCurrentLogin();
    getAllReservationTransaction();
    if (dateClick) {
      filterDate();
    }
  }, []);

  return (
    <div className="bg-home drop-shadow-md m-[40px]">
      <div className="px-2 py-2">
        <h3 className="font-bold text-2xl text-[#381CA9] px-2 py-2">{`Hello,  ${getAdminRole}`}</h3>
      </div>
      <div className="flex px-2 py-2">
        <div className="px-2">
          <input
            type="date"
            className="bg-[#F2F0F0] w-full  rounded-[20px] border px-5 py-2"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
            }}
          />
        </div>
        <button
          className="text-center bg-cyan-300 px-5 rounded-[20px] text-black font-bold"
          onClick={() => {
            // console.log(dateFilter)
            filterDate();
            setDateClick(true);
          }}
        >
          Filter
        </button>
      </div>
      {!dateClick ? (
        <div className="flex w-full justify-center align-center items-center py-[50px]">
          <table className="text-left rounded-lg">
            <thead className="bg-sky-200">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Reservation Id
                </th>
                <th scope="col" className="px-6 py-3">
                  Room
                </th>
                <th scope="col" className="px-6 py-3">
                  Event
                </th>
                <th scope="col" className="px-6 py-3">
                  Reservation Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Shift
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {arrReservation.map((ar, idx) => {
                // calculateTime(ar.RATId, ar.ReservationDate)
                return (
                  <tr key={idx} className="text-center border border-1 ">
                    <td className="px-1 py-2">
                      {ar.ReservationTransactionId}
                    </td>
                    <td className="px-1 py-2">{ar.RoomName}</td>
                    <td className="px-1 py-2">{ar.EventName}</td>
                    <td className="px-1 py-2">
                      {
                        new Date(ar.ReservationDate)
                          .toLocaleDateString()
                          .split("T")[0]
                      }
                    </td>
                    <td className="px-1 py-2">{ar.ReservationStatus}</td>
                    <td className="px-1 py-2">{ar.ShiftName}</td>
                    <td className="px-1 py-2">
                      <Link
                        to={(getAdminRole == 'LSC') ? `/reservation/${ar.ReservationTransactionId}` : (getAdminRole == 'SPV') ?
                        `/spv-update-page/${ar.ReservationTransactionId}` : ``
                      }
                      >
                        <button className="px-2 bg-sky-800 rounded-[30px] px-2 py-2 text-white">
                          {
                            (getAdminRole=='LSC')?`Detail`:`Detail & Update`
                          }
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex w-full justify-center align-center items-center py-[50px]">
          {getLen != 0 && (
            <div>
              <table className="text-left rounded-lg">
                <thead className="bg-sky-300">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Reservation Id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Room
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Reservation Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Shift
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {getAllFilter.map((gaf, idx) => {
                    console.log(getAllFilter);
                    return (
                      <tr key={idx} className="text-center border border-1">
                        <td className="px-1 py-2">
                          {gaf[idx].ReservationTransactionId}
                        </td>
                        <td className="px-1 py-2">{gaf[idx].RoomName}</td>
                        <td className="px-1 py-2">{gaf[idx].EventName}</td>
                        <td className="px-1 py-2">
                          {
                            new Date(gaf[idx].ReservationDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </td>
                        <td className="px-1 py-2">
                          {gaf[idx].ReservationStatus}
                        </td>
                        <td className="px-1 py-2">{gaf[idx].ShiftName}</td>
                        <td className="px-1 py-2">
                          <Link
                            to={`/reservation/${gaf[idx]["ReservationTransactionId"]}`}
                          >
                            <button className="px-2 bg-sky-700 rounded px-1 py-1 text-white">
                              Detail
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
