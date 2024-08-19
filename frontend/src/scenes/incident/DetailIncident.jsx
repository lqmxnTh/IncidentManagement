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
  Tabs,
  Tab,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import IncidentProgress from "../../components/IncidentProgress";
import EscalateDialog from "../../components/EscalateDialog";
import ResolveIncidentDialog from "../../components/ResolveIncidentDialog";
import { updateItemStatus } from "../../hooks/utils";
import MapComponent from "../../components/MapComponent";
import { useCookies } from "react-cookie";
import { DataGrid } from "@mui/x-data-grid";
const DetailIncident = () => {
  const { id } = useParams();
  const baseURL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [resolutions, setResolutions] = useState(null);
  const [resolutionsReset, setResolutionsReset] = useState(false);
  const [incident, setIncident] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [teams, setTeams] = useState([]);
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [escalationNote, setEscalationNote] = useState("");
  const [escalationType, setEscalationType] = useState("Functional");
  const [previousLevel, setPreviousLevel] = useState(1);
  const [newLevel, setNewLevel] = useState(2);
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();
  const [cookies] = useCookies(["csrftoken"]);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const TeamsCells = ({ teamsIds, allTeams }) => {
    const teamIds = teamsIds
      ?.map((id) => allTeams.find((team) => team.id === id)?.name)
      .filter(Boolean);
  
    return (
      <Box
        display="flex"
        flexWrap="wrap"
        gap={1}
        alignItems="center"
        height={"100%"}
      >
        {teamIds?.map((mem, index) => (
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
  
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "resolution_notes",
      headerName: "Notes",
      flex: 1,
      cellClassName: "title-column--cell",
    },
    {
      field: "resolution_time",
      headerName: "Resolution Time",
      flex: 2,
    },
    {
      field: "resolution_date",
      headerName: "Resolution Date",
      flex: 1,
    },
    {
      field: "teams",
      headerName: "Teams",
      flex: 1,
      renderCell: (params) => (
        <TeamsCells
        teamsIds={params.value}
        allTeams={teams}
        />
      ),
    },
    
  ];
  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/incidents/${id}/`);
        setIncident(response.data);
      } catch (error) {
        console.error("Failed to fetch incident details:", error);
      }
    };

    fetchIncident();
  }, [id, baseURL]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/faculties/`)
      .then((response) => setFaculties(response.data))
      .catch((error) => console.error("Error fetching faculties:", error));
  }, [baseURL]);
  
  useEffect(() => {
    axios
      .get(`${baseURL}/api/resolutions/incident/${id}`)
      .then((response) => setResolutions(response.data))
      .catch((error) => console.error("Error fetching resolutions:", error));
  }, [resolutionsReset,baseURL]);


  useEffect(() => {
    if (incident && incident.faculty) {
      axios
        .get(`${baseURL}/api/buildings/?faculty=${incident.faculty}`)
        .then((response) => setBuildings(response.data))
        .catch((error) => console.error("Error fetching buildings:", error));
    }
  }, [incident?.faculty, baseURL]);

  useEffect(() => {
    if (incident && incident.building) {
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

      axios
        .get(`${baseURL}/api/classrooms/?building=${incident.building}`)
        .then((response) => setClassrooms(response.data))
        .catch((error) => console.error("Error fetching classrooms:", error));
    }
  }, [incident?.building, baseURL]);

  useEffect(() => {
    if (incident && incident.building && incident.floor !== "") {
      axios
        .get(
          `${baseURL}/api/classrooms/?building=${incident.building}&floor=${incident.floor}`
        )
        .then((response) => setClassrooms(response.data))
        .catch((error) => console.error("Error fetching classrooms:", error));
    }
  }, [incident?.building, incident?.floor, baseURL]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/incident-types/`)
      .then((response) => setIncidentTypes(response.data))
      .catch((error) => console.error("Error fetching incident types:", error));
  }, [baseURL]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/teams/`)
      .then((response) => setTeams(response.data))
      .catch((error) => console.error("Error fetching teams:", error));
  }, [baseURL]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/profiles/`)
      .then((response) => setProfiles(response.data))
      .catch((error) => console.error("Error fetching profiles:", error));
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

  const handleTeamsChange = (event, value) => {
    setIncident((prevIncident) => ({
      ...prevIncident,
      teams: value.map((type) => type.id),
    }));
  };
  const handleAssignedToChange = (event, value) => {
    setIncident((prevIncident) => ({
      ...prevIncident,
      assigned_to: value.map((type) => type.id),
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${baseURL}/api/incidents/${id}/`, incident);
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

  const handleSendMail = async () => {
    if (incident) {
      try {
        // Call the API to send emails with the CSRF token
        const response = await axios.post(
          `${baseURL}/api/incidents/${id}/send-mail/`,
          {},
          {
            headers: {
              "X-CSRFToken": "EHxKPGqz0S9xMYMvd95gAj5xtnueUgAB",
            },
          }
        );

        // Check for a successful response
        if (response.status === 200) {
          console.log("Emails sent successfully");
          await updateItemStatus(baseURL, id, incident, "Assign");
          setIncident((prevIncident) => ({
            ...prevIncident,
            status: "Assign",
          }));
        } else {
          console.error("Failed to send emails");
        }

        // Update incident status
      } catch (error) {
        console.error("Error in sending emails:", error);
      }
    }
  };

  const handleEscalate = () => {
    setEscalateDialogOpen(true);
  };

  const handleEscalateConfirm = async () => {
    try {
      const escalationData = {
        escalated_by: 14,
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
    try {
      await axios.put(`${baseURL}/api/incidents/${id}/`, incident);
      console.log("incident successfully saved");
    } catch (error) {
      console.error("Failed to update incident:", error);
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

  const handleResolveClose = async () => {
    setResolveDialogOpen(false);
  };

  const handleSaveResolveClose = async () => {
    if (incident) {
      await updateItemStatus(baseURL, id, incident, "Resolved");
      setIncident((prevIncident) => ({
        ...prevIncident,
        status: "Resolved",
      }));
      setResolutionsReset(true)
    }
  };

  const handleAccept = async () => {
    if (incident) {
      await updateItemStatus(baseURL, id, incident, "In Progress");
      setIncident((prevIncident) => ({
        ...prevIncident,
        status: "In Progress",
      }));
    }
  };

  const handleReject = async () => {
    if (incident) {
      await updateItemStatus(baseURL, id, incident, "Rejected");
      setIncident((prevIncident) => ({
        ...prevIncident,
        status: "Rejected",
      }));
    }
  };

  const handleClose = async () => {
    if (incident) {
      await updateItemStatus(baseURL, id, incident, "Closed");
      setIncident((prevIncident) => ({
        ...prevIncident,
        status: "Closed",
      }));
    }
  };

  const selectedTeams = incident?.teams;

  const newlyFilteredteam = teams.filter((obj) =>
    selectedTeams?.includes(obj.id)
  );

  function extractMembers(data) {
    const allMembers = [];
    data.forEach((obj) => {
      allMembers.push(...obj.members);
    });
    const uniqueMembers = [...new Set(allMembers)];

    return uniqueMembers;
  }
  const result = extractMembers(newlyFilteredteam);

  const newlyFilteredProfiles = profiles.filter((obj) =>
    result.includes(obj.id)
  );

  const isEditable =
    incident?.status === "Open" || incident?.status === "In Progress";

  if (!incident) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="20px">
      <div className="mb-5">
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
          }}
          onClick={() => {
            navigate("/incident");
          }}
        >
          Back
        </Button>
      </div>
      <Header
        title="INCIDENT DETAIL"
        subtitle="Detailed view of the Incident"
      />
      <IncidentProgress status={incident.status} />
      <Grid item xs={12} mt="20px">
        <div className="flex space-x-4">
          {/* {incident?.status === "Open" ? ( */}
          <>
            <Button
              onClick={handleAccept}
              variant="contained"
              color="secondary"
            >
              Accept
            </Button>
            <Button onClick={handleReject} variant="outlined" color="error">
              Reject
            </Button>
          </>
          {/* ) : ( */}
          <>
            <Button
              onClick={() => handleSave()}
              variant="contained"
              color="secondary"
            >
              Update Incident
            </Button>
            {/* {incident?.status === "In Progress" && ( */}
            <>
              <Button onClick={handleResolve} variant="contained" color="info">
                Resolve Incident
              </Button>
              <Button onClick={handleSendMail} variant="contained" color="info">
                Assign Members
              </Button>
              {/* {incident?.status !== "Escalated" && ( */}
              <Button
                onClick={handleEscalate}
                variant="contained"
                color="warning"
              >
                Escalate Incident
              </Button>
              {/* )} */}
            </>
            {/* )} */}
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete Incident
            </Button>
            <Button onClick={handleReject} variant="contained" color="primary">
              Reject
            </Button>
            {/* {incident?.status === "Resolved" && ( */}
            <Button onClick={handleClose} variant="contained" color="primary">
              Close
            </Button>
            {/* )} */}
          </>
          {/* )} */}
        </div>
      </Grid>

      <Grid item xs={12}>
        <Tabs
          className="mt-7"
          value={value}
          onChange={handleChange}
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
          <Tab sx={{ marginLeft: "15px" }} label="Resolutions" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Box >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Title"
                  name="title"
                  value={incident.title}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                <FormControl fullWidth margin="normal" disabled={!isEditable}>
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
                    <MenuItem value="Assign">Assign</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                    <MenuItem value="Escalated">Escalated</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" disabled={!isEditable}>
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
                  disabled={!isEditable}
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
                      disabled={!isEditable}
                    />
                  )}
                />
                <Autocomplete
                  disabled={!isEditable}
                  multiple
                  options={teams}
                  getOptionLabel={(option) => option?.name}
                  value={teams?.filter((type) =>
                    incident?.teams.includes(type?.id)
                  )}
                  onChange={handleTeamsChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Teams"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <Autocomplete
                  disabled={!isEditable}
                  multiple
                  options={newlyFilteredProfiles}
                  getOptionLabel={(option) => option?.user_name}
                  value={profiles?.filter((profile) =>
                    incident?.assigned_to.includes(profile?.id)
                  )}
                  onChange={handleAssignedToChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assigned To"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <FormControl fullWidth margin="normal" disabled={!isEditable}>
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
                <FormControl fullWidth margin="normal" disabled={!isEditable}>
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
                <FormControl fullWidth margin="normal" disabled={!isEditable}>
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
                <FormControl fullWidth margin="normal" disabled={!isEditable}>
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
          {incident?.latitude && incident?.longitude && (
            <Box className="mt-7">
              <MapComponent
                latitude={incident?.latitude}
                longitude={incident?.longitude}
              />
            </Box>
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
        <Box
        m="40px 0 0 0"
        height="100vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .title-column--cell": {
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
        <DataGrid autoPageSize className="cursor-pointer" rows={resolutions} columns={columns} />
      </Box>
        </TabPanel>
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
        incident={incident}
        open={resolveDialogOpen}
        onClose={handleResolveClose}
        save={handleSaveResolveClose}
        teams={incident?.teams}
        incidentId={id}
      />
    </Box>
  );
};
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ marginTop:'10px' }}>{children}</Box>}
    </div>
  );
}
export default DetailIncident;

// TODO: Resolve BUTTON TO BE VISIBLE AND INVISIBLE
// TODO: ESCALATE BUTTON TO BE VISIBLE AND INVISIBLE
// TODO: UPDATE BUTTON TO BE REMOVE MAKE  SAVE TO BE INSTANTENOUS
