import React, { useEffect, useState } from 'react'


function DetailComponent({reservationTransactionId}) {

  const [arrData, setArrData] = useState([])

  //API for get detail component data for reservation
  const getDetailDataForComponent = async () => {
    await fetch(`http://localhost:8080/data/get-detail-component-data/${reservationTransactionId}`,{
      method: 'GET', 
      headers: {
        'Content-type':'application/json;charset=UTF-8',
      }
    })
    .then((res)=>res.json())
    .then((data) => {
      console.log(data.data)
      setArrData((arr) => [...arr, data.data[0]])
    })
  }

  useEffect(()=>{
    getDetailDataForComponent()
  }, [])

  return (
    <div className='w-full h-full border'>
      <div className='px-3 py-3 font-bold'>
        <p>Details</p>
      </div>
      <div>
        {
          arrData.map((ad, idx) => {
            return(
              <div key={idx} className='px-2 py-2'>
                <div className='py-2'>
                  <p className='text-slate-300'>Borrower Email: </p>
                  <p>{ad.BorrowerEmail}</p>
                </div>
                <div className='py-2'>
                  <p className='text-slate-300'>Borrower NIM: </p>
                  <p>{ad.BorrowerNIM}</p>
                </div>
                <div className='py-2'>
                  <p className='text-slate-300'>Borrower Name: </p>
                  <p>{ad.BorrowerName}</p>
                </div>
                <div className='py-2'>
                  <p className='text-slate-300'>Event Name: </p>
                  <p>{ad.EventName}</p>
                </div>
                <div className='py-2'>
                  <p className='text-slate-300'>Event Description: </p>
                  <p>{ad.EventDescription}</p>
                </div>
                <div className='py-2'>
                  <p className='text-slate-300'>Floor: </p>
                  <p>{ad.FloorName}</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default DetailComponent