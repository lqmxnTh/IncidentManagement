// IncidentProgress.jsx
import React from 'react';
import { Stepper, Step, StepLabel, styled } from '@mui/material';

const CustomStepper = styled(Stepper)(({ theme }) => ({
  backgroundColor: 'transparent',
  padding: theme.spacing(2),
}));

const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepIcon-root': {
    color: theme.palette.primary.main, // Default color for icons
  },
  '& .MuiStepIcon-root.Mui-active': {
    color: theme.palette.secondary.main, // Color for active icons
  },
  '& .MuiStepIcon-root.Mui-completed': {
    color: theme.palette.success.main, // Color for completed icons
  },
  '& .MuiStepLabel-label': {
    color: theme.palette.text.primary, // Default color for text
  },
  '& .MuiStepLabel-label.Mui-active': {
    color: theme.palette.secondary.main, // Color for active text
    fontWeight: 'bold', // Additional styling for active text
  },
  '& .MuiStepLabel-label.Mui-completed': {
    color: theme.palette.success.main, // Color for completed text
  },
}));

const IncidentProgress = ({ status, includeEscalated }) => {
  const steps = includeEscalated 
    ? ['Open', 'In Progress', 'Resolved', 'Closed', 'Escalated'] 
    : ['Open', 'In Progress', 'Resolved', 'Closed'];

  const getStatusIndex = (status) => {
    switch (status) {
      case 'Open':
        return 0;
      case 'In Progress':
        return 1;
      case 'Resolved':
        return 2;
      case 'Closed':
        return 3;
      case 'Escalated':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <CustomStepper activeStep={getStatusIndex(status)} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <CustomStepLabel>{label}</CustomStepLabel>
        </Step>
      ))}
    </CustomStepper>
  );
};

export default IncidentProgress;
