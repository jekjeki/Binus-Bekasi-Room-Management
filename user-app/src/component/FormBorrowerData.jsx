import React, { useState } from "react";
import axios from "axios"

function FormBorrowerData({ setNextClick ,nameToParent, nimToParent, emailToParent, binusianIDToParent}) {

    const [name, setName] = useState('')
    const [nim, setNim] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState("")
    const [binusianID, setBinusianID] = useState('')

    // validate form borrower 
    const validateFormBorrower = () => {
      axios.post(`http://localhost:8081/data/validate-form-borrower`, {
        "name": name, 
        "email": email, 
        "nim": nim, 
        "binusianid": binusianID
      })
      .then((res)=>{
        console.log(res.data)
        // status code 200
          
          if(res.data.statuscode == 200){
            setNextClick(1);
            nameToParent(name);
            nimToParent(nim);
            emailToParent(email)
            binusianIDToParent(binusianID)
          }
          // (nextClick) ? nextButtonClick(1) : 0
      })
      .catch((err)=>{
        console.log(err)
        
      })

    }

  return (
    <div className="w-4/5 bg-white drop-shadow-2xl rounded-[20px]">
      <div className="text-center font-bold py-2">
        <p>Borrower Data</p>
      </div>
      <div className="px-5 py-4">
        <div>
          <label htmlFor="name">Name</label>
        </div>
        <div>
          <input
            id="name"
            type="text"
            className="w-full rounded-[10px] border border-2 px-3 py-1"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
        </div>
      </div>
      <div className="px-5 py-4">
        <div>
          <label htmlFor="nim">NIM</label>
        </div>
        <div>
          <input
            id="nim"
            type="text"
            className="w-full rounded-[10px] border border-2 px-1 py-1"
            placeholder="NIM"
            value={nim}
            onChange={(e)=>setNim(e.target.value)}
          />
        </div>
      </div>
      <div className="px-5 py-4">
        <div>
          <label htmlFor="email">Email</label>
        </div>
        <div>
          <input
            id="email"
            type="text"
            className=" w-full rounded-[10px] border border-2 px-1 py-1"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="px-5 py-4">
        <div>
          <label htmlFor="text">Binusian ID</label>
        </div>
        <div>
          <input
            id="binusianid"
            type="text"
            className=" w-full rounded-[10px] border border-2 px-1 py-1"
            placeholder="Binusian ID"
            value={binusianID}
            onChange={(e)=>setBinusianID(e.target.value)}
          />
        </div>
      </div>
      <div className="px-5 py-4 flex justify-center align-center">
        <button onClick={()=>{
            validateFormBorrower()
        }} className="bg-[#57B4FF] text-white font-bold w-28 rounded-[20px] px-1 py-2">
          Next
        </button>
      </div>
      {
        error.length != 0 ? 
        <div className="text-xl text-red text-center">
          <h1>{error}</h1>
        </div>
        :
        <></>
      }
    </div>
  );
}

export default FormBorrowerData;
