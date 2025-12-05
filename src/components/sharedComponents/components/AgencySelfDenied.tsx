import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import AcceptAgencies from './acceptAgency';
import AcceptInternalTeam from './AcceptInternalTeam';
import DeniedDenyForm from './DeniedDenyForm ';


interface AgencySelfDeniedProps {
  investigationId?: string;
  claimType?: string;
}

const AgencySelfDenied: React.FC<AgencySelfDeniedProps> = ({
  investigationId,
  claimType
}) => {
  // State
  const [statusInsuredVisit, setStatusInsuredVisit] = useState(0);
  const [denialAgencyJustified, setDenialAgencyJustified] = useState('');
  const [denialAgencyJustifiedRemarks, setDenialAgencyJustifiedRemarks] = useState('');
  const [roleName, setRoleName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Get role from session
    const role = sessionStorage.getItem('roleName') || '';
    setRoleName(role);
    
    console.log('Claim Type:', claimType, 'Role:', role);
  }, [claimType]);

  const handleRemarksChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDenialAgencyJustifiedRemarks(event.target.value);
  };

  const handleSubmitRemarks = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      setSubmitting(true);
      
      // TODO: Implement API call to submit remarks
      console.log('Submitting remarks:', {
        investigationId,
        remarks: denialAgencyJustifiedRemarks,
        denialAgencyJustified
      });
      
      // Example API call:
      // await AcceptDenyService.submitDenialRemarks(investigationId, {
      //   remarks: denialAgencyJustifiedRemarks,
      //   denialAgencyJustified
      // });
      
      // Clear form after successful submission
      setDenialAgencyJustifiedRemarks('');
      
    } catch (error) {
      console.error('Error submitting remarks:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Callback to receive data from DeniedDenyForm
  const handleDenialDataChange = (data: {
    statusInsuredVisit?: number;
    denialAgencyJustified?: string;
  }) => {
    if (data.statusInsuredVisit !== undefined) {
      setStatusInsuredVisit(data.statusInsuredVisit);
    }
    if (data.denialAgencyJustified !== undefined) {
      setDenialAgencyJustified(data.denialAgencyJustified);
    }
  };

  // Show remarks field for Regional Manager + Cashless + Justified denial
  const showRemarksField = 
    roleName === 'Regional Manager' && 
    claimType === 'cashless' && 
    denialAgencyJustified === '1';

  // Show agency assignment for rejection
  const showAgencyAssignment = 
    statusInsuredVisit === 1 && 
    denialAgencyJustified === '2';

  // Show internal team assignment for rejection
  const showInternalTeamAssignment = 
    statusInsuredVisit === 2 && 
    denialAgencyJustified === '2';

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Denial Information Display */}
      <DeniedDenyForm
        // investigationId={investigationId}
        // onDataChange={handleDenialDataChange}
      />

      {/* Remarks Field for Regional Manager (Justified Denial) */}
      {showRemarksField && (
        <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Regional Manager Remarks
          </Typography>
          <Box component="form" onSubmit={handleSubmitRemarks}>
            <TextField
              label="Remarks"
              multiline
              rows={4}
              fullWidth
              value={denialAgencyJustifiedRemarks}
              onChange={handleRemarksChange}
              placeholder="Enter your remarks regarding the justified denial..."
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="info"
              startIcon={<SendIcon />}
              disabled={submitting || !denialAgencyJustifiedRemarks.trim()}
              sx={{
                minWidth: 200,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                }
              }}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Assignment Options for Rejected Denial */}
      {showAgencyAssignment && (
        <Box sx={{ mt: 3 }}>
          <AcceptAgencies
            // investigationId={investigationId}
          />
        </Box>
      )}

      {showInternalTeamAssignment && (
        <Box sx={{ mt: 3 }}>
          <AcceptInternalTeam
            // investigationId={investigationId}
            claimType={claimType}
          />
        </Box>
      )}
    </Container>
  );
};

export default AgencySelfDenied;