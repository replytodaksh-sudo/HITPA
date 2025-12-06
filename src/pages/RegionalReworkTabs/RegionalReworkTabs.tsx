import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Tabs,
    Tab,
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
    Divider,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import QuizIcon from '@mui/icons-material/Quiz';
import Logs from '../../components/sharedComponents/components/Logs';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';
import RegionalReworkCaseUpdate from '../../components/sharedComponents/components/RegionalReworkCaseUpdate';


// ===========================
// INTERFACES
// ===========================
interface RouteParams extends Record<string, string | undefined> {
    investigationId: string;
}

// ===========================
// API SERVICES
// ===========================
const caseUpdateService = {
    caseUpdatePreviousData: async (investigationId: string) => {
        const response = await fetch(`/api/case-update/previous/${investigationId}`);
        if (!response.ok) throw new Error('Failed to fetch case data');
        return response.json();
    }
};

const questionaryService = {
    downloadQuestion: async (investigationId: string, questionType: string) => {
        const response = await fetch(`/api/questionary/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ investigationId, questionType })
        });
        if (!response.ok) throw new Error('Failed to prepare download');
        return response.json();
    }
};

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
    const [activeTab, setActiveTab] = useState(0);
    const [claimsType, setClaimsType] = useState('');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
    const [claimNo, setClaimNo] = useState('');
    const [sbiClaimNo, setSbiClaimNo] = useState('');
    const [previuosData, setPreviuosData] = useState<any>('');
    const [buttonEnable] = useState(true);
    const [showButton] = useState(true);

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
        }
    }, [investigationId]);

    // ===========================
    // FETCH CASE DATA
    // ===========================
    const getSavedFormData = async () => {
        try {
            const data = await caseUpdateService.caseUpdatePreviousData(investigationId!);
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

    // ===========================
    // TAB CHANGE HANDLER
    // ===========================
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
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
            await questionaryService.downloadQuestion(investigationId!, questionaryRadio);
            const url = `${apiUrls.downloadUrl}${investigationId}&questionType=${questionaryRadio}`;
            window.open(url, '_blank');
            closeQuestionaryModal();
        } catch (error) {
            console.error('Error downloading questionnaire:', error);
            alert('Failed to download questionnaire');
        }
    };

    // ===========================
    // TABS CONFIGURATION
    // ===========================
    const tabs = [
        ...(claimsType === 'cashless' ? [{ label: 'Pre-Auth Details', id: 'preauth' }] : []),
        ...(claimsType === 'reim' ? [{ label: 'Claim Details', id: 'claim-details' }] : []),
        { label: 'Insured & Hospital Details', id: 'hospital-info' },
        { label: 'Case Info', id: 'case-info' },
        { label: 'Document', id: 'document' },
        { label: 'FO Update', id: 'fo-update' },
        { label: 'Logs', id: 'logs' },
    ];

    // ===========================
    // RENDER TAB CONTENT
    // ===========================
    const renderTabContent = () => {
        const currentTab = tabs[activeTab];
        if (!currentTab) return null;

        switch (currentTab.id) {
            case 'preauth':
                return <PreAuth claimDetails={previuosData} />;

            case 'claim-details':
                return <ClaimDetailsReim claimsType={claimsType} claimDetails={previuosData} />;

            case 'hospital-info':
                return <HospitalInfo claimsType={claimsType} claimDetails={previuosData} />;

            case 'case-info':
                return <CaseInfoComponent />;

            case 'document':
                return <CentralRegionalDocuments />;

            case 'fo-update':
                if (claimsType === 'cashless') {
                    return (
                        <Box>
                            {previuosData.reworkCaseComments && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography component="span" sx={{ color: '#776BC5', fontWeight: 700 }}>
                                        Rework case:
                                    </Typography>
                                    <Typography component="span" sx={{ fontWeight: 700, ml: 1 }}>
                                        {previuosData.reworkCaseComments}
                                    </Typography>
                                </Box>
                            )}

                            {previuosData.noDataStatus === 'NonEditable' && (
                                <CentralAssignedAgencyCaseUpdate />
                                // <Preview buttonVisible={true} />
                            )}

                            {previuosData.noDataStatus === 'Editable' && (
                                <RegionalReworkCaseUpdate />
                            )}
                        </Box>
                    );
                } else {
                    return <ReimburseCaseUpdate buttonEnable={buttonEnable} />;
                }

            case 'logs':
                return <Logs claimsType={claimsType} />;

            default:
                return null;
        }
    };

    // ===========================
    // RENDER
    // ===========================
    return (
        <Box className="container fiori-container">
            <Card sx={{ mb: 3, mt: 4 }}>
                <CardContent>
                    {/* Header Info */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="body2">
                                <strong>Investigation No : </strong>
                                {investigationId}
                                <Chip
                                    label={claimsTypeLabel}
                                    color="warning"
                                    size="small"
                                    sx={{ ml: 1, fontWeight: 600 }}
                                />
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { md: 'center' } }}>
                            <Typography variant="body2">
                                <strong>Claim No : </strong>
                                {sbiClaimNo}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { md: 'right' } }}>
                            <Typography variant="body2">
                                <strong>TPA Claim No : </strong>
                                {claimNo}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<QuizIcon />}
                            onClick={openQuestionaryModal}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                },
                            }}
                        >
                            Questionnaire
                        </Button>
                    </Box>

                    {/* Tabs */}
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                minWidth: 'auto',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                            },
                            '& .Mui-selected': {
                                color: '#6770d2',
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#6770d2',
                            },
                        }}
                    >
                        {tabs.map((tab, index) => (
                            <Tab key={tab.id} label={tab.label} />
                        ))}
                    </Tabs>

                    {/* Tab Content */}
                    <Box sx={{ mt: 3 }}>
                        {renderTabContent()}
                    </Box>
                </CardContent>
            </Card>

            {/* Questionnaire Modal */}
            <Dialog
                open={questionaryModalOpen}
                onClose={closeQuestionaryModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Questionnaire
                </DialogTitle>
                <DialogContent>
                    <RadioGroup
                        value={questionaryRadio}
                        onChange={(e) => setQuestionaryRadio(e.target.value)}
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
                    <Button onClick={closeQuestionaryModal}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadPDF}
                        disabled={!questionaryRadio}
                    >
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RegionalReworkTabs;