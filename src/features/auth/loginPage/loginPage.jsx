import "./index.css";
import { Form, Input, Button, Checkbox, Card, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loginAction } from "../authApi";
import { useState } from "react";

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
    <Card className="login-card">
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
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginPage;
