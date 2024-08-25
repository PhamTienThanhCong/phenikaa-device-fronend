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
  TimePicker,
  Alert
} from "antd";
import QRCode from "qrcode.react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getBookingDeviceList } from "../DeviceApi";
import { getDeviceList, updateDevice, deviceBorrowingDetail } from "../DeviceApi";
import { use } from "echarts";
import { clearError } from "../DeviceSlice";
import { notification } from "antd";
import { getCustomer } from "../../manageCutome/CustomerAPI";
import moment from "moment";
import { render } from "react-dom";
// import { MinusCircleOutlined } from "@ant-design/icons";
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
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [errorMess, setErrorMess] = useState({});
  const { isCustomer, customer } = useAppSelector((state) => state.customer);
  const { TextArea } = Input;
  const { Option } = Select;
  const { currentUser } = useAppSelector((state) => state.auth);

  // export const deviceBorrowingDetail = createAsyncThunk("device/device-borrowing-detail", async (payload, thunkAPI) => {
  //   const url = `/device-borrowing/${payload.id}`;
  //   let res = await SendRequest(url, payload, thunkAPI, "GET");
  //   return res;
  // });
  // getapi trên
  const { deviceBorrowingDetailList } = useAppSelector((state) => state.device);
  useEffect(() => {
    if (selectedRequest) {
      dispatch(deviceBorrowingDetail({ id: selectedRequest.slipCode }));
    }
  }, [selectedRequest, dispatch]);

  const returnColumns = [
    {
      title: "Mã thiết bị",
      dataIndex: "id",
      key: "device_id"
    },
    {
      title: "Tên thiết bị",
      dataIndex: "nameDevice",
      key: "deviceName"
    },

    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity"
    },
    {
      title: "Thời gian trả",
      dataIndex: "returnDate",
      key: "returnDate",
      render: (date) => {
        const adjustedDate = new Date(new Date(date).getTime() + 7 * 60 * 60 * 1000);
        return adjustedDate.toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      }
    },

    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      render(text, record) {
        if (record.status === "done") {
          return "Bình thường";
        } else if (record.status === "fair") {
          return "Hư hỏng";
        } else if (record.status === "lost") {
          return "Mất";
        } else {
          return "Đang mượn";
        }
      }
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

  // lấy giá trị ngày hiện tại
  const currentDate = new Date().toISOString().substring(0, 10);

  const handlePrint = () => {
    window.print();
  };

  const handleMarkAsReturned = async (slipCode) => {
    form.resetFields();
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

  const handleFinish = async (values) => {
    form.resetFields();
    setFormData(values); // Lưu dữ liệu vào state

    const filteredEntries = Object.entries(values).filter(
      ([key, value]) => key !== "description" && key !== "deviceList" && typeof value === "object"
    );
    const objectArray = filteredEntries.map(([key, value]) => value);

    const payload = {
      devices: objectArray.map((item, index) => ({
        device_id: selectedRequest.deviceList[index].id,
        quantity_return: selectedRequest.deviceList[index].quantity,
        status: item.status,
        note: item.note
      })),
      note: ""
    };

    setIsReturnVisible(false);
    setIsPrintModalVisible(true);

    await dispatch(updateDevice({ device_borrowing_id: selectedRequest.slipCode, ...payload }));

    // await dispatch(returnDevice({ id: selectedRequest.slipCode }));
    await dispatch(deviceBorrowingDetail({ id: selectedRequest.slipCode }));
    setSelectedRequest(null);

    await dispatch(getBookingDeviceList());
  };

  // tạo 1 mảng data
  const data = deviceBorrowingDetailList?.devices;
  const transformedData = data?.map((item) => ({
    id: item.device.id,
    nameDevice: item.device.name,
    quantity: item.quantity,
    status: item.status,
    description: item.note,
    name: deviceBorrowingDetailList.customer.full_name,
    returnDate: deviceBorrowingDetailList.retired_date
  }));

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
            <Button onClick={() => handleMarkAsReturned(record)} style={{ backgroundColor: "#F26526" }} type="primary">
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
    setIsReturnVisible(false);
    // destroy Modalz
  };
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
              <strong>Mã phiếu mượn:</strong>{" "}
              <button
                style={{
                  background: "#F26526",
                  color: "white",
                  border: "none"
                }}
                onClick={() => {
                  window.location.href = `https://phenikaa-uni.top/device-loan/${selectedRequest.slipCode}`;
                }}
              >
                Phiếu mượn
              </button>
            </p>
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
      <Modal
        Title="Biên lai trả Thiết bị"
        visible={isReturnVisible}
        onCancel={() => {
          onCancelModal();
        }}
        footer={null}
        width="40%"
        height="100%"
        style={{ height: "100%" }}
      >
        <Row justify="center" align="middle">
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
                  <Input
                    placeholder="Tên người mượn"
                    disabled={true}
                    defaultValue={selectedRequest?.borrowerName}
                    value={selectedRequest?.borrowerName}
                  />
                </Space.Compact>
              </Form.Item>
              <Form.Item name="receiver" label="Tên người nhận">
                <Input
                  placeholder="Tên người nhận"
                  disabled={true}
                  defaultValue={currentUser?.full_name}
                  value={currentUser?.full_name}
                />
              </Form.Item>
              <Row>
                <Form.Item label="Ngày trả" name="returnDate" style={{ width: "50%" }}>
                  <DatePicker
                    style={{ width: "98%", height: "40px" }}
                    defaultValue={moment(currentDate, "YYYY-MM-DD")}
                    placeholder={moment(currentDate, "YYYY-MM-DD")}
                    disabled
                  />
                </Form.Item>
                <Form.Item name="returnTime" label="Thời gian trả" style={{ width: "50%" }}>
                  <TimePicker
                    style={{ width: "100%", height: "40px" }}
                    format="HH:mm"
                    defaultValue={moment()} // Default to the current time
                    placeholder={moment().format("HH:mm")}
                    disabled
                  />
                </Form.Item>
              </Row>

              <Form.Item name="deviceList" label="Danh sách thiết bị">
                {selectedRequest?.deviceList?.map((device, index) => (
                  <Row key={index} gutter={16} style={{ marginBottom: "8px" }}>
                    <Col span={5}>
                      <Form.Item
                        name={[index, "name"]}
                        label="Tên thiết bị"
                        initialValue={device.name}
                        style={{ margin: 0 }}
                      >
                        <Input placeholder="Tên thiết bị" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name={[index, "quantity"]}
                        label="Số lượng"
                        initialValue={device.quantity}
                        style={{ margin: 0 }}
                      >
                        <Input type="number" placeholder="Số lượng" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name={[index, "status"]}
                        label="Trạng thái"
                        initialValue={device.status}
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: "Trạng thái không được để trống" }]}
                      >
                        <Select placeholder="Trạng thái" size="large">
                          <Option value="done">Bình thường</Option>
                          <Option value="fair">Hư hỏng</Option>
                          <Option value="lost">Mất</Option>
                          <Option value="borrowing" disabled>
                            Đang mượn
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={9}>
                      <Form.Item
                        name={[index, "note"]}
                        label="Mô tả"
                        initialValue={device.note}
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: "Mô tả không được để trống" }]}
                      >
                        <Input placeholder="Mô tả" />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
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
                    Biên lai có giá trị sau 3 ngày kể từ ngày trả phòng/thiết bị. Vui lòng giữ biên lai này để có thể
                    đảm bảo quyền lợi của bạn. Xin chân thành cảm ơn
                  </i>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
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
                <p style={{ fontSize: "20px" }}>Tên người trả:{deviceBorrowingDetailList?.customer?.full_name}</p>
                <p style={{ fontSize: "20px" }}>Mã sinh viên: {deviceBorrowingDetailList?.customer?.id}</p>
                <p style={{ fontSize: "20px" }}>Email: {deviceBorrowingDetailList?.customer?.email}</p>
              </Col>
              <Col span={12}>
                <p style={{ fontSize: "24px", fontWeight: "bold" }}>Bên B (Nhận thiết bị)</p>
                <p style={{ fontSize: "20px" }}>Tên người nhận: {deviceBorrowingDetailList?.user?.full_name}</p>

                <p style={{ fontSize: "20px" }}>Email: {deviceBorrowingDetailList?.user?.email}</p>
              </Col>
            </Row>

            <Table columns={returnColumns} dataSource={transformedData} pagination={false} />
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
    </BaseLayout>
  );
};

export default EquipmentRequestPage;
