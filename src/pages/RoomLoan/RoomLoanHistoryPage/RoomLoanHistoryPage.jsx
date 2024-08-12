import React, { useEffect, useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Table, Typography } from "antd";
import { getRoomBookingList } from "../RoomApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

const { Title } = Typography;

const RoomLoanHistoryPage = () => {
  const dispatch = useAppDispatch();
  const { roomBooking, isRoomBooking } = useAppSelector((state) => state.room);

  useEffect(() => {
    if (!isRoomBooking) {
      dispatch(getRoomBookingList());
    }
  }, [dispatch, isRoomBooking]);

  const roomBookingData = roomBooking
    .filter((item) => item.status === "đã sử dụng")
    .map((item) => {
      return {
        id: item.id,
        roomName: item.room.room_id,
        borrowTime: item.start_time + "  " + item.date_booking,
        returnTime: item.end_time,
        lender: item.user.full_name,
        status: item.status
      };
    });

  const columns = [
    { title: "Mã phiếu", dataIndex: "id", key: "id" },
    { title: "Tên phòng", dataIndex: "roomName", key: "roomName" },
    { title: "Thời gian mượn", dataIndex: "borrowTime", key: "borrowTime" },
    { title: "Thời gian trả", dataIndex: "returnTime", key: "returnTime" },
    { title: "Người cho mượn", dataIndex: "lender", key: "lender" },
    { title: "Trạng thái", dataIndex: "status", key: "status" }
  ];

  return (
    <BaseLayout>
      <Title level={1}>Tra cứu lịch sử mượn</Title>
      <Table columns={columns} dataSource={roomBookingData} rowKey="id" />
    </BaseLayout>
  );
};

export default RoomLoanHistoryPage;
