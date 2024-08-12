import React from 'react';
import { Stepper, Step, StepLabel, styled } from '@mui/material';

const CustomStepper = styled(Stepper)(({ theme }) => ({
  backgroundColor: 'transparent',
  padding: theme.spacing(2),
}));

const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepIcon-root': {
    color: theme.palette.primary.main,
  },
  '& .MuiStepIcon-root.Mui-active': {
    color: theme.palette.secondary.main,
  },
  '& .MuiStepIcon-root.Mui-completed': {
    color: theme.palette.success.main,
  },
  '& .MuiStepLabel-label': {
    color: theme.palette.text.primary,
  },
  '& .MuiStepLabel-label.Mui-active': {
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
  },
  '& .MuiStepLabel-label.Mui-completed': {
    color: theme.palette.success.main,
  },
}));

const IncidentProgress = ({ status }) => {
  let wasEcalated = false
  let steps = ['Open', 'In Progress','Assign', 'Resolved', 'Closed'];

  if (status === 'Rejected') {
    steps.push('Rejected');
  }
  if (status === 'Escalated') {
    steps.splice(2, 0, 'Escalated');
    wasEcalated = true;
  }
  if(wasEcalated){
    steps = ['Open', 'In Progress','Assign','Escalated', 'Resolved', 'Closed'];
  }

  const statusIndex = steps.indexOf(status);

  return (
    <CustomStepper activeStep={statusIndex !== -1 ? statusIndex : 0} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <CustomStepLabel>{label}</CustomStepLabel>
        </Step>
      ))}
    </CustomStepper>
  );
};

export default IncidentProgress;
