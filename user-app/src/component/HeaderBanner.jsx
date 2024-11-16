import React from 'react'

const HeaderBanner = ({ role, onLogout }) => (
    <div className="w-full h-[150px] bg-gradient-to-r from-[#57CDFF] to-[#038ACA]">
      <div className="flex justify-end px-10 py-4">
        <p onClick={onLogout}>Logout</p>
      </div>
      <div className="justify-between items-center px-7 py-10 text-white font-bold">
        <h3 className="font-bold text-2xl px-2 py-2">Room Booking Management</h3>
      </div>
    </div>
  );

export default HeaderBanner