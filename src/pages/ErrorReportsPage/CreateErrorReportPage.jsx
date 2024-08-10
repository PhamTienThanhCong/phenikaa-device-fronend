import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Space,
  Alert,
  Result,
  DatePicker,
  TimePicker,
  Table
} from "antd";
import "./FeedBackPage.scss";
import { Link } from "react-router-dom";
import BaseLayout from "@/features/layout/BaseLayout";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const FeedBackPage = () => {
  const [form] = Form.useForm();
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [errorMess, setErrorMess] = useState({ form: "", studentId: "" });
  const [submited, setSubmited] = useState(false);

  const reasons = ["Bình thường", "Hỏng", "Mất", "Khác"];

  const handleSelectChange = (value) => {
    setShowOtherInput(value === "Khác");
  };
  const columns = [
    {
      title: "Mã thiết bị",
      dataIndex: "deviceCode",
      key: "deviceCode"
    },
    {
      title: "Tên thiết bị/Tên phòng",
      dataIndex: "deviceName",
      key: "deviceName"
    },
    // thời gian trả
    {
      title: "Thời gian trả",
      dataIndex: "returnTime",
      key: "returnTime"
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

  if (submited) {
    return (
      <Result
        status="success"
        title="Gửi phản hồi thành công!"
        subTitle="Cảm ơn bạn đã chia sẻ với chúng tôi, chúng tôi sẽ giải quyết vấn đề của bạn sớm nhất có thể."
        extra={[
          <Button key="console">
            <Link to="/feedback/result">Kiểm tra phản hồi của bạn</Link>
          </Button>,
          <Button type="primary" key="buy" onClick={() => setSubmited(false)}>
            Gửi phản hồi mới
          </Button>
        ]}
      />
    );
  }

  return (
    <BaseLayout>
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
                  <p style={{ fontSize: "20px" }}>Tên người trả: {formData.studentId}</p>
                  <p style={{ fontSize: "20px" }}>Mã sinh viên: {formData.studentId}</p>
                  <p style={{ fontSize: "20px" }}>Email: {formData.studentId}</p>
                </Col>
                <Col span={12}>
                  <p style={{ fontSize: "24px", fontWeight: "bold" }}>Bên B (Nhận thiết bị)</p>
                  <p style={{ fontSize: "20px" }}>Tên người nhận: {formData.receiver}</p>
                  <p style={{ fontSize: "20px" }}>Chức vụ: {formData.receiver}</p>
                  <p style={{ fontSize: "20px" }}>Email: {formData.receiver}</p>
                </Col>
              </Row>

              <Table columns={columns} dataSource={data} pagination={false} />
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
    </BaseLayout>
  );
};

export default FeedBackPage;
