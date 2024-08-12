import { Layout, Dropdown, Menu, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import { theme } from "antd";
import "./header.scss";
import { logOut } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getProfile } from "@/pages/profile/profileApi";
import { useEffect } from "react";

const { Header } = Layout;

function Headerlayout() {
  // const currentUser = useAppSelector((state) => state.auth.currentUser);
  const dispatch = useAppDispatch();
  const { profileList, isGetAll } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (!isGetAll) {
      dispatch(getProfile());
    }
  }, [dispatch, isGetAll]);

  const logout = async () => {
    await dispatch(logOut());
  };

  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <a href="/profile">Trang cá nhân</a>
      </Menu.Item>
      <Menu.Item key="logout">
        <a
          onClick={() => {
            logout();
          }}
        >
          Đăng xuất
        </a>
      </Menu.Item>
    </Menu>
  );
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
        <h2
          style={{
            color: "#F26526"
          }}
        >
          Hệ thống quản lý thiết bị
        </h2>
        <div>
          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="user-info" onClick={(e) => e.preventDefault()}>
              <Avatar icon={<UserOutlined />} />
              <span className="username">{profileList?.full_name}</span>
            </div>
          </Dropdown>
        </div>
      </Box>
    </Header>
  );
}

export default Headerlayout;
