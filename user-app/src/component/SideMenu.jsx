import React, { useState } from "react";
import logo from '../images/Logo2.png'
import { useNavigate } from "react-router-dom";



function SideMenu({ menuToParent, role }) {

    const [menu, setMenu] = useState('Home')
    const [data, setData] = useState('')

    const navigate = useNavigate()

  return (
    <div className="w-1/5 h-screen justify-evenly bg-white ">
      <div className="flex-col">
      <div className="flex justify-content bg-[#57CDFF]">
        <img src={logo} alt="" />
      </div>
        <div className="py-5">
          <p
            onClick={() => {
                // navigate('/home-lsc')
                setMenu('Home')
                menuToParent(menu)
            }}
            className={menu == "Home" ? "font-bold text-white bg-[#F08700] py-3 px-3" : "text-[#AAADB6] px-3"}
          >
            Home
          </p>
        </div>
        {
          (role == 'LSC') ? (
            <div className="py-2">
              <p
                onClick={() => {
                  setMenu('Create Reservation');
                  menuToParent(menu)
                //   navigate('/create-reservation')
                }}
                className={
                  menu == "Create Reservation"
                    ? "font-bold text-white bg-[#F08700] py-3 px-3"
                    : "text-[#AAADB6] px-3"
                }
              >
                Create Reservation
              </p>
            </div>
          ) :  (
            <div>

            </div>
          )
        }
        <div
         onClick={()=>{
          setMenu('Room Available')
          menuToParent(menu)
          navigate('/home-lsc')
        }}
        className="py-2">
          <p
           

            className={
              menu == 'Room Available' ? "font-bold text-white bg-[#F08700] py-3 px-3" : "text-[#AAADB6] px-3"
            }
          >
            Room Available
          </p>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
