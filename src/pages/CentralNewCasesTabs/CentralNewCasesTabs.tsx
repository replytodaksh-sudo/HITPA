// src/components/CentralNewCasesTabs/CentralNewCasesTabs.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  LocalHospital as HospitalIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  History as HistoryIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

// Import child components (create these as separate files)
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import AcceptDeny from '../../components/sharedComponents/components/AcceptDeny';
import Logs from '../../components/sharedComponents/components/Logs';
import { claimsService } from '../../services/claims.service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`case-tabpanel-${index}`}
      aria-labelledby={`case-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CentralNewCasesTabs: React.FC = () => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();

  // State
  const [activeTab, setActiveTab] = useState(0);
  const [claimsType, setClaimsType] = useState<string>('');
  const [claimsTypeLabel, setClaimsTypeLabel] = useState<string>('');
  const [claimNo, setClaimNo] = useState<string>('');
  const [sbigClaimNo, setSbigClaimNo] = useState<string>('');
  const [cleanInvestigationId, setCleanInvestigationId] = useState<string>('');
  const [claimDetails, setClaimDetails] = useState<any>(null);

  useEffect(() => {
    // Get query parameters
    const type = searchParams.get('claimsType') || '';
    const tpaClaimNo = searchParams.get('claimNo') || '';
    const sbigNo = searchParams.get('sbigclaimno') || '';

    setClaimsType(type);
    setClaimNo(tpaClaimNo);
    setSbigClaimNo(sbigNo);



    // Set label based on type
    const label = type === 'cashless'
      ? 'Cashless'
      : type === 'reim'
        ? 'Reimbursement'
        : '';
    setClaimsTypeLabel(label);

    // Clean investigation ID (remove any extra spaces)
    if (investigationId) {
      setCleanInvestigationId(investigationId.split(' ')[0]);
      fetchClaimDetails(investigationId);
    }
  }, [investigationId, searchParams]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const fetchClaimDetails = async (invId: string) => {
    // setLoading(true);
    try {
      const response = await claimsService.claimDetails(invId);
      if (response.statusCode === 0) {
        setClaimDetails(response.payload);
        sessionStorage.setItem('formEditable', response.payload.editable);
        sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
      }
    } catch (error) {
      console.error('Error fetching claim details:', error);
    } finally {
      // setLoading(false);
    }
  };

  // Define tabs based on claims type
  const getCashlessTabs = () => [
    { label: 'Pre-Auth Details', icon: <AssignmentIcon />, component: <PreAuth claimDetails={claimDetails} /> },
    { label: 'Insured & Hospital Details', icon: <HospitalIcon />, component: <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} /> },
    { label: 'Case Info', icon: <InfoIcon />, component: <CaseInfoComponent /> },
    {
      label: 'Accept / Deny', icon: <CheckIcon />, component: <AcceptDeny
        claimType={claimsType}
        accid={claimDetails?.accid}
        invsid={investigationId!}
        invesType={claimDetails?.invesType}
        invesSubType={claimDetails?.invesSubType} />
    },
    { label: 'Logs', icon: <HistoryIcon />, component: <Logs claimsType={claimsType} /> },
  ];

  const getReimbursementTabs = () => [
    { label: 'Claim Details', icon: <ReceiptIcon />, component: <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails}/> },
    { label: 'Insured & Hospital Details', icon: <HospitalIcon />, component: <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} /> },
    { label: 'Case Info', icon: <InfoIcon />, component: <CaseInfoComponent /> },
    {
      label: 'Accept / Deny', icon: <CheckIcon />, component: <AcceptDeny
        claimType={claimsType}
        accid={claimDetails?.accid}
        invsid={investigationId!}
        invesType={claimDetails?.invesType}
        invesSubType={claimDetails?.invesSubType} />
    },
    { label: 'Logs', icon: <HistoryIcon />, component: <Logs claimsType={claimsType} /> },
  ];

  const tabs = claimsType === 'cashless' ? getCashlessTabs() : getReimbursementTabs();

  return (
    <Box sx={{ p: 3 }}>
      <Card
        sx={{
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          borderRadius: 3,
          overflow: 'visible',
        }}
      >
        <CardContent>
          {/* Header with Investigation Details */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
              borderRadius: 2,
              color: 'white',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
                  Investigation No
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {cleanInvestigationId}
                  </Typography>
                  <Chip
                    label={claimsTypeLabel}
                    size="small"
                    sx={{
                      bgcolor: 'warning.main',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
                  Claim No
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {sbigClaimNo}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
                  TPA Claim No
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {claimNo}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  minHeight: 64,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                  id={`case-tab-${index}`}
                  aria-controls={`case-tabpanel-${index}`}
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Panels */}
          {tabs.map((tab, index) => (
            <TabPanel key={index} value={activeTab} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CentralNewCasesTabs;