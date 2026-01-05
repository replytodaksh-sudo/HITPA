// // File: src/components/AgencyDeniedFormTabs.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import {
//     Box,
//     Card,
//     CardContent,
//     Container,
//     Tabs,
//     Tab,
//     Typography,
//     Chip,
//     Grid,
// } from '@mui/material';
// import {
//     Description,
//     LocalHospital,
//     Info,
//     CheckCircle,
//     History,
//     Assignment,
// } from '@mui/icons-material';
// import PreAuth from '../../components/sharedComponents/components/PreAuth';
// import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
// import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
// import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
// import Logs from '../../components/sharedComponents/components/Logs';
// import { claimsService } from '../../services/claims.service';
// import AgencyDeniedAcceptDeny from '../../components/sharedComponents/components/AgencyDeniedAcceptDeny';
// // Import child components (same as FreshCaseForm)

// interface TabPanelProps {
//     children?: React.ReactNode;
//     index: number;
//     value: number;
// }

// const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`denied-tabpanel-${index}`}
//             aria-labelledby={`denied-tab-${index}`}
//         >
//             {value === index && (
//                 <Box
//                     sx={{
//                         py: 3,
//                         animation: 'fadeIn 0.3s ease-in',
//                         '@keyframes fadeIn': {
//                             from: { opacity: 0, transform: 'translateY(10px)' },
//                             to: { opacity: 1, transform: 'translateY(0)' },
//                         },
//                     }}
//                 >
//                     {children}
//                 </Box>
//             )}
//         </div>
//     );
// };

// const AgencyDeniedFormTabs: React.FC = () => {
//     const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
//     const [searchParams] = useSearchParams();

//     const [activeTab, setActiveTab] = useState<number>(0);
//     const [investigationId, setInvestigationId] = useState<string>('');
//     const [claimDetails, setClaimDetails] = useState<any>(null);

//     // Extract query parameters
//     const claimsType = searchParams.get('claimsType') || 'cashless';
//     const claimNo = searchParams.get('claimNo') || '';
//     const sbiclaimNo = searchParams.get('sbigclaimno') || '';
//     const acceptAssignId = searchParams.get('acceptAssId') || '';

//     const claimsTypeLabel = claimsType === 'cashless'
//         ? 'Cashless'
//         : claimsType === 'reim'
//             ? 'Reimbursement'
//             : '';

//     useEffect(() => {
//         if (paramInvestigationId) {
//             // Extract investigation ID (remove any trailing spaces/text)
//             const cleanId = paramInvestigationId.split(' ')[0];
//             setInvestigationId(cleanId);
//             fetchClaimDetails(cleanId);
//         }
//     }, [paramInvestigationId]);

//     const fetchClaimDetails = async (invId: string) => {
//         // setLoading(true);
//         try {
//             const response = await claimsService.claimDetails(invId);
//             if (response.statusCode === 0) {
//                 console.log("ppppp", response.payload)
//                 setClaimDetails(response.payload);
//                 sessionStorage.setItem('formEditable', response.payload.editable);
//                 sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
//             }
//         } catch (error) {
//             console.error('Error fetching claim details:', error);
//         } finally {
//             // setLoading(false);
//         }
//     };

//     const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//         setActiveTab(newValue);
//     };

//     // Define tabs based on claims type
//     const tabs = [
//         {
//             label: claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details',
//             icon: <Description />,
//             component: claimsType === 'cashless' ? (
//                 <PreAuth claimDetails={claimDetails} />
//             ) : (
//                 <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails} />
//             ),
//         },
//         {
//             label: 'Insured & Hospital Details',
//             icon: <LocalHospital />,
//             component: <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />,
//         },
//         {
//             label: 'Case Info',
//             icon: <Info />,
//             component: <CaseInfoComponent />,
//         },
//         {
//             label: 'Accept / Deny',
//             icon: <CheckCircle />,
//             component: (
//                 <AgencyDeniedAcceptDeny
//                     claimType={claimsType}
//                     acceptAssignId={acceptAssignId}
//                 />
//             ),
//         },
//         {
//             label: 'Logs',
//             icon: <History />,
//             component: <Logs claimsType={claimsType} />,
//         },
//     ];

//     return (
//         <Container maxWidth={false} sx={{ py: 3 }}>
//             <Card
//                 sx={{
//                     borderRadius: 3,
//                     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
//                     overflow: 'visible',
//                 }}
//             >
//                 <CardContent sx={{ p: 0 }}>
//                     {/* Header Section */}
//                     <Box
//                         sx={{
//                             p: 3,
//                             background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
//                             color: 'white',
//                             borderRadius: '12px 12px 0 0',
//                         }}
//                     >
//                         <Grid container spacing={2} alignItems="center">
//                             <Grid size={{ xs: 12, md: 4 }}>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
//                                     <Assignment sx={{ fontSize: 20 }} />
//                                     <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                                         Investigation No:
//                                     </Typography>
//                                     <Typography variant="body2" sx={{ fontWeight: 400 }}>
//                                         {investigationId}
//                                     </Typography>
//                                     <Chip
//                                         label={claimsTypeLabel}
//                                         size="small"
//                                         sx={{
//                                             background: 'rgba(255, 255, 255, 0.2)',
//                                             color: 'white',
//                                             fontWeight: 600,
//                                             backdropFilter: 'blur(10px)',
//                                         }}
//                                     />
//                                 </Box>
//                             </Grid>
//                             <Grid size={{ xs: 12, md: 4 }}>
//                                 <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
//                                     <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                                         Claim No:
//                                     </Typography>
//                                     <Typography variant="body2" sx={{ fontWeight: 400 }}>
//                                         {sbiclaimNo || '-'}
//                                     </Typography>
//                                 </Box>
//                             </Grid>
//                             <Grid size={{ xs: 12, md: 4 }}>
//                                 <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
//                                     <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                                         TPA Claim No:
//                                     </Typography>
//                                     <Typography variant="body2" sx={{ fontWeight: 400 }}>
//                                         {claimNo || '-'}
//                                     </Typography>
//                                 </Box>
//                             </Grid>
//                         </Grid>
//                     </Box>

//                     {/* Tabs Section */}
//                     <Box
//                         sx={{
//                             borderBottom: 1,
//                             borderColor: 'divider',
//                             background: 'linear-gradient(to bottom, #FEF2F2 0%, #FFFFFF 100%)',
//                         }}
//                     >
//                         <Tabs
//                             value={activeTab}
//                             onChange={handleTabChange}
//                             variant="scrollable"
//                             scrollButtons="auto"
//                             sx={{
//                                 px: 2,
//                                 '& .MuiTab-root': {
//                                     fontSize: '0.875rem',
//                                     fontWeight: 600,
//                                     textTransform: 'none',
//                                     minHeight: '64px',
//                                     color: 'text.secondary',
//                                     transition: 'all 0.3s ease',
//                                     '&:hover': {
//                                         color: 'error.main',
//                                         background: 'rgba(239, 68, 68, 0.05)',
//                                     },
//                                     '&.Mui-selected': {
//                                         color: 'error.main',
//                                     },
//                                 },
//                                 '& .MuiTabs-indicator': {
//                                     height: '3px',
//                                     borderRadius: '3px 3px 0 0',
//                                     background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
//                                 },
//                             }}
//                         >
//                             {tabs.map((tab, index) => (
//                                 <Tab
//                                     key={index}
//                                     label={tab.label}
//                                     icon={tab.icon}
//                                     iconPosition="start"
//                                     id={`denied-tab-${index}`}
//                                     aria-controls={`denied-tabpanel-${index}`}
//                                 />
//                             ))}
//                         </Tabs>
//                     </Box>

//                     {/* Tab Panels */}
//                     <Box sx={{ px: 3 }}>
//                         {tabs.map((tab, index) => (
//                             <TabPanel key={index} value={activeTab} index={index}>
//                                 {tab.component}
//                             </TabPanel>
//                         ))}
//                     </Box>
//                 </CardContent>
//             </Card>
//         </Container>
//     );
// };

// export default AgencyDeniedFormTabs;

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
import { claimsService } from '../../services/claims.service';
import AgencyDeniedAcceptDeny from '../../components/sharedComponents/components/AgencyDeniedAcceptDeny';

const AgencyDeniedFormTabs: React.FC = () => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [investigationId, setInvestigationId] = useState<string>('');
    const [claimDetails, setClaimDetails] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);

    // Extract query parameters
    const claimsType = searchParams.get('claimsType') || 'cashless';
    const claimNo = searchParams.get('claimNo') || '';
    const sbiclaimNo = searchParams.get('sbigclaimno') || '';
    const acceptAssignId = searchParams.get('acceptAssId') || '';

    const claimsTypeLabel = claimsType === 'cashless'
        ? 'Cashless'
        : claimsType === 'reim'
            ? 'Reimbursement'
            : '';

    useEffect(() => {
        if (paramInvestigationId) {
            // Extract investigation ID (remove any trailing spaces/text)
            const cleanId = paramInvestigationId.split(' ')[0];
            setInvestigationId(cleanId);
            fetchClaimDetails(cleanId);
        }
    }, [paramInvestigationId]);

    const fetchClaimDetails = async (invId: string) => {
        try {
            const response = await claimsService.claimDetails(invId);
            if (response.statusCode === 0) {
                console.log("ppppp", response.payload);
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
        <Box sx={{ p: 3, bgcolor: '#FEF2F2', minHeight: '100vh' }}>
            <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {/* Red Gradient Header for Denied Cases */}
                <Box
                    sx={{
                        p: 3,
                        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                        color: 'white',
                        borderRadius: '12px 12px 0 0',
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <AssignmentIcon sx={{ fontSize: 20 }} />
                                <Typography variant="body2" sx={{ fontWeight: 600, color:"#fff" }}>
                                    Investigation No:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400, color:"#fff" }}>
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
                                <Typography variant="body2" sx={{ fontWeight: 600, color:"#fff" }}>
                                    Claim No:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400, color:"#fff" }}>
                                    {sbiclaimNo || '-'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color:"#fff" }}>
                                    TPA Claim No:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400, color:"#fff" }}>
                                    {claimNo || '-'}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <CardContent sx={{ p: 3 }}>
                    {/* Accept/Deny Button at Top */}
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={handleOpenDialog}
                            sx={{
                                bgcolor: '#EF4444',
                                color: 'white',
                                py: 1.5,
                                px: 4,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                '&:hover': {
                                    bgcolor: '#DC2626',
                                    boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)',
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
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                bgcolor: '#FEE2E2',
                                borderRadius: 2,
                                '&:hover': { bgcolor: '#FECACA' },
                                minHeight: 56,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <DescriptionIcon sx={{ color: '#DC2626' }} />
                                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                                    {claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details'}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
                            {claimsType === 'cashless' ? (
                                <PreAuth claimDetails={claimDetails} />
                            ) : (
                                <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails} />
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
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                bgcolor: '#FEE2E2',
                                borderRadius: 2,
                                '&:hover': { bgcolor: '#FECACA' },
                                minHeight: 56,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <HospitalIcon sx={{ color: '#DC2626' }} />
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
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                bgcolor: '#FEE2E2',
                                borderRadius: 2,
                                '&:hover': { bgcolor: '#FECACA' },
                                minHeight: 56,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <InfoIcon sx={{ color: '#DC2626' }} />
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
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                bgcolor: '#FEE2E2',
                                borderRadius: 2,
                                '&:hover': { bgcolor: '#FECACA' },
                                minHeight: 56,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <HistoryIcon sx={{ color: '#DC2626' }} />
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
                        bgcolor: '#FEE2E2',
                        color: '#0F172A',
                        fontWeight: 600,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircleIcon sx={{ color: '#EF4444' }} />
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
                    <AgencyDeniedAcceptDeny
                        claimType={claimsType}
                        acceptAssignId={acceptAssignId}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default AgencyDeniedFormTabs;