import React, { useState } from "react";
import logo from "../images/Logo2.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  CloudUploadOutlined,
  DownloadOutlined,
  HomeOutlined,
  AppstoreAddOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

function SideMenu({ menuToParent, role, nextButtonClick }) {
  const [menu, setMenu] = useState("Home");
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Handle menu click
  const handleMenuClick = ({ key }) => {
    setMenu(key);
    menuToParent(key);

    // Reset nextClick to 0 when "Home" is clicked
    if (key === "Home") {
      nextButtonClick();
    }
  };

  return (
    <Sider
      theme="dark"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={200}
    >
      <div className="logo flex justify-center py-4">
        <Link to={role === "LSC" ? "/home-lsc" : "/manager-dashboard"}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: collapsed ? "40px" : "100px" }}
          />
        </Link>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        style={{ height: "130vh" }}
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
        <Menu.Item key={"UploadSchedule"} icon={<CloudUploadOutlined />}>
          Upload Data
        </Menu.Item>
        <Menu.Item key={"DownloadSchedule"} icon={<DownloadOutlined />}>
          Download Schedule
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default SideMenu;