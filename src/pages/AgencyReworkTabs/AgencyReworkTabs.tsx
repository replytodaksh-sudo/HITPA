// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import {
//     Box,
//     Container,
//     Paper,
//     Tabs,
//     Tab,
//     Typography,
//     Button,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     RadioGroup,
//     FormControlLabel,
//     Radio,
//     Chip,
//     Divider,
//     IconButton,
// } from '@mui/material';
// import {
//     Close as CloseIcon,
//     Download as DownloadIcon,
//     Quiz as QuizIcon,
// } from '@mui/icons-material';
// import PreAuth from '../../components/sharedComponents/components/PreAuth';
// import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
// import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
// import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
// import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
// import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
// import Logs from '../../components/sharedComponents/components/Logs';
// import claimsService from '../../services/claims.service';
// import QuestionService from '../../services/question.service';
// import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';

// // API URL - Update with your environment config
// const DOWNLOAD_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/download?investigationId=';

// interface AgencyReworkTabsProps {
//     // No props needed - gets data from URL params
// }

// const AgencyReworkTabs: React.FC<AgencyReworkTabsProps> = () => {
//     const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
//     const [searchParams] = useSearchParams();

//     // State
//     const [activeTab, setActiveTab] = useState(0);
//     const [investigationId, setInvestigationId] = useState('');
//     const [claimsType, setClaimsType] = useState('');
//     const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
//     const [claimNo, setClaimNo] = useState('');
//     const [sbigClaimNo, setSbigClaimNo] = useState('');
//     const [claimDetails, setClaimDetails] = useState<any>(null);

//     // Modal state
//     const [questionaryModalOpen, setQuestionaryModalOpen] = useState(false);
//     const [questionaryRadio, setQuestionaryRadio] = useState('');
//     const [downloading, setDownloading] = useState(false);

//     // Other state
//     const [buttonEnable] = useState(true);

//     useEffect(() => {
//         // Get query params
//         const type = searchParams.get('claimsType') || '';
//         const tpaClaimNo = searchParams.get('claimNo') || '';
//         const sbigNo = searchParams.get('sbigclaimno') || '';

//         setClaimsType(type);
//         setClaimNo(tpaClaimNo);
//         setSbigClaimNo(sbigNo);

//         // Set claims type label
//         const label = type === 'cashless' ? 'Cashless' : type === 'reim' ? 'Reimbursement' : '';
//         setClaimsTypeLabel(label);

//         // Get investigation ID
//         if (paramInvestigationId) {
//             const cleanedId = paramInvestigationId.split(' ')[0];
//             setInvestigationId(cleanedId);
//             fetchClaimDetails(cleanedId);
//         }
//     }, [paramInvestigationId, searchParams]);

//     const fetchClaimDetails = async (invId: string) => {
//         // setLoading(true);
//         try {
//             const response = await claimsService.claimDetails(invId);
//             if (response.statusCode === 0) {
//                 setClaimDetails(response.payload);
//                 sessionStorage.setItem('formEditable', response.payload.editable);
//                 sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
//             }
//         } catch (error) {
//             console.error('Error fetching claim details:', error);
//         }
//     };

//     const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//         setActiveTab(newValue);
//     };

//     const openQuestionaryModal = () => {
//         setQuestionaryRadio('');
//         setQuestionaryModalOpen(true);
//     };

//     const closeQuestionaryModal = () => {
//         setQuestionaryModalOpen(false);
//         setQuestionaryRadio('');
//     };

//     const handleQuestionaryRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setQuestionaryRadio(event.target.value);
//     };

//     const handleDownloadPDF = async () => {
//         if (!questionaryRadio) return;

//         try {
//             setDownloading(true);

//             // Trigger questionnaire download
//             await QuestionService.downloadQuestion(investigationId, questionaryRadio);

//             // Build download URL
//             const url = `${DOWNLOAD_URL}${investigationId}&questionType=${questionaryRadio}`;
//             console.log('Download URL:', url);

//             // Open PDF in new window
//             window.open(url, '_blank');

//             // Close modal
//             closeQuestionaryModal();
//         } catch (error) {
//             console.error('Error downloading questionnaire:', error);
//         } finally {
//             setDownloading(false);
//         }
//     };

//     return (
//         <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
//             <Paper elevation={3} sx={{ p: 3 }}>
//                 {/* Header with Investigation Details */}
//                 <Box sx={{ mb: 3 }}>
//                     <Box
//                         sx={{
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             mb: 2
//                         }}
//                     >
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                             <Typography variant="body1">
//                                 <strong>Investigation No:</strong> {investigationId}
//                             </Typography>
//                             <Chip
//                                 label={claimsTypeLabel}
//                                 color="warning"
//                                 size="small"
//                                 sx={{ fontWeight: 600 }}
//                             />
//                         </Box>
//                         <Typography variant="body1">
//                             <strong>Claim No:</strong> {sbigClaimNo}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>TPA Claim No:</strong> {claimNo}
//                         </Typography>
//                     </Box>

//                     {/* Questionnaire Button */}
//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<QuizIcon />}
//                             onClick={openQuestionaryModal}
//                         >
//                             Questionnaire
//                         </Button>
//                     </Box>
//                 </Box>

//                 <Divider sx={{ mb: 3 }} />

//                 {/* Tabs */}
//                 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                     <Tabs
//                         value={activeTab}
//                         onChange={handleTabChange}
//                         variant="scrollable"
//                         scrollButtons="auto"
//                         sx={{
//                             '& .MuiTab-root': {
//                                 minHeight: 64,
//                                 textTransform: 'none',
//                                 fontSize: '0.95rem',
//                                 fontWeight: 500,
//                             },
//                         }}
//                     >
//                         {claimsType === 'cashless' && (
//                             <Tab label="Pre-Auth Details" />
//                         )}
//                         {claimsType === 'reim' && (
//                             <Tab label="Claim Details" />
//                         )}
//                         <Tab label="Insured & Hospital Details" />
//                         <Tab label="Case Info" />
//                         <Tab label="Document" />
//                         <Tab label="Case Update" />
//                         <Tab label="Logs" />
//                     </Tabs>
//                 </Box>

//                 {/* Tab Content */}
//                 <Box sx={{ pt: 3 }}>
//                     {/* Tab 0: Pre-Auth Details (Cashless) or Claim Details (Reim) */}
//                     {activeTab === 0 && claimsType === 'cashless' && (
//                         <PreAuth
//                             claimDetails={claimDetails}
//                         //   investigationId={investigationId}
//                         //   claimsType={claimsType}
//                         />
//                     )}
//                     {activeTab === 0 && claimsType === 'reim' && (
//                         <ClaimDetailsReim
//                             claimDetails={claimDetails}
//                             //   investigationId={investigationId}
//                             claimsType={claimsType}
//                         //   isFormEditable={false}
//                         //   onNextPage={() => {}}
//                         />
//                     )}

//                     {/* Tab 1: Insured & Hospital Details */}
//                     {activeTab === 1 && (
//                         <HospitalInfo
//                             claimDetails={claimDetails}
//                             //   investigationId={investigationId}
//                             claimsType={claimsType}
//                         //   isFormEditable={false}
//                         //   onNextPage={() => {}}
//                         />
//                     )}

//                     {/* Tab 2: Case Info */}
//                     {activeTab === 2 && (
//                         <CaseInfoComponent
//                         //   investigationId={investigationId}
//                         />
//                     )}

//                     {/* Tab 3: Document */}
//                     {activeTab === 3 && (
//                         <CentralRegionalDocuments
//                         //   investigationId={investigationId}
//                         />
//                     )}

//                     {/* Tab 4: Case Update */}
//                     {activeTab === 4 && claimsType === 'cashless' && (
//                         // <CentralAssignedAgencyCaseUpdate />
//                         <CentralAssignedAgencyCaseUpdate />
//                     )}
//                     {activeTab === 4 && claimsType === 'reim' && (
//                         <ReimburseCaseUpdate
//                             //   investigationId={investigationId}
//                             buttonEnable={buttonEnable}
//                         />
//                     )}

//                     {/* Tab 5: Logs */}
//                     {activeTab === 5 && (
//                         <Logs
//                             //   investigationId={investigationId}
//                             claimsType={claimsType}
//                         />
//                     )}
//                 </Box>
//             </Paper>

//             {/* Questionnaire Modal */}
//             <Dialog
//                 open={questionaryModalOpen}
//                 onClose={closeQuestionaryModal}
//                 maxWidth="sm"
//                 fullWidth
//             >
//                 <DialogTitle>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <Typography variant="h6">Questionnaire</Typography>
//                         <IconButton onClick={closeQuestionaryModal} size="small">
//                             <CloseIcon />
//                         </IconButton>
//                     </Box>
//                 </DialogTitle>
//                 <DialogContent dividers>
//                     <RadioGroup
//                         value={questionaryRadio}
//                         onChange={handleQuestionaryRadioChange}
//                     >
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
//                 </DialogContent>
//                 <DialogActions>
//                     {questionaryRadio && (
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<DownloadIcon />}
//                             onClick={handleDownloadPDF}
//                             disabled={downloading}
//                         >
//                             {downloading ? 'Downloading...' : 'Download'}
//                         </Button>
//                     )}
//                     <Button onClick={closeQuestionaryModal} color="secondary">
//                         Cancel
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Container>
//     );
// };

// export default AgencyReworkTabs;








import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
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
    IconButton,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Close as CloseIcon,
    Download as DownloadIcon,
    Quiz as QuizIcon,
    Description as DescriptionIcon,
    LocalHospital as HospitalIcon,
    Info as InfoIcon,
    FolderOpen as FolderIcon,
    Update as UpdateIcon,
    History as HistoryIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import Logs from '../../components/sharedComponents/components/Logs';
import claimsService from '../../services/claims.service';
import QuestionService from '../../services/question.service';
import CaseUpdateForm from '../../components/sharedComponents/components/CashlessCaseUpdate';
import AgencyReassignCaseUpdateReim from '../../components/sharedComponents/components/AgencyReassignCaseUpdateReim';
import AgencyReworkCaseUpdate from '../../components/sharedComponents/components/AgencyReworkCaseUpdate';

// API URL - Update with your environment config
const DOWNLOAD_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/download?investigationId=';

const AgencyReworkTabs: React.FC = () => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [investigationId, setInvestigationId] = useState('');
    const [claimsType, setClaimsType] = useState('');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
    const [claimNo, setClaimNo] = useState('');
    const [sbigClaimNo, setSbigClaimNo] = useState('');
    const [claimDetails, setClaimDetails] = useState<any>(null);

    // Modal state
    const [questionaryModalOpen, setQuestionaryModalOpen] = useState(false);
    const [questionaryRadio, setQuestionaryRadio] = useState('');
    const [downloading, setDownloading] = useState(false);

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
            fetchClaimDetails(cleanedId);
        }
    }, [paramInvestigationId, searchParams]);

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

    const openQuestionaryModal = () => {
        setQuestionaryRadio('');
        setQuestionaryModalOpen(true);
    };

    const closeQuestionaryModal = () => {
        setQuestionaryModalOpen(false);
        setQuestionaryRadio('');
    };

    const handleQuestionaryRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionaryRadio(event.target.value);
    };

    const handleDownloadPDF = async () => {
        if (!questionaryRadio) return;

        try {
            setDownloading(true);

            // Trigger questionnaire download
            await QuestionService.downloadQuestion(investigationId, questionaryRadio);

            // Build download URL
            const url = `${DOWNLOAD_URL}${investigationId}&questionType=${questionaryRadio}`;
            console.log('Download URL:', url);

            // Open PDF in new window
            window.open(url, '_blank');

            // Close modal
            closeQuestionaryModal();
        } catch (error) {
            console.error('Error downloading questionnaire:', error);
        } finally {
            setDownloading(false);
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
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                                    Investigation No:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400, color: 'white' }}>
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
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                                    Claim No:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400, color: 'white' }}>
                                    {sbigClaimNo || '-'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                                    TPA Claim No:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400, color: 'white' }}>
                                    {claimNo || '-'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Questionnaire Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<QuizIcon />}
                            onClick={openQuestionaryModal}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                                },
                            }}
                        >
                            Questionnaire
                        </Button>
                    </Box>
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
                                <ClaimDetailsReim claimDetails={claimDetails} claimsType={claimsType} />
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
                            <HospitalInfo claimDetails={claimDetails} claimsType={claimsType} />
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

                    {/* Accordion 4: Document */}
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
                                <FolderIcon sx={{ color: '#0284C7' }} />
                                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                                    Document
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
                            <CentralRegionalDocuments />
                        </AccordionDetails>
                    </Accordion>

                    {/* Accordion 5: Case Update */}
                    <Accordion
                        expanded={expanded === 'panel5'}
                        onChange={handleAccordionChange('panel5')}
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
                                <UpdateIcon sx={{ color: '#0284C7' }} />
                                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                                    Case Update
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
                            {claimsType === 'cashless' ? (
                                <AgencyReworkCaseUpdate />
                            ) : (
                                <AgencyReassignCaseUpdateReim investigationId={investigationId} />
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

            {/* Questionnaire Modal */}
            <Dialog
                open={questionaryModalOpen}
                onClose={closeQuestionaryModal}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 },
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
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <QuizIcon sx={{ color: '#0284C7' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Questionnaire
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={closeQuestionaryModal}
                        size="small"
                        sx={{
                            color: '#64748B',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 3 }}>
                    <RadioGroup value={questionaryRadio} onChange={handleQuestionaryRadioChange}>
                        <FormControlLabel
                            value="ForInsured"
                            control={<Radio />}
                            label="For Insured"
                            sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                            value="ForTreatingDoctor"
                            control={<Radio />}
                            label="For Treating Doctor"
                        />
                    </RadioGroup>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, bgcolor: '#F9FAFB' }}>
                    <Button onClick={closeQuestionaryModal} color="inherit">
                        Cancel
                    </Button>
                    {questionaryRadio && (
                        <Button
                            variant="contained"
                            startIcon={downloading ? null : <DownloadIcon />}
                            onClick={handleDownloadPDF}
                            disabled={downloading}
                            sx={{
                                bgcolor: '#0284C7',
                                '&:hover': { bgcolor: '#0369A1' },
                            }}
                        >
                            {downloading ? 'Downloading...' : 'Download'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AgencyReworkTabs;