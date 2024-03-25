import React, { useState } from "react";

const DetailRoom = ({updateNextClick}) => {
    const [nextClick, setNextCLick] = useState(true)


    return (
        <div className={"w-4/5"}>
          <div className={"w-full bg-white drop-shadow-2xl rounded-[20px]"}>
            <div className="font-bold text-xl text-center">
              <p>Detail Room</p>
            </div>
          <div className="text-center font-bold py-5">
              <div className="p-[30px] flex">
                <img className="flex-none relative" src="./public/room.jpg" alt="room image" width="500px" />
                <div className="text-center font-bold py-5 ">
                    <p>Tes</p>
                </div>
            </div>
              </div>
            <div className="px-5 py-4 flex justify-center align-center">
           <button 
              onClick={()=>{
                setNextCLick(true);
                (nextClick) ? updateNextClick(3) : 0
              }}className="bg-[#57B4FF] text-white font-bold w-28 rounded-[20px] px-1 py-2"
              >Next</button>
            </div>
            </div>
        </div>
    
      );
}

export default DetailRoom