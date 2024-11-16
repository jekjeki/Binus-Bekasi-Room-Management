import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table, Button, Input, DatePicker } from "antd";
import moment from "moment"

const {Column} = Table 
const {RangePicker} = DatePicker

function Home() {
  const [getAdminRole, setAdminRole] = useState("");
  const [arrReservation, setArrReservation] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [dateClick, setDateClick] = useState(false);
  const [getLen, setLen] = useState(0);
  const [getAllFilter, setAllFilter] = useState([]);
  const [getTrId, setTrId] = useState("");

  const getCurrentLogin = async () => {
    await fetch(`http://localhost:${process.env.PORT}/admin/get-one-admin`, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAdminRole(data.data.AdminRole);
      });
  };

  const getAllReservationTransaction = async () => {
    axios
      .get(`http://localhost:${process.env.PORT}/data/get-all-reservation`)
      .then((res) => {
        setArrReservation(res.data.data);
      })
      .catch((er) => console.log(er));
  };

  const filterDate = async () => {
    await fetch(
      `http://localhost:${process.env.PORT}/data/filter-data-by-date/${dateFilter}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json;charset=UTF-8",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data)
        setAllFilter(data.data);
        setLen(data.data.length);
        setTrId(data.data[0].ReservationTransactionId);
      });
  };

  const updateisAvailWithInterval = () => {
    arrReservation.forEach(async (ar) => {
      var d = new Date(ar.ReservationDate).getDate();
      var m = new Date(ar.ReservationDate).getMonth();
      var curr = new Date().getDate();
      var currM = new Date().getMonth();

      if (currM > m || curr > d) {
        await fetch(
          `http://localhost:${process.env.PORT}/data/update-room-isavail/${ar.RoomAvailableId}`,
          {
            method: "PATCH",
            headers: {
              "Content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({ isAvail: 1 }),
          }
        )
          .then((res) => res.json())
          .then((data) => console.log(data));
      }
    });
  };

  useEffect(() => {
    updateisAvailWithInterval();
    getCurrentLogin();
    getAllReservationTransaction();
    if (dateClick) {
      filterDate();
    }
  }, [dateClick]);

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Reservation Id",
      dataIndex: "ReservationTransactionId",
      key: "ReservationTransactionId",
    },
    {
      title: "Room",
      dataIndex: "RoomName",
      key: "RoomName",
    },
    {
      title: "Event",
      dataIndex: "EventName",
      key: "EventName",
    },
    {
      title: "Reservation Date",
      dataIndex: "ReservationDate",
      key: "ReservationDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "ReservationStatus",
      key: "ReservationStatus",
    },
    {
      title: "Shift",
      dataIndex: "ShiftName",
      key: "ShiftName",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link
          to={
            getAdminRole === "LSC"
              ? `/reservation/${record.ReservationTransactionId}`
              : getAdminRole === "SPV"
              ? `/spv-update-page/${record.ReservationTransactionId}`
              : ""
          }
        >
          <Button style={{ backgroundColor: '#1890ff', color: 'white' }}>
            {getAdminRole === "LSC" ? `Detail` : `Detail & Update`}
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="bg-home drop-shadow-2xl m-[40px]">
      <div className="px-2 py-2">
        <DatePicker
          className="mb-3"
          onChange={(date, dateString) => {
            console.log(dateString)
            setDateFilter(dateString);
          }}
          format={"YYYY-DD-MM"}
        />
        <Button
          style={{ backgroundColor: '#1890ff', color: 'white' }}
          type="primary"
          className="ml-2"
          onClick={() => {
            filterDate();
            setDateClick(true);
          }}
        >
          Filter
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={!dateClick ? arrReservation : getAllFilter}
        rowKey={(record) => record.ReservationTransactionId}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
}

export default Home;
