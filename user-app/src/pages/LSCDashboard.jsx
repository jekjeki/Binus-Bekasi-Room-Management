import React, { useEffect, useState } from 'react'
import Header from '../component/Header'
import SideMenu from '../component/SideMenu'

function LSCDashboard() {
    const [getRole, setRole] = useState('')
    const [dataMenu, setDataMenu] = useState('Home')
    const [nextClick, setNextClick] = useState(0)

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
            console.log(data.data.AdminRole)
            setRole(data.data.AdminRole)
        })
        
    }

    const menuToParent = (childdata) => {
        setDataMenu(childdata)
    }

    const nextButtonClick = (value) => {
        setNextClick(value)
    }

    useEffect(()=>{
        getUser()
    }, [])

  return (
    <div className='w-screen h-screen'>
        {/* flex */}
        <div className='flex h-full w-full'>
            <SideMenu menuToParent={menuToParent} nextButtonClick={nextButtonClick} role={getRole} />
            <Header nextClickSideMenu={nextClick} data={dataMenu} />
        </div>
    </div>
  )
}

export default LSCDashboard