import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemText,
    Grid,
} from '@mui/material';
import HospitalOtherObservation from './HospitalOtherObservation';
import XrayDetails from './XrayDetails';
import TreatingDoctorDetails from './TreatingDoctorDetails';
import PathologyDetails from './PathologyDetails';
import HospitalDetails from './HospitalDetails';
import ChemistDetailsComponent from './ChemistDetailsComponent';

// ==================== INTERFACES ====================
interface TabCheck {
    employeerVisit: boolean;
    hospitalVisit: boolean;
    insuredPersonVisit: boolean;
}

interface MenuItem {
    label: string;
    value: string;
}

interface HospitalStepTwoProps {
    buttonEnable?: boolean;
    previousData?: any;
}



// ==================== SERVICES (Inline) ====================
// This is a simple in-memory store for case update values
// In real implementation, this could be Context API, Redux, or Zustand
const caseUpdateStore: Record<string, any> = {};

const caseUpdateService = {
    setCaseUpdateVal: (key: string, value: any) => {
        caseUpdateStore[key] = value;
    },
    getCaseUpdateVal: (key: string) => {
        return caseUpdateStore[key];
    },
};

const reimCaseUpdateService = {
    addHospitalVerifyTwo: async (payload: any, investigationId: string) => {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/reim-case-update/hospital-verify-two/${investigationId}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }
        );
        return response.json();
    },
};

const reimService = {
    getTabDetails: async (investigationId: string, type: string) => {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/reim/tab-details/${investigationId}?type=${type}`
        );
        return response.json();
    },
};

const notificationService = {
    showAlertSuccess: (message: string) => {
        alert(message);
    },
    showAlertError: (message: string) => {
        alert(message);
    },
};

const messages = {
    hospVerifySaved: 'Hospital verification saved successfully',
    hospVerifySubmit: 'Hospital verification submitted successfully',
};

// ==================== MAIN COMPONENT ====================
const HospitalStepTwo: React.FC<HospitalStepTwoProps> = ({
    buttonEnable = true,
    previousData = {},
}) => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const acceptAssignId = searchParams.get('acceptAssignId');

    // Menu items
    const menuList: MenuItem[] = [
        { label: 'Treating Doctor Verification', value: 'treatingDoctorVerification' },
        { label: 'Chemist Verification', value: 'chemistVerification' },
        { label: 'Pathologist Verification', value: 'pathologyVerification' },
        {
            label: 'X-Ray/Sonography/MRI/CT Scan/Blood Bank Visit/Physiotherapy Centres Verification',
            value: 'centreVerification',
        },
        { label: 'Hospital Rating', value: 'hospitalRating' },
        { label: 'Any Other Observations/Findings', value: 'otherObservations' },
    ];

    // State
    const [selectedMenu, setSelectedMenu] = useState<MenuItem>(menuList[0]);
    const [tabCheck, setTabCheck] = useState<TabCheck>({
        employeerVisit: false,
        hospitalVisit: false,
        insuredPersonVisit: false,
    });
    const [loading, setLoading] = useState(false);

    // Load tab details on mount
    useEffect(() => {
        if (investigationId) {
            const cleanId = investigationId.split(' ')[0];
            reimService.getTabDetails(cleanId, 'caseUpdate').then((data) => {
                if (data.statusCode === 0) {
                    setTabCheck(data.payload);
                }
            });
        }
    }, [investigationId]);

    // Build step two payload
    const buildStepTwoPayload = (btnAction: string) => {
        const payload: any = {
            reCaseUpdateTreatingDocterDetailsDTO: caseUpdateService.getCaseUpdateVal(
                'reCaseUpdateTreatingDocterDetailsDTO'
            ),
            reCaseUpdateReferralDocterDetailsDTO: caseUpdateService.getCaseUpdateVal(
                'reCaseUpdateReferralDocterDetailsDTO'
            ),
            labExist: caseUpdateService.getCaseUpdateVal('labExist'),
            chemistExist: caseUpdateService.getCaseUpdateVal('chemistExist'),
            activeReCaseID: localStorage.getItem('activeReCaseID'),
            acceptAssignId: acceptAssignId,
            sonographyVisitDone: caseUpdateService.getCaseUpdateVal('sonographyVisitDone'),
            sonographyReportsVerified: caseUpdateService.getCaseUpdateVal('sonographyReportsVerified'),
            sonographyFinding: caseUpdateService.getCaseUpdateVal('sonographyFinding'),
            pathItem: caseUpdateService.getCaseUpdateVal('pathItem'),
            xrayVisitDone: caseUpdateService.getCaseUpdateVal('xrayVisitDone'),
            xrayReportsVerified: caseUpdateService.getCaseUpdateVal('xrayReportsVerified'),
            xrayFinding: caseUpdateService.getCaseUpdateVal('xrayFinding'),
            mriVisitDone: caseUpdateService.getCaseUpdateVal('mriVisitDone'),
            mriReportsVerified: caseUpdateService.getCaseUpdateVal('mriReportsVerified'),
            mriFinding: caseUpdateService.getCaseUpdateVal('mriFinding'),
            ctScanVisitDone: caseUpdateService.getCaseUpdateVal('ctScanVisitDone'),
            ctScanReportsVerified: caseUpdateService.getCaseUpdateVal('ctScanReportsVerified'),
            ctScanFinding: caseUpdateService.getCaseUpdateVal('ctScanFinding'),
            bloodBankVisitDone: caseUpdateService.getCaseUpdateVal('bloodBankVisitDone'),
            bloodBankReportsVerified: caseUpdateService.getCaseUpdateVal('bloodBankReportsVerified'),
            bloodBankFinding: caseUpdateService.getCaseUpdateVal('bloodBankFinding'),
            therapyVisitDone: caseUpdateService.getCaseUpdateVal('therapyVisitDone'),
            therapyReportsVerified: caseUpdateService.getCaseUpdateVal('therapyReportsVerified'),
            therapyFinding: caseUpdateService.getCaseUpdateVal('therapyFinding'),
            hospitalFeedback: caseUpdateService.getCaseUpdateVal('hospitalFeedback'),
            hospitalRemark: caseUpdateService.getCaseUpdateVal('hospitalRemark'),
            anyOtherObservationFinding: caseUpdateService.getCaseUpdateVal('anyOtherObservationFinding'),
            btnAction: btnAction,
        };

        // Conditional fields based on lab and chemist existence
        const labExists = caseUpdateService.getCaseUpdateVal('labExist');
        const chemExists = caseUpdateService.getCaseUpdateVal('chemistExist');

        if (labExists === false) {
            payload.labExistFinding = caseUpdateService.getCaseUpdateVal('labExistFinding');
        }
        if (chemExists === false) {
            payload.chemistExistFinding = caseUpdateService.getCaseUpdateVal('chemistExistFinding');
        }
        if (labExists === true) {
            payload.reCaseUpdatePathologyDetailsDTO = caseUpdateService.getCaseUpdateVal(
                'reCaseUpdatePathologyDetailsDTO'
            );
        }
        if (chemExists === true) {
            payload.reCaseUpdateChemistDetailsDTO = caseUpdateService.getCaseUpdateVal(
                'reCaseUpdateChemistDetailsDTO'
            );
        }

        // Treating doctor statement collected
        const tDrStatementCollected = caseUpdateService.getCaseUpdateVal('treatingDrStatementCollected');
        payload.treatingDrStatementCollected = tDrStatementCollected;

        if (tDrStatementCollected === true) {
            payload.treatingDrStatementCollectedDiscrepanciesFound = caseUpdateService.getCaseUpdateVal(
                'treatingDrStatementCollectedDiscrepanciesFound'
            );
            payload.treatingDrStatementCollectedPEDNoted = caseUpdateService.getCaseUpdateVal(
                'treatingDrStatementCollectedPEDNoted'
            );
            payload.treatingDrStatementCollectedDiscrepanciesFinding = caseUpdateService.getCaseUpdateVal(
                'treatingDrStatementCollectedDiscrepanciesFinding'
            );
            payload.treatingDrStatementCollectedPEDNotedFinding = caseUpdateService.getCaseUpdateVal(
                'treatingDrStatementCollectedPEDNotedFinding'
            );
        }
        if (tDrStatementCollected === false) {
            payload.treatingDrStatementCollectedReason = caseUpdateService.getCaseUpdateVal(
                'treatingDrStatementCollectedReason'
            );
        }

        // Referral doctor statement collected
        const rDrStatementCollected = caseUpdateService.getCaseUpdateVal('referralDrStatementCollected');
        payload.referralDrStatementCollected = rDrStatementCollected;

        if (rDrStatementCollected === true) {
            payload.referralDrStatementCollectedDiscrepanciesFound = caseUpdateService.getCaseUpdateVal(
                'referralDrStatementCollectedDiscrepanciesFound'
            );
            payload.referralDrStatementCollectedPEDNoted = caseUpdateService.getCaseUpdateVal(
                'referralDrStatementCollectedPEDNoted'
            );
            payload.referralDrStatementCollectedDiscrepanciesFinding = caseUpdateService.getCaseUpdateVal(
                'referralDrStatementCollectedDiscrepanciesFinding'
            );
            payload.referralDrStatementCollectedPEDNotedFinding = caseUpdateService.getCaseUpdateVal(
                'referralDrStatementCollectedPEDNotedFinding'
            );
        }
        if (rDrStatementCollected === false) {
            payload.referralDrStatementCollectedReason = caseUpdateService.getCaseUpdateVal(
                'referralDrStatementCollectedReason'
            );
        }

        return payload;
    };

    // Save handler
    const saveStepTwo = async () => {
        setLoading(true);
        const cleanId = investigationId?.split(' ')[0] || '';
        const payload = buildStepTwoPayload('saveasdraft');

        try {
            const data = await reimCaseUpdateService.addHospitalVerifyTwo(payload, cleanId);
            if (data.statusCode === 0) {
                notificationService.showAlertSuccess(messages.hospVerifySaved);
            } else {
                notificationService.showAlertError(data.message);
            }
        } catch (error) {
            notificationService.showAlertError('Error saving hospital verification');
        } finally {
            setLoading(false);
        }
    };

    // Submit handler
    const submitStepTwo = async () => {
        setLoading(true);
        const cleanId = investigationId?.split(' ')[0] || '';
        const payload = buildStepTwoPayload('submittoqc');

        try {
            const data = await reimCaseUpdateService.addHospitalVerifyTwo(payload, cleanId);
            if (data.statusCode === 0) {
                notificationService.showAlertSuccess(messages.hospVerifySubmit);
                navigate('/admin/dashboard');
            } else {
                notificationService.showAlertError(data.message);
            }
        } catch (error) {
            notificationService.showAlertError('Error submitting hospital verification');
        } finally {
            setLoading(false);
        }
    };

    // Render selected menu content
    const renderContent = () => {
        switch (selectedMenu.value) {
            case 'treatingDoctorVerification':
                return (<TreatingDoctorDetails
                    buttonEnable={buttonEnable}
                    previousData={previousData}
                    title="Treating Doctor Details"
                />
                );
            case 'chemistVerification':
                return <ChemistDetailsComponent buttonEnable={buttonEnable} previousData={previousData} 
                onDataChange={(key, value) => {
                    // setCaseUpdateData(prev => ({
                    //     ...prev,
                    //     [key]: value
                    // }));
                }} 
                />;
            case 'pathologyVerification':
                return <PathologyDetails buttonEnable={buttonEnable} previousData={previousData} />;
            case 'centreVerification':
                return <XrayDetails isFormEditable={buttonEnable} previousData={previousData} />;
            case 'hospitalRating':
                return <HospitalDetails isFormEditable={buttonEnable} previousData={previousData} />;
            case 'otherObservations':
                return (
                    <HospitalOtherObservation isFormEditable={buttonEnable} previousData={previousData} />
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        {/* Left Menu */}
                        <Grid size={{ xs: 12, md: 2 }}>
                            <List
                                sx={{
                                    p: 0,
                                    '& .MuiListItem-root': {
                                        backgroundColor: '#eee',
                                        color: 'black',
                                        cursor: 'pointer',
                                        mb: 0.5,
                                        borderRadius: 1,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            backgroundColor: '#ccc',
                                        },
                                        '&.active': {
                                            backgroundColor: '#6770d2',
                                            color: 'white',
                                        },
                                    },
                                }}
                            >
                                {menuList.map((menu) => (
                                    <ListItem
                                        key={menu.value}
                                        onClick={() => setSelectedMenu(menu)}
                                        className={selectedMenu.value === menu.value ? 'active' : ''}
                                    >
                                        <ListItemText
                                            primary={menu.label}
                                            primaryTypographyProps={{
                                                fontSize: '0.9rem',
                                                fontWeight: selectedMenu.value === menu.value ? 600 : 400,
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>

                        {/* Right Content */}
                        <Grid size={{ xs: 12, md: 10 }}>
                            <Box>{renderContent()}</Box>
                        </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    {buttonEnable && (
                        <Box sx={{ mt: 4, textAlign: 'right' }}>
                            {/* Case 1: Only hospital visit, no employer and insured */}
                            {!tabCheck.employeerVisit &&
                                tabCheck.hospitalVisit &&
                                !tabCheck.insuredPersonVisit && (
                                    <>
                                        <Button
                                            variant="contained"
                                            onClick={saveStepTwo}
                                            disabled={loading}
                                            sx={{ mr: 2 }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={submitStepTwo}
                                            disabled={loading}
                                            sx={{
                                                background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5568D3 0%, #63408B 100%)',
                                                },
                                            }}
                                        >
                                            Submit to QC
                                        </Button>
                                    </>
                                )}

                            {/* Case 2: Hospital visit with insured, no employer */}
                            {!tabCheck.employeerVisit && tabCheck.hospitalVisit && tabCheck.insuredPersonVisit && (
                                <Button variant="contained" onClick={saveStepTwo} disabled={loading}>
                                    Save
                                </Button>
                            )}

                            {/* Case 3: Employer and hospital visit, no insured */}
                            {tabCheck.employeerVisit && tabCheck.hospitalVisit && !tabCheck.insuredPersonVisit && (
                                <Button variant="contained" onClick={saveStepTwo} disabled={loading}>
                                    Save
                                </Button>
                            )}

                            {/* Case 4: All three visits */}
                            {tabCheck.employeerVisit && tabCheck.hospitalVisit && tabCheck.insuredPersonVisit && (
                                <Button variant="contained" onClick={saveStepTwo} disabled={loading}>
                                    Save
                                </Button>
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default HospitalStepTwo;

// ==================== EXPORT CASE UPDATE SERVICE ====================
// Export the case update service so child components can use it
export { caseUpdateService };