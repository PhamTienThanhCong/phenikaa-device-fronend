import React from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Button, Input, Modal, Table, Form, Row, Col, Select, AutoComplete, DatePicker } from "antd";
import { SearchOutlined, PlusOutlined, PrinterOutlined } from "@ant-design/icons";
import useDebounce from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { borrowDevice, getDeviceList } from "../DeviceApi";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode.react";
import { getCustomer } from "@/pages/manageCutome/CustomerAPI";

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
  const { isCustomer, customer } = useAppSelector((state) => state.customer);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

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

  React.useEffect(() => {
    if (!isCustomer) {
      dispatch(getCustomer());
    }
  }, [dispatch, isCustomer]);

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
            const device = dataDevice.find((device) => device.deviceCode === item.deviceId);
            const availableQuantity = device ? device.totalQuantity : 0;
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
    const student = customer.find((student) => student.card_id === value);
    if (student) {
      setStudentInfo({
        id: student.id,
        studentName: student.full_name,
        studentClass: student.department,
        studentCode: student.card_id
      });
    } else {
      setStudentInfo({ id: "", studentName: "", studentClass: "", studentCode: "" });
    }
  };

  const handleSubmit = async () => {
    // Prepare summary data
    const summary = {
      name: `Phiếu mượn thiết bị - ${studentInfo.studentName}`,
      customer_id: studentInfo.id,
      user_id: currentUser.id,
      devices: formList.map((item) => ({
        device_id: item.deviceId,
        quantity: item.quantity
      })),
      returning_date: projectedReturnDate.format("YYYY-MM-DD hh:mm:ss"),
      note: "Không có note :))"
    };

    setSummaryData(summary);
    await dispatch(borrowDevice(summary));
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

  const handleDeleteForm = (id) => {
    setFormList((prev) => prev.filter((item) => item.id !== id));
  };

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
        <Button
          type="primary"
          style={{ color: "white", background: "#F26526" }}
          icon={<PlusOutlined />}
          onClick={() => setOpenModal(true)}
        >
          Tạo yêu cầu mượn
        </Button>
      </div>
      <Table columns={deviceColumns} dataSource={dataDevice} rowKey="key" />

      {/* modal yêu cầu mượn */}
      <Modal title="Tạo yêu cầu mượn" visible={openModal} onOk={handleSubmit} onCancel={() => setOpenModal(false)}>
        <Form layout="vertical">
          <Form.Item label="Mã sinh viên">
            <AutoComplete
              options={customer.map((student) => ({ value: student.card_id }))}
              filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              onChange={handleStudentCodeChange}
            />
          </Form.Item>
          <p>Tên sinh viên: {studentInfo.studentName}</p>
          <p>Khoa: {studentInfo.studentClass}</p>
          <Form.Item label="Thời gian dự kiến trả">
            <DatePicker onChange={(date) => setProjectedReturnDate(date)} />
          </Form.Item>
          {formList.map((formItem) => (
            <Row
              key={formItem.id}
              gutter={16}
              style={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <Col span={11}>
                <Form.Item label="Tên thiết bị">
                  <Select
                    value={formItem.deviceId}
                    onChange={(value) => handleChange(formItem.id, "deviceId", value)}
                    // disabled={selectedDeviceIds.includes(formItem.deviceId)}
                  >
                    {dataDevice
                      .filter(
                        (device) =>
                          !selectedDeviceIds.includes(device.deviceCode) || device.deviceCode === formItem.deviceId
                      )
                      .map((device) => (
                        <Select.Option key={device.deviceCode} value={device.deviceCode}>
                          {device.deviceName}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="Số lượng"
                  validateStatus={formItem.quantityError ? "error" : ""}
                  help={formItem.quantityError}
                >
                  <Input
                    style={{ height: "auto" }}
                    type="number"
                    value={formItem.quantity}
                    onChange={(e) => handleChange(formItem.id, "quantity", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={1} style={{ textAlign: "center", paddingRight: "30px" }}>
                <Button type="link" style={{ color: "red" }} onClick={() => handleDeleteForm(formItem.id)}>
                  Xoá
                </Button>
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
