import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const DetailIncident = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [incident, setIncident] = useState({});
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/incidents/${id}/`);
        setIncident(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch incident:", error);
      }
    };

    const fetchIncidentTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/incident-types/`);
        setIncidentTypes(response.data);
      } catch (error) {
        console.error("Failed to fetch incident types:", error);
      }
    };

    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/profiles/`);
        setProfiles(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
    };

    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/classrooms/`);
        setClassrooms(response.data);
      } catch (error) {
        console.error("Failed to fetch classrooms:", error);
      }
    };

    const fetchFaculties = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/faculties/`);
        setFaculties(response.data);
      } catch (error) {
        console.error("Failed to fetch faculties:", error);
      }
    };

    const fetchBuildings = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/buildings/`);
        setBuildings(response.data);
      } catch (error) {
        console.error("Failed to fetch buildings:", error);
      }
    };

    fetchIncident();
    fetchIncidentTypes();
    fetchProfiles();
    fetchClassrooms();
    fetchFaculties();
    fetchBuildings();
  }, [id, baseURL]);

  const handleChange = (e) => {
    setIncident({ ...incident, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseURL}/api/incidents/${id}/`, incident);
      alert("Incident updated successfully");
    } catch (error) {
      console.error("Failed to update incident:", error);
      alert("Failed to update incident");
    }
  };

  if (loading) return <div>Loading...</div>;
  
  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/incidents/${id}`);
      navigate("/incident");
      console.log("Incident deleted successfully");
    } catch (error) {
      console.error("Failed to delete incident:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Incident Details" subtitle="Update the incident details" />
      <Box component="form" onSubmit={handleSubmit} mt="20px">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={incident.title || ""}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={incident.description || ""}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>User</InputLabel>
              <Select
                name="user"
                value={incident.user?.id || ""}
                onChange={(e) =>
                  setIncident({
                    ...incident,
                    user: profiles.find((p) => p.id === e.target.value),
                  })
                }
              >
                {profiles.map((profile) => (
                  <MenuItem key={profile.id} value={profile.id}>
                    {profile.user_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Classroom</InputLabel>
              <Select
                name="classroom"
                value={incident.classroom?.id || ""}
                onChange={(e) =>
                  setIncident({
                    ...incident,
                    classroom: classrooms.find((c) => c.id === e.target.value),
                  })
                }
              >
                {classrooms.map((classroom) => (
                  <MenuItem key={classroom.id} value={classroom.id}>
                    {classroom.number}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Faculty</InputLabel>
              <Select
                name="faculty"
                value={incident.faculty?.id || ""}
                onChange={(e) =>
                  setIncident({
                    ...incident,
                    faculty: faculties.find((f) => f.id === e.target.value),
                  })
                }
              >
                {faculties.map((faculty) => (
                  <MenuItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Building</InputLabel>
              <Select
                name="building"
                value={incident.building?.id || ""}
                onChange={(e) =>
                  setIncident({
                    ...incident,
                    building: buildings.find((b) => b.id === e.target.value),
                  })
                }
              >
                {buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Floor"
              name="floor"
              type="number"
              value={incident.floor || ""}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={incident.status || ""}
                onChange={handleChange}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
                <MenuItem value="Escalated">Escalated</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={incident.priority || ""}
                onChange={handleChange}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Incident Type</InputLabel>
              <Select
                name="incident_type"
                multiple
                value={incident.incident_type?.map((it) => it.id) || []}
                onChange={(e) =>
                  setIncident({
                    ...incident,
                    incident_type: e.target.value.map((value) =>
                      incidentTypes.find((it) => it.id === value)
                    ),
                  })
                }
              >
                {incidentTypes.map((incidentType) => (
                  <MenuItem key={incidentType.id} value={incidentType.id}>
                    {incidentType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={incident.email || ""}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} mt="20px">
            <div className="flex space-x-4">
              <Button type="submit" variant="contained" color="secondary">
                Update Incident
              </Button>
              <Button variant="contained" color="info">
                Resolve Incident
              </Button>
              <Button variant="contained" color="warning">
                Escalate Incident
              </Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Delete Incident
              </Button>
            </div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DetailIncident;
