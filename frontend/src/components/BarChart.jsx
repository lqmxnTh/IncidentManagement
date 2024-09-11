import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2"; // Example using Chart.js

const IncidentTypeCountsChart = () => {
  const [data, setData] = useState({});
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/incident-type-counts/`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching incident type counts:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Incident Types Count",
        data: Object.values(data),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false, // Allows the chart to fill the container size
    scales: {
        x: {
            ticks: {
                color: '#FFFFFF', // Color of the x-axis labels
            },
            grid: {
                color: 'rgba(200, 200, 200, 0.3)', // Optional: customize grid line color
            },
        },
        y: {
            ticks: {
                color: '#FFFFFF', // Color of the y-axis labels
            },
            grid: {
                color: 'rgba(200, 200, 200, 0.3)', // Optional: customize grid line color
            },
        },
    },
  }
  return <Bar data={chartData} options={options}/>;
};

export default IncidentTypeCountsChart;
