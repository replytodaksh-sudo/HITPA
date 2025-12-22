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
} from '@mui/material';
import {
    Description as PreAuthIcon,
    Receipt as ClaimIcon,
    LocalHospital as HospitalIcon,
    Info as InfoIcon,
    FolderOpen as DocsIcon,
    Update as UpdateIcon,
    Assignment as QCIcon,
    History as LogsIcon,
    Close as CloseIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import QCUpdateService from '../../services/qcupdate.service';
import agencyQcUpdateService from '../../services/agencyqcupdate.service';
import caseUpdateService from '../../services/caseupdate.service';
import { apiUrls } from '../../constants/apiConstants';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralAgencyCaseUpdateDocuments from '../../components/sharedComponents/components/CentralAgencyCaseUpdateDocuments';
import Logs from '../../components/sharedComponents/components/Logs';
import claimsService from '../../services/claims.service';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import Preview from '../../components/sharedComponents/components/Preview';
import QCUpdates from '../../components/sharedComponents/components/QCUpdates';


// ==================== INTERFACES ====================
interface ClaimDetails {
    noDataStatus: 'Editable' | 'NonEditable' | 'NotToOpenForm';
    [key: string]: any;
}

interface QCData {
    noDataStatus: 'Editable' | 'NonEditable' | 'NotToOpenForm';
    [key: string]: any;
}

/**
 * QC Submitted Forms Component
 * Shows detailed view of a submitted QC case with multiple tabs
 */
const AgencyQCSubmittedForms: React.FC = () => {
    const { investigationId: rawInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // URL params
    const claimsType = searchParams.get('claimsType') || '';
    const claimNo = searchParams.get('claimNo') || '';
    const sbigClaimNo = searchParams.get('sbigclaimno') || '';

    // State
    const [investigationId, setInvestigationId] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [claimDetails, setClaimDetails] = useState<ClaimDetails | null>(null);
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
    const dataRole = roleName === 'Regional Manager' ? 'regional' :
        roleName === 'Central Manager' ? 'central' : '';

    // Label for claim type
    const claimsTypeLabel = claimsType === 'cashless' ? 'Cashless' :
        claimsType === 'reim' ? 'Reimbursement' : '';

    // Initialize
    useEffect(() => {
        if (rawInvestigationId) {
            const cleanId = rawInvestigationId.split(' ')[0];
            setInvestigationId(cleanId);
        }
    }, [rawInvestigationId]);

    // Fetch data when investigation ID is set
    useEffect(() => {
        if (investigationId) {
            fetchClaimDetails(investigationId);
            fetchCaseDetails();
            fetchQCDetails()
        }
    }, [investigationId]);

    const fetchClaimDetails = async (invId: string) => {
        // setLoading(true);
        try {
            const response = await claimsService.claimDetails(invId);
            if (response.statusCode === 0) {
                console.log("ppppp", response.payload)
                setClaimDetails(response.payload);
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
    const fetchQCDetails = async () => {
        try {
            const response = await QCUpdateService.qcUpdatePreview(investigationId, 'regionalQC');

            if (response.statusCode === 0) {
                // setClaimDetails(response.payload);
                console.log("Claim Details:", response.payload);
                // Set button and display based on role and status
                if (roleName === 'Regional Manager') {
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
                if ((roleName === 'Regional Manager' || roleName === 'Agency Spoc') &&
                    response.payload.noDataStatus === 'NotToOpenForm') {
                    setAgencyQcForm('none');
                    setNotDisplayMessage(true);
                } else if ((roleName === 'Regional Manager' || roleName === 'Agency Spoc') &&
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

    // Tab configuration
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
            show: true,
        },
        {
            label: 'Logs',
            icon: <LogsIcon />,
            show: true,
        },
    ];

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
                    {/* Header with Investigation Report button */}
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
                        {tabs.filter(tab => tab.show).map((tab, index) => (
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
                    <Box hidden={activeTab !== 0}>
                        {claimsType === 'cashless' ? (
                            <PreAuth claimDetails={claimDetails} />
                        ) : (
                            <ClaimDetailsReim claimDetails={claimDetails} claimsType={claimsType} />
                        )}
                    </Box>

                    {/* Tab 1: Hospital Info */}
                    <Box hidden={activeTab !== 1}>
                        <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />
                    </Box>

                    {/* Tab 2: Case Info */}
                    <Box hidden={activeTab !== 2}>
                        <CaseInfoComponent />
                    </Box>

                    {/* Tab 3: Documents */}
                    <Box hidden={activeTab !== 3}>
                        <CentralAgencyCaseUpdateDocuments />
                    </Box>

                    {/* Tab 4: F.O Updates */}
                    <Box hidden={activeTab !== 4}>
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

                        {claimsType === 'reim' ?
                            (
                                <ReimburseCaseUpdate buttonEnable={false} />
                            )
                            :
                            (
                                <Preview buttonVisible={true} />
                            )
                        }
                    </Box>

                    {/* Tab 5: Agency QC */}
                    <Box hidden={activeTab !== 5}>
                        {agencyQcForm === 'block' ?
                            (
                                <QCUpdates editable={agencyQcFormEditable} />
                            )
                            : null}

                        {notDisplayMessage && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="h6" color="text.secondary">
                                    Not Applicable
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Tab 6: Logs */}
                    <Box hidden={activeTab !== 6}>
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

export default AgencyQCSubmittedForms;