import React from 'react'
import ListRoomAvailable from './ListRoomAvailable'
import SideMenu from './SideMenu'
import Header from './Header'

function ListRooms({role}) {
  return (
    <div className=''>
      <h4 className="font-bold text-2xl text-[#381CA9] bg-gradient-to-r from-[#57CDFF] to-[#038ACA] px-9 py-7">
          {`Hello, ${role}`}
        </h4>
        <div className='flex w-full h-full'>
        <div className="flex w-full justify-center align-center items-center py-[50px]">
          <div style={{ width: "90%", margin: "auto" }}>
            <ListRoomAvailable />
          </div>
        </div>
      </div>
  </div>
  )
}

export default ListRooms