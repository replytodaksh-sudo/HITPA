import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import AcceptInternalTeam from './AcceptInternalTeam';
import acceptAssignService from '../../../services/acceptassign.service';
import alertService from '../../../services/alertService';
import DeniedDenyForm from './DeniedDenyForm ';

/**
 * Interface for Deny request
 */
interface Deny {
  investigationId: string;
  denialDecision: string;
  denialDecisionReason: string;
}

/**
 * CentralDeniedRegionalAcceptDeny Component Props
 */
interface CentralDeniedRegionalAcceptDenyProps {
  claimType: string;
}

/**
 * CentralDeniedRegionalAcceptDeny Component
 * Handles accept/deny decisions for cases denied by regional team
 */
const CentralDeniedRegionalAcceptDeny: React.FC<CentralDeniedRegionalAcceptDenyProps> = ({
  claimType,
}) => {
  const { investigationId: rawInvestigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [investigationId, setInvestigationId] = useState<string>('');
  const [roleName, setRoleName] = useState<string>('');
  const [denialAgencyJustified, setDenialAgencyJustified] = useState<string>('');
  const [denialAgencyJustifiedRemarks, setDenialAgencyJustifiedRemarks] = useState<string>('');
  const [redirectTo, setRedirectTo] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize component
  useEffect(() => {
    // Get role name from session storage
    const role = sessionStorage.getItem('roleName') || '';
    setRoleName(role);

    // Get redirect URL from query params
    const redirect = searchParams.get('redirectTo') || '';
    setRedirectTo(redirect);

    // Clean investigation ID (remove suffix after space)
    if (rawInvestigationId) {
      const cleanId = rawInvestigationId.split(' ')[0];
      setInvestigationId(cleanId);
    }

    console.log(`${claimType} ${role}`);
  }, [rawInvestigationId, searchParams, claimType]);

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!denialAgencyJustifiedRemarks.trim()) {
      alertService.showAlertError('Please enter remarks');
      return;
    }

    try {
      setIsSubmitting(true);

      const denyRequest: Deny = {
        investigationId,
        denialDecision: denialAgencyJustified,
        denialDecisionReason: denialAgencyJustifiedRemarks,
      };

      const response = await acceptAssignService.deny(denyRequest);

      if (response.statusCode === 0) {
        alertService.showAlertSuccess('Denial submitted successfully');
        
        console.log('redirectTo', redirectTo);
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Error submitting denial:', error);
      alertService.showAlertError('Failed to submit denial');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only show for Central Manager role
  if (roleName !== 'Central Manager') {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          This section is only available for Central Manager role.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Denied Deny Form Section */}
        <Box sx={{ mb: 3 }}>
          <DeniedDenyForm />
        </Box>

        {/* Radio buttons for denial decision */}
        {(claimType === 'cashless' || claimType === 'reim') && (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <RadioGroup
              value={denialAgencyJustified}
              onChange={(e) => setDenialAgencyJustified(e.target.value)}
            >
              <FormControlLabel
                value="Accept"
                control={<Radio />}
                label="Denial by Regional Justified, send to Claims Team"
              />
              <FormControlLabel
                value="Reject"
                control={<Radio />}
                label="Mandatory Investigation"
                sx={{ mb: 1 }}
              />
            </RadioGroup>
          </FormControl>
        )}

        {/* Remarks section for Accept */}
        {denialAgencyJustified === 'Accept' &&
          (claimType === 'cashless' || claimType === 'reim') && (
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Remarks</FormLabel>
                <TextField
                  multiline
                  rows={4}
                  value={denialAgencyJustifiedRemarks}
                  onChange={(e) => setDenialAgencyJustifiedRemarks(e.target.value)}
                  placeholder="Enter remarks..."
                  variant="outlined"
                  fullWidth
                />
              </FormControl>

              {/* Submit Button */}
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting || !denialAgencyJustifiedRemarks.trim()}
                sx={{
                  mt: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                  },
                  '&:disabled': {
                    background: '#ccc',
                  },
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          )}

        {/* Accept Internal Team section for Reject */}
        {denialAgencyJustified === 'Reject' && (
          <Box sx={{ mt: 3 }}>
            <AcceptInternalTeam claimType={claimType} centralmandatedCase="yes" />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CentralDeniedRegionalAcceptDeny;