import { useEffect, useState } from "react";
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
  Tag,
  Select,
  Row,
  Col,
  Descriptions,
  DatePicker,
  InputNumber,
  Checkbox
} from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import BaseLayout from "@/features/layout/BaseLayout";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getAllDeviceRepair } from "./device_repair_Api";
import { getAllMaintenance } from "./device_repair_Api";
import { getAllDevice, getAllUser, createDeviceRepair, putDeviceRepair, deleteDeviceRepair } from "./device_repair_Api";
import { notification } from "antd";
import moment from "moment";
import { clearError } from "./device_repair_Slice";

// import TextArea from "antd/es/input/TextArea";
// import { SettingOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const MaintenanceSchedulePage = () => {
  const dispatch = useAppDispatch();
  const {
    maintenanceList,
    isGetAll,
    deviceCategoryList,
    isGetAllDeviceCategory,
    deviceList,
    isGetAllDevice,
    userList,
    isGetAllUser
  } = useAppSelector((state) => state.device_repair);

  const [searchText, setSearchText] = useState("");
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [form] = Form.useForm();
  const error = useAppSelector((state) => state.device_repair.error);

  useEffect(() => {
    if (!isGetAll) {
      dispatch(getAllDeviceRepair());
    }
  }, [dispatch, isGetAll]);
  useEffect(() => {
    if (!isGetAllDeviceCategory) {
      dispatch(getAllMaintenance());
    }
  }, [dispatch, isGetAllDeviceCategory]);

  useEffect(() => {
    if (!isGetAllDevice) {
      dispatch(getAllDevice());
    }
  }, [dispatch, isGetAllDevice]);

  useEffect(() => {
    if (!isGetAllUser) {
      dispatch(getAllUser());
    }
  }, [dispatch, isGetAllUser]);

  useEffect(() => {
    if (error) {
      console.log("error", error);
      notification.error({
        message: "Có lỗi xảy ra",
        description: "abc"
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // lấy ra danh sách thiết bị gồm id và name để làm select tạo bảo trì
  const deviceOptions = deviceList.map((item) => {
    return {
      device_id: item.id,
      divice_name: item.name
    };
  });

  const listMaintaince = deviceCategoryList.map((item) => {
    return {
      device_maintance_id: item.id,
      device_maintance_name: item.name
    };
  });

  const listUserData = userList?.map((item) => {
    return {
      user_id: item.id,
      user_name: item.full_name
    };
  });

  const listData = maintenanceList.map((item) => {
    const currentDate = new Date();
    const returningDate = new Date(item.returning_date);
    let status;

    if (item.is_returned) {
      status = "Đã trả";
    } else if (returningDate < currentDate) {
      status = "Quá hạn";
    } else {
      status = "Đang bảo trì";
    }

    return {
      key: item.id,
      index: item.id,
      deviceCode: `TBBT${item.id}`,
      deviceName: item?.devices?.map((device) => device.device.name),
      title: item?.name,
      name: item?.service?.name,
      user: item?.user?.full_name,
      email: item?.user?.email,
      status, // Use the computed status
      maintenanceTime: new Date(item?.returning_date).toLocaleString(),
      createdAt: new Date(item?.created_at).toLocaleString(),
      userPhone: item?.user?.profile?.phone_number,
      namePhone: item?.service?.phone,
      note: item?.note,
      quantity: item?.devices?.map((device) => device.quantity),
      cost_per_unit: item?.devices?.map((device) => device.cost_per_unit)
    };
  });

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = listData.filter((data) =>
    Object.values(data).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const getStatusTag = (status) => {
    switch (status) {
      case "Đã trả":
        return <Tag color="blue">Đã trả</Tag>;
      case "Quá hạn":
        return <Tag color="red">Quá hạn</Tag>;
      case "Đang bảo trì":
        return <Tag color="orange">Đang bảo trì</Tag>;
      default:
        return <Tag color="gray">Không xác định</Tag>;
    }
  };

  const columns = [
    { title: "ID", dataIndex: "index", key: "index", width: "3%" },
    // { title: "Mã bảo trì", dataIndex: "deviceCode", key: "deviceCode" },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Tên thiết bị", dataIndex: "deviceName", key: "deviceName" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity", width: "5%" },
    { title: "Người phụ trách", dataIndex: "user", key: "user" },
    { title: "Email", dataIndex: "email", key: "email" },

    {
      title: "Trạng thái thiết bị",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status)
    },
    { title: "Thời gian tạo", dataIndex: "createdAt", key: "createdAt" },
    { title: "Thời gian hoàn thành", dataIndex: "maintenanceTime", key: "maintenanceTime" },
    {
      title: "Đơn vị bảo trì",
      dataIndex: "name",
      key: "name",

      ellipsis: true
    },
    { title: "Giá", dataIndex: "cost_per_unit", key: "cost_per_unit" },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
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
        </Space>
      )
    }
  ];

  const handleModalOpen = (type, data) => {
    setModalType(type);
    setSelectedData(data);
    console.log("data", listUserData.find((value) => value.user_name == data?.user)?.user_id);

    form.setFieldsValue({
      title: data?.title,
      user: listUserData.find((value) => value.user_name == data?.user)?.user_id,
      name: listMaintaince.find((value) => value.device_maintance_name == data?.name)?.device_maintance_id,
      maintenanceTime: data?.maintenanceTime ? moment(data?.maintenanceTime) : null,
      devices: data?.quantity?.map((quantity) => ({
        deviceName: deviceOptions.find((value) => value.divice_name == data?.deviceName).device_id,
        cost_per_unit: data?.cost_per_unit,
        quantity: quantity
      })),

      note: data?.note
    });
  };
  const handleModalClose = () => {
    setModalType(null);
    setSelectedData(null);
    form.resetFields();
  };
  const handleFormSubmit = async (values) => {
    if (modalType === "add") {
      form.resetFields();

      try {
        const payload = {
          name: values.title,
          devices: values.devices.map((device) => ({
            device_id: device.deviceName,
            quantity: parseInt(device?.quantity),
            cost_per_unit: device.cost_per_unit
          })),
          user_id: values.user,
          service_id: values.name,
          note: values.note || "",
          returning_date: values?.maintenanceTime ? values.maintenanceTime.format("YYYY-MM-DD HH:mm:ss") : ""
        };

        await dispatch(createDeviceRepair(payload));
        // thông báo tạo thành công
        notification.success({
          message: "Thêm thiết bị thành công",
          description: "Đã thêm vào danh sách bảo trì"
        });
        handleModalClose();

        await dispatch(getAllDeviceRepair());
        await dispatch(getAllMaintenance());
        await dispatch(getAllDevice());

        handleModalClose();
      } catch (e) {
        console.log(1111111, e);
        notification.error({
          message: "Thêm thiết bị thất bại",
          description: "Đã có lỗi xảy ra, vui lòng thử lại sau"
        });
      }
      // console.log("Adding device", payload);
    } else if (modalType === "edit") {
      try {
        const payload = {
          name: values.title,
          devices: values.devices.map((device) => ({
            device_id: device.deviceName,
            arise_from: parseInt(device?.quantity),
            cost_per_unit: device.cost_per_unit[0],
            note: "device.note"
          })),
          user_id: values.user,
          service_id: values.name,
          note: values.note || "",
          is_returned: values.is_returned,
          returning_date: values?.maintenanceTime ? values.maintenanceTime.format("YYYY-MM-DD HH:mm:ss") : ""
        };
        await dispatch(
          putDeviceRepair({
            device_repair_id: selectedData.key,
            ...payload
          })
        );
        // console.log("payload", payload);
        //gọi lại api để lấy danh sách mới
        await dispatch(getAllDeviceRepair());
        // đóng modal
        handleModalClose();
        // clear form
        form.resetFields();

        // // xử lý nếu thành công

        if (error == null) {
          notification.success({
            message: "Cập nhật thiết bị thành công",
            description: "Thiết bị đã được cập nhật vào hệ thống"
          });
        }
      } catch (e) {
        console.log(e);
        notification.error({
          message: "Cập nhật thiết bị thất bại",
          description: "Đã có lỗi xảy ra, vui lòng thử lại sau"
        });
      }
      handleModalClose();
    }
  };

  const handleDelete = async (key) => {
    await dispatch(deleteDeviceRepair({ device_repair_id: key }));
    await dispatch(getAllDeviceRepair());
  };
  const onChange = (value) => {
    console.log("changed", value);
  };
  return (
    <BaseLayout>
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <Title level={2}>Danh sách thiết bị bảo trì</Title>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm"
              style={{ width: "256px" }}
              value={searchText}
              onChange={handleSearch}
            />
            <Button
              type="primary"
              style={{
                color: "white",
                backgroundColor: "#F26526"
              }}
              icon={<PlusOutlined color="white" />}
              onClick={() => handleModalOpen("add")}
            >
              Thêm
            </Button>
          </div>
        </div>

        <Table
          dataSource={filteredData.reverse()}
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
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Tiêu đề">{selectedData.title}</Descriptions.Item>
              <Descriptions.Item label="Mã thiết bị">{selectedData.deviceCode}</Descriptions.Item>
              <Descriptions.Item label="Tên thiết bị">{selectedData.deviceName}</Descriptions.Item>
              <Descriptions.Item label="Người phụ trách">{selectedData.user}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedData.email}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái thiết bị">{getStatusTag(selectedData.status)}</Descriptions.Item>
              <Descriptions.Item label="Thời gian tạo">{selectedData.createdAt}</Descriptions.Item>
              <Descriptions.Item label="Thời gian hoàn thành">{selectedData.maintenanceTime}</Descriptions.Item>
              <Descriptions.Item label="Đơn vị bảo trì">{selectedData.name}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại đơn vị bảo trì">{selectedData.namePhone}</Descriptions.Item>
            </Descriptions>
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
          width={800}
          style={{ top: 20 }}
        >
          <Form form={form} onFinish={handleFormSubmit} layout="vertical" id="deviceForm">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Đơn vị bảo trì"
                  rules={[{ required: true, message: "Đơn vị bảo trì không thể để trống!" }]}
                >
                  <Select
                    placeholder="Chọn đơn vị bảo trì"
                    style={{
                      width: "100%",
                      height: "40px"
                    }}
                    disabled={modalType === "edit"}
                  >
                    {listMaintaince.map((item) => (
                      <Option key={item.device_maintance_id} value={item.device_maintance_id}>
                        {item.device_maintance_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="title"
                  label="Tiêu đề"
                  rules={[{ required: true, message: "Tiêu đề không thể để trống!" }]}
                >
                  <Input disabled={modalType === "edit"} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="user"
                  label="Người phụ trách"
                  rules={[{ required: true, message: "Người phụ trách không thể để trống!" }]}
                >
                  <Select
                    placeholder="Chọn người phụ trách"
                    style={{
                      width: "100%",
                      height: "40px"
                    }}
                    disabled={modalType === "edit"}
                  >
                    {listUserData.map((item) => (
                      <Option key={item.user_id} value={item.user_id}>
                        {item.user_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="maintenanceTime"
                  label="Thời gian hoàn thành"
                  rules={[{ required: true, message: "Vui lòng chọn thời gian hoàn thành!" }]}
                  disabled={modalType === "edit"}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: "100%" }}
                    size="large"
                    disabled={modalType === "edit"}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.List name="devices">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Row gutter={16} key={key}>
                          <Col span={9}>
                            <Form.Item
                              {...restField}
                              name={[name, "deviceName"]}
                              fieldKey={[fieldKey, "deviceName"]}
                              label="Tên thiết bị"
                              rules={[{ required: true, message: "Tên thiết bị không thể để trống!" }]}
                              disabled={modalType === "edit"}
                            >
                              <Select
                                placeholder="Chọn thiết bị"
                                style={{
                                  width: "100%",
                                  height: "40px"
                                }}
                                size="large"
                                disabled={modalType === "edit"}
                              >
                                {deviceOptions.map((item) => (
                                  <Option key={item.device_id} value={item.device_id}>
                                    {item.divice_name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={5}>
                            <Form.Item
                              {...restField}
                              name={[name, "quantity"]}
                              fieldKey={[fieldKey, "quantity"]}
                              label="Số lượng"
                              rules={[{ required: true, message: "Số lượng không thể để trống!" }]}
                              disabled={modalType === "edit"}
                            >
                              <AntInput type="number" disabled={modalType === "edit"} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, "cost_per_unit"]}
                              fieldKey={[fieldKey, "cost_per_unit"]}
                              label="Giá mỗi thiết bị"
                              rules={[{ required: true, message: "Giá không thể để trống!" }]}
                              style={{ width: "100%", height: "50px" }}
                              disabled={modalType === "edit"}
                            >
                              <InputNumber
                                addonAfter={`VNĐ`}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                                onChange={onChange}
                                style={{ width: "100%", height: "80px" }}
                                size="large"
                                disabled={modalType === "edit"}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={2} style={{ textAlign: "right", display: "flex", alignItems: "center" }}>
                            <a
                              type="link"
                              onClick={() => remove(name)}
                              style={{
                                marginTop: 0
                              }}
                            >
                              Xóa
                            </a>
                          </Col>
                        </Row>
                      ))}{" "}
                      <Col span={24}>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                          style={{
                            width: "100%"
                          }}
                          disabled={modalType === "edit"}
                        >
                          Thêm thiết bị
                        </Button>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="note"
                          label="Lý do bảo trì"

                          // rules={[{ required: true, message: "Lý do bảo trì không thể để trống!" }]}
                        >
                          <AntInput.TextArea disabled={modalType === "edit"} />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Form.List>
              </Col>
            </Row>
            {modalType === "edit" && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="is_returned"
                    label="Trạng thái"
                    rules={[{ required: true, message: "Trạng thái không thể để trống!" }]}
                  >
                    {/* <Checkbox>Đã trả</Checkbox> */}
                    {/* sửa checkbox thành select */}
                    <Select
                      placeholder="Chọn trạng thái"
                      style={{
                        width: "100%",
                        height: "40px"
                      }}
                    >
                      <Option value={true}>Đã trả</Option>
                      <Option value={false}>Chưa trả</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Form>
        </Modal>
      </div>
    </BaseLayout>
  );
};

export default MaintenanceSchedulePage;
