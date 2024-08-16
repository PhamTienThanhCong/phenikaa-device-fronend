import BaseLayout from "@/features/layout/BaseLayout";

import { Card, Col, Row, Table, Typography } from "antd";
import { AppstoreOutlined, CheckOutlined, ExclamationCircleOutlined, FormOutlined } from "@ant-design/icons";

import DounutChart from "@/components/chart/DounutChart";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getDeviceList, getRoomList } from "./dashboardApi";
import { useEffect } from "react";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { deviceList, isGetAll, isGetRoom, roomList } = useAppSelector((state) => state.dashboard);
  const { Title } = Typography;

  useEffect(() => {
    if (!isGetAll) {
      dispatch(getDeviceList());
    }
  }, [dispatch, isGetAll]);

  useEffect(() => {
    if (!isGetRoom) {
      dispatch(getRoomList());
    }
  }, [dispatch, isGetRoom]);

  const totalDevices = deviceList.reduce((acc, device) => acc + device.total, 0);
  const total_maintenance = deviceList.reduce((acc, device) => acc + device.total_maintenance, 0);
  const total_use = deviceList.reduce((acc, device) => acc + device.total_used, 0);
  const total_ready = totalDevices - total_use - total_maintenance;
  const columns = [
    {
      title: "Vị trí",
      dataIndex: "house_name",
      key: "house_name",
      width: "15%"
    },
    {
      title: "Mã phòng",
      dataIndex: "room_id",
      key: "room_id",
      width: "15%"
    },
    {
      title: "Quản lý",
      dataIndex: "manager",
      key: "manager",
      ellipsis: true
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      // nội dung nhiều quá thì ẩn đi
      ellipsis: true
    }
  ];
  const count = [
    {
      today: "Tổng số thiết bị",
      title: totalDevices,
      icon: <AppstoreOutlined color="white" />,
      bnb: "bnb2"
    },
    {
      today: "Đã cho mượn",
      title: total_use,
      icon: <FormOutlined />,
      bnb: "bnb2"
    },
    {
      today: "Sẵn sàng",
      title: total_ready,
      icon: <CheckOutlined />,
      bnb: "redtext"
    },
    {
      today: "Đang bảo trì",
      title: total_maintenance,
      icon: <ExclamationCircleOutlined />,
      bnb: "bnb2"
    }
  ];

  const colors = ["#69c0ff", "#ffc069", "#95de64", "#ff7875", "#d3adf7", "#ff85c0"];
  console.log(11111111, roomList);

  const availableRooms = roomList.filter((room) => room.is_active && !room.is_maintenance && !room.is_using);

  const chartData = {
    data: [total_use, total_ready, total_maintenance]
  };

  return (
    <BaseLayout>
      <>
        <div className="layout-content">
          <Row className="rowgap-vbox" gutter={[24, 0]}>
            {count.map((c, index) => (
              <Col key={index} xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
                <Card
                  bordered={false}
                  className="criclebox"
                  style={{ backgroundColor: colors[index % colors.length] }}
                  hoverable
                >
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={18}>
                        <span style={{ color: "#fff", fontSize: "20px" }}>{c.today}</span>

                        <Title level={3} style={{ color: "#fff" }}>
                          {c.title} <small className={c.bnb}>{c.persent}</small>
                        </Title>
                      </Col>
                      <Col xs={6}>
                        <div className="icon-box" style={{ backgroundColor: colors[index % colors.length] }}>
                          {c.icon}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[1, 1]}>
            <Col xs={24} sm={24} md={15} lg={15} xl={15} className="mb-24 mr-24">
              <Card bordered={false} className="criclebox h-full">
                <h3>
                  Danh sách phòng sẵn sàng cho mượn <small>(Chưa sử dụng)</small>
                </h3>
                <Table
                  columns={columns}
                  dataSource={availableRooms}
                  rowKey="room_id"
                  // phân trang 5 phần tử 1 trang
                  pagination={{ pageSize: 5 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-24">
              <Card
                bordered={false}
                className="criclebox h-full"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <DounutChart chartData={chartData} />
              </Card>
            </Col>
          </Row>
        </div>
      </>
    </BaseLayout>
  );
};

export default DashboardPage;
