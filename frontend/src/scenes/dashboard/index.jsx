import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ErrorIcon from "@mui/icons-material/Error";
import Header from "../../components/Header";
import GeographyChart from "../../components/GeographyChart";
import StatBox from "../../components/StatBox";
import { useEffect, useState } from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import axios from "axios";
import { formatDate } from "../../hooks/utils";
import { useNavigate } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";
import IncidentTypeCountsChart from "../../components/BarChart";
import IncidentMetricsCharts from "../../components/PieChart";
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [incident, setIncident] = useState([]);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const [lineChartData, setLineChartData] = useState({ dates: [], counts: [] });
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/incidents-per-day/`,{
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          }}); // Adjust the endpoint URL as needed
        const { dates, counts } = response.data;

        setLineChartData({
          dates: dates,
          counts: counts,
        });
      } catch (error) {
        console.error("Error fetching incident data:", error);
      }
    };

    fetchIncidentData();
  }, []);

  const Linedata = {
    labels: lineChartData.dates,
    datasets: [
      {
        label: "Incidents Per Day",
        data: lineChartData.counts,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };
  const options = {
    maintainAspectRatio: false, // Allows the chart to fill the container size
    scales: {
      x: {
        ticks: {
          color: "#FFFFFF", // Color of the x-axis labels
        },
        grid: {
          color: "rgba(200, 200, 200, 0.3)", // Optional: customize grid line color
        },
      },
      y: {
        ticks: {
          color: "#FFFFFF", // Color of the y-axis labels
        },
        grid: {
          color: "rgba(200, 200, 200, 0.3)", // Optional: customize grid line color
        },
      },
    },
  };
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/view-only-incidents/`,{
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          }});
        setIncident(response.data.reverse());
      } catch (error) {
        console.error("Failed to fetch team details:", error);
      }
    };

    fetchIncidents();
  }, [baseURL]);
  // if (incident){
  let numberOfIncident = incident?.length;
  let numberOfOpenIncident = incident?.filter(
    (rec) => rec.status === "Open"
  ).length;
  let numberOfClosedIncident = incident?.filter(
    (rec) => rec.status === "Closed"
  ).length;
  let numberOfCriticalIncident = incident?.filter(
    (rec) => rec.priority === "Critical"
  ).length;
  // }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box className="hidden lg:block">
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
        <Box className="lg:hidden">
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "11px",
              fontWeight: "bold",
              padding: "5px 5px",
              width: "75%",
              height: "100%",
              float: "right",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "2px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <div className="hidden lg:block">
        <Box
          className="hidden lg:block"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {/* ROW 1 */}
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={numberOfIncident}
              subtitle="Number of Incident Received"
              progress="0.50"
              // increase="+14%"
              icon={
                <CampaignIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={numberOfOpenIncident}
              subtitle="Number of Incidents Open"
              progressCircle={true}
              progress={numberOfOpenIncident / numberOfIncident}
              increase={
                ((numberOfOpenIncident * 100) / numberOfIncident).toFixed(0) +
                "%"
              }
              icon={
                <LockOpenIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={numberOfClosedIncident}
              subtitle="Number of Incidents Closed"
              progress={numberOfClosedIncident / numberOfIncident}
              increase={
                ((numberOfClosedIncident * 100) / numberOfIncident).toFixed(0) +
                "%"
              }
              progressCircle={true}
              icon={
                <TaskAltIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={numberOfCriticalIncident}
              subtitle="Number of Incidents Critical"
              progress={numberOfCriticalIncident / numberOfIncident}
              increase={
                ((numberOfCriticalIncident * 100) / numberOfIncident).toFixed(
                  0
                ) + "%"
              }
              progressCircle={true}
              icon={
                <ErrorIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>

          {/* ROW 2 */}
          <Box
            gridColumn="span 8"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
          >
            <Box
              mt="10px"
              p="0 30px"
              display="flex "
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                >
                  Incidents Per Day
                </Typography>
              </Box>
              <Box>
                <IconButton>
                  <DownloadOutlinedIcon
                    sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                  />
                </IconButton>
              </Box>
            </Box>
            <Box height="240px" p="0 30px">
              <Line height={"100%"} data={Linedata} options={options} />
            </Box>
          </Box>
          {/* Recent Incidents */}
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            overflow="auto"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              colors={colors.grey[100]}
              p="15px"
            >
              <Typography
                color={colors.grey[100]}
                variant="h5"
                fontWeight="600"
              >
                Recent Incidents
              </Typography>
            </Box>
            {incident.slice(0, 5).map((transaction, i) => (
              <Box
                className="cursor-pointer"
                key={`${transaction.id}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
                onClick={() => {
                  navigate(`/incidents/${transaction.id}`);
                }}
              >
                <Box>
                  <Typography
                    color={colors.greenAccent[500]}
                    variant="h5"
                    fontWeight="600"
                  >
                    {transaction.title}
                  </Typography>
                  <Typography color={colors.grey[100]}>
                    {transaction.user_name}
                  </Typography>
                  <Box color={colors.grey[100]}>
                    {formatDate(transaction.created_at)}
                  </Box>
                </Box>

                <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
                >
                  {transaction.status}
                </Box>
              </Box>
            ))}
          </Box>

          {/* ROW 3 */}
          <Box
            gridColumn="span 6"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
          >
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ padding: "30px 30px 0 30px" }}
            >
              Incident By Category
            </Typography>
            <Box height="290px" mt="-20px" p={"20PX"}>
              <IncidentTypeCountsChart />
            </Box>
          </Box>
          <Box
            gridColumn="span 6"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            padding="30px"
          >
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ marginBottom: "15px" }}
            >
              Incident Prioriy and Incident Status
            </Typography>
            <Box>
              <IncidentMetricsCharts />
            </Box>
          </Box>
        </Box>
      </div>
      <div className="lg:hidden">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 auto-rows-[140px]">
          {/* ROW 1 */}
          <div className="col-span-12 md:col-span-3 bg-primary-400 flex items-center justify-center">
            <StatBox
              title={numberOfIncident}
              subtitle="Number of Incidents Received"
              progress="0.50"
              icon={
                <CampaignIcon className="text-greenAccent-600 text-[30px]" />
              }
            />
          </div>
          <div className="col-span-12 md:col-span-3 bg-primary-400 flex items-center justify-center">
            <StatBox
              title={numberOfOpenIncident}
              subtitle="Number of Incidents Open"
              progressCircle={true}
              progress={numberOfOpenIncident / numberOfIncident}
              increase={
                ((numberOfOpenIncident * 100) / numberOfIncident).toFixed(0) +
                "%"
              }
              icon={
                <LockOpenIcon className="text-greenAccent-600 text-[26px]" />
              }
            />
          </div>
          <div className="col-span-12 md:col-span-3 bg-primary-400 flex items-center justify-center">
            <StatBox
              title={numberOfClosedIncident}
              subtitle="Number of Incidents Closed"
              progress={numberOfClosedIncident / numberOfIncident}
              increase={
                ((numberOfClosedIncident * 100) / numberOfIncident).toFixed(0) +
                "%"
              }
              progressCircle={true}
              icon={
                <TaskAltIcon className="text-greenAccent-600 text-[26px]" />
              }
            />
          </div>
          <div className="col-span-12 md:col-span-3 bg-primary-400 flex items-center justify-center">
            <StatBox
              title={numberOfCriticalIncident}
              subtitle="Number of Incidents Critical"
              progress={numberOfCriticalIncident / numberOfIncident}
              increase={
                ((numberOfCriticalIncident * 100) / numberOfIncident).toFixed(
                  0
                ) + "%"
              }
              progressCircle={true}
              icon={<ErrorIcon className="text-greenAccent-600 text-[26px]" />}
            />
          </div>

          {/* ROW 2 */}
          <div className="col-span-12 md:col-span-8 bg-primary-400 row-span-2">
            <div className="mt-2 px-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-100">
                Incidents Per Day
              </h2>
              <button>
                <DownloadOutlinedIcon className="text-greenAccent-500 text-[26px]" />
              </button>
            </div>
            <div className="h-[240px] px-6">
              <Line height={"100%"} data={Linedata} options={options} />
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="col-span-12 md:col-span-4 bg-primary-400 row-span-2 overflow-auto">
            <div className="flex justify-between items-center border-b-4 border-primary-500 text-gray-100 px-4 py-4">
              <h2 className="text-lg font-semibold">Recent Incidents</h2>
            </div>
            {incident.slice(0, 5).map((transaction, i) => (
              <div
                className="flex justify-between items-center border-b-4 border-primary-500 px-4 py-4 cursor-pointer"
                key={`${transaction.id}-${i}`}
                onClick={() => navigate(`/incidents/${transaction.id}`)}
              >
                <div>
                  <h3 className="text-greenAccent-500 text-lg font-semibold">
                    {transaction.title}
                  </h3>
                  <p className="text-gray-100">{transaction.user_name}</p>
                  <p className="text-gray-100">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
                <div className="bg-greenAccent-500 px-3 py-1 rounded-md">
                  {transaction.status}
                </div>
              </div>
            ))}
          </div>

          {/* ROW 3 */}
          <div className="col-span-12 md:col-span-6 bg-primary-400 row-span-2">
            <h2 className="text-lg font-semibold px-6 py-6">
              Incident By Category
            </h2>
            <div className="h-[290px] mt-[-20px] p-5">
              <IncidentTypeCountsChart />
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 bg-primary-400 row-span-2 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Incident Priority and Incident Status
            </h2>
            <div>
              <IncidentMetricsCharts />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Dashboard;
