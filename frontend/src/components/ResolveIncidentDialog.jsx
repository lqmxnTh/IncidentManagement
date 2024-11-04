// ResolveIncidentDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResolveIncidentDialog = ({ open, onClose, incidentId, save, teams}) => {
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionTime, setResolutionTime] = useState("");
  const baseURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const handleResolve = async () => {
    try {
      const resolutionData = {
        incident: incidentId,
        resolution_notes: resolutionNotes,
        resolution_time: resolutionTime,
        teams: teams, // Add appropriate team IDs here if needed
      };
      console.log(resolutionData)
      await axios.post(`${baseURL}/api/resolutions/`, resolutionData,
        {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        });
      save();
      onClose();
    } catch (error) {
      console.error("Failed to resolve incident:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Resolve Incident</DialogTitle>
      <DialogContent>
        <TextField
          label="Resolution Notes"
          value={resolutionNotes}
          onChange={(e) => setResolutionNotes(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          label="Resolution Time"
          value={resolutionTime}
          onChange={(e) => setResolutionTime(e.target.value)}
          fullWidth
          margin="normal"
          type="time"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleResolve} color="secondary">
          Resolve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResolveIncidentDialog;
