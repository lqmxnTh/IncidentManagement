import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DepartmentCell = ({ departmentIds, allDepartments }) => {
  const departmentNames = departmentIds?.map(id => allDepartments.find(dept => dept.id === id)?.name)
    .filter(Boolean);

  return (
    <Box display="flex" flexWrap="wrap" gap={1} alignItems="center" height={"100%"}>
      {departmentNames?.map((dept, index) => (
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
          <Typography variant="body2">{dept}</Typography>
        </Box>
      ))}
    </Box>
  );
};

const MembersCell = ({ memberIds, allMembers }) => {
  const memberNames = memberIds?.map(id => allMembers.find(mem => mem.id === id)?.user_name)
    .filter(Boolean);

  return (
    <Box display="flex" flexWrap="wrap" gap={1} alignItems="center" height={"100%"}>
      {memberNames?.map((mem, index) => (
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

const Team = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
  const [allMembers, setAllMembers] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/teams/`);
        setTeams(response.data);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/profiles/`);
        setAllMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/departments/`);
        setAllDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchMembers();
    fetchDepartments();
    fetchTeams();
  }, [baseURL]);

  const handleRowClick = (params) => {
    navigate(`/teams/${params.id}`);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "name",
      headerName: "Team Name",
      headerAlign: "left",
      align: "left",
      flex: 2,
    },
    {
      field: "members",
      headerName: "Members",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => <MembersCell memberIds={params.value} allMembers={allMembers} />,
      flex: 3,
    },
    {
      field: "department",
      headerName: "Department",
      headerAlign: "left",
      align: "left",
      renderCell: (params) => <DepartmentCell departmentIds={params.value} allDepartments={allDepartments} />,
      flex: 3,
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Button variant="contained" color="secondary" onClick={() => navigate("/teams/new")}>
        New Team
      </Button>
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
        <DataGrid rows={teams} columns={columns} onRowClick={handleRowClick} autoPageSize />
      </Box>
    </Box>
  );
};

export default Team;
