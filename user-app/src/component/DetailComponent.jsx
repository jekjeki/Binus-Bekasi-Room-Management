import React, { useEffect, useState } from 'react'


function DetailComponent() {

  return (
    <div className='h-3/4 w-[300px] bg-white border rounded-[30px] drop-shadow-md m-[40px]'>
      <div className='px-5 py-10 font-bold'>
        <p>Details</p>
      </div>
      <div>
        {
              <div className='px-5 py-2'>
                <div className='py-2'>
                  <p className='text-slate-300'>Borrower Email: </p>
                  <p>{''}</p>
                </div>
                <div className='py-2'>
                  <p className='text-slate-300'>Borrower NIM: </p>
                  <p>{''}</p>
                </div>
                <div className='py-2'>
                  <p className='text-slate-300'>Borrower Name: </p>
                  <p>{''}</p>
                </div>
                <div className='py-2'>
                  <p className='text-slate-300'>Event Name: </p>
                  <p>{''}</p>
                </div>
                <div className='py-2'>
                  <p className='text-slate-300'>Event Description: </p>
                  <p>{''}</p>
                </div>
                <div className='py-2'>
                  <p className='text-slate-300'>Floor: </p>
                  <p>{''}</p>
                </div>
              </div>
        }
      </div>
    </div>
  )
}

export default DetailComponent