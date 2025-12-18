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
    Quiz as QuizIcon,
} from '@mui/icons-material';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralAgencyCaseUpdateDocuments from '../../components/sharedComponents/components/CentralAgencyCaseUpdateDocuments';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import Logs from '../../components/sharedComponents/components/Logs';
import claimsService from '../../services/claims.service';
import QuestionService from '../../services/question.service';
import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';

// API URL - Update with your environment config
const DOWNLOAD_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/download?investigationId=';

interface AgencyReworkTabsProps {
    // No props needed - gets data from URL params
}

const AgencyReworkTabs: React.FC<AgencyReworkTabsProps> = () => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [activeTab, setActiveTab] = useState(0);
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

    // Other state
    const [buttonEnable] = useState(true);

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
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
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

                    {/* Questionnaire Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<QuizIcon />}
                            onClick={openQuestionaryModal}
                        >
                            Questionnaire
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
                        {claimsType === 'cashless' && (
                            <Tab label="Pre-Auth Details" />
                        )}
                        {claimsType === 'reim' && (
                            <Tab label="Claim Details" />
                        )}
                        <Tab label="Insured & Hospital Details" />
                        <Tab label="Case Info" />
                        <Tab label="Document" />
                        <Tab label="Case Update" />
                        <Tab label="Logs" />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={{ pt: 3 }}>
                    {/* Tab 0: Pre-Auth Details (Cashless) or Claim Details (Reim) */}
                    {activeTab === 0 && claimsType === 'cashless' && (
                        <PreAuth
                            claimDetails={claimDetails}
                        //   investigationId={investigationId}
                        //   claimsType={claimsType}
                        />
                    )}
                    {activeTab === 0 && claimsType === 'reim' && (
                        <ClaimDetailsReim
                            claimDetails={claimDetails}
                            //   investigationId={investigationId}
                            claimsType={claimsType}
                        //   isFormEditable={false}
                        //   onNextPage={() => {}}
                        />
                    )}

                    {/* Tab 1: Insured & Hospital Details */}
                    {activeTab === 1 && (
                        <HospitalInfo
                            claimDetails={claimDetails}
                            //   investigationId={investigationId}
                            claimsType={claimsType}
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

                    {/* Tab 3: Document */}
                    {activeTab === 3 && (
                        <CentralAgencyCaseUpdateDocuments
                        //   investigationId={investigationId}
                        />
                    )}

                    {/* Tab 4: Case Update */}
                    {activeTab === 4 && claimsType === 'cashless' && (
                        // <CentralAssignedAgencyCaseUpdate />
                        <CentralAssignedAgencyCaseUpdate />
                    )}
                    {activeTab === 4 && claimsType === 'reim' && (
                        <ReimburseCaseUpdate
                            //   investigationId={investigationId}
                            buttonEnable={buttonEnable}
                        />
                    )}

                    {/* Tab 5: Logs */}
                    {activeTab === 5 && (
                        <Logs
                            //   investigationId={investigationId}
                            claimsType={claimsType}
                        />
                    )}
                </Box>
            </Paper>

            {/* Questionnaire Modal */}
            <Dialog
                open={questionaryModalOpen}
                onClose={closeQuestionaryModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Questionnaire</Typography>
                        <IconButton onClick={closeQuestionaryModal} size="small">
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
                            value="ForInsured"
                            control={<Radio />}
                            label="For Insured"
                        />
                        <FormControlLabel
                            value="ForTreatingDoctor"
                            control={<Radio />}
                            label="For Treating Doctor"
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
                    <Button onClick={closeQuestionaryModal} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AgencyReworkTabs;