import React from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(Tooltip, Legend, ArcElement);

const DounutChart = () => {
  const data = {
    title: "Biểu đồ trạng thái thiết bị",
    labels: ["Đang mượn thiết bị", "Chưa được mượn", "Đang bảo trì"],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverOffset: 4
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom"
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          }
        }
      }
    }
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h3>Danh sách thiết bị đang mượn theo trạng thái</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DounutChart;
