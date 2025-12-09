import React, { useState, useEffect } from 'react';
import { Box, TextField, FormLabel, Grid } from '@mui/material';

// ==================== INTERFACES ====================
interface HospitalOtherObservationProps {
  isFormEditable?: boolean;
  previousData?: any;
  caseUpdateService?: any; // Pass the service from parent
}

// ==================== INLINE CASE UPDATE SERVICE ====================
// Simple in-memory store - should match the one in HospitalStepTwo
const defaultCaseUpdateStore: Record<string, any> = {};

const defaultcaseUpdateService = {
  setCaseUpdateVal: (key: string, value: any) => {
    defaultCaseUpdateStore[key] = value;
  },
  getCaseUpdateVal: (key: string) => {
    return defaultCaseUpdateStore[key];
  },
};

// ==================== MAIN COMPONENT ====================
const HospitalOtherObservation: React.FC<HospitalOtherObservationProps> = ({
  isFormEditable = true,
  previousData = {},
  caseUpdateService = defaultcaseUpdateService,
}) => {
  const [anyOtherObservations, setAnyOtherObservations] = useState<string>('');

  // Populate data from previousData on mount and when previousData changes
  useEffect(() => {
    if (previousData && previousData.anyOtherObservationFinding) {
      const value = previousData.anyOtherObservationFinding;
      setAnyOtherObservations(value);
      caseUpdateService.setCaseUpdateVal('anyOtherObservationFinding', value);
    }
  }, [previousData, caseUpdateService]);

  // Handle textarea change
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setAnyOtherObservations(value);
    caseUpdateService.setCaseUpdateVal('anyOtherObservationFinding', value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 2 }}>
          <FormLabel
            sx={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: 'text.primary',
              mt: 1,
            }}
          >
            Any other findings related to Hospital
          </FormLabel>
        </Grid>
        <Grid size={{ xs: 12, md: 10 }}>
          <TextField
            fullWidth
            multiline
            rows={10}
            name="anyOtherObservations"
            id="anyOtherObservations"
            placeholder="Any Other Observations"
            value={anyOtherObservations}
            onChange={handleChange}
            disabled={!isFormEditable}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isFormEditable ? 'background.paper' : '#f5f5f5',
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HospitalOtherObservation;