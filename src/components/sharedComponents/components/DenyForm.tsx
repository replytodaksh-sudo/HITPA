// src/components/CentralNewCasesTabs/components/AcceptDeny.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { AssignService } from '../../../services/assign.service';
import { claimsService } from '../../../services/claims.service';
import DropdownService from '../../../services/dropdown.service';

interface AcceptDenyProps {
  claimType: string;
  invesType?: string;
  invesSubType?: string;
  acceptAssId?: string;
}

interface DenyReason {
  reasonCode: string;
  reason: string;
}

const DenyForm: React.FC<AcceptDenyProps> = ({
  claimType,
  invesType = '',
  invesSubType = '',
  acceptAssId = '',
}) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [denyReasonList, setDenyReasonList] = useState<any[]>([]);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [denialReasonDetails, setDenialReasonDetails] = useState('');
  const [secondaryStatus, setSecondaryStatus] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const [cleanInvestigationId, setCleanInvestigationId] = useState('');

  useEffect(() => {
    // Get redirect URL from query params
    const redirect = searchParams.get('redirectTo') || '';
    setRedirectTo(redirect);

    // Clean investigation ID
    if (investigationId) {
      const cleanId = investigationId.split('-')[0].trim();
      setCleanInvestigationId(cleanId);
      fetchClaimData(investigationId);
    }

    fetchDenyReasons();
  }, [investigationId, searchParams]);

  const fetchDenyReasons = async () => {
    setLoading(true);
    try {
      const response = await DropdownService.getAllDenyReasons();
      if (response.statusCode === 0) {
        setDenyReasonList(response.payload || []);
      }
    } catch (error) {
      console.error('Error fetching deny reasons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimData = async (invClaimId: string) => {
    try {
      const response = await claimsService.reclaimDetails(invClaimId);
      if (response.statusCode === 0) {
        setSecondaryStatus(response.payload.secondaryStatus);
      }
    } catch (error) {
      console.error('Error fetching claim data:', error);
    }
  };

  const handleReasonToggle = (reasonCode: string, checked: boolean) => {
    if (checked) {
      setSelectedReasons([...selectedReasons, reasonCode]);
    } else {
      setSelectedReasons(selectedReasons.filter((r) => r !== reasonCode));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedReasons.length === 0) {
      alert('Please select at least one reason for denial');
      return;
    }

    const denyRequest = {
      reasonsCode: selectedReasons,
      denialReason: denialReasonDetails,
      investigationId: cleanInvestigationId,
      investigationType: invesType,
      investigationSubType: invesSubType,
      denialDecision: secondaryStatus === 'Assigned to Regional team' ? 'accept' : '',
      acceptAssignId: acceptAssId || '',
    };

    setSubmitting(true);
    try {
      const response = await AssignService.deny(denyRequest);
      if (response.statusCode === 0) {
        alert('Case denied successfully');
        
        // Navigate to redirect URL or dashboard
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Error denying case:', error);
      alert('Failed to deny case. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <form onSubmit={handleSubmit}>
        <Card
          sx={{
            bgcolor: '#f0f8ff',
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 700,
                color: '#6F62C2',
              }}
            >
              Choose reason to denial
            </Typography>

            {/* Deny Reasons Checkboxes */}
            <Box sx={{ mb: 3 }}>
              {denyReasonList.map((denyReason) => (
                <FormControlLabel
                  key={denyReason.reasonCode}
                  control={
                    <Checkbox
                      checked={selectedReasons.includes(denyReason.reasonCode)}
                      onChange={(e) =>
                        handleReasonToggle(denyReason.reasonCode, e.target.checked)
                      }
                      sx={{
                        color: '#6F62C2',
                        '&.Mui-checked': {
                          color: '#6F62C2',
                        },
                      }}
                    />
                  }
                  label={denyReason.reason}
                  sx={{
                    display: 'block',
                    mb: 1,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.95rem',
                    },
                  }}
                />
              ))}
            </Box>

            {/* Denial Reason Details */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Denial Reason Details"
                value={denialReasonDetails}
                onChange={(e) => setDenialReasonDetails(e.target.value)}
                variant="outlined"
                placeholder="Provide detailed reason for denial..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                  },
                }}
              />
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting || selectedReasons.length === 0}
              startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircleIcon />}
              sx={{
                minWidth: 200,
                background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c62828 0%, #b71c1c 100%)',
                },
                '&:disabled': {
                  background: '#e0e0e0',
                },
              }}
            >
              {submitting ? 'Denying...' : 'Deny'}
            </Button>

            {/* Validation Message */}
            {selectedReasons.length === 0 && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1,
                  color: 'error.main',
                  fontStyle: 'italic',
                }}
              >
                Please select at least one reason to proceed
              </Typography>
            )}
          </CardContent>
        </Card>
      </form>
    </Box>
  );
};

export default DenyForm;