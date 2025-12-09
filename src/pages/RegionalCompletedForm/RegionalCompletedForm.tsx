import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Tabs,
    Tab,
    Typography,
    Alert,
    Link,
    Divider
} from '@mui/material';
import { QCUpdateService } from '../../services/qcupdate.service';
import { agencyQcUpdateService } from '../../services/agencyqcupdate.service';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import Logs from '../../components/sharedComponents/components/Logs';
import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import RegQcUpdateFields from '../../components/sharedComponents/components/RegQcUpdateFields';
import RegQcObservations from '../../components/sharedComponents/components/RegQcObservations';


// Payment URL - Update with your environment config
// const PAYMENT_URL = process.env.REACT_APP_PAYMENT_LINK || 'https://payment.example.com';
const PAYMENT_URL = 'https://payment.example.com';

interface RegionalCompletedFormProps {
    // No props needed - gets data from URL params
}

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

const RegionalCompletedForm: React.FC<RegionalCompletedFormProps> = () => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [activeTab, setActiveTab] = useState(0);
    const [roleName, setRoleName] = useState('');
    const [claimsType, setClaimsType] = useState('');
    const [claimDetails, setClaimDetails] = useState<ClaimDetails | null>(null);
    const [qcData, setQCData] = useState<QCData | null>(null);
    const [loading, setLoading] = useState(true);

    // Display states
    const [displayMakePayment, setDisplayMakePayment] = useState('none');
    const [buttonEnable, setButtonEnable] = useState(false);
    const [agencyQcForm, setAgencyQcForm] = useState('block');
    const [agencyQcFormEditable, setAgencyQcFormEditable] = useState(true);
    const [notDisplayMessage, setNotDisplayMessage] = useState(false);
    const [previewRefresh, setPreviewRefresh] = useState(false);

    // Constants for roles
    const regDataRole = 'regional';
    const cenDataRole = 'central';

    useEffect(() => {
        // Get role from session
        const role = sessionStorage.getItem('roleName') || '';
        setRoleName(role);

        // Get claims type from query params
        const type = searchParams.get('claimsType') || '';
        setClaimsType(type);

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

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleMakePayment = () => {
        window.open(`${PAYMENT_URL}?investigationId=${investigationId}`, '_blank');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Make Payment Link */}
            {displayMakePayment === 'block' && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mr: 1 }}>
                    <Link
                        component="button"
                        onClick={handleMakePayment}
                        sx={{
                            color: '#776BC5',
                            fontWeight: 700,
                            textDecoration: 'none',
                            cursor: 'pointer',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        Make payment
                    </Link>
                </Box>
            )}

            {/* Alert Message for Regional Manager */}
            {notDisplayMessage && roleName === 'Regional Manager' && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    QC form is not available for this case.
                </Alert>
            )}

            <Paper elevation={3}>
                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': {
                                minHeight: 64,
                                textTransform: 'none',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                            },
                        }}
                    >
                        <Tab label="Pre-Auth Details" />
                        <Tab label="Insured & Hospital Details" />
                        <Tab label="Documents" />
                        <Tab label="F.O Updates" />
                        <Tab label="Reg. QC Updates" />
                        <Tab label="Logs" />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={{ p: 3 }}>
                    {/* Tab 0: Pre-Auth Details */}
                    {activeTab === 0 && (
                        <PreAuth
                            claimDetails={claimDetails}
                        // claimsType={claimsType}
                        //   investigationId={investigationId || ''}
                        />
                    )}

                    {/* Tab 1: Insured & Hospital Details */}
                    {activeTab === 1 && (
                        <HospitalInfo
                            claimDetails={claimDetails}
                            claimsType={claimsType}
                        //   investigationId={investigationId || ''}
                        //   isFormEditable={false}
                        //   onNextPage={() => {}}
                        />
                    )}

                    {/* Tab 2: Documents */}
                    {activeTab === 2 && (
                        <CentralRegionalDocuments
                        //   investigationId={investigationId || ''}
                        />
                    )}

                    {/* Tab 3: F.O Updates */}
                    {activeTab === 3 &&
                        claimsType === 'cashless' ? (
                        <CentralAssignedAgencyCaseUpdate />
                    ) : (
                        <ReimburseCaseUpdate buttonEnable={true} />
                    )
                    }

                    {/* Tab 4: Reg. QC Updates */}
                    {activeTab === 4 && (
                        <Box sx={{ display: agencyQcForm }}>
                            {qcData && (
                                <>
                                    <RegQcUpdateFields
                                    // investigationId={investigationId || ''}
                                    // isFormEditable={agencyQcFormEditable}
                                    // previousData={qcData}
                                    // onNextPage={() => setPreviewRefresh(!previewRefresh)}
                                    />

                                    <Divider sx={{ my: 3 }} />

                                    <RegQcObservations
                                    // investigationId={investigationId || ''}
                                    />
                                </>
                            )}
                        </Box>
                    )}

                    {/* Tab 5: Logs */}
                    {activeTab === 5 && (
                        <Logs
                            claimsType={claimsType}
                        // investigationId={investigationId || ''}
                        />
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default RegionalCompletedForm;