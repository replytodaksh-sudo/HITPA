// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import {
//   Box,
//   Card,
//   CardContent,
//   Container,
//   Tabs,
//   Tab,
//   Typography,
//   Chip,
//   Grid,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   CircularProgress,
//   Alert,
// } from '@mui/material';
// import {
//   Description,
//   LocalHospital,
//   Info,
//   FolderOpen,
//   Update,
//   History,
//   Assignment,
//   Refresh,
//   Email,
// } from '@mui/icons-material';
// import { claimsService } from '../../services/claims.service';
// import setupService from '../../services/setup.service';
// import PreAuth from '../../components/sharedComponents/components/PreAuth';
// import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
// import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
// import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
// import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
// import CentralRegionalCaseUpdate from '../../components/sharedComponents/components/CentralRegionalCaseUpdate';
// import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
// import Logs from '../../components/sharedComponents/components/Logs';
// import AcceptAgencies from '../../components/sharedComponents/components/acceptAgency';
// import AcceptInternalTeam from '../../components/sharedComponents/components/AcceptInternalTeam';

// // ============================================================================
// // INTERFACES
// // ============================================================================

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// interface EmailModel {
//   to: string;
//   cc: string[];
//   cc1: string[];
//   subject: string;
//   body: string;
// }

// // ============================================================================
// // TAB PANEL COMPONENT
// // ============================================================================

// const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`agency-tabpanel-${index}`}
//       aria-labelledby={`agency-tab-${index}`}
//     >
//       {value === index && (
//         <Box
//           sx={{
//             py: 3,
//             animation: 'fadeIn 0.3s ease-in',
//             '@keyframes fadeIn': {
//               from: { opacity: 0, transform: 'translateY(10px)' },
//               to: { opacity: 1, transform: 'translateY(0)' },
//             },
//           }}
//         >
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// };

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// const AssignToAgencyDetailsTabs: React.FC = () => {
//   const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
//   const [searchParams] = useSearchParams();

//   const [activeTab, setActiveTab] = useState<number>(0);
//   const [investigationId, setInvestigationId] = useState<string>('');
//   const [claimDetails, setClaimDetails] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Modal states
//   const [showReassignModal, setShowReassignModal] = useState<boolean>(false);
//   const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
//   const [reassignType, setReassignType] = useState<string>('');
//   const [sendingEmail, setSendingEmail] = useState<boolean>(false);
//   const [emailError, setEmailError] = useState<string>('');

//   // Extract query parameters
//   const claimsType = searchParams.get('claimsType') || 'cashless';
//   const claimNo = searchParams.get('claimNo') || '';
//   const sbiclaimNo = searchParams.get('sbigclaimno') || '';
//   const acceptAssignId = searchParams.get('acceptAssignId') || '';

//   const claimsTypeLabel =
//     claimsType === 'cashless' ? 'Cashless' : claimsType === 'reim' ? 'Reimbursement' : '';

//   // Email state
//   const [emailModel, setEmailModel] = useState<EmailModel>({
//     to: '',
//     cc: [],
//     cc1: [],
//     subject: '',
//     body: '',
//   });

//   // ============================================================================
//   // LIFECYCLE
//   // ============================================================================

//   useEffect(() => {
//     if (paramInvestigationId) {
//       const cleanId = paramInvestigationId.split(' ')[0];
//       setInvestigationId(cleanId);
//       fetchClaimDetails(cleanId);
//     }
//   }, [paramInvestigationId]);

//   // ============================================================================
//   // API CALLS
//   // ============================================================================

//   const fetchClaimDetails = async (invId: string) => {
//     setLoading(true);
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
//       setLoading(false);
//     }
//   };

//   // ============================================================================
//   // HANDLERS
//   // ============================================================================

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setActiveTab(newValue);
//   };

//   const handleOpenReassignModal = () => {
//     setReassignType('');
//     setShowReassignModal(true);
//   };

//   const handleCloseReassignModal = () => {
//     setShowReassignModal(false);
//     setReassignType('');
//   };

//   const handleOpenReminderModal = () => {
//     setEmailError('');
//     setShowReminderModal(true);
//   };

//   const handleCloseReminderModal = () => {
//     setShowReminderModal(false);
//     setEmailModel({ to: '', cc: [], cc1: [], subject: '', body: '' });
//     setEmailError('');
//   };

//   const handleEmailChange = (field: keyof EmailModel, value: string) => {
//     setEmailModel((prev) => ({ ...prev, [field]: value }));
//   };

//   const sendReminderMail = async () => {
//     // Validation
//     if (!emailModel.to.trim()) {
//       setEmailError('Please enter recipient email');
//       return;
//     }
//     if (!emailModel.subject.trim()) {
//       setEmailError('Please enter email subject');
//       return;
//     }
//     if (!emailModel.body.trim()) {
//       setEmailError('Please enter email body');
//       return;
//     }

//     setSendingEmail(true);
//     setEmailError('');

//     try {
//       const response = await setupService.sendRemindMail(emailModel);

//       if (response.statusCode === 0) {
//         alert('Mail successfully sent');
//         handleCloseReminderModal();
//       } else {
//         setEmailError(response.message || 'Failed to send mail');
//       }
//     } catch (error: any) {
//       console.error('Send mail error:', error);
//       setEmailError(error.message || 'Failed to send mail');
//     } finally {
//       setSendingEmail(false);
//     }
//   };

//   // ============================================================================
//   // TAB CONFIGURATION
//   // ============================================================================

//   const tabs = [
//     {
//       label: claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details',
//       icon: <Description />,
//       component:
//         claimsType === 'cashless' ? (
//           <PreAuth claimDetails={claimDetails} />
//         ) : (
//           <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails} />
//         ),
//     },
//     {
//       label: 'Insured & Hospital Details',
//       icon: <LocalHospital />,
//       component: <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />,
//     },
//     {
//       label: 'Case Info',
//       icon: <Info />,
//       component: <CaseInfoComponent />,
//     },
//     {
//       label: 'Documents',
//       icon: <FolderOpen />,
//       component: <CentralRegionalDocuments />,
//     },
//     {
//       label: 'F.O Update',
//       icon: <Update />,
//       component:
//         claimsType === 'cashless' ? (
//           <CentralRegionalCaseUpdate />
//         ) : (
//           <ReimburseCaseUpdate buttonEnable={false} />
//         ),
//     },
//     {
//       label: 'Logs',
//       icon: <History />,
//       component: <Logs claimsType={claimsType} />,
//     },
//   ];

//   // ============================================================================
//   // RENDER
//   // ============================================================================

//   if (loading && !claimDetails) {
//     return (
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           minHeight: '60vh',
//         }}
//       >
//         <CircularProgress size={60} thickness={4} sx={{ color: '#2E5A96' }} />
//       </Box>
//     );
//   }

//   return (
//     <Container maxWidth={false} sx={{ py: 3 }}>
//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
//           overflow: 'visible',
//         }}
//       >
//         <CardContent sx={{ p: 0 }}>
//           {/* Header Section */}
//           <Box
//             sx={{
//               p: 3,
//               background: 'linear-gradient(135deg, #6F62C2 0%, #8B7ED6 100%)',
//               color: 'white',
//               borderRadius: '12px 12px 0 0',
//             }}
//           >
//             <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
//               <Grid size={{ xs: 12, md: 4 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
//                   <Assignment sx={{ fontSize: 20 }} />
//                   <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                     Investigation No:
//                   </Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 400 }}>
//                     {investigationId}
//                   </Typography>
//                   <Chip
//                     label={claimsTypeLabel}
//                     size="small"
//                     sx={{
//                       background: 'rgba(255, 255, 255, 0.2)',
//                       color: 'white',
//                       fontWeight: 600,
//                       backdropFilter: 'blur(10px)',
//                     }}
//                   />
//                 </Box>
//               </Grid>
//               <Grid size={{ xs: 12, md: 4 }}>
//                 <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
//                   <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                     Claim No:
//                   </Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 400 }}>
//                     {sbiclaimNo || '-'}
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid size={{ xs: 12, md: 4 }}>
//                 <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
//                   <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                     TPA Claim No:
//                   </Typography>
//                   <Typography variant="body2" sx={{ fontWeight: 400 }}>
//                     {claimNo || '-'}
//                   </Typography>
//                 </Box>
//               </Grid>
//             </Grid>

//             {/* Action Buttons */}
//             {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//               <Button
//                 variant="contained"
//                 startIcon={<Refresh />}
//                 onClick={handleOpenReassignModal}
//                 sx={{
//                   bgcolor: 'rgba(255, 255, 255, 0.2)',
//                   backdropFilter: 'blur(10px)',
//                   '&:hover': {
//                     bgcolor: 'rgba(255, 255, 255, 0.3)',
//                   },
//                 }}
//               >
//                 Re-assign
//               </Button>
//               <Button
//                 variant="contained"
//                 startIcon={<Email />}
//                 onClick={handleOpenReminderModal}
//                 sx={{
//                   bgcolor: 'rgba(255, 255, 255, 0.2)',
//                   backdropFilter: 'blur(10px)',
//                   '&:hover': {
//                     bgcolor: 'rgba(255, 255, 255, 0.3)',
//                   },
//                 }}
//               >
//                 Send Reminder
//               </Button>
//             </Box> */}
//           </Box>

//           {/* Tabs Section */}
//           <Box
//             sx={{
//               borderBottom: 1,
//               borderColor: 'divider',
//               background: 'linear-gradient(to bottom, #F3F4F6 0%, #FFFFFF 100%)',
//             }}
//           >
//             <Tabs
//               value={activeTab}
//               onChange={handleTabChange}
//               variant="scrollable"
//               scrollButtons="auto"
//               sx={{
//                 px: 2,
//                 '& .MuiTab-root': {
//                   fontSize: '0.875rem',
//                   fontWeight: 600,
//                   textTransform: 'none',
//                   minHeight: '64px',
//                   color: 'text.secondary',
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     color: 'primary.main',
//                     background: 'rgba(111, 98, 194, 0.05)',
//                   },
//                   '&.Mui-selected': {
//                     color: 'primary.main',
//                   },
//                 },
//                 '& .MuiTabs-indicator': {
//                   height: '3px',
//                   borderRadius: '3px 3px 0 0',
//                   background: 'linear-gradient(135deg, #6F62C2 0%, #8B7ED6 100%)',
//                 },
//               }}
//             >
//               {tabs.map((tab, index) => (
//                 <Tab
//                   key={index}
//                   label={tab.label}
//                   icon={tab.icon}
//                   iconPosition="start"
//                   id={`agency-tab-${index}`}
//                   aria-controls={`agency-tabpanel-${index}`}
//                 />
//               ))}
//             </Tabs>
//           </Box>

//           {/* Tab Panels */}
//           <Box sx={{ px: 3 }}>
//             {tabs.map((tab, index) => (
//               <TabPanel key={index} value={activeTab} index={index}>
//                 {tab.component}
//               </TabPanel>
//             ))}
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Reassign Modal */}
//       <Dialog
//         open={showReassignModal}
//         onClose={handleCloseReassignModal}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             background: 'linear-gradient(135deg, #6F62C2 0%, #8B7ED6 100%)',
//             color: 'white',
//             fontWeight: 700,
//           }}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Refresh />
//             Re-assign Investigation
//           </Box>
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <FormControl component="fieldset" fullWidth>
//             <RadioGroup value={reassignType} onChange={(e) => setReassignType(e.target.value)}>
//               <FormControlLabel
//                 value="agency"
//                 control={<Radio />}
//                 label="Accept & Assign to Agency for investigation"
//                 sx={{ mb: 2 }}
//               />
//               <FormControlLabel
//                 value="internal"
//                 control={<Radio />}
//                 label="Accept & Assign to Internal Team for investigation"
//               />
//             </RadioGroup>
//           </FormControl>

//           <Box sx={{ mt: 3 }}>
//             {reassignType === 'agency' && (
//               <Box>
//                 {claimsType === 'cashless' ? (
//                   <AcceptAgencies accid={acceptAssignId} />
//                 ) : (
//                   <AcceptInternalTeam claimType={claimsType} accid={acceptAssignId} />
//                 )}
//               </Box>
//             )}
//             {reassignType === 'internal' && (
//               <Box>
//                 <AcceptInternalTeam claimType={claimsType} accid={acceptAssignId} />
//               </Box>
//             )}
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ p: 2.5, bgcolor: '#F9FAFB' }}>
//           <Button onClick={handleCloseReassignModal} color="inherit">
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Email Reminder Modal */}
//       <Dialog
//         open={showReminderModal}
//         onClose={handleCloseReminderModal}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             background: 'linear-gradient(135deg, #6F62C2 0%, #8B7ED6 100%)',
//             color: 'white',
//             fontWeight: 700,
//           }}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Email />
//             Send Reminder Email
//           </Box>
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           {emailError && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {emailError}
//             </Alert>
//           )}

//           <TextField
//             fullWidth
//             label="To"
//             placeholder="recipient@example.com"
//             value={emailModel.to}
//             onChange={(e) => handleEmailChange('to', e.target.value)}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="CC"
//             placeholder="cc@example.com (comma-separated)"
//             value={emailModel.cc.join(',')}
//             onChange={(e:any) => handleEmailChange('cc', e.target.value.split(',').map((s:any) => s.trim()).filter((s:any) => s))}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="CC1"
//             placeholder="cc1@example.com (comma-separated)"
//             value={emailModel.cc1.join(',')}
//             onChange={(e:any) => handleEmailChange('cc1', e.target.value.split(',').map((s:any) => s.trim()).filter((s:any) => s))}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Subject"
//             placeholder="Email subject"
//             value={emailModel.subject}
//             onChange={(e) => handleEmailChange('subject', e.target.value)}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Message"
//             placeholder="Enter your email message here..."
//             value={emailModel.body}
//             onChange={(e) => handleEmailChange('body', e.target.value)}
//             margin="normal"
//             multiline
//             rows={6}
//             required
//             inputProps={{ maxLength: 1000 }}
//             helperText={`${emailModel.body.length} / 1000 characters`}
//           />
//         </DialogContent>
//         <DialogActions sx={{ p: 2.5, bgcolor: '#F9FAFB' }}>
//           <Button onClick={handleCloseReminderModal} color="inherit" disabled={sendingEmail}>
//             Cancel
//           </Button>
//           <Button
//             onClick={sendReminderMail}
//             variant="contained"
//             disabled={sendingEmail}
//             startIcon={sendingEmail ? <CircularProgress size={16} /> : <Email />}
//             sx={{
//               background: 'linear-gradient(135deg, #6F62C2 0%, #8B7ED6 100%)',
//             }}
//           >
//             {sendingEmail ? 'Sending...' : 'Send Email'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default AssignToAgencyDetailsTabs;




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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Description as DescriptionIcon,
  LocalHospital as HospitalIcon,
  Info as InfoIcon,
  FolderOpen as FolderIcon,
  Update as UpdateIcon,
  History as HistoryIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { claimsService } from '../../services/claims.service';
import setupService from '../../services/setup.service';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import CentralRegionalCaseUpdate from '../../components/sharedComponents/components/CentralRegionalCaseUpdate';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import Logs from '../../components/sharedComponents/components/Logs';
import AcceptAgencies from '../../components/sharedComponents/components/acceptAgency';
import AcceptInternalTeam from '../../components/sharedComponents/components/AcceptInternalTeam';

// ============================================================================
// INTERFACES
// ============================================================================

interface EmailModel {
  to: string;
  cc: string[];
  cc1: string[];
  subject: string;
  body: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AssignToAgencyDetailsTabs: React.FC = () => {
  const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();

  const [expanded, setExpanded] = useState<string | false>('panel1');
  const [investigationId, setInvestigationId] = useState<string>('');
  const [claimDetails, setClaimDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Modal states
  const [showReassignModal, setShowReassignModal] = useState<boolean>(false);
  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [reassignType, setReassignType] = useState<string>('');
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');

  // Extract query parameters
  const claimsType = searchParams.get('claimsType') || 'cashless';
  const claimNo = searchParams.get('claimNo') || '';
  const sbiclaimNo = searchParams.get('sbigclaimno') || '';
  const acceptAssignId = searchParams.get('acceptAssignId') || '';

  const claimsTypeLabel =
    claimsType === 'cashless' ? 'Cashless' : claimsType === 'reim' ? 'Reimbursement' : '';

  // Email state
  const [emailModel, setEmailModel] = useState<EmailModel>({
    to: '',
    cc: [],
    cc1: [],
    subject: '',
    body: '',
  });

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  useEffect(() => {
    if (paramInvestigationId) {
      const cleanId = paramInvestigationId.split(' ')[0];
      setInvestigationId(cleanId);
      fetchClaimDetails(cleanId);
    }
  }, [paramInvestigationId]);

  // ============================================================================
  // API CALLS
  // ============================================================================

  const fetchClaimDetails = async (invId: string) => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleOpenReassignModal = () => {
    setReassignType('');
    setShowReassignModal(true);
  };

  const handleCloseReassignModal = () => {
    setShowReassignModal(false);
    setReassignType('');
  };

  const handleOpenReminderModal = () => {
    setEmailError('');
    setShowReminderModal(true);
  };

  const handleCloseReminderModal = () => {
    setShowReminderModal(false);
    setEmailModel({ to: '', cc: [], cc1: [], subject: '', body: '' });
    setEmailError('');
  };

  const handleEmailChange = (field: keyof EmailModel, value: any) => {
    setEmailModel((prev) => ({ ...prev, [field]: value }));
  };

  const sendReminderMail = async () => {
    // Validation
    if (!emailModel.to.trim()) {
      setEmailError('Please enter recipient email');
      return;
    }
    if (!emailModel.subject.trim()) {
      setEmailError('Please enter email subject');
      return;
    }
    if (!emailModel.body.trim()) {
      setEmailError('Please enter email body');
      return;
    }

    setSendingEmail(true);
    setEmailError('');

    try {
      const response = await setupService.sendRemindMail(emailModel);

      if (response.statusCode === 0) {
        alert('Mail successfully sent');
        handleCloseReminderModal();
      } else {
        setEmailError(response.message || 'Failed to send mail');
      }
    } catch (error: any) {
      console.error('Send mail error:', error);
      setEmailError(error.message || 'Failed to send mail');
    } finally {
      setSendingEmail(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading && !claimDetails) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: '#6F62C2' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#F5F7FA', minHeight: '100vh' }}>
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Purple Gradient Header */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #6F62C2 0%, #8B7ED6 100%)',
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
                  {investigationId}
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

          {/* Action Buttons - Commented out as in original */}
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleOpenReassignModal}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Re-assign
            </Button>
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={handleOpenReminderModal}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Send Reminder
            </Button>
          </Box> */}
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Accordion 1: Pre-Auth Details / Claim Details */}
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleAccordionChange('panel1')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(111, 98, 194, 0.1)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E9D5FF',
                borderRadius: 2,
                '&:hover': { bgcolor: '#DDD6FE' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DescriptionIcon sx={{ color: '#7C3AED' }} />
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
              boxShadow: '0 2px 8px rgba(111, 98, 194, 0.1)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E9D5FF',
                borderRadius: 2,
                '&:hover': { bgcolor: '#DDD6FE' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <HospitalIcon sx={{ color: '#7C3AED' }} />
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
              boxShadow: '0 2px 8px rgba(111, 98, 194, 0.1)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E9D5FF',
                borderRadius: 2,
                '&:hover': { bgcolor: '#DDD6FE' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <InfoIcon sx={{ color: '#7C3AED' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Case Info
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              <CaseInfoComponent />
            </AccordionDetails>
          </Accordion>

          {/* Accordion 4: Documents */}
          <Accordion
            expanded={expanded === 'panel4'}
            onChange={handleAccordionChange('panel4')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(111, 98, 194, 0.1)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E9D5FF',
                borderRadius: 2,
                '&:hover': { bgcolor: '#DDD6FE' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FolderIcon sx={{ color: '#7C3AED' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Documents
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              <CentralRegionalDocuments />
            </AccordionDetails>
          </Accordion>

          {/* Accordion 5: F.O Update */}
          <Accordion
            expanded={expanded === 'panel5'}
            onChange={handleAccordionChange('panel5')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(111, 98, 194, 0.1)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E9D5FF',
                borderRadius: 2,
                '&:hover': { bgcolor: '#DDD6FE' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UpdateIcon sx={{ color: '#7C3AED' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  F.O Update
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              {claimsType === 'cashless' ? (
                <CentralRegionalCaseUpdate />
              ) : (
                <ReimburseCaseUpdate buttonEnable={false} />
              )}
            </AccordionDetails>
          </Accordion>

          {/* Accordion 6: Logs */}
          <Accordion
            expanded={expanded === 'panel6'}
            onChange={handleAccordionChange('panel6')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(111, 98, 194, 0.1)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E9D5FF',
                borderRadius: 2,
                '&:hover': { bgcolor: '#DDD6FE' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <HistoryIcon sx={{ color: '#7C3AED' }} />
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

      {/* Reassign Modal */}
      <Dialog
        open={showReassignModal}
        onClose={handleCloseReassignModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #6F62C2 0%, #8B7ED6 100%)',
            color: 'white',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RefreshIcon />
            Re-assign Investigation
          </Box>
          <IconButton
            onClick={handleCloseReassignModal}
            size="small"
            sx={{
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup value={reassignType} onChange={(e) => setReassignType(e.target.value)}>
              <FormControlLabel
                value="agency"
                control={<Radio />}
                label="Accept & Assign to Agency for investigation"
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                value="internal"
                control={<Radio />}
                label="Accept & Assign to Internal Team for investigation"
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mt: 3 }}>
            {reassignType === 'agency' && (
              <Box>
                {claimsType === 'cashless' ? (
                  <AcceptAgencies accid={acceptAssignId} />
                ) : (
                  <AcceptInternalTeam claimType={claimsType} accid={acceptAssignId} />
                )}
              </Box>
            )}
            {reassignType === 'internal' && (
              <Box>
                <AcceptInternalTeam claimType={claimsType} accid={acceptAssignId} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, bgcolor: '#F9FAFB' }}>
          <Button onClick={handleCloseReassignModal} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Reminder Modal */}
      <Dialog
        open={showReminderModal}
        onClose={handleCloseReminderModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #6F62C2 0%, #8B7ED6 100%)',
            color: 'white',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon />
            Send Reminder Email
          </Box>
          <IconButton
            onClick={handleCloseReminderModal}
            size="small"
            sx={{
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {emailError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {emailError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="To"
            placeholder="recipient@example.com"
            value={emailModel.to}
            onChange={(e) => handleEmailChange('to', e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="CC"
            placeholder="cc@example.com (comma-separated)"
            value={emailModel.cc.join(',')}
            onChange={(e) => handleEmailChange('cc', e.target.value.split(',').map((s) => s.trim()).filter((s) => s))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="CC1"
            placeholder="cc1@example.com (comma-separated)"
            value={emailModel.cc1.join(',')}
            onChange={(e) => handleEmailChange('cc1', e.target.value.split(',').map((s) => s.trim()).filter((s) => s))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Subject"
            placeholder="Email subject"
            value={emailModel.subject}
            onChange={(e) => handleEmailChange('subject', e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Message"
            placeholder="Enter your email message here..."
            value={emailModel.body}
            onChange={(e) => handleEmailChange('body', e.target.value)}
            margin="normal"
            multiline
            rows={6}
            required
            inputProps={{ maxLength: 1000 }}
            helperText={`${emailModel.body.length} / 1000 characters`}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, bgcolor: '#F9FAFB' }}>
          <Button onClick={handleCloseReminderModal} color="inherit" disabled={sendingEmail}>
            Cancel
          </Button>
          <Button
            onClick={sendReminderMail}
            variant="contained"
            disabled={sendingEmail}
            startIcon={sendingEmail ? <CircularProgress size={16} /> : <EmailIcon />}
            sx={{
              background: 'linear-gradient(135deg, #6F62C2 0%, #8B7ED6 100%)',
            }}
          >
            {sendingEmail ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignToAgencyDetailsTabs;