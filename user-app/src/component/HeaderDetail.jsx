import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HeaderDetail({ reservationTransactionId }) {

  const [role, setRole] = useState('')

  return (
    <div className="h-[150px]  bg-gradient-to-r from-[#57CDFF] to-[#038ACA] relative">
      <div className="flex underline underline-offset-2 px-8 py-2 decoration-sky-500">
        <Link to={(role=='LSC')?'/home-lsc':'/manager-dashboard'} className="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="rgb(0 0 0)"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-slate-100">back to dashboard</p>
        </Link>
      </div>
      <div className="absolute bottom-5 left-5 px-2 font-bold text-2xl">
        <p>{reservationTransactionId}</p>
      </div>
    </div>
  );
}

export default HeaderDetail;
