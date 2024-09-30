import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import makeRequest, { handleInputChange } from "../hooks/utils";

const AddNewTaskDialogue = ({
  isOpen,
  handleClose,
  taskData,
  logUserData,
  incident_id,
  refreshTasks,
}) => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [profiles, setProfile] = useState([]);
  const [addTaskData, setAddTaskData] = useState({
    created_by: logUserData,
    name: "",
    step: taskData.length + 1 || 1,
    task_to: "",
    incident: incident_id,
  });
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setAddTaskData((prevIncident) => ({
      ...prevIncident,
      [name]: value,
    }));
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/api/profiles/`)
      .then((response) => setProfile(response.data))
      .catch((error) => console.error("Error fetching profiles:", error));
  }, [baseURL]);

  useEffect(() => {
    setAddTaskData({
      created_by: logUserData,
      name: "",
      step: taskData.length + 1 || 1,
      task_to: "",
      incident: incident_id,
    });
  }, [profiles]);

  const handleSelectedTaskSubmit = async (event) => {
    event.preventDefault();
    await makeRequest("POST", `/api/tasks/`, addTaskData);
    refreshTasks();
    handleClose();
  };
  return (
    <Dialog fullWidth={true} open={isOpen} onClose={handleClose}>
      <DialogTitle>Add a Task</DialogTitle>
      <form onSubmit={handleSelectedTaskSubmit}>
        <DialogContent>
          <FormControl disabled required color="info" fullWidth margin="normal">
            <InputLabel>Created By</InputLabel>
            <Select
              color="info"
              label="Created By"
              name="created_by"
              value={addTaskData.created_by}
              onChange={handleSelectChange}
              fullWidth
              margin="normal"
            >
              {profiles.map((profile) => (
                <MenuItem key={profile.id} value={profile.id}>
                  {profile.user_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            color="info"
            label="Task Name"
            name="name"
            value={addTaskData.name}
            onChange={(e) => handleInputChange(e, setAddTaskData)}
            fullWidth
            margin="normal"
            required
          />
          <FormControl required color="info" fullWidth margin="normal">
            <InputLabel>Task To</InputLabel>
            <Select
              color="info"
              label="Task To"
              name="task_to"
              value={addTaskData.task_to}
              onChange={handleSelectChange}
              fullWidth
              margin="normal"
            >
              {profiles.map((profile) => (
                <MenuItem key={profile.id} value={profile.id}>
                  {profile.user_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button variant="outlined" color="secondary" type="submit">
            Add Step
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddNewTaskDialogue;
