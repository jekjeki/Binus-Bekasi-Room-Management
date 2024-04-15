import React, { useState } from 'react'

function SuccessModal({OkClicked}) {

    const [okClick, setOkClick] = useState(false)

  return (
    <div className='w-full h-24 rounded-[20px] bg-white border-2 border-slate-400'>
        <div className='text-center text-black'>
            <div className=''>
                <h3>Data saved successful !</h3>
            </div>
            <div className='py-3'>
                <button className='w-[100px] rounded-[20px] bg-cyan-600 text-white font-bold' onClick={()=>{
                    setOkClick(true)
                    OkClicked(okClick)
                }}>OK</button>
            </div>
        </div>
    </div>
  )
}

export default SuccessModal