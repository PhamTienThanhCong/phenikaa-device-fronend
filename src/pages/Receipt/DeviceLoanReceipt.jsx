import { Card, Typography, Row, Col, Divider } from "antd";
import QRCode from "qrcode.react";
import { Container } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { DEFAULT_DEVICE_LOAN } from "./ConstData";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { getDeviceLoanReceipt } from "./ReceiptApi";
import { DEFAULT_URL } from "@/constants/app";
import ErrorReceipt from "./ErrorReceipt";

const { Title, Text } = Typography;

const DeviceLoanReceipt = () => {
  // Dữ liệu hard code
  const dispatch = useAppDispatch();
  const [data, setData] = useState({ ...DEFAULT_DEVICE_LOAN });
  const [error, setError] = useState("");

  const { id } = useParams();

  const { name, devices, user, customer, note, returning_date, status, created_at } = data;

  const fetchData = useCallback(async () => {
    const res = await dispatch(getDeviceLoanReceipt({ id: id }));
    if (res.payload) {
      setData({ ...res.payload });
    } else {
      const res_2 = await dispatch(getDeviceLoanReceipt({ id: id }));
      if (res_2.payload) {
        setData({ ...res_2.payload });
      } else {
        setError("Không có dữ liệu mượn thiết bị");
      }
    }
  }, [dispatch, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Tạo dữ liệu cho mã QR
  const qrDataUrl = JSON.stringify(DEFAULT_URL + `/device-loan/${id}`);
  const qrDataFeedback = JSON.stringify(DEFAULT_URL + `/feedback`);

  if (error) {
    return <ErrorReceipt errorData={error} />;
  }

  return (
    <div className="receipt-container">
      <Container className="receipt-container-main" style={{ marginTop: "20px" }}>
        <Card style={{ width: "100%", margin: "0 auto", paddingTop: "0", border: "1px solid #ccc" }}>
          <Title level={3} style={{ textAlign: "center", marginTop: "0" }}>{`Biên Lai Mượn Thiết Bị`}</Title>
          <Divider />
          <Row className="receipt">
            <Col>
              <Text strong>Tên:</Text>
              <Text>{` ${name}`}</Text>
              <br />
              <Text strong>Trạng thái:</Text>
              <Text>{` ${status}`}</Text>
              <br />
              <Text strong>Ngày tạo:</Text>
              <Text>{` ${new Date(created_at).toLocaleDateString()}`}</Text>
              <br />
              <Text strong>Ngày trả:</Text>
              <Text>{` ${new Date(returning_date).toLocaleDateString()}`}</Text>
              <br />
              <Text strong>Ghi chú:</Text>
              <Text>{` ${note}`}</Text>
            </Col>
            <Col className="qr-code-custom">
              <QRCode value={qrDataUrl} size={75} />
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={24}>
              <Title level={4} style={{ marginTop: "0" }}>
                Bên Thuê Thiết Bị
              </Title>
              <Text strong>MSSV:</Text>
              <Text>{` ${customer.id}`}</Text>
              <br />
              <Text strong>Họ và Tên:</Text>
              <Text>{` ${customer.full_name}`}</Text>
              <br />
              <Text strong>Khoa:</Text>
              <Text>{` ${customer.department}`}</Text>
              <br />
              <Text strong>Số điện thoại:</Text>
              <Text>{` ${customer.phone_number}`}</Text>
              <br />
              <Text strong>Email:</Text>
              <Text>{` ${customer.email}`}</Text>
              <br />
              <Text strong>Địa chỉ:</Text>
              <Text>{` ${customer.address}`}</Text>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={24}>
              <Title level={4} style={{ marginTop: "0" }}>
                Bên Cho Thuê
              </Title>
              <Text strong>Người cho mượn:</Text>
              <Text>{` ${user.full_name}`}</Text>
              <br />
              <Text strong>Email:</Text>
              <Text>{` ${user.email}`}</Text>
              <br />
              <Text strong>Số điện thoại:</Text>
              <Text>{` ${user.profile.phone_number}`}</Text>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={24}>
              <Title level={4} style={{ marginTop: "0" }}>
                Chi Tiết Thiết Bị
              </Title>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>Tên Thiết Bị</th>
                    <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>Loại</th>
                    <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>Số Lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((item, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.device.name}</td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.device.category}</td>
                      <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={8} style={{ textAlign: "center" }}>
              <Text strong>Ký tên:</Text>
              <br />
              <Text>{user.full_name}</Text>
              <br />
              <Text>(Bên cho thuê)</Text>
            </Col>
            <Col span={8}></Col>
            <Col span={8} style={{ textAlign: "center" }}>
              <Text strong>Ký tên:</Text>
              <br />
              <Text>{customer.full_name}</Text>
              <br />
              <Text>(Bên thuê thiết bị)</Text>
            </Col>
          </Row>
          <Divider />
          <Col span={24} className="receipt">
            <Text strong>
              Nếu bạn có phản hồi hoặc cần trợ giúp, vui lòng liên hệ tại <Link to="/feedback">đây</Link>.
            </Text>
            <Col className="qr-code-custom">
              <QRCode value={qrDataFeedback} size={50} />
            </Col>
          </Col>
        </Card>
      </Container>
    </div>
  );
};

export default DeviceLoanReceipt;
