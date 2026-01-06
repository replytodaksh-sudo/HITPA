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
// import Logs from '../../components/sharedComponents/components/Logs';
// import { caseUpdateService } from '../../services/caseupdate.service';
// import claimsService from '../../services/claims.service';
// import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
// import CentralAgencyCaseUpdateDocuments from '../../components/sharedComponents/components/CentralAgencyCaseUpdateDocuments';
// import QCUpdateCentral from '../../components/sharedComponents/components/QCUpdateCentral';

// const QCPendingFromCentralForms: React.FC = () => {
//     const { investigationId } = useParams<{ investigationId: string }>();
//     const [searchParams] = useSearchParams();

//     // State
//     const [claimsType, setClaimsType] = useState('');
//     const [claimNo, setClaimNo] = useState('');
//     const [sbigClaimNo, setSbigClaimNo] = useState('');
//     const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
//     const [expandedAccordion, setExpandedAccordion] = useState<string | false>('panel0');
//     const [reworkCaseComments, setReworkCaseComments] = useState('');
//     const [buttonEnable, setButtonEnable] = useState(false);
//     const [previewRefresh, setPreviewRefresh] = useState(false);
//     const [regDataRole] = useState('regional');
//     const [display] = useState('block');
//     const [claimDetails, setClaimDetails] = useState<any>(null);
//     const [statusInsuredVisit] = useState(0);

//     // Initialize from query parameters
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

//         // Get investigation ID from params
//         const cleanInvId = investigationId?.split(' ')[0] || '';
//         fetchDetails(cleanInvId);
//         fetchClaimDetails(cleanInvId);
//     }, [searchParams, investigationId]);

//     const fetchClaimDetails = async (invId: string) => {
//         try {
//             const response = await claimsService.claimDetails(invId);
//             if (response.statusCode === 0) {
//                 setClaimDetails(response.payload);
//             }
//         } catch (error) {
//             console.error('Error fetching claim details:', error);
//         }
//     };

//     const fetchDetails = async (invId: string) => {
//         try {
//             const response = await caseUpdateService.caseUpdatePreview(invId);
//             if (response.statusCode === 0) {
//                 setReworkCaseComments(response.payload.reworkCaseComments || '');
//             }
//         } catch (error) {
//             console.error('Error fetching case details:', error);
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
//                                 <PreAuth claimDetails={claimDetails} />
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
//                                 <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />
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
//                                 <Box>
//                                     {reworkCaseComments && reworkCaseComments !== '' && (
//                                         <Box sx={{ mb: 2 }}>
//                                             <Typography component="span" sx={{ color: '#776BC5', fontWeight: 700 }}>
//                                                 Comments:
//                                             </Typography>
//                                             <Typography component="span" sx={{ fontWeight: 700, ml: 1 }}>
//                                                 {reworkCaseComments}
//                                             </Typography>
//                                         </Box>
//                                     )}
//                                     <Preview buttonVisible={true} />
//                                 </Box>
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
//                                 <QCUpdateCentral
//                                     buttonEnable={!buttonEnable}
//                                     dataRole={regDataRole}
//                                 />
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

// export default QCPendingFromCentralForms;

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Description as DescriptionIcon,
    LocalHospital as HospitalIcon,
    Info as InfoIcon,
    CheckCircle as CheckCircleIcon,
    History,
    Assignment,
    Close as CloseIcon,
    UploadFile,
    Update,
    FactCheck,
} from '@mui/icons-material';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import Preview from '../../components/sharedComponents/components/Preview';
import QCUpdates from '../../components/sharedComponents/components/QCUpdates';
import Logs from '../../components/sharedComponents/components/Logs';
import { caseUpdateService } from '../../services/caseupdate.service';
import claimsService from '../../services/claims.service';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralAgencyCaseUpdateDocuments from '../../components/sharedComponents/components/CentralAgencyCaseUpdateDocuments';
import QCUpdateCentral from '../../components/sharedComponents/components/QCUpdateCentral';

const QCPendingFromCentralForms: React.FC = () => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [claimsType, setClaimsType] = useState('');
    const [claimNo, setClaimNo] = useState('');
    const [sbigClaimNo, setSbigClaimNo] = useState('');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
    const [expandedAccordion, setExpandedAccordion] = useState<string | false>('panel0');
    const [reworkCaseComments, setReworkCaseComments] = useState('');
    const [buttonEnable, setButtonEnable] = useState(false);
    const [previewRefresh, setPreviewRefresh] = useState(false);
    const [claimDetails, setClaimDetails] = useState<any>(null);
    const [regDataRole] = useState('regional');
    const [display] = useState('block');
    const [statusInsuredVisit] = useState(0);

    // Initialize from query parameters
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

        // Get investigation ID from params
        const cleanInvId = investigationId?.split(' ')[0] || '';
        fetchDetails(cleanInvId);
        fetchClaimDetails(cleanInvId);
    }, [searchParams, investigationId]);

    const fetchDetails = async (invId: string) => {
        try {
            const response = await caseUpdateService.caseUpdatePreview(invId);
            if (response.statusCode === 0) {
                setReworkCaseComments(response.payload.reworkCaseComments || '');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
        }
    };

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

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedAccordion(isExpanded ? panel : false);
    };

    const accordionSx = {
        mb: 2,
        borderRadius: 2,
        '&:before': { display: 'none' },
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    };

    const summaryIconSx = {
        bgcolor: '#E0F2FE',
        borderRadius: 2,
        '&:hover': { bgcolor: '#BAE6FD' },
        minHeight: 56,
        // '& .MuiSvgIcon-root': {
        //     color: '#2563EB',
        // },
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    {/* Header with Investigation Numbers */}
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

                    {/* Accordions */}
                    <Box sx={{ mt: 3 }}>
                        {/* Accordion 0: Pre-Auth Details */}
                        <Accordion
                            expanded={expandedAccordion === 'panel0'}
                            onChange={handleAccordionChange('panel0')}
                            sx={accordionSx}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel0-content"
                                id="panel0-header"
                                sx={summaryIconSx}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <DescriptionIcon sx={{ color: '#0284C7' }} />
                                    <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                                        {claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details'}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
                                <PreAuth claimDetails={claimDetails} />
                            </AccordionDetails>
                        </Accordion>

                        {/* Accordion 1: Insured & Hospital Details */}
                        <Accordion
                            expanded={expandedAccordion === 'panel1'}
                            onChange={handleAccordionChange('panel1')}
                            sx={accordionSx}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                sx={summaryIconSx}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <HospitalIcon sx={{ color: '#3B82F6' }} />
                                    <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                        Insured & Hospital Details
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
                                <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />
                            </AccordionDetails>
                        </Accordion>

                        {/* Accordion 2: Case Info */}
                        <Accordion
                            expanded={expandedAccordion === 'panel2'}
                            onChange={handleAccordionChange('panel2')}
                            sx={accordionSx}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2-content"
                                id="panel2-header"
                                sx={summaryIconSx}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <InfoIcon sx={{ color: '#0284C7' }} />
                                    <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                                        Case Info
                                    </Typography>
                                </Box>
                                {/* <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
                                    Case Info
                                </Typography> */}
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
                                <CaseInfoComponent />
                            </AccordionDetails>
                        </Accordion>

                        {/* Accordion 3: Documents */}
                        <Accordion
                            expanded={expandedAccordion === 'panel3'}
                            onChange={handleAccordionChange('panel3')}
                            sx={accordionSx}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3-content"
                                id="panel3-header"
                                sx={summaryIconSx}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <UploadFile sx={{ color: '#3B82F6' }} />
                                    <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                        Documents
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
                                <CentralAgencyCaseUpdateDocuments />
                            </AccordionDetails>
                        </Accordion>

                        {/* Accordion 4: F.O Update */}
                        <Accordion
                            expanded={expandedAccordion === 'panel4'}
                            onChange={handleAccordionChange('panel4')}
                            sx={accordionSx}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel4-content"
                                id="panel4-header"
                                sx={summaryIconSx}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Update sx={{ color: '#3B82F6' }} />
                                    <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                        F.O Updates
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
                                <Box>
                                    {reworkCaseComments && reworkCaseComments !== '' && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography component="span" sx={{ color: '#776BC5', fontWeight: 700 }}>
                                                Comments:
                                            </Typography>
                                            <Typography component="span" sx={{ fontWeight: 700, ml: 1 }}>
                                                {reworkCaseComments}
                                            </Typography>
                                        </Box>
                                    )}
                                    <Preview buttonVisible={true} />
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        {/* Accordion 5: Agency QC */}
                        <Accordion
                            expanded={expandedAccordion === 'panel5'}
                            onChange={handleAccordionChange('panel5')}
                            sx={accordionSx}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel5-content"
                                id="panel5-header"
                                sx={summaryIconSx}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <FactCheck sx={{ color: '#3B82F6' }} />
                                    <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
                                        Agency QC
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
                                <QCUpdates editable={true} />
                            </AccordionDetails>
                        </Accordion>

                        {/* Accordion 6: QC Update */}
                        <Accordion
                            expanded={expandedAccordion === 'panel6'}
                            onChange={handleAccordionChange('panel6')}
                            sx={accordionSx}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel6-content"
                                id="panel6-header"
                                sx={summaryIconSx}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <FactCheck sx={{ color: '#3B82F6' }} />
                                    <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
                                        QC Update
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
                                <QCUpdateCentral
                                    dataRole={regDataRole}
                                    buttonEnable={buttonEnable}
                                />
                            </AccordionDetails>
                        </Accordion>

                        {/* Accordion 7: Logs */}
                        <Accordion
                            expanded={expandedAccordion === 'panel7'}
                            onChange={handleAccordionChange('panel7')}
                            sx={accordionSx}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel7-content"
                                id="panel7-header"
                                sx={summaryIconSx}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <History sx={{ color: '#3B82F6' }} />
                                    <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
                                        Logs
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 2, backgroundColor: '#FFFFFF' }}>
                                <Logs claimsType={claimsType} />
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default QCPendingFromCentralForms;