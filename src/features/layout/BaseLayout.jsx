import PropTypes from "prop-types";
import { Layout, Menu, theme, Divider } from "antd";
// const { Header, Content, Sider } = Layout;
const { Content, Footer, Sider } = Layout;
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import React from "react";
import "./BaseLayout.scss";
import Headerlayout from "./components/header/Header";

// base layout component
// const BaseLayout = ({ children }) => {
//   return (
//     <div>
//       <h3>header</h3>
//       {children}
//     </div>
//   );
// };
//

const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`
}));
const BaseLayout = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
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
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
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
          defaultSelectedKeys={["4"]}
          items={items}
          style={{
            // width: "100%",
            width: "15.6rem",
            border: "none"
            // height: "100%"
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
              // minHeight: 360
              // background: colorBgContainer
              // borderRadius: borderRadiusLG
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center"
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default BaseLayout;
