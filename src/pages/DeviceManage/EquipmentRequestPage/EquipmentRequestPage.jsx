import React, { useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Button, Table, Modal, Typography } from "antd";
import QRCode from "qrcode.react";

const { Title } = Typography;

const mockRequests = [
  { slipCode: "MS001", borrowerName: "Nguyen Van A", projectedReturnDate: "2024-07-30", isReturned: false },
  { slipCode: "MS002", borrowerName: "Le Thi B", projectedReturnDate: "2024-08-05", isReturned: true }
  // Add more mock data as needed
];

const EquipmentRequestPage = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const handleMarkAsReturned = (slipCode) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => (request.slipCode === slipCode ? { ...request, isReturned: true } : request))
    );
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setViewModalVisible(true);
  };

  const columns = [
    { title: "Mã phiếu mượn", dataIndex: "slipCode", key: "slipCode", width: "20%" },
    { title: "Tên người mượn", dataIndex: "borrowerName", key: "borrowerName", width: "20%" },
    { title: "Thời gian trả", dataIndex: "projectedReturnDate", key: "projectedReturnDate", width: "20%" },
    {
      title: "Trạng thái",
      dataIndex: "isReturned",
      key: "isReturned",
      width: "20%",
      render: (text, record) => (record.isReturned ? "Đã trả" : "Chưa trả")
    },
    {
      title: "Hành động",
      key: "action",
      width: "20%",
      render: (text, record) => (
        <div>
          {!record.isReturned && (
            <Button onClick={() => handleMarkAsReturned(record.slipCode)} type="primary">
              Đánh dấu đã trả
            </Button>
          )}
          <Button onClick={() => handleViewDetails(record)} style={{ marginLeft: 8 }}>
            Xem chi tiết
          </Button>
        </div>
      )
    }
  ];

  return (
    <BaseLayout>
      <Title level={1}>Danh sách đang mượn</Title>
      <Table columns={columns} dataSource={requests} rowKey="slipCode" />

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
        {selectedRequest && (
          <>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <QRCode value={`Slip Code: ${selectedRequest.slipCode}`} />
            </div>
            <p>
              <strong>Mã phiếu mượn:</strong> {selectedRequest.slipCode}
            </p>
            <p>
              <strong>Tên người mượn:</strong> {selectedRequest.borrowerName}
            </p>
            <p>
              <strong>Thời gian trả:</strong> {selectedRequest.projectedReturnDate}
            </p>
          </>
        )}
      </Modal>
    </BaseLayout>
  );
};

export default EquipmentRequestPage;
