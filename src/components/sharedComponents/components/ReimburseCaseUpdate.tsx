import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Tab,
    Tabs,
    CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { ReimService } from '../../../services/reim.service';
import EmployerVerification from './EmployerVerification';
import HospitalVerifications from './HospitalVerification';
import InsuredVerification from './InsuredVerification';

interface ReimburseCaseUpdateProps {
    buttonEnable?: boolean;
}

const ReimburseCaseUpdate: React.FC<ReimburseCaseUpdateProps> = ({
    buttonEnable: propButtonEnable = false,
}) => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();

    // State
    const [investigationId, setInvestigationId] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [previousData, setPreviousData] = useState<any>(null);
    const [buttonEnable, setButtonEnable] = useState(propButtonEnable);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);

    // Extract clean investigation ID
    useEffect(() => {
        if (paramInvestigationId) {
            const cleanId = paramInvestigationId.split('-')[0].trim();
            setInvestigationId(cleanId);
        }
    }, [paramInvestigationId]);

    // Fetch data when investigationId is available
    useEffect(() => {
        if (investigationId) {
            fetchTabDetails();
            fetchReimCaseUpdateData();
        }
    }, [investigationId]);

    // Fetch tab details (which verification types to show)
    const fetchTabDetails = async () => {
        try {
            const response: any = await ReimService.getTabDetails(investigationId, 'caseUpdate');
            console.log('Tab Details Response:', response);
            if (response.statusCode === 0) {
                setResponse(response.payload);

                // Set initial active tab based on which verifications are available
                if (response.payload.hospitalVisit) {
                    setActiveTab(0);
                } else if (response.payload.insuredPersonVisit) {
                    setActiveTab(1);
                } else if (response.payload.employeerVisit) {
                    setActiveTab(2);
                }
            }
        } catch (err) {
            console.error('Failed to fetch tab details:', err);
        }
    };

    // Fetch previous case update data
    const fetchReimCaseUpdateData = async () => {
        setLoading(true);
        try {
            const response: any = await ReimService.caseUpdatePreviousDataReim(investigationId);
            
            if (response.statusCode === 0) {
                const payload = response.payload;
                setPreviousData(payload);

                // Store active case ID in localStorage
                if (payload.activeReCaseID) {
                    localStorage.setItem('activeReCaseID', payload.activeReCaseID);
                }

                // Set button enable state based on data status
                if (payload.noDataStatus === 'Editable') {
                    setButtonEnable(true);
                } else if (payload.noDataStatus === 'NonEditable') {
                    setButtonEnable(false);
                }
            }
        } catch (err) {
            console.error('Failed to fetch case update data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // Handle tab change from child component (e.g., InsuredVerification requesting to show EmployerVerification)
    const handleChangeTab = (showEmployer: boolean) => {
        if (showEmployer && response?.employeerVisit) {
            // Find the index of employer verification tab
            const tabs = getTabs();
            const employerIndex = tabs.findIndex((tab) => tab.label === 'Employer Verification');
            if (employerIndex !== -1) {
                setActiveTab(employerIndex);
            }
        }
    };

    // Build tabs array based on available verifications
    const getTabs = () => {
        const tabs = [];

        if (response?.hospitalVisit) {
            tabs.push({
                label: 'Hospital Verification',
                component: (
                    <HospitalVerifications
                        buttonEnable={buttonEnable}
                        previousData={previousData}
                        onChangeTab={handleChangeTab}
                    />
                ),
            });
        }

        if (response?.insuredPersonVisit) {
            tabs.push({
                label: 'Insured Verification',
                component: (
                      <InsuredVerification
                        buttonEnable={buttonEnable}
                        previousData={previousData}
                        onChangeTab={handleChangeTab}
                      />
                ),
            });
        }

        if (response?.employeerVisit) {
            tabs.push({
                label: 'Employer Verification',
                component: (
                    <EmployerVerification
                        buttonEnable={buttonEnable}
                        previousData={previousData}
                    />
                ),
            });
        }

        return tabs;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#2E5A96' }}/>
            </Box>
        );
    }

    if (!response) {
        return (
            <Box sx={{ p: 3 }}>
                <Card>
                    <CardContent>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            No verification data available
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    const tabs = getTabs();

    if (tabs.length === 0) {
        return (
            <Box sx={{ p: 3 }}>
                <Card>
                    <CardContent>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            No verification types assigned
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
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

export default ReimburseCaseUpdate;