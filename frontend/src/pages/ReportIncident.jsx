import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import makeRequest from "../hooks/utils";

export function ReportIncident() {
  const baseURL = import.meta.env.VITE_API_URL;
  const [cookies] = useCookies(["user"]);
  const user = cookies.user;

  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const getUserLocation = (callback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          callback({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
          callback(null);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      callback(null);
    }
  };

  const [formData, setFormData] = useState({
    user: user?.id,
    title: "",
    description: "",
    floor: null,
    faculty: "",
    building: "",
    classroom: "",
    status: "Open",
    team: [],
    email: "",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    axios
      .get(`${baseURL}/api/faculties/`)
      .then((response) => setFaculties(response.data))
      .catch((error) => console.error("Error fetching faculties:", error));
  }, [baseURL]);

  useEffect(() => {
    if (formData.faculty) {
      axios
        .get(`${baseURL}/api/buildings/?faculty=${formData.faculty}`)
        .then((response) => setBuildings(response.data))
        .catch((error) => console.error("Error fetching buildings:", error));
    }
  }, [formData.faculty, baseURL]);

  useEffect(() => {
    if (formData.building) {
      axios
        .get(`${baseURL}/api/buildings/${formData.building}/`)
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
        .get(`${baseURL}/api/classrooms/?building=${formData.building}`)
        .then((response) => setClassrooms(response.data))
        .catch((error) => console.error("Error fetching classrooms:", error));
    }
  }, [formData.building, baseURL]);

  useEffect(() => {
    if (formData.building && formData.floor !== "") {
      axios
        .get(
          `${baseURL}/api/classrooms/?building=${formData.building}&floor=${formData.floor}`
        )
        .then((response) => setClassrooms(response.data))
        .catch((error) => console.error("Error fetching classrooms:", error));
    }
  }, [formData.building, formData.floor, baseURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    getUserLocation(async (location) => {
      if (location) {
        formData.latitude = location.latitude;
        formData.longitude = location.longitude;
      }
      try {
        const response = await axios.post(
          `${baseURL}/api/incidents/`,
          formData
        );
        console.log(response.data);
        navigate("/");
      } catch (error) {
        console.error("Error reporting incident:", error.response);
        alert(error.response.data);
      }
    });
    try {
      await axios.post(
        `${baseURL}/api/notifications/`,
        {
          user: 2,
          message: `Incident with title ${formData.title} and description ${formData.description} has been logged by user ${formData?.user}`,
          read_status: false,
        }
      );
    } catch {}
  };

  return (
    <div className="flex justify-center items-center mt-6 mb-8">
      <Card sx={{ maxWidth: 500, p: 3 }}>
        <CardContent>
          <Typography variant="h4" color="primary" gutterBottom>
            Report An Incident
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Please fill the form below to log an incident!
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              multiline
              rows={4}
            />
            <TextField
              select
              label="Faculty"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={!faculties.length}
            >
              {faculties.length ? (
                faculties.map((faculty) => (
                  <MenuItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Loading faculties...</MenuItem>
              )}
            </TextField>
            <TextField
              select
              label="Building"
              name="building"
              value={formData.building}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={!buildings.length}
            >
              {buildings.length ? (
                buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  Select a faculty to load buildings...
                </MenuItem>
              )}
            </TextField>
            <TextField
              select
              label="Floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={!floors.length}
            >
              {floors.length ? (
                floors.map((floor) => (
                  <MenuItem key={floor} value={floor}>
                    {`Floor ${floor}`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  Select a building to load floors...
                </MenuItem>
              )}
            </TextField>
            <TextField
              select
              label="Classroom"
              name="classroom"
              value={formData.classroom}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={!classrooms.length}
            >
              {classrooms.length ? (
                classrooms.map((classroom) => (
                  <MenuItem key={classroom.id} value={classroom.id}>
                    {classroom.number}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  Select a floor to load classrooms...
                </MenuItem>
              )}
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Create Incident
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
