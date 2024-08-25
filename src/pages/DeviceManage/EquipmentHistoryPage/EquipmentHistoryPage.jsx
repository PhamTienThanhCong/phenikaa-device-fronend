import React, { useEffect, useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Button, Table, Modal, Input, Typography, Row, Col, Form, Space, DatePicker, TimePicker, Select } from "antd";
import QRCode from "qrcode.react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getBookingDeviceList, deviceBorrowingDetail } from "../DeviceApi";
// import "./FeedBackPage.scss";
import "../../FeedBack/FeedBackPage.scss";

const { TextArea } = Input;
const { Title } = Typography;

const mockHistory = [
  {
    slipCode: "MS001",
    borrowerName: "Nguyen Van A",
    borrowDate: "2024-07-01",
    returnDate: "2024-07-10",
    issuedBy: "Admin A"
  },
  {
    slipCode: "MS002",
    borrowerName: "Le Thi B",
    borrowDate: "2024-07-05",
    returnDate: "2024-07-15",
    issuedBy: "Admin B"
  }
  // Add more mock data as needed
];

const handleSelectChange = (value) => {
  setShowOtherInput(value === "Khác");
};
const EquipmentHistoryPage = () => {
  const dispatch = useAppDispatch();
  const [history, setHistory] = useState(mockHistory);
  const [searchText, setSearchText] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const { deviceBooking, isDeviceBooking } = useAppSelector((state) => state.device);
  const [form] = Form.useForm();
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMess, setErrorMess] = useState({ form: "", studentId: "" });
  const [isReturnVisible, setIsReturnVisible] = useState(false);
  const [submited, setSubmited] = useState(false);
  const { deviceBorrowingDetailList } = useAppSelector((state) => state.device);
  useEffect(() => {
    if (selectedRecord) {
      dispatch(deviceBorrowingDetail({ id: selectedRecord.slipCode }));
    }
  }, [selectedRecord, dispatch]);

  const reasons = ["Bình thường", "Hỏng", "Mất", "Khác"];
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
  const handleFinish = (values) => {
    setFormData(values);
    setIsModalVisible(true);
  };
  // const data = [
  //   {
  //     key: "1",
  //     deviceCode: "ABC123",
  //     deviceName: "Thiết bị X",
  //     returnTime: "2021-10-10 10:00:00",
  //     condition: "Bình thường",
  //     description: "Mô tả thiết bị X",
  //     note: "Ghi chú thiết bị X"
  //   }
  //   // Add more data as needed
  // ];

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

  const handleModalOk = () => {
    setIsPrintModalVisible(true);
    setIsModalVisible(false);
    // setSubmited(true);
  };
  console.log("transformedData", transformedData);
  const handlePrint = () => {
    window.print();
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (!isDeviceBooking) {
      dispatch(getBookingDeviceList());
    }
  }, [dispatch, isDeviceBooking]);

  console.log(deviceBooking);
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const listDeviceBooking = deviceBooking
    .filter((item) => item.status === "returned")
    .map((item) => {
      return {
        slipCode: item.id,
        borrowerName: item.customer.full_name,
        borrowDate: formatDate(item.created_at),
        returnDate: formatDate(item.returning_date),
        issuedBy: item.user ? item.user.full_name : "QTV",
        devices: item.devices.map((device) => ({
          id: device.device_id,
          name: device.name,
          quantity: device.quantity
        }))
      };
    });
  const filteredHistory = listDeviceBooking.filter((record) => record.slipCode.toString().includes(searchText));

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setViewModalVisible(true);
  };
  const handleWiewSlip = (record) => {
    window.open(`https://phenikaa-uni.top/device-loan/${record.slipCode}`, "_blank");
  };

  const columns = [
    { title: "Mã phiếu mượn", dataIndex: "slipCode", key: "slipCode" },
    { title: "Tên người mượn", dataIndex: "borrowerName", key: "borrowerName" },
    { title: "Ngày mượn", dataIndex: "borrowDate", key: "borrowDate" },
    { title: "Ngày trả", dataIndex: "returnDate", key: "returnDate" },
    { title: "Tên tài khoản đã cho mượn", dataIndex: "issuedBy", key: "issuedBy" },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => {
        return (
          <>
            <Button onClick={() => handleViewDetails(record)}>Xem chi tiết</Button>
            <Button
              type="primary"
              onClick={() => handleWiewSlip(record)}
              style={{ marginLeft: 8, backgroundColor: "#F26526" }}
            >
              Xem phiếu mượn
            </Button>
          </>
        );
      }
    }
  ];

  return (
    <BaseLayout>
      <Title level={1}>Tra cứu lịch sử mượn</Title>
      <Input
        placeholder="Tìm kiếm theo mã phiếu mượn"
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table columns={columns} dataSource={filteredHistory} rowKey="slipCode" />

      {/* Modal to view details */}
      <Modal
        title="Chi tiết phiếu mượn"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="return"
            type="primary"
            style={{
              color: "white",
              backgroundColor: "#F26526"
            }}
            onClick={() => setIsPrintModalVisible(true)}
          >
            Biên lai trả thiết bị
          </Button>
        ]}
      >
        {selectedRecord && (
          <>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <QRCode value={`https://phenikaa-uni.top/device-loan/${selectedRecord.slipCode}`} />
            </div>
            <p>
              <strong>Mã phiếu mượn:</strong>{" "}
              <button
                style={{
                  background: "#F26526",
                  color: "white"
                }}
                onClick={() => {
                  window.location.href = `https://phenikaa-uni.top/device-loan/${selectedRecord.slipCode}`;
                }}
              >
                Phiếu mượn
              </button>
            </p>
            <p>
              <strong>Mã phiếu mượn:</strong> {selectedRecord.slipCode}
            </p>
            <p>
              <strong>Tên người mượn:</strong> {selectedRecord.borrowerName}
            </p>
            <p>
              <strong>Ngày mượn:</strong> {selectedRecord.borrowDate}
            </p>
            <p>
              <strong>Ngày trả:</strong> {selectedRecord.returnDate}
            </p>
            <p>
              <strong>Tên tài khoản đã cho mượn:</strong> {selectedRecord.issuedBy}
            </p>
            <Table dataSource={selectedRecord.devices} rowKey="id">
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
          setIsReturnVisible(true);
        }}
        footer={null}
      >
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
                  <Input placeholder="Mã số sinh viên" />
                </Space.Compact>
              </Form.Item>
              <Form.Item name="receiver" label="Tên người nhận">
                <Input placeholder="Tên người nhận" />
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
                    Biên lai có giá trị sau 3 ngày kể từ ngày trả phòng/thiết bị. Vui lòng giữ biên lai này để có thể
                    đảm bảo quyền lợi của bạn. Xin chân thành cảm ơn
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
                <Input disabled />
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
                <p style={{ fontSize: "20px" }}>Tên người trả: {deviceBorrowingDetailList?.customer?.full_name} </p>
                <p style={{ fontSize: "20px" }}>Mã sinh viên: {deviceBorrowingDetailList?.customer?.id} </p>
                <p style={{ fontSize: "20px" }}>
                  Email: {""} {deviceBorrowingDetailList?.customer?.email}
                </p>
              </Col>
              <Col span={12}>
                <p style={{ fontSize: "24px", fontWeight: "bold" }}>Bên B (Nhận thiết bị)</p>
                <p style={{ fontSize: "20px" }}>
                  Tên người nhận:
                  {""} {deviceBorrowingDetailList?.user?.full_name}
                </p>

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

export default EquipmentHistoryPage;
