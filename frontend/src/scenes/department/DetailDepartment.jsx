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

const DetailDepartment = () => {
  const { id } = useParams();
  const baseURL = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [allDepartments, setAllDepartments] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/departments/${id}/`);
        setAllDepartments(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, [id, baseURL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAllDepartments((preDeparment) => ({
      ...preDeparment,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${baseURL}/api/departments/${id}/`, allDepartments);
      navigate("/departments");
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/departments/${id}`);
      navigate("/departments");
      console.log("Department deleted successfully");
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  };

  if (!allDepartments) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="20px">
      <Header title="Department DETAIL" subtitle="Detailed view of departments" />
      <Box m="40px 0">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              name="name"
              value={allDepartments.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
      </Box>
      <Grid item xs={12} mt="20px">
        <div className="flex space-x-4">
          <Button onClick={handleSave} variant="contained" color="secondary">
            Update Deaprtment
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete Deparment
          </Button>
        </div>
      </Grid>
    </Box>
  );
};

export default DetailDepartment;
