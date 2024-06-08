import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

const EscalateDialog = ({
  open,
  onClose,
  onConfirm,
  onInputChange,
  escalationNote,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Escalate Incident</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to escalate this incident? Please provide a note for the escalation.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Escalation Note"
          type="text"
          fullWidth
          variant="standard"
          value={escalationNote}
          onChange={onInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="secondary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EscalateDialog;
