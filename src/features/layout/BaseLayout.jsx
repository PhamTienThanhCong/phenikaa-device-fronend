import PropTypes from "prop-types";
import { Layout, Menu, theme, Divider } from "antd";
// const { Header, Content, Sider } = Layout;
const { Content, Footer, Sider } = Layout;
import {
  UserOutlined,
  DashboardOutlined,
  LaptopOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BellOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import "./BaseLayout.scss";
import Headerlayout from "./components/header/Header";
import { PATH } from "@/constants/path";
import { useState, useEffect } from "react";

const navbars = [
  {
    key: PATH.DASHBOARD,
    icon: React.createElement(DashboardOutlined),
    label: "Dashboard"
  },
  {
    key: PATH.CAMERA,
    icon: React.createElement(DashboardOutlined),
    label: "Quản lý camera"
  },
  {
    key: PATH.CUSTOME,
    icon: React.createElement(UserOutlined),
    label: "Quản lý người dùng"
  },
  {
    key: "equipment",
    icon: React.createElement(LaptopOutlined),
    label: "Quản lý mượn thiết bị",
    children: [
      {
        key: PATH.EQUIPMENT.LIST,
        label: "Danh sách thiết bị"
      },
      {
        key: PATH.EQUIPMENT.REQUEST,
        label: "Danh sách đang mượn"
      },
      {
        key: PATH.EQUIPMENT.HISTORY,
        label: "Tra cứu lịch sử mượn"
      }
    ]
  },
  {
    key: PATH.MAINTENANCE_SCHEDULE,
    icon: React.createElement(CalendarOutlined),
    label: "Lịch trình bảo trì"
  },
  {
    key: PATH.EQUIPMENT_MANAGEMENT,
    icon: React.createElement(LaptopOutlined),
    label: "Quản lý danh sách thiết bị"
  },
  {
    key: "roomLoan",
    icon: React.createElement(LaptopOutlined),
    label: "Quản lý mượn phòng",
    children: [
      {
        key: PATH.ROOM_LOAN.LIST,
        label: "Danh sách phòng"
      },
      {
        key: PATH.ROOM_LOAN.REQUEST,
        label: "Danh sách phòng đang mượn"
      },
      {
        key: PATH.ROOM_LOAN.HISTORY,
        label: "Tra cứu lịch sử mượn"
      }
    ]
  },
  {
    key: PATH.ISSUE_HISTORY,
    icon: React.createElement(FileTextOutlined),
    label: "Đơn vị bảo trì"
  },
  {
    key: PATH.ERROR_REPORTS,
    icon: React.createElement(BellOutlined),
    label: "Thông báo lỗi",
    children: [
      {
        key: PATH.ERROR_REPORTS.LIST,
        label: "Danh sách thông báo lỗi"
      }
      // {
      //   key: PATH.ERROR_REPORTS.CREATE,
      //   label: "Tạo thông báo lỗi"
      // }
    ]
  }
];

const BaseLayout = ({ children }) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const findKey = (navbars, path) => {
      for (let item of navbars) {
        if (item.key === path) {
          return item.key;
        }
        if (item.children) {
          const childKey = findKey(item.children, path);
          if (childKey) {
            return item.key; // Return the parent key
          }
        }
      }
      return null;
    };

    const currentItemKey = findKey(navbars, location.pathname);
    if (currentItemKey) {
      setSelectedKey(location.pathname);
      setOpenKeys((prevKeys) => [...new Set([...prevKeys, currentItemKey])]);
    }
  }, [location.pathname]);

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    navigate(key);
  };

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Layout
      style={{
        width: "100vw",
        height: "100vh"
      }}
    >
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width="17.7rem"
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {}}
        className="custom-sider"
        style={{
          background: colorBgContainer,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div className="demo-logo-vertical">
          <img
            className="image-logo"
            src="https://i.pinimg.com/originals/2e/51/60/2e5160080c1bb792e0cee650af458d80.png"
            alt="logo-phenikaa"
          />{" "}
        </div>
        {/* tạo đường kẻ bằng andt */}
        <Divider />

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          onClick={handleMenuClick}
          items={navbars}
          style={{
            width: "15.6rem",
            border: "none"
          }}
        />
      </Sider>

      <Layout>
        <Headerlayout />
        <Content
          style={{
            margin: "24px 16px 0",
            width: "99%",
            height: "100%",
            background: colorBgContainer,
            borderRadius: "0.5rem"
          }}
        >
          <div
            style={{
              padding: 24
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center"
          }}
        ></Footer>
      </Layout>
    </Layout>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default BaseLayout;
