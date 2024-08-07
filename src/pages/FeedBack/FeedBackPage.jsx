import { useState } from "react";
import { Form, Input, Select, Button, Modal, Row, Col, Typography, Space, Alert, Result } from "antd";
import "./FeedBackPage.scss";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { createFeedback, getInfoUserFeedback } from "./FeedBackApi";

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

  const handleCheckStudentId = async () => {
    // get student id from form
    setErrorMess({ ...errorMess, studentId: "" });
    setStudentInfo({});
    const studentId = form.getFieldValue("studentId");
    // dispatch action to get student info
    const res = await dispatch(getInfoUserFeedback({ id: studentId }));
    if (res.payload) {
      setStudentInfo(res.payload);
      return true;
    } else {
      setErrorMess({ ...errorMess, studentId: "Student ID is not valid" });
      return false;
    }
  };

  const handleFinish = (values) => {
    setFormData(values);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    setErrorMess({ form: "", studentId: "" });
    let reason = formData.reason;
    if (reason === "Khác") {
      reason = formData.otherReason;
    }
    let dataPayload = {
      customer_id: formData.studentId,
      category: reason,
      title: formData.title,
      content: formData.description
    };
    let dataUser = await handleCheckStudentId({
      id: formData.studentId
    });
    if (!dataUser) {
      return;
    }
    const res = await dispatch(createFeedback(dataPayload));
    if (res.payload) {
      form.resetFields();
      setStudentInfo({});
      setIsModalVisible(false);
      setSubmited(true);
    } else {
      setIsModalVisible(false);
      setErrorMess({ ...errorMess, form: "Có lỗi xảy ra, vui lòng thử lại sau" });
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
              Phản Hồi Của Bạn
            </Title>
          </Col>
          <span style={{ textAlign: "center" }}>
            Hãy chia sẻ với chúng tôi về những vấn đề bạn gặp phải, chúng tôi sẽ giúp bạn giải quyết vấn đề đó.
          </span>
        </Row>
        {errorMess.form && <Alert style={{ marginTop: "10px" }} message={errorMess.form} type="error" />}
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="studentId"
            label="Mã số sinh viên"
            rules={[{ required: true, message: "Vui lòng nhập mã số sinh viên của bạn!" }]}
          >
            <Space.Compact style={{ width: "100%" }}>
              <Input placeholder="Mã số sinh viên" />
              <Button onClick={() => handleCheckStudentId()} type="primary">
                Kiểm tra
              </Button>
            </Space.Compact>
          </Form.Item>
          {errorMess.studentId && <Alert style={{ marginTop: "10px" }} message={errorMess.studentId} type="error" />}
          {studentInfo.id && (
            <div>
              <p style={{ margin: 0, marginTop: "10px" }}>
                <b>Họ và tên:</b> {studentInfo.full_name}
              </p>
              <p>
                <b>Khoa:</b> {studentInfo.department}
              </p>
            </div>
          )}

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
                Chúng tôi sẽ lưu lại địa chỉ IP của bạn khi gửi phản hồi để phục vụ cho việc kiểm soát thông tin. Chúng
                tôi cam kết tuyệt đối bảo mật thông tin của bạn.{" "}
              </i>
            </div>
            <Title level={5} className="feedback-title">
              Bạn có thể kiểm tra phản hồi cũ của mình <Link to="/feedback/result">tại đây</Link>
            </Title>
          </Col>
        </Row>
      </Col>

      <Modal title="Xác nhận gửi" open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)}>
        <p>Bạn có chắc chắn muốn gửi biểu mẫu này không?</p>
      </Modal>
    </Row>
  );
};

export default FeedBackPage;
