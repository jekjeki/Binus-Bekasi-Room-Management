import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table, Button, Input, DatePicker, Select } from "antd";
import moment from "moment-timezone"

const {Column} = Table 
const {RangePicker} = DatePicker
const {Option} = Select

function TableComponent() {
  const [getAdminRole, setAdminRole] = useState("");
  const [arrReservation, setArrReservation] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [dateClick, setDateClick] = useState(false);
  const [getLen, setLen] = useState(0);
  const [getAllFilter, setAllFilter] = useState([]);
  const [uniqueFacilityIDs, setUniqueFacilityIDs] = useState([])
  const [facilityFilter, setFacilityFilter] = useState('')

  // v2 
  const [meetingData, setMeetingData] = useState([])

  const getCurrentLogin = async () => {
    const token = sessionStorage.getItem("jwt")
    await fetch(`http://localhost:${process.env.PORT}/admin/get-one-admin`, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAdminRole(data.data.AdminRole);
      });
  };

  // api fetch v2
  const fetchMeetingsData = async() => {
    axios.get(`http://localhost:${process.env.PORT}/meetings/get-all-meetings`)
    .then((res)=>{

      // Set meeting data
      const modifiedMeetingData = res.data.data.map((item) => ({
        ...item,
        StartDate: formatDatePlusOne(item.StartDate) // Tambahkan tanggal yang dimodifikasi
      }));
      setMeetingData(modifiedMeetingData);
      
      // get facilityID 
      const uniqueFacilityID = [...new Set(res.data.data.map(item => item.FacilityID))]
      setUniqueFacilityIDs(uniqueFacilityID)
    })
    .catch((err)=>console.log(err))
  }

  /**
   * 
   * fungsi untuk rubah date + 1 karena dari sql beda
   */
  const formatDatePlusOne = (startDate) => {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().split("T")[0];
  };

  const filterDate = async () => {
    // ambil params 
    const params = new URLSearchParams()
    if(dateFilter){
      params.append('date',moment(dateFilter).tz('Asia/Jakarta').format('YYYY-MM-DD'))
    }

    if(facilityFilter){
      params.append('facilityID', facilityFilter.toString())
    }
    console.log(params.toString())
    await fetch(
      `http://localhost:${process.env.PORT}/data/filter-data-by-date/?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json;charset=UTF-8",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setLen(data.data.length);
        const modifiedData = data.data.map((da)=>{
          return {
            ...da, 
            StartDate: da.StartDate ? formatDatePlusOne(da.StartDate) : '-'
          }
        })
        console.log(modifiedData)
        setAllFilter(modifiedData);
      });
  };

  useEffect(() => {
    // updateisAvailWithInterval();
    getCurrentLogin();
    // getAllReservationTransaction();

    // v2 
    fetchMeetingsData()

    if (dateClick) {
      filterDate();
    }
  }, [dateClick]);

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Meeting Day",
      dataIndex: "MeetingDay",
      key: "MeetingDay",
    },
    {
      title: "Meeting Times",
      dataIndex: "MeetingTimes",
      key: "MeetingTimes",
    },
    {
      title: "Start Date",
      dataIndex: "StartDate",
      key: "StartDate"
    },
    {
      title: "Facility ID",
      dataIndex: "FacilityID",
      key: "FacilityID"
    },
    {
      title: "Class Section",
      dataIndex: "ClassSection",
      key: "ClassSection",
    },
    {
      title: "Course Description",
      dataIndex: "CourseDescription",
      key: "CourseDescription",
    },
    {
      title: "Binusian ID", 
      dataIndex: "BinusianID", 
      key: "BinusianID"
    },
    {
      title: "Lecture Name", 
      dataIndex: "LectureName", 
      key: "LectureName"
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link
        onClick={()=>console.log(record)}
          to={
            
              `/reservation/${record.MeetingID}`
          }
        >
          <Button
          style={{ backgroundColor: '#1890ff', color: 'white' }}>
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
          format={"YYYY-MM-DD"}
        />

        <Select 
          className="mb-3 mx-3 w-[200px]"
          placeholder="Select Facility ID"
          onChange={(value) => {
            setFacilityFilter(value);
          }}
          allowClear
        >
          {uniqueFacilityIDs.map(id => (
            <Option key={id} value={id}>{id}</Option>
          ))}
        </Select>

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
        dataSource={getAllFilter.length != 0 ? getAllFilter : meetingData}
        rowKey={(record) => record.MeetingID ? record.MeetingID : `${record.MeetingDay}-${record.MeetingTimes}-${record.StartDate}`}
        pagination={{ pageSize: 5 }}
        bordered
        onRow={(record) => {
          console.log(record)
          if(record.MeetCategory?.trim() == "Borrowing"){
            return {
              style: { backgroundColor: "#d4edda" },
            }
          }

          return {}
        }}
      />
      
    </div>
  );
}

export default TableComponent;
