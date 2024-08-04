import React, { useEffect } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Form, Input, Button, Typography, message, Select } from "antd";
import { getAllCustomer, createReport } from "@/pages/ErrorReportsPage/errorReportsApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

const { Title } = Typography;
const { TextArea } = Input;

const UserErrorReportForm = () => {
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();
  const { users, isUser } = useAppSelector((state) => state.notify);

  useEffect(() => {
    if (!isUser) {
      dispatch(getAllCustomer());
    }
  }, [dispatch, isUser]);
  const listUserOptions = users.map((user) => ({
    value: user.id,
    label: user.email
  }));

  const handleSubmit = async (values) => {
    // Here you would send the data to your backend or handle it as needed
    console.log("Received values from form: ", values);

    const payload = {
      customer_id: values.studentCode,
      title: values.deviceName,
      content: values.description
    };
    await dispatch(createReport(payload));
    if (isUser) {
      message.success("Báo lỗi của bạn đã được gửi thành công!");
    } else {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
    form.resetFields();
  };

  return (
    <BaseLayout>
      <Title level={1}>Tạo Thông Báo Lỗi</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          studentCode: "",
          deviceName: "",
          description: ""
        }}
      >
        <Form.Item
          name="studentCode"
          label="Mã sinh viên"
          rules={[{ required: true, message: "Vui lòng nhập mã sinh viên" }]}
        >
          <Select
            placeholder="Chọn sinh viên"
            options={listUserOptions}
            showSearch
            filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          />
        </Form.Item>
        <Form.Item
          name="deviceName"
          label="Tiều đề"
          rules={[{ required: true, message: "Vui lòng nhập tên thiết bị lỗi" }]}
        >
          <Input placeholder="Tiêu đề" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả lỗi "
          rules={[{ required: true, message: "Vui lòng nhập mô tả lỗi " }]}
        >
          <TextArea rows={4} placeholder="Mô tả lỗi (tên thiết bị)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi Thông Báo Lỗi
          </Button>
        </Form.Item>
      </Form>
    </BaseLayout>
  );
};

export default UserErrorReportForm;
