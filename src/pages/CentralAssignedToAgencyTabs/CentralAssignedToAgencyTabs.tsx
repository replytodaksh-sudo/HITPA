import React, { useState, useEffect } from 'react';
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
import { useParams, useSearchParams } from 'react-router-dom';
import { claimsService } from '../../services/claims.service';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import Logs from '../../components/sharedComponents/components/Logs';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralAgencyCaseUpdateDocuments from '../../components/sharedComponents/components/CentralAgencyCaseUpdateDocuments';
import CentralAssignedAgencyCaseUpdate from '../../components/sharedComponents/components/CentralAssignedAgencyCaseUpdate';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import ClaimTeamQcUpdate from '../../components/sharedComponents/components/ClaimTeamQcUpdate';

const CentralAssignedAgencyTabs: React.FC = () => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // State
    const [investigationId, setInvestigationId] = useState('');
    const [claimsType, setClaimsType] = useState<'cashless' | 'reim'>('cashless');
    const [claimsTypeLabel, setClaimsTypeLabel] = useState('');
    const [claimNo, setClaimNo] = useState('');
    const [sbiClaimNo, setSbiClaimNo] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [buttonEnable, setButtonEnable] = useState(true);
    const [claimDetails, setClaimDetails] = useState<any>(null);

    // Extract data from route params and query params
    useEffect(() => {
        if (paramInvestigationId) {
            const cleanId = paramInvestigationId.split('-')[0].trim();
            setInvestigationId(cleanId);
            fetchClaimDetails(cleanId);
        }

        const claimsTypeParam = searchParams.get('claimsType') as 'cashless' | 'reim';
        const claimNoParam = searchParams.get('claimNo');
        const sbigClaimNoParam = searchParams.get('sbigclaimno');

        if (claimsTypeParam) {
            setClaimsType(claimsTypeParam);
            setClaimsTypeLabel(
                claimsTypeParam === 'cashless'
                    ? 'Cashless'
                    : claimsTypeParam === 'reim'
                        ? 'Reimbursement'
                        : ''
            );
        }

        if (claimNoParam) setClaimNo(claimNoParam);
        if (sbigClaimNoParam) setSbiClaimNo(sbigClaimNoParam);

    }, [paramInvestigationId, searchParams]);

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

    // Define tabs based on claim type
    const getTabs = () => {
        const baseTabs = [
            {
                label: claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details',
                component: claimsType === 'cashless' ? <PreAuth claimDetails={claimDetails} /> : <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails} />,
            },
            {
                label: 'Insured & Hospital Details',
                component: <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />,
            },
            {
                label: 'Case Info',
                component: <CaseInfoComponent />,
            },
            {
                label: 'Document',
                component: <CentralAgencyCaseUpdateDocuments />,
            },
            {
                label: 'F.O Updates',
                component:
                    claimsType === 'cashless' ? (
                        <CentralAssignedAgencyCaseUpdate />
                    ) : (
                        <ReimburseCaseUpdate buttonEnable={buttonEnable} />
                    ),
            },
            {
                label: 'QC Update',
                component: <ClaimTeamQcUpdate claimType={claimsType} />,
            },
            {
                label: 'Logs',
                component: <Logs claimsType={claimsType} />,
            },
        ];

        return baseTabs;
    };

    const tabs = getTabs();

    return (
        <Box sx={{ p: 3 }}>
            <Card elevation={3} sx={{ mb: 3 }}>
                <CardContent>
                    {/* Header Section */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="body1">
                                <strong>Investigation No:</strong> {investigationId}{' '}
                                <Chip
                                    label={claimsTypeLabel}
                                    color="warning"
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                            <Typography variant="body1">
                                <strong>SBIG Claim No:</strong> {sbiClaimNo}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="body1">
                                <strong>TPA Claim No:</strong> {claimNo}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Tabs Navigation */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    minWidth: 120,
                                    fontWeight: 500,
                                },
                                '& .Mui-selected': {
                                    color: '#6F62C2',
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#6F62C2',
                                },
                            }}
                        >
                            {tabs.map((tab, index) => (
                                <Tab key={index} label={tab.label} />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <Box sx={{ mt: 3 }}>
                        {tabs.map((tab, index) => (
                            <Box
                                key={index}
                                role="tabpanel"
                                hidden={activeTab !== index}
                                sx={{ display: activeTab === index ? 'block' : 'none' }}
                            >
                                {activeTab === index && tab.component}
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CentralAssignedAgencyTabs;