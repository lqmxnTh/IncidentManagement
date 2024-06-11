import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

const EscalateDialog = ({
  open,
  onClose,
  onConfirm,
  escalationNote,
  onNoteChange,
  escalationType,
  onTypeChange,
  previousLevel,
  onPreviousLevelChange,
  newLevel,
  onNewLevelChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: 'none' } }}>
      <DialogTitle>Escalate Incident</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap="16px">
          <FormControl fullWidth margin="normal">
            <InputLabel>Escalation Type</InputLabel>
            <Select
              value={escalationType}
              onChange={onTypeChange}
              label="Escalation Type"
            >
              <MenuItem value="Functional">Functional</MenuItem>
              <MenuItem value="Hierarchical">Hierarchical</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Previous Level"
            value={previousLevel}
            onChange={onPreviousLevelChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="New Level"
            value={newLevel}
            onChange={onNewLevelChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Escalation Note"
            value={escalationNote}
            onChange={onNoteChange}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="secondary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EscalateDialog;
