import React, { useState } from "react";

function FormBorrowerData({nextButtonClick, nameToParent, nimToParent, emailToParent}) {

    const [nextClick, setNextClick] = useState(false)
    const [name, setName] = useState('')
    const [nim, setNim] = useState('')
    const [email, setEmail] = useState('')

  return (
    <div className="w-3/5 bg-white drop-shadow-2xl rounded">
      <div className="text-center font-bold py-2">
        <p>Borrower Data</p>
      </div>
      <div className="px-5 py-2">
        <div>
          <label htmlFor="name">Name</label>
        </div>
        <div>
          <input
            id="name"
            type="text"
            className="bg-[#F0F0F0] w-full rounded border px-1 py-1"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
        </div>
      </div>
      <div className="px-5 py-2">
        <div>
          <label htmlFor="nim">NIM</label>
        </div>
        <div>
          <input
            id="nim"
            type="text"
            className="bg-[#F0F0F0] w-full rounded border px-1 py-1"
            placeholder="NIM"
            value={nim}
            onChange={(e)=>setNim(e.target.value)}
          />
        </div>
      </div>
      <div className="px-5 py-2">
        <div>
          <label htmlFor="email">Email</label>
        </div>
        <div>
          <input
            id="email"
            type="text"
            className="bg-[#F0F0F0] w-full rounded border px-1 py-1"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="px-5 py-2 flex justify-center align-center">
        <button onClick={()=>{
            setNextClick(true)
            nextButtonClick(nextClick)
            nameToParent(name)
            nimToParent(nim)
            emailToParent(email)

        }} className="bg-[#57B4FF] text-white font-bold w-28 rounded px-1 py-1">
          Next
        </button>
      </div>
    </div>
  );
}

export default FormBorrowerData;
