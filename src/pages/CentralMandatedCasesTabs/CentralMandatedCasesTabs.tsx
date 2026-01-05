// // File: src/components/CentralMandatedTab.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import {
//   Box,
//   Card,
//   CardContent,
//   Tabs,
//   Tab,
//   Typography,
//   Chip,
//   Grid,
// } from '@mui/material';
// import PreAuth from '../../components/sharedComponents/components/PreAuth';
// import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
// import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
// import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
// import Logs from '../../components/sharedComponents/components/Logs';
// import { claimsService } from '../../services/claims.service';
// import CentralMandatedAcceptDeny from '../../components/sharedComponents/components/CentralMandatedAcceptDeny';

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`tabpanel-${index}`}
//       aria-labelledby={`tab-${index}`}
//     >
//       {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
//     </div>
//   );
// };

// const CentralMandatedTabs: React.FC = () => {
//   const { investigationId } = useParams<{ investigationId: string }>();
//   const [searchParams] = useSearchParams();

//   // State
//   const [activeTab, setActiveTab] = useState<number>(0);
//   const [claimsType, setClaimsType] = useState<string>('');
//   const [claimsTypeLabel, setClaimsTypeLabel] = useState<string>('');
//   const [claimNo, setClaimNo] = useState<string>('');
//   const [sbiclaimNo, setSbiclaimNo] = useState<string>('');
//   const [cleanInvestigationId, setCleanInvestigationId] = useState<string>('');
//   const [claimDetails, setClaimDetails] = useState<any>(null);

//   useEffect(() => {
//     // Get query parameters
//     const type = searchParams.get('claimsType') || '';
//     const tpaClaimNo = searchParams.get('claimNo') || '';
//     const sbigClaimNo = searchParams.get('sbigclaimno') || '';

//     setClaimsType(type);
//     setClaimNo(tpaClaimNo);
//     setSbiclaimNo(sbigClaimNo);

//     // Set label
//     if (type === 'cashless') {
//       setClaimsTypeLabel('Cashless');
//     } else if (type === 'reim') {
//       setClaimsTypeLabel('Reimbursement');
//     } else {
//       setClaimsTypeLabel('');
//     }

//     // Clean investigation ID
//     if (investigationId) {
//       const cleanId = investigationId.split(' ')[0];
//       setCleanInvestigationId(cleanId);
//       fetchClaimDetails(cleanId);
//     }
//   }, [investigationId, searchParams]);

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setActiveTab(newValue);
//   };

//   const fetchClaimDetails = async (invId: string) => {
//       // setLoading(true);
//       try {
//         const response = await claimsService.claimDetails(invId);
//         if (response.statusCode === 0) {
//           setClaimDetails(response.payload);
//           sessionStorage.setItem('formEditable', response.payload.editable);
//           sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
//         }
//       } catch (error) {
//         console.error('Error fetching claim details:', error);
//       } finally {
//         // setLoading(false);
//       }
//     };

//   return (
//     <Box sx={{ width: '100%', p: 3 }}>
//       <Card elevation={3}>
//         <CardContent>
//           {/* Header Section with Investigation Details */}
//           <Grid container spacing={2} sx={{ mb: 3 }}>
//             <Grid size={{ xs: 12, md: 4 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Typography variant="body1">
//                   <strong>Investigation No:</strong> {cleanInvestigationId}
//                 </Typography>
//                 <Chip
//                   label={claimsTypeLabel}
//                   color="warning"
//                   size="small"
//                   sx={{ fontWeight: 'bold' }}
//                 />
//               </Box>
//             </Grid>
//             <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'center' } }}>
//               <Typography variant="body1">
//                 <strong>Claim No:</strong> {sbiclaimNo}
//               </Typography>
//             </Grid>
//             <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
//               <Typography variant="body1">
//                 <strong>TPA Claim No:</strong> {claimNo}
//               </Typography>
//             </Grid>
//           </Grid>

//           {/* Tabs Navigation */}
//           <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//             <Tabs
//               value={activeTab}
//               onChange={handleTabChange}
//               aria-label="central mandated tabs"
//               variant="scrollable"
//               scrollButtons="auto"
//               sx={{
//                 '& .MuiTab-root': {
//                   textTransform: 'none',
//                   fontWeight: 500,
//                   fontSize: '0.95rem',
//                 },
//                 '& .Mui-selected': {
//                   color: '#667eea',
//                 },
//                 '& .MuiTabs-indicator': {
//                   backgroundColor: '#667eea',
//                 },
//               }}
//             >
//               {/* First tab - conditional based on claimsType */}
//               {claimsType === 'cashless' && (
//                 <Tab label="Pre-Auth Details" id="tab-0" />
//               )}
//               {claimsType === 'reim' && (
//                 <Tab label="Claim Details" id="tab-0" />
//               )}
              
//               {/* Common tabs */}
//               <Tab label="Insured & Hospital Details" id="tab-1" />
//               <Tab label="Case Info" id="tab-2" />
//               <Tab label="Accept / Deny" id="tab-3" />
//               <Tab label="Logs" id="tab-4" />
//             </Tabs>
//           </Box>

//           {/* Tab Panels */}
//           <Box sx={{ mt: 2 }}>
//             {/* Pre-Auth Details (Cashless) */}
//             {claimsType === 'cashless' && (
//               <TabPanel value={activeTab} index={0}>
//                 <PreAuth claimDetails={claimDetails}/>
//               </TabPanel>
//             )}

//             {/* Claim Details (Reimbursement) */}
//             {claimsType === 'reim' && (
//               <TabPanel value={activeTab} index={0}>
//                 <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails}/>
//               </TabPanel>
//             )}

//             {/* Insured & Hospital Details */}
//             <TabPanel value={activeTab} index={1}>
//               <HospitalInfo claimsType={claimsType} claimDetails={claimDetails}/>
//             </TabPanel>

//             {/* Case Info */}
//             <TabPanel value={activeTab} index={2}>
//               <CaseInfoComponent />
//             </TabPanel>

//             {/* Accept / Deny */}
//             <TabPanel value={activeTab} index={3}>
//               <CentralMandatedAcceptDeny claimType={claimsType} />
//             </TabPanel>

//             {/* Logs */}
//             <TabPanel value={activeTab} index={4}>
//               <Logs claimsType={claimsType} />
//             </TabPanel>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default CentralMandatedTabs;

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
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
  ExpandMore as ExpandMoreIcon,
  Description as DescriptionIcon,
  LocalHospital as HospitalIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import Logs from '../../components/sharedComponents/components/Logs';
import { claimsService } from '../../services/claims.service';
import CentralMandatedAcceptDeny from '../../components/sharedComponents/components/CentralMandatedAcceptDeny';

const CentralMandatedTabs: React.FC = () => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();

  // State
  const [expanded, setExpanded] = useState<string | false>('panel1');
  const [claimsType, setClaimsType] = useState<string>('');
  const [claimsTypeLabel, setClaimsTypeLabel] = useState<string>('');
  const [claimNo, setClaimNo] = useState<string>('');
  const [sbiclaimNo, setSbiclaimNo] = useState<string>('');
  const [cleanInvestigationId, setCleanInvestigationId] = useState<string>('');
  const [claimDetails, setClaimDetails] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Get query parameters
    const type = searchParams.get('claimsType') || '';
    const tpaClaimNo = searchParams.get('claimNo') || '';
    const sbigClaimNo = searchParams.get('sbigclaimno') || '';

    setClaimsType(type);
    setClaimNo(tpaClaimNo);
    setSbiclaimNo(sbigClaimNo);

    // Set label
    if (type === 'cashless') {
      setClaimsTypeLabel('Cashless');
    } else if (type === 'reim') {
      setClaimsTypeLabel('Reimbursement');
    } else {
      setClaimsTypeLabel('');
    }

    // Clean investigation ID
    if (investigationId) {
      const cleanId = investigationId.split(' ')[0];
      setCleanInvestigationId(cleanId);
      fetchClaimDetails(cleanId);
    }
  }, [investigationId, searchParams]);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

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

  return (
    <Box sx={{ p: 3, bgcolor: '#F5F7FA', minHeight: '100vh' }}>
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Gradient Header */}
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
                <AssignmentIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color:"#fff" }}>
                  Investigation No:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 400, color:"#fff" }}>
                  {cleanInvestigationId}
                </Typography>
                {claimsTypeLabel && (
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
                )}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color:"#fff" }}>
                  Claim No:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 400, color:"#fff" }}>
                  {sbiclaimNo || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color:"#fff" }}>
                  TPA Claim No:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 400, color:"#fff" }}>
                  {claimNo || '-'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Accept/Deny Button at Top */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={handleOpenDialog}
              sx={{
                bgcolor: '#10B981',
                color: 'white',
                py: 1.5,
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
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

          {/* Accordion 1: Pre-Auth Details / Claim Details */}
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleAccordionChange('panel1')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E0F2FE',
                borderRadius: 2,
                '&:hover': { bgcolor: '#BAE6FD' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DescriptionIcon sx={{ color: '#0284C7' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  {claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details'}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              {claimsType === 'cashless' ? (
                <PreAuth claimDetails={claimDetails} />
              ) : (
                <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails} />
              )}
            </AccordionDetails>
          </Accordion>

          {/* Accordion 2: Insured & Hospital Details */}
          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleAccordionChange('panel2')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E0F2FE',
                borderRadius: 2,
                '&:hover': { bgcolor: '#BAE6FD' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <HospitalIcon sx={{ color: '#0284C7' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Insured & Hospital Details
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />
            </AccordionDetails>
          </Accordion>

          {/* Accordion 3: Case Info */}
          <Accordion
            expanded={expanded === 'panel3'}
            onChange={handleAccordionChange('panel3')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E0F2FE',
                borderRadius: 2,
                '&:hover': { bgcolor: '#BAE6FD' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <InfoIcon sx={{ color: '#0284C7' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Case Info
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              <CaseInfoComponent />
            </AccordionDetails>
          </Accordion>

          {/* Accordion 4: Logs */}
          <Accordion
            expanded={expanded === 'panel4'}
            onChange={handleAccordionChange('panel4')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E0F2FE',
                borderRadius: 2,
                '&:hover': { bgcolor: '#BAE6FD' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <HistoryIcon sx={{ color: '#0284C7' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Logs
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              <Logs claimsType={claimsType} />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      {/* Accept/Deny Dialog */}
      <Dialog
        open={openDialog}
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
            bgcolor: '#E0F2FE',
            color: '#0F172A',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CheckCircleIcon sx={{ color: '#10B981' }} />
            <span>Accept / Deny</span>
          </Box>
          <IconButton
            onClick={handleCloseDialog}
            size="small"
            sx={{
              color: '#64748B',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <CentralMandatedAcceptDeny claimType={claimsType} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CentralMandatedTabs;