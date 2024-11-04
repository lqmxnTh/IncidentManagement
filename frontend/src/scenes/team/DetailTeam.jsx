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

const DetailTeam = () => {
  const { id } = useParams();
  const baseURL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [team, setTeam] = useState(null);
  const [allMembers, setAllMembers] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/teams/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
            },
          });
        setTeam(response.data);
      } catch (error) {
        console.error("Failed to fetch team details:", error);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/profiles/`,
          {
            headers: {
              Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
            },
          });
        setAllMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/departments/`,
          {
            headers: {
              Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
            },
          });
        setAllDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchTeam();
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
      await axios.put(`${baseURL}/api/teams/${id}/`, team,
        {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
      navigate("/team");
    } catch (error) {
      console.error("Failed to update team:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/teams/${id}`,
        {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
      navigate("/team");
      console.log("Team deleted successfully");
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  if (!team) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="20px">
      <Header title="Team DETAIL" subtitle="Detailed view of the team" />
      <Box m="40px 0">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              name="name"
              value={team.name}
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
              value={allMembers.filter(member => team.members.includes(member.id))}
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
              value={allDepartments.filter(department => team.department.includes(department.id))}
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
            Update Team
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete Team
          </Button>
        </div>
      </Grid>
    </Box>
  );
};

export default DetailTeam;
