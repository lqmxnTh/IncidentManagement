import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  useTheme,
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import IncidentProgress from "../../components/IncidentProgress";
import EscalateDialog from "../../components/EscalateDialog";
import ResolveIncidentDialog from "../../components/ResolveIncidentDialog";

const DetailIncident = () => {
  const { id } = useParams();
  const baseURL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [incident, setIncident] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [escalationNote, setEscalationNote] = useState("");
  const [escalationType, setEscalationType] = useState("Functional");
  const [previousLevel, setPreviousLevel] = useState(1);
  const [newLevel, setNewLevel] = useState(2);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/incidents/${id}/`);
        setIncident(response.data);
        console.log(incident);
      } catch (error) {
        console.error("Failed to fetch incident details:", error);
      }
    };

    fetchIncident();
  }, [id, baseURL]);

  useEffect(() => {
    // Fetch all faculties on mount
    axios
      .get(`${baseURL}/api/faculties/`)
      .then((response) => setFaculties(response.data))
      .catch((error) => console.error("Error fetching faculties:", error));
  }, [baseURL]);

  useEffect(() => {
    if (incident && incident.faculty) {
      // Fetch buildings for the selected faculty
      axios
        .get(`${baseURL}/api/buildings/?faculty=${incident.faculty}`)
        .then((response) => setBuildings(response.data))
        .catch((error) => console.error("Error fetching buildings:", error));
    }
  }, [incident?.faculty, baseURL]);

  useEffect(() => {
    if (incident && incident.building) {
      // Fetch building details to get floor count
      axios
        .get(`${baseURL}/api/buildings/${incident.building}/`)
        .then((response) => {
          const building = response.data;
          setFloors(
            Array.from({ length: building.floor_number + 1 }, (_, i) => i)
          );
        })
        .catch((error) =>
          console.error("Error fetching building details:", error)
        );

      // Fetch classrooms for the selected building
      axios
        .get(`${baseURL}/api/classrooms/?building=${incident.building}`)
        .then((response) => setClassrooms(response.data))
        .catch((error) => console.error("Error fetching classrooms:", error));
    }
  }, [incident?.building, baseURL]);

  useEffect(() => {
    if (incident && incident.building && incident.floor !== "") {
      // Fetch classrooms for the selected building and floor
      axios
        .get(
          `${baseURL}/api/classrooms/?building=${incident.building}&floor=${incident.floor}`
        )
        .then((response) => setClassrooms(response.data))
        .catch((error) => console.error("Error fetching classrooms:", error));
    }
  }, [incident?.building, incident?.floor, baseURL]);

  useEffect(() => {
    // Fetch all incident types on mount
    axios
      .get(`${baseURL}/api/incident-types/`)
      .then((response) => setIncidentTypes(response.data))
      .catch((error) => console.error("Error fetching incident types:", error));
  }, [baseURL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIncident((prevIncident) => ({
      ...prevIncident,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setIncident((prevIncident) => ({
      ...prevIncident,
      [name]: value,
    }));
  };

  const handleIncidentTypeChange = (event, value) => {
    setIncident((prevIncident) => ({
      ...prevIncident,
      incident_type: value.map((type) => type.id),
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${baseURL}/api/incidents/${id}/`, incident);
      navigate("/incident"); // Redirect back to the incidents list after saving
    } catch (error) {
      console.error("Failed to update incident:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/incidents/${id}`);
      navigate("/incident");
      console.log("Incident deleted successfully");
    } catch (error) {
      console.error("Failed to delete incident:", error);
    }
  };

  const handleResolve = () => {
    setResolveDialogOpen(true);
  };

  const handleEscalate = () => {
    setEscalateDialogOpen(true);
  };

  const handleEscalateConfirm = async () => {
    try {
      const escalationData = {
        incident: id,
        escalation_type: escalationType,
        previous_level: previousLevel,
        new_level: newLevel,
        comments: escalationNote,
      };
      await axios.post(`${baseURL}/api/escalations/`, escalationData);
      setIncident((prevIncident) => ({
        ...prevIncident,
        status: "Escalated",
      }));
      console.log("Incident escalated successfully");
      setEscalateDialogOpen(false);
    } catch (error) {
      console.error("Failed to escalate incident:", error);
    }
  };

  const handleEscalateClose = () => {
    setEscalateDialogOpen(false);
  };

  const handleEscalationNoteChange = (e) => {
    setEscalationNote(e.target.value);
  };

  const handleEscalationTypeChange = (e) => {
    setEscalationType(e.target.value);
  };

  const handlePreviousLevelChange = (e) => {
    setPreviousLevel(e.target.value);
  };

  const handleNewLevelChange = (e) => {
    setNewLevel(e.target.value);
  };

  const handleResolveClose = () => {
    setResolveDialogOpen(false);
  };

  if (!incident) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="20px">
      <Header
        title="INCIDENT DETAIL"
        subtitle="Detailed view of the incident"
      />
      <IncidentProgress status={incident.status} />
      <Box m="40px 0">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Title"
              name="title"
              value={incident.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={incident.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              label="User"
              name="user_name"
              disabled={true}
              value={incident.user_name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={incident.status}
                onChange={handleSelectChange}
                fullWidth
                margin="normal"
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
                label="Priority"
                name="priority"
                value={incident.priority}
                onChange={handleSelectChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              multiple
              options={incidentTypes}
              getOptionLabel={(option) => option.name}
              value={incidentTypes.filter((type) =>
                incident.incident_type.includes(type.id)
              )}
              onChange={handleIncidentTypeChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Incident Type"
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Faculty</InputLabel>
              <Select
                label="Faculty"
                name="faculty"
                value={incident.faculty}
                onChange={handleSelectChange}
                fullWidth
                margin="normal"
              >
                {faculties.map((faculty) => (
                  <MenuItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Building</InputLabel>
              <Select
                label="Building"
                name="building"
                value={incident.building}
                onChange={handleSelectChange}
                fullWidth
                margin="normal"
              >
                {buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Floor</InputLabel>
              <Select
                label="Floor"
                name="floor"
                value={incident.floor}
                onChange={handleSelectChange}
                fullWidth
                margin="normal"
              >
                {floors.map((floor) => (
                  <MenuItem key={floor} value={floor}>
                    {floor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Classroom</InputLabel>
              <Select
                label="Classroom"
                name="classroom"
                value={incident.classroom}
                onChange={handleSelectChange}
                fullWidth
                margin="normal"
              >
                {classrooms.map((classroom) => (
                  <MenuItem key={classroom.id} value={classroom.id}>
                    {classroom.number}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Grid item xs={12} mt="20px">
        <div className="flex space-x-4">
          <Button onClick={handleSave} variant="contained" color="secondary">
            Update Incident
          </Button>
          <Button onClick={handleResolve} variant="contained" color="info">
            Resolve Incident
          </Button>
          <Button onClick={handleEscalate} variant="contained" color="warning">
            Escalate Incident
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete Incident
          </Button>
        </div>
      </Grid>
      <EscalateDialog
        open={escalateDialogOpen}
        onClose={handleEscalateClose}
        onConfirm={handleEscalateConfirm}
        escalationNote={escalationNote}
        onNoteChange={handleEscalationNoteChange}
        escalationType={escalationType}
        onTypeChange={handleEscalationTypeChange}
        previousLevel={previousLevel}
        onPreviousLevelChange={handlePreviousLevelChange}
        newLevel={newLevel}
        onNewLevelChange={handleNewLevelChange}
      />
      <ResolveIncidentDialog
        open={resolveDialogOpen}
        onClose={handleResolveClose}
        incidentId={id}
      />
    </Box>
  );
};

export default DetailIncident;
