import React, { useEffect, useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Button, Table, Modal, Input, Typography } from "antd";
import QRCode from "qrcode.react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getBookingDeviceList } from "../DeviceApi";

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
  const dispatch = useAppDispatch();
  const [history, setHistory] = useState(mockHistory);
  const [searchText, setSearchText] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const { deviceBooking, isDeviceBooking } = useAppSelector((state) => state.device);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (!isDeviceBooking) {
      dispatch(getBookingDeviceList());
    }
  }, [dispatch, isDeviceBooking]);

  console.log(deviceBooking);
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const listDeviceBooking = deviceBooking
    .filter((item) => item.status === "returned")
    .map((item) => {
      return {
        slipCode: item.id,
        borrowerName: item.customer.full_name,
        borrowDate: formatDate(item.created_at),
        returnDate: formatDate(item.returning_date),
        issuedBy: item.user ? item.user.full_name : "QTV",
        devices: item.devices.map((device) => ({
          id: device.device_id,
          name: device.device.name,
          quantity: device.quantity
        }))
      };
    });
  const filteredHistory = listDeviceBooking.filter((record) => record.slipCode.toString().includes(searchText));

  const handleViewDetails = (record) => {
    console.log(11111111111111, record);
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
              <QRCode value={`https://phenikaa-uni.top/device-loan/${selectedRecord.slipCode}`} />
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
            <Table dataSource={selectedRecord.devices} rowKey="id">
              <Table.Column title="Mã thiết bị" dataIndex="id" key="id" />
              <Table.Column title="Tên thiết bị" dataIndex="name" key="name" />
              <Table.Column title="Số lượng" dataIndex="quantity" key="quantity" />
            </Table>
          </>
        )}
      </Modal>
    </BaseLayout>
  );
};

export default EquipmentHistoryPage;
