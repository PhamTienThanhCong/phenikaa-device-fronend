import React, { useEffect, useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import {
  Button,
  Table,
  Modal,
  Typography,
  Form,
  Select,
  Input,
  DatePicker,
  Row,
  Col,
  Space,
  TimePicker
} from "antd";
import QRCode from "qrcode.react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getBookingDeviceList } from "../DeviceApi";
import { getDeviceList, returnDevice } from "../DeviceApi";
import { use } from "echarts";
import { clearError } from "../DeviceSlice";
import { notification } from "antd";
import { getCustomer } from "../../manageCutome/CustomerAPI";

const { Title } = Typography;

const EquipmentRequestPage = () => {
  const dispatch = useAppDispatch();
  // const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const { deviceBooking, isDeviceBooking } = useAppSelector((state) => state.device);
  const { isDevice, device } = useAppSelector((state) => state.device);
  const error = useAppSelector((state) => state.device.error);
  const [api, contextHolder] = notification.useNotification();
  const [isReturnVisible, setIsReturnVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [errorMess, setErrorMess] = useState({});
  const [showOtherInput, setShowOtherInput] = useState(false);
  const { isCustomer, customer } = useAppSelector((state) => state.customer);

  const { Option } = Select;
  const { TextArea } = Input;
  const { confirm } = Modal;
  const { currentUser } = useAppSelector((state) => state.auth);
  const reasons = ["Bình thường", "Hỏng", "Mất", "Khác"];
  const returnColumns = [
    {
      title: "Mã thiết bị",
      dataIndex: "id",
      key: "device_id"
    },
    {
      title: "Tên thiết bị/Tên phòng",
      dataIndex: "name",
      key: "deviceName"
    },
    // thời gian trả
    {
      title: "Thời gian trả",
      dataIndex: "returnDate",
      key: "returnDate"
    },

    {
      title: "Tình trạng",
      dataIndex: "condition",
      key: "condition"
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note"
    }
  ];
  const handleFinish = (values) => {
    setFormData(values);
    setIsModalVisible(true);
  };
  const handleModalOk = () => {
    setIsPrintModalVisible(true);
    setIsModalVisible(false);
    // setSubmited(true);
  };
  const handlePrint = () => {
    window.print();
  };
  const handleSelectChange = (value) => {
    setShowOtherInput(value === "Khác");
  };
  const data = [
    {
      key: "1",
      deviceCode: "ABC123",
      deviceName: "Thiết bị X",
      returnTime: "2021-10-10 10:00:00",
      condition: "Bình thường",
      description: "Mô tả thiết bị X",
      note: "Ghi chú thiết bị X"
    }
    // Add more data as needed
  ];
  const handleMarkAsReturned = async (slipCode) => {
    setSelectedRequest(slipCode);
    setIsReturnVisible(true);

    // await dispatch(returnDevice({ id: slipCode }));
  };
  const refreshData = async () => {
    await dispatch(getBookingDeviceList());
  };
  const notificationMessage = (type, message) => {
    api[type]({
      message: type == "error" ? "Lỗi" : "Thông báo",
      description: message
    });
  };

  useEffect(() => {
    if (!isDeviceBooking) {
      dispatch(getBookingDeviceList());
      refreshData();
    }
  }, [dispatch, isDeviceBooking]);
  useEffect(() => {
    if (!isDevice) {
      dispatch(getDeviceList());
    }
  }, [dispatch, isDevice]);
  useEffect(() => {
    if (error) {
      notificationMessage("error", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);
  useEffect(() => {
    if (!isCustomer) {
      dispatch(getCustomer());
    }
  }, [dispatch, isCustomer]);
  const getDeviceInfo = (deviceId) => {
    const deviceInfo = device.find((item) => item.id === deviceId);
    return deviceInfo
      ? {
        id: deviceInfo.id,
        name: deviceInfo.name
      }
      : {
        id: deviceId,
        name: "Unknown"
      };
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  const listDeviceBooking = deviceBooking
    .filter((item) => item.status !== "returned")
    .map((item) => {
      return {
        slipCode: item.id,
        borrowerName: item.customer.full_name,
        borrowerId: item.customer.id,
        borrowDate: formatDate(item.created_at),
        returnDate: formatDate(item.returning_date),
        issuedBy: item.user ? item.user.full_name : "QTV",
        deviceList: item.devices.map((device) => ({
          id: device.device_id,
          name: getDeviceInfo(device.device_id).name,
          quantity: device.quantity,
          returnDate: formatDate(item.returning_date)
        }))
      };
    });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setViewModalVisible(true);
  };

  const columns = [
    { title: "Mã phiếu mượn", dataIndex: "slipCode", key: "slipCode", width: "20%" },
    { title: "Tên người mượn", dataIndex: "borrowerName", key: "borrowerName", width: "20%" },
    { title: "Thời gian trả", dataIndex: "returnDate", key: "projectedReturnDate", width: "20%" },
    {
      title: "Trạng thái",
      dataIndex: "isReturned",
      key: "isReturned",
      width: "20%",
      render: (text, record) => (record.isReturned ? "Đã trả" : "Chưa trả")
    },
    {
      title: "Hành động",
      key: "action",
      width: "20%",
      render: (text, record) => (
        <div>
          {!record.isReturned && (
            <Button onClick={() => handleMarkAsReturned(record)} type="primary">
              Đánh dấu đã trả
            </Button>
          )}
          <Button onClick={() => handleViewDetails(record)} style={{ marginLeft: 8 }}>
            Xem chi tiết
          </Button>
        </div>
      )
    }
  ];
  const onCancelModal = () => {
    setIsReturnVisible(false)
    // destroy Modalz
  }


  return (
    <BaseLayout>
      <Title level={1}>Danh sách đang mượn</Title>
      <Table columns={columns} dataSource={listDeviceBooking} rowKey="slipCode" />

      {/* Modal to view details */}
      <Modal
        title="Chi tiết phiếu mượn"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedRequest && (
          <>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <QRCode value={`Slip Code: ${selectedRequest.slipCode}`} />
            </div>
            <p>
              <strong>Mã phiếu mượn:</strong> {selectedRequest.slipCode}
            </p>
            <p>
              <strong>Tên người mượn:</strong> {selectedRequest.borrowerName}
            </p>
            <p>
              <strong>Thời gian trả:</strong> {selectedRequest.returnDate}
            </p>
            <Table dataSource={selectedRequest.deviceList} rowKey="id">
              <Table.Column title="Mã thiết bị" dataIndex="id" key="id" />
              <Table.Column title="Tên thiết bị" dataIndex="name" key="name" />
              <Table.Column title="Số lượng" dataIndex="quantity" key="quantity" />
            </Table>
          </>
        )}
      </Modal>
      <Modal Title="Biên lai trả Thiết bị" visible={isReturnVisible} onCancel={() => { onCancelModal() }} footer={null}>
        <Row justify="center" align="middle" className="feedback-page">
          <Col className="feedback-box">
            <Row justify="center" align="middle" className="feedback-header">
              <Col>
                <img src="/logo/logo-title.png" alt="Logo Công ty" className="company-logo" />
              </Col>
            </Row>
            <Row justify="center" align="middle" className="feedback-header">
              <Col>
                <Title level={2} className="feedback-title">
                  Biên lai trả phòng/thiết bị
                </Title>
              </Col>
              <span style={{ textAlign: "center" }}>
                Hãy chắc chắn rằng biên lai đã được điền đầy đủ thông tin và xác nhận bởi quản trị viên
              </span>
            </Row>
            {errorMess.form && <Alert style={{ marginTop: "10px" }} message={errorMess.form} type="error" />}
            <Form form={form} onFinish={handleFinish} layout="vertical">
              <Form.Item name="studentId" label="Tên người mượn">
                <Space.Compact style={{ width: "100%" }}>
                  {/* selectt with defaul value */}
                  <Input placeholder="Tên người mượn" disabled={true} defaultValue={selectedRequest?.borrowerName} />

                </Space.Compact>
              </Form.Item>
              <Form.Item name="receiver" label="Tên người nhận">
                <Input placeholder="Tên người nhận" disabled={true} defaultValue={currentUser?.full_name} />
              </Form.Item>
              <Row>
                <Form.Item label="Ngày trả" name="returnDate" style={{ width: "50%" }}>
                  <DatePicker
                    style={{ width: "98%", height: "40px" }}
                    showTime={{ format: "HH:mm:ss" }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Form.Item>
                <Form.Item name="returnTime" label="Thời gian trả" style={{ width: "50%" }}>
                  <TimePicker style={{ width: "100%", height: "40px" }} format="HH:mm" />
                </Form.Item>
              </Row>
              <Form.Item name="reason" label="Tình trạng">
                <Select placeholder="Chọn tình trạng của thiết bị" onChange={handleSelectChange}>
                  {reasons.map((reason) => (
                    <Option key={reason} value={reason}>
                      {reason}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {showOtherInput && (
                <Form.Item name="otherReason" label="Tình trạng khác">
                  <Input placeholder="Tình trạng khác" />
                </Form.Item>
              )}
              <Form.Item name="description" label="Mô tả">
                <TextArea placeholder="Mô tả" rows={4} />
              </Form.Item>
              <Form.Item>
                <Button style={{ borderRadius: "8px" }} type="primary" htmlType="submit" className="send-button">
                  Gửi
                </Button>
              </Form.Item>
            </Form>
            <Row justify="center" align="middle" className="feedback-header">
              <Col>
                <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                  <i>
                    Biên lai có giá trị sau 3 ngày kể từ ngày trả phòng/thiết bị. Vui lòng giữ biên lai này để có thể đảm
                    bảo quyền lợi của bạn. Xin chân thành cảm ơn
                  </i>
                </div>
              </Col>
            </Row>
          </Col>

          <Modal
            title="Xác nhận gửi"
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={() => setIsModalVisible(false)}
          >
            <Form layout="vertical" initialValues={formData}>
              <Form.Item label="Tên người mượn" name="studentId">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Tên người nhận" name="receiver">
                <Input disabled value={formData.receiver} />
              </Form.Item>
              <Row>
                <Form.Item label="Ngày trả" name="returnDate" style={{ width: "50%" }}>
                  <DatePicker disabled style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="returnTime" label="Thời gian trả" style={{ width: "50%" }}>
                  <TimePicker disabled style={{ width: "100%" }} />
                </Form.Item>
              </Row>
              <Form.Item name="reason" label="Tình trạng">
                <Select disabled>
                  {reasons.map((reason) => (
                    <Option key={reason} value={reason}>
                      {reason}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {formData.reason === "Khác" && (
                <Form.Item label="Tình trạng khác" name="otherReason">
                  <Input disabled />
                </Form.Item>
              )}
              <Form.Item name="description" label="Mô tả">
                <TextArea disabled rows={4} />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            open={isPrintModalVisible}
            width={1000}
            footer={[
              <Button key="print" onClick={handlePrint}>
                In biên lai
              </Button>,
              <Button key="close" onClick={() => setIsPrintModalVisible(false)}>
                Đóng
              </Button>
            ]}
            onCancel={() => setIsPrintModalVisible(false)}
          >
            <div
              style={{
                padding: "20px",
                border: "1px solid black",
                borderRadius: "10px",
                width: "90%",
                height: "100%",
                margin: "auto",
                textAlign: "center",
                paddingTop: "50px",
                marginTop: "50px"
              }}
            >
              <p
                style={{
                  marginTop: "0",
                  marginBottom: "0",
                  fontSize: "36px",
                  fontWeight: "bold"
                }}
              >
                CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </p>
              <p
                style={{
                  marginTop: "0",
                  marginBottom: "30px",
                  fontSize: "30px",
                  fontWeight: "bold"
                }}
              >
                Độc lập - Tự do - Hạnh phúc
              </p>
              <p
                style={{
                  marginTop: "0",
                  marginBottom: "0",
                  fontSize: "34px",
                  fontWeight: "bold"
                }}
              >
                BIÊN LAI TRẢ PHÒNG THIẾT BỊ
              </p>

              <div>
                <Row>
                  <Col span={12}>
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>Bên A (Trả thiết bị)</p>
                    <p style={{ fontSize: "20px" }}>Tên người trả: {selectedRequest?.borrowerName}</p>
                    <p style={{ fontSize: "20px" }}>Mã sinh viên: {selectedRequest?.borrowerId}</p>
                    <p style={{ fontSize: "20px" }}>Email: {formData.studentId || ""}</p>
                  </Col>
                  <Col span={12}>
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>Bên B (Nhận thiết bị)</p>
                    <p style={{ fontSize: "20px" }}>Tên người nhận: {currentUser?.full_name}</p>
                    <p style={{ fontSize: "20px" }}>Chức vụ: </p>
                    <p style={{ fontSize: "20px" }}>Email: {currentUser?.email}</p>
                  </Col>
                </Row>

                <Table columns={returnColumns} dataSource={selectedRequest?.deviceList} pagination={false} />
                <Row>
                  <Col span={12}>
                    <p style={{ fontSize: "24px", fontWeight: "bold", marginBottom: 0 }}>Bên A (Trả thiết bị)</p>
                    <p style={{ fontSize: "20px", marginBottom: 150, marginTop: 0 }}>
                      (Ký, ghi rõ họ tên, đóng dấu nếu có)
                    </p>
                  </Col>

                  <Col span={12}>
                    <p style={{ fontSize: "24px", fontWeight: "bold", marginBottom: 0 }}>Bên B (Nhận thiết bị)</p>
                    <p style={{ fontSize: "20px", marginBottom: 150, marginTop: 0 }}>(Ký, ghi rõ họ tên)</p>
                  </Col>
                </Row>
              </div>
            </div>
          </Modal>
        </Row>

      </Modal>
    </BaseLayout>
  );
};

export default EquipmentRequestPage;
