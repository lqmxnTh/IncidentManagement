import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Box } from "@mui/material";

const IncidentMetricsCharts = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const [priorityData, setPriorityData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  const [statusData, setStatusData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/incident-metrics/`,{
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          }});
        const { priority_counts, status_counts } = response.data;

        const priorityLabels = Object.keys(priority_counts || {});
        const priorityValues = Object.values(priority_counts || {});

        const statusLabels = Object.keys(status_counts || {});
        const statusValues = Object.values(status_counts || {});

        setPriorityData({
          labels: priorityLabels,
          datasets: [
            {
              label: "Incident Priority Count",
              data: priorityValues,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
              borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
              borderWidth: 1,
            },
          ],
        });

        setStatusData({
          labels: statusLabels,
          datasets: [
            {
              label: "Incident Status Count",
              data: statusValues,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FFCD56",
              ],
              borderColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#FFCD56",
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching incident metrics:", error);
      }
    };

    fetchData();
  }, []);

  // Chart options to position the legend on the left
  const chartOptions = {
    plugins: {
      legend: {
        position: 'left',  // Position the legend on the left
        labels: {
          color: '#FFF', // Set label color (optional)
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Conditional rendering to prevent accessing undefined data
  return (
    <Box mt={"15px"} display="flex" justifyContent="space-between" alignItems="center">
      <Box width="50%">
        <Pie data={priorityData} options={chartOptions} />
      </Box>
      <Box width="50%">
        <Pie data={statusData} options={chartOptions} />
      </Box>
    </Box>
  );
};

export default IncidentMetricsCharts;
