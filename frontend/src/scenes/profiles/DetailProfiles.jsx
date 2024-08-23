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
  FormControlLabel
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

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/profiles/${id}/`);
        setAllProfiles(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch Profiles:", error);
      }
    };
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/roles/`);
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
      await axios.put(`${baseURL}/api/profiles/${id}/`, allProfiles);
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
      await axios.delete(`${baseURL}/api/profiles/${id}`);
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

  return (
    <Box m="20px">
      <Header title="Profiles DETAIL" subtitle="Detailed view of Profiles" />
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
          <Button onClick={handleSave} variant="contained" color="secondary">
            Update Profile
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete Profile
          </Button>
        </div>
      </Grid>
    </Box>
  );
};

export default DetailProfiles;
