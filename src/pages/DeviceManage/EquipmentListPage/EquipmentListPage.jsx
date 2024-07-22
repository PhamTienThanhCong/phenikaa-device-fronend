import React from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Button, Input, Table } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

const EquipmentListPage = () => {
  const [searchText, setSearchText] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);

  const deviceColumns = [
    { title: "Mã thiết bị", dataIndex: "deviceCode", key: "deviceCode" },
    { title: "Tên thiết bị", dataIndex: "deviceName", key: "deviceName" },
    { title: "Tổng số lượng", dataIndex: "totalQuantity", key: "totalQuantity" },
    { title: "Đã cho mượn", dataIndex: "borrowed", key: "borrowed" },
    { title: "Sẵn sàng", dataIndex: "available", key: "available" },
    { title: "Đã đặt trước", dataIndex: "reserved", key: "reserved" }
  ];

  const dataDevice = [];

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <BaseLayout>
      <h1>Danh sách thiết bị</h1>
      <div style={{ marginBottom: 16, width: "100%", display: "flex", justifyContent: "space-between" }}>
        <Input
          placeholder="Tìm kiếm tên thiết bị"
          value={searchText}
          onChange={handleSearch}
          style={{ width: 200, marginRight: 8 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
          Tạo yêu cầu mượn
        </Button>
      </div>
      <Table columns={deviceColumns} dataSource={dataDevice} rowKey="key" />
    </BaseLayout>
  );
};

export default EquipmentListPage;
