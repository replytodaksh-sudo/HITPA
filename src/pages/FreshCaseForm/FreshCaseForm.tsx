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
//     ReplySharp,
// } from '@mui/icons-material';
// import PreAuth from '../../components/sharedComponents/components/PreAuth';
// import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
// import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
// import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
// import AcceptDeny from '../../components/sharedComponents/components/AcceptDeny';
// import Logs from '../../components/sharedComponents/components/Logs';
// import { claimsService } from '../../services/claims.service';

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
//             id={`case-tabpanel-${index}`}
//             aria-labelledby={`case-tab-${index}`}
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

// const FreshCaseForm: React.FC = () => {
//     const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
//     const [searchParams] = useSearchParams();

//     const [activeTab, setActiveTab] = useState<number>(0);
//     const [investigationId, setInvestigationId] = useState<string>('');
//     const [claimDetails, setClaimDetails] = useState<any>(null);

//     // Extract query parameters
//     const claimsType = searchParams.get('claimsType') || 'cashless';
//     const claimNo = searchParams.get('claimNo') || '';
//     const sbiclaimNo = searchParams.get('sbigclaimno') || '';
//     const acceptAssId = searchParams.get('acceptAssId') || '';
//     const invesType = searchParams.get('invsType') || '';
//     const invesSubType = searchParams.get('invsSubType') || '';

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
//     }, [paramInvestigationId, paramInvestigationId]);

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
//                 <ClaimDetailsReim claimDetails={claimDetails} claimsType={claimsType} />
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
//                 <AcceptDeny
//                     claimType={claimsType}
//                     accid={acceptAssId}
//                     invsid={investigationId!}
//                     invesType={invesType}
//                     invesSubType={invesSubType}
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
//                             background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
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
//                             background: 'linear-gradient(to bottom, #F8FAFC 0%, #FFFFFF 100%)',
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
//                                         color: 'primary.main',
//                                         background: 'rgba(103, 126, 234, 0.05)',
//                                     },
//                                     '&.Mui-selected': {
//                                         color: 'primary.main',
//                                     },
//                                 },
//                                 '& .MuiTabs-indicator': {
//                                     height: '3px',
//                                     borderRadius: '3px 3px 0 0',
//                                     background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
//                                 },
//                             }}
//                         >
//                             {tabs.map((tab, index) => (
//                                 <Tab
//                                     key={index}
//                                     label={tab.label}
//                                     icon={tab.icon}
//                                     iconPosition="start"
//                                     id={`case-tab-${index}`}
//                                     aria-controls={`case-tabpanel-${index}`}
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

// export default FreshCaseForm;

// File: src/components/FreshCaseForm.tsx
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
    Description,
    LocalHospital,
    Info,
    CheckCircle,
    History,
    Assignment,
    ExpandMore as ExpandMoreIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import AcceptDeny from '../../components/sharedComponents/components/AcceptDeny';
import Logs from '../../components/sharedComponents/components/Logs';
import { claimsService } from '../../services/claims.service';

const FreshCaseForm: React.FC = () => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [acceptDenyDialogOpen, setAcceptDenyDialogOpen] = useState(false);
    const [investigationId, setInvestigationId] = useState<string>('');
    const [claimDetails, setClaimDetails] = useState<any>(null);

    // Extract query parameters
    const claimsType = searchParams.get('claimsType') || 'cashless';
    const claimNo = searchParams.get('claimNo') || '';
    const sbiclaimNo = searchParams.get('sbigclaimno') || '';
    const acceptAssId = searchParams.get('acceptAssId') || '';
    const invesType = searchParams.get('invsType') || '';
    const invesSubType = searchParams.get('invsSubType') || '';

    const claimsTypeLabel = claimsType === 'cashless'
        ? 'Cashless'
        : claimsType === 'reim'
            ? 'Reimbursement'
            : '';

    useEffect(() => {
        if (paramInvestigationId) {
            const cleanId = paramInvestigationId.split(' ')[0];
            setInvestigationId(cleanId);
            fetchClaimDetails(cleanId);
        }
    }, [paramInvestigationId]);

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

    const handleAcceptDenyClick = () => {
        setAcceptDenyDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setAcceptDenyDialogOpen(false);
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
                                    <Typography variant="body2" sx={{ fontWeight: 600, color:"#f9f9f9" }}>
                                        Investigation No:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 400, color:"#f9f9f9" }}>
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
                            <Grid size={{xs:12, md:4}}>
                                <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color:"#f9f9f9" }}>
                                        Claim No:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 400, color:"#f9f9f9" }}>
                                        {sbiclaimNo || '-'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{xs:12, md:4}}>
                                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color:"#f9f9f9" }}>
                                        TPA Claim No:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 400, color:"#f9f9f9" }}>
                                        {claimNo || '-'}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Content Area */}
                    <Box sx={{ p: 3, bgcolor: '#F5F7FA' }}>
                        {/* Accept/Deny Button at Top */}
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<CheckCircle />}
                                onClick={handleAcceptDenyClick}
                                sx={{
                                    bgcolor: '#10B981',
                                    color: 'white',
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: 2,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    height: '40px',
                                    textTransform: 'none',
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

                        {/* Accordion Sections */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Pre-Auth / Claim Details Accordion */}
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
                                            {claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details'}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    {claimsType === 'cashless' ? (
                                        <PreAuth claimDetails={claimDetails} />
                                    ) : (
                                        <ClaimDetailsReim claimDetails={claimDetails} claimsType={claimsType} />
                                    )}
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
                                    <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />
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

                            {/* Logs Accordion */}
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

            {/* Accept/Deny Dialog */}
            <Dialog
                open={acceptDenyDialogOpen}
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
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: '#E0F2FE',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircle sx={{ color: '#3B82F6' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B' }}>
                            Accept / Deny
                        </Typography>
                    </Box>
                    <IconButton onClick={handleCloseDialog} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    <AcceptDeny
                        claimType={claimsType}
                        accid={acceptAssId}
                        invsid={investigationId}
                        invesType={invesType}
                        invesSubType={invesSubType}
                    />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default FreshCaseForm;