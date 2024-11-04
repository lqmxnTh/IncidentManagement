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

const EditTaskDialogue = ({
  isOpen,
  handleClose,
  data,
  handleInputChange,
  handleSelectedTaskSelectChange,
  handleSelectedTaskSubmit,
}) => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [profiles, setProfile] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get(`${baseURL}/api/profiles/`,
        {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        })
      .then((response) => setProfile(response.data))
      .catch((error) => console.error("Error fetching profiles:", error));
  }, [baseURL]);

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <DialogContent>
          <TextField
            color="info"
            label="Task Name"
            name="name"
            value={data.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <FormControl color="info" fullWidth margin="normal">
            <InputLabel>Task To</InputLabel>
            <Select
              color="info"
              label="Task To"
              name="task_to"
              value={data.task_to}
              onChange={handleSelectedTaskSelectChange}
              fullWidth
              margin="normal"
            >
              {profiles.map((profiles) => (
                <MenuItem key={profiles.id} value={profiles.id}>
                  {profiles.user_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleSelectedTaskSubmit}
            color="secondary"
          >
            Edit Step
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialogue;
