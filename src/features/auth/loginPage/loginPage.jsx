import "./index.css";
import { Form, Input, Button, Checkbox, Card, Alert, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loginAction } from "../authApi";
import { useState } from "react";
import ImageBackground from "@/assets/images/background_phenikaa.jpg";
import Logo from "@/assets/images/logo_Phenikaa.png";
const { Title } = Typography;

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const rememberPage = useAppSelector((state) => state.auth.rememberPage);

  const [error, setError] = useState("");
  const onFinish = async (values) => {
    setError("");
    const res = await dispatch(loginAction(values));
    if (!res.payload) {
      setError("Email or Password is incorrect");
    } else {
      window.location.href = rememberPage;
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        display: "flex"
        // justifyContent: "space-between"
      }}
    >
      <div
        style={{
          width: "70vw",
          height: "100vh"
        }}
      >
        {/* tạo background video */}
        <video autoPlay muted loop className="video-background">
          <source
            src="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
            type="video/mp4"
          />
        </video>
      </div>
      <div
        style={{
          width: "30vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Card
          className="login-card"
          style={{
            width: "25vw",
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "center",
            alignItems: "center",
            // margin: "auto",
            // đặt màu trong suốt
            backgroundColor: "rgba(0, 0, 0, 0.274)",
            border: "none"
          }}
        >
          {/* Thêm logo */}
          <h2
            style={{
              color: "#ffffff",
              marginTop: "0",
              marginBottom: "0",
              // fontSize: "2rem",
              // chuyển font chữ thành Montserrat extralbold
              fontFamily: "Montserrat , sans-serif",
              fontWeight: "extrabold"
            }}
          >
            HỆ THỐNG QUẢN LÝ THIẾT BỊ
          </h2>
          <img src={Logo} alt="logo-phenikaa" style={{ width: "15vw" }} />
          {/* error message */}
          {error && <Alert message={error} type="error" />}
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!"
                }
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!"
                }
              ]}
            >
              <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox
                  style={{
                    color: "#ffffff"
                  }}
                >
                  Ghi nhớ đăng nhập
                </Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#F26526",
                  border: "none"
                }}
                htmlType="submit"
                className="login-form-button"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
