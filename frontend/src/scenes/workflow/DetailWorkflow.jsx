import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import makeRequest, { handleInputChange } from "../../hooks/utils";
import StepTable from "../../components/StepTable";
import { TabPanel } from "../../components/TabPanel";
import axios from "axios";

function DetailWorkflow() {
  const { id } = useParams();
  const theme = useTheme();
  const [workflow, setWorkflow] = useState(null);
  const [steps, setSteps] = useState([]);
  const [category, setCategory] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [value, setValue] = React.useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const [open, setOpen] = useState(false);
  const [refreshSteps, setRefreshSteps] = useState(false); // New state to trigger fetching steps
  const [formData, setFormData] = useState({
    name: "",
    attendees: "",
    category: workflow?.category || "",
    step: workflow?.number_of_steps + 1,
  });
  const [filteredSteps, setFilteredSteps] = useState([]);

  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const handleStepChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStepSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}/api/workflow/${id}/add_step/`, formData, {
        headers: {
          Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
        },
      });
      setRefreshSteps((prev) => !prev);
    } catch (error) {
      console.error("Failed to fetch team details:", error);
    } finally {
      handleClose();
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/workflows/${id}`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
        setWorkflow(response.data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchWorkflow();
  }, [id, refreshSteps]);

  useEffect(() => {
    if (workflow) {
      setFormData({
        name: "",
        attendees: "",
        category: workflow?.category || "",
        step: workflow?.number_of_steps + 1,
      });
    }
  }, [workflow]);
  useEffect(() => {
    if (workflow && steps.length > 0) {
      const updatedFilteredSteps = steps
        .filter((step) => workflow?.steps.includes(step.id))
        .slice()
        .sort((a, b) => (a.step < b.step ? -1 : 1));

      setFilteredSteps(updatedFilteredSteps);
    }
  }, [steps, workflow]);
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/profiles/`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
        setProfiles(response.data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };
    fetchProfiles();
  }, [id]);

  // Fetch steps whenever refreshSteps changes
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/view-only-steps/`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
        setSteps(response.data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchSteps();
  }, [id, refreshSteps]); // Add refreshSteps as a dependency

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/incident-types/`, {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
        setCategory(response.data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchCategory();
  }, [id]);

  if (!workflow) {
    return <Typography>Loading...</Typography>;
  }

  const handleStaffChange = (event) => {
    setWorkflow((prevProfiles) => ({
      ...prevProfiles,
      emmergency: event.target.checked,
    }));
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setWorkflow((prevIncident) => ({
      ...prevIncident,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${baseURL}/api/workflows/${id}/`, workflow, {
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
  const refresh = () => {
    setRefreshSteps((prev) => !prev);
  };

  return (
    <Box m="20px">
      <Header
        title="Workflow DETAIL"
        subtitle={`Detailed view of workflow ${workflow.name}`}
      />
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
          <Tab label="Details" />
          <Tab sx={{ marginLeft: "15px" }} label="Steps" />
        </Tabs>
        <TabPanel value={value} index={0}>
          {isEditable && (
            <Button
              onClick={() => handleSave()}
              variant="contained"
              color="secondary"
            >
              Save
            </Button>
          )}
          {!isEditable && value === 0 && (
            <Button
              onClick={() => handleEdit()}
              variant="contained"
              color="secondary"
            >
              Edit
            </Button>
          )}
          <Grid sx={{ mt: "10px" }} container spacing={2}>
            <Grid item xs={6}>
              <TextField
                color="info"
                label="Workflow Title"
                name="name"
                value={workflow.name}
                onChange={(e) => handleInputChange(e, setWorkflow)}
                fullWidth
                margin="normal"
                disabled={!isEditable}
              />

              <FormControl
                color="info"
                fullWidth
                margin="normal"
                disabled={!isEditable}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  color="info"
                  label="Category"
                  name="category"
                  value={workflow.category}
                  onChange={handleSelectChange}
                  fullWidth
                  margin="normal"
                >
                  {category.map((categ) => (
                    <MenuItem key={categ.id} value={categ.id}>
                      {categ.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                color="info"
                label="Designed By"
                // name="created_by"
                value={workflow.created_by.user_name}
                // onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={true}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={workflow.emmergency}
                    onChange={handleStaffChange}
                    name="staffCheckbox"
                    color="secondary"
                    disabled={!isEditable}
                  />
                }
                label="Emmergency"
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Box>
            <Button
              onClick={handleClickOpen}
              variant="outlined"
              color="secondary"
            >
              Add Step
            </Button>
            <Box marginTop={"20px"}>
              <StepTable steps={filteredSteps} refresh={refresh} />
            </Box>
          </Box>
        </TabPanel>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New Step</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              color="info"
              label="Step Name"
              name="name"
              value={formData.name}
              onChange={handleStepChange}
              fullWidth
              margin="normal"
              required
            />
            <FormControl color="info" fullWidth margin="normal" required>
              <InputLabel>Attendees</InputLabel>
              <Select
                color="info"
                label="Attendees"
                name="attendees"
                value={formData.attendees}
                onChange={handleStepSelectChange}
                fullWidth
                margin="normal"
              >
                {profiles.map((prof) => (
                  <MenuItem key={prof.id} value={prof.id}>
                    {prof.user_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl color="info" fullWidth margin="normal" disabled={true}>
              <InputLabel>Category</InputLabel>
              <Select
                color="info"
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleStepSelectChange}
                fullWidth
                margin="normal"
              >
                {category.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              color="info"
              label="Step"
              name="step"
              value={formData.step}
              onChange={handleStepChange}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }} // Make this field read-only if it's automatically calculated
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button type="submit" color="secondary">
              Add Step
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default DetailWorkflow;
