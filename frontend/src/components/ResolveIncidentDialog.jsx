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

const ResolveIncidentDialog = ({ open, onClose, incidentId }) => {
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionTime, setResolutionTime] = useState("");
  const baseURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleResolve = async () => {
    try {
      const resolutionData = {
        incident: incidentId,
        resolution_notes: resolutionNotes,
        resolution_time: resolutionTime,
        resolved_by: [], // Add appropriate team IDs here if needed
      };
      await axios.post(`${baseURL}/api/resolutions/`, resolutionData);
      onClose();
      navigate("/incidents");  // Redirect back to the incidents list after resolving
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
