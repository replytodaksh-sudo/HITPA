// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
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
// import { caseUpdateService } from '../../services/caseupdate.service';
// import { QuestionService } from '../../services/question.service';
// import PreAuth from '../../components/sharedComponents/components/PreAuth';
// import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
// import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
// import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
// import Logs from '../../components/sharedComponents/components/Logs';
// import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
// import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
// import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';


// // API URL - Update with your environment config
// // const DOWNLOAD_URL = process.env.REACT_APP_DOWNLOAD_URL || 'https://api.example.com/download?investigationId=';
// const DOWNLOAD_URL = 'https://api.example.com/download?investigationId=';

// interface RegionalReassignFormProps {
//     // No props needed - gets data from URL params
// }

// interface PreviousData {
//     activeCaseID: string;
//     reworkCaseComments: string;
//     // ... other fields
// }

// const RegionalReassignForm: React.FC<RegionalReassignFormProps> = () => {
//     const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();

//     // State
//     const [activeTab, setActiveTab] = useState(0);
//     const [investigationId, setInvestigationId] = useState('');
//     const [claimsType, setClaimsType] = useState('');
//     const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
//     const [claimNo, setClaimNo] = useState('');
//     const [sbigClaimNo, setSbigClaimNo] = useState('');
//     const [previousData, setPreviousData] = useState<PreviousData | null>(null);
//     const [loading, setLoading] = useState(true);

//     // Modal state
//     const [questionaryModalOpen, setQuestionaryModalOpen] = useState(false);
//     const [questionaryRadio, setQuestionaryRadio] = useState('');
//     const [downloading, setDownloading] = useState(false);

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
//             fetchPreviousData(cleanedId);
//         }
//     }, [paramInvestigationId, searchParams]);

//     const fetchPreviousData = async (invId: string) => {
//         try {
//             setLoading(true);
//             const response = await caseUpdateService.caseUpdatePreviousData(invId);

//             if (response.statusCode === 0) {
//                 setPreviousData(response.payload);
//                 localStorage.setItem('activeCaseID', response.payload.activeCaseID);
//             } else {
//                 setPreviousData(response.payload);
//             }
//         } catch (error) {
//             console.error('Error fetching previous data:', error);
//         } finally {
//             setLoading(false);
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
//             await QuestionService.downloadQuestion(investigationId, questionaryRadio);

//             const url = `${DOWNLOAD_URL}${investigationId}&questionType=${questionaryRadio}`;
//             console.log('Download URL:', url);

//             window.open(url, '_blank');
//             closeQuestionaryModal();
//         } catch (error) {
//             console.error('Error downloading questionnaire:', error);
//         } finally {
//             setDownloading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//                 <Typography>Loading case details...</Typography>
//             </Box>
//         );
//     }

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

//                     {/* Action Buttons */}
//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
//                         <Tab label="FO Update" />
//                         <Tab label="Logs" />
//                     </Tabs>
//                 </Box>

//                 {/* Tab Content */}
//                 <Box sx={{ pt: 3 }}>
//                     {/* Tab 0: Pre-Auth Details (Cashless) or Claim Details (Reim) */}
//                     {activeTab === 0 && claimsType === 'cashless' && (
//                         <PreAuth
//                             //   investigationId={investigationId}
//                             claimDetails={previousData}
//                         //   claimsType={claimsType}
//                         />
//                     )}
//                     {activeTab === 0 && claimsType === 'reim' && (
//                         <ClaimDetailsReim
//                             claimDetails={previousData}
//                             claimsType={claimsType}
//                         //   investigationId={investigationId}
//                         //   isFormEditable={false}
//                         //   onNextPage={() => {}}
//                         />
//                     )}

//                     {/* Tab 1: Insured & Hospital Details */}
//                     {activeTab === 1 && (
//                         <HospitalInfo
//                             claimDetails={previousData}
//                             claimsType={claimsType}
//                         //   investigationId={investigationId}
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
//                         // investigationId={investigationId}
//                         />
//                     )}

//                     {/* Tab 4: FO Update */}
//                     {activeTab === 4 && claimsType === 'cashless' && (
//                         <Box>
//                             {previousData?.reworkCaseComments && (
//                                 <Box sx={{ mb: 2 }}>
//                                     <Typography
//                                         component="span"
//                                         sx={{ color: '#776BC5', fontWeight: 700 }}
//                                     >
//                                         Reassign case:
//                                     </Typography>
//                                     <Typography
//                                         component="span"
//                                         sx={{ fontWeight: 700, ml: 1 }}
//                                     >
//                                         {previousData.reworkCaseComments}
//                                     </Typography>
//                                 </Box>
//                             )}
//                             <CentralAssignedAgencyCaseUpdate />
//                             {/* <Preview
//                                 investigationId={investigationId}
//                                 buttonVisible={true}
//                                 previewRefresh={false}
//                             /> */}
//                         </Box>
//                     )}
//                     {activeTab === 4 && claimsType === 'reim' && (
//                         <ReimburseCaseUpdate
//                             // investigationId={investigationId}
//                             buttonEnable={true}
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

// export default RegionalReassignForm;



import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Container,
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
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
} from '@mui/material';
import {
    Description,
    LocalHospital,
    Info,
    History,
    Assignment,
    ExpandMore as ExpandMoreIcon,
    UploadFile,
    Update,
    Download as DownloadIcon,
    Quiz as QuizIcon,
} from '@mui/icons-material';

// Import services
import { caseUpdateService } from '../../services/caseupdate.service';
import { QuestionService } from '../../services/question.service';

// Import child components
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import Logs from '../../components/sharedComponents/components/Logs';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';

// API URL - Update with your environment config
const DOWNLOAD_URL = 'https://api.example.com/download?investigationId=';

interface PreviousData {
    activeCaseID: string;
    reworkCaseComments: string;
    // ... other fields
}

/**
 * RegionalReassignForm Component
 * Displays accordion sections for regional reassign cases
 */
const RegionalReassignForm: React.FC = () => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [investigationId, setInvestigationId] = useState('');
    const [claimsType, setClaimsType] = useState('');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
    const [claimNo, setClaimNo] = useState('');
    const [sbigClaimNo, setSbigClaimNo] = useState('');
    const [previousData, setPreviousData] = useState<PreviousData | null>(null);
    const [loading, setLoading] = useState(true);

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
            fetchPreviousData(cleanedId);
        }
    }, [paramInvestigationId, searchParams]);

    const fetchPreviousData = async (invId: string) => {
        try {
            setLoading(true);
            const response = await caseUpdateService.caseUpdatePreviousData(invId);

            if (response.statusCode === 0) {
                setPreviousData(response.payload);
                localStorage.setItem('activeCaseID', response.payload.activeCaseID);
            } else {
                setPreviousData(response.payload);
            }
        } catch (error) {
            console.error('Error fetching previous data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccordionChange = (panel: string) => (
        event: React.SyntheticEvent,
        isExpanded: boolean
    ) => {
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
            await QuestionService.downloadQuestion(investigationId, questionaryRadio);

            const url = `${DOWNLOAD_URL}${investigationId}&questionType=${questionaryRadio}`;
            console.log('Download URL:', url);

            window.open(url, '_blank');
            closeQuestionaryModal();
        } catch (error) {
            console.error('Error downloading questionnaire:', error);
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading case details...</Typography>
            </Box>
        );
    }

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
                            <Grid size={{xs:12, md:4}}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Assignment sx={{ fontSize: 20 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#f9f9f9' }}>
                                        Investigation No:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 400, color: '#f9f9f9' }}>
                                        {investigationId}
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
                            <Grid size={{xs:12, md:4}}>
                                <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#f9f9f9' }}>
                                        Claim No:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 400, color: '#f9f9f9' }}>
                                        {sbigClaimNo || '-'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{xs:12, md:4}}>
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
                        {/* Questionnaire Button */}
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<QuizIcon />}
                                onClick={openQuestionaryModal}
                                sx={{
                                    bgcolor: '#4A7FC1',
                                    color: 'white',
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: 2,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    height: '40px',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(74, 127, 193, 0.3)',
                                    '&:hover': {
                                        bgcolor: '#2E5A96',
                                        boxShadow: '0 6px 16px rgba(74, 127, 193, 0.4)',
                                    },
                                }}
                            >
                                Questionnaire
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
                                        <Description sx={{ color: '#3B82F6' }} />
                                        <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                            {claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details'}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    {claimsType === 'cashless' ? (
                                        <PreAuth claimDetails={previousData} />
                                    ) : (
                                        <ClaimDetailsReim
                                            claimDetails={previousData}
                                            claimsType={claimsType}
                                        />
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
                                    <HospitalInfo
                                        claimDetails={previousData}
                                        claimsType={claimsType}
                                    />
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

                            {/* Documents Accordion */}
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
                                        <UploadFile sx={{ color: '#3B82F6' }} />
                                        <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                            Documents
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    <CentralRegionalDocuments />
                                </AccordionDetails>
                            </Accordion>

                            {/* FO Update Accordion */}
                            <Accordion
                                expanded={expanded === 'panel5'}
                                onChange={handleAccordionChange('panel5')}
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
                                        <Update sx={{ color: '#3B82F6' }} />
                                        <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                            FO Update
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    {claimsType === 'cashless' ? (
                                        <Box>
                                            {previousData?.reworkCaseComments && (
                                                <Box
                                                    sx={{
                                                        mb: 2,
                                                        p: 2,
                                                        bgcolor: '#DBEAFE',
                                                        borderRadius: 1,
                                                        borderLeft: '4px solid #3B82F6',
                                                    }}
                                                >
                                                    <Typography
                                                        component="span"
                                                        sx={{ color: '#1E40AF', fontWeight: 700 }}
                                                    >
                                                        Reassign case:
                                                    </Typography>
                                                    <Typography
                                                        component="span"
                                                        sx={{ fontWeight: 600, ml: 1, color: '#1E3A8A' }}
                                                    >
                                                        {previousData.reworkCaseComments}
                                                    </Typography>
                                                </Box>
                                            )}
                                            <CentralAssignedAgencyCaseUpdate />
                                        </Box>
                                    ) : (
                                        <ReimburseCaseUpdate buttonEnable={true} />
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

            {/* Questionnaire Modal */}
            <Dialog
                open={questionaryModalOpen}
                onClose={closeQuestionaryModal}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: '#E0F2FE',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <QuizIcon sx={{ color: '#3B82F6' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B' }}>
                            Questionnaire
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <RadioGroup
                        value={questionaryRadio}
                        onChange={handleQuestionaryRadioChange}
                    >
                        <FormControlLabel
                            value="ForInsured"
                            control={<Radio sx={{ color: '#3B82F6', '&.Mui-checked': { color: '#3B82F6' } }} />}
                            label="For Insured"
                            sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                            value="ForTreatingDoctor"
                            control={<Radio sx={{ color: '#3B82F6', '&.Mui-checked': { color: '#3B82F6' } }} />}
                            label="For Treating Doctor"
                        />
                    </RadioGroup>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                        onClick={closeQuestionaryModal}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadPDF}
                        disabled={!questionaryRadio || downloading}
                        sx={{
                            bgcolor: '#10B981',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: '#059669',
                            },
                            '&:disabled': {
                                bgcolor: '#D1D5DB',
                            },
                        }}
                    >
                        {downloading ? 'Downloading...' : 'Download'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RegionalReassignForm;