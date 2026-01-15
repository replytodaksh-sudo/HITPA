import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { QCUpdateService } from '../../../services/qcupdate.service';

import CentralQCUpdateFields from './CentralQCUpdateFields';
import RegQcObservations from './RegQcObservations';
import RegQcVendorFeedback from './RegQcVendorFeedback';
import QcPreview from './QcPreview';
import QcupdateFields from './QcupdateFields';
import QCObservations from './QCObservations';
import QcVendorFeedback from './QcVendorFeedback';
import QcupdateFieldsReg from './QcupdateFieldsReg';
import QCObservationsReg from './QCObservationsReg';
import QcVendorFeedbackReg from './QcVendorFeedbackReg';
import QcPreviewReg from './QcPreviewReg';

interface QCUpdatesRegionalProps {
  investigationId?: string;
  buttonEnable?: boolean;
  dataRole?: string;
}

interface PreviewValues {
  qcUpdateID: string;
  investigationType: string;
  hospitalVisitStatus?: string;
  insuredVisitStatus?: string;
  employerVisitStatus?: string;
  // ... other fields
}

const QCUpdatesRegional: React.FC<QCUpdatesRegionalProps> = ({
  investigationId: propInvestigationId,
  buttonEnable = true,
  dataRole: propDataRole,
}) => {
  const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();

  // State
  const [activeTab, setActiveTab] = useState(0);
  const [investigationId, setInvestigationId] = useState('');
  const [claimsType, setClaimsType] = useState('');
  const [previewValues, setPreviewValues] = useState<PreviewValues | null>(null);
  const [previewRefresh, setPreviewRefresh] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [dataRole, setDataRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get role from session
    const role = sessionStorage.getItem('roleName') || '';
    setRoleName(role);

    // Set data role based on role name or prop
    let role_data = propDataRole || '';
    if (role === 'Regional Manager') {
      role_data = 'regional';
    } else if (role === 'Central Manager') {
      role_data = 'central';
    }
    setDataRole(role_data);

    // Get claims type from query params
    const type = searchParams.get('claimsType') || '';
    setClaimsType(type);

    // Get investigation ID from props or URL
    const invId = propInvestigationId || (paramInvestigationId ? paramInvestigationId.split(' ')[0] : '');
    setInvestigationId(invId);

    // Fetch QC preview details
    if (invId && role_data) {
      fetchQCPreviewDetails(invId, role_data, role, type);
    }
  }, [propInvestigationId, paramInvestigationId, propDataRole, searchParams]);

  const fetchQCPreviewDetails = async (invId: string, role_data: string, role: string, type: string) => {
    try {
      setLoading(true);

      // Determine tab name based on role
      let tabName = '';
      if (role === 'Regional Manager') {
        tabName = 'regionalQC';
      } else if (role === 'Central Manager') {
        tabName = 'centralQC';
      }

      let response;

      // Fetch based on claim type
      if (type === 'cashless') {
        response = await QCUpdateService.qcUpdatePreview(invId, tabName);
      } else if (type === 'reim') {
        response = await QCUpdateService.qcUpdatePreviewReim(invId, tabName);
      }
      console.log('QC Preview Response:', response);
      if (response && response.statusCode === 0) {
        setPreviewValues(response.payload);
        // Store QC Update ID in localStorage
        localStorage.setItem('qcUpdateID', response.payload.qcUpdateID);
        console.log('Preview Values:', response.payload);
      }
    } catch (error) {
      console.error('Error fetching QC preview details:', error);
    } finally {
      setLoading(false);
    }
  };
  console.log('Preview Values at render:', previewValues);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);

    // Set preview refresh to true only for Preview & Submit tab
    if (newValue === 3) {
      setPreviewRefresh(true);
    } else {
      setPreviewRefresh(false);
    }
  };

  const handleNextTab = () => {
    if (activeTab < 3) {
      setActiveTab(activeTab + 1);

      // Set preview refresh for Preview & Submit tab
      if (activeTab + 1 === 3) {
        setPreviewRefresh(true);
      }
    }
  };

  // Show visit status table for reimbursement (non-part verification)
  const showVisitStatusTable =
    claimsType === 'reim' &&
    previewValues &&
    previewValues.investigationType !== 'Part verification';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading QC details...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Visit Status Table (Reimbursement Only) */}
        {showVisitStatusTable && (
          <TableContainer sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Hospital Visit Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Insured Visit Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Employer Visit Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{previewValues?.hospitalVisitStatus || '-'}</TableCell>
                  <TableCell>{previewValues?.insuredVisitStatus || '-'}</TableCell>
                  <TableCell>{previewValues?.employerVisitStatus || '-'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
              },
            }}
          >
            <Tab label="QC Update Fields" />
            <Tab label="QC Observations" />
            <Tab label="Vendor Feedback" />
            <Tab label="Preview & Submit" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ pt: 3 }}>
          {/* Tab 0: QC Update Fields */}
          {activeTab === 0 && (
            <QcupdateFieldsReg buttonEnable={buttonEnable} previewValues={previewValues} onChangeTab={handleNextTab} />
            // <CentralQCUpdateFields
            //   investigationId={investigationId}
            //   previewValues={previewValues}
            //   buttonEnable={buttonEnable}
            //   onNextTab={handleNextTab}
            // />
          )}

          {/* {/* Tab 1: QC Observations *  /} */}
          {activeTab === 1 && (
            <QCObservationsReg
              // <RegQcObservations
              //   investigationId={investigationId}
              previewValues={previewValues}
              //   buttonEnable={buttonEnable}
              onChangeTab={handleNextTab}
            />
          )}

          {/* Tab 2: Vendor Feedback */}
          {activeTab === 2 && (
            // <QCVendorFeedback
            // <RegQcVendorFeedback
            // //   investigationId={investigationId}
            //   previewValues={previewValues}
            // //   buttonEnable={buttonEnable}
            // //   onNextTab={handleNextTab}
            // />
            <QcVendorFeedbackReg
              previewValues={previewValues}
              buttonEnable={buttonEnable}
              onChangeTab={handleNextTab}
            />
          )}

          {/* Tab 3: Preview & Submit */}
          {activeTab === 3 && (
            <QcPreviewReg
              //   investigationId={investigationId}
              dataRole={dataRole}
              previewRefresh={previewRefresh}
              previewValues={previewValues}
              buttonEnable={buttonEnable}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default QCUpdatesRegional;