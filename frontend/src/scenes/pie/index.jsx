import { Box } from "@mui/material";
import Header from "../../components/Header";
import IncidentMetricsCharts from "../../components/PieChart";

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box height="75vh">
        <IncidentMetricsCharts />
      </Box>
    </Box>
  );
};

export default Pie;