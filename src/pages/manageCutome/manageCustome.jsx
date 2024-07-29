import React, { useState } from "react";
import { Table, Tabs, Input, Avatar, Layout, Button, Modal, Form, Upload } from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import BaseLayout from "@/features/layout/BaseLayout";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getCustomer } from "./CustomerAPI";
import { getUser, createUser } from "./CustomerAPI";

import "./manageCustome.scss";

const { TabPane } = Tabs;
const { Content } = Layout;

const studentColumns = [
  {
    title: "Avatar",
    dataIndex: "avatar",
    key: "avatar",
    render: (avatar) => <Avatar src={avatar} />
  },
  {
    title: "Tên",
    dataIndex: "full_name",
    key: "full_name"
  },
  {
    title: "Ngày sinh",
    dataIndex: "birth_date",
    key: "birth_date"
  },
  {
    title: "Mã sinh viên",
    dataIndex: "card_id",
    key: "card_id"
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    key: "phone_number"
  },
  {
    title: "Khoa",
    dataIndex: "department",
    key: "department"
  }
];

const teacherColumns = [
  {
    title: "Avatar",
    dataIndex: "avatar",
    key: "avatar",
    render: (avatar) => <Avatar src={avatar} />
  },
  {
    title: "Tên",
    dataIndex: "full_name",
    key: "full_name"
  },
  {
    title: "Mã giảng viên",
    dataIndex: "card_id",
    key: "card_id"
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone_number",
    key: "phone_number"
  },
  {
    title: "Ngày sinh",
    dataIndex: "birth_date",
    key: "birth_date"
  },
  {
    title: "Khoa",
    dataIndex: "department",
    key: "department"
  }
];

const ManageCustome = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();
  const { customer, isCustomer } = useAppSelector((state) => state.customer);
  const { users, isUser } = useAppSelector((state) => state.customer);
  // const { createUser, isCreateUser } = useAppSelector((state) => state.customer);
  console.log(11111, createUser);
  const listQTV = users.map((item) => {
    return {
      email: item.email,
      username: item.full_name,
      birth_date: item.profile.birth_date,
      full_name: item.profile.full_name,
      avatar: item.profile.avatar,
      address: item.profile.address,
      phone_number: item.profile.phone_number,
      card_id: item.profile.card_id
    };
  });

  React.useEffect(() => {
    if (!isCustomer) {
      dispatch(getCustomer());
    }
  }, [dispatch, isCustomer]);

  React.useEffect(() => {
    if (!isUser) {
      dispatch(getUser());
    }
  }, [dispatch, isUser]);
  // React.useEffect(() => {
  //   if (isCreateUser) {
  //     dispatch(createUser());
  //   }
  // }, [createUser, dispatch, isCreateUser]);
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  const listDataSinhVien = customer.filter((item) => item.role === 2);
  const listDataGiangVien = customer.filter((item) => item.role === 1);
  // console.log(11111, listDataGiangVien);

  const handleAdd = () => {
    setIsEditing(false);
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    // Handle delete record
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = async (values) => {
    if (isEditing) {
      // Handle update record
    } else {
      // tạo API create user
      try {
        if (isEditing) {
          // Handle update record
        } else {
          // Create new user
          // {
          //   "full_name": "string",
          //   "email": "user@example.com",
          //   "role": 1,
          //   "password": "string",
          //   "profile": {
          //     "full_name": "string",
          //     "avatar": "string",
          //     "birth_date": "string",
          //     "gender": 0,
          //     "address": "string",
          //     "phone_number": "string",
          //     "card_id": "string"
          //   }
          // }
          const payload = {
            full_name: values.name,
            email: "values.email@gmail.com",
            role: 1,
            password: "123456",
            profile: {
              full_name: values.name,
              avatar: "values.avatar",
              birth_date: "values.d",
              gender: 0,
              address: "string",
              phone_number: "string",
              card_id: "string"
            }
          };
          console.log(222222, payload);
          await dispatch(createUser(payload));
        }
      } catch (error) {
        console.error("Error saving user:", error);
      }
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const filteredStudents = listDataSinhVien.filter(
    (student) =>
      student.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
      student.card_id.toLowerCase().includes(searchText.toLowerCase()) ||
      student.department.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredTeachers = listDataGiangVien.filter(
    (teacher) =>
      teacher.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
      teacher.card_id.toLowerCase().includes(searchText.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredQTV = listQTV.filter((qtv) => qtv.full_name.toLowerCase().includes(searchText.toLowerCase()));

  const qtvColumns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => <Avatar src={avatar} />
    },
    {
      title: "Tên",
      dataIndex: "full_name",
      key: "full_name"
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number"
    },
    {
      title: "Ngày sinh",
      dataIndex: "birth_date",
      key: "birth_date"
    },

    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Button onClick={() => handleDelete(record)} style={{ marginLeft: 8 }}>
            Xoá
          </Button>
        </>
      )
    }
  ];

  return (
    <BaseLayout>
      <Content style={{ padding: "24px", margin: 0, minHeight: 280 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Sinh viên" key="1">
            <Input
              placeholder="Tìm kiếm"
              value={searchText}
              onChange={handleSearchChange}
              style={{ marginBottom: "20px", width: "100%" }}
              suffix={<SearchOutlined />}
            />
            <Table
              columns={studentColumns}
              dataSource={filteredStudents}
              scroll={{ x: "max-content" }} // responsive scroll
            />
          </TabPane>
          <TabPane tab="Giảng viên" key="2">
            <Input
              placeholder="Tìm kiếm"
              value={searchText}
              onChange={handleSearchChange}
              style={{ marginBottom: "20px", width: "100%" }}
              suffix={<SearchOutlined />}
            />
            <Table
              columns={teacherColumns}
              dataSource={filteredTeachers}
              scroll={{ x: "max-content" }} // responsive scroll
            />
          </TabPane>
          <TabPane tab="QTV" key="3">
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <Input
                placeholder="Tìm kiếm"
                value={searchText}
                onChange={handleSearchChange}
                style={{ marginBottom: "20px", width: "100%" }}
                suffix={<SearchOutlined />}
              />
              <Button
                type="primary"
                onClick={handleAdd}
                style={{
                  marginBottom: "20px",
                  color: "white",
                  backgroundColor: "#F26526",
                  height: "50px",
                  marginLeft: "20px"
                }}
              >
                Thêm mới
              </Button>
            </div>

            <Table columns={qtvColumns} dataSource={filteredQTV} scroll={{ x: "max-content" }} />
          </TabPane>
        </Tabs>
        <Modal
          title={isEditing ? "Sửa thông tin" : "Thêm mới"}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item name="avatar" label="Avatar">
              <Upload>
                <Button icon={<UploadOutlined />}>Tải lên</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="name" label="Tên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  console.log(1111);
                }}
              >
                Lưu
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
                Hủy bỏ
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </BaseLayout>
  );
};

export default ManageCustome;
