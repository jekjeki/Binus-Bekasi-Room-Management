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
    await fetch(`http://localhost:8080/admin/get-one-admin`, {
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
      .get(`http://localhost:8080/data/get-all-reservation`)
      .then((res) => {
        console.log(res);
        setArrReservation(res.data.data);
      })
      .catch((er) => console.log(er));
  };

  // get data based on filter date
  const filterDate = async () => {
    await fetch(
      `http://localhost:8080/data/filter-data-by-date/${dateFilter}`,
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

  useEffect(() => {
    // calculateTime()
    getCurrentLogin();
    getAllReservationTransaction();
    if (dateClick) {
      filterDate();
    }
  }, []);

  return (
    <div className="w-full">
      <div className="px-2 py-2">
        <h3 className="font-bold text-2xl px-2 py-2">{`Hello,  ${getAdminRole}`}</h3>
      </div>
      <div className="flex px-2 py-2">
        <div className="px-2">
          <input
            type="date"
            className="bg-[#F0F0F0] w-full rounded border px-1 py-1"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
            }}
          />
        </div>
        <button
          className="text-center bg-cyan-300 px-2 rounded text-white font-bold"
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
              {arrReservation.map((ar, idx) => {
                // calculateTime(ar.RATId, ar.ReservationDate)
                return (
                  <tr key={idx} className="text-center border border-1">
                    <td className="px-1 py-2">
                      {ar.ReservationTransactionId}
                    </td>
                    <td className="px-1 py-2">{ar.RoomName}</td>
                    <td className="px-1 py-2">{ar.EventName}</td>
                    <td className="px-1 py-2">
                      {
                        new Date(ar.ReservationDate)
                          .toISOString()
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
                        <button className="px-2 bg-sky-700 rounded px-1 py-1 text-white">
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
        <div>
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
