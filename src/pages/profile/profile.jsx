import React from "react";
import { Avatar, Descriptions, Layout, Button, Card } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import BaseLayout from "@/features/layout/BaseLayout";
import "./profile.scss";

const { Content } = Layout;

const ProfilePage = () => {
  const userData = {
    avatar: "https://via.placeholder.com/150",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    role: "Quản lý thiết bị",
    position: "Quản trị viên"
  };

  return (
    <BaseLayout>
      <Content style={{ padding: "24px", margin: 0, minHeight: 280 }}>
        <Card className="profile-card">
          <div className="profile-header">
            <Avatar size={200} src={userData.avatar} icon={<UserOutlined />} />
            <div className="profile-name">
              <h2>{userData.name}</h2>
              <Button type="primary" icon={<EditOutlined />}>
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          </div>
          <Descriptions title="Thông tin cá nhân" bordered column={1}>
            <Descriptions.Item label="Họ tên">{userData.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{userData.phone}</Descriptions.Item>
            <Descriptions.Item label="Role">{userData.role}</Descriptions.Item>
            <Descriptions.Item label="Chức vụ">{userData.position}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Content>
    </BaseLayout>
  );
};

export default ProfilePage;
