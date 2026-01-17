import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
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
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Description as DescriptionIcon,
    LocalHospital as HospitalIcon,
    Info as InfoIcon,
    FolderOpen as FolderIcon,
    Update as UpdateIcon,
    Assignment as AssignmentIcon,
    History as HistoryIcon,
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
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import Logs from '../../components/sharedComponents/components/Logs';
import claimsService from '../../services/claims.service';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import Preview from '../../components/sharedComponents/components/Preview';
import QCUpdates from '../../components/sharedComponents/components/QCUpdates';

interface ClaimDetails {
    noDataStatus: 'Editable' | 'NonEditable' | 'NotToOpenForm';
    [key: string]: any;
}

interface QCData {
    noDataStatus: 'Editable' | 'NonEditable' | 'NotToOpenForm';
    [key: string]: any;
}

const AgencyQCSubmittedForms: React.FC = () => {
    const { investigationId: rawInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const claimsType = searchParams.get('claimsType') || '';
    const claimNo = searchParams.get('claimNo') || '';
    const sbigClaimNo = searchParams.get('sbigclaimno') || '';

    const [investigationId, setInvestigationId] = useState('');
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [claimDetails, setClaimDetails] = useState<ClaimDetails | null>(null);
    const [qcData, setQCData] = useState<QCData | null>(null);
    const [reworkCaseComments, setReworkCaseComments] = useState('');
    const [buttonEnable, setButtonEnable] = useState(false);
    const [display, setDisplay] = useState('none');
    const [agencyQcForm, setAgencyQcForm] = useState('block');
    const [agencyQcFormEditable, setAgencyQcFormEditable] = useState(true);
    const [notDisplayMessage, setNotDisplayMessage] = useState(false);
    const [questionaryModalOpen, setQuestionaryModalOpen] = useState(false);
    const [questionaryRadio, setQuestionaryRadio] = useState('');

    const roleName = sessionStorage.getItem('roleName') || '';
    const claimsTypeLabel = claimsType === 'cashless' ? 'Cashless' : claimsType === 'reim' ? 'Reimbursement' : '';

    useEffect(() => {
        if (rawInvestigationId) {
            const cleanId = rawInvestigationId.split(' ')[0];
            setInvestigationId(cleanId);
        }
    }, [rawInvestigationId]);

    useEffect(() => {
        if (investigationId) {
            fetchClaimDetails(investigationId);
            fetchCaseDetails();
            fetchQCDetails();
        }
    }, [investigationId]);

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

    const fetchQCDetails = async () => {
        try {
            const response = await QCUpdateService.qcUpdatePreview(investigationId, 'regionalQC');

            if (response.statusCode === 0) {
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
                fetchQCData();
            }
        } catch (error) {
            console.error('Error fetching claim details:', error);
        }
    };

    const fetchQCData = async () => {
        try {
            const tabName = roleName === 'Regional Manager' ? 'regionalQC' :
                roleName === 'Central Manager' ? 'centralQC' : '';

            if (!tabName) return;

            const response = await agencyQcUpdateService.getQCUpdateData(investigationId, tabName);

            if (response.statusCode === 0) {
                setQCData(response.payload);

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

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const openQuestionaryModal = () => {
        setQuestionaryRadio('');

        if (claimsType === 'cashless') {
            downloadPDFCashless();
            return;
        }

        setQuestionaryModalOpen(true);
    };

    const closeQuestionaryModal = () => {
        setQuestionaryModalOpen(false);
        setQuestionaryRadio('');
    };

    const downloadPDF = async () => {
        try {
            const url = `${import.meta.env.VITE_API_BASE_URL}${apiUrls.getPDFDetails}?invClaimId=${investigationId}&pdfType=${questionaryRadio}&claimType=${claimsType}`;
            const token = sessionStorage.getItem('token');
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/pdf",
                    Authorization: `Bearer ${token}`

                },
            });

            if (!response.ok) {
                throw new Error("Failed to download file");
            }

            const blob = await response.blob();

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `Reim_Report_${investigationId}.pdf`; // 👈 filename
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(downloadUrl);
            closeQuestionaryModal();
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const downloadPDFCashless = async () => {
        try {
            const url = `${import.meta.env.VITE_API_BASE_URL}${apiUrls.getPDFDetails}?invClaimId=${investigationId}&pdfType=${questionaryRadio}&claimType=${claimsType}`;
            const token = sessionStorage.getItem('token');
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/pdf",
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error("Failed to download file");
            }

            const blob = await response.blob();

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `Cashless_Report_${investigationId}.pdf`; // 👈 filename
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Download error:", error);
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
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "white" }}>
                                    Investigation No:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400, color: "white" }}>
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
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "white" }}>
                                    Claim No:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400, color: "white" }}>
                                    {sbigClaimNo || '-'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "white" }}>
                                    TPA Claim No:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400, color: "white" }}>
                                    {claimNo || '-'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Investigation Report Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
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
                            Investigation Report
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

                    {/* Accordion 4: Documents */}
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
                                    Documents
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
                            <CentralRegionalDocuments />
                        </AccordionDetails>
                    </Accordion>

                    {/* Accordion 5: F.O Updates */}
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
                                    F.O Updates
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
                            {reworkCaseComments && (
                                <Box sx={{ mb: 2, p: 2, bgcolor: '#FEF3C7', borderRadius: 1, border: '1px solid #FDE68A' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#92400E', display: 'inline' }}>
                                        Comments:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#78350F', display: 'inline', ml: 1 }}>
                                        {reworkCaseComments}
                                    </Typography>
                                </Box>
                            )}

                            {claimsType === 'reim' ? (
                                <ReimburseCaseUpdate buttonEnable={false} />
                            ) : (
                                <Preview buttonVisible={true} />
                            )}
                        </AccordionDetails>
                    </Accordion>

                    {/* Accordion 6: Agency QC */}
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
                                <AssignmentIcon sx={{ color: '#0284C7' }} />
                                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                                    Agency QC
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
                            {agencyQcForm === 'block' ? (
                                <QCUpdates editable={agencyQcFormEditable} />
                            ) : null}

                            {notDisplayMessage && (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        Not Applicable
                                    </Typography>
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion>

                    {/* Accordion 7: Logs */}
                    <Accordion
                        expanded={expanded === 'panel7'}
                        onChange={handleAccordionChange('panel7')}
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

            {/* Investigation Report Modal */}
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
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Investigation Report
                    </Typography>
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

                <DialogContent sx={{ pt: 3 }}>
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

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={closeQuestionaryModal}>
                        Cancel
                    </Button>
                    <Button
                        onClick={downloadPDF}
                        variant="contained"
                        disabled={!questionaryRadio}
                        startIcon={<DownloadIcon />}
                        sx={{
                            bgcolor: '#0284C7',
                            '&:hover': { bgcolor: '#0369A1' },
                        }}
                    >
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AgencyQCSubmittedForms;