import { Layout, Dropdown, Menu, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Box } from "@mui/material";
import { theme } from "antd";
import "./header.scss";
import { logOut } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/app/hooks";

const { Header } = Layout;

function Headerlayout() {
  // const currentUser = useAppSelector((state) => state.auth.currentUser);
  const dispatch = useAppDispatch();
  const logout = () => {
    dispatch(logOut());
  };

  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <a href="/profile">Profile</a>
      </Menu.Item>
      <Menu.Item key="logout">
        <a
          onClick={() => {
            logout();
          }}
        >
          Logout
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
