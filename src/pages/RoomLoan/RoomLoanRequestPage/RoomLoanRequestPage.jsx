import React, { useState, useEffect } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Table, Button, Modal, Typography } from "antd";
import { CheckOutlined, EyeOutlined } from "@ant-design/icons";
import QRCode from "qrcode.react";
import { getRoomBookingList } from "../RoomApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
const { Title } = Typography;


const RoomLoanRequestPage = () => {

  const dispatch = useAppDispatch();
  const [selectedBorrowing, setSelectedBorrowing] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { roomBooking, isRoomBooking } = useAppSelector((state) => state.room);

  useEffect(() => {
    if (!isRoomBooking) {
      dispatch(getRoomBookingList());
    }
  }, [dispatch, isRoomBooking]);


  const roomBookingData = roomBooking.filter((item) => item.status !== "đã sử dụng").map((item) => {
    return {
      id: item.id,
      name: item.room.room_id,
      borrowTime: item.start_time + " - " + item.end_time,
      date_booking: item.date_booking,
      status: item.status
    };
  });

  const handleViewDetails = (record) => {
    setSelectedBorrowing(record);
    setIsModalVisible(true);
  };


  const columns = [
    { title: "Mã phiếu mượn", dataIndex: "id", key: "id", width: "16%" },
    { title: "Tên phòng", dataIndex: "name", key: "name", width: "16%" },
    { title: "Thời gian mượn", dataIndex: "borrowTime", key: "borrowTime", width: "16%" },
    { title: "Ngày mượn", dataIndex: "date_booking", key: "date_booking", width: "16%" },
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
      <Table columns={columns} dataSource={roomBookingData} rowKey="id" />

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
              <strong>Tên phòng:</strong> {selectedBorrowing.name}
            </p>
            <p>
              <strong>Thời gian mượn:</strong> {selectedBorrowing.borrowTime}
            </p>
            <p>
              <strong>Ngày mượn:</strong> {selectedBorrowing.date_booking}
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
