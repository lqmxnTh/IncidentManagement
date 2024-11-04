import {
  Box,
  Typography,
  useTheme,
  Button,
  Checkbox,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBox from "../../components/SearchBox";

const Profiles = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [allProfiles, setAllProfiles] = useState([]);
  const [rolesName, setRolesName] = useState([]);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [filteredIncidents, setFilteredIncidents] = useState(allProfiles);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    first_name: "",
    username: "",
    password: "",
  });

  // Search function that will be passed to the SearchBox
  const searchFunction = (data, parameter, value) => {
    const results = data.filter((allProfiles) => {
      const incidentValue = allProfiles[parameter];

      // Check if the parameter's value is a string
      if (typeof incidentValue === "string") {
        return incidentValue.toLowerCase().includes(value.toLowerCase());
      }

      // Check if the parameter's value is a number/float
      if (typeof incidentValue === "number") {
        return incidentValue.toString().includes(value); // Convert to string for comparison
      }

      return false; // Return false for any other types
    });

    setFilteredIncidents(results); // Update the filtered incidents state
    return results; // You could also return this if needed for further use
  };

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
        const response = await axios.get(`${baseURL}/api/profiles/`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
        setAllProfiles(response.data);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
    };
    const fetchRoleName = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/roles/`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
        setRolesName(response.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchProfiles();
    fetchRoleName();
  }, [baseURL, refresh]);

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
      renderCell: (params) => <Checkbox checked={params.value} disabled />,
    },
    {
      field: "is_available",
      headerName: "Available",
      headerAlign: "left",
      align: "left",
      flex: 1,
      renderCell: (params) => <Checkbox checked={params.value} disabled />,
    },
  ];
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = async () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setFormData({ ...formData, [name]: value, email: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}/api/register/`, formData);
    } catch (error) {
      console.error("Error signing up:", error.response.data);
      alert(error.response.data[1]);
    }finally{
      handleClose()
      setRefresh(!refresh)
    }
  };

  return (
    <Box m="20px">
      <Header title="Users" subtitle="Managing the users" />
      <SearchBox
        data={allProfiles}
        searchFunction={searchFunction}
        defauultCateg={"user_name"}
      />
      <Button color="info" variant="outlined" onClick={handleClickOpen}>
        New User
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
        <DataGrid
          className="cursor-pointer"
          rows={allProfiles}
          columns={columns}
          onRowClick={handleRowClick}
          autoPageSize
        />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New Step</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              color="info"
              label="Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              color="info"
              label="Email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              color="info"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button type="submit" color="secondary">
              Add User
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Profiles;
