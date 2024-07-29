import React, { useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Table, Button, Modal, Typography } from "antd";
import { CheckOutlined, EyeOutlined } from "@ant-design/icons";
import QRCode from "qrcode.react";

const { Title } = Typography;

const mockBorrowingData = [
  {
    id: "P001",
    roomName: "Phòng A",
    borrowTime: "09:00 - 11:00",
    borrowDate: "2024-07-20",
    status: "Chưa trả"
  },
  {
    id: "P002",
    roomName: "Phòng B",
    borrowTime: "13:00 - 15:00",
    borrowDate: "2024-07-21",
    status: "Đã trả"
  }
  // Add more mock data as needed
];

const RoomLoanRequestPage = () => {
  const [borrowingList, setBorrowingList] = useState(mockBorrowingData);
  const [selectedBorrowing, setSelectedBorrowing] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleMarkAsReturned = (id) => {
    setBorrowingList((prevList) => prevList.map((item) => (item.id === id ? { ...item, status: "Đã trả" } : item)));
  };

  const handleViewDetails = (record) => {
    setSelectedBorrowing(record);
    setIsModalVisible(true);
  };

  const columns = [
    { title: "Mã phiếu mượn", dataIndex: "id", key: "id", width: "16%" },
    { title: "Tên phòng", dataIndex: "roomName", key: "roomName", width: "16%" },
    { title: "Thời gian mượn", dataIndex: "borrowTime", key: "borrowTime", width: "16%" },
    { title: "Ngày mượn", dataIndex: "borrowDate", key: "borrowDate", width: "16%" },
    { title: "Trạng thái", dataIndex: "status", key: "status", width: "16%" },
    {
      title: "Hành động",
      key: "action",
      width: "16%",
      render: (text, record) => (
        <div>
          {record.status === "Chưa trả" && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleMarkAsReturned(record.id)}
              style={{ marginRight: 8 }}
            >
              Đánh dấu đã trả
            </Button>
          )}
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            Xem chi tiết
          </Button>
        </div>
      )
    }
  ];

  return (
    <BaseLayout>
      <Title level={1}>Danh sách phòng đang mượn</Title>
      <Table columns={columns} dataSource={borrowingList} rowKey="id" />

      <Modal
        title="Chi tiết phiếu mượn"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedBorrowing && (
          <>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <QRCode value={selectedBorrowing.id} size={150} />
            </div>

            <p>
              <strong>Mã phiếu mượn:</strong> {selectedBorrowing.id}
            </p>
            <p>
              <strong>Tên phòng:</strong> {selectedBorrowing.roomName}
            </p>
            <p>
              <strong>Thời gian mượn:</strong> {selectedBorrowing.borrowTime}
            </p>
            <p>
              <strong>Ngày mượn:</strong> {selectedBorrowing.borrowDate}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedBorrowing.status}
            </p>
          </>
        )}
      </Modal>
    </BaseLayout>
  );
};

export default RoomLoanRequestPage;
