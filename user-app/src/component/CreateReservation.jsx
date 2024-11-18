import React, { useState } from 'react'
import FormBorrowerData from './FormBorrowerData';
import DetailRoom from './DetailRoom';
import InventoryRequest from './InventoryRequest';
import Summary from './Summary';
import FormEvent from './FormEvent';


const CreateReservation = ({
    role, setNextClick, nextClick,
  }) => {
    
    const [borrower, setBorrower] = useState({
      name: '',
      nim: '', 
      email: ''
    })

    const updateBorrower = (key, value) => {
      setBorrower((prev)=>({
        ...prev, 
        [key]: value
      }))
    }

    return (
    <div>
      <h4 className="font-bold text-2xl text-[#381CA9] bg-gradient-to-r from-[#57CDFF] to-[#038ACA] px-9 py-7">
        {`Hello, ${role}`}
      </h4>
      <div className="w-full py-5">
        <h3 className="text-center font-bold">Create Reservation</h3>
      </div>
      <div className="py-3 container w-full h-3/4 flex justify-center items-center">
        {nextClick === 0 && (
          <FormBorrowerData
            setNextClick={setNextClick}
            nimToParent={(nim)=>updateBorrower("nim", nim)}
            nameToParent={(name)=>updateBorrower("name", name)}
            emailToParent={(email)=>updateBorrower("email", email)}
          />
        )}
        {nextClick === 1 && (
          <FormEvent
            
            borrower={borrower}
            setNextClick={setNextClick}
            
          />
        )}
        {nextClick === 2 && (
          <DetailRoom setNextClick={setNextClick} />
        )}
        {nextClick === 3 && (
          <InventoryRequest
            setNextClick={setNextClick}
            setInventoryRequest={setInventoryRequest}
          />
        )}
        {nextClick === 4 && (
          <Summary
            borrower={borrower}
            eventDetails={eventDetails}
            inventoryRequest={inventoryRequest}
          />
        )}
      </div>
    </div>
  );}

export default CreateReservation