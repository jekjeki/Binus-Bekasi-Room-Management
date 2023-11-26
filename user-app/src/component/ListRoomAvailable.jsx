import axios from "axios";
import React, { useEffect, useState } from "react";

function ListRoomAvailable() {
  const [roomAvailables, setRoomAvailables] = useState([]);

  // get all room available for borrowing
  const getAllRoomAvailable = () => {
    axios
      .get(`http://localhost:8080/data/get-all-room-available`)
      .then((res) => {
        console.log(res.data.data);
        setRoomAvailables(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllRoomAvailable();
  }, []);

  // filter room isAvail
  let avails = roomAvailables.filter((ra)=>ra.isAvail==1)
  

  return (
    <table className="text-left rounded-lg">
      <thead className="bg-sky-300">
        <tr className="">
          <th scope="col" className="px-6 py-3">
            Room Id
          </th>
          <th scope="col" className="px-6 py-3">
            Floor
          </th>
          <th scope="col" className="px-6 py-3">
            Room 
          </th>
          <th scope="col" className="px-6 py-3">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {
            avails.map((ra, idx)=>{
                console.log(ra)
                return( 
                    <tr key={idx} className="text-center border border-1">
                        <td className="px-1 py-2">
                            {ra.RoomId}
                        </td>
                        <td className="px-1 py-2">
                            {ra.FloorName}
                        </td>
                        <td className="px-1 py-2">
                            {ra.RoomName}
                        </td>
                        <td>
                            {ra.isAvail && 'available'}
                        </td>
                    </tr>
                )
            })
        }
      </tbody>
    </table>
  );
}

export default ListRoomAvailable;
