import React, { useState } from 'react'
import {DatePicker, Button, Select, message} from 'antd'
import axios from 'axios'

const {RangePicker} = DatePicker

function DownloadSheet({role}) {
  const [dates, setDates] = useState([null, null])
  const [meetCategory, setMeetCategory] = useState('Lectures')

  const handleDateChange = (dateSelects) => {
    setDates(dateSelects)
  }

  const handleMeetCategoryChange = (data) => {
    console.log(data)
    setMeetCategory(data)
  }

   // Fungsi untuk mendownload data
   const handleDownload = async () => {
    if(!dates[0] || !dates[1]){
      message.error("Please select the date range")
      return
    }

    const startDate = dates[0].format("YYYY-MM-DD");
    const endDate = dates[1].format("YYYY-MM-DD");

    console.log({
      startDate, endDate, meetCategory
    })

    try {
      const response = await axios.post("http://localhost:8081/admin/download-excel-data", {
        startDate: startDate,
        endDate: endDate,
        meetCategory: meetCategory
        ,
      }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
        responseType: "blob",
      });

      // Membuat file Excel dari blob yang diterima
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='h-screen'>
      <h4 className="font-bold text-2xl text-[#381CA9] bg-gradient-to-r from-[#57CDFF] to-[#038ACA] px-9 py-7">
        {`Hello, ${role}`}
      </h4>
      <div className='flex justify-center items-center mt-4'>
            <div className='w-3/4 bg-home drop-shadow-2xl m-[40px]'>
                    <div className='text-center my-2 font-bold'>
                        <p>Download Sheet Data</p>
                    </div>
                    <div className='flex mt-5'>
                      <RangePicker onChange={handleDateChange} />
                      <Select
                      value={meetCategory}
                      onChange={handleMeetCategoryChange}
                        style={{width: 200, marginLeft: 20}}
                      >
                        <Select.Option value="Lectures">Lectures</Select.Option>
                        <Select.Option value="Borrowing">Borrowing</Select.Option>
                      </Select>
                    </div>
                    <div className='mt-5'>
                      <Button
                      onClick={handleDownload}
                       className='bg-[#1890ff] border-[#1890ff]' 
                       type='primary'>Download Data</Button>
                    </div>
            </div>
        </div>
    </div>
  )
}

export default DownloadSheet