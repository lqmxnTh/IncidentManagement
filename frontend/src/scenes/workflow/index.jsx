import React from "react";
import { Box, Typography, useTheme, Button, Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import makeRequest from "../../hooks/utils";
import RenderItemsCell from "../../hooks/RenderItemsCell";

function WorkFlow() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [incidentType, setIncidentType] = useState([]);

  useEffect(() => {
    async function fetchProfiles() {
      const response = await makeRequest("GET", "api/profiles/");
      setProfiles(response);
    }

    fetchProfiles();
  }, []);
  useEffect(() => {
    async function fetchIncidentType() {
      const response = await makeRequest("GET", "api/incident-types/");
      setIncidentType(response);
    }

    fetchIncidentType();
  }, []);
  useEffect(() => {
    async function fetchWorkflows() {
      const response = await makeRequest("GET", "api/workflows/");
      setWorkflows(response);
    }

    fetchWorkflows();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "name",
      headerName: "Title",
      headerAlign: "left",
      align: "left",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "created_by",
      headerName: "Created by",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => (
        <RenderItemsCell
          ids={[params.value.id]}
          allItems={profiles}
          name={"user_name"}
        />
      ),
      flex: 3,
    },
    {
      field: "category",
      headerName: "Category",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => (
        <RenderItemsCell
          ids={[params.value]}
          allItems={incidentType}
          name={"name"}
        />
      ),
      flex: 3,
    },
    {
      field: "emmergency",
      headerName: "Emmergency",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => <Checkbox checked={params.value} disabled />,
      flex: 3,
    },
    {
      field: "number_of_steps",
      headerName: "No. of Steps",
      headerAlign: "left",
      align: "left",
      flex: 3,
    },
  ];
  const handleRowClick = (params) => {
    navigate(`/workflow/${params.id}`);
  };
  return (
    <Box m="20px">
      <Header title="Workflow" subtitle="Managing the incident workflow" />
      <div className="flex space-x-4">
        <Button
          variant="contained"
          color="secondary"
          // onClick={() => navigate("/teams/new")}
        >
          New Workflow
        </Button>
        <Button
          variant="contained"
          color="info"
          // onClick={() => navigate("/departments")}
        >
          View Steps
        </Button>
      </div>

      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
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
        <DataGrid
          className="cursor-pointer"
          rows={workflows}
          columns={columns}
          onRowClick={handleRowClick}
          autoPageSize
        />
      </Box>
    </Box>
  );
}

export default WorkFlow;
