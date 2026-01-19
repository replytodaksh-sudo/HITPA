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
    FactCheck,
    Download as DownloadIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material';

// Import services
import { caseUpdateService } from '../../services/caseupdate.service';
import claimsService from '../../services/claims.service';

// Import child components
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import Logs from '../../components/sharedComponents/components/Logs';
import QCUpdateCentral from '../../components/sharedComponents/components/QCUpdateCentral';
import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';
import QCUpdates from '../../components/sharedComponents/components/QCUpdates';
import { apiUrls } from '../../constants/apiConstants';

const QCPendingForms: React.FC = () => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [investigationId, setInvestigationId] = useState('');
    const [claimsType, setClaimsType] = useState('');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
    const [claimNo, setClaimNo] = useState('');
    const [sbigClaimNo, setSbigClaimNo] = useState('');
    const [reworkCaseComments, setReworkCaseComments] = useState('');
    const [loading, setLoading] = useState(true);
    const [claimDetails, setClaimDetails] = useState<any>(null);

    // Modal state
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [questionaryRadio, setQuestionaryRadio] = useState('');
    const [downloading, setDownloading] = useState(false);

    // QC Update props
    const [buttonEnable] = useState(true);
    const [display] = useState('block');

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
            fetchCaseDetails(cleanedId);
            fetchClaimDetails(cleanedId);
        }
    }, [paramInvestigationId, searchParams]);

    const fetchClaimDetails = async (invId: string) => {
        try {
            const response = await claimsService.claimDetails(invId);
            if (response.statusCode === 0) {
                console.log('Claim details:', response.payload);
                setClaimDetails(response.payload);
                sessionStorage.setItem('formEditable', response.payload.editable);
                sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
            }
        } catch (error) {
            console.error('Error fetching claim details:', error);
        }
    };

    const fetchCaseDetails = async (invId: string) => {
        try {
            setLoading(true);
            const response = await caseUpdateService.caseUpdatePreview(invId);

            if (response.statusCode === 0) {
                setReworkCaseComments(response.payload.reworkCaseComments || '');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
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

    const openReportModal = () => {
        setQuestionaryRadio('');

        // For cashless, download directly without modal
        if (claimsType === 'cashless') {
            handleDownloadCashlessPDF();
            return;
        }

        // For reimbursement, show modal with options
        setReportModalOpen(true);
    };

    const closeReportModal = () => {
        setReportModalOpen(false);
        setQuestionaryRadio('');
    };

    const handleQuestionaryRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionaryRadio(event.target.value);
    };

    // const handleDownloadPDF = () => {
    //     if (!questionaryRadio) return;

    //     const url = `${PDF_DOWNLOAD_URL}?invClaimId=${investigationId}&pdfType=${questionaryRadio}&claimType=${claimsType}`;
    //     window.open(url, '_blank');
    //     closeReportModal();
    // };

    const handleDownloadPDF = async () => {
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
            closeReportModal();
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    // const handleDownloadCashlessPDF = () => {
    //     const url = `${PDF_DOWNLOAD_URL}?invClaimId=${investigationId}&pdfType=${questionaryRadio}&claimType=${claimsType}`;
    //     window.open(url, '_blank');
    // };

    const handleDownloadCashlessPDF = async () => {
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
                                        {sbigClaimNo || '-'}
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
                        {/* Investigation Report Button */}
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<AssessmentIcon />}
                                onClick={openReportModal}
                                sx={{
                                    bgcolor: '#8B5CF6',
                                    color: 'white',
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: 2,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    height: '40px',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                                    '&:hover': {
                                        bgcolor: '#7C3AED',
                                        boxShadow: '0 6px 16px rgba(139, 92, 246, 0.4)',
                                    },
                                }}
                            >
                                Investigation Report
                            </Button>
                        </Box>

                        {/* Accordion Sections */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Pre-Auth Details Accordion */}
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
                                            Pre-Auth Details
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    <PreAuth claimDetails={claimDetails} />
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
                                    <HospitalInfo claimDetails={claimDetails} claimsType={claimsType} />
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

                            {/* F.O Update Accordion */}
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
                                            F.O Update
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    {reworkCaseComments && (
                                        <Box
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                bgcolor: '#F3E8FF',
                                                borderRadius: 1,
                                                borderLeft: '4px solid #8B5CF6',
                                            }}
                                        >
                                            <Typography
                                                component="span"
                                                sx={{ color: '#6B21A8', fontWeight: 700 }}
                                            >
                                                Comments:
                                            </Typography>
                                            <Typography
                                                component="span"
                                                sx={{ fontWeight: 600, ml: 1, color: '#581C87' }}
                                            >
                                                {reworkCaseComments}
                                            </Typography>
                                        </Box>
                                    )}
                                    <CentralAssignedAgencyCaseUpdate
                                        buttonVisible={true}
                                        previewRefresh={false}
                                    />
                                </AccordionDetails>
                            </Accordion>

                            {/* Agency QC Accordion */}
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
                                        <FactCheck sx={{ color: '#3B82F6' }} />
                                        <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                            Agency QC
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    <QCUpdates editable={true} />
                                </AccordionDetails>
                            </Accordion>

                            {/* QC Update Accordion */}
                            <Accordion
                                expanded={expanded === 'panel7'}
                                onChange={handleAccordionChange('panel7')}
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
                                        <FactCheck sx={{ color: '#3B82F6' }} />
                                        <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                            QC Update
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    {display === 'block' && (
                                        <QCUpdateCentral
                                            investigationId={investigationId}
                                            buttonEnable={buttonEnable}
                                        />
                                    )}
                                </AccordionDetails>
                            </Accordion>

                            {/* Logs Accordion */}
                            <Accordion
                                expanded={expanded === 'panel8'}
                                onChange={handleAccordionChange('panel8')}
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

            {/* Investigation Report Modal (For Reimbursement) */}
            <Dialog
                open={reportModalOpen}
                onClose={closeReportModal}
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
                        <AssessmentIcon sx={{ color: '#3B82F6' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B' }}>
                            Investigation Report
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <RadioGroup
                        value={questionaryRadio}
                        onChange={handleQuestionaryRadioChange}
                    >
                        <FormControlLabel
                            value="ReportEmployer"
                            control={<Radio sx={{ color: '#3B82F6', '&.Mui-checked': { color: '#3B82F6' } }} />}
                            label="Employer Report"
                            sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                            value="ReportInsured"
                            control={<Radio sx={{ color: '#3B82F6', '&.Mui-checked': { color: '#3B82F6' } }} />}
                            label="Insured Report"
                            sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                            value="ReportHospital"
                            control={<Radio sx={{ color: '#3B82F6', '&.Mui-checked': { color: '#3B82F6' } }} />}
                            label="Hospital Report"
                        />
                    </RadioGroup>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                        onClick={closeReportModal}
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

export default QCPendingForms;