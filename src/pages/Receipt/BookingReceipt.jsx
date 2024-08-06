import { Card, Typography, Row, Col, Divider } from "antd";
import QRCode from "qrcode.react";
import { Container } from "@mui/material";
import "./Receipt.scss";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_BOOKING } from "./ConstData";
import { useAppDispatch } from "@/app/hooks";
import { getRoomBookingReceipt } from "./ReceiptApi";
import { Link, useParams } from "react-router-dom";
import { formatDateTime, formatDate } from "./ReceiptUtils";

const { Title, Text } = Typography;

const BookingReceipt = () => {
  // Dữ liệu hard code
  const dispatch = useAppDispatch();
  const [data, setData] = useState({ ...DEFAULT_BOOKING });
  const [error, setError] = useState("");
  const { id } = useParams();

  const { name, room, user, customer, date_booking, start_time, end_time, note, status, created_at, total_customer } =
    data;

  const fetchData = useCallback(async () => {
    const res = await dispatch(getRoomBookingReceipt({ id: id }));
    if (res.payload) {
      setData({ ...res.payload });
    } else {
      const res_2 = await dispatch(getRoomBookingReceipt({ id: id }));
      if (res_2.payload) {
        setData({ ...res_2.payload });
      } else {
        setError("Không có dữ liệu đặt phòng");
      }
    }
  }, [dispatch, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Tạo dữ liệu cho mã QR
  const qrData = JSON.stringify({
    roomName: room.room_id,
    bookingDate: date_booking,
    startTime: start_time,
    endTime: end_time
  });

  if (error) {
    return (
      <Container style={{ marginTop: "20px" }}>
        <Card style={{ width: "100%", margin: "0 auto", padding: "20px", border: "1px solid #ccc" }}>
          <Title level={3} style={{ textAlign: "center", margin: "0" }}>
            Lỗi: {error}
          </Title>
          <Divider />
          <Row>
            <Col span={24}>
              <Text strong>
                Thông tin không tồn tại. Nếu bạn có phản hồi hoặc cần trợ giúp, vui lòng liên hệ tại{" "}
                <Link to="/feedback">đây</Link>.
              </Text>
            </Col>
          </Row>
        </Card>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: "20px" }}>
      <Card style={{ width: "100%", margin: "0 auto", paddingTop: "0", border: "1px solid #ccc" }}>
        <Title level={3} style={{ textAlign: "center", marginTop: "0" }}>{`Biên Lai Mượn Phòng ${room.room_id}`}</Title>
        <Divider />
        <Row gutter={16} className="receipt">
          <Col>
            <Text strong>Tên:</Text>
            <Text>{` ${name}`}</Text>
            <br />
            <Text strong>Trạng thái:</Text>
            <Text>{` ${status}`}</Text>
            <br />
            <Text strong>Ngày tạo:</Text>
            <Text>{` ${formatDateTime(created_at)}`}</Text>
            <br />
            <Text strong>Ngày mượn:</Text>
            <Text>{` ${formatDate(date_booking)}`}</Text>
            <br />
            <Text strong>Số người sử dụng:</Text>
            <Text>{` ${total_customer} người`}</Text>
          </Col>
          <Col className="qr-code-custom">
            <QRCode value={qrData} size={100} />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Title level={4} style={{ marginTop: "0" }}>
              Bên Thuê Phòng
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
              Chi Tiết Phòng
            </Title>
            <Text strong>Tên tòa nhà:</Text>
            <Text>{` ${room.house_name}`}</Text>
            <br />
            <Text strong>Tên phòng:</Text>
            <Text>{` ${room.room_id}`}</Text>
            <br />
            <Text strong>Loại phòng:</Text>
            <Text>{` ${room.category}`}</Text>
            <br />
            <Text strong>Tài nguyên:</Text>
            <ul>
              {room.detail.map((item, index) => (
                <li key={index}>{`${item.name}: ${item.total}`}</li>
              ))}
            </ul>
            <Text strong>Ghi chú:</Text>
            <Text>{` ${room.note}`}</Text>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Text strong>Ghi chú:</Text>
            <Text>{` ${note}`}</Text>
            <br />
            <Text strong>Trạng thái:</Text>
            <Text>{` ${status}`}</Text>
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
            <Text>(Bên thuê phòng)</Text>
          </Col>
        </Row>

        <Divider />
        <Col span={24} className="receipt">
          <Text strong>
            Nếu bạn có phản hồi hoặc cần trợ giúp, vui lòng liên hệ tại <Link to="/feedback">đây</Link>.
          </Text>
          <Col className="qr-code-custom">
            <QRCode value={qrData} size={50} />
          </Col>
        </Col>
      </Card>
    </Container>
  );
};

export default BookingReceipt;
