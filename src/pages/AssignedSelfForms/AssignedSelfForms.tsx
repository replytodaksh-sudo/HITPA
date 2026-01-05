// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Paper,
//     Typography,
//     Chip,
//     Tabs,
//     Tab,
//     Button,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     RadioGroup,
//     FormControlLabel,
//     Radio,
//     TextField,
//     IconButton,
// } from '@mui/material';
// import { useParams, useLocation } from 'react-router-dom';
// import CloseIcon from '@mui/icons-material/Close';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import InfoIcon from '@mui/icons-material/Info';
// import DescriptionIcon from '@mui/icons-material/Description';
// import UpdateIcon from '@mui/icons-material/Update';
// import HistoryIcon from '@mui/icons-material/History';


// // Services
// import { QuestionService } from '../../services/question.service';
// import PreAuth from '../../components/sharedComponents/components/PreAuth';
// import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
// import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
// import Logs from '../../components/sharedComponents/components/Logs';
// import setupService from '../../services/setup.service';
// import { claimsService } from '../../services/claims.service';
// import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
// import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
// import AcceptAgencies from '../../components/sharedComponents/components/acceptAgency';
// import AcceptInternalTeam from '../../components/sharedComponents/components/AcceptInternalTeam';
// import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
// import CaseUpdateForm from '../../components/sharedComponents/components/CashlessCaseUpdate';
// // import { setupService } from '../../services/setup.service';

// interface TabPanelProps {
//     children?: React.ReactNode;
//     index: number;
//     value: number;
// }

// function TabPanel(props: TabPanelProps) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`case-tabpanel-${index}`}
//             aria-labelledby={`case-tab-${index}`}
//             {...other}
//         >
//             {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//         </div>
//     );
// }

// const AssignedSelfForms: React.FC = () => {
//     const { investigationId } = useParams<{ investigationId: string }>();
//     const location = useLocation();
//     const [activeTab, setActiveTab] = useState(0);
//     const [claimDetails, setClaimDetails] = useState<any>(null);
//     const [investigationType, setInvestigationType] = useState('');
//     // Get role from sessionStorage
//     const roleName = sessionStorage.getItem('roleName') || '';

//     // Get query parameters
//     const searchParams = new URLSearchParams(location.search);
//     const claimsType = searchParams.get('claimsType') || 'cashless';
//     const claimNo = searchParams.get('claimNo') || '';
//     const sbiclaimNo = searchParams.get('sbigclaimno') || '';
//     const acceptAssignId = searchParams.get('acceptAssignId') || '';

//     // Store acceptAssignId in localStorage
//     useEffect(() => {
//         if (acceptAssignId) {
//             localStorage.setItem('acceptAssignId', acceptAssignId);
//         }
//         if (investigationId) {
//             fetchClaimDetails(investigationId);
//         }
//     }, [acceptAssignId, investigationId]);

//     // Modal states
//     const [questionaryModalOpen, setQuestionaryModalOpen] = useState(false);
//     const [reassignModalOpen, setReassignModalOpen] = useState(false);
//     const [reminderModalOpen, setReminderModalOpen] = useState(false);

//     // Questionary state
//     const [questionaryRadio, setQuestionaryRadio] = useState('');

//     // Reassign state
//     const [statusInsuredVisit, setStatusInsuredVisit] = useState(0);

//     // Email/Reminder states
//     const [emailTo, setEmailTo] = useState('');
//     const [emailCc, setEmailCc] = useState('');
//     const [emailCc1, setEmailCc1] = useState('');
//     const [emailSubject, setEmailSubject] = useState('');
//     const [emailBody, setEmailBody] = useState('');

//     const [showButton, setShowButton] = useState(true);
//     const [buttonEnable, setButtonEnable] = useState(true);

//     const cleanInvestigationId = investigationId?.split(' ')[0] || '';
//     const claimsTypeLabel =
//         claimsType === 'cashless'
//             ? 'Cashless'
//             : claimsType === 'reim'
//                 ? 'Reimbursement'
//                 : '';

//     const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//         setActiveTab(newValue);
//     };

//     const handleDownloadQuestionnaire = async () => {
//         if (!questionaryRadio) {
//             alert('Please select a questionnaire type');
//             return;
//         }

//         try {
//             await QuestionService.downloadQuestion(cleanInvestigationId, questionaryRadio);
//             const url = `/api/questions/download/${cleanInvestigationId}?questionType=${questionaryRadio}`;
//             window.open(url, '_blank');
//             setQuestionaryModalOpen(false);
//             setQuestionaryRadio('');
//         } catch (error) {
//             console.error('Error downloading questionnaire:', error);
//             alert('Failed to download questionnaire');
//         }
//     };

//     const handleSendReminder = async () => {
//         if (!emailTo || !emailSubject || !emailBody) {
//             alert('Please fill all required fields');
//             return;
//         }

//         try {
//             const emailModel = {
//                 to: emailTo,
//                 cc: emailCc ? [emailCc] : [],
//                 cc1: emailCc1 ? [emailCc1] : [],
//                 subject: emailSubject,
//                 body: emailBody,
//             };

//             const response: any = await setupService.sendRemindMail(emailModel);
//             if (response.statusCode === 0) {
//                 alert('Mail successfully sent');
//                 setReminderModalOpen(false);
//                 // Reset form
//                 setEmailTo('');
//                 setEmailCc('');
//                 setEmailCc1('');
//                 setEmailSubject('');
//                 setEmailBody('');
//             }
//         } catch (error) {
//             console.error('Error sending reminder:', error);
//             alert('Failed to send reminder');
//         }
//     };

//     const handleOpenReassign = () => {
//         setStatusInsuredVisit(0);
//         setReassignModalOpen(true);
//     };

//     const fetchClaimDetails = async (invId: string) => {
//         // setLoading(true);
//         try {
//             const response = await claimsService.claimDetails(invId);
//             if (response.statusCode === 0) {
//                 setClaimDetails(response.payload);
//                 setInvestigationType(response.payload.investigationType);
//                 sessionStorage.setItem('formEditable', response.payload.editable);
//                 sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
//             }
//         } catch (error) {
//             console.error('Error fetching claim details:', error);
//         } finally {
//             // setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ p: 3 }}>
//             <Paper elevation={3}>
//                 {/* Header Section */}
//                 <Box
//                     sx={{
//                         background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
//                         p: 2,
//                         borderTopLeftRadius: 4,
//                         borderTopRightRadius: 4,
//                     }}
//                 >
//                     <Box
//                         sx={{
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             flexWrap: 'wrap',
//                             gap: 2,
//                         }}
//                     >
//                         {/* Investigation No */}
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
//                                 Investigation No:
//                             </Typography>
//                             <Typography variant="body1" sx={{ color: 'white' }}>
//                                 {cleanInvestigationId}
//                             </Typography>
//                             <Chip
//                                 label={claimsTypeLabel}
//                                 size="small"
//                                 sx={{
//                                     backgroundColor: '#ffc107',
//                                     color: '#000',
//                                     fontWeight: 600,
//                                 }}
//                             />
//                         </Box>

//                         {/* Claim No */}
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
//                                 Claim No:
//                             </Typography>
//                             <Typography variant="body1" sx={{ color: 'white' }}>
//                                 {sbiclaimNo}
//                             </Typography>
//                         </Box>

//                         {/* TPA Claim No */}
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
//                                 TPA Claim No:
//                             </Typography>
//                             <Typography variant="body1" sx={{ color: 'white' }}>
//                                 {claimNo}
//                             </Typography>
//                         </Box>
//                     </Box>
//                 </Box>

//                 {/* Action Buttons */}
//                 {showButton && (
//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 2 }}>
//                         {(roleName === 'Central Manager' || roleName === 'Regional Manager') && (
//                             <>
//                                 <Button variant="contained" onClick={handleOpenReassign}>
//                                     Re-assign
//                                 </Button>
//                                 <Button variant="contained" onClick={() => setReminderModalOpen(true)}>
//                                     Send Reminder/Email
//                                 </Button>
//                             </>
//                         )}
//                         <Button variant="contained" onClick={() => setQuestionaryModalOpen(true)}>
//                             Questionnaire
//                         </Button>
//                     </Box>
//                 )}

//                 {/* Tabs Section */}
//                 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                     <Tabs
//                         value={activeTab}
//                         onChange={handleTabChange}
//                         variant="scrollable"
//                         scrollButtons="auto"
//                         sx={{
//                             '& .MuiTab-root': {
//                                 textTransform: 'none',
//                                 fontWeight: 600,
//                                 fontSize: '0.95rem',
//                             },
//                             '& .Mui-selected': {
//                                 color: '#667eea',
//                             },
//                             '& .MuiTabs-indicator': {
//                                 backgroundColor: '#667eea',
//                             },
//                         }}
//                     >
//                         {/* First tab: Pre-Auth (Cashless) or Claim Details (Reim) */}
//                         {claimsType === 'cashless' ? (
//                             <Tab icon={<AssignmentIcon />} iconPosition="start" label="Pre-Auth Details" />
//                         ) : (
//                             <Tab icon={<DescriptionIcon />} iconPosition="start" label="Claim Details" />
//                         )}

//                         <Tab icon={<LocalHospitalIcon />} iconPosition="start" label="Insured & Hospital Details" />
//                         <Tab icon={<InfoIcon />} iconPosition="start" label="Case Info" />
//                         <Tab icon={<DescriptionIcon />} iconPosition="start" label="Document" />
//                         <Tab icon={<UpdateIcon />} iconPosition="start" label="Case Update" />
//                         <Tab icon={<HistoryIcon />} iconPosition="start" label="Logs" />
//                     </Tabs>
//                 </Box>

//                 {/* Tab Panels */}
//                 {claimsType === 'cashless' ? (
//                     <TabPanel value={activeTab} index={0}>
//                         <PreAuth claimDetails={claimDetails} />
//                     </TabPanel>
//                 ) : (
//                     <TabPanel value={activeTab} index={0}>
//                         <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails} />
//                     </TabPanel>
//                 )}

//                 <TabPanel value={activeTab} index={1}>
//                     <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />
//                 </TabPanel>

//                 <TabPanel value={activeTab} index={2}>
//                     <CaseInfoComponent />
//                 </TabPanel>

//                 <TabPanel value={activeTab} index={3}>
//                     <CentralRegionalDocuments />
//                 </TabPanel>

//                 <TabPanel value={activeTab} index={4}>
//                     {claimsType === 'cashless' ? (
//                         <CaseUpdateForm />
//                     ) : (
//                         <ReimburseCaseUpdate buttonEnable={buttonEnable} />
//                     )}
//                 </TabPanel>

//                 <TabPanel value={activeTab} index={5}>
//                     <Logs claimsType={claimsType} />
//                 </TabPanel>
//             </Paper>

//             {/* Questionnaire Modal */}
//             <Dialog open={questionaryModalOpen} onClose={() => setQuestionaryModalOpen(false)}>
//                 <DialogTitle>
//                     Questionnaire
//                     <IconButton
//                         onClick={() => setQuestionaryModalOpen(false)}
//                         sx={{ position: 'absolute', right: 8, top: 8 }}
//                     >
//                         <CloseIcon />
//                     </IconButton>
//                 </DialogTitle>
//                 <DialogContent>
//                     <RadioGroup value={questionaryRadio} onChange={(e) => setQuestionaryRadio(e.target.value)}>
//                         <FormControlLabel
//                             value="ForInsured"
//                             control={<Radio />}
//                             label="For Insured"
//                         />
//                         <FormControlLabel
//                             value="ForTreatingDoctor"
//                             control={<Radio />}
//                             label="For Treating Doctor"
//                         />
//                     </RadioGroup>
//                     {questionaryRadio && (
//                         <Box sx={{ mt: 2 }}>
//                             <Button onClick={handleDownloadQuestionnaire} variant="outlined">
//                                 Download
//                             </Button>
//                         </Box>
//                     )}
//                 </DialogContent>
//             </Dialog>

//             {/* Reassign Modal */}
//             <Dialog
//                 open={reassignModalOpen}
//                 onClose={() => setReassignModalOpen(false)}
//                 maxWidth="md"
//                 fullWidth
//             >
//                 <DialogTitle>
//                     Reassign
//                     <IconButton
//                         onClick={() => setReassignModalOpen(false)}
//                         sx={{ position: 'absolute', right: 8, top: 8 }}
//                     >
//                         <CloseIcon />
//                     </IconButton>
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <RadioGroup
//                         value={statusInsuredVisit}
//                         onChange={(e) => setStatusInsuredVisit(Number(e.target.value))}
//                     >
//                         {roleName === 'Regional Manager' && (
//                             <>
//                                 <FormControlLabel
//                                     value={1}
//                                     control={<Radio />}
//                                     label="Accept & Assign to Agency for investigation"
//                                 />
//                                 <FormControlLabel
//                                     value={2}
//                                     control={<Radio />}
//                                     label="Accept & Assign to internal team for investigation"
//                                 />
//                             </>
//                         )}
//                         {roleName === 'Agency Spoc' && (
//                             <>
//                                 <FormControlLabel
//                                     value={1}
//                                     control={<Radio />}
//                                     label="Accept & Assign to Field Officer"
//                                 />
//                                 <FormControlLabel
//                                     value={2}
//                                     control={<Radio />}
//                                     label="Accept & Keep with Agency Central"
//                                 />
//                             </>
//                         )}
//                     </RadioGroup>

//                     <Box sx={{ mt: 3 }}>
//                         {statusInsuredVisit === 1 && (
//                             <>
//                                 {claimsType === 'cashless' ? (
//                                     <AcceptAgencies investigationType={investigationType} accid={acceptAssignId} />
//                                 ) : (
//                                     <AcceptInternalTeam claimType={claimsType} accid={acceptAssignId} />
//                                 )}
//                             </>
//                         )}
//                         {statusInsuredVisit === 2 && (
//                             <AcceptInternalTeam claimType={claimsType} accid={acceptAssignId} />
//                         )}
//                     </Box>
//                 </DialogContent>
//             </Dialog>

//             {/* Reminder/Email Modal */}
//             <Dialog
//                 open={reminderModalOpen}
//                 onClose={() => setReminderModalOpen(false)}
//                 maxWidth="md"
//                 fullWidth
//             >
//                 <DialogTitle>
//                     Reminder
//                     <IconButton
//                         onClick={() => setReminderModalOpen(false)}
//                         sx={{ position: 'absolute', right: 8, top: 8 }}
//                     >
//                         <CloseIcon />
//                     </IconButton>
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                         <TextField
//                             fullWidth
//                             label="To"
//                             value={emailTo}
//                             onChange={(e) => setEmailTo(e.target.value)}
//                         />
//                         <TextField
//                             fullWidth
//                             label="CC"
//                             value={emailCc}
//                             onChange={(e) => setEmailCc(e.target.value)}
//                         />
//                         <TextField
//                             fullWidth
//                             label="CC1"
//                             value={emailCc1}
//                             onChange={(e) => setEmailCc1(e.target.value)}
//                         />
//                         <TextField
//                             fullWidth
//                             label="Subject"
//                             value={emailSubject}
//                             onChange={(e) => setEmailSubject(e.target.value)}
//                         />
//                         <TextField
//                             fullWidth
//                             multiline
//                             rows={10}
//                             label="Message Body"
//                             value={emailBody}
//                             onChange={(e) => setEmailBody(e.target.value)}
//                             placeholder="Enter your message here..."
//                         />
//                     </Box>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleSendReminder} variant="contained">
//                         Send
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default AssignedSelfForms;


// File: src/pages/AssignedSelf/AssignedSelfForms.tsx

import React, { useState, useEffect } from 'react';
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
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    IconButton,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Close as CloseIcon,
    Assignment as AssignmentIcon,
    Description as DescriptionIcon,
    LocalHospital as LocalHospitalIcon,
    Info as InfoIcon,
    Update as UpdateIcon,
    History as HistoryIcon,
    Email as EmailIcon,
    SwapHoriz as ReassignIcon,
    Description as QuestionnaireIcon,
} from '@mui/icons-material';
import { useParams, useLocation } from 'react-router-dom';

// Services
import { QuestionService } from '../../services/question.service';
import setupService from '../../services/setup.service';
import { claimsService } from '../../services/claims.service';

// Components
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import CaseUpdateForm from '../../components/sharedComponents/components/CashlessCaseUpdate';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import Logs from '../../components/sharedComponents/components/Logs';
import AcceptAgencies from '../../components/sharedComponents/components/acceptAgency';
import AcceptInternalTeam from '../../components/sharedComponents/components/AcceptInternalTeam';

const AssignedSelfForms: React.FC = () => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const location = useLocation();
    
    // State
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [claimDetails, setClaimDetails] = useState<any>(null);
    const [investigationType, setInvestigationType] = useState('');
    
    // Modal states
    const [questionaryModalOpen, setQuestionaryModalOpen] = useState(false);
    const [reassignModalOpen, setReassignModalOpen] = useState(false);
    const [reminderModalOpen, setReminderModalOpen] = useState(false);
    
    // Form states
    const [questionaryRadio, setQuestionaryRadio] = useState('');
    const [statusInsuredVisit, setStatusInsuredVisit] = useState(0);
    const [emailTo, setEmailTo] = useState('');
    const [emailCc, setEmailCc] = useState('');
    const [emailCc1, setEmailCc1] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [showButton, setShowButton] = useState(true);
    const [buttonEnable, setButtonEnable] = useState(true);
    
    // Get role from sessionStorage
    const roleName = sessionStorage.getItem('roleName') || '';
    
    // Get query parameters
    const searchParams = new URLSearchParams(location.search);
    const claimsType = searchParams.get('claimsType') || 'cashless';
    const claimNo = searchParams.get('claimNo') || '';
    const sbiclaimNo = searchParams.get('sbigclaimno') || '';
    const acceptAssignId = searchParams.get('acceptAssignId') || '';
    
    const cleanInvestigationId = investigationId?.split(' ')[0] || '';
    const claimsTypeLabel = claimsType === 'cashless' ? 'Cashless' : claimsType === 'reim' ? 'Reimbursement' : '';
    
    // Effects
    useEffect(() => {
        if (acceptAssignId) {
            localStorage.setItem('acceptAssignId', acceptAssignId);
        }
        if (investigationId) {
            fetchClaimDetails(investigationId);
        }
    }, [acceptAssignId, investigationId]);
    
    // Fetch claim details
    const fetchClaimDetails = async (invId: string) => {
        try {
            const response = await claimsService.claimDetails(invId);
            if (response.statusCode === 0) {
                setClaimDetails(response.payload);
                setInvestigationType(response.payload.investigationType);
                sessionStorage.setItem('formEditable', response.payload.editable);
                sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
            }
        } catch (error) {
            console.error('Error fetching claim details:', error);
        }
    };
    
    // Accordion handler
    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    
    // Questionnaire handlers
    const handleDownloadQuestionnaire = async () => {
        if (!questionaryRadio) {
            alert('Please select a questionnaire type');
            return;
        }
        
        try {
            await QuestionService.downloadQuestion(cleanInvestigationId, questionaryRadio);
            const url = `/api/questions/download/${cleanInvestigationId}?questionType=${questionaryRadio}`;
            window.open(url, '_blank');
            setQuestionaryModalOpen(false);
            setQuestionaryRadio('');
        } catch (error) {
            console.error('Error downloading questionnaire:', error);
            alert('Failed to download questionnaire');
        }
    };
    
    // Email reminder handler
    const handleSendReminder = async () => {
        if (!emailTo || !emailSubject || !emailBody) {
            alert('Please fill all required fields');
            return;
        }
        
        try {
            const emailModel = {
                to: emailTo,
                cc: emailCc ? [emailCc] : [],
                cc1: emailCc1 ? [emailCc1] : [],
                subject: emailSubject,
                body: emailBody,
            };
            
            const response: any = await setupService.sendRemindMail(emailModel);
            if (response.statusCode === 0) {
                alert('Mail successfully sent');
                setReminderModalOpen(false);
                // Reset form
                setEmailTo('');
                setEmailCc('');
                setEmailCc1('');
                setEmailSubject('');
                setEmailBody('');
            }
        } catch (error) {
            console.error('Error sending reminder:', error);
            alert('Failed to send reminder');
        }
    };
    
    // Reassign handler
    const handleOpenReassign = () => {
        setStatusInsuredVisit(0);
        setReassignModalOpen(true);
    };
    console.log("1234r", showButton, roleName)
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
                                    <AssignmentIcon sx={{ fontSize: 20 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#f9f9f9' }}>
                                        Investigation No:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 400, color: '#f9f9f9' }}>
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
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#f9f9f9' }}>
                                        Claim No:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 400, color: '#f9f9f9' }}>
                                        {sbiclaimNo || '-'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#f9f9f9' }}>
                                        TPA Claim No:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 400, color: '#f9f9f9' }}>
                                        {claimNo || '-'}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    
                    {/* Content Area */}
                    <Box sx={{ p: 3, bgcolor: '#F5F7FA' }}>
                        {/* Action Buttons */}
                        {showButton && (
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                                {(roleName == 'Central Manager' || roleName == 'Regional Manager') && (
                                    <>
                                        <Button
                                            variant="contained"
                                            startIcon={<ReassignIcon />}
                                            onClick={handleOpenReassign}
                                            sx={{
                                                bgcolor: '#3B82F6',
                                                '&:hover': { bgcolor: '#2563EB' },
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Re-assign
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<EmailIcon />}
                                            onClick={() => setReminderModalOpen(true)}
                                            sx={{
                                                bgcolor: '#8B5CF6',
                                                '&:hover': { bgcolor: '#7C3AED' },
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Send Reminder
                                        </Button>
                                    </>
                                )}
                                <Button
                                    variant="contained"
                                    startIcon={<QuestionnaireIcon />}
                                    onClick={() => setQuestionaryModalOpen(true)}
                                    sx={{
                                        bgcolor: '#10B981',
                                        '&:hover': { bgcolor: '#059669' },
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Questionnaire
                                </Button>
                            </Box>
                        )}
                        
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
                                    '&.Mui-expanded': { margin: 0 },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: '#1E293B' }} />}
                                    sx={{
                                        minHeight: 56,
                                        '&.Mui-expanded': { minHeight: 56 },
                                        '& .MuiAccordionSummary-content': {
                                            margin: '12px 0',
                                            '&.Mui-expanded': { margin: '12px 0' },
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        {claimsType === 'cashless' ? (
                                            <AssignmentIcon sx={{ color: '#3B82F6' }} />
                                        ) : (
                                            <DescriptionIcon sx={{ color: '#3B82F6' }} />
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
                                        <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails} />
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
                                    '&.Mui-expanded': { margin: 0 },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: '#1E293B' }} />}
                                    sx={{
                                        minHeight: 56,
                                        '&.Mui-expanded': { minHeight: 56 },
                                        '& .MuiAccordionSummary-content': {
                                            margin: '12px 0',
                                            '&.Mui-expanded': { margin: '12px 0' },
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <LocalHospitalIcon sx={{ color: '#3B82F6' }} />
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
                                    '&.Mui-expanded': { margin: 0 },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: '#1E293B' }} />}
                                    sx={{
                                        minHeight: 56,
                                        '&.Mui-expanded': { minHeight: 56 },
                                        '& .MuiAccordionSummary-content': {
                                            margin: '12px 0',
                                            '&.Mui-expanded': { margin: '12px 0' },
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <InfoIcon sx={{ color: '#3B82F6' }} />
                                        <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                            Case Info
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    <CaseInfoComponent />
                                </AccordionDetails>
                            </Accordion>
                            
                            {/* Document Accordion */}
                            <Accordion
                                expanded={expanded === 'panel4'}
                                onChange={handleAccordionChange('panel4')}
                                sx={{
                                    bgcolor: '#E0F2FE',
                                    borderRadius: '8px !important',
                                    boxShadow: 'none',
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': { margin: 0 },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: '#1E293B' }} />}
                                    sx={{
                                        minHeight: 56,
                                        '&.Mui-expanded': { minHeight: 56 },
                                        '& .MuiAccordionSummary-content': {
                                            margin: '12px 0',
                                            '&.Mui-expanded': { margin: '12px 0' },
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <DescriptionIcon sx={{ color: '#3B82F6' }} />
                                        <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                            Document
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    <CentralRegionalDocuments />
                                </AccordionDetails>
                            </Accordion>
                            
                            {/* Case Update Accordion */}
                            <Accordion
                                expanded={expanded === 'panel5'}
                                onChange={handleAccordionChange('panel5')}
                                sx={{
                                    bgcolor: '#E0F2FE',
                                    borderRadius: '8px !important',
                                    boxShadow: 'none',
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': { margin: 0 },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: '#1E293B' }} />}
                                    sx={{
                                        minHeight: 56,
                                        '&.Mui-expanded': { minHeight: 56 },
                                        '& .MuiAccordionSummary-content': {
                                            margin: '12px 0',
                                            '&.Mui-expanded': { margin: '12px 0' },
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <UpdateIcon sx={{ color: '#3B82F6' }} />
                                        <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                            Case Update
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    {claimsType === 'cashless' ? (
                                        <CaseUpdateForm />
                                    ) : (
                                        <ReimburseCaseUpdate buttonEnable={buttonEnable} />
                                    )}
                                </AccordionDetails>
                            </Accordion>
                            
                            {/* Logs Accordion */}
                            <Accordion
                                expanded={expanded === 'panel6'}
                                onChange={handleAccordionChange('panel6')}
                                sx={{
                                    bgcolor: '#E0F2FE',
                                    borderRadius: '8px !important',
                                    boxShadow: 'none',
                                    '&:before': { display: 'none' },
                                    '&.Mui-expanded': { margin: 0 },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: '#1E293B' }} />}
                                    sx={{
                                        minHeight: 56,
                                        '&.Mui-expanded': { minHeight: 56 },
                                        '& .MuiAccordionSummary-content': {
                                            margin: '12px 0',
                                            '&.Mui-expanded': { margin: '12px 0' },
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <HistoryIcon sx={{ color: '#3B82F6' }} />
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
            
            {/* Questionnaire Modal */}
            <Dialog
                open={questionaryModalOpen}
                onClose={() => setQuestionaryModalOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: '#E0F2FE',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Questionnaire
                    </Typography>
                    <IconButton onClick={() => setQuestionaryModalOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    <RadioGroup value={questionaryRadio} onChange={(e) => setQuestionaryRadio(e.target.value)}>
                        <FormControlLabel value="ForInsured" control={<Radio />} label="For Insured" />
                        <FormControlLabel value="ForTreatingDoctor" control={<Radio />} label="For Treating Doctor" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    {questionaryRadio && (
                        <Button onClick={handleDownloadQuestionnaire} variant="contained">
                            Download
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
            
            {/* Reassign Modal */}
            <Dialog
                open={reassignModalOpen}
                onClose={() => setReassignModalOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: '#E0F2FE',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Reassign
                    </Typography>
                    <IconButton onClick={() => setReassignModalOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    <RadioGroup
                        value={statusInsuredVisit}
                        onChange={(e) => setStatusInsuredVisit(Number(e.target.value))}
                    >
                        {roleName === 'Regional Manager' && (
                            <>
                                <FormControlLabel
                                    value={1}
                                    control={<Radio />}
                                    label="Accept & Assign to Agency for investigation"
                                />
                                <FormControlLabel
                                    value={2}
                                    control={<Radio />}
                                    label="Accept & Assign to internal team for investigation"
                                />
                            </>
                        )}
                        {roleName === 'Agency Spoc' && (
                            <>
                                <FormControlLabel
                                    value={1}
                                    control={<Radio />}
                                    label="Accept & Assign to Field Officer"
                                />
                                <FormControlLabel
                                    value={2}
                                    control={<Radio />}
                                    label="Accept & Keep with Agency Central"
                                />
                            </>
                        )}
                    </RadioGroup>
                    
                    <Box sx={{ mt: 3 }}>
                        {statusInsuredVisit === 1 && (
                            <>
                                {claimsType === 'cashless' ? (
                                    <AcceptAgencies investigationType={investigationType} accid={acceptAssignId} />
                                ) : (
                                    <AcceptInternalTeam claimType={claimsType} accid={acceptAssignId} />
                                )}
                            </>
                        )}
                        {statusInsuredVisit === 2 && (
                            <AcceptInternalTeam claimType={claimsType} accid={acceptAssignId} />
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
            
            {/* Reminder/Email Modal */}
            <Dialog
                open={reminderModalOpen}
                onClose={() => setReminderModalOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: '#E0F2FE',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Send Reminder
                    </Typography>
                    <IconButton onClick={() => setReminderModalOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="To"
                            value={emailTo}
                            onChange={(e) => setEmailTo(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="CC"
                            value={emailCc}
                            onChange={(e) => setEmailCc(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="CC1"
                            value={emailCc1}
                            onChange={(e) => setEmailCc1(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Subject"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={10}
                            label="Message Body"
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            placeholder="Enter your message here..."
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleSendReminder} variant="contained">
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AssignedSelfForms;