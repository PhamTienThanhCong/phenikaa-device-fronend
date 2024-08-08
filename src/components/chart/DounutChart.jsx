import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(Tooltip, Legend, ArcElement);

const DounutChart = (chartData) => {
  // từ dữ liệu chartData.chartData.data tính ra % của từng trạng thái

  const data = {
    title: "Biểu đồ trạng thái thiết bị",
    labels: ["Đang mượn thiết bị", "Sẵn sàng cho mượn", "Đang bảo trì"],
    datasets: [
      {
        data: chartData.chartData.data,
        backgroundColor: ["#FFCE56", "#95de64", "#FF6384"],
        hoverOffset: 4
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom"
      },
      datalabels: {
        color: "#fff",
        display: true
      },

      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          }
        }
      },
      title: {
        display: true,
        text: data.title
      },
      responsive: true,
      maintainAspectRatio: true,

      animation: {
        animateScale: true,
        animateRotate: true
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
