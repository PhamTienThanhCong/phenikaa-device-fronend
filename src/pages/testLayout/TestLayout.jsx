import React, { useEffect, useState } from "react";
import BaseLayout from "@/features/layout/BaseLayout";
import { Table, Tag } from "antd";
// import ReactTooltip from "react-tooltip";
import "./style.css";

// Dữ liệu camera giả
const camerasData = [
  // Các camera cho tòa nhà A1
  { id: 1, name: "Camera 1", locationCode: "A1", status: "active", location: "Toà A1" },
  { id: 2, name: "Camera 2", locationCode: "A1", status: "inactive", location: "Toà A1" },
  { id: 3, name: "Camera 3", locationCode: "A1", status: "active", location: "Toà A1" },

  // Các camera cho tòa nhà A2
  { id: 4, name: "Camera 4", locationCode: "A2", status: "inactive", location: "Toà A2" },
  { id: 5, name: "Camera 5", locationCode: "A2", status: "active", location: "Toà A2" },

  // Các camera cho tòa nhà A3
  { id: 6, name: "Camera 6", locationCode: "A3", status: "active", location: "Toà A3" },
  { id: 7, name: "Camera 7", locationCode: "A3", status: "inactive", location: "Toà A3" },
  { id: 8, name: "Camera 8", locationCode: "A3", status: "active", location: "Toà A3" },

  // Các camera cho tòa nhà A4
  { id: 9, name: "Camera 9", locationCode: "A4", status: "inactive", location: "Toà A4" },
  { id: 10, name: "Camera 10", locationCode: "A4", status: "active", location: "Toà A4" },

  // Các camera cho tòa nhà A5
  { id: 11, name: "Camera 11", locationCode: "A5", status: "active", location: "Toà A5" },
  { id: 12, name: "Camera 12", locationCode: "A5", status: "inactive", location: "Toà A5" },

  // Các camera cho tòa nhà A6
  { id: 13, name: "Camera 13", locationCode: "A6", status: "active", location: "Toà A6" },
  { id: 14, name: "Camera 14", locationCode: "A6", status: "inactive", location: "Toà A6" },
  { id: 15, name: "Camera 15", locationCode: "A6", status: "active", location: "Toà A6" },

  // Các camera cho tòa nhà A7
  { id: 16, name: "Camera 16", locationCode: "A7", status: "inactive", location: "Toà A7" },
  { id: 17, name: "Camera 17", locationCode: "A7", status: "active", location: "Toà A7" },

  // Các camera cho tòa nhà A8
  { id: 18, name: "Camera 18", locationCode: "A8", status: "active", location: "Toà A8" },
  { id: 19, name: "Camera 19", locationCode: "A8", status: "inactive", location: "Toà A8" },

  // Các camera cho tòa nhà A9
  { id: 20, name: "Camera 20", locationCode: "A9", status: "active", location: "Toà A9" },
  { id: 21, name: "Camera 21", locationCode: "A9", status: "inactive", location: "Toà A9" },

  // Các camera cho tòa nhà A10
  { id: 22, name: "Camera 22", locationCode: "A10", status: "active", location: "Toà A10" },
  { id: 23, name: "Camera 23", locationCode: "A10", status: "inactive", location: "Toà A10" },

  // Các camera cho tòa nhà B1
  { id: 24, name: "Camera 24", locationCode: "B1", status: "active", location: "Toà B1" },
  { id: 25, name: "Camera 25", locationCode: "B1", status: "inactive", location: "Toà B1" },

  // Các camera cho tòa nhà B2
  { id: 26, name: "Camera 26", locationCode: "B2", status: "active", location: "Toà B2" },
  { id: 27, name: "Camera 27", locationCode: "B2", status: "inactive", location: "Toà B2" },
  { id: 28, name: "Camera 28", locationCode: "B2", status: "active", location: "Toà B2" },

  // Các camera cho tòa nhà B3
  { id: 29, name: "Camera 29", locationCode: "B3", status: "active", location: "Toà B3" },
  { id: 30, name: "Camera 30", locationCode: "B3", status: "inactive", location: "Toà B3" },
  { id: 31, name: "Camera 31", locationCode: "B3", status: "active", location: "Toà B3" },

  // Các camera cho tòa nhà B4
  { id: 32, name: "Camera 32", locationCode: "B4", status: "active", location: "Toà B4" },
  { id: 33, name: "Camera 33", locationCode: "B4", status: "inactive", location: "Toà B4" },
  { id: 34, name: "Camera 34", locationCode: "B4", status: "active", location: "Toà B4" },
  { id: 35, name: "Camera 35", locationCode: "ParkingTeacher", status: "active", location: "Bãi đỗ xe giảng viên" },
  { id: 36, name: "Camera 36", locationCode: "ParkingTeacher", status: "inactive", location: "Bãi đỗ xe giảng viên" },
  { id: 37, name: "Camera 37", locationCode: "ParkingTeacher", status: "active", location: "Bãi đỗ xe giảng viên" },

  // Các camera cho bãi đỗ xe P2
  { id: 38, name: "Camera 38", locationCode: "ParkingStudent1", status: "active", location: "Bãi đỗ xe sinh viên 1" },
  { id: 39, name: "Camera 39", locationCode: "ParkingStudent1", status: "inactive", location: "Bãi đỗ xe sinh viên 1" },
  { id: 40, name: "Camera 40", locationCode: "ParkingStudent1", status: "active", location: "Bãi đỗ xe sinh viên 1" },

  // Các camera cho bãi đỗ xe P3
  { id: 41, name: "Camera 41", locationCode: "ParkingStudent2", status: "inactive", location: "Bãi đỗ xe sinh viên 2" },
  { id: 42, name: "Camera 42", locationCode: "ParkingStudent2", status: "active", location: "Bãi đỗ xe sinh viên 2" },
  { id: 43, name: "Camera 43", locationCode: "ParkingStudent2", status: "active", location: "Bãi đỗ xe sinh viên 2" },

  // Các camera cho bãi đỗ xe P4
  { id: 44, name: "Camera 44", locationCode: "ParkingStudent3", status: "active", location: "Bãi đỗ xe sinh viên 3" },
  { id: 45, name: "Camera 45", locationCode: "parkingStudent3", status: "inactive", location: "Bãi đỗ xe sinh viên 3" },

  // Các camera cho bãi đỗ xe P5
  { id: 46, name: "Camera 46", locationCode: "ParkingStaduim", status: "active", location: "Bãi đỗ xe nhà thi đấu" },
  { id: 47, name: "Camera 47", locationCode: "ParkingStaduim", status: "inactive", location: "Bãi đỗ xe nhà thi đấu" },
  { id: 48, name: "Camera 48", locationCode: "ParkingStaduim", status: "active", location: "Bãi đỗ xe nhà thi đấu" },

  // Các camera cho sân bóng
  { id: 49, name: "Camera 49", locationCode: "Football", status: "active", location: "Sân bóng" },
  { id: 50, name: "Camera 50", locationCode: "Football", status: "inactive", location: "Sân bóng" },
  { id: 51, name: "Camera 51", locationCode: "Football", status: "active", location: "Sân bóng" },

  // Các camera cho sân tennis
  { id: 52, name: "Camera 52", locationCode: "Tennis", status: "active", location: "Sân tennis" },
  { id: 53, name: "Camera 53", locationCode: "Tennis", status: "inactive", location: "Sân tennis" },

  // Các camera cho sân bóng rổ
  { id: 54, name: "Camera 54", locationCode: "Basketball", status: "active", location: "Sân bóng rổ" },
  { id: 55, name: "Camera 55", locationCode: "Basketball", status: "inactive", location: "Sân bóng rổ" },
  { id: 56, name: "Camera 56", locationCode: "Basketball", status: "active", location: "Sân bóng rổ" },

  // Các camera cho khu vực nhà thi đấu
  { id: 57, name: "Camera 57", locationCode: "C", status: "active", location: "Nhà thi đấu" },
  { id: 58, name: "Camera 58", locationCode: "C", status: "inactive", location: "Nhà thi đấu" },
  { id: 59, name: "Camera 59", locationCode: "C", status: "active", location: "Nhà thi đấu" },

  // Các camera cho khu vực cổng chính
  { id: 60, name: "Camera 60", locationCode: "MainGate", status: "active", location: "Cổng chính" },
  { id: 61, name: "Camera 61", locationCode: "MainGate", status: "inactive", location: "Cổng chính" },
  { id: 62, name: "Camera 62", locationCode: "MainGate", status: "active", location: "Cổng chính" },

  // Các camera cho khu vực cổng phụ phía D6
  { id: 63, name: "Camera 63", locationCode: "SideGateD6", status: "active", location: "Cổng phụ phía D6" },
  { id: 64, name: "Camera 64", locationCode: "SideGateD6", status: "inactive", location: "Cổng phụ phía D6" },
  { id: 65, name: "Camera 65", locationCode: "SideGateD6", status: "active", location: "Cổng phụ phía D6" },

  // Các camera cho bãi đỗ xe P6
  { id: 66, name: "Camera 49", locationCode: "ParkingD6", status: "active", location: "Bãi đỗ xe D6" },
  { id: 67, name: "Camera 50", locationCode: "ParkingD6", status: "inactive", location: "Bãi đỗ xe D6" },
  { id: 68, name: "Camera 51", locationCode: "ParkingD6", status: "active", location: "Bãi đỗ xe D6" },
  // các camera cho cổng phụ phía nhà B
  { id: 69, name: "Camera 69", locationCode: "SideGateB", status: "active", location: "Cổng phụ phía nhà B" },
  { id: 70, name: "Camera 70", locationCode: "SideGateB", status: "inactive", location: "Cổng phụ phía nhà B" },
  { id: 71, name: "Camera 71", locationCode: "SideGateB", status: "active", location: "Cổng phụ phía nhà B" },
  // camera cổng phụ Sinh viên
  { id: 72, name: "Camera 72", locationCode: "GateSideStudent", status: "active", location: "Cổng phụ Sinh viên" },
  { id: 73, name: "Camera 73", locationCode: "GateSideStudent", status: "inactive", location: "Cổng phụ Sinh viên" },
  { id: 74, name: "Camera 74", locationCode: "GateSideStudent", status: "active", location: "Cổng phụ Sinh viên" },
  // camera cổng phụ giảng viên
  { id: 75, name: "Camera 75", locationCode: "GateSideTeacher", status: "active", location: "Cổng phụ giảng viên" },
  { id: 76, name: "Camera 76", locationCode: "GateSideTeacher", status: "inactive", location: "Cổng phụ giảng viên" },
  { id: 77, name: "Camera 77", locationCode: "GateSideTeacher", status: "active", location: "Cổng phụ giảng viên" },
  // camera Quảng trường
  { id: 78, name: "Camera 78", locationCode: "Square", status: "active", location: "Quảng trường" },
  { id: 79, name: "Camera 79", locationCode: "Square", status: "inactive", location: "Quảng trường" },
  { id: 80, name: "Camera 80", locationCode: "Square", status: "active", location: "Quảng trường" },
  // camera khu vực KTXA1
  { id: 81, name: "Camera 81", locationCode: "KTXA1", status: "active", location: "Ký túc xá A1" },
  { id: 82, name: "Camera 82", locationCode: "KTXA1", status: "inactive", location: "Ký túc xá A1" },
  { id: 83, name: "Camera 83", locationCode: "KTXA1", status: "active", location: "Ký túc xá A1" },
  // camera khu vực KTXB
  { id: 84, name: "Camera 84", locationCode: "KTXB", status: "active", location: "Ký túc xá B" },
  { id: 85, name: "Camera 85", locationCode: "KTXB", status: "inactive", location: "Ký túc xá B" },
  { id: 86, name: "Camera 86", locationCode: "KTXB", status: "active", location: "Ký túc xá B" },
  // camera khu vực KTXC1
  { id: 87, name: "Camera 87", locationCode: "KTXC1", status: "active", location: "Ký túc xá C1" },
  { id: 88, name: "Camera 88", locationCode: "KTXC1", status: "inactive", location: "Ký túc xá C1" },
  { id: 89, name: "Camera 89", locationCode: "KTXC1", status: "active", location: "Ký túc xá C1" },
  // camera khu vực KTXC2
  { id: 90, name: "Camer 90", locationCode: "KTXC2", status: "active", location: "Ký túc xá C2" },
  { id: 91, name: "Camera 91", locationCode: "KTXC2", status: "inactive", location: "Ký túc xá C2" },
  { id: 92, name: "Camera 92", locationCode: "KTXC2", status: "active", location: "Ký túc xá C2" },
  // camera khu vực CT
  { id: 93, name: "Camera 93", locationCode: "CT", status: "active", location: "Khu vực Canteen" },
  { id: 94, name: "Camera 94", locationCode: "CT", status: "inactive", location: "Khu vực Canteen" },
  { id: 95, name: "Camera 95", locationCode: "CT", status: "active", location: "Khu vực Canteen" },
  // camera khu vực D6
  { id: 96, name: "Camera 96", locationCode: "D6", status: "active", location: "Toà D6" },
  { id: 97, name: "Camera 97", locationCode: "D6", status: "inactive", location: "Toà D6" },
  { id: 98, name: "Camera 98", locationCode: "D6", status: "active", location: "Toà D6" }
];

// Hàm tính số camera đang hoạt động theo tòa nhà
const getActiveCamerasCount = (building) => {
  return camerasData.filter((camera) => camera.locationCode === building && camera.status === "active").length;
};
const getCamerasForBuilding = (building) => {
  return camerasData.filter((camera) => camera.locationCode === building, location);
};
const TestLayout = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  useEffect(() => {
    const tooltips = document.querySelectorAll(".building , .parking,.botCamera,.square");

    tooltips.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        const tooltipText = element.getAttribute("data-tooltip");
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.innerText = tooltipText;
        document.body.appendChild(tooltip);

        const { top, left, width } = element.getBoundingClientRect();
        tooltip.style.top = `${top + window.scrollY - tooltip.offsetHeight - 10}px`;
        tooltip.style.left = `${left + window.scrollX + width / 2 - tooltip.offsetWidth / 2}px`;
      });

      element.addEventListener("mouseleave", () => {
        const tooltip = document.querySelector(".tooltip");
        if (tooltip) {
          tooltip.remove();
        }
      });
    });

    return () => {
      tooltips.forEach((element) => {
        element.removeEventListener("mouseenter", () => {});
        element.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
  };
  // các cột của table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Tên camera",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location"
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return status === "active" ? (
          <Tag style={{ color: "green" }}>Hoạt động</Tag>
        ) : (
          <Tag style={{ color: "red" }}>Không hoạt động</Tag>
        );
      }
    }
  ];

  return (
    <BaseLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <svg width="1034" height="648" viewBox="0 0 4534 3048" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M40 41.9999C40 40.8954 40.8954 40 42 40H4492C4493.1 40 4494 40.8954 4494 42V3006C4494 3007.1 4493.1 3008 4492 3008H42.0001C40.8955 3008 40 3007.1 40 3006V41.9999Z"
            fill="white"
          />
          <path
            d="M42 41H4492V39H42V41ZM4493 42V3006H4495V42H4493ZM4492 3007H42.0001V3009H4492V3007ZM41 3006V41.9999H39V3006H41ZM42.0001 3007C41.4478 3007 41 3006.55 41 3006H39C39 3007.66 40.3433 3009 42.0001 3009V3007ZM4493 3006C4493 3006.55 4492.55 3007 4492 3007V3009C4493.66 3009 4495 3007.66 4495 3006H4493ZM4492 41C4492.55 41 4493 41.4478 4493 42H4495C4495 40.3431 4493.66 39 4492 39V41ZM42 39C40.3432 39 39 40.343 39 41.9999H41C41 41.4477 41.4477 41 42 41V39Z"
            fill="white"
          />

          {/* background khu  B*/}
          <path
            d="M238 215.431C238 196.508 257.57 183.923 274.787 191.774L1143.39 587.843C1168.82 599.437 1160.55 637.5 1132.6 637.5H264C249.641 637.5 238 625.859 238 611.5V215.431Z"
            fill="#D8EDFA"
          />
          {/* Toà nhà khu B */}

          <rect
            x="305.29"
            y="308.5"
            width="94"
            height="280"
            fill="#0076BC"
            data-tooltip={`Toà B4: 
            Số lượng: ${getActiveCamerasCount("B4")}`}
            data-for="buildingB1"
            className="building buildingB4"
            onClick={() => handleBuildingClick("B4")}
          />
          <text x="312.29" y="458.5" fontSize="60" fill="white">
            B4
          </text>
          <rect
            x="463.29"
            y="378.5"
            width="93"
            height="210"
            fill="#0076BC"
            className="building buildingB3"
            data-tooltip={`Toà B3:
            Số lượng: ${getActiveCamerasCount("B3")}`}
            data-for="buildingB3"
            onClick={() => handleBuildingClick("B3")}
          />
          <text x="472.29" y="468.5" fontSize="60" fill="white">
            B3
          </text>
          <rect
            x="620.29"
            y="451.5"
            width="93"
            height="137"
            fill="#0076BC"
            className="building buildingB2"
            data-tooltip={`Toà B2:
            Số lượng: ${getActiveCamerasCount("B2")}`}
            data-for="buildingB2"
            onClick={() => handleBuildingClick("B2")}
          />
          <text x="629.29" y="528.5" fontSize="60" fill="white">
            B2
          </text>
          <rect
            x="777.29"
            y="508.5"
            width="93"
            height="80"
            fill="#0076BC"
            className="building buildingB1"
            data-tooltip={`Toà B1:
          Số lượng: ${getActiveCamerasCount("B1")}`}
            data-for="buildingB1"
            onClick={() => handleBuildingClick("B1")}
          />
          <text x="786.29" y="568.5" fontSize="60" fill="white">
            B1
          </text>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M263 749.135H1483.98L1892.41 918.201L1894 918.943V1876C1894 1889.81 1882.81 1901 1869 1901L315.542 1901L315.542 1528.55C315.926 1529.27 316.393 1529.96 316.943 1530.58L447.368 1678.82C451.016 1682.97 456.931 1682.97 460.579 1678.82L591.005 1530.58C593.958 1527.23 594.52 1522.18 592.692 1518.18V1110.82C594.52 1106.82 593.958 1101.77 591.005 1098.42L460.579 950.175C456.931 946.028 451.016 946.028 447.368 950.175L316.943 1098.42C316.393 1099.04 315.926 1099.72 315.542 1100.45V891.086L436.076 749.801L385.892 749.801L315.542 830.288V749.801H272.603V1901L263 1901C249.193 1901 238 1889.81 238 1876V774.135C238 760.328 249.193 749.135 263 749.135Z"
            fill="#D8EDFA"
          />

          <rect
            width="177.168"
            height="177.168"
            rx="10"
            transform="matrix(0.640941 -0.76759 0.640941 0.76759 337.174 1145.79)"
            fill="#D8EDFA"
          />
          <rect
            width="177.168"
            height="177.168"
            rx="10"
            transform="matrix(0.640941 -0.76759 0.640941 0.76759 337.174 1493.28)"
            fill="#D8EDFA"
          />
          <rect x="342.456" y="1146.37" width="216.546" height="343.674" fill="#D8EDFA" />
          <rect x="386.857" y="1147.78" width="127.585" height="339.873" fill="#4198CE" />
          {/* khu toà A */}
          {/* A10 */}

          <rect
            width="151.511"
            height="151.511"
            transform="matrix(-0.660552 -0.75078 0.660552 -0.75078 453.081 1259.5)"
            fill="#0077BB"
            className="building buildingA9"
            data-tooltip={`Toà A9:
            Số lượng: ${getActiveCamerasCount("A9")}`}
            data-for="buildingA9"
            onClick={() => handleBuildingClick("A9")}
          />
          <text x="403.081" y="1159.5" fontSize="60" fill="white">
            A9
          </text>

          <rect
            width="151.51"
            height="151.51"
            transform="matrix(-0.660552 -0.75078 0.660552 -0.75078 451.08 1601.5)"
            fill="#0077BB"
            className="building buildingA10"
            data-tooltip={`Toà A10:
            Số lượng: ${getActiveCamerasCount("A10")}`}
            data-for="buildingA10"
            onClick={() => handleBuildingClick("A10")}
          />
          <text x="403.081" y="1509.5" fontSize="60" fill="white">
            A10
          </text>
          <rect
            width="174.265"
            height="56.4394"
            rx="10"
            transform="matrix(0.660552 -0.75078 0.660552 0.75078 325.81 895.234)"
            fill="#F57021"
            className="parking parkingA9"
            data-tooltip={`Bãi đỗ xe A9:
            Số lượng: ${getActiveCamerasCount("A9")}`}
            data-for="parkingA9"
            onClick={() => handleBuildingClick("A9")}
          />
          <text x="393.81" y="865.234" fontSize="60" fill="white">
            P
          </text>
          <rect
            x="363"
            y="1761.27"
            width="90.7106"
            height="103.101"
            rx="10"
            fill="#F57021"
            className="parking parkingA10"
            data-tooltip={`Bãi đỗ xe A10:
            Số lượng: ${getActiveCamerasCount("A10")}`}
            data-for="parkingA10"
            onClick={() => handleBuildingClick("A10")}
          />
          <text x="385" y="1835.5" fontSize="60" fill="white">
            P
          </text>

          {/* A8 */}

          <rect
            width="76.5772"
            height="245.062"
            transform="matrix(1 0 0 -1 720.567 1812.7)"
            fill="#0077BB"
            className="building buildingA8"
            data-tooltip={`Toà A8:
            Số lượng: ${getActiveCamerasCount("A8")}`}
            data-for="buildingA8"
            onClick={() => handleBuildingClick("A8")}
          />
          <text x="727.567" y="1638.6" fontSize="60" fill="white">
            A8
          </text>
          {/* A6 */}
          <rect
            width="75.1849"
            height="245.062"
            transform="matrix(1 0 0 -1 933.591 1812.7)"
            fill="#0077BB"
            className="building buildingA6"
            data-tooltip={`Toà A6:
            Số lượng: ${getActiveCamerasCount("A6")}`}
            data-for="buildingA6"
            onClick={() => handleBuildingClick("A6")}
          />
          <text x="940.591" y="1638.6" fontSize="60" fill="white">
            A6
          </text>
          {/* A4 */}
          <rect
            width="76.5772"
            height="245.062"
            transform="matrix(1 0 0 -1 1145.22 1812.7)"
            fill="#0077BB"
            className="building buildingA4"
            data-tooltip={`Toà A4:
            Số lượng: ${getActiveCamerasCount("A4")}`}
            data-for="buildingA4"
            onClick={() => handleBuildingClick("A4")}
          />
          <text x="1152.22" y="1638.6" fontSize="60" fill="white">
            A4
          </text>
          {/* A2 */}
          <rect
            width="76.4467"
            height="239.671"
            transform="matrix(1 0 0 -1 1360.94 1813.19)"
            fill="#0077BB"
            className="building buildingA2"
            data-tooltip={`Toà A2:
            Số lượng: ${getActiveCamerasCount("A2")}`}
            data-for="buildingA2"
            onClick={() => handleBuildingClick("A2")}
          />
          <text x="1367.94" y="1638.6" fontSize="60" fill="white">
            A2
          </text>
          {/* A7  */}
          <rect
            x="722.056"
            y="831.327"
            width="76.5772"
            height="246.41"
            fill="#0077BB"
            className="building buildingA7"
            data-tooltip={`Toà A7:
            Số lượng: ${getActiveCamerasCount("A7")}`}
            data-for="buildingA7"
            onClick={() => handleBuildingClick("A7")}
          />
          <text x="729.056" y="1055.74" fontSize="60" fill="white">
            A7
          </text>
          {/* A5 */}
          <rect
            x="935.08"
            y="831.327"
            width="75.1849"
            height="246.41"
            fill="#0077BB"
            className="building buildingA5"
            data-tooltip={`Toà A5:
            Số lượng: ${getActiveCamerasCount("A5")}`}
            data-for="buildingA5"
            onClick={() => handleBuildingClick("A5")}
          />
          <text x="942.08" y="1055.74" fontSize="60" fill="white">
            A5
          </text>
          {/* A3 */}
          <rect
            x="1146.71"
            y="831.327"
            width="76.5772"
            height="246.41"
            fill="#0077BB"
            className="building buildingA3"
            data-tooltip={`Toà A3:
            Số lượng: ${getActiveCamerasCount("A3")}`}
            data-for="buildingA3"
            onClick={() => handleBuildingClick("A3")}
          />
          <text x="1153.71" y="1055.74" fontSize="60" fill="white">
            A3
          </text>
          {/* A1 */}
          <rect
            x="1359.74"
            y="831.327"
            width="76.2782"
            height="246.65"
            fill="#0077BB"
            className="building buildingA1"
            data-tooltip={`Toà A1:
            Số lượng: ${getActiveCamerasCount("A1")}`}
            data-for="buildingA1"
            onClick={() => handleBuildingClick("A1")}
          />
          <text x="1366.74" y="1055.74" fontSize="60" fill="white">
            A1
          </text>
          {/* khu vực quảng trường */}
          <rect
            x="743.842"
            y="1194.47"
            width="1087.707"
            height="260.015"
            fill="white"
            fillOpacity="0.1"
            stroke="#ee7e38"
            strokeWidth="3"
            className="square buildingSquare"
            data-tooltip={`Quảng trường:
            Số lượng: ${getActiveCamerasCount("Square")}`}
            data-for="buildingSquare"
            onClick={() => handleBuildingClick("Square")}
          />
          <text x="1043.842" y="1350.47" fontSize="60" fill="orange" fontWeight="bold">
            Quảng trường
          </text>
          {/* khu vực cổng phụ */}
          <rect
            width="319.626"
            height="79"
            rx="10"
            transform="matrix(0.939845 0.341601 0.341601 -0.939845 267 2392.25)"
            fill="#D8EDFA"
          />
          <rect
            width="306.469"
            height="70.1585"
            rx="10"
            transform="matrix(0.939845 0.341601 0.341601 -0.939845 275 2390.94)"
            fill="#F57021"
            className="parking parkingGate1"
            data-tooltip={`Bãi đỗ xe Giảng viên 1:
            Số lượng: ${getActiveCamerasCount("ParkingTeacher")}`}
            data-for="parkingGate1"
            onClick={() => handleBuildingClick("ParkingTeacher")}
          />
          <text x="427" y="2442.25" height="79" rx="10" fontSize="60" fill="#ffffff">
            P
          </text>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2639.95 2743.2C2636.61 2744.16 2635.69 2747.49 2636.73 2750H2052.06C2038.26 2750 2027.06 2738.81 2027.06 2725V2015C2027.06 2001.19 2038.25 1990 2052.06 1990H3633L3633.07 1990L3314.01 1990C3314 1990 3313.99 1990 3313.98 1990H3302L3336.13 2050.41L3551.31 2480.83L2639.95 2743.2Z"
            fill="#D8EDFA"
          />
          <rect x="1432.08" y="2673.57" width="671.052" height="76.5325" fill="#D8EDFA" />
          <rect
            width="697.156"
            height="78.1835"
            rx="10"
            transform="matrix(0.955128 0.296193 0.391922 -0.919998 772.276 2546.88)"
            fill="#D8EDFA"
          />
          {/* khu vực cổng phụ */}

          <path
            d="M787.137 2534.73C784.97 2539.82 787.5 2545.27 792.785 2546.9L1430.76 2743.55C1437.66 2745.67 1445.19 2740.27 1444.98 2733.32L1443.62 2687.15C1443.51 2683.35 1441 2680.14 1437.22 2678.97L818.27 2487.03C812.995 2485.39 806.964 2488.19 804.8 2493.27L787.137 2534.73Z"
            fill="#FB6F1A"
            className="parking parkingGate2"
            data-tooltip={`Bãi đỗ xe sinh viên 1:
            Số lượng: ${getActiveCamerasCount("ParkingStudent1")}`}
            data-for="parkingGate2"
            onClick={() => handleBuildingClick("ParkingStudent1")}
          />
          <text x="1012.28" y="2610.88" fontSize="60" fill="#ffffff">
            P
          </text>
          {/* sân bóng */}
          <rect
            x="2059"
            y="2009"
            width="731"
            height="394"
            fill="#0077BB"
            className="building buildingFootball"
            data-tooltip={`Sân bóng:
            Số lượng: ${getActiveCamerasCount("Football")}`}
            data-for="buildingFootball"
            onClick={() => handleBuildingClick("Football")}
          />
          <text x="2269" y="2226" fontSize="60" fill="#ffffff">
            Sân bóng đá
          </text>
          {/* sân tenis */}
          <rect
            x="2862"
            y="2028"
            width="295.217"
            height="129"
            fill="#0077BB"
            className="building buildingTennis"
            data-tooltip={`Sân tennis:
            Số lượng: ${getActiveCamerasCount("Tennis")}`}
            data-for="buildingTennis"
            onClick={() => handleBuildingClick("Tennis")}
          />
          <text x="2902" y="2126" fontSize="50" fill="#ffffff">
            Sân tenis
          </text>
          {/* sân bóng rổ */}
          <rect
            x="2862"
            y="2176"
            width="295.217"
            height="129"
            fill="#0077BB"
            className="building buildingBasketball"
            data-tooltip={`Sân bóng rổ:
            Số lượng: ${getActiveCamerasCount("Basketball")}`}
            data-for="buildingBasketball"
            onClick={() => handleBuildingClick("Basketball")}
          />
          <text x="2902" y="2274" fontSize="40" fill="#ffffff">
            Sân bóng rổ
          </text>
          {/* bãi để xe cạnh sân bóng */}
          <rect
            x="2059"
            y="2456"
            width="671"
            height="177"
            rx="25"
            fill="#FB6F1A"
            className="parking parkingFootball"
            data-tooltip={`Bãi đỗ xe danh cho học sinh 2:
            Số lượng: ${getActiveCamerasCount("ParkingStudent2")}`}
            data-for="parkingFootball"
            onClick={() => handleBuildingClick("ParkingStudent2")}
          />
          <text x="2369" y="2570" fontSize="60" fill="#ffffff">
            P
          </text>
          {/* background khu vực KTX */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1869.1 2607H1488.75L1461.08 2598.12C1460.63 2597.76 1460.08 2597.47 1459.45 2597.26L350.994 2228.57L267 2197L267 2053C267 2039.19 278.193 2028 292 2028H1869.1C1882.91 2028 1894.1 2039.19 1894.1 2053V2582C1894.1 2595.81 1882.91 2607 1869.1 2607ZM291.901 2607H1374.21V2607H292L291.901 2607Z"
            fill="#D8EDFA"
          />

          {/* bãi đỗ xem đối diện canteen */}
          <rect
            x="1850.95"
            y="2466"
            width="155.557"
            height="410"
            rx="10"
            transform="rotate(180 1850.95 2466)"
            fill="#F57021"
            className="parking parkingCanteen"
            data-tooltip={`Bãi đỗ xe danh cho học sinh 3:
            Số lượng: ${getActiveCamerasCount("ParkingStudent3")}`}
            data-for="parkingCanteen"
            onClick={() => handleBuildingClick("ParkingStudent3")}
          />
          <text x="1750.95" y="2266" fontSize="60" fill="#ffffff">
            P
          </text>
          {/* khu vực KTX */}
          <rect
            x="461.162"
            y="2096"
            width="200.975"
            height="46"
            fill="#0077BB"
            className="building buildingKTXA"
            data-tooltip={`KTX A1:
            Số lượng: ${getActiveCamerasCount("KTXA1")}`}
            data-for="buildingKTXA"
            onClick={() => handleBuildingClick("KTXA1")}
          />
          <text x="511.162" y="2126" fontSize="30" fill="#ffffff">
            KTX A
          </text>
          <rect
            x="691.659"
            y="2093"
            width="289.54"
            height="52"
            fill="#0077BB"
            className="building buildingKTXB"
            data-tooltip={`KTX B:
          Số lượng: ${getActiveCamerasCount("KTXB")}`}
            data-for="buildingKTXB"
            onClick={() => handleBuildingClick("KTXB")}
          />
          <text x="791.659" y="2133" fontSize="40" fill="#ffffff">
            KTX B
          </text>
          <rect
            x="1603.43"
            y="2186"
            width="323"
            height="136.254"
            transform="rotate(90 1603.43 2186)"
            fill="#0077BB"
            className="building buildingCT"
            data-tooltip={`Camera khu vực Can-teen:
            Số lượng: ${getActiveCamerasCount("CT")}`}
            data-for="buildingCT"
            onClick={() => handleBuildingClick("CT")}
          />
          <text x="1506.2" y="2340" fontSize="40" fill="#ffffff">
            CT
          </text>
          <rect
            x="1042.51"
            y="2096"
            width="560.913"
            height="71"
            fill="#0077BB"
            className="building buildingKTXC1"
            data-tooltip={`KTX C1:
          Số lượng: ${getActiveCamerasCount("KTXC1")}`}
            data-for="buildingKTXC1"
            onClick={() => handleBuildingClick("KTXC1")}
          />
          <text x="1231.2" y="2143" fontSize="40" fill="#ffffff">
            KTX C1
          </text>
          <rect
            x="1083.39"
            y="2333"
            width="366.751"
            height="71"
            fill="#0077BB"
            className="building buildingKTXC2"
            data-tooltip={`KTX C2:
          Số lượng: ${getActiveCamerasCount("KTXC2")}`}
            data-for="buildingKTXC2"
            onClick={() => handleBuildingClick("KTXC2")}
          />
          <text x="1276.39" y="2380" fontSize="40" fill="#ffffff">
            KTX C2
          </text>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1991 955H2001.08L2019.7 963.522C2020.09 963.909 2020.57 964.248 2021.14 964.518L2556 1218.21V1319C2556 1332.81 2544.81 1344 2531 1344H1991C1977.19 1344 1966 1332.81 1966 1319V980C1966 966.193 1977.19 955 1991 955ZM2531.12 955H2118.62V955H2531L2531.12 955Z"
            fill="#D8EDFA"
          />
          <path
            d="M1985 1004.64C1985 993.645 1996.44 986.386 2006.39 991.07L2390.26 1171.8C2393.76 1173.45 2396 1176.97 2396 1180.84V1195.44C2396 1203.73 2389.28 1210.44 2381 1210.44H2000C1991.72 1210.44 1985 1203.73 1985 1195.44V1004.64Z"
            fill="#FB6F1A"
            className="parking parkingC"
            data-tooltip={`Bãi đỗ xe gần nhà thi đấu:
            Số lượng: ${getActiveCamerasCount("ParkingStaduim")}`}
            data-for="parkingC"
            onClick={() => handleBuildingClick("ParkingStaduim")}
          />
          <text x="2100" y="1140" fontSize="60" fill="#ffffff">
            P
          </text>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3015.79 1529.21L3192 1846.18V1882C3192 1895.81 3180.81 1907 3167 1907H2010C1996.19 1907 1985 1895.81 1985 1882V1426C1985 1412.19 1996.19 1401 2010 1401L2652.91 1401L2678.8 1409.83C2679.25 1410.19 2679.78 1410.49 2680.4 1410.71L3015.79 1529.21ZM2944.52 1401L2944.52 1401H2763.11V1401H2944.52Z"
            fill="#D8EDFA"
          />
          {/* bãi đỗ xe gần D6 */}
          <path
            d="M3080.48 1706C3082.14 1706 3083.68 1706.82 3084.61 1708.18L3137.04 1784.92C3138.22 1786.65 3138.2 1788.93 3136.99 1790.63L3060.22 1898.89C3059.28 1900.21 3057.76 1901 3056.14 1901H2914.98C2910.69 1901 2908.39 1895.95 2911.2 1892.72L2981.46 1811.95C2983.44 1809.68 2985.2 1807.24 2986.74 1804.65L3043.83 1708.45C3044.73 1706.93 3046.36 1706 3048.13 1706H3080.48Z"
            fill="#F57021"
            className="parking parkingD6"
            data-tooltip={`Bãi đỗ xe gần D6:
            Số lượng: ${getActiveCamerasCount("ParkingD6")}`}
            data-for="parkingD6"
            onClick={() => handleBuildingClick("ParkingD6")}
          />
          <text x="3025" y="1850" fontSize="60" fill="#ffffff">
            P
          </text>
          <circle
            cx="2420.5"
            cy="1653.5"
            r="229.5"
            fill="#0077BB"
            className="building buildingC"
            data-tooltip={`Toà nhà thi đấu:
            Số lượng: ${getActiveCamerasCount("C")}`}
            data-for="buildingC"
            onClick={() => handleBuildingClick("C")}
          />
          <text x="2275" y="1650" fontSize="60" fill="#ffffff">
            Nhà thi đấu
          </text>
          <path
            d="M3362.71 1864.42C3352.73 1844.47 3367.24 1821 3389.54 1821H4012.01C4042.1 1821 4053.46 1860.36 4027.99 1876.39L3554.51 2174.37C3539.51 2183.81 3519.63 2178.26 3511.7 2162.4L3362.71 1864.42Z"
            fill="#D8EDFA"
          />
          <path
            d="M3798 1650.21C3798 1643.29 3804.86 1638.46 3811.37 1640.79L3912.37 1676.99C3916.35 1678.41 3919 1682.18 3919 1686.4V1716C3919 1721.52 3914.52 1726 3909 1726H3808C3802.48 1726 3798 1721.52 3798 1716V1650.21Z"
            fill="#D8EDFA"
          />
          <path
            d="M3187.11 1334.06C3184.23 1323.65 3192.97 1313.69 3203.67 1315.21L3504.67 1357.8C3505.54 1357.92 3506.4 1358.12 3507.23 1358.4L3738.6 1434.14C3739.39 1434.4 3740.16 1434.72 3740.89 1435.11L4070.17 1607.63C4078.08 1611.77 4080.64 1621.87 4075.65 1629.29L4048.37 1669.84C4044.09 1676.19 4035.72 1678.3 4028.94 1674.74L3533.76 1414.39L3489.63 1393.17C3487.6 1392.19 3485.38 1391.68 3483.13 1391.68H3214.48C3207.74 1391.68 3201.83 1387.19 3200.03 1380.69L3187.11 1334.06Z"
            fill="#D8EDFA"
          />
          <path
            d="M3392.74 1451C3396.1 1451 3399.42 1451.68 3402.51 1452.99L3713.77 1585.11C3723 1589.03 3729 1598.09 3729 1608.12V1705C3729 1718.81 3717.81 1730 3704 1730H3300.2C3290.9 1730 3282.37 1724.84 3278.05 1716.6L3158.16 1487.6C3149.44 1470.95 3161.52 1451 3180.31 1451H3392.74Z"
            fill="#D8EDFA"
          />
          <path
            d="M3371 1681C3397.31 1681 3421.22 1670.74 3438.95 1654H3559.65C3569.23 1670.16 3586.85 1681 3607 1681C3637.38 1681 3662 1656.38 3662 1626C3662 1595.62 3637.38 1571 3607 1571H3469.4C3463.92 1521.5 3421.96 1483 3371 1483C3316.32 1483 3272 1527.32 3272 1582C3272 1636.68 3316.32 1681 3371 1681Z"
            fill="#0077BB"
            className="building buildingD6"
            data-tooltip={`Toà D6:
            Số lượng: ${getActiveCamerasCount("D6")}`}
            data-for="buildingD6"
            onClick={() => handleBuildingClick("D6")}
          />
          <text x="3331" y="1599" fontSize="60" fill="#ffffff">
            D6
          </text>
          <rect x="2216.91" y="1357.96" width="317" height="31" fill="#FB92BE" />
          <rect x="2216.91" y="1357.96" width="317" height="31" fill="#FB92BE" />
          <path d="M2191 1373.5L2224.98 1347.95V1399.05L2191 1373.5Z" fill="#FB92BE" />
          <rect
            x="525.278"
            y="2357.63"
            width="77.3765"
            height="31"
            transform="rotate(-159.152 525.278 2357.63)"
            fill="#FB92BE"
          />
          <path d="M555.022 2352.33L514.179 2364.11L532.363 2316.36L555.022 2352.33Z" fill="#FB92BE" />
          <rect
            x="609.736"
            y="2536.63"
            width="107.115"
            height="21.6144"
            transform="rotate(-68.7062 609.736 2536.63)"
            fill="#FB92BE"
          />
          <path d="M609.153 2566.98L601.446 2530.05L639.816 2545.01L609.153 2566.98Z" fill="#FB92BE" />
          <rect
            x="709.815"
            y="2459.98"
            width="107.115"
            height="21.6144"
            transform="rotate(111.294 709.815 2459.98)"
            fill="#FB92BE"
          />
          <path d="M710.398 2429.63L718.105 2466.56L679.735 2451.61L710.398 2429.63Z" fill="#FB92BE" />
          <rect width="525" height="31" transform="matrix(-1 0 0 1 2946 1933)" fill="#FB92BE" />
          <path d="M2971.91 1948.5L2937.93 1922.95V1974.05L2971.91 1948.5Z" fill="#FB92BE" />
          <rect width="195" height="31" transform="matrix(-1 0 0 1 3522 1759)" fill="#FB92BE" />
          <path d="M3547.91 1774.5L3513.93 1748.95V1800.05L3547.91 1774.5Z" fill="#FB92BE" />
          <rect
            width="211.703"
            height="31"
            transform="matrix(0.509354 0.860557 0.860557 -0.509354 3161.24 1686.22)"
            fill="#FB92BE"
          />
          <path d="M3161.39 1656.03L3156.71 1698.28L3200.68 1672.25L3161.39 1656.03Z" fill="#FB92BE" />
          <rect
            x="691.262"
            y="324.686"
            width="596.158"
            height="30.2973"
            transform="rotate(24.0279 691.262 324.686)"
            fill="#FB92BE"
          />
          <path d="M661.054 327.805L702.488 318.305L681.683 364.973L661.054 327.805Z" fill="#FB92BE" />
          <rect
            x="2013.21"
            y="889.121"
            width="596.158"
            height="30.2973"
            transform="rotate(24 2013.21 889.121)"
            fill="#FB92BE"
          />
          <path d="M1983 892.255L2024.43 882.735L2003.65 929.413L1983 892.255Z" fill="#FB92BE" />
          <rect
            x="1441.27"
            y="650.585"
            width="443.59"
            height="30.2973"
            transform="rotate(24 1441.27 650.585)"
            fill="#FB92BE"
          />
          <path d="M1411.06 653.719L1452.49 644.199L1431.71 690.877L1411.06 653.719Z" fill="#FB92BE" />
          <rect width="751.807" height="31" transform="matrix(0 -1 -1 0 1955 1856.81)" fill="#1BAD8E" />
          <path d="M1939.5 1893.91L1965.05 1845.26H1913.95L1939.5 1893.91Z" fill="#1BAD8E" />
          <path d="M1939.5 1064L1965.05 1112.65H1913.95L1939.5 1064Z" fill="#1BAD8E" />
          <rect width="397" height="31" transform="matrix(0 -1 -1 0 1955 2503)" fill="#1BAD8E" />
          <path d="M1939.5 2545.87L1965.05 2497.22H1913.95L1939.5 2545.87Z" fill="#1BAD8E" />
          <path d="M1939.5 2065L1965.05 2113.65H1913.95L1939.5 2065Z" fill="#1BAD8E" />
          <rect
            width="397"
            height="31"
            transform="matrix(-0.958089 -0.286469 -0.286469 0.958089 1297.53 2565.89)"
            fill="#1BAD8E"
          />
          <path d="M1334.17 2593.02L1294.88 2554.6L1280.24 2603.56L1334.17 2593.02Z" fill="#1BAD8E" />
          <path d="M873.451 2455.26L927.384 2444.72L912.747 2493.68L873.451 2455.26Z" fill="#1BAD8E" />
          <rect
            x="586.384"
            y="2331.56"
            width="21"
            height="52"
            transform="rotate(20.0409 586.384 2331.56)"
            fill="#3255A5"
            stroke="black"
            strokeWidth="4"
            className="botCamera botcameraTeacher"
            data-tooltip={`Bãi đỗ xe giảng viên:
            Số lượng: ${getActiveCamerasCount("GateSideTeacher")}`}
            data-for="botcameraTeacher"
            onClick={() => handleBuildingClick("GateSideTeacher")}
          />
          <text x="849" y="670" fontSize="30" fill="#ffffff">
            P
          </text>
          {/* camera cổng phụ*/}
          <rect
            x="848.669"
            y="2415.55"
            width="21"
            height="52"
            transform="rotate(19.2241 848.669 2415.55)"
            fill="#3255A5"
            stroke="black"
            strokeWidth="4"
            className="botCamera botcameraGateSide"
            data-tooltip={`Cổng phụ:
            Số lượng: ${getActiveCamerasCount("GateSideStudent")}`}
            data-for="botcameraGateSide"
            onClick={() => handleBuildingClick("GateSideStudent")}
          />
          {/* camera cổng vào phía nhà B */}
          <rect
            x="2589.52"
            y="1131.64"
            width="21"
            height="63.24"
            transform="rotate(24.1549 2589.52 1131.64)"
            fill="#3255A5"
            stroke="black"
            strokeWidth="4"
            className="botCamera botcameraGateMainB"
            data-tooltip={`Cổng phụ phía nhà B:
            Số lượng: ${getActiveCamerasCount("SideGateB")}`}
            data-for="gateSideB"
            onClick={() => handleBuildingClick("SideGateB")}
          />
          {/* camera cổng chính */}
          <rect
            x="2572.6"
            y="1332.19"
            width="21"
            height="63.24"
            transform="rotate(-0.110133 2572.6 1332.19)"
            fill="#3255A5"
            stroke="black"
            strokeWidth="4"
            className="botCamera botcameraGateMain"
            data-tooltip={`Cổng chính:
            Số lượng: ${getActiveCamerasCount("MainGate")}`}
            data-for="gateMain"
            onClick={() => handleBuildingClick("MainGate")}
          />
          {/* camera cổng vào phía D6 */}
          <rect
            x="3120.88"
            y="1517.78"
            width="21"
            height="63.24"
            transform="rotate(55.4655 3120.88 1517.78)"
            fill="#3255A5"
            stroke="black"
            strokeWidth="4"
            className="botCamera botcameraGateD6"
            data-tooltip={`Cổng phụ phía D6:
            Số lượng: ${getActiveCamerasCount("SideGateD6")}`}
            data-for="botcameraGateD6"
            onClick={() => handleBuildingClick("SideGateD6")}
          />
          <rect x="40" y="4" width="76.75" height="30" rx="3" fill="white" />
          <rect x="40.5" y="4.5" width="75.75" height="29" rx="2.5" stroke="white" strokeOpacity="0.0980392" />
          {/* <ReactTooltip id="buildingB4" place="top" effect="solid" /> */}
        </svg>
        {/* nếu data trống thì không hiển thị */}
        {selectedBuilding && (
          <Table columns={columns} dataSource={selectedBuilding ? getCamerasForBuilding(selectedBuilding) : []} />
        )}
      </div>
    </BaseLayout>
  );
};

export default TestLayout;
