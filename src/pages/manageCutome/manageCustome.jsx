import React, { useState } from "react";
import { Table, Tabs, Input, Avatar, Layout } from "antd";
import BaseLayout from "@/features/layout/BaseLayout";
import { SearchOutlined } from "@ant-design/icons";
import "./manageCustome.scss";

const { TabPane } = Tabs;
const { Content } = Layout;

const studentColumns = [
  {
    title: "Avatar",
    dataIndex: "avatar",
    key: "avatar",
    render: (avatar) => <Avatar src={avatar} />
  },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Ngày sinh",
    dataIndex: "dob",
    key: "dob"
  },
  {
    title: "Mã sinh viên",
    dataIndex: "studentId",
    key: "studentId"
  },
  {
    title: "Lớp",
    dataIndex: "class",
    key: "class"
  },
  {
    title: "Khoa",
    dataIndex: "department",
    key: "department"
  }
];

const teacherColumns = [
  {
    title: "Avatar",
    dataIndex: "avatar",
    key: "avatar",
    render: (avatar) => <Avatar src={avatar} />
  },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Ngày sinh",
    dataIndex: "dob",
    key: "dob"
  },
  {
    title: "Khoa",
    dataIndex: "department",
    key: "department"
  },
  {
    title: "Mã giảng viên",
    dataIndex: "teacherId",
    key: "teacherId"
  }
];

const students = [
  {
    key: "1",
    avatar: "https://via.placeholder.com/150",
    name: "Nguyễn Văn A",
    dob: "01-01-2000",
    studentId: "SV001",
    class: "CNTT1",
    department: "Công nghệ thông tin"
  },
  {
    key: "2",
    avatar: "https://via.placeholder.com/150",
    name: "Trần Thị B",
    dob: "02-02-2001",
    studentId: "SV002",
    class: "CNTT2",
    department: "Công nghệ thông tin"
  },
  {
    key: "3",
    avatar: "https://via.placeholder.com/150",
    name: "Lê Văn C",
    dob: "03-03-2002",
    studentId: "SV003",
    class: "CNTT3",
    department: "Công nghệ thông tin"
  }
  // Thêm dữ liệu sinh viên khác ở đây
];

const teachers = [
  {
    key: "1",
    avatar: "https://via.placeholder.com/150",
    name: "Trần Văn B",
    dob: "05-03-1980",
    department: "Công nghệ thông tin",
    teacherId: "GV001"
  },
  {
    key: "2",
    avatar: "https://via.placeholder.com/150",
    name: "Nguyễn Thị C",
    dob: "07-05-1985",
    department: "Công nghệ phần mềm",
    teacherId: "GV002"
  },
  {
    key: "3",
    avatar: "https://via.placeholder.com/150",
    name: "Phạm Văn D",
    dob: "10-10-1975",
    department: "Hệ thống thông tin",
    teacherId: "GV003"
  }
  // Thêm dữ liệu giảng viên khác ở đây
];

const ManageCustome = () => {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchText.toLowerCase()));

  const filteredTeachers = teachers.filter((teacher) => teacher.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <BaseLayout>
      <Content style={{ padding: "24px", margin: 0, minHeight: 280 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Sinh viên" key="1">
            <Input
              placeholder="Tìm kiếm"
              value={searchText}
              onChange={handleSearchChange}
              style={{ marginBottom: "20px", width: "100%" }}
              suffix={<SearchOutlined />}
            />
            <Table
              columns={studentColumns}
              dataSource={filteredStudents}
              scroll={{ x: "max-content" }} // responsive scroll
            />
          </TabPane>
          <TabPane tab="Giảng viên" key="2">
            <Input
              placeholder="Tìm kiếm"
              value={searchText}
              onChange={handleSearchChange}
              style={{ marginBottom: "20px", width: "100%" }}
              suffix={<SearchOutlined />}
            />
            <Table
              columns={teacherColumns}
              dataSource={filteredTeachers}
              scroll={{ x: "max-content" }} // responsive scroll
            />
          </TabPane>
        </Tabs>
      </Content>
    </BaseLayout>
  );
};

export default ManageCustome;
