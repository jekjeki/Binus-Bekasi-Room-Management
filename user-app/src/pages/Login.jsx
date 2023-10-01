import React, { useState } from 'react'
import logo from '../images/LogoBinus.png'
import { useNavigate } from 'react-router-dom'

function Login() {

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [getToken, setToken] = useState('')
  const [role, setRole] = useState('')
  const navigate = useNavigate()

  const login = async () => {
    await fetch('http://localhost:8080/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        password: password
      }), 
      headers: {
        'Content-type':'application/json;charset=UTF-8'
      }
    })
    .then((res)=>res.json())
    .then((data)=>{
      // console.log(data.result[0].AdminRole)
      setRole(data.result[0].AdminRole)
      console.log(role)
      setToken()
      sessionStorage.setItem('jwt', data.token)

      if(role == 'LSC'){
        navigate('/home-lsc')
      }
      else if(role == 'SPV'){
        navigate('/manager-dashboard')
      }
    })
  }

  return (
    <div className='h-screen bg-gradient-to-r from-[#57CDFF] to-[#038ACA] flex justify-center items-center'>
        <div className='container h-[300px] w-[300px] bg-white rounded'>
            <div className='flex justify-center'>
              <img src={logo} alt="image login" />
            </div>
            <div className='px-4 py-2'>
              <input type="text" placeholder='username' onChange={(e)=>setName(e.target.value)} className='bg-gray-50 border border-[#0098E2] rounded w-full px-2 py-1'/>
            </div>
            <div className='px-4 py-2'>
              <input type="password" placeholder='password' onChange={(e)=>setPassword(e.target.value)} className='bg-gray-50 border border-[#0098E2] rounded w-full px-2 py-1' />
            </div>
            <div className='px-4 py-2 flex justify-center'>
              <button className='bg-[#F08700] w-[100px] py-1 rounded text-[#ffff] font-bold' onClick={()=>login()}>Login</button>
            </div>
        </div>
    </div>
  )
}

export default Login