import React, { useEffect, useState } from "react";
import FormBorrowerData from "./FormBorrowerData";
import FormEvent from "./FormEvent";
import Home from "./Home";

function Header({data}) {

    const [role, setRole] = useState('')
    const [adminId, setAdminId] = useState('')

    const [nextClick, setNextClick] = useState(false)
    const [nameBorrower, setNameBorrower] = useState('')
    const [nimBorrower, setNimBorrower] = useState('')
    const [emailBorrower, setEmailBorrower] = useState('')

    const nextButtonClick = (clicked) => {
        setNextClick(clicked)
    }

    const emailToParent = (email) => {
        setEmailBorrower(email)
    }

    const nameToParent = (name) => {
        setNameBorrower(name)
    }

    const nimToParent = (nim) => {
        setNimBorrower(nim)
    }

 

    const getUser = async () => {
        await fetch('http://localhost:8080/admin/get-one-admin', {
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
    <div className={"w-4/5"}>
      <div className="w-full h-[70px] bg-white drop-shadow-md flex justify-between">
        <div className="flex justify-center items-center px-2">
          <p>Room Booking Management</p>
        </div>
        <div className="flex justify-center items-center px-2">
          <p>Logout</p>
        </div>
      </div>
      {
        (data == 'Home') ? (
            <div>
                <Home />
            </div>
        )
        :
        (
            <div>
                <div>
                    <h3 className="font-bold text-2xl px-2 py-2">{`Hello,  ${role}`}</h3>
                </div>
                <div className="w-full py-5">
                    <h3 className="text-center font-bold">Create Reservation</h3>
                </div>
                <div className="py-3 container w-full h-3/4 flex justify-center items-center">
                    {
                        !nextClick ? (
                            <FormBorrowerData 
                            emailToParent={emailToParent}
                            nimToParent={nimToParent}
                            nameToParent={nameToParent} 
                            nextButtonClick={nextButtonClick} />
                        ) : (
                            <FormEvent 
                            adminId={adminId}
                            emailBorrower={emailBorrower}
                            nameBorrower={nameBorrower}
                            nimBorrower={nimBorrower} />
                        )
                    }
                    
                </div>
            </div>
        )
      }
    </div>
  );
}

export default Header;
