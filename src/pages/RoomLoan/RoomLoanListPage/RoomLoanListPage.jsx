import React, { useState, useEffect, useRef } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import {
  Button,
  Input,
  Modal,
  Table,
  Form,
  Row,
  Col,
  Select,
  AutoComplete,
  TimePicker,
  DatePicker,
  Typography
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode.react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addRoom, deleteRoom, editRoom, getRoomList } from "../RoomApi";
import { clearError } from "../RoomSlice";
import {
  getRoomBookingList,
  addRoomBooking,
  editRoomBooking,
  deleteRoomBooking,
  getRoomBookingDetail
} from "../RoomApi";
import { getCustomer } from "@/pages/manageCutome/CustomerAPI";
import { use } from "echarts";
import { getUserData } from "@/features/auth/authApi";

const { Title } = Typography;

const mockAddres = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "B1", "B2", "B3", "B4", "C", "D6"];

const RoomLoanListPage = () => {
  const dispatch = useAppDispatch();
  const { roomList, isGetRoom } = useAppSelector((state) => state.room);
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openRequestModalCreate, setOpenRequestModalCreate] = useState(false);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  // const [userList, setUserList] = useState([]);
  const [formList, setFormList] = useState([
    { id: uuidv4(), room_id: "", studentCode: "", studentName: "", studentClass: "" }
  ]);
  const [projectedReturnTime, setProjectedReturnTime] = useState(null);
  const [borrowDate, setBorrowDate] = useState(null);
  const [studentCode, setStudentCode] = useState("");
  const [studentInfo, setStudentInfo] = useState({ studentName: "", studentClass: "", studentCode: "" });
  const [summary, setSummary] = useState(null); // Add summary state
  const printRef = useRef(null); // Add ref for printing
  // const [isEdit, setIsEdit] = useState(null);

  const [formAddRoom] = Form.useForm();
  const { isCustomer, customer } = useAppSelector((state) => state.customer);

  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const error = useAppSelector((state) => state.room.error);
  const [api, contextHolder] = notification.useNotification();
  const notificationMessage = (type, message) => {
    api[type]({
      message: type == "error" ? "Lỗi" : "Thông báo",
      description: message
    });
  };
  useEffect(() => {
    if (!isGetRoom) {
      dispatch(getRoomList());
    }
  }, [dispatch, isGetRoom]);

  useEffect(() => {
    if (error) {
      notificationMessage("error", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    //set user list
    if (!isCustomer) {
      dispatch(getCustomer());
    }
  }, [dispatch, isCustomer]);
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setOpenModal(true);
  };

  const filteredRooms = roomList.filter((room) => room.room_id.toLowerCase().includes(searchText.toLowerCase()));

  const handleChange = (id, field, value) => {
    console.log(id, field, value);
    setFormList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleStudentCodeChange = (value) => {
    setStudentCode(value);
    const student = customer.find((student) => student.id === value);
    if (student) {
      setStudentInfo({
        studentName: student.full_name,
        studentClass: student.department,
        studentCode: student.id
      });
    } else {
      setStudentInfo({ studentName: "", studentClass: "", studentCode: "" });
    }
  };

  const handleSubmit = async () => {
    const summaryData = {
      name: `Phòng ${formList[0].room_id}`,
      room_id: formList[0].room_id,
      user_id: currentUser.id,
      date_booking: borrowDate ? borrowDate.format("YYYY-MM-DD") : "Chưa xác định",
      start_time: projectedReturnTime ? projectedReturnTime[0].format("HH:mm:ss") : "Chưa xác định",
      end_time: projectedReturnTime ? projectedReturnTime[1].format("HH:mm:ss") : "Chưa xác định",
      note: "Chưa xác định",
      total_customer: 50,
      customer_id: getCustomerId(studentInfo.studentCode)
    };
    console.log(111111111111, summaryData, formList);
    await dispatch(addRoomBooking(summaryData));
    setSummary(summaryData);
    // setSummaryModalVisible(true);
    setOpenRequestModal(false);
  };

  const getCustomerId = (id) => {
    const customerinfo = customer.find((user) => user.id === id);
    // console.log("customer", customerinfo, card_id);
    return customer ? customerinfo.id : null;
  };
  const handlePrint = () => {
    window.print();
  };

  const columns = [
    { title: "Tên phòng", dataIndex: "room_id", key: "room_id" },
    { title: "Vị trí", dataIndex: "house_name", key: "house_name" },
    { title: "Đơn vị quản lý", dataIndex: "manager", key: "manager" },
    {
      title: "Trạng thái",
      key: "cc",
      render: (text, record) => {
        let status = "Hoạt Động";
        if (record.is_active === 0) {
          status = "Không hoạt động";
        } else if (record.is_using) {
          status = "Đang sử dụng";
        } else if (record.is_maintenance) {
          status = "Bảo trì";
        }
        return status;
      }
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => <Button onClick={() => handleViewDetails(record)}>Xem chi tiết</Button>
    }
  ];

  const renderDetails = (data = []) => {
    return data.map((item, index) => (
      <li key={index}>
        <strong>{item.name}:</strong> {item.total}
      </li>
    ));
  };
  const handleAddDetail = () => {
    setFormList((prev) => [...prev, { id: uuidv4(), room_id: "", facilityName: "", quantity: "" }]);
  };

  const onCloseModalDetailRoom = () => {
    setOpenModal(false);
    setSelectedRoom(null);
  };

  const onCloseModalCreateRoom = () => {
    setOpenRequestModalCreate(false);
    setSelectedRoom(null);
  };

  const onEidtRoom = () => {
    let details = selectedRoom.detail.map((item) => {
      return { id: uuidv4(), facilityName: item.name, quantity: item.total };
    });

    // convert to object
    let detailsObj = {};
    details.forEach((item) => {
      detailsObj[item.id] = item;
    });

    formAddRoom.setFieldsValue({
      id: selectedRoom.id,
      room_id: selectedRoom.room_id,
      position: selectedRoom.house_name,
      categopry: selectedRoom.category,
      managementUnit: selectedRoom.manager,
      notes: selectedRoom.note,
      details: detailsObj
    });

    setFormList(details);

    setOpenModal(false);
    setOpenRequestModalCreate(true);
  };

  const onDeleteRoom = async () => {
    await dispatch(deleteRoom({ room_id: selectedRoom.room_id }));
    await dispatch(getRoomList());
    setOpenModal(false);
    setSelectedRoom(null);
  };

  const handleAddRoom = async () => {
    const data = await formAddRoom.validateFields();

    let key_details = Object.keys(data["details"]);
    let details = [];
    key_details.forEach((key) => {
      details.push({
        name: data["details"][key]["facilityName"],
        total: data["details"][key]["quantity"]
      });
    });

    if (selectedRoom) {
      console.log(selectedRoom);
      const dataPayload = {
        room_id: data["room_id"],
        category: data["categopry"],
        house_name: data["position"],
        manager: data["managementUnit"],
        note: data["notes"],
        detail: details,
        is_active: data["is_active"] == 1 ? true : false,
        is_using: data["is_using"] == 1 ? true : false,
        is_maintenance: data["is_maintenance"] == 1 ? true : false
      };
      await dispatch(editRoom(dataPayload));
      await dispatch(getRoomList());
    } else {
      const dataPayload = {
        room_id: data["room_id"],
        category: data["categopry"],
        house_name: data["position"],
        manager: data["managementUnit"],
        note: data["notes"],
        detail: details
      };
      await dispatch(addRoom(dataPayload));
    }

    formAddRoom.resetFields();
    setFormList([{ id: uuidv4(), room_id: "", studentCode: "", studentName: "", studentClass: "" }]);

    onCloseModalCreateRoom();
    setSelectedRoom(null);
  };

  return (
    <BaseLayout BaseLayout>
      {contextHolder}
      <Title level={1}>Danh sách phòng</Title>
      <div style={{ marginBottom: 16, width: "100%", display: "flex", justifyContent: "space-between" }}>
        <Input
          placeholder="Tìm kiếm tên phòng"
          value={searchText}
          onChange={handleSearch}
          style={{ width: 300, marginRight: 8 }}
          prefix={<SearchOutlined />}
        />
        <div>
          <Button
            type="primary"
            style={{
              marginRight: 8,

              color: "white",
              backgroundColor: "#F26526"
            }}
            icon={<PlusOutlined />}
            onClick={() => setOpenRequestModal(true)}
          >
            Yêu cầu mượn phòng
          </Button>
          <Button
            type="primary"
            style={{ color: "white", backgroundColor: "#F26526" }}
            icon={<PlusOutlined />}
            onClick={() => setOpenRequestModalCreate(true)}
          >
            Yêu cầu tạo phòng
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredRooms} rowKey="id" />

      {/* Modal to view room details */}
      <Modal
        title="Chi tiết phòng"
        visible={openModal}
        onCancel={() => onCloseModalDetailRoom()}
        footer={[
          <Button
            key="edit"
            type="text"
            onClick={() => onDeleteRoom()}
            style={{ color: "white", backgroundColor: "red" }}
          >
            Xoá
          </Button>,
          <Button key="edit" type="primary" onClick={() => onEidtRoom()}>
            Chỉnh sửa
          </Button>,
          <Button key="close" onClick={() => onCloseModalDetailRoom()}>
            Đóng
          </Button>
        ]}
      >
        {selectedRoom && (
          <>
            <p>
              <strong>Tên phòng:</strong> {selectedRoom.room_id}
            </p>
            <p>
              <strong>Vị trí:</strong> {selectedRoom.house_name}
            </p>
            <p>
              <strong>Đơn vị quản lý:</strong> {selectedRoom.manager}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {selectedRoom.is_active
                ? selectedRoom.is_using
                  ? "Đang sử dụng"
                  : selectedRoom.is_maintenance
                    ? "Bảo trì"
                    : "Hoạt động"
                : "Không hoạt động"}
            </p>
            <div>
              <strong>Chi tiết:</strong>
              <ul style={{ marginTop: 0 }}>{renderDetails(selectedRoom.detail)}</ul>
            </div>
            <p>
              <strong>Note:</strong> {selectedRoom.note}
            </p>
          </>
        )}
      </Modal>

      {/* Modal for requesting a new room */}
      <Modal
        title="Yêu cầu mượn phòng"
        visible={openRequestModal}
        onOk={handleSubmit}
        onCancel={() => setOpenRequestModal(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Mã sinh viên">
            <AutoComplete
              options={customer.map((student) => ({ value: student.id }))}
              onChange={handleStudentCodeChange}
              filterOption={(inputValue, option) => option.value.toString().indexOf(inputValue) !== -1}
            />
          </Form.Item>
          <p>Tên sinh viên: {studentInfo.studentName}</p>
          <p>Khoa: {studentInfo.studentClass}</p>
          <Form.Item label="Ngày mượn phòng">
            <DatePicker style={{ width: "100%" }} onChange={(date) => setBorrowDate(date)} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Giờ dự kiến trả phòng">
            <TimePicker.RangePicker
              style={{ width: "100%", height: 40 }}
              onChange={(time) => setProjectedReturnTime(time)}
              format="HH:mm"
            />
          </Form.Item>
          {formList.map((formItem) => (
            <Row key={formItem.id} gutter={12}>
              <Col span={24}>
                <Form.Item label="Tên phòng">
                  <Select
                    width="100%"
                    value={formItem.room_id}
                    onChange={(value) => handleChange(formItem.id, "room_id", value)}
                    options={roomList.map((room) => ({ value: room.room_id, label: room.room_id }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal>

      {/* Modal for displaying summary */}
      <Modal
        title="Thông tin mượn phòng"
        visible={summaryModalVisible}
        onCancel={() => setSummaryModalVisible(false)}
        footer={[
          <Button key="print" onClick={handlePrint}>
            In
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setSummaryModalVisible(false);
            }}
          >
            Đóng
          </Button>
        ]}
      >
        <div ref={printRef}>
          {summary && (
            <>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <QRCode value={`https://phenikaa-uni.top/booking-receipt/${summary.id}`} size={150} />
              </div>
              <Table
                dataSource={summary.rooms}
                columns={[
                  { title: "Tên phòng", dataIndex: "room_id", key: "room" },
                  { title: "Mã sinh viên", dataIndex: "studentCode", key: "studentCode" },
                  { title: "Tên sinh viên", dataIndex: "studentName", key: "studentName" }
                ]}
                rowKey="studentCode"
                pagination={false}
              />
              <p>
                <strong>Ngày mượn phòng:</strong> {summary.borrowDate}
              </p>
              <p>
                <strong>Giờ dự kiến trả phòng:</strong> {summary.projectedReturnTime}
              </p>
            </>
          )}
        </div>
      </Modal>

      {/* modal thêm thêm phòng */}
      <Modal
        title={selectedRoom ? "edit" : "Yêu cầu tạo phòng"}
        visible={openRequestModalCreate}
        onOk={handleAddRoom}
        onCancel={() => onCloseModalCreateRoom()}
      >
        <Form
          form={formAddRoom} // Pass form instance here
          layout="vertical"
        >
          <Form.Item label="Vị trí" name="position" rules={[{ required: true, message: "Vui lòng nhập vị trí!" }]}>
            <AutoComplete options={mockAddres.map((address) => ({ value: address }))} placeholder="Vị trí phòng" />
          </Form.Item>
          <Form.Item
            label="Tên phòng"
            name="room_id"
            readOnly={selectedRoom ? true : false}
            rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
          >
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>
          <Form.Item
            label="Công năng"
            name="categopry"
            rules={[{ required: true, message: "Vui lòng nhập công năng!" }]}
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>
          <Form.Item
            label="Đơn vị quản lý"
            name="managementUnit"
            rules={[{ required: true, message: "Vui lòng nhập đơn vị quản lý!" }]}
          >
            <Input placeholder="Nhập đơn vị quản lý" />
          </Form.Item>

          {/* select option */}
          {selectedRoom && (
            <>
              {/* select is_active, is_using, is_maintenance */}
              <Form.Item label="Hoạt động" name="is_active">
                <Select lect placeholder="">
                  <Select.Option value="1">Đang hoạt động</Select.Option>
                  <Select.Option value="0">Không hoạt động</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Có thể sử dụng" name="is_using">
                <Select placeholder="">
                  <Select.Option value="1">Bình thường</Select.Option>
                  <Select.Option value="0">Bảo trì</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="bảo trì" name="is_maintenance">
                <Select placeholder="">
                  <Select.Option value="1">Sẵn sàng</Select.Option>
                  <Select.Option value="0">Bảo trì</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {/* Example form list */}
          {formList.map((formItem) => (
            <Row key={formItem.id} gutter={12}>
              <Col span={12}>
                <Form.Item
                  label="Tên cơ sở vật chất"
                  name={["details", formItem.id, "facilityName"]}
                  rules={[{ required: true, message: "Vui lòng nhập tên cơ sở vật chất!" }]}
                >
                  <Input
                    value={formItem.facilityName}
                    onChange={(e) => handleChange(formItem.id, "facilityName", e.target.value)}
                    placeholder="Nhập tên cơ sở vật chất"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số lượng"
                  name={["details", formItem.id, "quantity"]}
                  rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
                >
                  <Input
                    type="number"
                    value={formItem.quantity}
                    onChange={(e) => handleChange(formItem.id, "quantity", e.target.value)}
                    placeholder="Nhập số lượng"
                  />
                </Form.Item>
              </Col>
            </Row>
          ))}
          <Button type="dashed" onClick={handleAddDetail} icon={<PlusOutlined />}>
            Thêm chi tiết
          </Button>

          <Form.Item label="Ghi chú" name="notes">
            <Input.TextArea placeholder="Nhập ghi chú" />
          </Form.Item>
        </Form>
      </Modal>
    </BaseLayout>
  );
};

export default RoomLoanListPage;
