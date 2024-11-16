import React from 'react'
import FormBorrowerData from './FormBorrowerData';

const CreateReservation = ({
    role, borrower, eventDetails, inventoryRequest, setNextClick, nextClick,
    updateBorrower, updateEventDetails, setInventoryRequest, setNextClickLast
  }) => (
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
            updateBorrower={updateBorrower}
            setNextClick={setNextClick}
          />
        )}
        {nextClick === 1 && (
          <FormEvent
            adminId={adminId}
            borrower={borrower}
            setNextClickLast={setNextClickLast}
            setNextClick={setNextClick}
            updateEventDetails={updateEventDetails}
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
  );

export default CreateReservation