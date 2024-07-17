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
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const NewTeam = () => {
  const { id } = useParams();
  const baseURL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [team, setTeam] = useState(null);
  const [allMembers, setAllMembers] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

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
  }, [id, baseURL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeam((prevTeam) => ({
      ...prevTeam,
      [name]: value,
    }));
  };

  const handleMembersChange = (event, value) => {
    setTeam((prevTeam) => ({
      ...prevTeam,
      members: value.map(member => member.id),
    }));
  };

  const handleDepartmentsChange = (event, value) => {
    setTeam((prevTeam) => ({
      ...prevTeam,
      department: value.map(department => department.id),
    }));
  };

  const handleSave = async () => {
    try {
      await axios.post(`${baseURL}/api/teams/`, team);
      navigate("/team");
    } catch (error) {
      console.error("Failed to update team:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Team DETAIL" subtitle="Detailed view of the team" />
      <Box m="40px 0">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              name="name"
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={allMembers}
              getOptionLabel={(option) => option.user_name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={handleMembersChange}
              renderInput={(params) => (
                <TextField {...params} label="Members" placeholder="Select Members" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={allDepartments}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={handleDepartmentsChange}
              renderInput={(params) => (
                <TextField {...params} label="Departments" placeholder="Select Departments" />
              )}
            />
          </Grid>
        </Grid>
      </Box>
      <Grid item xs={12} mt="20px">
        <div className="flex space-x-4">
          <Button onClick={handleSave} variant="contained" color="secondary">
            Create Team
          </Button>
        </div>
      </Grid>
    </Box>
  );
};

export default NewTeam;
