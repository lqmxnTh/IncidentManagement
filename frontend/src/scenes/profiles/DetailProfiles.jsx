import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  Autocomplete,
  Grid,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const DetailProfiles = () => {
  const { id } = useParams();
  const baseURL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [allProfiles, setAllProfiles] = useState(null);
  const [allRoles, setAllRoles] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [tabIndex, setTabIndex] = useState(0);
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    const getGroups = async () => {
      const userGroups = await fetchUserGroups();
      setGroups(userGroups);
    };

    getGroups();
  }, []);

  const fetchUserGroups = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/user-groups/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`, 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user groups:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/profiles/${id}/`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
        setAllProfiles(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch Profiles:", error);
      }
    };
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/roles/`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
        setAllRoles(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };
    fetchRoles();
    fetchProfiles();
  }, [id, baseURL]);

  const handleSave = async () => {
    try {
      await axios.put(`${baseURL}/api/profiles/${id}/`, allProfiles, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      });
    } catch (error) {
      console.error("Failed to update Profiles:", error);
    }
  };

  const handleStaffChange = (event) => {
    setAllProfiles((prevProfiles) => ({
      ...prevProfiles,
      staff: event.target.checked,
    }));
  };
  const handleIsAvailableChange = (event) => {
    setAllProfiles((prevProfiles) => ({
      ...prevProfiles,
      is_available: event.target.checked,
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/profiles/${id}`, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      });
      navigate("/Profiles");
      console.log("Profiles deleted successfully");
    } catch (error) {
      console.error("Failed to delete Profiles:", error);
    }
  };

  const handleRolesChange = (event, value) => {
    setAllProfiles((prevProf) => ({
      ...prevProf,
      role: value.map((type) => type.id),
    }));
  };

  if (!allProfiles) {
    return <Typography>Loading...</Typography>;
  }
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  return (
    <Box m="20px">
      <div className="mb-5">
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
          }}
          onClick={() => {
            navigate("/profiles");
          }}
        >
          Back
        </Button>
      </div>
      <Header title="Profiles DETAIL" subtitle="Detailed view of Profiles" />
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="incident details tabs"
        sx={{
          "& .MuiTab-root": {
            color: "#ffffff", // Default text color
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#115293", // Hover background color
            },
            "&.Mui-selected": {
              color: "#1976d2", // Text color of selected tab
              backgroundColor: "#ffffff", // Background color of selected tab
            },
          },
        }}
      >
        <Tab label="Details" />
        <Tab label="Groups" />
        <Tab label="Permissions" />
      </Tabs>
      {tabIndex === 0 && (
        <>
          <Box m="40px 0">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Username"
                  name="username"
                  value={allProfiles.user_name}
                  fullWidth
                  margin="normal"
                  color="secondary"
                  disabled={true}
                />
                <Autocomplete
                  multiple
                  options={allRoles}
                  getOptionLabel={(option) => option?.name}
                  value={allRoles?.filter((type) =>
                    allProfiles?.role.includes(type?.id)
                  )}
                  onChange={handleRolesChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Roles"
                      fullWidth
                      margin="normal"
                      color="secondary"
                    />
                  )}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allProfiles.staff}
                      onChange={handleStaffChange}
                      name="staffCheckbox"
                      color="secondary"
                    />
                  }
                  label="Staff"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allProfiles.is_available}
                      onChange={handleIsAvailableChange}
                      name="IsAvailable"
                      color="secondary"
                    />
                  }
                  label="Is Available"
                />
              </Grid>
            </Grid>
          </Box>
          <Grid item xs={12} mt="20px">
            <div className="flex space-x-4">
              <Button
                onClick={handleSave}
                variant="contained"
                color="secondary"
              >
                Update Profile
              </Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Delete Profile
              </Button>
            </div>
          </Grid>
        </>
      )}
      {tabIndex === 1 && (
        <div>
          <h1>User Groups</h1>
          <ul>
            {groups?.map((group) => (
              <li key={group.id}>{group.name}</li>
            ))}
          </ul>
        </div>
      )}
    </Box>
  );
};

export default DetailProfiles;
