// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import {
//     Box,
//     Container,
//     Paper,
//     Tabs,
//     Tab,
//     Typography,
//     Chip,
//     Divider,
// } from '@mui/material';
// import PreAuth from '../../components/sharedComponents/components/PreAuth';
// import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
// import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
// import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
// import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
// import Logs from '../../components/sharedComponents/components/Logs';
// import claimsService from '../../services/claims.service';
// import CaseUpdateForm from '../../components/sharedComponents/components/CashlessCaseUpdate';
// import AgencyReassignCaseUpdateReim from '../../components/sharedComponents/components/AgencyReassignCaseUpdateReim';
// import RegionalSelfDenied from '../../components/sharedComponents/components/RegionalSelfDenied';

// interface AgencyCaseNotInvestigatedTabsProps {
//     // No props needed - gets data from URL params
// }

// const AgencyCaseNotInvestigatedTabs: React.FC<AgencyCaseNotInvestigatedTabsProps> = () => {
//     const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
//     const [searchParams] = useSearchParams();

//     // State
//     const [activeTab, setActiveTab] = useState(0);
//     const [investigationId, setInvestigationId] = useState('');
//     const [claimsType, setClaimsType] = useState('');
//     const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
//     const [claimNo, setClaimNo] = useState('');
//     const [sbigClaimNo, setSbigClaimNo] = useState('');
//     const [claimDetails, setClaimDetails] = useState<any>(null);

//     useEffect(() => {
//         // Get query params
//         const type = searchParams.get('claimsType') || '';
//         const tpaClaimNo = searchParams.get('claimNo') || '';
//         const sbigNo = searchParams.get('sbigclaimno') || '';

//         setClaimsType(type);
//         setClaimNo(tpaClaimNo);
//         setSbigClaimNo(sbigNo);

//         // Set claims type label
//         const label = type === 'cashless' ? 'Cashless' : type === 'reim' ? 'Reimbursement' : '';
//         setClaimsTypeLabel(label);

//         // Get investigation ID
//         if (paramInvestigationId) {
//             const cleanedId = paramInvestigationId.split(' ')[0];
//             setInvestigationId(cleanedId);
//             fetchClaimDetails(cleanedId);
//         }
//     }, [paramInvestigationId, searchParams]);

//     const fetchClaimDetails = async (invId: string) => {
//         // setLoading(true);
//         try {
//             const response = await claimsService.claimDetails(invId);
//             if (response.statusCode === 0) {
//                 setClaimDetails(response.payload);
//                 sessionStorage.setItem('formEditable', response.payload.editable);
//                 sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
//             }
//         } catch (error) {
//             console.error('Error fetching claim details:', error);
//         }
//     };

//     const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//         setActiveTab(newValue);
//     };

//     return (
//         <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
//             <Paper elevation={3} sx={{ p: 3 }}>
//                 {/* Header with Investigation Details */}
//                 <Box sx={{ mb: 3 }}>
//                     <Box
//                         sx={{
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             mb: 2
//                         }}
//                     >
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                             <Typography variant="body1">
//                                 <strong>Investigation No:</strong> {investigationId}
//                             </Typography>
//                             <Chip
//                                 label={claimsTypeLabel}
//                                 color="warning"
//                                 size="small"
//                                 sx={{ fontWeight: 600 }}
//                             />
//                         </Box>
//                         <Typography variant="body1">
//                             <strong>Claim No:</strong> {sbigClaimNo}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>TPA Claim No:</strong> {claimNo}
//                         </Typography>
//                     </Box>
//                 </Box>

//                 <Divider sx={{ mb: 3 }} />

//                 {/* Tabs */}
//                 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                     <Tabs
//                         value={activeTab}
//                         onChange={handleTabChange}
//                         variant="scrollable"
//                         scrollButtons="auto"
//                         sx={{
//                             '& .MuiTab-root': {
//                                 minHeight: 64,
//                                 textTransform: 'none',
//                                 fontSize: '0.95rem',
//                                 fontWeight: 500,
//                             },
//                         }}
//                     >
//                         {claimsType === 'cashless' && (
//                             <Tab label="Pre-Auth Details" />
//                         )}
//                         {claimsType === 'reim' && (
//                             <Tab label="Claim Details" />
//                         )}
//                         <Tab label="Insured & Hospital Details" />
//                         <Tab label="Case Info" />
//                         <Tab label="Accept / Deny" />
//                         <Tab label="Logs" />
//                     </Tabs>
//                 </Box>

//                 <Box sx={{ pt: 3 }}>
//                     {activeTab === 0 && claimsType === 'cashless' && (
//                         <PreAuth
//                             claimDetails={claimDetails}
//                         />
//                     )}
//                     {activeTab === 0 && claimsType === 'reim' && (
//                         <ClaimDetailsReim
//                             claimDetails={claimDetails}
//                             claimsType={claimsType}
//                         />
//                     )}

//                     {activeTab === 1 && (
//                         <HospitalInfo
//                             claimDetails={claimDetails}
//                             claimsType={claimsType}
//                         />
//                     )}

//                     {activeTab === 2 && (
//                         <CaseInfoComponent
//                         />
//                     )}

//                     {activeTab === 3 && (
//                         <RegionalSelfDenied claimType={claimsType}/>
//                     )}

//                     {activeTab === 4 && (
//                         <Logs
//                             claimsType={claimsType}
//                         />
//                     )}
//                 </Box>
//             </Paper>
//         </Container>
//     );
// };

// export default AgencyCaseNotInvestigatedTabs;





import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Description as DescriptionIcon,
    LocalHospital as HospitalIcon,
    Info as InfoIcon,
    CheckCircle as CheckCircleIcon,
    History as HistoryIcon,
    Assignment as AssignmentIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import Logs from '../../components/sharedComponents/components/Logs';
import claimsService from '../../services/claims.service';
import RegionalSelfDenied from '../../components/sharedComponents/components/RegionalSelfDenied';

const AgencyCaseNotInvestigatedTabs: React.FC = () => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [investigationId, setInvestigationId] = useState('');
    const [claimsType, setClaimsType] = useState('');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
    const [claimNo, setClaimNo] = useState('');
    const [sbigClaimNo, setSbigClaimNo] = useState('');
    const [claimDetails, setClaimDetails] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);

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

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

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
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Investigation No:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400 }}>
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
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Claim No:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400 }}>
                                    {sbigClaimNo || '-'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    TPA Claim No:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400 }}>
                                    {claimNo || '-'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <CardContent sx={{ p: 3 }}>
                    {/* Accept/Deny Button at Top */}
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start' }}>
                        <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={handleOpenDialog}
                            sx={{
                                bgcolor: '#10B981',
                                color: 'white',
                                py: 1.5,
                                px: 4,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                '&:hover': {
                                    bgcolor: '#059669',
                                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
                                },
                            }}
                        >
                            Accept / Deny
                        </Button>
                    </Box>

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
                            <HospitalInfo claimDetails={claimDetails} claimsType={claimsType} />
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

                    {/* Accordion 4: Logs */}
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

            {/* Accept/Deny Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        maxHeight: '90vh',
                    },
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
                        py: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircleIcon sx={{ color: '#10B981' }} />
                        <span>Accept / Deny</span>
                    </Box>
                    <IconButton
                        onClick={handleCloseDialog}
                        size="small"
                        sx={{
                            color: '#64748B',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    <RegionalSelfDenied claimType={claimsType} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default AgencyCaseNotInvestigatedTabs;