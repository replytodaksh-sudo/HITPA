// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import {
//     Box,
//     Card,
//     CardContent,
//     Chip,
//     Grid,
//     Accordion,
//     AccordionSummary,
//     AccordionDetails,
//     Typography,
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import PreAuth from '../../components/sharedComponents/components/PreAuth';
// import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
// import Preview from '../../components/sharedComponents/components/Preview';
// import QCUpdates from '../../components/sharedComponents/components/QCUpdates';
// import QCUpdateCentral from '../../components/sharedComponents/components/QCUpdateCentral';
// import Logs from '../../components/sharedComponents/components/Logs';
// import QCUpdateService from '../../services/qcupdate.service';
// import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
// import CentralAgencyCaseUpdateDocuments from '../../components/sharedComponents/components/CentralAgencyCaseUpdateDocuments';
// import claimsService from '../../services/claims.service';

// const CentralQueryForms: React.FC = () => {
//     const { investigationId } = useParams<{ investigationId: string }>();
//     const [searchParams] = useSearchParams();

//     // State
//     const [claimsType, setClaimsType] = useState('');
//     const [claimNo, setClaimNo] = useState('');
//     const [sbigClaimNo, setSbigClaimNo] = useState('');
//     const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
//     const [expandedAccordion, setExpandedAccordion] = useState<string | false>('panel0');
//     const [roleName, setRoleName] = useState('');
//     const [dataRole, setDataRole] = useState('');
//     const [centralQueryComments, setCentralQueryComments] = useState('');
//     const [buttonEnable, setButtonEnable] = useState(true);
//     const [display, setDisplay] = useState('block');
//     const [claimDetails, setClaimDetails] = useState();

//     // Initialize from query parameters and session
//     useEffect(() => {
//         const type = searchParams.get('claimsType') || '';
//         const tpaClaim = searchParams.get('claimNo') || '';
//         const sbigClaim = searchParams.get('sbigclaimno') || '';

//         setClaimsType(type);
//         setClaimNo(tpaClaim);
//         setSbigClaimNo(sbigClaim);

//         // Set label based on claim type
//         if (type === 'cashless') {
//             setClaimsTypeLabel('Cashless');
//         } else if (type === 'reim') {
//             setClaimsTypeLabel('Reimbursement');
//         } else {
//             setClaimsTypeLabel('');
//         }

//         // Get role from session storage
//         const role = sessionStorage.getItem('roleName') || '';
//         setRoleName(role);

//         // Fetch data based on role
//         fetchData(role, investigationId!);
//         fetchClaimDetails(investigationId!);
//     }, [searchParams, investigationId]);

//     const fetchClaimDetails = async (invId: string) => {
//             try {
//                 const response = await claimsService.claimDetails(invId);
//                 if (response.statusCode === 0) {
//                     setClaimDetails(response.payload);
//                 }
//             } catch (error) {
//                 console.error('Error fetching claim details:', error);
//             }
//         };

//     const fetchData = async (role: string, invId: string) => {
//         let tabName = '';
//         let dataRoleValue = '';

//         if (role === 'Regional Manager') {
//             tabName = 'regionalQC';
//             dataRoleValue = 'regional';
//         } else if (role === 'Central Manager') {
//             tabName = 'centralQC';
//             dataRoleValue = 'central';
//         }

//         setDataRole(dataRoleValue);

//         try {
//             const response = await QCUpdateService.qcUpdatePreview(invId, tabName);
//             if (response.statusCode === 0) {
//                 setCentralQueryComments(response.payload.queryWithRegionalQC || '');
//             }
//         } catch (error) {
//             console.error('Error fetching QC preview:', error);
//         }
//     };

//     const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
//         setExpandedAccordion(isExpanded ? panel : false);
//     };

//     const accordionSx = {
//         mb: 2,
//         '&.Mui-expanded': {
//             margin: 'auto',
//         },
//         '& .MuiAccordionSummary-root': {
//             backgroundColor: '#F3F4F6',
//             '&:hover': {
//                 backgroundColor: '#E5E7EB',
//             },
//         },
//         '& .MuiAccordionSummary-content': {
//             my: 2,
//         },
//     };

//     const summaryIconSx = {
//         '& .MuiSvgIcon-root': {
//             color: '#2563EB',
//         },
//     };

//     return (
//         <Box sx={{ p: 3 }}>
//             <Card sx={{ mb: 3 }}>
//                 <CardContent>
//                     {/* Header with Investigation Numbers */}
//                     <Grid container spacing={2} sx={{ mb: 3 }}>
//                         <Grid size={{ xs: 4 }}>
//                             <Typography variant="body2">
//                                 <strong>Investigation No: </strong>
//                                 {investigationId}
//                                 {claimsTypeLabel && (
//                                     <Chip
//                                         label={claimsTypeLabel}
//                                         color="warning"
//                                         size="small"
//                                         sx={{ ml: 1 }}
//                                     />
//                                 )}
//                             </Typography>
//                         </Grid>
//                         <Grid size={{ xs: 4 }} sx={{ textAlign: 'center' }}>
//                             <Typography variant="body2">
//                                 <strong>Claim No: </strong>
//                                 {sbigClaimNo}
//                             </Typography>
//                         </Grid>
//                         <Grid size={{ xs: 4 }} sx={{ textAlign: 'right' }}>
//                             <Typography variant="body2">
//                                 <strong>TPA Claim No: </strong>
//                                 {claimNo}
//                             </Typography>
//                         </Grid>
//                     </Grid>

//                     {/* Accordions */}
//                     <Box sx={{ mt: 3 }}>
//                         {/* Accordion 0: Pre-Auth Details */}
//                         <Accordion
//                             expanded={expandedAccordion === 'panel0'}
//                             onChange={handleAccordionChange('panel0')}
//                             sx={accordionSx}
//                         >
//                             <AccordionSummary
//                                 expandIcon={<ExpandMoreIcon />}
//                                 aria-controls="panel0-content"
//                                 id="panel0-header"
//                                 sx={summaryIconSx}
//                             >
//                                 <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
//                                     Pre-Auth Details
//                                 </Typography>
//                             </AccordionSummary>
//                             <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
//                                 <PreAuth claimDetails={claimDetails}/>
//                             </AccordionDetails>
//                         </Accordion>

//                         {/* Accordion 1: Insured & Hospital Details */}
//                         <Accordion
//                             expanded={expandedAccordion === 'panel1'}
//                             onChange={handleAccordionChange('panel1')}
//                             sx={accordionSx}
//                         >
//                             <AccordionSummary
//                                 expandIcon={<ExpandMoreIcon />}
//                                 aria-controls="panel1-content"
//                                 id="panel1-header"
//                                 sx={summaryIconSx}
//                             >
//                                 <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
//                                     Insured & Hospital Details
//                                 </Typography>
//                             </AccordionSummary>
//                             <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
//                                 <HospitalInfo claimDetails={claimDetails} claimsType={claimsType} />
//                             </AccordionDetails>
//                         </Accordion>

//                         {/* Accordion 2: Case Info */}
//                         <Accordion
//                             expanded={expandedAccordion === 'panel2'}
//                             onChange={handleAccordionChange('panel2')}
//                             sx={accordionSx}
//                         >
//                             <AccordionSummary
//                                 expandIcon={<ExpandMoreIcon />}
//                                 aria-controls="panel2-content"
//                                 id="panel2-header"
//                                 sx={summaryIconSx}
//                             >
//                                 <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
//                                     Case Info
//                                 </Typography>
//                             </AccordionSummary>
//                             <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
//                                 <CaseInfoComponent />
//                             </AccordionDetails>
//                         </Accordion>

//                         {/* Accordion 3: Documents */}
//                         <Accordion
//                             expanded={expandedAccordion === 'panel3'}
//                             onChange={handleAccordionChange('panel3')}
//                             sx={accordionSx}
//                         >
//                             <AccordionSummary
//                                 expandIcon={<ExpandMoreIcon />}
//                                 aria-controls="panel3-content"
//                                 id="panel3-header"
//                                 sx={summaryIconSx}
//                             >
//                                 <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
//                                     Documents
//                                 </Typography>
//                             </AccordionSummary>
//                             <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
//                                 <CentralAgencyCaseUpdateDocuments />
//                             </AccordionDetails>
//                         </Accordion>

//                         {/* Accordion 4: F.O Update */}
//                         <Accordion
//                             expanded={expandedAccordion === 'panel4'}
//                             onChange={handleAccordionChange('panel4')}
//                             sx={accordionSx}
//                         >
//                             <AccordionSummary
//                                 expandIcon={<ExpandMoreIcon />}
//                                 aria-controls="panel4-content"
//                                 id="panel4-header"
//                                 sx={summaryIconSx}
//                             >
//                                 <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
//                                     F.O Update
//                                 </Typography>
//                             </AccordionSummary>
//                             <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
//                                 <Preview buttonVisible={true} />
//                             </AccordionDetails>
//                         </Accordion>

//                         {/* Accordion 5: Agency QC */}
//                         <Accordion
//                             expanded={expandedAccordion === 'panel5'}
//                             onChange={handleAccordionChange('panel5')}
//                             sx={accordionSx}
//                         >
//                             <AccordionSummary
//                                 expandIcon={<ExpandMoreIcon />}
//                                 aria-controls="panel5-content"
//                                 id="panel5-header"
//                                 sx={summaryIconSx}
//                             >
//                                 <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
//                                     Agency QC
//                                 </Typography>
//                             </AccordionSummary>
//                             <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
//                                 {/* <QCUpdates display="block" editable={true} /> */}
//                                 <QCUpdates editable={true} />
//                             </AccordionDetails>
//                         </Accordion>

//                         {/* Accordion 6: QC Update */}
//                         <Accordion
//                             expanded={expandedAccordion === 'panel6'}
//                             onChange={handleAccordionChange('panel6')}
//                             sx={accordionSx}
//                         >
//                             <AccordionSummary
//                                 expandIcon={<ExpandMoreIcon />}
//                                 aria-controls="panel6-content"
//                                 id="panel6-header"
//                                 sx={summaryIconSx}
//                             >
//                                 <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
//                                     QC Update
//                                 </Typography>
//                             </AccordionSummary>
//                             <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
//                                 <Box>
//                                     {centralQueryComments && centralQueryComments !== '' && (
//                                         <Box sx={{ mb: 2 }}>
//                                             <Typography component="span" sx={{ color: '#776BC5', fontWeight: 700 }}>
//                                                 Central Query:
//                                             </Typography>
//                                             <Typography component="span" sx={{ fontWeight: 700, ml: 1 }}>
//                                                 {centralQueryComments}
//                                             </Typography>
//                                         </Box>
//                                     )}
//                                     <QCUpdateCentral buttonEnable={buttonEnable} />
//                                 </Box>
//                             </AccordionDetails>
//                         </Accordion>

//                         {/* Accordion 7: Logs */}
//                         <Accordion
//                             expanded={expandedAccordion === 'panel7'}
//                             onChange={handleAccordionChange('panel7')}
//                             sx={accordionSx}
//                         >
//                             <AccordionSummary
//                                 expandIcon={<ExpandMoreIcon />}
//                                 aria-controls="panel7-content"
//                                 id="panel7-header"
//                                 sx={summaryIconSx}
//                             >
//                                 <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
//                                     Logs
//                                 </Typography>
//                             </AccordionSummary>
//                             <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
//                                 <Logs claimsType={claimsType} />
//                             </AccordionDetails>
//                         </Accordion>
//                     </Box>
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// };

// export default CentralQueryForms;


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
import CentralAgencyCaseUpdateDocuments from '../../components/sharedComponents/components/CentralAgencyCaseUpdateDocuments';

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
                                    <CentralAgencyCaseUpdateDocuments />
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