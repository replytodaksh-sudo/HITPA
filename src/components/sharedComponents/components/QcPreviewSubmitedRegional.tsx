// src/components/QcPreview/QcPreview.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { QCUpdateService } from '../../../services/qcupdate.service';
import RegQcUpdateFields from './RegQcUpdateFields';
import RegQcObservations from './RegQcObservations';
import RegQcVendorFeedback from './RegQcVendorFeedback';

interface QcPreviewProps {
  previewRefresh?: boolean;
  buttonEnable?: boolean;
  dataRole?: string;
  previewValues?: any;
}

const QcPreviewSubmitedRegional: React.FC<QcPreviewProps> = ({
  previewRefresh = false,
  buttonEnable = false,
  dataRole = '',
  previewValues: propsPreviewValues,
}) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL params
  const claimsType = searchParams.get('claimsType') || 'cashless';
  const acceptAssignId = searchParams.get('acceptAssignId') || '';
  const redirectTo = searchParams.get('redirectTo') || '';
  const claimSubmitted = searchParams.get('claimSubmitted') || '';

  // State
  const [previewValus, setPreviewValus] = useState<any>(null);
  const [previewValuesReim, setPreviewValuesReim] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const roleName = sessionStorage.getItem('roleName') || '';
  const qcUpdateID = localStorage.getItem('qcUpdateID') || '';

  // Fetch QC preview details
  useEffect(() => {
    if (investigationId) {
      getQCPreviewDetails();
    }
  }, [investigationId, previewRefresh, dataRole]);

  const getQCPreviewDetails = async () => {
    try {
      // setLoading(true);
      let tabName = '';

      if (
        (roleName === 'Regional Manager' || roleName === 'Central Manager') &&
        dataRole === 'regional'
      ) {
        tabName = 'regionalQC';
      }

      if (claimsType === 'cashless') {
        const cashlessResponse = await QCUpdateService.qcUpdatePreview(
          investigationId!,
          tabName
        );
        if (cashlessResponse.statusCode === 0) {
          setPreviewValus(cashlessResponse.payload);
        }
      }

      if (claimsType === 'reim') {
        const reimResponse = await QCUpdateService.qcUpdatePreviewReim(
          investigationId!,
          tabName
        );
        console.log('Reim QC Preview Response:', reimResponse);
        if (reimResponse.statusCode === 0) {
          setPreviewValuesReim(reimResponse.payload);
        }
      }
    } catch (error) {
      console.error('Error fetching QC preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const finalSubmit = async () => {
    try {
      setLoading(true);
      const qcUId = localStorage.getItem('qcUpdateID') || '';

      if (claimsType === 'cashless') {
        const response = await QCUpdateService.qcUpdateFinal(investigationId!, qcUId);
        if (response.statusCode === 0) {
          alert('Final submission successful');
          localStorage.clear();
          if (redirectTo) {
            navigate(redirectTo.replace('/investigation', ''));
          } else {
            navigate('/admin/dashboard');
          }
        } else if (response.statusCode === 4004) {
          alert(response.message);
        }
      }

      if (claimsType === 'reim') {
        // Check if split case allocation and all visits are done
        if (previewValus?.investigationType === 'Split case allocation') {
          const hospitalDone = previewValus.hospitalVisitStatus === 'Done';
          const insuredDone = previewValus.insuredVisitStatus === 'Done';
          const employerDone = previewValus.employerVisitStatus === 'Done';

          if (hospitalDone && insuredDone && employerDone) {
            const response = await QCUpdateService.qcUpdateFinalReim(
              investigationId!,
              qcUId,
              acceptAssignId
            );
            if (response.statusCode === 0) {
              if (redirectTo) {
                navigate(redirectTo.replace('/investigation', ''));
              } else {
                navigate('/admin/dashboard');
              }
              alert('Final submission successful');
              localStorage.clear();
            }
          } else {
            // Build pending visits message
            let pendingVisits: string[] = [];
            if (!hospitalDone) pendingVisits.push('Hospital Visit');
            if (!insuredDone) pendingVisits.push('Insured Visit');
            if (!employerDone) pendingVisits.push('Employer Visit');

            alert(`Pending: ${pendingVisits.join(', ')}`);
          }
        } else {
          // Not split case, submit directly
          const response = await QCUpdateService.qcUpdateFinalReim(
            investigationId!,
            qcUId,
            acceptAssignId
          );
          if (response.statusCode === 0) {
            alert('Final submission successful');
            if (redirectTo) {
              navigate(redirectTo.replace('/investigation', ''));
            } else {
              navigate('/admin/dashboard');
            }
            localStorage.clear();
          }
        }
      }
    } catch (error) {
      console.error('Error submitting QC:', error);
      alert('Failed to submit QC update');
    } finally {
      setLoading(false);
    }
  };

  // Determine button text based on role
  const getButtonText = () => {
    if (roleName === 'Central Manager') {
      return 'Final Submit';
    }
    return 'Save & Submit to QC';
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* QC Update Fields Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* <Typography
          variant="h6"
          sx={{ color: '#6F62C2', fontWeight: 'bold', mb: 2 }}
        >
          QC Update Fields
        </Typography> */}
        <RegQcUpdateFields
          previewValues={propsPreviewValues || previewValus}
          previewRefresh={previewRefresh}
        />
      </Paper>

      {/* QC Observation Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ color: '#6F62C2', fontWeight: 'bold', mb: 2 }}
        >
          QC Observation
        </Typography>
        <RegQcObservations
          previewValues={claimsType === 'reim' ? previewValuesReim : previewValus}
          previewRefresh={previewRefresh}
          dataRole={dataRole}
        />
      </Paper>

      {/* Expense & Vendor Feedback Section */}
      {/* {((claimsType === 'reim' &&
        previewValuesReim?.splitVendorFeedbackDTOs?.length !== 0) ||
        (claimsType === 'cashless' &&
          previewValus?.splitVendorFeedbackDTOs?.length !== 0)) && ( */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ color: '#6F62C2', fontWeight: 'bold', mb: 2 }}
            >
              Expense & Vendor Feedback
            </Typography>
            <RegQcVendorFeedback
              previewValues={propsPreviewValues || previewValus}
              previewValuesReim={previewValuesReim}
              previewRefresh={previewRefresh}
            />
          </Paper>
        {/* )} */}

      {/* Submit Button */}
      {buttonEnable && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            onClick={finalSubmit}
            disabled={loading}
            sx={{
              background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
              color: 'white',
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
              },
            }}
          >
            {loading ? 'Submitting...' : getButtonText()}
          </Button>
        </Box>
      )}

      {/* Split Case Warning */}
      {/* {claimsType === 'reim' &&
        previewValus?.investigationType === 'Split case allocation' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> This is a split case allocation. All visits
              (Hospital, Insured, and Employer) must be completed before final
              submission.
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption">
                Hospital Visit: {previewValus.hospitalVisitStatus || 'Pending'}
              </Typography>
              <br />
              <Typography variant="caption">
                Insured Visit: {previewValus.insuredVisitStatus || 'Pending'}
              </Typography>
              <br />
              <Typography variant="caption">
                Employer Visit: {previewValus.employerVisitStatus || 'Pending'}
              </Typography>
            </Box>
          </Alert>
        )} */}
    </Box>
  );
};

export default QcPreviewSubmitedRegional;