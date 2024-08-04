import React, { useState } from "react";
import { Table, Tabs, Input, Avatar, Layout, Button, Modal, Form, DatePicker, Select, Row, Col } from "antd";
import { notification } from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import BaseLayout from "@/features/layout/BaseLayout";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getCustomer } from "./CustomerAPI";
import { getUser, createUser, deleteUser, editUser } from "./CustomerAPI";

import "./manageCustome.scss";
// import { idIDIntl } from "@ant-design/pro-components";
import moment from "moment";
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
  // console.log(11111, createUser);
  console.log(11111, users);
  //gender

  const listQTV = users.map((item) => {
    return {
      user_id: item.id,
      email: item.email,
      gender: item.profile.gender,
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

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  const listDataSinhVien = customer.filter((item) => item.role === 2);
  const listDataGiangVien = customer.filter((item) => item.role === 1);
  const genderOptions = [
    {
      label: "Nam",
      value: 1
    },
    {
      label: "Nữ",
      value: 2
    }
  ];

  const handleAdd = () => {
    setIsEditing(false);
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    console.log(999999999, genderOptions);
    console.log(88888888, record.birth_date);
    setIsEditing(true);
    setEditingRecord(record);
    form.setFieldsValue({
      username: record.username,
      password: record.password,
      full_name: record.full_name,
      email: record.email,
      phone_number: record.phone_number,
      address: record.address,
      gender: genderOptions.find((item) => item.value === record.gender).value,
      card_id: record.card_id,
      dob: record.birth_date ? moment(record.birth_date) : null
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn xoá bản ghi này?",
      okText: "Xoá",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await dispatch(deleteUser({ user_id: record.user_id }));
          await dispatch(getUser());
          notification.success({
            message: "Xóa thành công",
            description: "Bản ghi đã được xóa thành công."
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          notification.error({
            message: "Lỗi",
            description: "Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại."
          });
        }
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  console.log(22222, editingRecord);
  const handleSave = async (values) => {
    // console.log(11111, values);
    if (isEditing) {
      console.log(11111, isEditing);
      // update
      try {
        const payload = {
          full_name: values.username,
          email: values.email,
          role: 1,
          password: values.password,
          is_active: true,
          profile: {
            full_name: values.full_name,
            avatar: "",
            birth_date: values.dob ? moment(values.dob).format("DD/MM/YYYY") : null,
            gender: "1",
            address: values.address,
            phone_number: values.phone_number,
            card_id: values.card_id
          }
        };
        // console.log(222222, payload);
        await dispatch(
          editUser({
            user_id: editingRecord.user_id,
            ...payload
          })
        );
        await dispatch(editUser({ user_id: editingRecord.user_id, ...payload }));
        notification.success({
          message: "Cập nhật thành công",
          description: "Thông tin đã được cập nhật thành công."
        });
      } catch (error) {
        console.error("Error saving user:", error);
      }
    } else {
      //  create user
      try {
        if (isEditing) {
          // Handle update record
        } else {
          const payload = {
            full_name: values.username,
            email: values.email,
            role: 1,
            password: values.password,
            profile: {
              full_name: values.full_name,
              avatar: "",
              birth_date: values.dob ? moment(values.dob).format("DD/MM/YYYY") : null,
              gender: values.gender,
              address: values.address,
              phone_number: values.phone_number,
              card_id: values.card_id
            }
          };

          await dispatch(createUser(payload));
          notification.success({
            message: "Tạo mới thành công",
            description: "Người dùng mới đã được tạo thành công."
          });
        }
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại."
        });
        console.error("Error saving user:", error);
      }
    }
    await dispatch(getUser());

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
    // {
    //   title: "Mật khẩu",
    //   dataIndex: "password",
    //   key: "password"
    // },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      // nếu giới tính = 1 thì hiển thị Nam, ngược lại hiển thị Nữ
      render: (text) => (text === 1 ? "Nam" : "Nữ")
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Mã quản trị viên",
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
          <TabPane tab="Quản Trị Viên" key="3">
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
          title={isEditing ? "Sửa thông tin" : "Thêm mới quản trị viên"}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="Tên tài khoản"
                  rules={[{ required: true, message: "Vui lòng nhập tên tài khoản" }]}
                >
                  <Input placeholder="Nhập tên tài khoản" style={{ height: 50 }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="full_name"
                  label="Họ và tên"
                  rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                >
                  <Input placeholder="Nhập họ và tên" style={{ height: 50 }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
                  <Input type="email" placeholder="Nhập email" style={{ height: 50 }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone_number"
                  label="Số điện thoại"
                  rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                >
                  <Input type="tel" placeholder="Nhập số điện thoại" style={{ height: 50 }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="address" label="Địa chỉ">
                  <Input placeholder="Nhập địa chỉ" style={{ height: 50 }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="gender" label="Giới tính">
                  <Select placeholder="Chọn giới tính" style={{ height: 50 }}>
                    {genderOptions.map(
                      (
                        item // render option
                      ) => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      )
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="card_id" label="Mã quản trị viên">
                  <Input placeholder="Nhập mã quản trị viên" style={{ height: 50 }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="dob"
                  label="Ngày sinh"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập ngày sinh"
                    }
                  ]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày sinh"
                    style={{ width: "100%", height: 50 }}
                    disabledDate={(current) => current && current > moment().endOf("day")}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleCancel} style={{ marginRight: 12 }}>
                Hủy bỏ
              </Button>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: "#F26526" }}>
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </BaseLayout>
  );
};

export default ManageCustome;
