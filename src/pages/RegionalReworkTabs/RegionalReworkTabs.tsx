import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Container,
    Typography,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
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

// Import child components
import Logs from '../../components/sharedComponents/components/Logs';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';
import RegionalReworkCaseUpdate from '../../components/sharedComponents/components/RegionalReworkCaseUpdate';
import claimsService from '../../services/claims.service';
import caseUpdateService from '../../services/caseupdate.service';
import QuestionService from '../../services/question.service';

// ===========================
// INTERFACES
// ===========================
interface RouteParams extends Record<string, string | undefined> {
    investigationId: string;
}

// ===========================
// API SERVICES
// ===========================
// const caseUpdateService = {
//     caseUpdatePreviousData: async (investigationId: string) => {
//         const response = await fetch(`/api/case-update/previous/${investigationId}`);
//         if (!response.ok) throw new Error('Failed to fetch case data');
//         return response.json();
//     }
// };

// const questionaryService = {
//     downloadQuestion: async (investigationId: string, questionType: string) => {
//         const response = await fetch(`/api/questionary/download`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ investigationId, questionType })
//         });
//         if (!response.ok) throw new Error('Failed to prepare download');
//         return response.json();
//     }
// };

const apiUrls = {
    downloadUrl: '/api/questionary/download?investigationId='
};

// ===========================
// MAIN COMPONENT
// ===========================
const RegionalReworkTabs: React.FC = () => {
    const { investigationId } = useParams<RouteParams>();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // ===========================
    // STATE
    // ===========================
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [claimsType, setClaimsType] = useState('');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
    const [claimNo, setClaimNo] = useState('');
    const [sbiClaimNo, setSbiClaimNo] = useState('');
    const [previuosData, setPreviuosData] = useState<any>('');
    const [claimDetails, setClaimDetails] = useState<any>('');
    const [buttonEnable] = useState(true);

    // Questionnaire Modal
    const [questionaryModalOpen, setQuestionaryModalOpen] = useState(false);
    const [questionaryRadio, setQuestionaryRadio] = useState('');

    // ===========================
    // LOAD DATA ON MOUNT
    // ===========================
    useEffect(() => {
        // Get query parameters
        const type = searchParams.get('claimsType') || '';
        const tpaClaimNo = searchParams.get('claimNo') || '';
        const sbigClaimNo = searchParams.get('sbigclaimno') || '';

        setClaimsType(type);
        setClaimNo(tpaClaimNo);
        setSbiClaimNo(sbigClaimNo);

        // Set label
        const label =
            type === 'cashless' ? 'Cashless' :
                type === 'reim' ? 'Reimbursement' : '';
        setClaimsTypeLabel(label);

        // Load case data
        if (investigationId) {
            getSavedFormData();
            fetchClaimData();
        }
    }, [investigationId]);

    // ===========================
    // FETCH CASE DATA
    // ===========================
    const getSavedFormData = async () => {
        try {
            const data = await caseUpdateService.caseUpdatePreviousData(investigationId!);
            // const data = await claimsService.claimDetails(investigationId!);
            if (data.statusCode === 0) {
                setPreviuosData(data.payload);
                if (data.payload.activeCaseID) {
                    localStorage.setItem('activeCaseID', data.payload.activeCaseID);
                }
            } else {
                setPreviuosData(data.payload);
            }
        } catch (error) {
            console.error('Error fetching case data:', error);
        }
    };
    const fetchClaimData = async () => {
        try {
            const data = await claimsService.claimDetails(investigationId!);
            if (data.statusCode === 0) {
                setClaimDetails(data.payload);
                if (data.payload.activeCaseID) {
                    localStorage.setItem('activeCaseID', data.payload.activeCaseID);
                }
            } else {
                setClaimDetails(data.payload);
            }
        } catch (error) {
            console.error('Error fetching case data:', error);
        }
    };
    console.log('Previous Data:', previuosData);
    // ===========================
    // ACCORDION CHANGE HANDLER
    // ===========================
    const handleAccordionChange = (panel: string) => (
        event: React.SyntheticEvent,
        isExpanded: boolean
    ) => {
        setExpanded(isExpanded ? panel : false);
    };

    // ===========================
    // QUESTIONNAIRE MODAL HANDLERS
    // ===========================
    const openQuestionaryModal = () => {
        setQuestionaryRadio('');
        setQuestionaryModalOpen(true);
    };

    const closeQuestionaryModal = () => {
        setQuestionaryModalOpen(false);
        setQuestionaryRadio('');
    };

    const handleDownloadPDF = async () => {
        if (!questionaryRadio) {
            alert('Please select a questionnaire type');
            return;
        }

        try {
            await QuestionService.downloadQuestion(investigationId!, questionaryRadio);
            const url = `${apiUrls.downloadUrl}${investigationId}&questionType=${questionaryRadio}`;
            window.open(url, '_blank');
            closeQuestionaryModal();
        } catch (error) {
            console.error('Error downloading questionnaire:', error);
            alert('Failed to download questionnaire');
        }
    };

    // ===========================
    // RENDER
    // ===========================
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
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#f9f9f9' }}>
                                        Claim No:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 400, color: '#f9f9f9' }}>
                                        {sbiClaimNo || '-'}
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
                                            {previuosData.reworkCaseComments && (
                                                <Box
                                                    sx={{
                                                        mb: 2,
                                                        p: 2,
                                                        bgcolor: '#FEF3C7',
                                                        borderRadius: 1,
                                                        borderLeft: '4px solid #F59E0B',
                                                    }}
                                                >
                                                    <Typography
                                                        component="span"
                                                        sx={{ color: '#92400E', fontWeight: 700 }}
                                                    >
                                                        Rework case:
                                                    </Typography>
                                                    <Typography
                                                        component="span"
                                                        sx={{ fontWeight: 600, ml: 1, color: '#78350F' }}
                                                    >
                                                        {previuosData.reworkCaseComments}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {previuosData.noDataStatus === 'NonEditable' && (
                                                <CentralAssignedAgencyCaseUpdate buttonVisible={true}/>
                                            )}

                                            {previuosData.noDataStatus === 'Editable' && (
                                                <RegionalReworkCaseUpdate />
                                            )}
                                        </Box>
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
                        onChange={(e) => setQuestionaryRadio(e.target.value)}
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
                        disabled={!questionaryRadio}
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
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RegionalReworkTabs;