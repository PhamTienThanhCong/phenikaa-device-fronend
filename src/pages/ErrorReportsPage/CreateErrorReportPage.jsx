import React, { useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Form, Input, Button, Typography, message } from "antd";

const { Title } = Typography;
const { TextArea } = Input;

const UserErrorReportForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    // Here you would send the data to your backend or handle it as needed
    console.log("Received values from form: ", values);
    message.success("Báo lỗi của bạn đã được gửi thành công!");
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
          <Input placeholder="Mã sinh viên" />
        </Form.Item>
        <Form.Item
          name="deviceName"
          label="Tên thiết bị lỗi"
          rules={[{ required: true, message: "Vui lòng nhập tên thiết bị lỗi" }]}
        >
          <Input placeholder="Tên thiết bị lỗi" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả lỗi"
          rules={[{ required: true, message: "Vui lòng nhập mô tả lỗi" }]}
        >
          <TextArea rows={4} placeholder="Mô tả lỗi" />
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
