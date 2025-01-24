import React from 'react'
import TableComponent from './TableComponent';

const HomePage = ({ role }) => (
    <div>
      <h4 className="font-bold text-2xl text-[#381CA9] bg-gradient-to-r from-[#57CDFF] to-[#038ACA] px-9 py-7">
        {`Hello, ${role}`}
      </h4>
      <TableComponent />
    </div>
  );

export default HomePage