import React, { useEffect, useState } from "react";
import FormBorrowerData from "./FormBorrowerData";
import FormEvent from "./FormEvent";
import Home from "./Home";
import { useNavigate } from "react-router-dom";
import ListRoomAvailable from "./ListRoomAvailable";
import DetailRoom from "./DetailRoom";
import InventoryRequest from "./InventoryRequest";


function Header({data}) {

    const [role, setRole] = useState('')
    const [adminId, setAdminId] = useState('')

    const [nextClick, setNextClick] = useState(0)
    const [nameBorrower, setNameBorrower] = useState('')
    const [nimBorrower, setNimBorrower] = useState('')
    const [emailBorrower, setEmailBorrower] = useState('')
    
    const [nextClickLast, setNextClickLast] = useState(false)

    if(nextClickLast == true){
        data = 'Home'
    }

    const navigate = useNavigate()

    const nextButtonClick = (clicked) => {
        setNextClick(clicked)
    }

    const emailToParent = (email) => {
        setEmailBorrower(email)
    }

    const updateNextClickDetailRoom = (clicked) => {
        setNextClick(clicked)
    }

    const dataSetMenuFunc = (boolLast) => {
        setNextClickLast(boolLast)
    }

    const nameToParent = (name) => {
        setNameBorrower(name)
    }

    const nimToParent = (nim) => {
        setNimBorrower(nim)
    }

    const updateNextClick = (click) => {
        setNextClick(click)
    }

 

    const getUser = async () => {
        await fetch(`http://localhost:${process.env.PORT}/admin/get-one-admin`, {
            method: 'POST', 
            headers: {
                'Content-type':'application/json;charset=UTF-8',
                'Authorization':`Bearer ${sessionStorage.getItem('jwt')}`
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data.data)
            setRole(data.data.AdminRole)
            setAdminId(data.data.id)
        })
        
    }

    useEffect(()=>{
        getUser()
    }, [])

  return (
    <div className={"w-full"}>
      <div className="w-full h-[150px] bg-gradient-to-r from-[#57CDFF] to-[#038ACA]  ">
        <div className="flex justify-end  px-10 py-4">
          <p onClick={()=>{
            sessionStorage.clear()
            navigate('/')
          }}>Logout</p>
        </div>
        <div className="justify-between items-center px-7 py-10 text-white font-bold">
        <h3 className="font-bold text-2xl px-2 py-2">{`Room Booking Management`}</h3>
        </div>
      </div>
      {
        (data == 'Home') ? (
            <div>
 <h4 className="font-bold text-2xl text-[#381CA9] bg-gradient-to-r from-[#57CDFF] to-[#038ACA] px-9 py-7">{`Hello,  ${role}`}</h4>                <Home />
                
            </div>
        )
        :
        (data == 'Create Reservation') ? (
            <div>
                <div>
                    <h4 className="font-bold text-2xl text-[#381CA9] bg-gradient-to-r from-[#57CDFF] to-[#038ACA] px-9 py-7">{`Hello,  ${role}`}</h4>
                </div>
                <div className="w-full py-5">
                    <h3 className="text-center font-bold">Create Reservation</h3>
                </div>
                <div className="py-3 container w-full h-3/4 flex justify-center items-center">
                    {
                        nextClick == 0 ? (
                            <FormBorrowerData 
                            emailToParent={emailToParent}
                            nimToParent={nimToParent}
                            nameToParent={nameToParent} 
                            nextButtonClick={nextButtonClick} />
                        ) : (nextClick == 1) ? (
                            <FormEvent 
                            adminId={adminId}
                            emailBorrower={emailBorrower}
                            nameBorrower={nameBorrower}
                            nimBorrower={nimBorrower}
                            dataSetMenuFunc={dataSetMenuFunc}
                            updateNextClick={updateNextClick}
                            />
                        )
                        : (nextClick == 2) ? <DetailRoom updateNextClick={updateNextClickDetailRoom} />
                        : (nextClick == 3) ? <InventoryRequest/>
                        :
                        <></>
                    }
                    
                </div>
            </div>
        ) : (
            <div>
                <div>
                <h4 className="font-bold text-2xl text-[#381CA9] bg-gradient-to-r from-[#57CDFF] to-[#038ACA] px-9 py-7">{`Hello,  ${role}`}</h4>
                </div>
                <div className="flex w-full justify-center align-center items-center py-[50px]">
                    <ListRoomAvailable />
                </div>
            </div>
        )
      }
    </div>
  );
}

export default Header;
