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
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import QRCode from "qrcode.react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addRoom, deleteRoom, editRoom, getRoomList } from "../RoomApi";

const { Title } = Typography;

const mockAddres = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "B1", "B2", "B3", "B4", "C", "D6"];

const mockStudentData = [
  { studentCode: "S001", studentName: "Nguyễn Văn A", studentClass: "Lớp 12A1" },
  { studentCode: "S002", studentName: "Trần Thị B", studentClass: "Lớp 12B1" }
  // Add more mock student data as needed
];

const RoomLoanListPage = () => {
  const dispatch = useAppDispatch();
  const { roomList, isGetRoom } = useAppSelector((state) => state.room);
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openRequestModalCreate, setOpenRequestModalCreate] = useState(false);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formList, setFormList] = useState([
    { id: uuidv4(), roomName: "", studentCode: "", studentName: "", studentClass: "" }
  ]);
  const [projectedReturnTime, setProjectedReturnTime] = useState(null);
  const [borrowDate, setBorrowDate] = useState(null);
  const [studentCode, setStudentCode] = useState("");
  const [studentInfo, setStudentInfo] = useState({ studentName: "", studentClass: "" });
  const [summary, setSummary] = useState(null); // Add summary state
  const printRef = useRef(null); // Add ref for printing
  const [isEdit, setIsEdit] = useState(null);

  const [formAddRoom] = Form.useForm();

  useEffect(() => {
    if (!isGetRoom) {
      dispatch(getRoomList());
    }
  }, [dispatch, isGetRoom]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setOpenModal(true);
  };

  const filteredRooms = roomList.filter((room) => room.room_id.toLowerCase().includes(searchText.toLowerCase()));

  const handleChange = (id, field, value) => {
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
    const student = mockStudentData.find((student) => student.studentCode === value);
    if (student) {
      setStudentInfo({
        studentName: student.studentName,
        studentClass: student.studentClass
      });
    } else {
      setStudentInfo({ studentName: "", studentClass: "" });
    }
  };

  const handleSubmit = () => {
    // Prepare summary data
    const summaryData = {
      borrowDate: borrowDate ? borrowDate.format("YYYY-MM-DD") : "Chưa xác định",
      rooms: formList.map((item) => ({
        room: item.roomName,
        studentCode: item.studentCode,
        studentName: item.studentName,
        studentClass: item.studentClass
      })),
      projectedReturnTime: projectedReturnTime
        ? `${projectedReturnTime[0].format("HH:mm")} - ${projectedReturnTime[1].format("HH:mm")}`
        : "Chưa xác định"
    };
    setSummary(summaryData);
    setSummaryModalVisible(true);
    setOpenRequestModalCreate(false);
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
    setFormList((prev) => [...prev, { id: uuidv4(), roomName: "", facilityName: "", quantity: "" }]);
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
    let details = selectedRoom.detail.map((item, index) => {
      return { id: uuidv4(), facilityName: item.name, quantity: item.total };
    });

    // convert to object
    let detailsObj = {};
    details.forEach((item) => {
      detailsObj[item.id] = item;
    });

    formAddRoom.setFieldsValue({
      id: selectedRoom.id,
      roomName: selectedRoom.room_id,
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
        room_id: data["roomName"],
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
        room_id: data["roomName"],
        category: data["categopry"],
        house_name: data["position"],
        manager: data["managementUnit"],
        note: data["notes"],
        detail: details
      };
      await dispatch(addRoom(dataPayload));
    }

    formAddRoom.resetFields();
    setFormList([{ id: uuidv4(), roomName: "", studentCode: "", studentName: "", studentClass: "" }]);

    onCloseModalCreateRoom();
    setSelectedRoom(null);
  };

  return (
    <BaseLayout>
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
            icon={<PlusOutlined />}
            onClick={() => setOpenRequestModal(true)}
            style={{
              marginRight: 8
            }}
          >
            Yêu cầu mượn phòng
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenRequestModalCreate(true)}>
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
          <Button key="edit" type="primary" onClick={() => onDeleteRoom()}>
            Xoa
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
          <Form.Item label="Tên sinh viên">
            <AutoComplete
              options={mockStudentData.map((student) => ({ value: student.studentCode }))}
              value={studentCode}
              onChange={handleStudentCodeChange}
            />
          </Form.Item>
          <p>Tên sinh viên: {studentInfo.studentName}</p>
          <p>Lớp: {studentInfo.studentClass}</p>
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
                    value={formItem.roomName}
                    onChange={(value) => handleChange(formItem.id, "roomName", value)}
                    options={roomList.map((room) => ({ value: room.roomName, label: room.roomName }))}
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
          <Button key="close" onClick={() => setSummaryModalVisible(false)}>
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
                <QRCode value={JSON.stringify(summary)} size={150} />
              </div>
              <Table
                dataSource={summary.rooms}
                columns={[
                  { title: "Tên phòng", dataIndex: "room", key: "room" },
                  { title: "Mã sinh viên", dataIndex: "studentCode", key: "studentCode" },
                  { title: "Tên sinh viên", dataIndex: "studentName", key: "studentName" },
                  { title: "Lớp", dataIndex: "studentClass", key: "studentClass" }
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
            name="roomName"
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
                <Select placeholder="">
                  <Select.Option value="1">Active</Select.Option>
                  <Select.Option value="0">inActive</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Hoạt sử dụng" name="is_using">
                <Select placeholder="">
                  <Select.Option value="1">Active</Select.Option>
                  <Select.Option value="0">inActive</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="bảo trì" name="is_maintenance">
                <Select placeholder="">
                  <Select.Option value="1">Active</Select.Option>
                  <Select.Option value="0">inActive</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {/* Example form list */}
          {formList.map((formItem) => (
            <Row key={formItem.id} gutter={12}>
              <Col span={12}>
                <Form.Item
                  label="Tên cơ sở"
                  name={["details", formItem.id, "facilityName"]}
                  rules={[{ required: true, message: "Vui lòng nhập tên cơ sở!" }]}
                >
                  <Input
                    value={formItem.facilityName}
                    onChange={(e) => handleChange(formItem.id, "facilityName", e.target.value)}
                    placeholder="Nhập tên cơ sở"
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
