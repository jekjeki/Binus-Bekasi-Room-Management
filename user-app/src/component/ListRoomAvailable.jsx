import axios from "axios";
import React, { useEffect, useState } from "react";
import {Table, Tag} from "antd"

function ListRoomAvailable() {
  const [roomAvailables, setRoomAvailables] = useState([]);

  // get all room available for borrowing
  const getAllRoomAvailable = () => {
    axios
      .get(`http://localhost:${process.env.PORT}/data/get-all-room-available`)
      .then((res) => {
        console.log(res.data.data);
        setRoomAvailables(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // define all columns table 
  const columns = [
    {
      title: "Room ID", 
      dataIndex: "RoomId", 
      key: "RoomId"
    }, 
    {
      title: "Floor Name", 
      dataIndex: "FloorId", 
      key: "FloorId"
    }, 
    {
      title: "Room Name", 
      dataIndex: "RoomName", 
      key: "RoomName"
    }, 
    {
      title: "Shift", 
      dataIndex: "ShiftName", 
      key: "ShiftName"
    }, 
    {
      title: "Status", 
      key: 'isAvail', 
      render: (text, record) => (
        <span>
          {
            record.isAvail == 1 ? (
              <Tag color="green" key={record.isAvail}>Available</Tag>
            ) : (
              <span style={{ color: "red" }}>Not Available</span>
            )
          }
        </span>
      )
    }
  ]

  useEffect(() => {
    getAllRoomAvailable();
  }, []);

  // filter room isAvail
  let avails = roomAvailables.filter((ra)=>ra.isAvail==1)
  

  return (
    <Table
      columns={columns}
      dataSource={avails}
      rowKey={(record)=>record.RoomAvailableId}
      pagination={{ pageSize: 10 }}
      size="large"
      bordered
    />
  );
}

export default ListRoomAvailable;
