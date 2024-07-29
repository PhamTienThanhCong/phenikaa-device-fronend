import React, { useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Table, Typography } from "antd";

const { Title } = Typography;

const mockLoanHistoryData = [
  {
    id: "P001",
    roomName: "Phòng A",
    borrowTime: "09:00 - 11:00",
    returnTime: "11:00",
    lender: "Nguyễn Văn A",
    status: "Đã trả"
  },
  {
    id: "P002",
    roomName: "Phòng B",
    borrowTime: "13:00 - 15:00",
    returnTime: "15:00",
    lender: "Trần Thị B",
    status: "Đã trả"
  },
  {
    id: "P003",
    roomName: "Phòng C",
    borrowTime: "10:00 - 12:00",
    returnTime: "Chưa trả",
    lender: "Lê Văn C",
    status: "Chưa trả"
  }
  // Add more mock data as needed
];

const RoomLoanHistoryPage = () => {
  const [loanHistory, setLoanHistory] = useState(mockLoanHistoryData);

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
      <Table columns={columns} dataSource={loanHistory} rowKey="id" />
    </BaseLayout>
  );
};

export default RoomLoanHistoryPage;
