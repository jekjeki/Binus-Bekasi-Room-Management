import React, { useState } from "react";
import logo from '../images/Logo2.png'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {Layout, Menu} from "antd"
import {
  HomeOutlined,
  AppstoreAddOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const {Sider} = Layout

function SideMenu({ menuToParent, role, nextButtonClick }) {

    const [menu, setMenu] = useState('Home')
    const [data, setData] = useState('')
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)

    // handle menu click 
    const handleMenuClick = ({key}) => {
      setMenu(key)
      menuToParent(key)
      switch (key){
        case "Home":
          nextButtonClick(1)
          navigate(role == "LSC" ? '/home-lsc' : '/manager-dashboard')
          break; 
          case "Create Reservation":
            navigate("/create-reservation");
            break;
          case "RoomAvailable":
            navigate("/home-lsc");
            break;
          default:
            break;
      }
    }

  return (
    <Sider
    theme="dark"
    collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={200}>
      <div className="logo flex justify-center py-4">
        <Link to={role === "LSC" ? "/home-lsc" : "/manager-dashboard"}>
          <img src={logo} alt="Logo" style={{ width: collapsed ? "40px" : "100px" }} />
        </Link>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[menu]}
        onClick={handleMenuClick}
      >
        <Menu.Item key="Home" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        {role === "LSC" && (
          <Menu.Item key="CreateReservation" icon={<AppstoreAddOutlined />}>
            Create Reservation
          </Menu.Item>
        )}
        <Menu.Item key="RoomAvailable" icon={<UnorderedListOutlined />}>
          Room Available
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default SideMenu;
