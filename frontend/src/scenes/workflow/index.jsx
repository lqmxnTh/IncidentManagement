import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RenderItemsCell from "../../hooks/RenderItemsCell";
import { useCookies } from "react-cookie";
function WorkFlow() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [incidentType, setIncidentType] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    category: "",
    emmergency: false,
    created_by: null,
  });
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const user = cookies?.user;
  useEffect(() => {
    axios
      .get(`${baseURL}/api/profiles/user/${user?.id}`, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      })
      .then((response) => setNewWorkflow((prev) => ({ ...prev, created_by: response.data.id })))
      .catch((error) => console.error("Error fetching profiles", error));
  }, [baseURL, user]);
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/profiles/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setProfiles(response.data);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
    };

    const fetchIncidentType = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/incident-types/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setIncidentType(response.data);
      } catch (error) {
        console.error("Failed to fetch incident types:", error);
      }
    };

    const fetchWorkflows = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/workflows/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setWorkflows(response.data);
      } catch (error) {
        console.error("Failed to fetch workflows:", error);
      }
    };

    fetchProfiles();
    fetchIncidentType();
    fetchWorkflows();
  }, [baseURL, token]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkflow((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setNewWorkflow((prev) => ({ ...prev, emmergency: checked }));
  };

  const handleFormSubmit = async () => {
    try {
      await axios.post(`${baseURL}/api/create-workflows/`, newWorkflow, {
        headers: { Authorization: `Token ${token}` },
      });
      setOpenDialog(false);
      // Refresh workflows after creating a new one
      const response = await axios.get(`${baseURL}/api/workflows/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setWorkflows(response.data);
    } catch (error) {
      console.error("Failed to create new workflow:", error);
    }
  };

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
          ids={[params.value?.id]}
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
      headerName: "Emergency",
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
          onClick={handleOpenDialog}
        >
          New Workflow
        </Button>
      </div>

      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Workflow</DialogTitle>
        {/* <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newWorkflow.created_by}
            >
              {profiles.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.user_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        <DialogContent>
          <TextField
          color="info"
            autoFocus
            margin="dense"
            label="Title"
            name="name"
            fullWidth
            value={newWorkflow.title}
            onChange={handleInputChange}
          />
          <FormControl color="info" fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={newWorkflow.category}
              onChange={handleInputChange}
            >
              {incidentType.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl margin="dense">
            <Typography>Emergency</Typography>
            <Checkbox
              checked={newWorkflow.emergency}
              onChange={handleCheckboxChange}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="secondary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WorkFlow;
