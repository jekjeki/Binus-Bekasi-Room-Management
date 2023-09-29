import React, { useState } from "react";
import logo from '../images/Logo2.png'


function SideMenu({ menuToParent }) {

    const [menu, setMenu] = useState('Home')
    const [data, setData] = useState('')

  return (
    <div className="w-1/5 h-[110vh] bg-gradient-to-r from-[#57CDFF] to-[#038ACA]">
      <div className="flex justify-content">
        <img src={logo} alt="" />
      </div>
      <div className="flex-col text-center">
        <div className="py-2">
          <p
            onClick={() => {
                // navigate('/home-lsc')
                setMenu('Home')
                menuToParent(menu)
            }}
            className={menu == "Home" ? "font-bold text-white" : "text-white"}
          >
            Home
          </p>
        </div>
        <div className="py-2">
          <p
            onClick={() => {
              setMenu('Create Reservation');
              menuToParent(menu)
            //   navigate('/create-reservation')
            }}
            className={
              menu == "Create Reservation"
                ? "font-bold text-white"
                : "text-white"
            }
          >
            Create Reservation
          </p>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
