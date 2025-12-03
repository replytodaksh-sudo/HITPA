import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
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
import { caseUpdateService } from '../../services/caseupdate.service';
import { QuestionService } from '../../services/question.service';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import Logs from '../../components/sharedComponents/components/Logs';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';


// API URL - Update with your environment config
// const DOWNLOAD_URL = process.env.REACT_APP_DOWNLOAD_URL || 'https://api.example.com/download?investigationId=';
const DOWNLOAD_URL = 'https://api.example.com/download?investigationId=';

interface RegionalReassignFormProps {
    // No props needed - gets data from URL params
}

interface PreviousData {
    activeCaseID: string;
    reworkCaseComments: string;
    // ... other fields
}

const RegionalReassignForm: React.FC<RegionalReassignFormProps> = () => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState(0);
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

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
                        <Tab label="FO Update" />
                        <Tab label="Logs" />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={{ pt: 3 }}>
                    {/* Tab 0: Pre-Auth Details (Cashless) or Claim Details (Reim) */}
                    {activeTab === 0 && claimsType === 'cashless' && (
                        <PreAuth
                            //   investigationId={investigationId}
                            claimDetails={previousData}
                        //   claimsType={claimsType}
                        />
                    )}
                    {activeTab === 0 && claimsType === 'reim' && (
                        <ClaimDetailsReim
                            claimDetails={previousData}
                            claimsType={claimsType}
                        //   investigationId={investigationId}
                        //   isFormEditable={false}
                        //   onNextPage={() => {}}
                        />
                    )}

                    {/* Tab 1: Insured & Hospital Details */}
                    {activeTab === 1 && (
                        <HospitalInfo
                            claimDetails={previousData}
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

                    {/* Tab 3: Document */}
                    {activeTab === 3 && (
                        <CentralRegionalDocuments
                        // investigationId={investigationId}
                        />
                    )}

                    {/* Tab 4: FO Update */}
                    {activeTab === 4 && claimsType === 'cashless' && (
                        <Box>
                            {previousData?.reworkCaseComments && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        component="span"
                                        sx={{ color: '#776BC5', fontWeight: 700 }}
                                    >
                                        Reassign case:
                                    </Typography>
                                    <Typography
                                        component="span"
                                        sx={{ fontWeight: 700, ml: 1 }}
                                    >
                                        {previousData.reworkCaseComments}
                                    </Typography>
                                </Box>
                            )}
                            <CentralAssignedAgencyCaseUpdate />
                            {/* <Preview
                                investigationId={investigationId}
                                buttonVisible={true}
                                previewRefresh={false}
                            /> */}
                        </Box>
                    )}
                    {activeTab === 4 && claimsType === 'reim' && (
                        <ReimburseCaseUpdate
                            // investigationId={investigationId}
                            buttonEnable={true}
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

export default RegionalReassignForm;