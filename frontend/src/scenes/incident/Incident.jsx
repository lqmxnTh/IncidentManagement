import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Incident = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [incidents, setIncidents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/view-only-incidents/`);
        setIncidents(response.data);
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
      }
    };

    fetchIncidents();
  }, []);

  const handleRowClick = (params) => {
    navigate(`/incidents/${params.id}`);
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      cellClassName: "title-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      field: "user_name",
      headerName: "User",
      flex: 1,
    },
    {
      field: "classroom_name",
      headerName: "Classroom",
      flex: 1,
    },
    {
      field: "faculty_name",
      headerName: "Faculty",
      flex: 1,
    },
    {
      field: "building_name",
      headerName: "Building",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
    },
    {
      field: "formatted_created_at",
      headerName: "Created At",
      flex: 1,
    },
  ];

  const handleEdit = (id) => {
    // Handle edit incident logic
    console.log(`Edit incident with id: ${id}`);
  };

  return (
    <Box m="20px">
      <Header title="INCIDENTS" subtitle="Managing the Incidents" />
      <Box
        m="40px 0 0 0"
        height="100vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .title-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid rows={incidents} columns={columns} onRowClick={handleRowClick} />
      </Box>
    </Box>
  );
};

export default Incident;
