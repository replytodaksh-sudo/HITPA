// src/components/RegionalCompletedCase/Forms.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import Logs from '../../components/sharedComponents/components/Logs';
import { claimsService } from '../../services/claims.service';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import RegionalSelfDenied from '../../components/sharedComponents/components/RegionalSelfDenied';

const RegionalCompletedForms: React.FC = () => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [claimsType, setClaimsType] = useState('');
    const [claimNo, setClaimNo] = useState('');
    const [sbigClaimNo, setSbigClaimNo] = useState('');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [claimDetails, setClaimDetails] = useState<any>(null);

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
        fetchClaimDetails(investigationId!);
    }, [searchParams,investigationId]);

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

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    {/* Header with Investigation Numbers */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 4 }}>
                            <Typography variant="body2">
                                <strong>Investigation No: </strong>
                                {investigationId}
                                {claimsTypeLabel && (
                                    <Chip
                                        label={claimsTypeLabel}
                                        color="warning"
                                        size="small"
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                <strong>Claim No: </strong>
                                {sbigClaimNo}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">
                                <strong>TPA Claim No: </strong>
                                {claimNo}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    minHeight: 48,
                                },
                                '& .Mui-selected': {
                                    color: '#6F62C2',
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#6F62C2',
                                },
                            }}
                        >
                            {/* Tab 0: Pre-Auth Details (Cashless) / Claim Details (Reimbursement) */}
                            {claimsType === 'cashless' && (
                                <Tab label="Pre-Auth Details" />
                            )}
                            {claimsType === 'reim' && (
                                <Tab label="Claim Details" />
                            )}

                            {/* Tab 1: Insured & Hospital Details */}
                            <Tab label="Insured & Hospital Details" />

                            {/* Tab 2: Case Info */}
                            <Tab label="Case Info" />

                            {/* Tab 3: Accept / Deny */}
                            <Tab label="Accept / Deny" />

                            {/* Tab 4: Log */}
                            <Tab label="Log" />
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <Box sx={{ mt: 3 }}>
                        {/* Tab Panel 0: Pre-Auth or Claim Details */}
                        {activeTab === 0 && claimsType === 'cashless' && (
                            <Box>
                                <PreAuth claimDetails={claimDetails}/>
                            </Box>
                        )}

                        {activeTab === 0 && claimsType === 'reim' && (
                            <Box>
                                <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails}/>
                            </Box>
                        )}

                        {/* Tab Panel 1: Insured & Hospital Details */}
                        {activeTab === 1 && (
                            <Box>
                                <HospitalInfo claimsType={claimsType} claimDetails={claimDetails}/>
                            </Box>
                        )}

                        {/* Tab Panel 2: Case Info */}
                        {activeTab === 2 && (
                            <Box>
                                <CaseInfoComponent />
                            </Box>
                        )}

                        {/* Tab Panel 3: Accept / Deny (Regional Self Denied) */}
                        {activeTab === 3 && (
                            <Box>
                                <RegionalSelfDenied claimType={claimsType} />
                            </Box>
                        )}

                        {/* Tab Panel 4: Log */}
                        {activeTab === 4 && (
                            <Box>
                                <Logs claimsType={claimsType} />
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default RegionalCompletedForms;