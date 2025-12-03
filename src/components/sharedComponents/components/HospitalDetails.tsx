// src/components/CaseUpdate/HospitalDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Paper,
  Grid
} from '@mui/material';

interface HospitalDetailsProps {
  isInsuredVisit?: boolean;
  isFormEditable: boolean;
  previousData?: any;
}

const HospitalDetails: React.FC<HospitalDetailsProps> = ({
  isInsuredVisit,
  isFormEditable,
  previousData
}) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  
  const [hospitalFeedBack, setHospitalFeedBack] = useState('Select');
  const [hospitalRemarks, setHospitalRemarks] = useState('');

  // Populate data from previousData
  useEffect(() => {
    if (previousData) {
      populateData();
    }
  }, [previousData]);

  const populateData = () => {
    if (!previousData) return;

    setHospitalFeedBack(previousData.hospitalFeedback || 'Select');
    setHospitalRemarks(previousData.hospitalRemark || '');
  };

  // Get submit data (to be called by parent component)
  const getSubmitData = () => {
    return {
      hospitalFeedBack,
      hospitalRemarks,
      activeCaseID: localStorage.getItem('activeCaseID')
    };
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '14px', fontWeight: 'bold' }}>
        Hospital Rating
      </Typography>

      {/* Hospital Feedback */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 2 }}>
            <Typography>Hospital Feedback</Typography>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <FormControl fullWidth size="small">
              <Select
                value={hospitalFeedBack}
                onChange={(e) => setHospitalFeedBack(e.target.value)}
                disabled={!isFormEditable}
              >
                <MenuItem value="Select">Select</MenuItem>
                <MenuItem value="Good">Good</MenuItem>
                <MenuItem value="Caution">Caution</MenuItem>
                <MenuItem value="Fraud">Fraud</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Hospital Remarks */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 2 }}>
            <Typography>Hospital Remarks</Typography>
          </Grid>
          <Grid size={{ xs: 10 }}>
            <TextField
              fullWidth
              multiline
              rows={10}
              placeholder="Hospital Remarks"
              value={hospitalRemarks}
              onChange={(e) => setHospitalRemarks(e.target.value)}
              disabled={!isFormEditable}
              size="small"
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default HospitalDetails;