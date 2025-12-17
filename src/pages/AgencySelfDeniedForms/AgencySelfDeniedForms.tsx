// File: src/components/AgencySelfDeniedForms.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Tabs,
    Tab,
    Typography,
    Chip,
    Grid,
} from '@mui/material';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import AgencySelfDenied from '../../components/sharedComponents/components/AgencySelfDenied';
import Logs from '../../components/sharedComponents/components/Logs';
import claimsService from '../../services/claims.service';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

const AgencySelfDeniedForms: React.FC = () => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [activeTab, setActiveTab] = useState<number>(0);
    const [claimsType, setClaimsType] = useState<string>('');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState<string>('');
    const [claimNo, setClaimNo] = useState<string>('');
    const [sbigclaimNo, setSbigclaimNo] = useState<string>('');
    const [cleanInvestigationId, setCleanInvestigationId] = useState<string>('');
    const [claimDetails, setClaimDetails] = useState<any>(null);

    useEffect(() => {
        // Get query parameters
        const type = searchParams.get('claimsType') || '';
        const tpaClaimNo = searchParams.get('claimNo') || '';
        const sbigClaimNo = searchParams.get('sbigclaimno') || '';

        setClaimsType(type);
        setClaimNo(tpaClaimNo);
        setSbigclaimNo(sbigClaimNo);

        // Set label
        if (type === 'cashless') {
            setClaimsTypeLabel('Cashless');
        } else if (type === 'reim') {
            setClaimsTypeLabel('Reimbursement');
        } else {
            setClaimsTypeLabel('');
        }

        // Clean investigation ID
        if (investigationId) {
            const cleanId = investigationId.split(' ')[0];
            setCleanInvestigationId(cleanId);
            fetchClaimDetails(cleanId);
        }
    }, [investigationId, searchParams]);

    const fetchClaimDetails = async (invId: string) => {
        // setLoading(true);
        try {
            const response = await claimsService.claimDetails(invId);
            if (response.statusCode === 0) {
                console.log("ppppp", response.payload)
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
        <Box sx={{ width: '100%', p: 3 }}>
            <Card elevation={3}>
                <CardContent>
                    {/* Header Section with Investigation Details */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1">
                                    <strong>Investigation No:</strong> {cleanInvestigationId}
                                </Typography>
                                <Chip
                                    label={claimsTypeLabel}
                                    color="warning"
                                    size="small"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 4 }} sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                            <Typography variant="body1">
                                <strong>SBIG Claim No:</strong> {sbigclaimNo}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="body1">
                                <strong>TPA Claim No:</strong> {claimNo}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Tabs Navigation */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            aria-label="agency self denied tabs"
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                },
                                '& .Mui-selected': {
                                    color: '#667eea',
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#667eea',
                                },
                            }}
                        >
                            {/* First tab - conditional based on claimsType */}
                            {claimsType === 'cashless' && (
                                <Tab label="Pre-Auth Details" id="tab-0" />
                            )}
                            {claimsType === 'reim' && (
                                <Tab label="Claim Details" id="tab-0" />
                            )}

                            {/* Common tabs */}
                            <Tab label="Insured & Hospital Details" id="tab-1" />
                            <Tab label="Case Info" id="tab-2" />
                            <Tab label="Accept / Deny" id="tab-3" />
                            <Tab label="Log" id="tab-4" />
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <Box sx={{ mt: 2 }}>
                        {/* Pre-Auth Details (Cashless) */}
                        {claimsType === 'cashless' && (
                            <TabPanel value={activeTab} index={0}>
                                <PreAuth claimDetails={claimDetails} />
                            </TabPanel>
                        )}

                        {/* Claim Details (Reimbursement) */}
                        {claimsType === 'reim' && (
                            <TabPanel value={activeTab} index={0}>
                                <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails} />
                            </TabPanel>
                        )}

                        {/* Insured & Hospital Details */}
                        <TabPanel value={activeTab} index={1}>
                            <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />
                        </TabPanel>

                        {/* Case Info */}
                        <TabPanel value={activeTab} index={2}>
                            <CaseInfoComponent />
                        </TabPanel>

                        {/* Accept / Deny */}
                        <TabPanel value={activeTab} index={3}>
                            <AgencySelfDenied />
                        </TabPanel>

                        {/* Log */}
                        <TabPanel value={activeTab} index={4}>
                            <Logs claimsType={claimsType} />
                        </TabPanel>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AgencySelfDeniedForms;