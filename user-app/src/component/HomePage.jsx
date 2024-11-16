import React from 'react'
import Home from './TableComponent';

const HomePage = ({ role }) => (
    <div>
      <h4 className="font-bold text-2xl text-[#381CA9] bg-gradient-to-r from-[#57CDFF] to-[#038ACA] px-9 py-7">
        {`Hello, ${role}`}
      </h4>
      <Home />
    </div>
  );

export default HomePage