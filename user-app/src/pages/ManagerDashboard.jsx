import React, { useEffect, useState } from 'react'
import SideMenu from '../component/SideMenu'
import Header from '../component/Header'

function ManagerDashboard() {

    const [dataMenu, setDataMenu] = useState('Home')
    const [getRole, setRole] = useState('')

    const menuToParent = (childdata) => {
        setDataMenu(childdata)
    }

    const getUser = async () => {
        await fetch(`http://localhost:${process.env.POST}/admin/get-one-admin`, {
            method: 'POST', 
            headers: {
                'Content-type':'application/json;charset=UTF-8',
                'Authorization':`Bearer ${sessionStorage.getItem('jwt')}`
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            setRole(data.data.AdminRole)
        })
    }

    useEffect(()=>{
        getUser()
    })

  return (
    <div className='w-screen h-screen bg-[#F7F7F8]'>
        <div className='flex'>
            <SideMenu menuToParent={menuToParent} role={getRole} />
            <Header data={dataMenu} />
        </div>
    </div>
  )
}

export default ManagerDashboard