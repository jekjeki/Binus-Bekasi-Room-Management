import React, { useState } from "react";

const DetailRoom = ({updateNextClick}) => {
    const [nextClick, setNextCLick] = useState(true)


    return (
        <div className={"w-4/5"}>
          <div className={"w-full bg-white drop-shadow-2xl rounded-[20px]"}>
            <div className="font-bold text-xl text-center py-4">
              <p>Detail Room</p>
            </div>
          <div className="font-bold py-5">
              <div className="p-[30px] flex">
                <img className="flex-none relative" src="./public/room.jpg" alt="room image" width="500px" />
                <div className="py-2">
                <div className="font-bold px-5 py-2 flex">
                    <p>Kapasiter:</p>
                    <div className="font-normal px-3">
                        <p> Lorem ipsum dolor sit amet</p>
                        </div>
                </div>
                <div className="font-bold px-5 flex">
                    <p>Description Room:</p>
                    <div className="font-normal px-3">
                        <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin iaculis molestie elit et accumsan. Morbi iaculis lacus nec eros scelerisque congue. Phasellus placerat eget nulla eu faucibus. Pellentesque vestibulum, lectus sed finibus elementum, sem tortor efficitur mi, nec ultrices ligula enim quis magna. Praesent neque ex, ornare consequat turpis vel, tempus mollis dolor. Duis at libero non purus ullamcorper sodales ac nec felis. Vestibulum sed congue ipsum.</p>
                        </div>
                </div>

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