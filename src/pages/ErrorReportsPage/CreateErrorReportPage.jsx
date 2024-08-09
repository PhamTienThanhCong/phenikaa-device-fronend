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
  TimePicker
} from "antd";
import "./FeedBackPage.scss";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";

import BaseLayout from "@/features/layout/BaseLayout";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const FeedBackPage = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [studentInfo, setStudentInfo] = useState({});
  const [errorMess, setErrorMess] = useState({
    form: "",
    studentId: ""
  });
  const [submited, setSubmited] = useState(false);

  const reasons = ["Lỗi hệ thống", "Lỗi thiết bị", "Lỗi đặt phòng", "Khác"];

  const handleSelectChange = (value) => {
    setShowOtherInput(value === "Khác");
  };

  const handleFinish = (values) => {
    console.log("Received values of form:", values);
  };

  const handleModalOk = async () => {
    setErrorMess({ form: "", studentId: "" });
    let reason = formData.reason;
    if (reason === "Khác") {
      reason = formData.otherReason;
    }
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
            <Form.Item
              name="studentId"
              label="Tên người mượn"
              rules={[{ required: true, message: "Vui lòng nhập mã số sinh viên của bạn!" }]}
            >
              <Space.Compact style={{ width: "100%" }}>
                <Input placeholder="Mã số sinh viên" />
              </Space.Compact>
            </Form.Item>
            {/* tên người nhận */}
            <Form.Item
              name="receiver"
              label="Tên người nhận"
              rules={[{ required: true, message: "Vui lòng nhập tên người nhận!" }]}
            >
              <Input placeholder="Tên người nhận" />
            </Form.Item>
            <Row>
              <Form.Item
                label="Ngày trả"
                name="returnDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày trả!" }]}
              >
                <DatePicker showTime={{ format: "HH:mm:ss" }} format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
              <Form.Item
                name="returnDate"
                label="Thời gian trả"
                rules={[{ required: true, message: "Vui lòng nhập ngày trả!" }]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            </Row>

            <Form.Item name="reason" label="Lý do" rules={[{ required: true, message: "Vui lòng chọn một lý do!" }]}>
              <Select placeholder="Chọn lý do" onChange={handleSelectChange}>
                {reasons.map((reason) => (
                  <Option key={reason} value={reason}>
                    {reason}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {showOtherInput && (
              <Form.Item
                name="otherReason"
                label="Lý do khác"
                rules={[{ required: true, message: "Vui lòng chỉ rõ lý do khác!" }]}
              >
                <Input placeholder="Lý do khác" />
              </Form.Item>
            )}
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng chỉ rõ tiêu đề!" }]}>
              <Input placeholder="Tiêu đề" />
            </Form.Item>
            <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}>
              <TextArea placeholder="Mô tả" rows={4} />
            </Form.Item>
            <Form.Item>
              <Button style={{ borderRadius: "8px" }} type="primary" htmlType="submit" className="send-button">
                Gửi
              </Button>
            </Form.Item>
          </Form>
          {/* Bạn có thể kiểm tra phản hồi cũ tại đây */}
          <Row justify="center" align="middle" className="feedback-header">
            <Col>
              <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                <i>
                  Chúng tôi sẽ lưu lại địa chỉ IP của bạn khi gửi phản hồi để phục vụ cho việc kiểm soát thông tin.
                  Chúng tôi cam kết tuyệt đối bảo mật thông tin của bạn.{" "}
                </i>
              </div>
              <Title level={5} className="feedback-title">
                Bạn có thể kiểm tra phản hồi cũ của mình <Link to="/feedback/result">tại đây</Link>
              </Title>
            </Col>
          </Row>
        </Col>

        <Modal
          title="Xác nhận gửi"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <p>Bạn có chắc chắn muốn gửi biểu mẫu này không?</p>
        </Modal>
      </Row>
    </BaseLayout>
  );
};

export default FeedBackPage;
