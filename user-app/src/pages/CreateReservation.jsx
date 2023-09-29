import React from 'react'
import SideMenu from '../component/SideMenu'
import Header from '../component/Header'

function CreateReservation() {
  return (
    <div className='w-screen h-screen'>
        <div className='flex w-full'>
            <SideMenu />
            <Header />
        </div>
    </div>
  )
}

export default CreateReservation