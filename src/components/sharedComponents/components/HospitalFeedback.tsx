// src/components/CaseUpdate/HospitalFeedback.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { caseUpdateService } from '../../../services/caseupdate.service';
import { jwtDecode } from 'jwt-decode';

interface HospitalFeedbackProps {
  isInsuredVisit?: boolean;
  previousData?: any;
  isFormEditable?: boolean;
  onNextPage?: (pageNumber: number) => void;
}

const HospitalFeedback: React.FC<HospitalFeedbackProps> = ({
  isInsuredVisit,
  previousData,
  isFormEditable = true,
  onNextPage,
}) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const token = sessionStorage.getItem('token') || '';
  const roleName = sessionStorage.getItem('roleName') || '';
  // State
  const [hospitalFeedback, setHospitalFeedback] = useState('Select');
  const [hospitalRemarks, setHospitalRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [statusInsuredVisit, setStatusInsuredVisit] = useState<string>('');
  const [IsEditable, setIsEditable] = useState(false);

  useEffect(() => {
    refetchData();
  }, []);
  // Populate data from previousData
  useEffect(() => {
    if (data) {
      setHospitalFeedback(data.hospitalFeedBack || 'Select');
      setHospitalRemarks(data.hospitalRemarks || '');
    }
  }, [data]);

  const refetchData = async () => {
    // setLoading(true);
    try {
      // Decode JWT token
      let decodedToken: any = {};
      if (token) {
        try {
          decodedToken = jwtDecode(token);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }

      const response: any = await caseUpdateService.caseUpdatePreviousData(investigationId!);

      if (response.statusCode === 0) {
        const payload = response.payload;

        // Set investigator name based on role
        if (roleName === 'Field Officer' || roleName === 'Agency Spoc') {
          payload.investigatorName = decodedToken.name || '';
        } else {
          payload.investigatorName = '';
        }

        setData(payload);

        // Store active case ID in localStorage
        if (payload.activeCaseID) {
          localStorage.setItem('activeCaseID', payload.activeCaseID);
        }

        // Set insured visit status
        if (payload.boolStatusOfInsured !== null) {
          setStatusInsuredVisit(payload.boolStatusOfInsured ? '1' : '0');
        }

        // Check if form is editable
        checkIsEditable(payload);
      } else {
        setData(response.payload);
        checkIsEditable(response.payload);
      }
    } catch (error) {
      console.error('Error fetching previous data:', error);
    } finally {
      // setLoading(false);
    }
  };

  const checkIsEditable = (data: any) => {
    if (!data) return;

    // Determine if form is editable based on noDataStatus
    if (data.noDataStatus === 'NonEditable') {
      setIsEditable(true);
    } else if (data.noDataStatus === 'Editable') {
      setIsEditable(false);
    }
  };



  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        hospitalFeedBack: hospitalFeedback,
        hospitalRemarks: hospitalRemarks,
        activeCaseID: localStorage.getItem('activeCaseID'),
      };

      const cleanInvId = investigationId?.split(' ')[0] || '';
      const response = await caseUpdateService.addCaseUpdateHospital(
        payload,
        cleanInvId
      );

      if (response.statusCode === 0) {
        alert('Hospital feedback saved successfully');

        // Emit next page event (go to page 2)
        if (onNextPage) {
          onNextPage(2);
        }
      }
    } catch (error) {
      console.error('Error saving hospital feedback:', error);
      alert('Failed to save hospital feedback');
    } finally {
      setLoading(false);
    }
  };
console.log("IsEditable", IsEditable);
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Hospital Feedback
      </Typography>

      <Grid container spacing={3}>
        {/* Hospital Feedback Dropdown */}
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 2 }}>
              <Typography variant="body2" fontWeight={500}>
                Hospital Feedback
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="hospital-feedback-label">Select</InputLabel>
                <Select
                  labelId="hospital-feedback-label"
                  id="hospitalFeedback"
                  name="hospitalFeedback"
                  value={hospitalFeedback}
                  label="Select"
                  onChange={(e) => setHospitalFeedback(e.target.value)}
                  disabled={IsEditable}
                >
                  <MenuItem value="Select">Select</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Caution">Caution</MenuItem>
                  <MenuItem value="Fraud">Fraud</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {/* Hospital Remarks Textarea */}
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 2 }}>
              <Typography variant="body2" fontWeight={500}>
                Hospital Remarks
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 10 }}>
              <TextField
                fullWidth
                multiline
                rows={10}
                id="hospitalRemarks"
                name="hospitalRemarks"
                placeholder="Hospital Remarks"
                value={hospitalRemarks}
                onChange={(e) => setHospitalRemarks(e.target.value)}
                disabled={IsEditable}
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Grid size={{ xs: 12 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 10 }} offset={{ sm: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || IsEditable}
                sx={{ textTransform: 'none' }}
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HospitalFeedback;