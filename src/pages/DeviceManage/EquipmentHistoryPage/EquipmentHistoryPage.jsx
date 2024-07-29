import React, { useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Button, Table, Modal, Input, Typography } from "antd";
import QRCode from "qrcode.react";

const { Title } = Typography;

const mockHistory = [
  {
    slipCode: "MS001",
    borrowerName: "Nguyen Van A",
    borrowDate: "2024-07-01",
    returnDate: "2024-07-10",
    issuedBy: "Admin A"
  },
  {
    slipCode: "MS002",
    borrowerName: "Le Thi B",
    borrowDate: "2024-07-05",
    returnDate: "2024-07-15",
    issuedBy: "Admin B"
  }
  // Add more mock data as needed
];

const EquipmentHistoryPage = () => {
  const [history, setHistory] = useState(mockHistory);
  const [searchText, setSearchText] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredHistory = history.filter((record) => record.slipCode.toLowerCase().includes(searchText.toLowerCase()));

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setViewModalVisible(true);
  };

  const columns = [
    { title: "Mã phiếu mượn", dataIndex: "slipCode", key: "slipCode" },
    { title: "Tên người mượn", dataIndex: "borrowerName", key: "borrowerName" },
    { title: "Ngày mượn", dataIndex: "borrowDate", key: "borrowDate" },
    { title: "Ngày trả", dataIndex: "returnDate", key: "returnDate" },
    { title: "Tên tài khoản đã cho mượn", dataIndex: "issuedBy", key: "issuedBy" },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => <Button onClick={() => handleViewDetails(record)}>Xem chi tiết</Button>
    }
  ];

  return (
    <BaseLayout>
      <Title level={1}>Tra cứu lịch sử mượn</Title>
      <Input
        placeholder="Tìm kiếm theo mã phiếu mượn"
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table columns={columns} dataSource={filteredHistory} rowKey="slipCode" />

      {/* Modal to view details */}
      <Modal
        title="Chi tiết phiếu mượn"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedRecord && (
          <>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <QRCode value={`Slip Code: ${selectedRecord.slipCode}`} />
            </div>
            <p>
              <strong>Mã phiếu mượn:</strong> {selectedRecord.slipCode}
            </p>
            <p>
              <strong>Tên người mượn:</strong> {selectedRecord.borrowerName}
            </p>
            <p>
              <strong>Ngày mượn:</strong> {selectedRecord.borrowDate}
            </p>
            <p>
              <strong>Ngày trả:</strong> {selectedRecord.returnDate}
            </p>
            <p>
              <strong>Tên tài khoản đã cho mượn:</strong> {selectedRecord.issuedBy}
            </p>
          </>
        )}
      </Modal>
    </BaseLayout>
  );
};

export default EquipmentHistoryPage;
