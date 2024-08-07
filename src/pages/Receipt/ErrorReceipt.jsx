import { Card, Row, Col, Divider, Typography } from "antd";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

import PropTypes from "prop-types";

const ErrorReceipt = ({ errorData }) => {
  // component code here
  return (
    <Container style={{ marginTop: "20px", maxWidth: "700px", width: "100%" }}>
      <Card style={{ width: "100%", margin: "0 auto", padding: "20px", border: "1px solid #ccc" }}>
        <Title level={3} style={{ textAlign: "center", margin: "0" }}>
          Lỗi: {errorData}
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
};

ErrorReceipt.propTypes = {
  errorData: PropTypes.string.isRequired
};

export default ErrorReceipt;
