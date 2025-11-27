import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Chip, Tabs, Tab } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import UpdateIcon from '@mui/icons-material/Update';
import HistoryIcon from '@mui/icons-material/History';
import Logs from '../../components/sharedComponents/components/Logs';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import { claimsService } from '../../services/claims.service';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import CentralRegionalCaseUpdate from '../../components/sharedComponents/components/CentralRegionalCaseUpdate';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`case-tabpanel-${index}`}
            aria-labelledby={`case-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const CentralAssignedToRegionalTabs: React.FC = () => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(0);
    const [claimDetails, setClaimDetails] = useState<any>(null);

    // Get query parameters from location state or URL
    const searchParams = new URLSearchParams(location.search);
    const claimsType = searchParams.get('claimsType') || 'cashless';
    const claimNo = searchParams.get('claimNo') || '';
    const sbiclaimNo = searchParams.get('sbigclaimno') || '';

    // Clean investigation ID (remove any extra spaces)
    const cleanInvestigationId = investigationId?.split(' ')[0] || '';

    // Get claim type label
    const claimsTypeLabel =
        claimsType === 'cashless'
            ? 'Cashless'
            : claimsType === 'reim'
                ? 'Reimbursement'
                : '';

    useEffect(() => {
        if (cleanInvestigationId) {
            fetchClaimDetails(cleanInvestigationId);
        }
    }, [cleanInvestigationId]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

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

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3}>
                {/* Header Section */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        p: 2,
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        {/* Investigation No */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                                Investigation No:
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                                {cleanInvestigationId}
                            </Typography>
                            <Chip
                                label={claimsTypeLabel}
                                size="small"
                                sx={{
                                    backgroundColor: '#ffc107',
                                    color: '#000',
                                    fontWeight: 600,
                                }}
                            />
                        </Box>

                        {/* SBIG Claim No */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                                SBIG Claim No:
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                                {sbiclaimNo}
                            </Typography>
                        </Box>

                        {/* TPA Claim No */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                                TPA Claim No:
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'white' }}>
                                {claimNo}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Tabs Section */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
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
                        {/* First tab: Pre-Auth (Cashless) or Claim Details (Reim) */}
                        {claimsType === 'cashless' ? (
                            <Tab icon={<AssignmentIcon />} iconPosition="start" label="Pre-Auth Details" />
                        ) : (
                            <Tab icon={<DescriptionIcon />} iconPosition="start" label="Claim Details" />
                        )}

                        <Tab icon={<LocalHospitalIcon />} iconPosition="start" label="Insured & Hospital Details" />
                        <Tab icon={<InfoIcon />} iconPosition="start" label="Case Info" />
                        <Tab icon={<DescriptionIcon />} iconPosition="start" label="Document" />
                        <Tab icon={<UpdateIcon />} iconPosition="start" label="F.O Update" />
                        <Tab icon={<HistoryIcon />} iconPosition="start" label="Logs" />
                    </Tabs>
                </Box>

                {/* Tab Panels */}
                {claimsType === 'cashless' ? (
                    <TabPanel value={activeTab} index={0}>
                        <PreAuth claimDetails={claimDetails} />
                    </TabPanel>
                ) : (
                    <TabPanel value={activeTab} index={0}>
                        <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails} />
                    </TabPanel>
                )}

                <TabPanel value={activeTab} index={1}>
                    <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                    <CaseInfoComponent />
                </TabPanel>

                <TabPanel value={activeTab} index={3}>
                    <CentralRegionalDocuments />
                </TabPanel>

                <TabPanel value={activeTab} index={4}>
                    <CentralRegionalCaseUpdate  />
                </TabPanel>

                <TabPanel value={activeTab} index={5}>
                    <Logs claimsType={claimsType} />
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default CentralAssignedToRegionalTabs;