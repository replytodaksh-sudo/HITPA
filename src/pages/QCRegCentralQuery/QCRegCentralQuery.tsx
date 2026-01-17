import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Container,
    Typography,
    Chip,
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
    FactCheck,
} from '@mui/icons-material';

// Import services
import QCUpdateService from '../../services/qcupdate.service';
import claimsService from '../../services/claims.service';

// Import child components
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import Preview from '../../components/sharedComponents/components/Preview';
import QCUpdates from '../../components/sharedComponents/components/QCUpdates';
import QCUpdateCentral from '../../components/sharedComponents/components/QCUpdateCentral';
import Logs from '../../components/sharedComponents/components/Logs';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';

/**
 * CentralQueryForms Component
 * Displays accordion sections for central query cases
 */
const CentralQueryForms: React.FC = () => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [claimsType, setClaimsType] = useState('');
    const [claimNo, setClaimNo] = useState('');
    const [sbigClaimNo, setSbigClaimNo] = useState('');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
    const [roleName, setRoleName] = useState('');
    const [dataRole, setDataRole] = useState('');
    const [centralQueryComments, setCentralQueryComments] = useState('');
    const [buttonEnable, setButtonEnable] = useState(true);
    const [claimDetails, setClaimDetails] = useState<any>(null);

    // Initialize from query parameters and session
    useEffect(() => {
        const type = searchParams.get('claimsType') || '';
        const tpaClaim = searchParams.get('claimNo') || '';
        const sbigClaim = searchParams.get('sbigclaimno') || '';

        setClaimsType(type);
        setClaimNo(tpaClaim);
        setSbigClaimNo(sbigClaim);

        // Set label based on claim type
        if (type === 'cashless') {
            setClaimsTypeLabel('Cashless');
        } else if (type === 'reim') {
            setClaimsTypeLabel('Reimbursement');
        } else {
            setClaimsTypeLabel('');
        }

        // Get role from session storage
        const role = sessionStorage.getItem('roleName') || '';
        setRoleName(role);

        // Fetch data based on role
        if (investigationId) {
            fetchData(role, investigationId);
            fetchClaimDetails(investigationId);
        }
    }, [searchParams, investigationId]);

    const fetchClaimDetails = async (invId: string) => {
        try {
            const response = await claimsService.claimDetails(invId);
            if (response.statusCode === 0) {
                setClaimDetails(response.payload);
            }
        } catch (error) {
            console.error('Error fetching claim details:', error);
        }
    };

    const fetchData = async (role: string, invId: string) => {
        let tabName = '';
        let dataRoleValue = '';

        if (role === 'Regional Manager') {
            tabName = 'regionalQC';
            dataRoleValue = 'regional';
        } else if (role === 'Central Manager') {
            tabName = 'centralQC';
            dataRoleValue = 'central';
        }

        setDataRole(dataRoleValue);

        try {
            const response = await QCUpdateService.qcUpdatePreview(invId, tabName);
            if (response.statusCode === 0) {
                setCentralQueryComments(response.payload.queryWithRegionalQC || '');
            }
        } catch (error) {
            console.error('Error fetching QC preview:', error);
        }
    };

    const handleAccordionChange = (panel: string) => (
        event: React.SyntheticEvent,
        isExpanded: boolean
    ) => {
        setExpanded(isExpanded ? panel : false);
    };

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
                                    <Preview buttonVisible={true} />
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
                                    {centralQueryComments && centralQueryComments !== '' && (
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
                                                Central Query:
                                            </Typography>
                                            <Typography
                                                component="span"
                                                sx={{ fontWeight: 600, ml: 1, color: '#581C87' }}
                                            >
                                                {centralQueryComments}
                                            </Typography>
                                        </Box>
                                    )}
                                    <QCUpdateCentral buttonEnable={buttonEnable} />
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
        </Container>
    );
};

export default CentralQueryForms;