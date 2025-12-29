import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Container,
    Paper,
    Tabs,
    Tab,
    Typography,
    Chip,
    Divider,
} from '@mui/material';
import Logs from '../../components/sharedComponents/components/Logs';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import { claimsService } from '../../services/claims.service';
import AgencySelfDenied from '../../components/sharedComponents/components/AgencySelfDenied';


interface AgencySelfDeniedFormsProps {
    // No props needed - gets data from URL params
}

const AgencySelfDeniedTabs: React.FC<AgencySelfDeniedFormsProps> = () => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [activeTab, setActiveTab] = useState(0);
    const [investigationId, setInvestigationId] = useState('');
    const [claimsType, setClaimsType] = useState('');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
    const [claimNo, setClaimNo] = useState('');
    const [sbigClaimNo, setSbigClaimNo] = useState('');
    const [claimDetails, setClaimDetails] = useState<any>(null);

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

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const fetchClaimDetails = async (invId: string) => {
        // setLoading(true);
        try {
            const response = await claimsService.claimDetails(invId);
            if (response.statusCode === 0) {
                setClaimDetails(response.payload);
                sessionStorage.setItem('formEditable', response.payload.editable);
                sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
            }
        } catch (error) {
            console.error('Error fetching claim details:', error);
        } finally {
            // setLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                {/* Header with Investigation Details */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1">
                            <strong>Investigation No:</strong> {investigationId}
                        </Typography>
                        <Chip
                            label={claimsTypeLabel}
                            color="warning"
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>
                    <Typography variant="body1">
                        <strong>Claim No:</strong> {sbigClaimNo}
                    </Typography>
                    <Typography variant="body1">
                        <strong>TPA Claim No:</strong> {claimNo}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

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
                        {claimsType === 'cashless' && (
                            <Tab label="Pre-Auth Details" />
                        )}
                        {claimsType === 'reim' && (
                            <Tab label="Claim Details" />
                        )}
                        <Tab label="Insured & Hospital Details" />
                        <Tab label="Case Info" />
                        <Tab label="Accept / Deny" />
                        <Tab label="Log" />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={{ pt: 3 }}>
                    {/* Tab 0: Pre-Auth Details (Cashless) or Claim Details (Reim) */}
                    {activeTab === 0 && claimsType === 'cashless' && (
                        <PreAuth
                            //   investigationId={investigationId}
                            claimDetails={claimDetails}
                        />
                    )}
                    {activeTab === 0 && claimsType === 'reim' && (
                        <ClaimDetailsReim
                            //   investigationId={investigationId}
                            claimDetails={claimDetails}
                            claimsType={claimsType}
                        //   isFormEditable={false}
                        //   onNextPage={() => {}}
                        />
                    )}

                    {/* Tab 1: Insured & Hospital Details */}
                    {activeTab === 1 && (
                        <HospitalInfo
                            claimDetails={claimDetails}
                            claimsType={claimsType}
                        //   investigationId={investigationId}
                        //   isFormEditable={false}
                        //   onNextPage={() => {}}
                        />
                    )}

                    {/* Tab 2: Case Info */}
                    {activeTab === 2 && (
                        <CaseInfoComponent
                        //   investigationId={investigationId}
                        />
                    )}

                    {/* Tab 3: Accept / Deny */}
                    {activeTab === 3 && (
                        <AgencySelfDenied
                            claimType={claimsType}
                        />
                    )}

                    {/* Tab 4: Log */}
                    {activeTab === 4 && (
                        <Logs
                            //   investigationId={investigationId}
                            claimsType={claimsType}
                        />
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default AgencySelfDeniedTabs;