import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { caseUpdateService } from '../../services/caseupdate.service';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import Logs from '../../components/sharedComponents/components/Logs';
import QCUpdateCentral from '../../components/sharedComponents/components/QCUpdateCentral';
import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';


// API URL - Update with your environment config
const PDF_DOWNLOAD_URL = import.meta.env.REACT_APP_PDF_DOWNLOAD_URL || 'https://api.example.com/pdf/details';

interface QCPendingFormsProps {
  // No props needed - gets data from URL params
}

const QCPendingForms: React.FC<QCPendingFormsProps> = () => {
  const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  
  // State
  const [activeTab, setActiveTab] = useState(0);
  const [investigationId, setInvestigationId] = useState('');
  const [claimsType, setClaimsType] = useState('');
  const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
  const [claimNo, setClaimNo] = useState('');
  const [sbigClaimNo, setSbigClaimNo] = useState('');
  const [reworkCaseComments, setReworkCaseComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [claimDetails, setClaimDetails] = useState(true);
  
  // Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [questionaryRadio, setQuestionaryRadio] = useState('');
  const [downloading, setDownloading] = useState(false);

  // QC Update props
  const [buttonEnable] = useState(true);
  const [display] = useState('block');

  useEffect(() => {
    // Get query params
    const type = searchParams.get('claimsType') || '';
    const tpaClaimNo = searchParams.get('claimNo') || '';
    const sbigNo = searchParams.get('sbigclaimno') || '';
    
    setClaimsType(type);
    setClaimNo(tpaClaimNo);
    setSbigClaimNo(sbigNo);
    
    // Set claims type label
    const label = type === 'cashless' ? 'Cashless' : type === 'reim' ? 'Reimbursement' : '';
    setClaimsTypeLabel(label);

    // Get investigation ID
    if (paramInvestigationId) {
      const cleanedId = paramInvestigationId.split(' ')[0];
      setInvestigationId(cleanedId);
      fetchCaseDetails(cleanedId);
    }
  }, [paramInvestigationId, searchParams]);

  const fetchCaseDetails = async (invId: string) => {
    try {
      setLoading(true);
      const response = await caseUpdateService.caseUpdatePreview(invId);
      
      if (response.statusCode === 0) {
        setClaimDetails(response.payload);
        setReworkCaseComments(response.payload.reworkCaseComments || '');
      }
    } catch (error) {
      console.error('Error fetching case details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const openReportModal = () => {
    setQuestionaryRadio('');
    
    // For cashless, download directly without modal
    if (claimsType === 'cashless') {
      handleDownloadCashlessPDF();
      return;
    }
    
    // For reimbursement, show modal with options
    setReportModalOpen(true);
  };

  const closeReportModal = () => {
    setReportModalOpen(false);
    setQuestionaryRadio('');
  };

  const handleQuestionaryRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionaryRadio(event.target.value);
  };

  const handleDownloadPDF = () => {
    if (!questionaryRadio) return;

    const url = `${PDF_DOWNLOAD_URL}?invClaimId=${investigationId}&pdfType=${questionaryRadio}&claimType=${claimsType}`;
    window.open(url, '_blank');
    closeReportModal();
  };

  const handleDownloadCashlessPDF = () => {
    const url = `${PDF_DOWNLOAD_URL}?invClaimId=${investigationId}&pdfType=${questionaryRadio}&claimType=${claimsType}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading case details...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header with Investigation Details */}
        <Box sx={{ mb: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1">
                <strong>Investigation No:</strong> {investigationId}
              </Typography>
              <Chip 
                label={claimsTypeLabel} 
                color="warning" 
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body1">
              <strong>SBIG Claim No:</strong> {sbigClaimNo}
            </Typography>
            <Typography variant="body1">
              <strong>TPA Claim No:</strong> {claimNo}
            </Typography>
          </Box>

          {/* Investigation Report Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DescriptionIcon />}
              onClick={openReportModal}
            >
              Investigation Report
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

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
            <Tab label="Pre-Auth Details" />
            <Tab label="Insured & Hospital Details" />
            <Tab label="Case Info" />
            <Tab label="Documents" />
            <Tab label="F.O Update" />
            <Tab label="Agency QC" />
            <Tab label="QC Update" />
            <Tab label="Logs" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ pt: 3 }}>
          {/* Tab 0: Pre-Auth Details */}
          {activeTab === 0 && (
            <PreAuth
            //   investigationId={investigationId}
            //   claimsType={claimsType}
              claimDetails={claimDetails}
            />
          )}

          {/* Tab 1: Insured & Hospital Details */}
          {activeTab === 1 && (
            <HospitalInfo
            claimDetails={claimDetails}
            claimsType={claimsType}
            //   investigationId={investigationId}
            //   isFormEditable={false}
            //   onNextPage={() => {}}
            />
          )}

          {/* Tab 2: Case Info */}
          {activeTab === 2 && (
            <CaseInfoComponent
            //   investigationId={investigationId}
            />
          )}

          {/* Tab 3: Documents */}
          {activeTab === 3 && (
            <CentralRegionalDocuments
            //   investigationId={investigationId}
            />
          )}

          {/* Tab 4: F.O Update */}
          {activeTab === 4 && (
            <Box>
              {reworkCaseComments && (
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    component="span" 
                    sx={{ color: '#776BC5', fontWeight: 700 }}
                  >
                    Comments:
                  </Typography>
                  <Typography 
                    component="span" 
                    sx={{ fontWeight: 700, ml: 1 }}
                  >
                    {reworkCaseComments}
                  </Typography>
                </Box>
              )}
              {/* <Preview */}
              <CentralAssignedAgencyCaseUpdate
                // investigationId={investigationId}
                buttonVisible={true}
                previewRefresh={false}
              />
            </Box>
          )}

          {/* Tab 5: Agency QC */}
          {activeTab === 5 && (
            "?ertghj"
            // <QCUpdates
            //   investigationId={investigationId}
            //   display="block"
            //   editable={true}
            // />
          )}

          {/* Tab 6: QC Update */}
          {activeTab === 6 && (
            <Box sx={{ display: display }}>
              <QCUpdateCentral
                investigationId={investigationId}
                buttonEnable={buttonEnable}
              />
            </Box>
          )}

          {/* Tab 7: Logs */}
          {activeTab === 7 && (
            <Logs
            //   investigationId={investigationId}
              claimsType={claimsType}
            />
          )}
        </Box>
      </Paper>

      {/* Investigation Report Modal (For Reimbursement) */}
      <Dialog
        open={reportModalOpen}
        onClose={closeReportModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Investigation Report</Typography>
            <IconButton onClick={closeReportModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            value={questionaryRadio}
            onChange={handleQuestionaryRadioChange}
          >
            <FormControlLabel
              value="ReportEmployer"
              control={<Radio />}
              label="Employer Report"
            />
            <FormControlLabel
              value="ReportInsured"
              control={<Radio />}
              label="Insured Report"
            />
            <FormControlLabel
              value="ReportHospital"
              control={<Radio />}
              label="Hospital Report"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          {questionaryRadio && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadPDF}
              disabled={downloading}
            >
              {downloading ? 'Downloading...' : 'Download'}
            </Button>
          )}
          <Button onClick={closeReportModal} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QCPendingForms;