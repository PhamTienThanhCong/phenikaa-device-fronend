import React, { useEffect, useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Button, Table, Modal, Typography } from "antd";
import QRCode from "qrcode.react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getBookingDeviceList } from "../DeviceApi";
import { getDeviceList, returnDevice } from "../DeviceApi";
import { use } from "echarts";
import { clearError } from "../DeviceSlice";
import { notification } from "antd";

const { Title } = Typography;

const mockRequests = [
  { slipCode: "MS001", borrowerName: "Nguyen Van A", projectedReturnDate: "2024-07-30", isReturned: false },
  { slipCode: "MS002", borrowerName: "Le Thi B", projectedReturnDate: "2024-08-05", isReturned: true }
  // Add more mock data as needed
];

const EquipmentRequestPage = () => {

  const dispatch = useAppDispatch();
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const { deviceBooking, isDeviceBooking } = useAppSelector((state) => state.device);
  const { isDevice, device } = useAppSelector((state) => state.device);
  const error = useAppSelector((state) => state.device.error);
  const [api, contextHolder] = notification.useNotification();
  const handleMarkAsReturned = (slipCode) => {
    dispatch(returnDevice({ id: slipCode }));
  };
  const refreshData = () => {
    dispatch(getBookingDeviceList());
  };
  const notificationMessage = (type, message) => {
    api[type]({
      message: type == "error" ? "Lỗi" : "Thông báo",
      description: message
    })
  }
  useEffect(() => {
    if (!isDeviceBooking) {
      dispatch(getBookingDeviceList());
      refreshData()
    }
  }, [dispatch, isDeviceBooking]);
  useEffect(() => {
    if (!isDevice) {
      dispatch(getDeviceList());
    }
  }, [dispatch, isDevice]);
  useEffect(() => {
    if (error) {
      notificationMessage('error', error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const getDeviceInfo = (deviceId) => {
    const deviceInfo = device.find((item) => item.id === deviceId);
    return deviceInfo ? {
      id: deviceInfo.id,
      name: deviceInfo.name,
    } : {
      id: deviceId,
      name: "Unknown",
    };
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  const listDeviceBooking = deviceBooking.filter((item) => item.status !== "returned").map((item) => {
    return {
      slipCode: item.id,
      borrowerName: item.customer.full_name,
      borrowDate: formatDate(item.created_at),
      returnDate: formatDate(item.returning_date),
      issuedBy: item.user ? item.user.full_name : "QTV",
      deviceList: item.devices.map((device) => ({
        id: device.device_id,
        name: getDeviceInfo(device.device_id).name,
        quantity: device.quantity
      }))
    };
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setViewModalVisible(true);
  };

  const columns = [
    { title: "Mã phiếu mượn", dataIndex: "slipCode", key: "slipCode", width: "20%" },
    { title: "Tên người mượn", dataIndex: "borrowerName", key: "borrowerName", width: "20%" },
    { title: "Thời gian trả", dataIndex: "returnDate", key: "projectedReturnDate", width: "20%" },
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
      <Table columns={columns} dataSource={listDeviceBooking} rowKey="slipCode" />

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
              <strong>Thời gian trả:</strong> {selectedRequest.returnDate}
            </p>
            <Table dataSource={selectedRequest.deviceList} rowKey="id" >
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

export default EquipmentRequestPage;
