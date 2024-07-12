import React from "react";
import { Layout, Dropdown, Menu, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import { theme } from "antd";

import "./header.scss";

const { Header } = Layout;

const menu = (
  <Menu>
    <Menu.Item key="profile">
      <a href="/profile">Profile</a>
    </Menu.Item>
    <Menu.Item key="logout">
      <a href="/logout">Logout</a>
    </Menu.Item>
  </Menu>
);

function Headerlayout() {
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  return (
    <Header
      style={{
        padding: 0,
        marginLeft: "1rem",
        background: colorBgContainer,
        borderRadius: "0.5rem",
        height: "6rem",
        width: "99%"
      }}
    >
      <Box className="header-content">
        <h2>Đại học Phenikaa</h2>
        <div>
          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="user-info" onClick={(e) => e.preventDefault()}>
              <Avatar icon={<UserOutlined />} />
              <span className="username">Nguyễn Văn A</span>
            </div>
          </Dropdown>
        </div>
      </Box>
    </Header>
  );
}

export default Headerlayout;
