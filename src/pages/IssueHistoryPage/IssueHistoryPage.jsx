import React, { useState, useEffect } from "react";
import { Table, Button, Space, Typography, Modal, Input as AntInput, Form, Input } from "antd";
import { EyeOutlined, SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import BaseLayout from "@/features/layout/BaseLayout";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getAllMaintaince } from "./maintainceAPI";
import { createMaintaince, updateMaintaince, deleteMaintaince } from "./maintainceAPI";

const { Title } = Typography;

const IssueHistoryPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // Modal type ('view', 'add', 'edit')
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { maintenanceList, isGetAll } = useAppSelector((state) => state.maintenance);

  useEffect(() => {
    if (!isGetAll) {
      dispatch(getAllMaintaince());
    }
  }, [dispatch, isGetAll]);
  const dataMaintenanceList = maintenanceList.map((item, index) => {
    return {
      key: index + 1,
      id: item.id,
      name: item.name,
      guardian: item.guardian,
      description: item.description,
      address: item.address,
      phone: item.phone,
      email: item.email
    };
  });
  const [filteredData, setFilteredData] = useState(dataMaintenanceList);
  const [data, setData] = useState(dataMaintenanceList);
  useEffect(() => {
    // Thay thế bằng logic lấy dữ liệu từ API nếu cần
    setData(dataMaintenanceList);
    setFilteredData(dataMaintenanceList);
  }, [dataMaintenanceList]);

  useEffect(() => {
    const lowercasedFilter = searchText.toLowerCase();
    setFilteredData(
      data.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercasedFilter) ||
          item.guardian.toLowerCase().includes(lowercasedFilter) ||
          item.address.toLowerCase().includes(lowercasedFilter) ||
          item.phone.toLowerCase().includes(lowercasedFilter) ||
          item.email.toLowerCase().includes(lowercasedFilter)
      )
    );
  }, [searchText, data]);

  const handleModalOpen = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
    if (type === "add") {
      form.resetFields();
    } else if (type === "edit" && item) {
      form.setFieldsValue(item);
    }
  };

  const handleModalClose = () => {
    setModalType(null);
    setSelectedItem(null);
  };

  const handleAddUnit = async (values) => {
    const payload = {
      guardian: values.guardian,
      name: values.name,
      description: values.description,
      address: values.address,
      phone: values.phone,
      email: values.email,
      status: true,
      map_url: ""
    };
    await dispatch(createMaintaince(payload));
    dispatch(getAllMaintaince());

    setData([...data, { key: data.length + 1, ...values }]);
    handleModalClose();
    // nếu status lỗi trả về khác 200 thì thông báo lỗi
  };

  const handleEditUnit = async (values) => {
    // viết logic update dữ liệu ở đây
    const payload = {
      guardian: values.guardian,
      name: values.name,
      description: values.description,
      address: values.address,
      phone: values.phone,
      email: values.email,
      status: true,
      map_url: ""
    };
    await dispatch(
      updateMaintaince({
        service_id: selectedItem.id,
        ...payload
      })
    );

    const updatedData = data.map((item) => (item.key === selectedItem.key ? { ...item, ...values } : item));
    setData(updatedData);
    handleModalClose();
    dispatch(getAllMaintaince());
  };

  const handleDelete = async (record) => {
    // Confirm the delete action

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa đơn vị bảo trì ${record.name}?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await dispatch(
            deleteMaintaince({
              service_id: record.id
            })
          );
          setData(data.filter((item) => item.key !== record.key));
          //  gọi lại api để lấy dữ liệu mới
          dispatch(getAllMaintaince());
        } catch (error) {
          console.error("Failed to delete:", error);
        }
      }
    });
  };

  const columns = [
    { title: "STT", dataIndex: "key", key: "key" },
    { title: "Tên công ty", dataIndex: "name", key: "name" },
    { title: "Người phụ trách", dataIndex: "guardian", key: "guardian" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space style={{ width: "50%", display: "flex", justifyContent: "center" }}>
          <p type="text" onClick={() => handleModalOpen("view", record)} style={{ color: "blue", cursor: "pointer" }}>
            {<EyeOutlined />}{" "}
          </p>
          <p type="text" onClick={() => handleModalOpen("edit", record)} style={{ color: "green", cursor: "pointer" }}>
            {<EditOutlined />}{" "}
          </p>
          <p type="text" onClick={() => handleDelete(record)} style={{ color: "red", cursor: "pointer" }}>
            {<DeleteOutlined />}{" "}
          </p>
        </Space>
      )
    }
  ];

  return (
    <BaseLayout>
      <div style={{ padding: "16px" }}>
        <Title level={2}>Đơn vị bảo trì</Title>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <Input
            placeholder="Tìm kiếm theo tên công ty, người phụ trách, địa chỉ, số điện thoại, email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleModalOpen("add")}>
            Thêm Đơn Vị Bảo Trì
          </Button>
        </div>
        <Table columns={columns} dataSource={filteredData} rowKey="key" />

        <Modal
          title={modalType === "add" ? "Thêm Đơn Vị Bảo Trì" : modalType === "edit" ? "Sửa Đơn Vị Bảo Trì" : "Chi tiết"}
          visible={modalType !== null}
          onCancel={handleModalClose}
          footer={null}
        >
          {modalType === "add" || modalType === "edit" ? (
            <Form form={form} onFinish={modalType === "add" ? handleAddUnit : handleEditUnit} layout="vertical">
              <Form.Item
                name="name"
                label="Tên công ty"
                rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}
              >
                <AntInput />
              </Form.Item>
              <Form.Item
                name="guardian"
                label="Người phụ trách"
                rules={[{ required: true, message: "Vui lòng nhập người phụ trách" }]}
              >
                <AntInput />
              </Form.Item>
              <Form.Item name="description" label="Mô tả">
                <AntInput />
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
                <AntInput />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <AntInput />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" }
                ]}
              >
                <AntInput />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {modalType === "add" ? "Thêm" : "Lưu"}
                </Button>
              </Form.Item>
            </Form>
          ) : (
            selectedItem && (
              <div>
                <p>
                  <strong>Tên công ty:</strong> {selectedItem.name}
                </p>
                <p>
                  <strong>Người phụ trách:</strong> {selectedItem.guardian}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {selectedItem.address}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {selectedItem.phone}
                </p>
                <p>
                  <strong>Email:</strong> {selectedItem.email}
                </p>
              </div>
            )
          )}
        </Modal>
      </div>
    </BaseLayout>
  );
};

export default IssueHistoryPage;
