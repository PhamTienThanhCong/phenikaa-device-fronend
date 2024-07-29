import React, { useState } from "react";
import { Table, Button, Input, Space, Typography, Popconfirm, Modal, Form, Upload, Card, Row, Col } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  EyeOutlined
} from "@ant-design/icons";
// import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

import BaseLayout from "@/features/layout/BaseLayout";
import typeImage from "@/assets/images/logo.png"; // Thay thế bằng đường dẫn hình ảnh của bạn
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getDeviceList } from "./DeviceApi";
import { createDeviceCategory } from "./DeviceApi";

const { Title } = Typography;
const { Meta } = Card;

// Dữ liệu nguồn ban đầu
const initialDeviceTypes = [
  {
    key: "1",
    deviceType: "Laptop",
    totalDevices: 10,
    devices: [
      {
        key: "1",
        deviceCode: "LAP001",
        deviceName: "MacBook Pro",
        totalQuantity: 10,
        borrowed: 4,
        available: 5,
        reserved: 1
      },
      {
        key: "2",
        deviceCode: "LAP002",
        deviceName: "Dell XPS 13",
        totalQuantity: 5,
        borrowed: 2,
        available: 2,
        reserved: 1
      }
    ],
    icon: typeImage // Hình ảnh cho loại thiết bị
  },
  {
    key: "2",
    deviceType: "Camera",
    totalDevices: 8,
    devices: [
      {
        key: "3",
        deviceCode: "CAM001",
        deviceName: "Sony A7 III",
        totalQuantity: 8,
        borrowed: 3,
        available: 4,
        reserved: 1
      }
    ],
    icon: typeImage // Hình ảnh cho loại thiết bị
  },
  {
    key: "3",
    deviceType: "Mobile",
    totalDevices: 15,
    devices: [
      {
        key: "4",
        deviceCode: "MOB001",
        deviceName: "iPhone 12",
        totalQuantity: 15,
        borrowed: 6,
        available: 8,
        reserved: 1
      }
    ],
    icon: typeImage // Hình ảnh cho loại thiết bị
  },
  {
    key: "4",
    deviceType: "Printer",
    totalDevices: 5,
    devices: [
      {
        key: "5",
        deviceCode: "PRI001",
        deviceName: "HP LaserJet",
        totalQuantity: 5,
        borrowed: 1,
        available: 3,
        reserved: 1
      }
    ],
    icon: typeImage // Hình ảnh cho loại thiết bị
  }
];

const EquipmentManagementPage = () => {
  const dispatch = useAppDispatch();
  const { device, isDevice } = useAppSelector((state) => state.device);
  const [deviceTypes, setDeviceTypes] = useState(initialDeviceTypes);
  const [searchText, setSearchText] = useState("");
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);
  const [modalType, setModalType] = useState(null); // Modal type ('addType', 'editType', 'addDevice', 'editDevice')
  const [selectedData, setSelectedData] = useState(null); // Data for the selected item
  const [form] = Form.useForm(); // Form instance for modals

  // Hàm lọc danh sách thiết bị dựa trên văn bản tìm kiếm
  // const filteredDevices = (devices) => {
  //   return devices.filter((device) => device.deviceName.toLowerCase().includes(searchText.toLowerCase()));
  // };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleCardClick = (deviceType) => {
    setSelectedDeviceType(deviceType);
  };

  const handleModalOpen = (type, data) => {
    setModalType(type);
    setSelectedData(data);
    form.setFieldsValue(data || {}); // Set form values if data is provided
  };

  const handleModalClose = () => {
    setModalType(null);
    setSelectedData(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    if (modalType === "addType") {
      // Add logic to add a new device type
      await dispatch(createDeviceCategory(values));
      handleModalClose();

      console.log("Adding device type", values);
    } else if (modalType === "editType") {
      // Add logic to edit the existing device type
      console.log("Editing device type", values);
    } else if (modalType === "addDevice") {
      // Add logic to add a new device
      console.log("Adding device", values);
    } else if (modalType === "editDevice") {
      // Add logic to edit the existing device
      console.log("Editing device", values);
    }
    handleModalClose();
  };

  const handleDelete = (key) => {
    // Add logic to delete the device or device type
    console.log("Deleting item with key", key);
  };
  React.useEffect(() => {
    if (!isDevice) {
      dispatch(getDeviceList());
    }
  }, [dispatch, isDevice]);
  console.log(device);
  // map dữ liệu từ device
  const deviceData = device.map((item) => {
    return {
      key: item.id,
      name: item.name,
      total_device: item.total_devices,
      image: item.image,
      is_active: item.is_active,
      presigned_url: item.presigned_url
    };
  });
  console.log(222222, deviceData);

  const deviceColumns = [
    { title: "Mã thiết bị", dataIndex: "deviceCode", key: "deviceCode" },
    { title: "Tên thiết bị", dataIndex: "deviceName", key: "deviceName" },
    { title: "Tổng số lượng", dataIndex: "totalQuantity", key: "totalQuantity" },
    { title: "Đã cho mượn", dataIndex: "borrowed", key: "borrowed" },
    { title: "Sẵn sàng", dataIndex: "available", key: "available" },
    { title: "Đã đặt trước", dataIndex: "reserved", key: "reserved" },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space
          style={{
            display: "flex",
            justifyContent: "space-around"
          }}
        >
          <p
            type="text"
            onClick={() => handleModalOpen("view", record)}
            style={{
              color: "blue",
              cursor: "pointer"
            }}
          >
            {<EyeOutlined />}{" "}
          </p>
          <p
            type="text"
            onClick={() => handleModalOpen("edit", record)}
            style={{
              color: "green",
              cursor: "pointer"
            }}
          >
            {<EditOutlined />}
          </p>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.key)}>
            <p
              type="text"
              style={{
                color: "red",
                cursor: "pointer"
              }}
            >
              {<DeleteOutlined />}
            </p>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <BaseLayout>
      <div style={{ padding: "16px" }}>
        <Title level={2}>Quản lý danh sách thiết bị</Title>
        {selectedDeviceType ? (
          <>
            <Button onClick={() => setSelectedDeviceType(null)} style={{ marginBottom: 16 }}>
              Quay lại
            </Button>
            <div style={{ marginBottom: 16, width: "100%", display: "flex", justifyContent: "space-between" }}>
              <Input
                placeholder="Tìm kiếm tên thiết bị"
                value={searchText}
                onChange={handleSearch}
                style={{ width: 200, marginRight: 8 }}
                prefix={<SearchOutlined />}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleModalOpen("addDevice")}>
                Thêm thiết bị
              </Button>
            </div>
            {/* <Table columns={deviceColumns} dataSource={filteredDevices(selectedDeviceType.devices)} rowKey="key" /> */}
          </>
        ) : (
          <>
            <div style={{ marginBottom: 16, width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleModalOpen("addType")}>
                Thêm loại thiết bị
              </Button>
            </div>
            <Row gutter={[16, 16]}>
              {deviceData.map((type) => (
                <Col key={type.key} span={8}>
                  <Card hoverable onClick={() => handleCardClick(type)}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <Meta title={type.name} description={`Tổng số thiết bị: ${type.total_device}`} />
                      <img alt="icon" src={type.image ?? ""} style={{ height: 70, objectFit: "cover" }} />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        <Modal
          title={
            modalType === "addType"
              ? "Thêm loại thiết bị"
              : modalType === "editType"
                ? "Sửa loại thiết bị"
                : modalType === "addDevice"
                  ? "Thêm thiết bị"
                  : "Sửa thiết bị"
          }
          visible={modalType !== null}
          onCancel={handleModalClose}
          footer={null}
        >
          <Form form={form} onFinish={handleFormSubmit} layout="vertical">
            {modalType === "addType" || modalType === "editType" ? (
              <>
                <Form.Item
                  name="name"
                  label="Tên loại thiết bị"
                  rules={[{ required: true, message: "Tên loại thiết bị không thể để trống!" }]}
                >
                  <Input placeholder="Nhập tên loại thiết bị" />
                </Form.Item>
                <Form.Item name="icon" label="Hình ảnh loại thiết bị">
                  <Upload
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={() => false} // Không thực hiện upload ngay lập tức
                  >
                    <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                  </Upload>
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="deviceCode"
                  label="Mã thiết bị"
                  rules={[{ required: true, message: "Mã thiết bị không thể để trống!" }]}
                >
                  <Input placeholder="Nhập mã thiết bị" />
                </Form.Item>
                <Form.Item
                  name="deviceName"
                  label="Tên thiết bị"
                  rules={[{ required: true, message: "Tên thiết bị không thể để trống!" }]}
                >
                  <Input placeholder="Nhập tên thiết bị" />
                </Form.Item>
                <Form.Item
                  name="totalQuantity"
                  label="Tổng số lượng"
                  rules={[{ required: true, message: "Tổng số lượng không thể để trống!" }]}
                >
                  <Input placeholder="Nhập tổng số lượng" />
                </Form.Item>
                <Form.Item name="image" label="Ảnh thiết bị">
                  <Upload>
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>
                </Form.Item>
              </>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </BaseLayout>
  );
};

export default EquipmentManagementPage;
