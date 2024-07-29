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
// import { LockOutlined, MobileOutlined, UserOutlined } from "@ant-design/icons";
// import { LoginFormPage, ProFormCaptcha, ProFormCheckbox, ProFormText } from "@ant-design/pro-components";
// import { Divider, Tabs, message, theme } from "antd";
// // import { CSSProperties } from 'react';
// import { useState } from "react";

// // type LoginType = 'phone' | 'account';

// const LoginPage = () => {
//   const [loginType, setLoginType] = useState("account");
//   const { token } = theme.useToken();
//   return (
//     <div
//       style={{
//         backgroundColor: "white",
//         height: "100vh",
//         width: "100vw"
//       }}
//     >
//       <LoginFormPage
//         backgroundImageUrl="https://www.centralcons.vn/wp-content/uploads/2021/12/PHENNIKA-thumnail-1.jpg"
//         logo="https://github.githubassets.com/favicons/favicon.png"
//         backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
//         title="Github"
//         containerStyle={{
//           backgroundColor: "rgba(0, 0, 0,0.65)",
//           backdropFilter: "blur(4px)"
//         }}
//         subTitle="全球最大的代码托管平台"
//         activityConfig={{
//           style: {
//             boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
//             color: token.colorTextHeading,
//             borderRadius: 8,
//             backgroundColor: "rgba(255,255,255,0.25)",
//             backdropFilter: "blur(4px)"
//           }
//         }}
//         actions={
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               flexDirection: "column"
//             }}
//           >
//             <Divider plain>
//               <span
//                 style={{
//                   color: token.colorTextPlaceholder,
//                   fontWeight: "normal",
//                   fontSize: 14
//                 }}
//               >
//                 其他登录方式
//               </span>
//             </Divider>
//           </div>
//         }
//       >
//         <Tabs centered activeKey={loginType} onChange={(activeKey) => setLoginType(activeKey)}>
//           <Tabs.TabPane key={"account"} tab={"账号密码登录"} />
//           <Tabs.TabPane key={"phone"} tab={"手机号登录"} />
//         </Tabs>
//         {loginType === "account" && (
//           <>
//             <ProFormText
//               name="username"
//               fieldProps={{
//                 size: "large",
//                 prefix: (
//                   <UserOutlined
//                     style={{
//                       color: token.colorText
//                     }}
//                     className={"prefixIcon"}
//                   />
//                 )
//               }}
//               placeholder={"用户名: admin or user"}
//               rules={[
//                 {
//                   required: true,
//                   message: "请输入用户名!"
//                 }
//               ]}
//             />
//             <ProFormText.Password
//               name="password"
//               fieldProps={{
//                 size: "large",
//                 prefix: (
//                   <LockOutlined
//                     style={{
//                       color: token.colorText
//                     }}
//                     className={"prefixIcon"}
//                   />
//                 )
//               }}
//               placeholder={"密码: ant.design"}
//               rules={[
//                 {
//                   required: true,
//                   message: "请输入密码！"
//                 }
//               ]}
//             />
//           </>
//         )}
//         {loginType === "phone" && (
//           <>
//             <ProFormText
//               fieldProps={{
//                 size: "large",
//                 prefix: (
//                   <MobileOutlined
//                     style={{
//                       color: token.colorText
//                     }}
//                     className={"prefixIcon"}
//                   />
//                 )
//               }}
//               name="mobile"
//               placeholder={"手机号"}
//               rules={[
//                 {
//                   required: true,
//                   message: "请输入手机号！"
//                 },
//                 {
//                   pattern: /^1\d{10}$/,
//                   message: "手机号格式错误！"
//                 }
//               ]}
//             />
//             <ProFormCaptcha
//               fieldProps={{
//                 size: "large",
//                 prefix: (
//                   <LockOutlined
//                     style={{
//                       color: token.colorText
//                     }}
//                     className={"prefixIcon"}
//                   />
//                 )
//               }}
//               captchaProps={{
//                 size: "large"
//               }}
//               placeholder={"请输入验证码"}
//               captchaTextRender={(timing, count) => {
//                 if (timing) {
//                   return `${count} ${"获取验证码"}`;
//                 }
//                 return "获取验证码";
//               }}
//               name="captcha"
//               rules={[
//                 {
//                   required: true,
//                   message: "请输入验证码！"
//                 }
//               ]}
//               onGetCaptcha={async () => {
//                 message.success("获取验证码成功！验证码为：1234");
//               }}
//             />
//           </>
//         )}
//         <div
//           style={{
//             marginBlockEnd: 24
//           }}
//         >
//           <ProFormCheckbox noStyle name="autoLogin">
//             自动登录
//           </ProFormCheckbox>
//           <a
//             style={{
//               float: "right"
//             }}
//           >
//             忘记密码
//           </a>
//         </div>
//       </LoginFormPage>
//     </div>
//   );
// };

// export default LoginPage;
