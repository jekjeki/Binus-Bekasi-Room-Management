import axios from "axios";
import React, { useState } from "react";

const InventoryRequest = ({updateNextClick, requestInventoryBorrow}) => {
    const [nextClick, setNextCLick] = useState(true)
    const [request, setRequest] = useState("");
    const [error, setError] = useState("");

    const InventoryRequest = () => {
      axios.post(`http://localhost:8081/data/validation-form-inventory-request`, {
        "inventoryId": request
      })
      .then((res)=>{
        console.log(res.data.statuscode == 200)
        //statuscode 200
        setNextCLick(true);
        if(res.data.statuscode == 200){
          updateNextClick(4)
          requestInventoryBorrow(request)
        }
      })
      .catch((err)=>{
        console.log(err.response.data.message)
        setError(err.response.data.message)
      })
    }

    return (
        <div className={"w-4/5"}>
          <div className={"w-full bg-white drop-shadow-2xl rounded-[20px]"}>
          <div className="text-center font-bold py-7">
              <p>Inventory Request</p>
            </div>
            <div className="flex justify-center align-center">
            <textarea
              id="request"
              className="w-5/6 rounded-[10px] border border-2 px-3 py-1"
              placeholder="Request"
              value={request}
              onChange={(e) => {
                setRequest(e.target.value);
              }}
            />
          </div>
            <div className="px-5 py-7 flex justify-center align-center">
           <button 
              onClick={()=>{
                InventoryRequest()
              }}className="bg-[#57B4FF] text-white font-bold w-28 rounded-[20px] px-1 py-2"
              >Next</button>
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
          </div>
    
      );
}

export default InventoryRequest