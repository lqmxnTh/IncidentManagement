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
  const [formData, setFormData] = useState({
    name: "",
    attendees: "", // Default to empty string to avoid null issues
    category: workflow?.category || "",
    step: workflow?.number_of_steps + 1,
  });

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
      [name]: [value],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your form submission logic here
    console.log("Form data submitted:", formData);
    // For example, you might want to send `formData` to a server or update state
    handleClose(); // Close the dialog on successful submission
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    try {
      console.log(formData, workflow.category);
      await makeRequest("POST", `api/workflow/${id}/add_step/`, formData);
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    async function fetchWorkflow() {
      const response = await makeRequest("GET", `api/workflows/${id}`);
      setWorkflow(response);
    }

    fetchWorkflow();
  }, [id]);
  useEffect(() => {
    if (workflow) {
      // Update formData when workflow is fetched
      setFormData({
        name: "",
        attendees: "",
        category: workflow?.category || "",
        step: workflow?.number_of_steps + 1,
      });
    }
  }, [workflow]);
  useEffect(() => {
    async function fetchProfiles() {
      const response = await makeRequest("GET", `/api/profiles/`);
      setProfiles(response);
    }
    fetchProfiles();
  }, [id]);

  useEffect(() => {
    async function fetchSteps() {
      const response = await makeRequest("GET", `api/view-only-steps/`);
      setSteps(response);
    }

    fetchSteps();
  }, [id]);

  useEffect(() => {
    async function fetchCategory() {
      const response = await makeRequest("GET", `api/incident-types/`);
      setCategory(response);
    }

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
      await makeRequest("PUT", `api/workflows/${id}/`, workflow);
    } catch (error) {
      console.error("Failed to update incident:", error);
    } finally {
      setIsEditable(false);
    }
  };
  const handleEdit = () => {
    setIsEditable(true);
  };

  return (
    <Box m="20px">
      <Header
        title="Workflow DETAIL"
        subtitle={`Detailed view of workflow ${workflow.name}`}
      />
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

      <Grid
        marginTop={"30px"}
        item
        xs={12}
        className="border-t border-gray-300"
      >
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
          <Grid container spacing={2}>
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
              <StepTable
                steps={steps
                  .filter((step) => workflow?.steps.includes(step.id))
                  .slice()
                  .sort((a, b) => {
                    if (a.step < b.step) return -1;
                    if (a.step > b.step) return 1;
                    return 0;
                  })}
              />
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
