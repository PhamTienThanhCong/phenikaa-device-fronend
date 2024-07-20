import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(Tooltip, Legend, ArcElement);

const DounutChart = () => {
  const data = {
    labels: ["Đang mượn thiết bị", "Chưa được mượn", "Thiết bị đang hỏng"],
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
        position: "top"
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
      <Pie data={data} options={options} />
    </div>
  );
};

export default DounutChart;
