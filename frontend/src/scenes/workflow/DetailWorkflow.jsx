import React, { useEffect, useState } from "react";
import {
  Box,
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
} from "@mui/material";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import makeRequest, {
  handleInputChange,
  handleSelectChangeWithFullData,
} from "../../hooks/utils";
import StepTable from "../../components/StepTable";
import { TabPanel } from "../../components/TabPanel";

function DetailWorkflow() {
  const { id } = useParams();
  const theme = useTheme();
  const [workflow, setWorkflow] = useState(null);
  const [steps, setSteps] = useState([]);
  const [category, setCategory] = useState([]);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    async function fetchWorkflow() {
      const response = await makeRequest("GET", `api/workflows/${id}`);
      setWorkflow(response);
    }

    fetchWorkflow();
  }, [id]);
  useEffect(() => {
    async function fetchSteps() {
      const response = await makeRequest("GET", `api/steps/`);
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
                //   disabled={!isEditable}
              />

              <FormControl
                color="info"
                fullWidth
                margin="normal"
                // disabled={!isEditable}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  color="info"
                  label="Category"
                  name="category"
                  value={workflow.category.id}
                  onChange={(e) =>
                    handleSelectChangeWithFullData(e, category, setWorkflow)
                  }
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
                  />
                }
                label="Emmergency"
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Box>
            <StepTable className="mt-7" steps={steps} />
          </Box>
        </TabPanel>
      </Grid>
    </Box>
  );
}

export default DetailWorkflow;
