import React, { useEffect, useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Table, Modal, Form, Input, Button, Typography, message, Tag, Space, Select } from "antd";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getErrorReportsList, markAsRead } from "./errorReportsApi";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AdminErrorReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchText, setSearchText] = useState("");

  const dispatch = useAppDispatch();
  const { notify, isnotify } = useAppSelector((state) => state.notify);

  useEffect(() => {
    if (!isnotify) {
      dispatch(getErrorReportsList());
    }
  }, [dispatch, isnotify]);

  useEffect(() => {
    const updatedNotifyList = notify.map((item, index) => ({
      index: index + 1,
      id: item.id,
      studentCode: item.customer.card_id,
      studentEmail: item.customer.email,
      studentName: item.customer.full_name,
      deviceName: item.title,
      description: item.content,
      status: item.is_read
    }));
    setReports(updatedNotifyList);
    setFilteredReports(updatedNotifyList);
  }, [notify]);

  useEffect(() => {
    let filtered = reports;

    if (statusFilter !== null && statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    if (searchText) {
      filtered = filtered.filter(
        (report) =>
          report.deviceName.toLowerCase().includes(searchText.toLowerCase()) ||
          report.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
          report.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [statusFilter, searchText, reports]);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleResponse = async (values) => {
    const { response } = values;
    const subject = `Phản hồi về lỗi ${selectedReport.id}`;
    const body = `Mô tả lỗi: ${selectedReport.description}\n\nPhản hồi: ${response}`;
    const mailto = `mailto:${selectedReport.studentEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(mailto, "_blank");

    const payload = {
      explain: "Giải thích thông báo"
    };

    await dispatch(markAsRead({ notify_id: selectedReport.id, ...payload }));
    dispatch(getErrorReportsList());

    message.success("Phản hồi đã được gửi qua email");
    setModalVisible(false);
  };

  const columns = [
    { title: "STT", dataIndex: "index", key: "index" },
    { title: "Mã phiếu", dataIndex: "id", key: "id", render: (text) => <>TB{text}</> },
    { title: "Tiêu đề", dataIndex: "deviceName", key: "deviceName" },
    { title: "Mô tả lỗi", dataIndex: "description", key: "description" },
    { title: "Mã sinh viên", dataIndex: "studentCode", key: "studentCode" },
    { title: "Tên sinh viên", dataIndex: "studentName", key: "studentName" },
    { title: "Email", dataIndex: "studentEmail", key: "studentEmail" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? <Tag color="success">Đã xử lý</Tag> : <Tag color="error">Chưa xử lý</Tag>)
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleViewReport(record)} disabled={record.status}>
          Phản hồi
        </Button>
      )
    }
  ];

  return (
    <BaseLayout>
      <Title level={1}>Quản Lý Thông Báo Lỗi</Title>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 100, height: 40 }}
          onChange={(value) => setStatusFilter(value)}
          allowClear
        >
          <Option value="all">Tất cả</Option>
          <Option value={true}>Đã xử lý</Option>
          <Option value={false}>Chưa xử lý</Option>
        </Select>
        <Input
          placeholder="Tìm kiếm theo tiêu đề, tên sinh viên, mô tả lỗi"
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Space>
      <Table columns={columns} dataSource={filteredReports} rowKey="id" />

      {selectedReport && (
        <Modal
          title={`Phản hồi thông báo lỗi đến: ${selectedReport.studentEmail}`}
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
            <Form.Item label="Mã người dùng">
              <Input value={selectedReport.studentCode} disabled />
            </Form.Item>
            <Form.Item label="Tiêu đề">
              <Input value={selectedReport.deviceName} disabled />
            </Form.Item>
            <Form.Item label="Tên người dùng">
              <Input value={selectedReport.studentName} disabled />
            </Form.Item>
            <Form.Item label="Mô tả lỗi">
              <TextArea value={selectedReport.description} rows={4} disabled />
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
