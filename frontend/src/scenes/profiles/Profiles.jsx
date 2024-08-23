import { Box, Typography, useTheme, Button, Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profiles = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [allProfiles, setAllProfiles] = useState([]);
  const [rolesName, setRolesName] = useState([]);

  const RolesCell = ({ roleIds, allroles }) => {
    const roleNames = roleIds
      ?.map((id) => allroles.find((mem) => mem.id === id)?.name)
      .filter(Boolean);
  
    return (
      <Box
        display="flex"
        flexWrap="wrap"
        gap={1}
        alignItems="center"
        height={"100%"}
      >
        {roleNames?.map((mem, index) => (
          <Box
            key={index}
            component="span"
            sx={{
              backgroundColor: "rgba(149, 165, 166)",
              borderRadius: "12px",
              padding: "4px 8px",
              margin: "2px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">{mem}</Typography>
          </Box>
        ))}
      </Box>
    );
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/profiles/`);
        setAllProfiles(response.data);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
    };
    const fetchRoleName = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/roles/`);
        setRolesName(response.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchProfiles();
    fetchRoleName();
  }, [baseURL]);

  const handleRowClick = (params) => {
    navigate(`/profiles/${params.id}`);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "user_name",
      headerName: "Username",
      headerAlign: "left",
      align: "left",
      flex: 2,
    },
    {
      field: "role",
      headerName: "Role",
      headerAlign: "left",
      align: "left",
      flex: 2,
      renderCell: (params) => (
        <RolesCell roleIds={params.value} allroles={rolesName} />
      ),
    },
    {
      field: "staff",
      headerName: "Staff",
      headerAlign: "left",
      align: "left",
      flex: 1,
      renderCell: (params) => (
        <Checkbox checked={params.value} disabled />
      ),
    },
    {
      field: "is_available",
      headerName: "Available",
      headerAlign: "left",
      align: "left",
      flex: 1,
      renderCell: (params) => (
        <Checkbox checked={params.value} disabled />
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team roles" />

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
          rows={allProfiles}
          columns={columns}
          onRowClick={handleRowClick}
          autoPageSize
        />
      </Box>
    </Box>
  );
};

export default Profiles;
