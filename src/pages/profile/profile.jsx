import { useEffect } from "react";
import { Descriptions, Layout, Card } from "antd";

import BaseLayout from "@/features/layout/BaseLayout";
import "./profile.scss";
import { getProfile } from "./profileApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

const { Content } = Layout;

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { profileList, isGetAll } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (!isGetAll) {
      dispatch(getProfile());
    }
  }, [dispatch, isGetAll]);

  const userData = {
    name: profileList.full_name,
    email: profileList.email,
    phone: profileList.profile.phone_number,
    role: profileList.role,
    address: profileList.profile.address,
    birthday: profileList.profile.birth_date
  };

  return (
    <BaseLayout>
      <Content style={{ padding: "24px", margin: 0, minHeight: 280 }}>
        <Card className="profile-card">
          <Descriptions title="Thông tin cá nhân" bordered column={1}>
            <Descriptions.Item label="Họ tên">{userData.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{userData.phone}</Descriptions.Item>
            <Descriptions.Item label="Role">
              {userData.role === 1 ? "Quản trị viên" : "Quản lý thiết bị"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{userData.address}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{userData.birthday}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Content>
    </BaseLayout>
  );
};

export default ProfilePage;
