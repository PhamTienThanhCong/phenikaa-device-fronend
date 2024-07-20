import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Popconfirm,
  Modal,
  Form,
  Input as AntInput,
  Typography as AntTypography
} from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import BaseLayout from "@/features/layout/BaseLayout";

const { Title } = Typography;
const { Text } = AntTypography;

// Initial data source
const initialDataSource = [
  {
    key: "1",
    index: "1",
    deviceCode: "PNK83201",
    deviceName: (
      <>
        Camera quan sát IP 4K
        <img src="https://openui.fly.dev/openui/24x24.svg?text=⚠️" alt="warning-icon" style={{ marginLeft: "8px" }} />
      </>
    ),
    manufacturer: "Acme Security",
    powerSource: "210V, 60% hiệu suất",
    status: "Bảo trì",
    maintenanceTime: "2 ngày",
    maintenanceUnit: "Trường Đại học Phenikaa",
    actions: (
      <Space>
        <Button icon={<EyeOutlined />} type="text" />
        <Button icon={<EditOutlined />} type="text" />
        <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => console.log("Delete confirmed")}>
          <Button icon={<DeleteOutlined />} type="text" />
        </Popconfirm>
      </Space>
    )
  },
  {
    key: "2",
    index: "2",
    deviceCode: "PNK83202",
    deviceName: "Camera quan sát IP 4K",
    manufacturer: "Acme Security",
    powerSource: "210V, 60% hiệu suất",
    status: "Bảo trì",
    maintenanceTime: "2 ngày",
    maintenanceUnit: "Trường Đại học Phenikaa",
    actions: (
      <Space>
        <Button icon={<EyeOutlined />} type="text" />
        <Button icon={<EditOutlined />} type="text" />
        <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => console.log("Delete confirmed")}>
          <Button icon={<DeleteOutlined />} type="text" />
        </Popconfirm>
      </Space>
    )
  }
];

const MaintenanceSchedulePage = () => {
  const [searchText, setSearchText] = useState(""); // Search text
  const [modalType, setModalType] = useState(null); // To manage which modal is open
  const [selectedData, setSelectedData] = useState(null); // Data for the selected device
  const [form] = Form.useForm(); // Form instance for modals

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = initialDataSource.filter((data) =>
    Object.values(data).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    { title: "STT", dataIndex: "index", key: "index" },
    { title: "Mã thiết bị", dataIndex: "deviceCode", key: "deviceCode" },
    { title: "Tên thiết bị", dataIndex: "deviceName", key: "deviceName" },
    { title: "Hãng sản xuất", dataIndex: "manufacturer", key: "manufacturer" },
    { title: "Nguồn điện", dataIndex: "powerSource", key: "powerSource" },
    { title: "Trạng thái thiết bị", dataIndex: "status", key: "status" },
    { title: "Thời gian bảo trì", dataIndex: "maintenanceTime", key: "maintenanceTime" },
    { title: "Đơn vị bảo trì", dataIndex: "maintenanceUnit", key: "maintenanceUnit" },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} type="text" onClick={() => handleModalOpen("view", record)} />
          <Button icon={<EditOutlined />} type="text" onClick={() => handleModalOpen("edit", record)} />
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.key)}>
            <Button icon={<DeleteOutlined />} type="text" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleModalOpen = (type, data) => {
    setModalType(type);
    setSelectedData(data);
    form.setFieldsValue(data || {}); // Set form values if data is provided
    // Open the modal
  };

  const handleModalClose = () => {
    setModalType(null);
    setSelectedData(null);
  };

  const handleFormSubmit = (values) => {
    if (modalType === "add") {
      // Add logic to add a new device
      console.log("Adding device", values);
    } else if (modalType === "edit") {
      // Add logic to edit the existing device
      console.log("Editing device", values);
    }
    handleModalClose();
  };

  const handleDelete = (key) => {
    // Add logic to delete the device
    console.log("Deleting device with key", key);
  };

  return (
    <BaseLayout>
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <Title level={2}>Danh sách thiết bị</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleModalOpen("add")}>
            Thêm
          </Button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ position: "relative" }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm"
              style={{ width: "256px" }}
              value={searchText}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={true}
          bordered
          rowClassName="hover:bg-muted"
          style={{ marginBottom: "16px" }}
        />

        {/* View Modal */}
        <Modal
          title="Xem thiết bị"
          visible={modalType === "view"}
          onCancel={handleModalClose}
          footer={[
            <Button key="close" onClick={handleModalClose}>
              Đóng
            </Button>
          ]}
          style={{ top: 20 }}
        >
          {selectedData && (
            <div>
              <p>
                <strong>Mã thiết bị:</strong> {selectedData.deviceCode}
              </p>
              <p>
                <strong>Tên thiết bị:</strong> {selectedData.deviceName}
              </p>
              <p>
                <strong>Hãng sản xuất:</strong> {selectedData.manufacturer}
              </p>
              <p>
                <strong>Nguồn điện:</strong> {selectedData.powerSource}
              </p>
              <p>
                <strong>Trạng thái thiết bị:</strong> {selectedData.status}
              </p>
              <p>
                <strong>Thời gian bảo trì:</strong> {selectedData.maintenanceTime}
              </p>
              <p>
                <strong>Đơn vị bảo trì:</strong> {selectedData.maintenanceUnit}
              </p>
            </div>
          )}
        </Modal>

        {/* Edit/Add Modal */}
        <Modal
          title={modalType === "edit" ? "Sửa thiết bị" : "Thêm thiết bị"}
          visible={modalType === "edit" || modalType === "add"}
          onCancel={handleModalClose}
          footer={[
            <Button key="cancel" onClick={handleModalClose}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" htmlType="submit" form="deviceForm">
              {modalType === "edit" ? "Lưu" : "Thêm"}
            </Button>
          ]}
          style={{ top: 20 }}
        >
          <Form form={form} onFinish={handleFormSubmit} layout="vertical" id="deviceForm">
            <Form.Item
              name="deviceCode"
              label="Mã thiết bị"
              rules={[{ required: true, message: "Mã thiết bị không thể để trống!" }]}
            >
              <AntInput />
            </Form.Item>
            <Form.Item
              name="deviceName"
              label="Tên thiết bị"
              rules={[{ required: true, message: "Tên thiết bị không thể để trống!" }]}
            >
              <AntInput />
            </Form.Item>
            <Form.Item
              name="manufacturer"
              label="Hãng sản xuất"
              rules={[{ required: true, message: "Hãng sản xuất không thể để trống!" }]}
            >
              <AntInput />
            </Form.Item>
            <Form.Item
              name="powerSource"
              label="Nguồn điện"
              rules={[{ required: true, message: "Nguồn điện không thể để trống!" }]}
            >
              <AntInput />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái thiết bị"
              rules={[{ required: true, message: "Trạng thái thiết bị không thể để trống!" }]}
            >
              <AntInput />
            </Form.Item>
            <Form.Item
              name="maintenanceTime"
              label="Thời gian bảo trì"
              rules={[{ required: true, message: "Thời gian bảo trì không thể để trống!" }]}
            >
              <AntInput />
            </Form.Item>
            <Form.Item
              name="maintenanceUnit"
              label="Đơn vị bảo trì"
              rules={[{ required: true, message: "Đơn vị bảo trì không thể để trống!" }]}
            >
              <AntInput />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </BaseLayout>
  );
};

export default MaintenanceSchedulePage;
