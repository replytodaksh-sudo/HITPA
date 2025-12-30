import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

// Import child components
import AcceptInternalTeam from './AcceptInternalTeam';

// Import services
import { acceptAssignService } from '../../../services/acceptassign.service';
import { claimsService } from '../../../services/claims.service';
import AcceptAgencies from './acceptAgency';
import DeniedDenyForm from './DeniedDenyForm ';

interface AgencyDeniedAcceptDenyProps {
  claimType: string;
  acceptAssignId: string;
}

const AgencyDeniedAcceptDeny: React.FC<AgencyDeniedAcceptDenyProps> = ({
  claimType,
  acceptAssignId: propAcceptAssignId,
}) => {
  const navigate = useNavigate();
  const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const roleName = sessionStorage.getItem('roleName') || '';

  // State Management
  const [statusInsuredVisit, setStatusInsuredVisit] = useState('');
  const [denialAgencyJustified, setDenialAgencyJustified] = useState('');
  const [denialAgencyJustifiedRemarks, setDenialAgencyJustifiedRemarks] = useState('');
  const [investigationId, setInvestigationId] = useState('');
  const [investigationType, setInvestigationType] = useState('');
  const [acceptAssignId, setAcceptAssignId] = useState('');

  // Loading & Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Extract investigation ID and acceptAssignId
  useEffect(() => {
    // Get investigationId from route params
    if (paramInvestigationId) {
      const cleanId = paramInvestigationId.split('-')[0].trim();
      setInvestigationId(cleanId);
    }

    // Get acceptAssignId from query params or props
    const queryAcceptAssId = searchParams.get('acceptAssId');
    const finalAcceptAssId = queryAcceptAssId || propAcceptAssignId;
    if (finalAcceptAssId) {
      setAcceptAssignId(finalAcceptAssId);
    }
  }, [paramInvestigationId, searchParams, propAcceptAssignId]);

  // Fetch claim details when investigationId is available
  useEffect(() => {
    if (investigationId) {
      fetchClaimDetails();
    }
  }, [investigationId]);

  const fetchClaimDetails = async () => {
    try {
      const response:any = await claimsService.claimDetails(investigationId);
      if (response.statusCode === 0) {
        setInvestigationType(response.payload.investigationType);
      }
    } catch (err) {
      console.error('Failed to fetch claim details:', err);
    }
  };

  // Submit denial decision
  const handleSubmitDenialRemarks = async () => {
    if (!denialAgencyJustifiedRemarks.trim()) {
      setError('Please enter remarks');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const denyRequest = {
        acceptAssignId: acceptAssignId,
        investigationId: investigationId,
        denialDecision: denialAgencyJustified === 'Accept' ? 'Accept' : 'Reject',
        denialDecisionReason: denialAgencyJustifiedRemarks,
      };

      const response:any = await acceptAssignService.deny(denyRequest);

      if (response.data.statusCode === 0) {
        setSuccess('Denial submitted successfully!');
        // setTimeout(() => {
        //   navigate('/admin/dashboard');
        // }, 1500);
      } else {
        setError(response.data.message || 'Failed to submit denial');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit denial');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if option should be shown
  const shouldShowOption = (roles: string[], claimTypes: string[], additionalConditions = true) => {
    return (
      roles.includes(roleName) &&
      claimTypes.includes(claimType) &&
      additionalConditions
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        {/* Regional Manager Section */}
        {roleName === 'Regional Manager' && (
          <>
            {/* Denied Deny Form Component */}
            <Box sx={{ mb: 3 }}>
              <DeniedDenyForm />
            </Box>

            {/* Primary Decision - Accept or Reject Agency Denial */}
            <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
              <RadioGroup
                value={denialAgencyJustified}
                onChange={(e) => {
                  setDenialAgencyJustified(e.target.value);
                  setStatusInsuredVisit(''); // Reset sub-options
                }}
              >
                {/* Accept Agency Denial - Show for both cashless and reim (except Split case) */}
                {shouldShowOption(
                  ['Regional Manager'],
                  ['cashless', 'reim'],
                  investigationType !== 'Split case allocation'
                ) && (
                  <FormControlLabel
                    value="Accept"
                    control={<Radio />}
                    label="Denial by Agency is justified, send to Central Team"
                  />
                )}

                {/* Reject Agency Denial - Show for both cashless and reim */}
                {shouldShowOption(['Regional Manager'], ['cashless', 'reim']) && (
                  <FormControlLabel
                    value="Reject"
                    control={<Radio />}
                    label="Denial by Agency is not justified, assign again"
                  />
                )}
              </RadioGroup>
            </FormControl>

            {/* If Rejection is selected - Show sub-options */}
            {denialAgencyJustified === 'Reject' && (
              <Box sx={{ ml: 4, mb: 3 }}>
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <RadioGroup
                    value={statusInsuredVisit}
                    onChange={(e) => setStatusInsuredVisit(e.target.value)}
                  >
                    {/* Assign to Agency */}
                    {shouldShowOption(
                      ['Regional Manager'],
                      ['cashless', 'reim'],
                      investigationType !== 'Part verification'
                    ) && (
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Accept & Assign to Agency for investigation"
                      />
                    )}

                    {/* Assign to Internal Team */}
                    {shouldShowOption(
                      ['Regional Manager'],
                      ['cashless', 'reim'],
                      investigationType !== 'Split case allocation'
                    ) && (
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Accept & Assign to internal team for investigation"
                      />
                    )}
                  </RadioGroup>
                </FormControl>
              </Box>
            )}

            {/* Remarks Section - Only if Accept is selected */}
            {denialAgencyJustified === 'Accept' && (
              <>
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Remarks *
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={denialAgencyJustifiedRemarks}
                    onChange={(e) => setDenialAgencyJustifiedRemarks(e.target.value)}
                    placeholder="Enter your remarks here..."
                    variant="outlined"
                  />
                </Box>

                <Button
                  variant="contained"
                  onClick={handleSubmitDenialRemarks}
                  disabled={loading || !denialAgencyJustifiedRemarks.trim()}
                  sx={{
                    background: 'linear-gradient(45deg, #17a2b8 30%, #3ab4c9 90%)',
                    color: 'white',
                    px: 4,
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </>
            )}
          </>
        )}

        {/* Agency Spoc Section */}
        {roleName === 'Agency Spoc' && claimType === 'cashless' && (
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={statusInsuredVisit}
              onChange={(e) => setStatusInsuredVisit(e.target.value)}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Accept & Assign to Field Officer"
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="Accept & Keep with Agency Central"
              />
            </RadioGroup>
          </FormControl>
        )}

        {/* Central Manager/QC Section */}
        {(roleName === 'Central Manager' || roleName === 'Central QC') &&
          (claimType === 'cashless' || claimType === 'reim') && (
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                value={statusInsuredVisit}
                onChange={(e) => setStatusInsuredVisit(e.target.value)}
              >
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Accept & assign to Regional Team Member"
                />
              </RadioGroup>
            </FormControl>
          )}
      </Paper>

      {/* Conditional Child Components - Only show if Rejection and sub-option selected */}
      {denialAgencyJustified === 'Reject' && statusInsuredVisit === '1' && (
        <Box sx={{ mt: 3 }}>
          <AcceptAgencies
            investigationType={investigationType}
            investigationSubType=""
            accid={acceptAssignId}
          />
        </Box>
      )}

      {denialAgencyJustified === 'Reject' && statusInsuredVisit === '2' && (
        <Box sx={{ mt: 3 }}>
          <AcceptInternalTeam claimType={claimType} accid={acceptAssignId} />
        </Box>
      )}
    </Box>
  );
};

export default AgencyDeniedAcceptDeny;