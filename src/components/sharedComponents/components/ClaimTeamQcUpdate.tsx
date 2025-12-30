import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import { QCUpdateService } from '../../../services/qcupdate.service';
import ClaimTeamQcUpdateField from './ClaimTeamQcUpdateField';
import ClaimTeamQcObservation from './ClaimTeamQcObservation';

// Import child components
// import ClaimTeamQcUpdateField from './ClaimTeamQcUpdateField';
// import ClaimTeamQcObservation from './ClaimTeamQcObservation';

interface ClaimTeamQcUpdateProps {
  claimType?: 'cashless' | 'reim';
  dataRole?: 'regional' | 'central';
}

const ClaimTeamQcUpdate: React.FC<ClaimTeamQcUpdateProps> = ({
  claimType: propClaimType,
  dataRole: propDataRole,
}) => {
  const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const roleName = sessionStorage.getItem('roleName') || '';

  // State
  const [investigationId, setInvestigationId] = useState('');
  const [claimType, setClaimType] = useState<'cashless' | 'reim'>(propClaimType || 'cashless');
  const [dataRole, setDataRole] = useState<'regional' | 'central'>(propDataRole || 'regional');
  const [previewValues, setPreviewValues] = useState<any>(null);
  const [previewValuesReim, setPreviewValuesReim] = useState<any>(null);
  const [buttonEnable, setButtonEnable] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract investigation ID and claim type
  useEffect(() => {
    if (paramInvestigationId) {
      const cleanId = paramInvestigationId.split('-')[0].trim();
      setInvestigationId(cleanId);
    }

    const claimTypeParam = searchParams.get('claimsType') as 'cashless' | 'reim';
    if (claimTypeParam) {
      setClaimType(claimTypeParam);
    }
  }, [paramInvestigationId, searchParams]);

  // Set data role based on user role
  useEffect(() => {
    if (roleName === 'Regional Manager') {
      setDataRole('regional');
    } else if (roleName === 'Central Manager') {
      setDataRole('central');
    }
  }, [roleName]);

  // Fetch QC preview details when investigationId is available
  useEffect(() => {
    if (investigationId) {
      fetchQCPreviewDetails();
    }
  }, [investigationId, dataRole]);

  // Fetch QC preview details
  const fetchQCPreviewDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const tabName = dataRole === 'regional' ? 'regionalQC' : 'centralQC';

      // Fetch cashless QC preview
      try {
        const cashlessResponse:any = await QCUpdateService.qcUpdatePreview(
          investigationId,
          tabName
        );
        if (cashlessResponse.statusCode === 0) {
          const payload = cashlessResponse.payload;
          setPreviewValues(payload);

          // Store QC update ID in localStorage
          if (payload.qcUpdateID) {
            localStorage.setItem('qcUpdateID', payload.qcUpdateID);
          }
        }
      } catch (err) {
        console.error('Failed to fetch cashless QC preview:', err);
      }

      // Fetch reimbursement QC preview
      try {
        const reimResponse:any = await QCUpdateService.qcUpdatePreviewReim(
          investigationId,
          tabName
        );
        if (reimResponse.statusCode === 0) {
          const payload = reimResponse.payload;
          setPreviewValuesReim(payload);

          // Store QC update ID in localStorage
          if (payload.qcUpdateID) {
            localStorage.setItem('qcUpdateID', payload.qcUpdateID);
          }
        }
      } catch (err) {
        console.error('Failed to fetch reimbursement QC preview:', err);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load QC preview details');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Get the appropriate preview values based on claim type
  const getPreviewValues = () => {
    return claimType === 'cashless' ? previewValues : previewValuesReim;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: '#2E5A96' }}/>
      </Box>
    );
  }

  const currentPreviewValues = getPreviewValues();

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card elevation={3}>
        <CardContent>
          {/* Processor Query Section */}
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Claim Team Remarks:
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {currentPreviewValues?.processorQuery || 'No remarks available'}
            </Typography>
          </Box>

          {/* Tabs Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minWidth: 150,
                  fontWeight: 500,
                },
                '& .Mui-selected': {
                  color: '#6F62C2',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#6F62C2',
                },
              }}
            >
              <Tab label="QC Update Fields" />
              <Tab label="QC Observations" />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <Box sx={{ mt: 3 }}>
            {/* QC Update Fields Tab */}
            <Box
              role="tabpanel"
              hidden={activeTab !== 0}
              sx={{ display: activeTab === 0 ? 'block' : 'none' }}
            >
              {activeTab === 0 && (
                <ClaimTeamQcUpdateField
                  previewValues={currentPreviewValues}
                  buttonEnable={buttonEnable}
                  dataRole={dataRole}
                  claimType={claimType}
                  onRefresh={fetchQCPreviewDetails}
                />
              )}
            </Box>

            {/* QC Observations Tab */}
            <Box
              role="tabpanel"
              hidden={activeTab !== 1}
              sx={{ display: activeTab === 1 ? 'block' : 'none' }}
            >
              {activeTab === 1 && (
                <ClaimTeamQcObservation
                  previewValues={currentPreviewValues}
                  buttonEnable={buttonEnable}
                  dataRole={dataRole}
                  claimType={claimType}
                  onRefresh={fetchQCPreviewDetails}
                />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClaimTeamQcUpdate;