import React from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Button, Input, Modal, Table, Form, Row, Col, Select, AutoComplete, DatePicker } from "antd";
import { SearchOutlined, PlusOutlined, PrinterOutlined } from "@ant-design/icons";
import useDebounce from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getDeviceList } from "../DeviceApi";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode.react";

const studentData = [
  { studentCode: "SV001", studentName: "Nguyen Van A", class: "10A1" },
  { studentCode: "SV002", studentName: "Le Thi B", class: "10A2" }
  // Thêm dữ liệu sinh viên giả lập
];

const deviceData = [
  { id: "D001", name: "Laptop", total: 10 },
  { id: "D002", name: "Projector", total: 5 }
  // Thêm dữ liệu thiết bị giả lập
];

const EquipmentListPage = () => {
  const dispatch = useAppDispatch();
  const { device, isDevice } = useAppSelector((state) => state.device);

  const [searchText, setSearchText] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const [openSummaryModal, setOpenSummaryModal] = React.useState(false);
  const [formList, setFormList] = React.useState([{ id: uuidv4(), deviceId: "", quantity: "", quantityError: "" }]);
  const [studentInfo, setStudentInfo] = React.useState({ studentName: "", class: "" });
  const [studentCode, setStudentCode] = React.useState("");
  const [projectedReturnDate, setProjectedReturnDate] = React.useState(null);
  const [summaryData, setSummaryData] = React.useState(null);

  const searchTextDebounce = useDebounce(searchText, 300);

  const deviceColumns = [
    { title: "Mã thiết bị", dataIndex: "deviceCode", key: "deviceCode" },
    { title: "Thể loại", dataIndex: "deviceCategory", key: "deviceCategory" },
    { title: "Tên thiết bị", dataIndex: "deviceName", key: "deviceName" },
    { title: "Tổng số lượng", dataIndex: "totalQuantity", key: "totalQuantity" },
    { title: "Đã cho mượn", dataIndex: "borrowed", key: "borrowed" },
    { title: "Sẵn sàng", dataIndex: "available", key: "available" }
  ];

  const dataDevice = React.useMemo(() => {
    return device.map((item) => ({
      key: item.id || uuidv4(),
      deviceCode: item.id,
      deviceCategory: item.category,
      deviceName: item.name,
      totalQuantity: item.total,
      borrowed: item.total_used,
      available: item.total - item.total_used - item.total_maintenance
    }));
  }, [device]);

  React.useEffect(() => {
    if (!isDevice) {
      dispatch(getDeviceList());
    }
  }, [dispatch, isDevice]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleAddForm = () => {
    setFormList([...formList, { id: uuidv4(), deviceId: "", quantity: "", quantityError: "" }]);
  };

  const handleChange = (id, field, value) => {
    setFormList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (field === "quantity") {
            const device = deviceData.find((device) => device.id === item.deviceId);
            const availableQuantity = device ? device.total : 0;
            if (value > availableQuantity) {
              return { ...item, quantityError: `Số lượng không được vượt quá ${availableQuantity}` };
            }
          }
          return { ...item, [field]: value, quantityError: "" };
        }
        return item;
      })
    );
  };

  const handleStudentCodeChange = (value) => {
    setStudentCode(value);
    const student = studentData.find((student) => student.studentCode === value);
    if (student) {
      setStudentInfo({ studentName: student.studentName, class: student.class });
    } else {
      setStudentInfo({ studentName: "", class: "" });
    }
  };

  const handleSubmit = () => {
    // Prepare summary data
    const summary = {
      studentCode,
      studentName: studentInfo.studentName,
      class: studentInfo.class,
      devices: formList.map((item) => ({
        device: deviceData.find((device) => device.id === item.deviceId)?.name || "Unknown",
        quantity: item.quantity
      })),
      projectedReturnDate: projectedReturnDate ? projectedReturnDate.format("DD/MM/YYYY") : "Chưa xác định"
    };
    setSummaryData(summary);
    setOpenModal(false);
    setOpenSummaryModal(true);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const printContent = `
      <html>
        <head>
          <title>Phiếu Mượn</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { width: 100%; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .details { margin-bottom: 20px; }
            .details p { margin: 0; }
            .footer { margin-top: 20px; }
            .footer button { margin-right: 10px; }
            @media print {
              .footer { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Phiếu Mượn Thiết Bị</h2>
              <div>${QRCode.toDataURL(`Student Code: ${summaryData.studentCode}`)}</div>
            </div>
            <div class="details">
              <p><strong>Mã sinh viên:</strong> ${summaryData.studentCode}</p>
              <p><strong>Tên sinh viên:</strong> ${summaryData.studentName}</p>
              <p><strong>Lớp:</strong> ${summaryData.class}</p>
              <p><strong>Thời gian trả dự kiến:</strong> ${summaryData.projectedReturnDate}</p>
              <p><strong>Các thiết bị mượn:</strong></p>
              <ul>
                ${summaryData.devices.map((device) => `<li>${device.device} - ${device.quantity}</li>`).join("")}
              </ul>
            </div>
          </div>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const selectedDeviceIds = formList.map((formItem) => formItem.deviceId);

  return (
    <BaseLayout>
      <h1>Danh sách thiết bị</h1>
      <div style={{ marginBottom: 16, width: "100%", display: "flex", justifyContent: "space-between" }}>
        <Input
          placeholder="Tìm kiếm tên thiết bị"
          value={searchTextDebounce}
          onChange={handleSearch}
          style={{ width: 200, marginRight: 8 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenModal(true)}>
          Tạo yêu cầu mượn
        </Button>
      </div>
      <Table columns={deviceColumns} dataSource={dataDevice} rowKey="key" />

      {/* modal yêu cầu mượn */}
      <Modal title="Tạo yêu cầu mượn" visible={openModal} onOk={handleSubmit} onCancel={() => setOpenModal(false)}>
        <Form layout="vertical">
          <Form.Item label="Mã sinh viên">
            <AutoComplete
              options={studentData.map((student) => ({ value: student.studentCode }))}
              value={studentCode}
              onChange={handleStudentCodeChange}
            />
          </Form.Item>
          <p>Tên sinh viên: {studentInfo.studentName}</p>
          <p>Lớp: {studentInfo.class}</p>
          <Form.Item label="Thời gian dự kiến trả">
            <DatePicker onChange={(date) => setProjectedReturnDate(date)} />
          </Form.Item>
          {formList.map((formItem) => (
            <Row key={formItem.id} gutter={16}>
              <Col span={12}>
                <Form.Item label="Tên thiết bị">
                  <Select
                    value={formItem.deviceId}
                    onChange={(value) => handleChange(formItem.id, "deviceId", value)}
                    // disabled={selectedDeviceIds.includes(formItem.deviceId)}
                  >
                    {deviceData
                      .filter((device) => !selectedDeviceIds.includes(device.id) || device.id === formItem.deviceId)
                      .map((device) => (
                        <Select.Option key={device.id} value={device.id}>
                          {device.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số lượng"
                  validateStatus={formItem.quantityError ? "error" : ""}
                  help={formItem.quantityError}
                >
                  <Input
                    type="number"
                    value={formItem.quantity}
                    onChange={(e) => handleChange(formItem.id, "quantity", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
          ))}
        </Form>
        <Button type="dashed" onClick={handleAddForm} style={{ width: "100%", marginTop: 16 }}>
          Mượn thêm
        </Button>
      </Modal>

      {/* modal hiển thị thông tin phiếu mượn */}
      <Modal
        title="Thông tin phiếu mượn"
        visible={openSummaryModal}
        onOk={() => setOpenSummaryModal(false)}
        onCancel={() => setOpenSummaryModal(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
            In phiếu mượn
          </Button>,
          <Button key="close" onClick={() => setOpenSummaryModal(false)}>
            Đóng
          </Button>
        ]}
      >
        {summaryData && (
          <>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <QRCode value={`Student Code: ${summaryData.studentCode}`} />
            </div>
            <p>
              <strong>Mã sinh viên:</strong> {summaryData.studentCode}
            </p>
            <p>
              <strong>Tên sinh viên:</strong> {summaryData.studentName}
            </p>
            <p>
              <strong>Lớp:</strong> {summaryData.class}
            </p>
            <p>
              <strong>Thời gian trả dự kiến:</strong> {summaryData.projectedReturnDate}
            </p>
            <p>
              <strong>Các thiết bị mượn:</strong>
            </p>
            <ul>
              {summaryData.devices.map((device, index) => (
                <li key={index}>
                  {device.device} - {device.quantity}
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </BaseLayout>
  );
};

export default EquipmentListPage;
