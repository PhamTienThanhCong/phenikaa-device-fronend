import React, { useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Table, Modal, Form, Input, Button, Typography, message } from "antd";

const { Title } = Typography;
const { TextArea } = Input;

const mockErrorReports = [
  {
    id: "1",
    studentCode: "S001",
    deviceName: "Laptop A",
    description: "Màn hình bị lỗi",
    status: "Chưa phản hồi"
  },
  {
    id: "2",
    studentCode: "S002",
    deviceName: "Máy chiếu B",
    description: "Không hiển thị hình ảnh",
    status: "Chưa phản hồi"
  }
  // Add more mock data as needed
];

const AdminErrorReportsPage = () => {
  const [reports, setReports] = useState(mockErrorReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleResponse = (values) => {
    const updatedReports = reports.map((report) =>
      report.id === selectedReport.id ? { ...report, status: "Đã phản hồi" } : report
    );
    setReports(updatedReports);
    message.success("Phản hồi của bạn đã được gửi!");
    setModalVisible(false);

    // Send email to the user
    const email = `${selectedReport.studentCode}@st.phenikaa-uni.edu.vn`;
    console.log(`Sending email to ${email} with response:`, values.response);

    // Here you would send the response email to the user
  };

  const columns = [
    { title: "Mã phiếu", dataIndex: "id", key: "id" },
    { title: "Mã sinh viên", dataIndex: "studentCode", key: "studentCode" },
    { title: "Tên thiết bị", dataIndex: "deviceName", key: "deviceName" },
    { title: "Mô tả lỗi", dataIndex: "description", key: "description" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => <Button onClick={() => handleViewReport(record)}>Phản hồi</Button>
    }
  ];

  return (
    <BaseLayout>
      <Title level={1}>Quản Lý Thông Báo Lỗi</Title>
      <Table columns={columns} dataSource={reports} rowKey="id" />

      {selectedReport && (
        <Modal
          title="Phản hồi thông báo lỗi"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleResponse}
            initialValues={{
              response: ""
            }}
          >
            <Form.Item label="Mã sinh viên">
              <Input value={selectedReport.studentCode} disabled />
            </Form.Item>
            <Form.Item label="Tên thiết bị">
              <Input value={selectedReport.deviceName} disabled />
            </Form.Item>
            <Form.Item label="Mô tả lỗi">
              <TextArea value={selectedReport.description} rows={4} disabled />
            </Form.Item>
            <Form.Item name="response" label="Phản hồi" rules={[{ required: true, message: "Vui lòng nhập phản hồi" }]}>
              <TextArea rows={4} placeholder="Phản hồi" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Gửi Phản Hồi
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </BaseLayout>
  );
};

export default AdminErrorReportsPage;
