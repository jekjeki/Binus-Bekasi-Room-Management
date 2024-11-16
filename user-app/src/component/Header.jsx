import React, { useEffect, useState } from "react";
import FormBorrowerData from "./FormBorrowerData";
import FormEvent from "./FormEvent";
import Home from "./TableComponent";
import { useNavigate } from "react-router-dom";
import ListRoomAvailable from "./ListRoomAvailable";
import DetailRoom from "./DetailRoom";
import InventoryRequest from "./InventoryRequest";
import Summary from "./Summary";
import HeaderBanner from "./HeaderBanner";
import HomePage from "./HomePage";
import CreateReservation from "./CreateReservation";
import ListRooms from "./ListRooms";


function Header({data, nextClickSideMenu}) {

    const navigate = useNavigate();
  
  const [role, setRole] = useState('');
  const [adminId, setAdminId] = useState('');
  
  const [nextClick, setNextClick] = useState(0);
  const [borrower, setBorrower] = useState({ name: '', nim: '', email: '' });
  const [eventDetails, setEventDetails] = useState({
    name: '', desc: '', floor: '', roomId: '', shift: '', date: ''
  });
  const [inventoryRequest, setInventoryRequest] = useState('');
  const [nextClickLast, setNextClickLast] = useState(false);

  if (nextClickLast) data = 'Home';

  const getCurrentLogin = async () => {
    const response = await fetch(`http://localhost:${process.env.PORT}/admin/get-one-admin`, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
    });
    const data = await response.json();
    setRole(data.data.AdminRole);
  };

  useEffect(() => {
    getCurrentLogin();
    if (nextClickSideMenu === 1) setNextClick(0);
  }, [nextClickSideMenu]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const updateBorrower = (key, value) => setBorrower((prev) => ({ ...prev, [key]: value }));
  const updateEventDetails = (key, value) => setEventDetails((prev) => ({ ...prev, [key]: value }));
  

  return (
    <div className={"w-full"}>
      <HeaderBanner role={role} onLogout={handleLogout} />

        {data == "Home" && (
            <HomePage role={role} />
        )}

        {data == "CreateReservation" && (
            <CreateReservation
                role={role}
                borrower={borrower}
                eventDetails={eventDetails}
                inventoryRequest={inventoryRequest}
                setNextClick={setNextClick}
                nextClick={nextClick}
                updateBorrower={updateBorrower}
                updateEventDetails={updateEventDetails}
                setInventoryRequest={setInventoryRequest}
                setNextClickLast={setNextClickLast}
            />
        )}

        {data == "RoomAvailable" && (
            <ListRooms role={role} />
        )}

    </div>
  );
}

export default Header;
