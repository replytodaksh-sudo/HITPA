import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Container,
    Tabs,
    Tab,
    Typography,
    Chip,
    Grid,
} from '@mui/material';
import {
    Description,
    LocalHospital,
    Info,
    CheckCircle,
    History,
    Assignment,
    ReplySharp,
} from '@mui/icons-material';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import CaseInfoComponent from '../../components/sharedComponents/components/CaseInfoComponent';
import AcceptDeny from '../../components/sharedComponents/components/AcceptDeny';
import Logs from '../../components/sharedComponents/components/Logs';
import { claimsService } from '../../services/claims.service';

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
            id={`case-tabpanel-${index}`}
            aria-labelledby={`case-tab-${index}`}
        >
            {value === index && (
                <Box
                    sx={{
                        py: 3,
                        animation: 'fadeIn 0.3s ease-in',
                        '@keyframes fadeIn': {
                            from: { opacity: 0, transform: 'translateY(10px)' },
                            to: { opacity: 1, transform: 'translateY(0)' },
                        },
                    }}
                >
                    {children}
                </Box>
            )}
        </div>
    );
};

const FreshCaseForm: React.FC = () => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    const [activeTab, setActiveTab] = useState<number>(0);
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
            // Extract investigation ID (remove any trailing spaces/text)
            const cleanId = paramInvestigationId.split(' ')[0];
            setInvestigationId(cleanId);
            fetchClaimDetails(cleanId);
        }
    }, [paramInvestigationId, paramInvestigationId]);

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

    // Define tabs based on claims type
    const tabs = [
        {
            label: claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details',
            icon: <Description />,
            component: claimsType === 'cashless' ? (
                <PreAuth claimDetails={claimDetails} />
            ) : (
                <ClaimDetailsReim claimDetails={claimDetails} claimsType={claimsType} />
            ),
        },
        {
            label: 'Insured & Hospital Details',
            icon: <LocalHospital />,
            component: <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />,
        },
        {
            label: 'Case Info',
            icon: <Info />,
            component: <CaseInfoComponent />,
        },
        {
            label: 'Accept / Deny',
            icon: <CheckCircle />,
            component: (
                <AcceptDeny
                    claimType={claimsType}
                    accid={acceptAssId}
                    invsid={investigationId!}
                    invesType={invesType}
                    invesSubType={invesSubType}
                />
            ),
        },
        {
            label: 'Logs',
            icon: <History />,
            component: <Logs claimsType={claimsType} />,
        },
    ];

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
                    {/* Header Section */}
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
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Investigation No:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
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
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Claim No:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                                        {sbiclaimNo || '-'}
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

                    {/* Tabs Section */}
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            background: 'linear-gradient(to bottom, #F8FAFC 0%, #FFFFFF 100%)',
                        }}
                    >
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                px: 2,
                                '& .MuiTab-root': {
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    minHeight: '64px',
                                    color: 'text.secondary',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        color: 'primary.main',
                                        background: 'rgba(103, 126, 234, 0.05)',
                                    },
                                    '&.Mui-selected': {
                                        color: 'primary.main',
                                    },
                                },
                                '& .MuiTabs-indicator': {
                                    height: '3px',
                                    borderRadius: '3px 3px 0 0',
                                    background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
                                },
                            }}
                        >
                            {tabs.map((tab, index) => (
                                <Tab
                                    key={index}
                                    label={tab.label}
                                    icon={tab.icon}
                                    iconPosition="start"
                                    id={`case-tab-${index}`}
                                    aria-controls={`case-tabpanel-${index}`}
                                />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <Box sx={{ px: 3 }}>
                        {tabs.map((tab, index) => (
                            <TabPanel key={index} value={activeTab} index={index}>
                                {tab.component}
                            </TabPanel>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default FreshCaseForm;