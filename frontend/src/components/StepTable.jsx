import React, { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import makeRequest from "../hooks/utils";
import { useParams } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";

function StepTable({ steps, refresh }) {
  const { id } = useParams();
  const [reorderedSteps, setReorderedSteps] = useState(steps);
  const [emailLoading, setEmailLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAttendees, setEditAttendees] = useState("");
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;
  const [editAttendeeId, setEditAttendeeId] = useState("");
  const [profiles, setProfiles] = useState([]);

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
        console.error("Failed to fetch team details:", error);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    setReorderedSteps(steps);
  }, [steps]);

  function SaveStepsOrder(arr) {
    try {
      arr.forEach(async (element, index) => {
        let formatData = { step: index + 1 };
        await axios.put(
          `${baseURL}/api/update-steps/${element.id}/`,
          formatData,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        console.log("Order saved for", element.name);
      });
    } catch {
    } finally {
      setEmailLoading(false);
    }
  }

  const handleReorder = (newOrder) => {
    setReorderedSteps(newOrder);
    setTimeout(() => {
      SaveStepsOrder(newOrder);
    }, 5000);
    setEmailLoading(true);
  };

  const handleEditClick = (step) => {
    setSelectedStep(step);
    setEditName(step.name);
    setEditAttendeeId(step.attendees?.id || "");  // Use the attendee's ID here
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    try {
      setEmailLoading(true);
      const updatedData = { name: editName, attendees: editAttendeeId }; // Send attendee ID as expected by the API
      await axios.put(
        `${baseURL}/api/update-steps/${selectedStep.id}/`,
        updatedData,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      const updatedSteps = reorderedSteps.map((step) =>
        step.id === selectedStep.id ? { ...step, ...updatedData } : step
      );
      setReorderedSteps(updatedSteps);
    } catch (error) {
      console.error("Error updating step:", error);
    } finally {
      setEditOpen(false);
      refresh()
      setEmailLoading(false);
    }
  };

  const handleDelete = async (stepId) => {
    if (window.confirm("Are you sure you want to delete this step?")) {
      try {
        await axios.delete(`${baseURL}/api/steps/${stepId}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setReorderedSteps(reorderedSteps.filter((step) => step.id !== stepId));
      } catch (error) {
        console.error("Error deleting step:", error);
      }
    }
  };

  return (
    <>
      {emailLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <div className="mt-4 text-white">Loading...</div>
          </div>
        </div>
      )}

      <Reorder.Group axis="y" values={reorderedSteps} onReorder={handleReorder}>
        <TableContainer component={Paper}>
          <Table aria-label="steps table">
            <TableHead>
              <TableRow>
                <TableCell>Step</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Attendees</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reorderedSteps.map((step, index) => (
                <Reorder.Item value={step} key={step.id} id={step.id} as={"tr"}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{step.name}</TableCell>
                  <TableCell>{step.attendees?.user_name}</TableCell>
                  <TableCell>{step.category?.name || "No Category"}</TableCell>
                  <TableCell align="center">
                    <Button onClick={() => handleEditClick(step)}>
                      <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-1">
                        {React.createElement(PencilSquareIcon, {
                          strokeWidth: 2,
                          className: "h-6 text-gray-900 w-6",
                        })}
                      </div>
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button onClick={() => handleDelete(step.id)}>
                      <div className="flex items-center justify-center rounded-lg bg-red-400 p-1">
                        {React.createElement(TrashIcon, {
                          strokeWidth: 2,
                          className: "h-6 text-white w-6",
                        })}
                      </div>
                    </Button>
                  </TableCell>
                </Reorder.Item>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Reorder.Group>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Step</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <Select
            fullWidth
            value={editAttendeeId}
            onChange={(e) => setEditAttendeeId(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Attendee
            </MenuItem>
            {profiles.map((profile) => (
              <MenuItem key={profile.id} value={profile.id}>
                {profile.user_name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default StepTable;
