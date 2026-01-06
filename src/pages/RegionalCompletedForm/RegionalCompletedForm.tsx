// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import {
//     Box,
//     Container,
//     Paper,
//     Tabs,
//     Tab,
//     Typography,
//     Alert,
//     Link,
//     Divider
// } from '@mui/material';
// import { QCUpdateService } from '../../services/qcupdate.service';
// import { agencyQcUpdateService } from '../../services/agencyqcupdate.service';
// import PreAuth from '../../components/sharedComponents/components/PreAuth';
// import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
// import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
// import Logs from '../../components/sharedComponents/components/Logs';
// import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';
// import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
// import RegQcUpdateFields from '../../components/sharedComponents/components/RegQcUpdateFields';
// import RegQcObservations from '../../components/sharedComponents/components/RegQcObservations';


// // Payment URL - Update with your environment config
// // const PAYMENT_URL = process.env.REACT_APP_PAYMENT_LINK || 'https://payment.example.com';
// const PAYMENT_URL = 'https://payment.example.com';

// interface RegionalCompletedFormProps {
//     // No props needed - gets data from URL params
// }

// interface ClaimDetails {
//     investigationId: string;
//     claimsType: string;
//     noDataStatus: 'Editable' | 'NonEditable' | 'NotToOpenForm';
//     // ... other claim details
// }

// interface QCData {
//     noDataStatus: 'Editable' | 'NonEditable' | 'NotToOpenForm';
//     // ... other QC data
// }

// const RegionalCompletedForm: React.FC<RegionalCompletedFormProps> = () => {
//     const { investigationId } = useParams<{ investigationId: string }>();
//     const [searchParams] = useSearchParams();

//     // State
//     const [activeTab, setActiveTab] = useState(0);
//     const [roleName, setRoleName] = useState('');
//     const [claimsType, setClaimsType] = useState('');
//     const [claimDetails, setClaimDetails] = useState<ClaimDetails | null>(null);
//     const [qcData, setQCData] = useState<QCData | null>(null);
//     const [loading, setLoading] = useState(true);

//     // Display states
//     const [displayMakePayment, setDisplayMakePayment] = useState('none');
//     const [buttonEnable, setButtonEnable] = useState(false);
//     const [agencyQcForm, setAgencyQcForm] = useState('block');
//     const [agencyQcFormEditable, setAgencyQcFormEditable] = useState(true);
//     const [notDisplayMessage, setNotDisplayMessage] = useState(false);
//     const [previewRefresh, setPreviewRefresh] = useState(false);

//     // Constants for roles
//     const regDataRole = 'regional';
//     const cenDataRole = 'central';

//     useEffect(() => {
//         // Get role from session
//         const role = sessionStorage.getItem('roleName') || '';
//         setRoleName(role);

//         // Get claims type from query params
//         const type = searchParams.get('claimsType') || '';
//         setClaimsType(type);

//         // Fetch data
//         if (investigationId) {
//             fetchClaimDetails(investigationId);
//         }
//     }, [investigationId, searchParams]);

//     const fetchClaimDetails = async (invId: string) => {
//         try {
//             setLoading(true);
//             const response = await QCUpdateService.qcUpdatePreview(invId, 'regionalQC');

//             if (response.statusCode === 0) {
//                 setClaimDetails(response.payload);

//                 // Determine display logic for Central Manager
//                 if (roleName === 'Central Manager') {
//                     if (response.payload.noDataStatus === 'NonEditable') {
//                         setDisplayMakePayment('block');
//                         setButtonEnable(false);
//                     } else if (response.payload.noDataStatus === 'Editable') {
//                         setDisplayMakePayment('block');
//                         setButtonEnable(true);
//                     } else {
//                         setDisplayMakePayment('none');
//                     }
//                 } else {
//                     setDisplayMakePayment('none');
//                 }

//                 // Fetch QC data
//                 fetchQCData(invId);
//             }
//         } catch (error) {
//             console.error('Error fetching claim details:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchQCData = async (invId: string) => {
//         try {
//             let tabName = '';
//             if (sessionStorage.getItem('roleName') === 'Regional Manager') {
//                 tabName = 'regionalQC';
//             } else if (sessionStorage.getItem('roleName') === 'Central Manager') {
//                 tabName = 'centralQC';
//             }

//             const response = await agencyQcUpdateService.getQCUpdateData(invId, tabName);

//             if (response.statusCode === 0) {
//                 setQCData(response.payload);

//                 // Form display logic for Regional Manager
//                 if (sessionStorage.getItem('roleName') === 'Regional Manager') {
//                     if (response.payload.noDataStatus === 'NotToOpenForm') {
//                         setAgencyQcForm('none');
//                         setNotDisplayMessage(true);
//                     } else if (response.payload.noDataStatus === 'NonEditable') {
//                         setAgencyQcForm('block');
//                         setAgencyQcFormEditable(false);
//                     }
//                 }
//             }
//         } catch (error) {
//             console.error('Error fetching QC data:', error);
//         }
//     };

//     const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//         setActiveTab(newValue);
//     };

//     const handleMakePayment = () => {
//         window.open(`${PAYMENT_URL}?investigationId=${investigationId}`, '_blank');
//     };

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//                 <Typography>Loading...</Typography>
//             </Box>
//         );
//     }
// console.log('tabbbbb:', activeTab);
//     return (
//         <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
//             {/* Make Payment Link */}
//             {displayMakePayment === 'block' && (
//                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mr: 1 }}>
//                     <Link
//                         component="button"
//                         onClick={handleMakePayment}
//                         sx={{
//                             color: '#776BC5',
//                             fontWeight: 700,
//                             textDecoration: 'none',
//                             cursor: 'pointer',
//                             '&:hover': {
//                                 textDecoration: 'underline'
//                             }
//                         }}
//                     >
//                         Make payment
//                     </Link>
//                 </Box>
//             )}

//             {/* Alert Message for Regional Manager */}
//             {notDisplayMessage && roleName === 'Regional Manager' && (
//                 <Alert severity="info" sx={{ mb: 2 }}>
//                     QC form is not available for this case.
//                 </Alert>
//             )}

//             <Paper elevation={3}>
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
//                         <Tab label="Pre-Auth Details" />
//                         <Tab label="Insured & Hospital Details" />
//                         <Tab label="Documents" />
//                         <Tab label="F.O Updates" />
//                         <Tab label="Reg. QC Updates" />
//                         <Tab label="Logs" />
//                     </Tabs>
//                 </Box>

//                 {/* Tab Content */}
//                 <Box sx={{ p: 3 }}>
//                     {/* Tab 0: Pre-Auth Details */}
//                     {activeTab === 0 && (
//                         <PreAuth
//                             claimDetails={claimDetails}
//                         // claimsType={claimsType}
//                         //   investigationId={investigationId || ''}
//                         />
//                     )}

//                     {/* Tab 1: Insured & Hospital Details */}
//                     {activeTab === 1 && (
//                         <HospitalInfo
//                             claimDetails={claimDetails}
//                             claimsType={claimsType}
//                         //   investigationId={investigationId || ''}
//                         //   isFormEditable={false}
//                         //   onNextPage={() => {}}
//                         />
//                     )}

//                     {/* Tab 2: Documents */}
//                     {activeTab === 2 && (
//                         <CentralRegionalDocuments
//                         //   investigationId={investigationId || ''}
//                         />
//                     )}

//                     {/* Tab 3: F.O Updates */}
//                     {activeTab === 3 &&
//                         claimsType === 'cashless' ? (
//                         <CentralAssignedAgencyCaseUpdate />
//                     ) : (
//                         <ReimburseCaseUpdate buttonEnable={true} />
//                     )
//                     }

//                     {/* Tab 4: Reg. QC Updates */}
//                     {activeTab === 4 && (
//                         <Box sx={{ display: agencyQcForm }}>
//                             {qcData && (
//                                 <>
//                                     <RegQcUpdateFields
//                                     // investigationId={investigationId || ''}
//                                     // isFormEditable={agencyQcFormEditable}
//                                     // previousData={qcData}
//                                     // onNextPage={() => setPreviewRefresh(!previewRefresh)}
//                                     />

//                                     <Divider sx={{ my: 3 }} />

//                                     <RegQcObservations
//                                     // investigationId={investigationId || ''}
//                                     />
//                                 </>
//                             )}
//                         </Box>
//                     )}

//                     {/* Tab 5: Logs */}
//                     {activeTab === 5 && (
//                         <Logs
//                             claimsType={claimsType}
//                         // investigationId={investigationId || ''}
//                         />
//                     )}
//                 </Box>
//             </Paper>
//         </Container>
//     );
// };

// export default RegionalCompletedForm;


import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Container,
    Typography,
    Alert,
    Link,
    Grid,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
    Divider,
} from '@mui/material';
import {
    Description,
    LocalHospital,
    Assignment,
    ExpandMore as ExpandMoreIcon,
    UploadFile,
    Update,
    History,
    FactCheck,
    Payment as PaymentIcon,
} from '@mui/icons-material';

// Import services
import { QCUpdateService } from '../../services/qcupdate.service';
import { agencyQcUpdateService } from '../../services/agencyqcupdate.service';

// Import child components
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import Logs from '../../components/sharedComponents/components/Logs';
import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import RegQcUpdateFields from '../../components/sharedComponents/components/RegQcUpdateFields';
import RegQcObservations from '../../components/sharedComponents/components/RegQcObservations';

// Payment URL - Update with your environment config
const PAYMENT_URL = 'https://payment.example.com';

interface ClaimDetails {
    investigationId: string;
    claimsType: string;
    noDataStatus: 'Editable' | 'NonEditable' | 'NotToOpenForm';
    // ... other claim details
}

interface QCData {
    noDataStatus: 'Editable' | 'NonEditable' | 'NotToOpenForm';
    // ... other QC data
}

/**
 * RegionalCompletedForm Component
 * Displays accordion sections for regional completed cases with QC updates
 */
const RegionalCompletedForm: React.FC = () => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [roleName, setRoleName] = useState('');
    const [claimsType, setClaimsType] = useState('');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
    const [claimNo, setClaimNo] = useState('');
    const [sbigClaimNo, setSbigClaimNo] = useState('');
    const [claimDetails, setClaimDetails] = useState<ClaimDetails | null>(null);
    const [qcData, setQCData] = useState<QCData | null>(null);
    const [loading, setLoading] = useState(true);

    // Display states
    const [displayMakePayment, setDisplayMakePayment] = useState('none');
    const [buttonEnable, setButtonEnable] = useState(false);
    const [agencyQcForm, setAgencyQcForm] = useState('block');
    const [agencyQcFormEditable, setAgencyQcFormEditable] = useState(true);
    const [notDisplayMessage, setNotDisplayMessage] = useState(false);

    useEffect(() => {
        // Get role from session
        const role = sessionStorage.getItem('roleName') || '';
        setRoleName(role);

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

        // Fetch data
        if (investigationId) {
            fetchClaimDetails(investigationId);
        }
    }, [investigationId, searchParams]);

    const fetchClaimDetails = async (invId: string) => {
        try {
            setLoading(true);
            const response = await QCUpdateService.qcUpdatePreview(invId, 'regionalQC');

            if (response.statusCode === 0) {
                setClaimDetails(response.payload);

                // Determine display logic for Central Manager
                if (roleName === 'Central Manager') {
                    if (response.payload.noDataStatus === 'NonEditable') {
                        setDisplayMakePayment('block');
                        setButtonEnable(false);
                    } else if (response.payload.noDataStatus === 'Editable') {
                        setDisplayMakePayment('block');
                        setButtonEnable(true);
                    } else {
                        setDisplayMakePayment('none');
                    }
                } else {
                    setDisplayMakePayment('none');
                }

                // Fetch QC data
                fetchQCData(invId);
            }
        } catch (error) {
            console.error('Error fetching claim details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchQCData = async (invId: string) => {
        try {
            let tabName = '';
            if (sessionStorage.getItem('roleName') === 'Regional Manager') {
                tabName = 'regionalQC';
            } else if (sessionStorage.getItem('roleName') === 'Central Manager') {
                tabName = 'centralQC';
            }

            const response = await agencyQcUpdateService.getQCUpdateData(invId, tabName);

            if (response.statusCode === 0) {
                setQCData(response.payload);

                // Form display logic for Regional Manager
                if (sessionStorage.getItem('roleName') === 'Regional Manager') {
                    if (response.payload.noDataStatus === 'NotToOpenForm') {
                        setAgencyQcForm('none');
                        setNotDisplayMessage(true);
                    } else if (response.payload.noDataStatus === 'NonEditable') {
                        setAgencyQcForm('block');
                        setAgencyQcFormEditable(false);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching QC data:', error);
        }
    };

    const handleAccordionChange = (panel: string) => (
        event: React.SyntheticEvent,
        isExpanded: boolean
    ) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleMakePayment = () => {
        window.open(`${PAYMENT_URL}?investigationId=${investigationId}`, '_blank');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading...</Typography>
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
                        {/* Make Payment Link */}
                        {displayMakePayment === 'block' && (
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Link
                                    component="button"
                                    onClick={handleMakePayment}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#10B981',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                            color: '#059669',
                                        },
                                    }}
                                >
                                    <PaymentIcon sx={{ fontSize: 20 }} />
                                    Make payment
                                </Link>
                            </Box>
                        )}

                        {/* Alert Message for Regional Manager */}
                        {notDisplayMessage && roleName === 'Regional Manager' && (
                            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                                QC form is not available for this case.
                            </Alert>
                        )}

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

                            {/* Documents Accordion */}
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

                            {/* FO Updates Accordion */}
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
                                        <Update sx={{ color: '#3B82F6' }} />
                                        <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                            F.O Updates
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    {claimsType === 'cashless' ? (
                                        <CentralAssignedAgencyCaseUpdate />
                                    ) : (
                                        <ReimburseCaseUpdate buttonEnable={true} />
                                    )}
                                </AccordionDetails>
                            </Accordion>

                            {/* Reg. QC Updates Accordion */}
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
                                        <FactCheck sx={{ color: '#3B82F6' }} />
                                        <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                                            Reg. QC Updates
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
                                    {agencyQcForm === 'block' && qcData && (
                                        <>
                                            <RegQcUpdateFields />
                                            <Divider sx={{ my: 3 }} />
                                            <RegQcObservations />
                                        </>
                                    )} 
                                    {agencyQcForm === 'none' && (
                                        <Typography color="text.secondary">
                                            QC form is not available for this case.
                                        </Typography>
                                     )} 
                                </AccordionDetails>
                            </Accordion>

                            {/* Logs Accordion */}
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

export default RegionalCompletedForm;