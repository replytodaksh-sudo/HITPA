// // src/components/CentralNewCasesTabs/CentralNewCasesTabs.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import {
//   Box,
//   Card,
//   CardContent,
//   Chip,
//   Grid,
//   Tab,
//   Tabs,
//   Typography,
// } from '@mui/material';
// import {
//   Assignment as AssignmentIcon,
//   LocalHospital as HospitalIcon,
//   Info as InfoIcon,
//   CheckCircle as CheckIcon,
//   History as HistoryIcon,
//   Receipt as ReceiptIcon,
// } from '@mui/icons-material';

// // Import child components (create these as separate files)
// import PreAuth from '../../components/sharedComponents/components/PreAuth';
// import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
// import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
// import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
// import AcceptDeny from '../../components/sharedComponents/components/AcceptDeny';
// import Logs from '../../components/sharedComponents/components/Logs';
// import { claimsService } from '../../services/claims.service';

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`case-tabpanel-${index}`}
//       aria-labelledby={`case-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// const CentralNewCasesTabs: React.FC = () => {
//   const { investigationId } = useParams<{ investigationId: string }>();
//   const [searchParams] = useSearchParams();

//   // State
//   const [activeTab, setActiveTab] = useState(0);
//   const [claimsType, setClaimsType] = useState<string>('');
//   const [claimsTypeLabel, setClaimsTypeLabel] = useState<string>('');
//   const [claimNo, setClaimNo] = useState<string>('');
//   const [sbigClaimNo, setSbigClaimNo] = useState<string>('');
//   const [cleanInvestigationId, setCleanInvestigationId] = useState<string>('');
//   const [claimDetails, setClaimDetails] = useState<any>(null);

//   useEffect(() => {
//     // Get query parameters
//     const type = searchParams.get('claimsType') || '';
//     const tpaClaimNo = searchParams.get('claimNo') || '';
//     const sbigNo = searchParams.get('sbigclaimno') || '';

//     setClaimsType(type);
//     setClaimNo(tpaClaimNo);
//     setSbigClaimNo(sbigNo);



//     // Set label based on type
//     const label = type === 'cashless'
//       ? 'Cashless'
//       : type === 'reim'
//         ? 'Reimbursement'
//         : '';
//     setClaimsTypeLabel(label);

//     // Clean investigation ID (remove any extra spaces)
//     if (investigationId) {
//       setCleanInvestigationId(investigationId.split(' ')[0]);
//       fetchClaimDetails(investigationId);
//     }
//   }, [investigationId, searchParams]);

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setActiveTab(newValue);
//   };

//   const fetchClaimDetails = async (invId: string) => {
//     // setLoading(true);
//     try {
//       const response = await claimsService.claimDetails(invId);
//       if (response.statusCode === 0) {
//         setClaimDetails(response.payload);
//         sessionStorage.setItem('formEditable', response.payload.editable);
//         sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
//       }
//     } catch (error) {
//       console.error('Error fetching claim details:', error);
//     } finally {
//       // setLoading(false);
//     }
//   };

//   // Define tabs based on claims type
//   const getCashlessTabs = () => [
//     { label: 'Pre-Auth Details', icon: <AssignmentIcon />, component: <PreAuth claimDetails={claimDetails} /> },
//     { label: 'Insured & Hospital Details', icon: <HospitalIcon />, component: <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} /> },
//     { label: 'Case Info', icon: <InfoIcon />, component: <CaseInfoComponent /> },
//     {
//       label: 'Accept / Deny', icon: <CheckIcon />, component: <AcceptDeny
//         claimType={claimsType}
//         accid={claimDetails?.accid}
//         invsid={investigationId!}
//         invesType={claimDetails?.invesType}
//         invesSubType={claimDetails?.invesSubType} />
//     },
//     { label: 'Logs', icon: <HistoryIcon />, component: <Logs claimsType={claimsType} /> },
//   ];

//   const getReimbursementTabs = () => [
//     { label: 'Claim Details', icon: <ReceiptIcon />, component: <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails}/> },
//     { label: 'Insured & Hospital Details', icon: <HospitalIcon />, component: <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} /> },
//     { label: 'Case Info', icon: <InfoIcon />, component: <CaseInfoComponent /> },
//     {
//       label: 'Accept / Deny', icon: <CheckIcon />, component: <AcceptDeny
//         claimType={claimsType}
//         accid={claimDetails?.accid}
//         invsid={investigationId!}
//         invesType={claimDetails?.invesType}
//         invesSubType={claimDetails?.invesSubType} />
//     },
//     { label: 'Logs', icon: <HistoryIcon />, component: <Logs claimsType={claimsType} /> },
//   ];

//   const tabs = claimsType === 'cashless' ? getCashlessTabs() : getReimbursementTabs();

//   return (
//     <Box sx={{ p: 3 }}>
//       <Card
//         sx={{
//           boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
//           borderRadius: 3,
//           overflow: 'visible',
//         }}
//       >
//         <CardContent>
//           {/* Header with Investigation Details */}
//           <Box
//             sx={{
//               mb: 3,
//               p: 2,
//               background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
//               borderRadius: 2,
//               color: 'white',
//             }}
//           >
//             <Grid container spacing={2} alignItems="center">
//               <Grid size={{ xs: 12, md: 4 }}>
//                 <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
//                   Investigation No
//                 </Typography>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Typography variant="h6" fontWeight={700}>
//                     {cleanInvestigationId}
//                   </Typography>
//                   <Chip
//                     label={claimsTypeLabel}
//                     size="small"
//                     sx={{
//                       bgcolor: 'warning.main',
//                       color: 'white',
//                       fontWeight: 600,
//                     }}
//                   />
//                 </Box>
//               </Grid>
//               <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'center' } }}>
//                 <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
//                   Claim No
//                 </Typography>
//                 <Typography variant="h6" fontWeight={700}>
//                   {sbigClaimNo}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
//                 <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
//                   TPA Claim No
//                 </Typography>
//                 <Typography variant="h6" fontWeight={700}>
//                   {claimNo}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Box>

//           {/* Tabs */}
//           <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//             <Tabs
//               value={activeTab}
//               onChange={handleTabChange}
//               variant="scrollable"
//               scrollButtons="auto"
//               sx={{
//                 '& .MuiTab-root': {
//                   textTransform: 'none',
//                   fontWeight: 600,
//                   fontSize: '0.95rem',
//                   minHeight: 64,
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     bgcolor: 'action.hover',
//                   },
//                   '&.Mui-selected': {
//                     color: 'primary.main',
//                   },
//                 },
//                 '& .MuiTabs-indicator': {
//                   height: 3,
//                   borderRadius: '3px 3px 0 0',
//                   background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
//                 },
//               }}
//             >
//               {tabs.map((tab, index) => (
//                 <Tab
//                   key={index}
//                   label={tab.label}
//                   icon={tab.icon}
//                   iconPosition="start"
//                   id={`case-tab-${index}`}
//                   aria-controls={`case-tabpanel-${index}`}
//                 />
//               ))}
//             </Tabs>
//           </Box>

//           {/* Tab Panels */}
//           {tabs.map((tab, index) => (
//             <TabPanel key={index} value={activeTab} index={index}>
//               {tab.component}
//             </TabPanel>
//           ))}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default CentralNewCasesTabs;

// File: src/components/CentralNewCasesTabs.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  Description,
  LocalHospital,
  Info,
  CheckCircle,
  History,
  Assignment,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import AcceptDeny from '../../components/sharedComponents/components/AcceptDeny';
import Logs from '../../components/sharedComponents/components/Logs';
import { claimsService } from '../../services/claims.service';

const CentralNewCasesTabs: React.FC = () => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();

  const [expanded, setExpanded] = useState<string | false>('panel1');
  const [acceptDenyDialogOpen, setAcceptDenyDialogOpen] = useState(false);
  const [cleanInvestigationId, setCleanInvestigationId] = useState<string>('');
  const [claimDetails, setClaimDetails] = useState<any>(null);

  // Extract query parameters
  const claimsType = searchParams.get('claimsType') || '';
  const claimNo = searchParams.get('claimNo') || '';
  const sbigClaimNo = searchParams.get('sbigclaimno') || '';

  const claimsTypeLabel = claimsType === 'cashless'
    ? 'Cashless'
    : claimsType === 'reim'
      ? 'Reimbursement'
      : '';

  useEffect(() => {
    if (investigationId) {
      const cleanId = investigationId.split(' ')[0];
      setCleanInvestigationId(cleanId);
      fetchClaimDetails(investigationId);
    }
  }, [investigationId]);

  const fetchClaimDetails = async (invId: string) => {
    try {
      const response = await claimsService.claimDetails(invId);
      if (response.statusCode === 0) {
        setClaimDetails(response.payload);
        sessionStorage.setItem('formEditable', response.payload.editable);
        sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
      }
    } catch (error) {
      console.error('Error fetching claim details:', error);
    }
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAcceptDenyClick = () => {
    setAcceptDenyDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAcceptDenyDialogOpen(false);
  };

  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Gradient Header Section */}
          <Box
            sx={{
              p: 3,
              background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
              color: 'white',
              borderRadius: '12px 12px 0 0',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Assignment sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#f1f1f1" }}>
                    Investigation No:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 400, color: "#f1f1f1" }}>
                    {cleanInvestigationId}
                  </Typography>
                  <Chip
                    label={claimsTypeLabel}
                    size="small"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#f1f1f1" }}>
                    Claim No:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 400, color: "#f1f1f1" }}>
                    {sbigClaimNo || '-'}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#f1f1f1" }}>
                    TPA Claim No:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 400, color: "#f1f1f1" }}>
                    {claimNo || '-'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Content Area */}
          <Box sx={{ p: 3, bgcolor: '#F5F7FA' }}>
            {/* Accept/Deny Button at Top */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CheckCircle />}
                onClick={handleAcceptDenyClick}
                sx={{
                  bgcolor: '#10B981',
                  color: 'white',
                  py: 1.5,
                  px: 4,
                  height: "40px",
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  '&:hover': {
                    bgcolor: '#059669',
                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
                  },
                }}
              >
                Accept / Deny
              </Button>
            </Box>

            {/* Accordion Sections */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Pre-Auth / Claim Details Accordion */}
              <Accordion
                expanded={expanded === 'panel1'}
                onChange={handleAccordionChange('panel1')}
                sx={{
                  bgcolor: '#E0F2FE',
                  borderRadius: '8px !important',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#1E293B' }} />}
                  sx={{
                    minHeight: 56,
                    '&.Mui-expanded': {
                      minHeight: 56,
                    },
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0',
                      '&.Mui-expanded': {
                        margin: '12px 0',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {claimsType === 'cashless' ? (
                      <Description sx={{ color: '#3B82F6' }} />
                    ) : (
                      <ReceiptIcon sx={{ color: '#3B82F6' }} />
                    )}
                    <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                      {claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details'}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                  {claimsType === 'cashless' ? (
                    <PreAuth claimDetails={claimDetails} />
                  ) : (
                    <ClaimDetailsReim claimDetails={claimDetails} claimsType={claimsType} />
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Hospital Info Accordion */}
              <Accordion
                expanded={expanded === 'panel2'}
                onChange={handleAccordionChange('panel2')}
                sx={{
                  bgcolor: '#E0F2FE',
                  borderRadius: '8px !important',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#1E293B' }} />}
                  sx={{
                    minHeight: 56,
                    '&.Mui-expanded': {
                      minHeight: 56,
                    },
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0',
                      '&.Mui-expanded': {
                        margin: '12px 0',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LocalHospital sx={{ color: '#3B82F6' }} />
                    <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                      Insured & Hospital Details
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                  <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />
                </AccordionDetails>
              </Accordion>

              {/* Case Info Accordion */}
              <Accordion
                expanded={expanded === 'panel3'}
                onChange={handleAccordionChange('panel3')}
                sx={{
                  bgcolor: '#E0F2FE',
                  borderRadius: '8px !important',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#1E293B' }} />}
                  sx={{
                    minHeight: 56,
                    '&.Mui-expanded': {
                      minHeight: 56,
                    },
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0',
                      '&.Mui-expanded': {
                        margin: '12px 0',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Info sx={{ color: '#3B82F6' }} />
                    <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                      Case Info
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                  <CaseInfoComponent />
                </AccordionDetails>
              </Accordion>

              {/* Logs Accordion */}
              <Accordion
                expanded={expanded === 'panel4'}
                onChange={handleAccordionChange('panel4')}
                sx={{
                  bgcolor: '#E0F2FE',
                  borderRadius: '8px !important',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#1E293B' }} />}
                  sx={{
                    minHeight: 56,
                    '&.Mui-expanded': {
                      minHeight: 56,
                    },
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0',
                      '&.Mui-expanded': {
                        margin: '12px 0',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <History sx={{ color: '#3B82F6' }} />
                    <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                      Logs
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                  <Logs claimsType={claimsType} />
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Accept/Deny Dialog */}
      <Dialog
        open={acceptDenyDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#E0F2FE',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CheckCircle sx={{ color: '#3B82F6' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B' }}>
              Accept / Deny
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <AcceptDeny
            claimType={claimsType}
            accid={claimDetails?.accid}
            invsid={investigationId || ''}
            invesType={claimDetails?.invesType}
            invesSubType={claimDetails?.invesSubType}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CentralNewCasesTabs;