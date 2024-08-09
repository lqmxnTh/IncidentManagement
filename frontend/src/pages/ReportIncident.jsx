import {
  Card,
  Input,
  Select,
  Option,
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

export function ReportIncident() {
  const baseURL = import.meta.env.VITE_API_URL;
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
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
          console.error('Error getting user location:', error);
          callback(null);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      callback(null);
    }
  };

  const [formData, setFormData] = useState({
    "user": user?.id,
    "title": "",
    "description": "",
    "floor": null,
    "faculty": null,
    "building": null,
    "classroom": null,
    "status": "Open",
    "team": [],
    "email": "",
    "latitude": null,
    "longitude": null,
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

  const handleSelectChange = (name, value) => {
    const parsedValue = isNaN(value) ? value : parseInt(value, 10);
    setFormData({ ...formData, [name]: parsedValue });
  };

  useEffect(() => {
    console.log("Form data:", formData);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    getUserLocation(async (location) => {
      if (location) {
        formData.latitude = location.latitude;
        formData.longitude = location.longitude;
      }
      try {
        const response = await axios.post(`${baseURL}/api/incidents/`, formData);
        console.log(response.data);
        navigate("/");
      } catch (error) {
        console.error("Error reporting incident:", error.response);
        alert(error.response.data);
      }
    });
  };

  return (
    <div className="flex justify-center items-center mt-6 mb-8">
      <Card className="p-5" color="white" shadow={true}>
        <Typography variant="h4" color="blue-gray">
          Report An Incident
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Please fill the form below to log an incident!
        </Typography>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Title
            </Typography>
            <Input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              size="lg"
              placeholder="Broken Fan"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Description
            </Typography>
            <Textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              size="lg"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Faculty
            </Typography>
            <Select
              required
              name="faculty"
              value={formData.faculty}
              onChange={(value) => handleSelectChange("faculty", value)}
              size="lg"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              disabled={!faculties.length}
            >
              {faculties.length ? (
                faculties.map((faculty) => (
                  <Option key={faculty.id} value={String(faculty.id)}>
                    {faculty.name}
                  </Option>
                ))
              ) : (
                <Option disabled>Loading faculties...</Option>
              )}
            </Select>
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Building
            </Typography>
            <Select
              required
              name="building"
              value={formData.building}
              onChange={(value) => handleSelectChange("building", value)}
              size="lg"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              disabled={!buildings.length}
            >
              {buildings.length ? (
                buildings.map((building) => (
                  <Option key={String(building.id)} value={String(building.id)}>
                    {building.name}
                  </Option>
                ))
              ) : (
                <Option disabled>Select a faculty to load buildings...</Option>
              )}
            </Select>
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Floor
            </Typography>
            <Select
              required
              name="floor"
              value={formData.floor}
              onChange={(value) => handleSelectChange("floor", value)}
              size="lg"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              disabled={!floors.length}
            >
              {floors.length ? (
                floors.map((floor) => (
                  <Option key={String(floor)} value={String(floor)}>
                    {`Floor ${floor}`}
                  </Option>
                ))
              ) : (
                <Option disabled>Select a building to load floors...</Option>
              )}
            </Select>
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Classroom
            </Typography>
            <Select
              required
              name="classroom"
              value={formData.classroom}
              onChange={(value) => handleSelectChange("classroom", value)}
              size="lg"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              disabled={!classrooms.length}
            >
              {classrooms.length ? (
                classrooms.map((classroom) => (
                  <Option
                    key={String(classroom.id)}
                    value={String(classroom.id)}
                  >
                    {classroom.number}
                  </Option>
                ))
              ) : (
                <Option disabled>Select a floor to load classrooms...</Option>
              )}
            </Select>
          </div>
          <Button className="mt-6" fullWidth type="submit">
            Create Incident
          </Button>
        </form>
      </Card>
    </div>
  );
}
