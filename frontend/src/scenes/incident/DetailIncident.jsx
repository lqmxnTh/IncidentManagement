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
  Backdrop,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import IncidentProgress from "../../components/IncidentProgress";
import EscalateDialog from "../../components/EscalateDialog";
import ResolveIncidentDialog from "../../components/ResolveIncidentDialog";
import {
  handleInputChange,
  LoginUserData,
  updateItemStatus,
} from "../../hooks/utils";
import MapComponent from "../../components/MapComponent";
import { useCookies } from "react-cookie";
import { DataGrid } from "@mui/x-data-grid";
import { TabPanel } from "../../components/TabPanel";
import RenderItemsCell from "../../hooks/RenderItemsCell";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import EditTaskDialogue from "../../components/EditTaskDialogue";
import AddNewTaskDialogue from "../../components/AddNewTaskDialogue";

const DetailIncident = () => {
  const { id } = useParams();
  const [cookies] = useCookies(["user"]);
  const user = cookies?.user;
  const baseURL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [resolutions, setResolutions] = useState(null);
  const [resolutionsReset, setResolutionsReset] = useState(false);
  const [incident, setIncident] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [steps, setSteps] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [teams, setTeams] = useState([]);
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [escalationNote, setEscalationNote] = useState("");
  const [escalatedTo, setEscalatedTo] = useState(null);
  const [escalationType, setEscalationType] = useState("Functional");
  const [previousLevel, setPreviousLevel] = useState(1);
  const [newLevel, setNewLevel] = useState(2);
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();
  const [emailLoading, setEmailLoading] = useState(false);
  const [value, setValue] = React.useState(0);
  const [predictedCategory, setpredictedCategory] = useState(null);
  const [predictedWorkflow, setPredictedWorkflow] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [logUser, setLogUser] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [refreshTasks, setRefreshTasks] = useState(false);
  const [isDialogAddaTaskOpen, setDialogAddaTaskOpen] = useState(false);
  const [isDialogEditTaskOpen, setDialogEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState([]);
  const [escalations, setEscalation] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshEscaltion, setRefreshEscaltion] = useState(false);
  const [isForfeitDialogOpen, setIsForfeitDialogOpen] = useState(false);
  const [forfeitReason, setForfeitReason] = useState("");
  const [forfeitId, setForfeitId] = useState(0);

  const isMobile = useMediaQuery("(max-width: 600px)");
  const token = localStorage.getItem("token");
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
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

  const Resolutioncolumns = [
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
        <TeamsCells teamsIds={params.value} allTeams={teams} />
      ),
    },
  ];
  const EscaltionHistorycolumns = [
    { field: "id", headerName: "ID" },
    {
      field: "escalation_type",
      headerName: "Escaltion Type",
      flex: 1,
      cellClassName: "title-column--cell",
    },
    {
      field: "previous_level",
      headerName: "Previous Level",
      flex: 2,
    },
    {
      field: "new_level",
      headerName: "New Level",
      flex: 1,
    },
    {
      field: "comments",
      headerName: "Comments",
      flex: 1,
    },
    {
      field: "escalated_to",
      headerName: "Escalated To",
      flex: 1,
      renderCell: (params) => (
        <RenderItemsCell
          ids={params.value}
          allItems={profiles}
          name={"user_name"}
        />
      ),
    },
  ];
  const Taskcolumns = [
    { field: "id", headerName: "ID" },
    {
      field: "created_by",
      headerName: "Created By",
      flex: 1,
      renderCell: (params) => (
        <RenderItemsCell
          ids={[params.value]}
          allItems={profiles}
          name={"user_name"}
        />
      ),
    },
    {
      field: "name",
      headerName: "Task Name",
      flex: 2,
      cellClassName: "title-column--cell",
    },
    {
      field: "task_to",
      headerName: "Task To",
      flex: 1,
      renderCell: (params) => (
        <RenderItemsCell
          ids={[params.value]}
          allItems={profiles}
          name={"user_name"}
        />
      ),
    },
    {
      field: "completed",
      headerName: "Completed",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleToggleCompleted(params.row.id)}
          style={{
            color: params.value ? "green" : "green",
            cursor:
              params.row.completed || params.row.forfeited
                ? "not-allowed"
                : "pointer",
            textTransform: "none",
          }}
          disabled={params.row.completed || params.row.forfeited}
        >
          {params.value ? "Completed" : "Mark as Complete"}
        </Button>
      ),
    },
    {
      field: "forfeited",
      headerName: "Forfeit",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleToggleForfeit(params.row.id)}
          style={{
            color: params.value ? "gray" : "red",
            cursor:
              params.row.completed || params.row.forfeited
                ? "not-allowed"
                : "pointer",
            textTransform: "none",
          }}
          disabled={params.row.completed || params.row.forfeited}
        >
          {params.value ? "Forfeited" : "Mark as Forfeit"}
        </Button>
      ),
    },
    {
      field: "forfeited_reason",
      headerName: "Forfeit Reason",
      flex: 1,
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          onClick={() => handleEditTask(params.row.id)}
          style={{ color: "blue", cursor: "pointer" }}
        >
          <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-1 ">
            {React.createElement(PencilSquareIcon, {
              strokeWidth: 2,
              className: "h-6 text-gray-900 w-6",
            })}
          </div>
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <Button
          onClick={() => handleDeleteSelectedTask(params.row.id)}
          style={{ color: "red", cursor: "pointer" }}
        >
          <div className="flex items-center justify-center rounded-lg bg-red-400 p-1">
            {React.createElement(TrashIcon, {
              strokeWidth: 2,
              className: "h-6 text-white w-6",
            })}
          </div>
        </Button>
      ),
    },
  ];

  // Sample handlers for toggling completed and forfeit states
  const handleToggleCompleted = async (id) => {
    setEmailLoading(true);
    await axios.put(
      `${baseURL}/api/tasks/${id}/`,
      {
        completed: true,
      },
      {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      }
    );
    setRefreshTasks(!refreshTasks);
    setEmailLoading(false);
    handleResolve()
  };

  const handleToggleForfeit = (id) => {
    setIsForfeitDialogOpen(true)
    setForfeitId(id)

  };
  const handleSubmitForfeit = async (id) => {
    await axios.put(
      `${baseURL}/api/tasks/${forfeitId}/`,
      {
        forfeited: true,
        forfeited_reason: forfeitReason
      },
      {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      }
    );
    setIsForfeitDialogOpen(false);
    setRefreshTasks(!refreshTasks)
  };
  const handleCloseDialog = () => {
    setIsForfeitDialogOpen(false);
  };

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage
        const response = await axios.get(`${baseURL}/api/incidents/${id}/`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
        setIncident(response.data);
      } catch (error) {
        console.error("Failed to fetch incident details:", error);
        alert(error.response.data.detail);
      }
    };

    fetchIncident();
  }, [id, baseURL]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseURL}/api/profiles/user/${user?.id}`, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      })
      .then((response) => setLogUser(response.data))
      .catch((error) => console.error("Error fetching profiles", error));
  }, [baseURL, user]);
  useEffect(() => {
    axios
      .get(`${baseURL}/api/escalations/incident/${id}/`, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      })
      .then((response) => setEscalation(response.data))
      .catch((error) => console.error("Error fetching escalations", error));
  }, [baseURL, user, refreshEscaltion]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/incidents/${id}/tasks/`,
          {
            headers: {
              Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
            },
          }
        );
        setTasks(response.data.sort((a, b) => a.step - b.step));
      } catch (error) {
        console.error("Failed to fetch incident details:", error);
      }
    };

    fetchTasks();
  }, [id, baseURL, refreshTasks]);
  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/workflows/`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
        setWorkflows(response.data);
      } catch (error) {
        console.error("Failed to fetch incident details:", error);
      }
    };

    fetchWorkflow();
  }, [id, baseURL]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/faculties/`, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      })
      .then((response) => setFaculties(response.data))
      .catch((error) => console.error("Error fetching faculties:", error));
  }, [baseURL]);

  useEffect(() => {
    const fetchResolutions = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/resolutions/incident/${id}`,
          {
            headers: {
              Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
            },
          }
        );
        setResolutions(response.data);
      } catch (error) {
        console.error("Error fetching resolutions:", error);
      }
    };

    fetchResolutions();
  }, [baseURL, resolutionsReset]);
  useEffect(() => {
    if (incident && incident.faculty) {
      axios
        .get(`${baseURL}/api/buildings/?faculty=${incident.faculty}`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        })
        .then((response) => setBuildings(response.data))
        .catch((error) => console.error("Error fetching buildings:", error));
    }
  }, [incident?.faculty, baseURL]);

  useEffect(() => {
    if (incident && incident.building) {
      axios
        .get(`${baseURL}/api/buildings/${incident.building}/`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        })
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
        .get(`${baseURL}/api/classrooms/?building=${incident.building}`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        })
        .then((response) => setClassrooms(response.data))
        .catch((error) => console.error("Error fetching classrooms:", error));
    }
  }, [incident?.building, baseURL]);

  useEffect(() => {
    if (incident && incident.building && incident.floor !== "") {
      axios
        .get(
          `${baseURL}/api/classrooms/?building=${incident.building}&floor=${incident.floor}`,
          {
            headers: {
              Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
            },
          }
        )
        .then((response) => setClassrooms(response.data))
        .catch((error) => console.error("Error fetching classrooms:", error));
    }
  }, [incident?.building, incident?.floor, baseURL]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/incident-types/`, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      })
      .then((response) => setIncidentTypes(response.data))
      .catch((error) => console.error("Error fetching incident types:", error));
  }, [baseURL]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/teams/`, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      })
      .then((response) => setTeams(response.data))
      .catch((error) => console.error("Error fetching teams:", error));
  }, [baseURL]);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/profiles/`, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      })
      .then((response) => setProfiles(response.data))
      .catch((error) => console.error("Error fetching profiles:", error));
  }, [baseURL]);

  const handleSelectedTaskSelectChange = (e) => {
    const { name, value } = e.target;
    setSelectedTask((prevIncident) => ({
      ...prevIncident,
      [name]: value,
    }));
  };
  const handleSelectedTaskSubmit = async () => {
    await axios.put(`${baseURL}/api/tasks/${selectedTask.id}/`, selectedTask, {
      headers: {
        Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
      },
    });
    handleEditTaskClose();
    setRefreshTasks(!refreshTasks);
  };
  const handleDeleteSelectedTask = async (id) => {
    setEmailLoading(true);
    await axios.delete(`${baseURL}/api/tasks/${id}/`, {
      headers: {
        Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
      },
    });
    setRefreshTasks(!refreshTasks);
    setEmailLoading(false);
  };

  const handleIncidentInputChange = (e) => {
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
      await axios.put(`${baseURL}/api/incidents/${id}/`, incident, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      });
    } catch (error) {
      console.error("Failed to update incident:", error);
    } finally {
      setIsEditable(false);
    }
  };
  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/incidents/${id}`, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      });
      navigate("/incident");
      console.log("Incident deleted successfully");
    } catch (error) {
      console.error("Failed to delete incident:", error);
    }
  };

  const handleResolve = () => {
    setResolveDialogOpen(true);
  };

  const handleAddTask = () => {
    setDialogAddaTaskOpen(true);
  };

  const handleEditTask = async (id) => {
    setDialogEditTaskOpen(true);
    const response = await axios.get(`${baseURL}/api/tasks/${id}/`, {
      headers: {
        Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
      },
    });
    setSelectedTask(response.data);
  };

  const handleSendMail = async () => {
    try {
      setEmailLoading(true);
      const uniqueTaskTo = [...new Set(tasks.map((task) => task.task_to))];
      console.log(uniqueTaskTo);
      if (uniqueTaskTo) {
        setIncident((prevIncident) => ({
          ...prevIncident,
          assigned_to: uniqueTaskTo,
        }));
        handleSave();
      }
    } catch {}
    handleSave();

    if (incident) {
      try {
        handleSave();
        // Call the API to send emails with the CSRF token
        const response = await axios.post(
          `${baseURL}/api/incidents/${id}/send-mail/`,
          {},
          {
            headers: {
              "X-CSRFToken": "EHxKPGqz0S9xMYMvd95gAj5xtnueUgAB",
              Authorization: `Token ${token}`,
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
          alert("Failed to send Mail");
        }
        // Update incident status
      } catch (error) {
        alert(error.response.data.error);
      } finally {
        setEmailLoading(false); // Hide spinner and re-enable page
      }
      handleSave();
    }
  };

  const handleEscalate = () => {
    setEscalateDialogOpen(true);
  };

  const handleEscalateConfirm = async () => {
    try {
      const escalationData = {
        escalated_by: logUser.id,
        escalated_to: [escalatedTo],
        incident: id,
        escalation_type: escalationType,
        previous_level: previousLevel,
        new_level: newLevel,
        comments: escalationNote,
      };
      await axios.post(`${baseURL}/api/escalations/`, escalationData, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      });
      setIncident((prevIncident) => ({
        ...prevIncident,
        status: "Escalated",
      }));
      console.log("Incident escalated successfully");
      setEscalateDialogOpen(false);
    } catch (error) {
      console.error("Failed to escalate incident:", error);
    } finally {
      setRefreshEscaltion(!refreshEscaltion);
    }

    // try {
    //   await axios.put(`${baseURL}/api/incidents/${id}/`, incident, {
    //     headers: {
    //       Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
    //     },
    //   });
    //   console.log("incident successfully saved");
    // } catch (error) {
    //   console.error("Failed to update incident:", error);
    // }
  };

  const handleEscalateClose = () => {
    setEscalateDialogOpen(false);
  };

  const handleEscalationNoteChange = (e) => {
    setEscalationNote(e.target.value);
  };

  const handleEscalatedToChange = (e) => {
    setEscalatedTo(e.target.value);
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

  const handleAddaTaskClose = async () => {
    setDialogAddaTaskOpen(false);
  };

  const handleEditTaskClose = () => {
    setDialogEditTaskOpen(false);
  };

  const handleSaveResolveClose = async () => {
    if (incident) {
      await updateItemStatus(baseURL, id, incident, "Resolved", {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      });
      setIncident((prevIncident) => ({
        ...prevIncident,
        status: "Resolved",
      }));
      setResolutionsReset(!resolutionsReset);
    }
  };

  const handleAccept = async () => {
    if (incident) {
      await updateItemStatus(baseURL, id, incident, "In Progress", {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      });
      setIncident((prevIncident) => ({
        ...prevIncident,
        status: "In Progress",
      }));
    }
  };

  const handleReject = async () => {
    if (incident) {
      await updateItemStatus(baseURL, id, incident, "Rejected", {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      });
      setIncident((prevIncident) => ({
        ...prevIncident,
        status: "Rejected",
      }));
    }
  };

  const handleClose = async () => {
    if (incident) {
      await updateItemStatus(baseURL, id, incident, "Closed", {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      });
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

  if (!incident) {
    return (
      <Typography>
        You Don't Have Permission to View Ask Your Supervisor
      </Typography>
    );
  }
  function getRandomIds(data, count) {
    const ids = data.map((item) => item.id);

    const shuffled = ids.sort(() => 0.5 - Math.random());

    const selectedIds = shuffled.slice(0, count);

    return selectedIds;
  }

  const createTasks = async () => {
    setEmailLoading(true);
    if (incident.workflow) {
      const response = await axios.get(
        `${baseURL}/api/workflows/${incident.workflow}/steps/`,
        {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        }
      );

      setSteps(response.data);

      try {
        response.data.forEach(async (element) => {
          let data = {
            step: element.step,
            name: element?.name,
            completed: false,
            forfeited: false,
            incident: incident.id,
            created_by: logUser.id, //hardcoded
            task_to: element.attendees.id, //hardcoded
          };
          try {
            await axios.post(`${baseURL}/api/tasks/`, data, {
              headers: {
                Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
              },
            });
          } catch (error) {
            console.log(error);
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        setEmailLoading(false);
        setRefreshTasks(true);
      }
    }
  };
  const handlePredict = async () => {
    try {
      setEmailLoading(true);
      const response = await axios.post(
        `${baseURL}/api/incident/predict/`,
        {
          description: incident.description,
        },
        {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        }
      );

      setpredictedCategory(response.data.category);
      setPredictedWorkflow(response.data.workflow);

      setIncident((prevIncident) => ({
        ...prevIncident,
        priority: response.data.priority,
      }));
      const category = incidentTypes.find(
        (category) => category.name === predictedCategory
      );
      const workflow = workflows.find(
        (workflow) => workflow.name === predictedWorkflow
      );

      if (category && workflow) {
        setIncident((prevIncident) => ({
          ...prevIncident,
          incident_type: [category?.id],
        }));
        setIncident((prevIncident) => ({
          ...prevIncident,
          workflow: workflow?.id,
        }));
      }
    } catch (err) {
      console.log(err.response ? err.response.data.error : err.message);
      setpredictedCategory(null);
    } finally {
      setEmailLoading(false);
    }
    handleSave();
  };

  return (
    <Box m="20px">
      {emailLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <div className="mt-4 text-white">Loading...</div>
          </div>
        </div>
      )}
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
      <Grid container spacing={2}>
        <Grid item xs={3} className="hidden lg:block">
          <Header
            title="INCIDENT DETAIL"
            subtitle={`Detailed view of the Incident ${incident.title}`}
          />
        </Grid>
        <div className="lg:hidden flex justify-center items-center  w-full">
          <Header
            title="INCIDENT DETAIL"
            subtitle={`Detailed view of the Incident ${incident.title}`}
          />
        </div>
        <Grid item xs={9}>
          <IncidentProgress status={incident.status} />
        </Grid>
      </Grid>

      <Grid item xs={12} mt="20px" mb="20px">
        {/* For larger screens, display the buttons directly */}
        {!isMobile ? (
          <div className="flex space-x-4">
            {incident?.status === "Open" ? (
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
            ) : (
              <>
                {isEditable ? (
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    color="secondary"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={handleEdit}
                    variant="contained"
                    color="secondary"
                  >
                    Edit
                  </Button>
                )}

                {incident?.status === "In Progress" && (
                  <Button
                    onClick={handleSendMail}
                    variant="contained"
                    color="info"
                  >
                    Assign Members
                  </Button>
                )}

                <Button
                  onClick={handleDelete}
                  variant="contained"
                  color="error"
                >
                  Delete Incident
                </Button>
                <Button onClick={handleReject} variant="outlined" color="error">
                  Reject
                </Button>

                {incident?.status === "Resolved" && (
                  <Button
                    onClick={handleClose}
                    variant="contained"
                    color="primary"
                  >
                    Close
                  </Button>
                )}

                <Button
                  onClick={createTasks}
                  variant="contained"
                  color="secondary"
                >
                  Create Tasks
                </Button>
                <Button
                  onClick={handlePredict}
                  variant="contained"
                  color="secondary"
                >
                  Classify With AI
                </Button>
              </>
            )}
          </div>
        ) : (
          // For smaller screens, show a single "Actions" button
          <>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              variant="contained"
              color="secondary"
              endIcon={<MoreVertIcon />}
            >
              Actions
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {incident?.status === "Open" ? (
                <>
                  <MenuItem
                    onClick={() => {
                      handleAccept();
                      handleMenuClose();
                    }}
                  >
                    Accept
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleReject();
                      handleMenuClose();
                    }}
                  >
                    Reject
                  </MenuItem>
                </>
              ) : (
                <>
                  {isEditable ? (
                    <MenuItem
                      onClick={() => {
                        handleSave();
                        handleMenuClose();
                      }}
                    >
                      Save
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={() => {
                        handleEdit();
                        handleMenuClose();
                      }}
                    >
                      Edit
                    </MenuItem>
                  )}

                  {incident?.status === "In Progress" && (
                    <MenuItem
                      onClick={() => {
                        handleSendMail();
                        handleMenuClose();
                      }}
                    >
                      Assign Members
                    </MenuItem>
                  )}

                  <MenuItem
                    onClick={() => {
                      handleDelete();
                      handleMenuClose();
                    }}
                  >
                    Delete Incident
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleReject();
                      handleMenuClose();
                    }}
                  >
                    Reject
                  </MenuItem>

                  {incident?.status === "Resolved" && (
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        handleMenuClose();
                      }}
                    >
                      Close
                    </MenuItem>
                  )}

                  <MenuItem
                    onClick={() => {
                      createTasks();
                      handleMenuClose();
                    }}
                  >
                    Create Tasks
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        )}
      </Grid>

      <Grid item xs={12} className="border-t border-gray-300">
        <Tabs
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
          <Tab className="mr-4" label="Details" />
          <Tab className="mr-4 border border-transparent" label="Tasks" />
          <Tab className="mr-4 border border-transparent" label="Resolutions" />
          <Tab
            className="mr-4 border border-transparent"
            label="Escalation History"
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Box>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First column */}
              <div>
                <TextField
                  color="info"
                  label="Title"
                  name="title"
                  value={incident.title}
                  onChange={handleIncidentInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!isEditable}
                />
                <TextField
                  color="info"
                  label="Description"
                  name="description"
                  value={incident.description}
                  onChange={handleIncidentInputChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  disabled={!isEditable}
                />
                <TextField
                  color="info"
                  label="User"
                  name="user_name"
                  disabled={true}
                  value={incident.user_name}
                  onChange={handleIncidentInputChange}
                  fullWidth
                  margin="normal"
                />
                <FormControl
                  color="info"
                  fullWidth
                  margin="normal"
                  disabled={!isEditable}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    color="info"
                    label="Status"
                    name="status"
                    value={incident.status}
                    onChange={handleSelectChange}
                    fullWidth
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
                <FormControl
                  color="info"
                  fullWidth
                  margin="normal"
                  disabled={!isEditable}
                >
                  <InputLabel>Priority</InputLabel>
                  <Select
                    color="info"
                    label="Priority"
                    name="priority"
                    value={incident.priority}
                    onChange={handleSelectChange}
                    fullWidth
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Second column */}
              <div>
                <Autocomplete
                  disabled={!isEditable}
                  multiple
                  options={incidentTypes}
                  getOptionLabel={(option) => option.name}
                  value={incidentTypes.filter((type) =>
                    incident?.incident_type?.includes(type.id)
                  )}
                  onChange={handleIncidentTypeChange}
                  renderInput={(params) => (
                    <TextField
                      color="info"
                      {...params}
                      label="Incident Type"
                      fullWidth
                      margin="normal"
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
                      color="info"
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
                      color="info"
                      {...params}
                      label="Assigned To"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <FormControl
                  color="info"
                  fullWidth
                  margin="normal"
                  disabled={!isEditable}
                >
                  <InputLabel>Workflow</InputLabel>
                  <Select
                    color="info"
                    label="Workflow"
                    name="workflow"
                    value={incident.workflow}
                    onChange={handleSelectChange}
                    fullWidth
                  >
                    {workflows.map((workflow) => (
                      <MenuItem key={workflow.id} value={workflow.id}>
                        {workflow.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  color="info"
                  fullWidth
                  margin="normal"
                  disabled={!isEditable}
                >
                  <InputLabel>Faculty</InputLabel>
                  <Select
                    color="info"
                    label="Faculty"
                    name="faculty"
                    value={incident.faculty}
                    onChange={handleSelectChange}
                    fullWidth
                  >
                    {faculties.map((faculty) => (
                      <MenuItem key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  color="info"
                  fullWidth
                  margin="normal"
                  disabled={!isEditable}
                >
                  <InputLabel>Building</InputLabel>
                  <Select
                    color="info"
                    label="Building"
                    name="building"
                    value={incident.building}
                    onChange={handleSelectChange}
                    fullWidth
                  >
                    {buildings.map((building) => (
                      <MenuItem key={building.id} value={building.id}>
                        {building.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  color="info"
                  fullWidth
                  margin="normal"
                  disabled={!isEditable}
                >
                  <InputLabel>Floor</InputLabel>
                  <Select
                    color="info"
                    label="Floor"
                    name="floor"
                    value={incident.floor}
                    onChange={handleSelectChange}
                    fullWidth
                  >
                    {floors.map((floor) => (
                      <MenuItem key={floor} value={floor}>
                        {floor}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  color="info"
                  fullWidth
                  margin="normal"
                  disabled={!isEditable}
                >
                  <InputLabel>Classroom</InputLabel>
                  <Select
                    color="info"
                    label="Classroom"
                    name="classroom"
                    value={incident.classroom}
                    onChange={handleSelectChange}
                    fullWidth
                  >
                    {classrooms.map((classroom) => (
                      <MenuItem key={classroom.id} value={classroom.id}>
                        {classroom.number}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
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
        {resolutions && (
          <TabPanel value={value} index={2}>
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
              <Button onClick={handleResolve} variant="contained" color="info">
                Resolve Incident
              </Button>
              <DataGrid
                autoPageSize
                className="cursor-pointer"
                rows={resolutions}
                columns={Resolutioncolumns}
              />
            </Box>
          </TabPanel>
        )}
        <TabPanel value={value} index={1}>
          <div className="flex space-x-4">
            <Button
              onClick={handleAddTask}
              variant="outlined"
              color="secondary"
            >
              Add a Task
            </Button>
          </div>

          <Box
            m="20px 0 0 0"
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
            <DataGrid
              autoPageSize
              className="cursor-pointer"
              rows={tasks}
              columns={Taskcolumns}
            />
          </Box>
        </TabPanel>
        <TabPanel value={value} index={3}>
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
            {incident?.status === "Assign" && (
              <>
                {incident?.status !== "Escalated" && (
                  <Button
                    onClick={handleEscalate}
                    variant="contained"
                    color="warning"
                  >
                    Escalate Incident
                  </Button>
                )}
              </>
            )}
            <DataGrid
              autoPageSize
              className="cursor-pointer"
              rows={escalations}
              columns={EscaltionHistorycolumns}
            />
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
        profiles={profiles}
        handleSelectChange={handleEscalatedToChange}
      />
      <ResolveIncidentDialog
        incident={incident}
        open={resolveDialogOpen}
        onClose={handleResolveClose}
        save={handleSaveResolveClose}
        teams={incident?.teams}
        incidentId={id}
      />
      <EditTaskDialogue
        isOpen={isDialogEditTaskOpen}
        handleClose={handleEditTaskClose}
        data={selectedTask}
        handleInputChange={(e) => handleInputChange(e, setSelectedTask)}
        handleSelectedTaskSelectChange={handleSelectedTaskSelectChange}
        handleSelectedTaskSubmit={handleSelectedTaskSubmit}
      />
      <AddNewTaskDialogue
        isOpen={isDialogAddaTaskOpen}
        handleClose={handleAddaTaskClose}
        taskData={tasks}
        logUserData={logUser.id}
        incident_id={id}
        refreshTasks={() => {
          setRefreshTasks(!refreshTasks);
        }}
      />
      <Dialog open={isForfeitDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Enter Forfeit Reason</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for forfeiting this task.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Forfeit Reason"
            type="text"
            fullWidth
            value={forfeitReason}
            onChange={(e) => setForfeitReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitForfeit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default DetailIncident;

// TODO: Resolve BUTTON TO BE VISIBLE AND INVISIBLE
// TODO: ESCALATE BUTTON TO BE VISIBLE AND INVISIBLE
// TODO: UPDATE BUTTON TO BE REMOVE MAKE  SAVE TO BE INSTANTENOUS
