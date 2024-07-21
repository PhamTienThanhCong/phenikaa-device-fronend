import React, { useState, useEffect } from "react";
import { Table, Button, Space, Typography, Modal, Input, Tag } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import BaseLayout from "@/features/layout/BaseLayout";

const { Title } = Typography;

// Dữ liệu mẫu cho lịch sử phiếu cấp
const initialData = [
  {
    key: "1",
    issueCode: "ISS001",
    issueDate: "2024-07-01",
    recipient: "Nguyễn Văn A",
    studentCode: "SV001",
    issueTime: "10:00",
    status: "Đã cấp",
    devices: [
      { deviceName: "MacBook Pro", quantity: 1 },
      { deviceName: "iPhone 12", quantity: 2 }
    ]
  },
  {
    key: "2",
    issueCode: "ISS002",
    issueDate: "2024-07-02",
    recipient: "Trần Thị B",
    studentCode: "SV002",
    issueTime: "14:30",
    status: "Chưa cấp",
    devices: [{ deviceName: "Sony A7 III", quantity: 1 }]
  }
  // Thêm dữ liệu khác nếu cần
];
const detailsColumns = [
  {
    title: "Thông tin",
    dataIndex: "info",
    key: "info",
    render: (text) => <strong>{text}</strong>,
    width: "40%" // Điều chỉnh độ rộng của cột
  },
  {
    title: "Giá trị",
    dataIndex: "value",
    key: "value",
    render: (text) => <span>{text}</span>,
    width: "60%" // Điều chỉnh độ rộng của cột
  }
];

const IssueHistoryPage = () => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // Modal type ('view')
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Thay thế bằng logic lấy dữ liệu từ API nếu cần
    setData(initialData);
    setFilteredData(initialData);
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchText.toLowerCase();
    setFilteredData(
      data.filter(
        (item) =>
          item.issueCode.toLowerCase().includes(lowercasedFilter) ||
          item.recipient.toLowerCase().includes(lowercasedFilter) ||
          item.studentCode.toLowerCase().includes(lowercasedFilter)
      )
    );
  }, [searchText, data]);

  const handleModalOpen = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
  };

  const handleModalClose = () => {
    setModalType(null);
    setSelectedItem(null);
  };

  const columns = [
    { title: "Mã phiếu", dataIndex: "issueCode", key: "issueCode" },
    { title: "Ngày cấp", dataIndex: "issueDate", key: "issueDate" },
    { title: "Thời gian cấp", dataIndex: "issueTime", key: "issueTime" },
    { title: "Tên người mượn", dataIndex: "recipient", key: "recipient" },
    { title: "Mã sinh viên", dataIndex: "studentCode", key: "studentCode" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => <Tag color={text === "Đã cấp" ? "green" : "red"}>{text}</Tag>
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center"
            // alignItems: "center"
          }}
        >
          <p type="text" onClick={() => handleModalOpen("view", record)} style={{ color: "blue", cursor: "pointer" }}>
            {<EyeOutlined />}{" "}
          </p>
        </Space>
      )
    }
  ];

  return (
    <BaseLayout>
      <div style={{ padding: "16px" }}>
        <Title level={2}>Lịch sử các phiếu đã cấp</Title>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-start" }}>
          <Input
            placeholder="Tìm kiếm theo mã phiếu, tên người mượn, mã sinh viên"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </div>
        <Table columns={columns} dataSource={filteredData} rowKey="key" />

        <Modal
          title={`Chi tiết phiếu ${selectedItem?.issueCode}`}
          visible={modalType === "view"}
          onCancel={handleModalClose}
          footer={null}
          width={800}
          style={{ top: 20 }}
        >
          {selectedItem && (
            <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
                <div style={{ marginRight: 16 }}>
                  <h4 style={{ marginBottom: 4 }}>QR Code:</h4>
                  {/* Thay thế bằng QR Code thực tế */}
                  <img
                    src="https://via.placeholder.com/200"
                    alt="QR Code"
                    style={{ width: "150px", borderRadius: "8px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: 4 }}>Thông tin phiếu:</h4>
                  <Table
                    columns={detailsColumns}
                    dataSource={[
                      { info: "Mã phiếu", value: selectedItem.issueCode },
                      { info: "Ngày cấp", value: selectedItem.issueDate },
                      { info: "Thời gian cấp", value: selectedItem.issueTime },
                      { info: "Tên người mượn", value: selectedItem.recipient },
                      { info: "Mã sinh viên", value: selectedItem.studentCode },
                      {
                        info: "Trạng thái",
                        value: (
                          <Tag color={selectedItem.status === "Đã cấp" ? "green" : "red"}>{selectedItem.status}</Tag>
                        )
                      }
                    ]}
                    pagination={false}
                    showHeader={false}
                    rowKey="info"
                    style={{ marginBottom: 16, border: "1px solid #f0f0f0", borderRadius: "8px" }}
                    className="custom-table"
                  />
                </div>
              </div>
              <div>
                <h4>Danh sách thiết bị mượn:</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedItem.devices.map((device, index) => (
                    <Tag key={index} color="blue" style={{ margin: "4px" }}>
                      {device.deviceName} ({device.quantity})
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </BaseLayout>
  );
};

export default IssueHistoryPage;
