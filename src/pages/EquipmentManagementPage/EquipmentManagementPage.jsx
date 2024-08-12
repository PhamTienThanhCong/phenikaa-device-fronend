import React, { useEffect, useState } from "react";
import { Table, Button, Input, Space, Typography, Popconfirm, Modal, Form, Card, Row, Col, Select } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

import BaseLayout from "@/features/layout/BaseLayout";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  createDeviceCategory,
  updateDeviceCategory,
  getDeviceCategoryList,
  deleteDeviceCategory,
  getDeviceList,
  createDevice,
  updateDevice,
  deleteDevice
} from "./EquipmantManagementApi";

const { Title } = Typography;
const { Meta } = Card;

const EquipmentManagementPage = () => {
  const dispatch = useAppDispatch();
  const { deviceCategory, isDeviceCategory, deviceList, isDeviceList } = useAppSelector(
    (state) => state.deviceCategory
  );
  const [searchText, setSearchText] = useState("");
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);
  const [modalType, setModalType] = useState(null); // Modal type ('addType', 'editType', 'addDevice', 'editDevice')
  const [selectedData, setSelectedData] = useState(null); // Data for the selected item
  const [form] = Form.useForm(); // Form instance for modals

  useEffect(() => {
    if (!isDeviceCategory) {
      dispatch(getDeviceCategoryList());
    }
  }, [dispatch, isDeviceCategory]);

  useEffect(() => {
    if (!isDeviceList) {
      dispatch(getDeviceList());
    }
  }, [dispatch, isDeviceList]);

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
      const payload = {
        name: values.name,
        is_active: true,
        image: ""
      };
      await dispatch(createDeviceCategory(payload));
      await dispatch(getDeviceCategoryList());
      handleModalClose();
    } else if (modalType === "editType") {
      const payload = {
        name: values.name,
        is_active: true,
        image: ""
      };
      await dispatch(
        updateDeviceCategory({
          category_id: selectedData.id,
          ...payload
        })
      );
      handleModalClose();
      await dispatch(getDeviceCategoryList());
    } else if (modalType === "addDevice") {
      const payload = {
        name: values.name,
        category: selectedDeviceType.name,
        information: values.information,
        note: values.note,
        total: values.total,
        image: ""
      };
      await dispatch(createDevice(payload));
      await dispatch(getDeviceList());
    } else if (modalType === "editDevice") {
      const payload = {
        name: values.name,
        category: selectedDeviceType.name,
        information: values.information,
        note: values.note,
        total: values.total,
        image: "",
        total_used: values.total_used,
        total_maintenance: values.total_maintenance,
        is_active: values.is_active === 1 ? true : false
      };

      await dispatch(
        updateDevice({
          device_id: selectedData?.id,
          ...payload
        })
      );
      await dispatch(getDeviceList());
    }
    handleModalClose();
  };

  const handleDelete = async (key) => {
    await dispatch(deleteDeviceCategory({ category_id: key }));
    await dispatch(getDeviceCategoryList());
  };
  const handleDeleleDevice = async (key) => {
    await dispatch(deleteDevice({ device_id: key }));
    await dispatch(getDeviceList());
  };

  const deviceColumns = [
    { title: "Mã thiết bị", dataIndex: "id", key: "id" },
    { title: "Tên thiết bị", dataIndex: "name", key: "name" },
    { title: "Thông tin", dataIndex: "information", key: "information" },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
    { title: "Tổng số lượng", dataIndex: "total", key: "total" },
    { title: "Đã sử dụng", dataIndex: "total_used", key: "total_used" },
    { title: "Bảo trì", dataIndex: "total_maintenance", key: "total_maintenance" },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space
          style={{
            display: "flex"
          }}
        >
          <p
            type="text"
            onClick={() => handleModalOpen("editDevice", record)}
            style={{
              color: "green",
              cursor: "pointer",
              padding: "0 8px"
            }}
          >
            {<EditOutlined />}
          </p>
          <Popconfirm title="Bạn có chắc chắn muốn xóa thiết bị?" onConfirm={() => handleDeleleDevice(record.id)}>
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
              <Button
                type="primary"
                style={{ color: "white", background: "#F26526" }}
                icon={<PlusOutlined />}
                onClick={() => handleModalOpen("addDevice")}
              >
                Thêm thiết bị
              </Button>
            </div>
            <Table
              columns={deviceColumns}
              dataSource={deviceList.filter((device) => device.category === selectedDeviceType.name)}
              rowKey="id"
            />
          </>
        ) : (
          <>
            <div style={{ marginBottom: 16, width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                style={{ color: "white", background: "#F26526" }}
                icon={<PlusOutlined />}
                onClick={() => handleModalOpen("addType")}
              >
                Thêm loại thiết bị
              </Button>
            </div>
            <Row gutter={[16, 16]}>
              {deviceCategory.map((type, index) => (
                <Col key={index} span={8}>
                  <Card hoverable>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <Meta
                        title={type.name}
                        description={`Tổng số thiết bị: ${type.total_devices}`}
                        onClick={() => handleCardClick(type)}
                        style={{
                          width: "90%"
                        }}
                      />
                      <Space>
                        <p
                          type="text"
                          onClick={() => handleModalOpen("editType", type)}
                          style={{
                            color: "green",
                            cursor: "pointer"
                          }}
                        >
                          {<EditOutlined />}
                        </p>
                        <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(type.id)}>
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
                  : modalType === "editDevice"
                    ? "Sửa thiết bị"
                    : "12312"
          }
          open={modalType !== null}
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
              </>
            ) : (
              <>
                <Form.Item
                  name="name"
                  label="Tên thiết bị"
                  rules={[{ required: true, message: "Tên thiết bị không thể để trống!" }]}
                >
                  <Input placeholder="Nhập tên thiết bị" />
                </Form.Item>
                <Form.Item name="category" label="Loại thiết bị">
                  <Input value={selectedDeviceType?.name} disabled placeholder={selectedDeviceType?.name} />
                </Form.Item>
                <Form.Item
                  name="total"
                  label="Số lượng"
                  rules={[{ required: true, message: "Số lượng không thể để trống!" }]}
                >
                  <Input placeholder="Nhập số lượng" />
                </Form.Item>
                <Form.Item
                  name="information"
                  label="Thông tin"
                  rules={[{ required: true, message: "Thông tin không thể để trống!" }]}
                >
                  <Input placeholder="Nhập thông tin" />
                </Form.Item>
                <Form.Item
                  name="note"
                  label="Ghi chú"
                  rules={[{ required: true, message: "Ghi chú không thể để trống!" }]}
                >
                  <Input placeholder="Nhập ghi chú" />
                </Form.Item>
                {/* Nếu mà là edit thì thêm 3 trường nữa */}
                {modalType === "editDevice" && (
                  <>
                    <Form.Item name="total_used" label="Đã sử dụng">
                      <Input placeholder={selectedDeviceType} disabled />
                    </Form.Item>
                    <Form.Item name="total_maintenance" label="Bảo trì">
                      <Input placeholder={selectedDeviceType} disabled />
                    </Form.Item>
                    <Form.Item
                      name="is_active"
                      label="Trạng thái"
                      rules={[{ required: true, message: "Trạng thái không thể để trống!" }]}
                    >
                      <Select placeholder="Chọn trạng thái">
                        <Select.Option value={1}>Hoạt động</Select.Option>
                        <Select.Option value={0}>Ngừng hoạt động</Select.Option>
                      </Select>
                    </Form.Item>
                  </>
                )}
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
