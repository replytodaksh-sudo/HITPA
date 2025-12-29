import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Container,
    Tabs,
    Tab,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    IconButton,
    Chip,
    Grid,
} from '@mui/material';
import {
    Description as PreAuthIcon,
    Receipt as ClaimIcon,
    LocalHospital as HospitalIcon,
    Info as InfoIcon,
    FolderOpen as DocsIcon,
    Update as UpdateIcon,
    Assignment as QCIcon,
    Visibility as PreviewIcon,
    History as LogsIcon,
    Close as CloseIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import caseUpdateService from '../../services/caseupdate.service';
import { apiUrls } from '../../constants/apiConstants';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralAgencyCaseUpdateDocuments from '../../components/sharedComponents/components/CentralAgencyCaseUpdateDocuments';
import ReimRegionalAgencyQC from '../../components/sharedComponents/components/ReimRegionalAgencyQC';
import QcPreview from '../../components/sharedComponents/components/QcPreview';
import QCUpdateCentral from '../../components/sharedComponents/components/QCUpdateCentral';
import Logs from '../../components/sharedComponents/components/Logs';
import QCUpdateService from '../../services/qcupdate.service';
import agencyQcUpdateService from '../../services/agencyqcupdate.service';
import claimsService from '../../services/claims.service';
import Preview from '../../components/sharedComponents/components/Preview';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';

// ==================== INTERFACES ====================
interface ClaimDetails {
    noDataStatus: 'Editable' | 'NonEditable' | 'NotToOpenForm';
    qcObservations?: string;
    [key: string]: any;
}

interface QCData {
    noDataStatus: 'Editable' | 'NonEditable' | 'NotToOpenForm';
    recommendation?: string;
    [key: string]: any;
}

/**
 * Central QC Form Component
 * Shows detailed view of a central QC case with multiple tabs
 * Similar to QCSubmittedForms but with different tab structure for Central Manager
 */
const CentralQCForm: React.FC = () => {
    const { investigationId: rawInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // URL params
    const claimsType = searchParams.get('claimsType') || '';
    const claimNo = searchParams.get('claimNo') || '';
    const sbigClaimNo = searchParams.get('sbigclaimno') || '';
    const editAble = searchParams.get('editAble') || '';

    // State
    const [claimDetails, setClaimDetails] = useState<any>(null);
    const [investigationId, setInvestigationId] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [claimQCDetails, setClaimQCDetails] = useState<ClaimDetails | null>(null);
    const [qcData, setQCData] = useState<QCData | null>(null);
    const [reworkCaseComments, setReworkCaseComments] = useState('');
    const [buttonEnable, setButtonEnable] = useState(false);
    const [display, setDisplay] = useState('none');
    const [agencyQcForm, setAgencyQcForm] = useState('block');
    const [agencyQcFormEditable, setAgencyQcFormEditable] = useState(true);
    const [notDisplayMessage, setNotDisplayMessage] = useState(false);

    // Modal state
    const [questionaryModalOpen, setQuestionaryModalOpen] = useState(false);
    const [questionaryRadio, setQuestionaryRadio] = useState('');

    // Get role info
    const roleName = sessionStorage.getItem('roleName') || '';

    // Label for claim type
    const claimsTypeLabel = claimsType === 'cashless' ? 'Cashless' :
        claimsType === 'reim' ? 'Reimbursement' : '';

    // Initialize
    useEffect(() => {
        if (rawInvestigationId) {
            const cleanId = rawInvestigationId.split('-')[0];
            setInvestigationId(cleanId);
        }

        // Store editAble in sessionStorage
        if (editAble) {
            sessionStorage.setItem('qcNonEdit', editAble);
        }
    }, [rawInvestigationId, editAble]);

    // Fetch data when investigation ID is set
    useEffect(() => {
        if (investigationId) {
            fetchClaimQCDetails();
            fetchClaimDetails(investigationId);
            fetchCaseDetails();
        }
    }, [investigationId]);

    const fetchClaimDetails = async (invId: string) => {
        // setLoading(true);
        try {
            const response = await claimsService.claimDetails(invId);
            if (response.statusCode === 0) {
                setClaimDetails(response.payload);
                // setInvestigationType(response.payload.investigationType);
                sessionStorage.setItem('formEditable', response.payload.editable);
                sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
            }
        } catch (error) {
            console.error('Error fetching claim details:', error);
        } finally {
            // setLoading(false);
        }
    };

    // Fetch claim details
    const fetchClaimQCDetails = async () => {
        try {
            const response = await QCUpdateService.qcUpdatePreview(investigationId, 'regionalQC');

            if (response.statusCode === 0) {
                setClaimQCDetails(response.payload);

                // Set button and display based on role and status
                if (roleName === 'Central Manager') {
                    if (response.payload.noDataStatus === 'NonEditable') {
                        setDisplay('block');
                        setButtonEnable(false);
                    } else if (response.payload.noDataStatus === 'Editable') {
                        setDisplay('block');
                        setButtonEnable(true);
                    } else {
                        setDisplay('none');
                    }
                }

                // Fetch QC data after claim details
                fetchQCData();
            }
        } catch (error) {
            console.error('Error fetching claim details:', error);
        }
    };

    // Fetch QC data
    const fetchQCData = async () => {
        try {
            const tabName = roleName === 'Regional Manager' ? 'regionalQC' :
                roleName === 'Central Manager' ? 'centralQC' : '';

            if (!tabName) return;

            const response = await agencyQcUpdateService.getQCUpdateData(investigationId, tabName);

            if (response.statusCode === 0) {
                setQCData(response.payload);

                // Handle agency QC form visibility
                if (roleName === 'Regional Manager' &&
                    response.payload.noDataStatus === 'NotToOpenForm') {
                    setAgencyQcForm('none');
                    setNotDisplayMessage(true);
                } else if (roleName === 'Regional Manager' &&
                    response.payload.noDataStatus === 'NonEditable') {
                    setAgencyQcForm('block');
                    setAgencyQcFormEditable(false);
                }
            }
        } catch (error) {
            console.error('Error fetching QC data:', error);
        }
    };

    // Fetch case details for rework comments
    const fetchCaseDetails = async () => {
        try {
            const response = await caseUpdateService.caseUpdatePreview(investigationId);

            if (response.statusCode === 0) {
                setReworkCaseComments(response.payload.reworkCaseComments || '');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
        }
    };

    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // Open questionary modal
    const openQuestionaryModal = () => {
        setQuestionaryRadio('');

        // For cashless, download directly without modal
        if (claimsType === 'cashless') {
            downloadPDFCashless();
            return;
        }

        setQuestionaryModalOpen(true);
    };

    // Close questionary modal
    const closeQuestionaryModal = () => {
        setQuestionaryModalOpen(false);
        setQuestionaryRadio('');
    };

    // Download PDF
    const downloadPDF = () => {
        const url = `${apiUrls.getPDFDetails}?invClaimId=${investigationId}&pdfType=${questionaryRadio}&claimType=${claimsType}`;
        window.open(url, '_blank');
        closeQuestionaryModal();
    };

    // Download PDF for cashless (no modal)
    const downloadPDFCashless = () => {
        const url = `${apiUrls.getPDFDetails}?invClaimId=${investigationId}&pdfType=${questionaryRadio}&claimType=${claimsType}`;
        window.open(url, '_blank');
    };

    // Tab configuration (dynamic based on data)
    const tabs = [
        {
            label: claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details',
            icon: claimsType === 'cashless' ? <PreAuthIcon /> : <ClaimIcon />,
            show: true,
        },
        {
            label: 'Insured & Hospital Details',
            icon: <HospitalIcon />,
            show: true,
        },
        {
            label: 'Case Info',
            icon: <InfoIcon />,
            show: true,
        },
        {
            label: 'Documents',
            icon: <DocsIcon />,
            show: true,
        },
        {
            label: 'F.O Updates',
            icon: <UpdateIcon />,
            show: true,
        },
        {
            label: 'Agency QC',
            icon: <QCIcon />,
            show: qcData?.recommendation !== '' && qcData?.recommendation !== null && qcData?.recommendation !== undefined,
        },
        {
            label: 'Reg. QC Updates',
            icon: <PreviewIcon />,
            show: claimQCDetails?.qcObservations !== '' && claimQCDetails?.qcObservations !== null && claimQCDetails?.qcObservations !== undefined,
        },
        {
            label: 'QC Updates',
            icon: <QCIcon />,
            show: true,
        },
        {
            label: 'Logs',
            icon: <LogsIcon />,
            show: true,
        },
    ];

    // Filter visible tabs
    const visibleTabs = tabs.filter(tab => tab.show);

    // Get actual tab index accounting for hidden tabs
    const getTabContent = (visibleIndex: number) => {
        const tabLabel = visibleTabs[visibleIndex]?.label;

        switch (tabLabel) {
            case 'Pre-Auth Details':
            case 'Claim Details':
                return 0;
            case 'Insured & Hospital Details':
                return 1;
            case 'Case Info':
                return 2;
            case 'Documents':
                return 3;
            case 'F.O Updates':
                return 4;
            case 'Agency QC':
                return 5;
            case 'Reg. QC Updates':
                return 6;
            case 'QC Updates':
                return 7;
            case 'Logs':
                return 8;
            default:
                return 0;
        }
    };

    const currentTabContent = getTabContent(activeTab);

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Card
                elevation={0}
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    mb: 3,
                    borderRadius: 2,
                }}
            >
                <CardContent>
                    {/* Header Info */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="body1">
                                <strong>Investigation No:</strong> {investigationId}{' '}
                                <Chip
                                    label={claimsTypeLabel}
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        backgroundColor: 'rgba(255,193,7,0.9)',
                                        color: 'white',
                                        fontWeight: 600,
                                    }}
                                />
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                            <Typography variant="body1">
                                <strong>Claim No:</strong> {sbigClaimNo}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="body1">
                                <strong>TPA Claim No:</strong> {claimNo}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Investigation Report button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={openQuestionaryModal}
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                },
                            }}
                        >
                            Investigation Report
                        </Button>
                    </Box>

                    {/* Tabs */}
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: 'white',
                                height: 3,
                                borderRadius: '3px 3px 0 0',
                            },
                            '& .MuiTab-root': {
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                textTransform: 'none',
                                minHeight: 48,
                                '&:hover': {
                                    color: 'rgba(255,255,255,0.9)',
                                },
                                '&.Mui-selected': {
                                    color: 'white',
                                },
                            },
                        }}
                    >
                        {visibleTabs.map((tab, index) => (
                            <Tab
                                key={index}
                                icon={tab.icon}
                                iconPosition="start"
                                label={tab.label}
                            />
                        ))}
                    </Tabs>
                </CardContent>
            </Card>

            {/* Tab Content */}
            <Card elevation={2}>
                <CardContent>
                    {/* Tab 0: Pre-Auth / Claim Details */}
                    <Box hidden={currentTabContent !== 0}>
                        {claimsType === 'cashless' ? (
                            <PreAuth claimDetails={claimDetails} />
                        ) : (
                            <ClaimDetailsReim claimDetails={claimDetails} claimsType={claimsType} />
                        )}
                    </Box>

                    {/* Tab 1: Hospital Info */}
                    <Box hidden={currentTabContent !== 1}>
                        <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />
                    </Box>

                    {/* Tab 2: Case Info */}
                    <Box hidden={currentTabContent !== 2}>
                        <CaseInfoComponent />
                    </Box>

                    {/* Tab 3: Documents */}
                    <Box hidden={currentTabContent !== 3}>
                        <CentralAgencyCaseUpdateDocuments />
                    </Box>

                    {/* Tab 4: F.O Updates */}
                    <Box hidden={currentTabContent !== 4}>
                        {reworkCaseComments && (
                            <Box sx={{ mb: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
                                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, display: 'inline' }}>
                                    Comments:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, display: 'inline', ml: 1 }}>
                                    {reworkCaseComments}
                                </Typography>
                            </Box>
                        )}

                        {claimsType === 'cashless' ?
                            (
                                <Preview buttonVisible={true} />
                            )
                            :
                            (
                                <ReimburseCaseUpdate buttonEnable={buttonEnable} />
                            )
                        }
                    </Box>

                    {/* Tab 5: Agency QC (conditional) */}
                    <Box hidden={currentTabContent !== 5}>
                        <ReimRegionalAgencyQC editable={true} />
                    </Box>

                    {/* Tab 6: Reg. QC Updates (conditional) */}
                    <Box hidden={currentTabContent !== 6}>
                        <QcPreview
                            dataRole="regional"
                            previewRefresh={false}
                            buttonEnable={buttonEnable}
                        />
                    </Box>

                    {/* Tab 7: QC Updates */}
                    <Box hidden={currentTabContent !== 7}>
                        <QCUpdateCentral
                            dataRole="central"
                            buttonEnable={!buttonEnable}
                        />
                    </Box>

                    {/* Tab 8: Logs */}
                    <Box hidden={currentTabContent !== 8}>
                        <Logs claimsType={claimsType} />
                    </Box>
                </CardContent>
            </Card>

            {/* Investigation Report Modal (for Reimbursement) */}
            <Dialog
                open={questionaryModalOpen}
                onClose={closeQuestionaryModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Investigation Report</Typography>
                    <IconButton onClick={closeQuestionaryModal} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <RadioGroup
                        value={questionaryRadio}
                        onChange={(e) => setQuestionaryRadio(e.target.value)}
                    >
                        <FormControlLabel
                            value="ReportEmployer"
                            control={<Radio />}
                            label="Employer Report"
                        />
                        <FormControlLabel
                            value="ReportInsured"
                            control={<Radio />}
                            label="Insured Report"
                        />
                        <FormControlLabel
                            value="ReportHospital"
                            control={<Radio />}
                            label="Hospital Report"
                        />
                    </RadioGroup>
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeQuestionaryModal}>
                        Cancel
                    </Button>
                    <Button
                        onClick={downloadPDF}
                        variant="contained"
                        disabled={!questionaryRadio}
                        startIcon={<DownloadIcon />}
                    >
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CentralQCForm;