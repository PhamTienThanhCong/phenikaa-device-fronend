import React from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Button, Input, Modal, Table } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import useDebounce from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getDeviceList } from "../DeviceApi";
import { v4 as uuidv4 } from "uuid";

const EquipmentListPage = () => {
  const dispatch = useAppDispatch();
  const { device, isDevice } = useAppSelector((state) => state.device);

  const [searchText, setSearchText] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);

  const searchTextDebounce = useDebounce(searchText, 300);

  const deviceColumns = [
    { title: "Mã thiết bị", dataIndex: "deviceCode", key: "deviceCode" },
    { title: "Thể loại", dataIndex: "deviceCategory", key: "deviceCategory" },
    { title: "Tên thiết bị", dataIndex: "deviceName", key: "deviceName" },
    { title: "Tổng số lượng", dataIndex: "totalQuantity", key: "totalQuantity" },
    { title: "Đã cho mượn", dataIndex: "borrowed", key: "borrowed" },
    { title: "Sẵn sàng", dataIndex: "available", key: "available" }
  ];

  const dataDevice = React.useMemo(() => {
    return device.map((item) => ({
      key: item.id || uuidv4(),
      deviceCode: item.id,
      deviceCategory: item.category,
      deviceName: item.name,
      totalQuantity: item.total,
      borrowed: item.total_used,
      available: item.total - item.total_used - item.total_maintenance
    }));
  }, [device]);

  React.useEffect(() => {
    if (!isDevice) {
      dispatch(getDeviceList());
    }
  }, [dispatch, isDevice]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <BaseLayout>
      <h1>Danh sách thiết bị</h1>
      <div style={{ marginBottom: 16, width: "100%", display: "flex", justifyContent: "space-between" }}>
        <Input
          placeholder="Tìm kiếm tên thiết bị"
          value={searchTextDebounce}
          onChange={handleSearch}
          style={{ width: 200, marginRight: 8 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
          Tạo yêu cầu mượn
        </Button>
      </div>
      <Table columns={deviceColumns} dataSource={dataDevice} rowKey="key" />

      {/* modal yêu cầu mượn */}
      <Modal
        title="Basic Modal"
        visible={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
      >
        <p>Some contents...</p>
      </Modal>
    </BaseLayout>
  );
};

export default EquipmentListPage;
