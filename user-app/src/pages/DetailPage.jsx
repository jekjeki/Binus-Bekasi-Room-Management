import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderDetail from "../component/HeaderDetail";
import DetailComponent from "../component/DetailComponent";
import SideMenu from "../component/SideMenu";
import axios from "axios";
import { Button, Input, message, Select, Table } from "antd";

function DetailPage() {
  const { meetingid } = useParams();
  const [role, setRole] = useState('')
  const [menu, setMenu] = useState('')
  const [editingRow, setEditingRow] = useState(null)
  const [detailsData, setDetailsData] = useState([])
  const [updatedData, setUpdatedData] = useState([])
  const [uniqueFacilityID, setUniqueFacilityID] = useState([])

  const getDetailMeetingData = () => {
    axios.get(`http://localhost:${process.env.PORT}/meetings/get-detail-meeting/${meetingid}`)
    .then((res)=>{
      setDetailsData(res.data.data)
    })
  }


  const formatDatePlusOne = (startDate) => {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().split("T")[0];
  };

  // fetch meeting data for get unique facility id 
  const fetchMeetings = async () => {
    axios.get(`http://localhost:${process.env.PORT}/meetings/get-all-meetings`)
    .then((res)=>{
      // get facilityID 
      const uniqueFacilityID = [...new Set(res.data.data.map(item => item.FacilityID))]
      setUniqueFacilityID(uniqueFacilityID)
    })
    .catch((err)=>{
      console.log(err.message)
    })
  }

  // handle input data
  const handleInputChange = (e, codeSelected, key) => {
  const value = e.target ? e.target.value : e;

  setUpdatedData((prev) => ({
    ...prev, 
    codeSelected, 
    [key]: value
  }))
};


  // save data di click akan memberikan event
  const savedData = () => {

    // check data kosong 
    if(!updatedData || Object.keys(updatedData).length == 0){
      return message.error("No data to be update !")
    }

    axios.put(`http://localhost:${process.env.PORT}/meetings/update-meeting/${meetingid}`, updatedData)
    .then((res)=>{
      message.success("update data successful !")
      getDetailMeetingData()
    })
    .catch((err)=>{
      message.error("data cannot be update !")
    })
  }

  // columns table 
  const getColumns = (meetCategory) => [
    {
      title: "Start Date",
      dataIndex: "StartDate",
      key: "StartDate",
      render: (text, record) => {
        const isEditing = editingRow === record.DetailInfo.LectureCode || editingRow === record.DetailInfo.BorrowerID;
  
        if (isEditing) {
          return (
            <Input
              type="date"
              defaultValue={formatDatePlusOne(record.StartDate)}
              onChange={(e) =>
                handleInputChange(e, record.DetailInfo.LectureCode || record.DetailInfo.BorrowerID, "StartDate")
              }
            />
          );
        }
  
        return formatDatePlusOne(record.StartDate);
      },
    },
    {
      title: "Facility ID",
      dataIndex: "FacilityID",
      key: "FacilityID",
      render: (text, record) => {
        const isEditing = editingRow === record.DetailInfo.LectureCode || editingRow === record.DetailInfo.BorrowerID;
  
        if (isEditing) {
          return (
            <Select
              defaultValue={text}
              onChange={(value) =>
                handleInputChange({ target: { value } }, record.DetailInfo.LectureCode || record.DetailInfo.BorrowerID, "FacilityID")
              }
            >
              {uniqueFacilityID.map((id) => (
                <Select.Option key={id} value={id}>
                  {id}
                </Select.Option>
              ))}
            </Select>
          );
        }
  
        return text;
      },
    },
    {
      title: "Meeting Times",
      dataIndex: "MeetingTimes",
      key: "MeetingTimes",
      render: (text, record) => {
        const isEditing = editingRow === record.DetailInfo.LectureCode || editingRow === record.DetailInfo.BorrowerID;
  
        if (isEditing) {
          return (
            <Select
              defaultValue={text}
              onChange={(value) =>
                handleInputChange({ target: { value } }, record.DetailInfo.LectureCode || record.DetailInfo.BorrowerID, "MeetingTimes")
              }
            >
              <Select.Option value={"07.20 - 09.00"}>07.20 - 09.00</Select.Option>
              <Select.Option value={"09.20 - 11.00"}>09.20 - 11.00</Select.Option>
              <Select.Option value={"11.20 - 13.00"}>11.20 - 13.00</Select.Option>
              <Select.Option value={"13.20 - 15.00"}>13.20 - 15.00</Select.Option>
              <Select.Option value={"15.20 - 17.00"}>15.20 - 17.00</Select.Option>
              <Select.Option value={"17.20 - 19.00"}>17.20 - 19.00</Select.Option>
            </Select>
          );
        }
  
        return text;
      },
    },
    {
      title: "Meet Category",
      dataIndex: "MeetCategory",
      key: "MeetCategory",
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
      title: meetCategory == "Borrowing" ? "Borrower ID" : "Lecture Code",
      dataIndex: meetCategory == "Borrowing" ? ["DetailInfo", "BorrowerID"] : ["DetailInfo", "LectureCode"],
      key: meetCategory == "Borrowing" ? "BorrowerID" : "LectureCode",
      onCell: () => ({
        style: { whiteSpace: 'normal', wordWrap: 'break-word' } 
      })
    },
    {
      title: meetCategory == "Borrowing" ? "Borrower Name" : "Lecture Name",
      dataIndex: meetCategory == "Borrowing" ? ["DetailInfo", "BorrowerName"] : ["DetailInfo", "LectureName"],
      key: meetCategory == "Borrowing" ? "BorrowerName" : "LectureCode",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const isEditing = editingRow === record.DetailInfo.LectureCode || editingRow === record.DetailInfo.BorrowerID;
  
        return (
          <div>
            {isEditing ? (
              <div className="flex">
                <Button
                  type="primary"
                  className="mx-1"
                  onClick={() => {
                    setEditingRow(null);
                    savedData()
                    
                  }}
                >
                  Save
                </Button>
                <Button
                  danger
                  onClick={() => {
                    setEditingRow(null);
                    message.info("Canceled update!");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                type="link"
                onClick={() => {
                  setEditingRow(record.DetailInfo.LectureCode || record.DetailInfo.BorrowerID);
                }}
              >
                Edit
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  


  useEffect(() => {
    // getUser()
    getDetailMeetingData()
    fetchMeetings()
  }, []);

  return (
    <div className={"w-full h-full bg-[#F7F7F8]"}>
        <div className='flex w-full'>
      <div className="flex h-screen w-screen"> 
        <div className="w-full">
        <HeaderDetail reservationTransactionId={meetingid} />
         <div className={"flex justify-center mt-10"}>
          <Table 
            dataSource={detailsData}
            columns={getColumns(detailsData[0]?.MeetCategory)}
            rowKey={(record)=>record.DetailInfo.LectureCode || record.DetailInfo.BorrowerID}
            bordered
          />
        </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default DetailPage;
