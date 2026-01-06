import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Paper,
} from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { caseUpdateService } from '../../../services/caseupdate.service';
import AcceptAgencies from './acceptAgency';
import AcceptDeny from './AcceptDeny';
import PresentForm from './PresentForm';
import NotPresentForm from './NoPresentForm';

const CaseUpdateForm: React.FC = () => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const location = useLocation();

    // Get query parameters
    const searchParams = new URLSearchParams(location.search);
    const fieldType = searchParams.get('fieldType');
    const claimsType = searchParams.get('claimsType');
    const invesType = searchParams.get('invsType') || '';
    const invesSubType = searchParams.get('invsSubType') || '';

    // Get role from sessionStorage
    const roleName = sessionStorage.getItem('roleName') || '';
    const userCode = sessionStorage.getItem('userCode') || '';
    const token = sessionStorage.getItem('token') || '';

    // State
    const [investigationId, setInvestigationId] = useState('');
    const [statusInsuredVisit, setStatusInsuredVisit] = useState<string>('');
    const [previousData, setPreviousData] = useState<any>(null);
    const [checkEditable, setCheckEditable] = useState(false);
    const [assignFieldOfficer, setAssignFieldOfficer] = useState('No');
    const [loading, setLoading] = useState(true);
    const accid = null; // This might come from props or state

    // Extract clean investigation ID
    useEffect(() => {
        if (paramInvestigationId) {
            const cleanId = paramInvestigationId.split(' ')[0].trim();
            setInvestigationId(cleanId);
        }
    }, [paramInvestigationId]);

    // Fetch saved form data when investigationId is available
    useEffect(() => {
        if (investigationId) {
            getSavedFormData();
        }
    }, [investigationId]);

    const getSavedFormData = async () => {
        setLoading(true);
        try {
            // Decode JWT token
            let decodedToken: any = {};
            if (token) {
                try {
                    decodedToken = jwtDecode(token);
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            }

            const response: any = await caseUpdateService.caseUpdatePreviousData(investigationId);

            if (response.statusCode === 0) {
                const payload = response.payload;

                // Set investigator name based on role
                if (roleName === 'Field Officer' || roleName === 'Agency Spoc') {
                    payload.investigatorName = decodedToken.name || '';
                } else {
                    payload.investigatorName = '';
                }

                setPreviousData(payload);

                // Store active case ID in localStorage
                if (payload.activeCaseID) {
                    localStorage.setItem('activeCaseID', payload.activeCaseID);
                }

                // Set insured visit status
                if (payload.boolStatusOfInsured !== null) {
                    setStatusInsuredVisit(payload.boolStatusOfInsured ? '1' : '0');
                }

                // Check if form is editable
                checkIsEditable(payload);
            } else {
                setPreviousData(response.payload);
                checkIsEditable(response.payload);
            }
        } catch (error) {
            console.error('Error fetching previous data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const refetchData = async () => {
        // setLoading(true);
        try {
            // Decode JWT token
            let decodedToken: any = {};
            if (token) {
                try {
                    decodedToken = jwtDecode(token);
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            }

            const response: any = await caseUpdateService.caseUpdatePreviousData(investigationId);

            if (response.statusCode === 0) {
                const payload = response.payload;

                // Set investigator name based on role
                if (roleName === 'Field Officer' || roleName === 'Agency Spoc') {
                    payload.investigatorName = decodedToken.name || '';
                } else {
                    payload.investigatorName = '';
                }

                setPreviousData(payload);

                // Store active case ID in localStorage
                if (payload.activeCaseID) {
                    localStorage.setItem('activeCaseID', payload.activeCaseID);
                }

                // Set insured visit status
                if (payload.boolStatusOfInsured !== null) {
                    setStatusInsuredVisit(payload.boolStatusOfInsured ? '1' : '0');
                }

                // Check if form is editable
                checkIsEditable(payload);
            } else {
                setPreviousData(response.payload);
                checkIsEditable(response.payload);
            }
        } catch (error) {
            console.error('Error fetching previous data:', error);
        } finally {
            // setLoading(false);
        }
    };

    const checkIsEditable = (data: any) => {
        if (!data) return;

        // Determine if form is editable based on noDataStatus
        if (data.noDataStatus === 'NonEditable') {
            setCheckEditable(true);
        } else if (data.noDataStatus === 'Editable') {
            setCheckEditable(false);
        }
    };

        // Original commented logic for reference:
        // const globalUserCode = data.createdBy;
        // const localUserCode = userCode;
        // const status = data.noDataStatus;

        // if (globalUserCode === localUserCode) {
        //   if (status === 'Draft') {
        //     setCheckEditable(false);
        //   } else if (status === 'Submitted') {
        //     setCheckEditable(true);
        //   }
        // } else {
        //   if (data.noDataStatus === 'NonEditable') {
        //     setCheckEditable(true);
        //   } else if (data.noDataStatus === 'Editable') {
        //     setCheckEditable(false);
        //   } else if (data.status === 'Draft') {
        //     setCheckEditable(true);
        //   } else if (data.status === 'Submitted') {
        //     setCheckEditable(false);
        //   }
        // }

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Rework Case - Assign to Field Officer */}
            {previousData?.reworkCaseComments &&
                fieldType === 'rework' && (
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Reinvestigation case: {previousData.reworkCaseComments}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body1" sx={{ minWidth: 300 }}>
                                Accept and assign to Field Officer
                            </Typography>
                            <RadioGroup
                                row
                                value={assignFieldOfficer}
                                onChange={(e) => setAssignFieldOfficer(e.target.value)}
                            >
                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                            </RadioGroup>
                        </Box>

                        {assignFieldOfficer === 'Yes' && (
                            <Box sx={{ mt: 2 }}>
                                <AcceptAgencies accid={accid!} investigationType={invesType} />
                            </Box>
                        )}
                    </Paper>
                )}

            {/* Reassign Case */}
            {fieldType === 'reassign' &&
                previousData?.reworkCaseComments && (
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Reinvestigation case: {previousData.reworkCaseComments}
                        </Typography>

                        {previousData.prevInvestigatorReport !== 'yes' && (
                            <AcceptDeny claimType={claimsType || 'cashless'} accid={accid!} invsid={investigationId} invesType={invesType}
                                invesSubType={invesSubType} />
                        )}
                    </Paper>
                )}

            {/* Status of Insured - Only show if form is editable */}
            {!checkEditable && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                        Status of Insured at the time of Visit
                    </Typography>

                    <RadioGroup
                        value={statusInsuredVisit}
                        onChange={(e) => setStatusInsuredVisit(e.target.value)}
                    >
                        <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="Present"
                            disabled={checkEditable}
                        />
                        <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="Not Present"
                            disabled={checkEditable}
                        />
                    </RadioGroup>
                </Paper>
            )}

            {/* Present Form */}
            {statusInsuredVisit === '1' && !checkEditable && (
                <Box>
                    <PresentForm
                        isFormEditable={checkEditable}
                        payloadData={previousData}
                        // refetch={refetchData}
                    />
                </Box>
             )} 

            {/* Not Present Form */}
            {statusInsuredVisit === '0' && !checkEditable && (
                <Box>
                    <NotPresentForm
                        payloadData={previousData}
                        isFormEditable={checkEditable}
                    />
                </Box>
            )}
        </Box>
    );
};

export default CaseUpdateForm;