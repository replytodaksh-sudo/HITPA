import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Radio,
    RadioGroup,
    FormControlLabel,
    Alert,
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { acceptAssignService } from '../../../services/acceptassign.service';
import { agencyService } from '../../../services/agency.service';
import { ReimService } from '../../../services/reim.service';
import { claimsService } from '../../../services/claims.service';
import QuestionnaireSection from './QuestionnaireSection';
import DocumentUpload from './DocumentUpload';
import { DocumentsService } from '../../../services/document.service';

interface AcceptInternalTeamProps {
    claimType?: string;
    centralmandatedCase?: string;
    accid?: string;
    qcObservation?: string;
}

const AcceptInternalTeam: React.FC<AcceptInternalTeamProps> = ({
    claimType,
    centralmandatedCase = 'no',
    accid,
    qcObservation = '',
}) => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const roleName = sessionStorage.getItem('roleName') || '';
    const canAssignToInternalTeam = sessionStorage.getItem('canAssignToInternalTeam') || 'No';

    // State variables
    const [assignedToUser, setAssignedToUser] = useState('');
    const [acceptInstruction, setAcceptInstruction] = useState('');
    const [majorTrigger, setMajorTrigger] = useState('');
    const [assignUsers, setAssignUsers] = useState<any[]>([]);
    const [regionalTeamMembers, setRegionalTeamMembers] = useState<any[]>([]);
    const [agencyList, setAgencyList] = useState<any[]>([]);
    const [systemSuggestedAgencyList, setSystemSuggestedAgencyList] = useState<any[]>([]);
    const [fieldOfficerList, setFieldOfficerList] = useState<any[]>([]);
    const [performanceIndex, setPerformanceIndex] = useState<any>(null);

    // Document states
    const [documentsCodes, setDocumentsCodes] = useState<string[]>([]);
    const [investigationDocs, setInvestigationDocs] = useState<any[]>([]);
    const [documentArray, setDocumentArray] = useState<any[]>([]);

    // Question states
    const [selectedInsuredQuestions, setSelectedInsuredQuestions] = useState<string[]>([]);
    const [selectedTreatingDoctorQuestions, setSelectedTreatingDoctorQuestions] = useState<string[]>([]);
    const [customInsuredQuestions, setCustomInsuredQuestions] = useState<string[]>([]);
    const [customTreatingDoctorQuestions, setCustomTreatingDoctorQuestions] = useState<string[]>([]);

    // Reimbursement specific states
    const [caseAllocationType, setCaseAllocationType] = useState(0);
    const [chooseAllocation, setChooseAllocation] = useState(0);
    const [verificationCategory, setVerificationCategory] = useState('');
    const [agencyRadioValue, setAgencyRadioValue] = useState(0);
    const [agencyCode, setAgencyCode] = useState('');
    const [internalTeamMemCode, setInternalTeamMemCode] = useState('');

    // Split case states
    const [ipvAgencyCode, setIpvAgencyCode] = useState('');
    const [hvAgencyCode, setHvAgencyCode] = useState('');
    const [evAgencyCode, setEvAgencyCode] = useState('');
    const [disabledIpvAgency, setDisabledIpvAgency] = useState(false);
    const [disabledIpvInternal, setDisabledIpvInternal] = useState(false);
    const [disabledHvAgency, setDisabledHvAgency] = useState(false);
    const [disabledHvInternal, setDisabledHvInternal] = useState(false);
    const [disabledEvAgency, setDisabledEvAgency] = useState(false);
    const [disabledEvInternal, setDisabledEvInternal] = useState(false);

    const [response, setResponse] = useState<any>(null);
    const [claimDetails, setClaimDetails] = useState<any>(null);
    const [error, setError] = useState('');

    const cleanInvestigationId = investigationId?.split(' ')[0] || '';
    const redirectTo = (location.state as any)?.redirectTo;

    useEffect(() => {
        initialize();
    }, [investigationId]);

    const initialize = async () => {
        try {
            await Promise.all([
                fetchAssignUsers(),
                fetchRegionalUsers(),
                fetchInvestigationDocs(),
                fetchTabDetails(),
                fetchClaimDetails(),
            ]);

            if (roleName === 'Agency Spoc') {
                await fetchFieldOfficers();
            } else {
                await Promise.all([
                    fetchAgencies(),
                    fetchSystemSuggestedAgencies(),
                ]);
            }
        } catch (err) {
            console.error('Initialization error:', err);
        }
    };

    const fetchAssignUsers = async () => {
        try {
            const res: any = await acceptAssignService.getAssignUsers();
            setAssignUsers(res || []);
        } catch (err) {
            console.error('Error fetching assign users:', err);
        }
    };

    const fetchRegionalUsers = async () => {
        try {
            const res: any = await acceptAssignService.getRegionalUsers();
            // if (res.statusCode === 0) {
            setRegionalTeamMembers(res || []);
            // }
        } catch (err) {
            console.error('Error fetching regional users:', err);
        }
    };

    const fetchAgencies = async () => {
        try {
            const res: any = await agencyService.fetchAllAgency();
            if (res.statusCode === 0) {
                setAgencyList(res.payload || []);
            }
        } catch (err) {
            console.error('Error fetching agencies:', err);
        }
    };

    const fetchSystemSuggestedAgencies = async () => {
        try {
            const res: any = await agencyService.getSystemSuggestedAgency();
            if (res.statusCode === 0) {
                setSystemSuggestedAgencyList(res.payload || []);
            }
        } catch (err) {
            console.error('Error fetching system suggested agencies:', err);
        }
    };

    const fetchFieldOfficers = async () => {
        try {
            const res: any = await agencyService.fetchAllFieldOfficer();
            if (res.statusCode === 0) {
                setFieldOfficerList(res.payload || []);
            }
        } catch (err) {
            console.error('Error fetching field officers:', err);
        }
    };

    const fetchPerformanceIndex = async (code: string) => {
        try {
            const res: any = await agencyService.getPerformanceIndex(code);
            if (res.statusCode === 0) {
                setPerformanceIndex(res.payload);
            }
        } catch (err) {
            console.error('Error fetching performance index:', err);
        }
    };

    const fetchTabDetails = async () => {
        try {
            const res: any = await ReimService.getTabDetails(cleanInvestigationId, 'acceptAssign');
            if (res.statusCode === 0) {
                setResponse(res.payload);
                const invType = res.payload.investigationType?.toLowerCase();
                if (invType?.includes('full')) {
                    setCaseAllocationType(1);
                } else if (invType?.includes('split')) {
                    setCaseAllocationType(2);
                } else if (invType?.includes('part')) {
                    setCaseAllocationType(3);
                }
            }
        } catch (err) {
            console.error('Error fetching tab details:', err);
        }
    };

    const fetchClaimDetails = async () => {
        try {
            let res: any;
            if (claimType === 'cashless') {
                res = await claimsService.claimDetails(cleanInvestigationId);
            } else {
                res = await claimsService.reclaimDetails(cleanInvestigationId);
            }

            if (res.statusCode === 0) {
                setClaimDetails(res.payload);
                if (claimType === 'reim') {
                    setVerificationCategory(res.payload.partVerficationCategory || '');
                    if (res.payload.caseType === 'Reassign') {
                        const invType = res.payload.investigationType?.toLowerCase();
                        if (invType?.includes('full')) {
                            setCaseAllocationType(1);
                        } else if (invType?.includes('split')) {
                            setCaseAllocationType(2);
                        } else if (invType?.includes('part')) {
                            setCaseAllocationType(3);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching claim details:', err);
        }
    };

    const fetchInvestigationDocs = async () => {
        try {
            const uploadDuring =
                roleName === 'Regional Manager'
                    ? 'caseAssignmentRegional'
                    : roleName === 'Agency Spoc'
                        ? 'caseAssignmentAgency'
                        : 'caseAssignmentCentral';

            // Fetch current stage docs
            const res1: any = await DocumentsService.viewInvestigationDocsView(
                uploadDuring,
                cleanInvestigationId
            );
            if (res1.statusCode === 0) {
                setInvestigationDocs(res1.payload || []);
            }

            // Fetch previous stage docs for viewing
            if (roleName === 'Regional Manager') {
                const res2: any = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentCentral',
                    cleanInvestigationId
                );
                if (res2.statusCode === 0) {
                    setDocumentArray(res2.payload || []);
                }
            } else if (roleName === 'Agency Spoc') {
                const res2: any = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentCentral',
                    cleanInvestigationId
                );
                const res3: any = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentRegional',
                    cleanInvestigationId
                );
                if (res2.statusCode === 0 && res3.statusCode === 0) {
                    setDocumentArray([...(res2.payload || []), ...(res3.payload || [])]);
                }
            }
        } catch (err) {
            console.error('Error fetching docs:', err);
        }
    };

    // Split case dropdown handlers
    const handleEvAgencyChange = (value: string) => {
        setEvAgencyCode(value);
        setDisabledEvInternal(!!value);
        if (!value) setDisabledEvInternal(false);
    };

    const handleEvInternalChange = (value: string) => {
        setEvAgencyCode(value);
        setDisabledEvAgency(!!value);
        if (!value) setDisabledEvAgency(false);
    };

    const handleHvAgencyChange = (value: string) => {
        setHvAgencyCode(value);
        setDisabledHvInternal(!!value);
        if (!value) setDisabledHvInternal(false);
    };

    const handleHvInternalChange = (value: string) => {
        setHvAgencyCode(value);
        setDisabledHvAgency(!!value);
        if (!value) setDisabledHvAgency(false);
    };

    const handleIpvAgencyChange = (value: string) => {
        setIpvAgencyCode(value);
        setDisabledIpvInternal(!!value);
        if (!value) setDisabledIpvInternal(false);
    };

    const handleIpvInternalChange = (value: string) => {
        setIpvAgencyCode(value);
        setDisabledIpvAgency(!!value);
        if (!value) setDisabledIpvAgency(false);
    };

    // Submit handlers
    const handleSubmitCashless = async () => {
        if (!assignedToUser || !acceptInstruction) {
            setError('Please fill all mandatory fields');
            return;
        }

        if (roleName === 'Regional Manager' && !majorTrigger) {
            setError('Major Trigger is required');
            return;
        }

        const allQuestionCodes = [
            ...selectedInsuredQuestions,
            ...customInsuredQuestions,
            ...selectedTreatingDoctorQuestions,
            ...customTreatingDoctorQuestions,
        ];

        const acceptRequest = {
            acceptAssignId: accid,
            investigationId: cleanInvestigationId,
            assignedToUser,
            acceptInstruction,
            questionCodes: allQuestionCodes,
            centralMandatedCase: centralmandatedCase,
            majorTrigger,
        };

        try {
            let res: any;
            if (roleName === 'Regional Manager' || roleName === 'Central Manager') {
                res = await acceptAssignService.assign(acceptRequest, documentsCodes);
            } else if (roleName === 'Agency Spoc') {
                res = await acceptAssignService.assignFO(acceptRequest, documentsCodes);
            }

            if (res.statusCode === 0) {
                alert('Case assigned successfully');
                // if (redirectTo) {
                //     navigate(redirectTo);
                // } else {
                    // navigate('/admin/dashboard');
                // }
            } else {
                setError(res.message || 'Assignment failed');
            }
        } catch (err: any) {
            setError(err.message || 'Assignment failed');
        }
    };

    const handleSubmitReimbursement = async () => {
        if (!acceptInstruction) {
            setError('Please fill all mandatory fields');
            return;
        }

        if (roleName === 'Regional Manager' && !majorTrigger) {
            setError('Major Trigger is required');
            return;
        }

        const allQuestionCodes = [
            ...selectedInsuredQuestions,
            ...customInsuredQuestions,
            ...selectedTreatingDoctorQuestions,
            ...customTreatingDoctorQuestions,
        ];

        const acceptRequest: any = {
            acceptAssignId: accid,
            investigationId: cleanInvestigationId,
            acceptInstruction,
            questionCodes: allQuestionCodes,
            centralMandatedCase: centralmandatedCase,
            qcObservation,
            majorTrigger,
            investigationCaseDTO: {
                investigationType:
                    caseAllocationType === 1
                        ? 'Full case allocation'
                        : caseAllocationType === 2
                            ? 'Split case allocation'
                            : 'Part verification',
                subTypeDTO: [],
            },
        };

        // Build subTypeDTO based on allocation type
        if (caseAllocationType === 1 && chooseAllocation === 1) {
            acceptRequest.assignedToUser = agencyCode;
            acceptRequest.investigationCaseDTO.subTypeDTO.push({
                investigationSubType: 'Full case allocation',
                assignTo: agencyCode,
            });
        } else if (caseAllocationType === 1 && chooseAllocation === 2) {
            acceptRequest.assignedToUser = internalTeamMemCode;
            acceptRequest.investigationCaseDTO.subTypeDTO.push({
                investigationSubType: 'Full case allocation',
                assignTo: internalTeamMemCode,
            });
        } else if (caseAllocationType === 2) {
            if (ipvAgencyCode === hvAgencyCode && hvAgencyCode === evAgencyCode) {
                setError('Cannot use same entity for all visits');
                return;
            }
            acceptRequest.investigationCaseDTO.subTypeDTO.push(
                {
                    investigationSubType: 'Insured person visit',
                    assignTo: ipvAgencyCode,
                },
                {
                    investigationSubType: 'Hospital Visit',
                    assignTo: hvAgencyCode,
                },
                {
                    investigationSubType: 'Employer Visit',
                    assignTo: evAgencyCode,
                }
            );
        } else if (caseAllocationType === 3 && chooseAllocation === 1) {
            acceptRequest.assignedToUser = agencyCode;
            acceptRequest.partVerificationCategory = verificationCategory;
            acceptRequest.investigationCaseDTO.subTypeDTO.push({
                investigationSubType: 'Part verification',
                assignTo: agencyCode,
            });
        } else if (caseAllocationType === 3 && chooseAllocation === 2) {
            acceptRequest.assignedToUser = internalTeamMemCode;
            acceptRequest.partVerificationCategory = verificationCategory;
            acceptRequest.investigationCaseDTO.subTypeDTO.push({
                investigationSubType: 'Part verification',
                assignTo: internalTeamMemCode,
            });
        } else if (caseAllocationType === 3 && chooseAllocation === 3) {
            acceptRequest.assignedToUser = 'assignToSelf';
            acceptRequest.partVerificationCategory = verificationCategory;
            acceptRequest.investigationCaseDTO.subTypeDTO.push({
                investigationSubType: 'Part verification',
                assignTo: 'assignToSelf',
            });
        }

        if (roleName === 'Central Manager') {
            acceptRequest.assignedToUser = assignedToUser;
            acceptRequest.investigationCaseDTO.investigationType = 'Full case allocation';
        }

        try {
            let res: any;
            if (roleName === 'Regional Manager' || roleName === 'Central Manager') {
                res = await acceptAssignService.reimAssign(acceptRequest, documentsCodes);
            } else if (roleName === 'Agency Spoc') {
                res = await acceptAssignService.reimAgencyAssign(acceptRequest, documentsCodes);
            }

            if (res.statusCode === 0) {
                alert('Case assigned successfully');
                // if (redirectTo) {
                //     navigate(redirectTo);
                // } else {
                //     navigate('/admin/dashboard');
                // }
            } else {
                setError(res.message || 'Assignment failed');
            }
        } catch (err: any) {
            setError(err.message || 'Assignment failed');
        }
    };

    const handleSubmit = () => {
        if (claimType === 'cashless') {
            handleSubmitCashless();
        } else {
            handleSubmitReimbursement();
        }
    };
    
    return (
        <Box sx={{ p: 3 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Paper elevation={2} sx={{ p: 3 }}>
                {/* Role-based assignment dropdowns will go here */}
                {/* Regional Manager - Cashless */}
                {roleName === 'Regional Manager' && claimType === 'cashless' && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Assigning investigation to internal team</InputLabel>
                                <Select
                                    value={assignedToUser}
                                    onChange={(e) => {
                                        setAssignedToUser(e.target.value);
                                        setPerformanceIndex(null);
                                        if (e.target.value && e.target.value !== 'assignToSelf') {
                                            fetchPerformanceIndex(e.target.value);
                                        }
                                    }}
                                >
                                    <MenuItem value="">--- Choose Internal Team Member ---</MenuItem>
                                    <MenuItem value="assignToSelf">Assign to self</MenuItem>
                                    {canAssignToInternalTeam === 'Yes' &&
                                        assignUsers.map((user) => (
                                            <MenuItem key={user.userCode} value={user.userCode}>
                                                {user.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {performanceIndex && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Performance Index
                                    </Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Total No.cases assigned in last 2 days</TableCell>
                                                    <TableCell>{performanceIndex.totalNoOfCases}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Open Cases</TableCell>
                                                    <TableCell>{performanceIndex.openCases}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Last Month Hit Ratio</TableCell>
                                                    <TableCell>{performanceIndex.lastMonthHitRatio}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Average Rating</TableCell>
                                                    <TableCell>{performanceIndex.averageRating}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                )}

                {/* Central Manager - Cashless/Reim */}
                {roleName === 'Central Manager' && (claimType === 'cashless' || claimType === 'reim') && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Assigning investigation to internal team</InputLabel>
                                <Select
                                    value={assignedToUser}
                                    onChange={(e) => {
                                        setAssignedToUser(e.target.value);
                                        if (e.target.value) {
                                            fetchPerformanceIndex(e.target.value);
                                        }
                                    }}
                                >
                                    <MenuItem value="">--- Choose Regional Team Member ---</MenuItem>
                                    {regionalTeamMembers.map((member) => (
                                        <MenuItem key={member.userCode} value={member.userCode}>
                                            {member.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                )}

                {/* Agency Spoc - Cashless */}
                {roleName === 'Agency Spoc' && claimType === 'cashless' && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Assigning investigation</InputLabel>
                                <Select value={assignedToUser} onChange={(e) => setAssignedToUser(e.target.value)}>
                                    <MenuItem value="">--- Choose ---</MenuItem>
                                    <MenuItem value="assignToSelf">Assign to self</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                )}

                {/* Reimbursement Case Allocation */}
                {(roleName === 'Regional Manager' || roleName === 'Agency Spoc') && claimType === 'reim' && (
                    <Box sx={{ mb: 3 }}>
                        {/* Case Allocation Type */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Case Allocation Type *</InputLabel>
                                    <Select
                                        value={caseAllocationType}
                                        onChange={(e) => setCaseAllocationType(Number(e.target.value))}
                                        // disabled={roleName !== 'Regional Manager' || caseAllocationType !== 0}
                                        disabled={caseAllocationType !== 0}
                                    >
                                        <MenuItem value={0}>--- Choose Case allocation Type ---</MenuItem>
                                        <MenuItem value={1}>Full case allocation</MenuItem>
                                        {(roleName === 'Regional Manager' || caseAllocationType === 2) && (
                                            <MenuItem value={2}>Split case allocation</MenuItem>
                                        )}
                                        <MenuItem value={3}>Part verification</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Choose Allocation Radio Buttons */}
                            {(caseAllocationType === 1 || caseAllocationType === 3) && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <RadioGroup
                                        value={chooseAllocation}
                                        onChange={(e) => setChooseAllocation(Number(e.target.value))}
                                    >
                                        {roleName === 'Regional Manager' && (
                                            <>
                                                <FormControlLabel
                                                    value={1}
                                                    control={<Radio />}
                                                    label="Assign to agency"
                                                />
                                                <FormControlLabel
                                                    value={2}
                                                    control={<Radio />}
                                                    label="Assign to internal team"
                                                />
                                            </>
                                        )}
                                        {roleName === 'Agency Spoc' && (
                                            <>
                                                <FormControlLabel
                                                    value={4}
                                                    control={<Radio />}
                                                    label="Accept & Assign to Field Officer"
                                                />
                                                <FormControlLabel
                                                    value={3}
                                                    control={<Radio />}
                                                    label="Assign to self"
                                                />
                                            </>
                                        )}
                                        {roleName !== 'Regional Manager' && (caseAllocationType === 1 || caseAllocationType === 3) && (
                                            <FormControlLabel
                                                value={3}
                                                control={<Radio />}
                                                label="Assign to self"
                                            />
                                        )}
                                    </RadioGroup>
                                </Grid>
                            )}
                        </Grid>

                        {/* Part Verification Category */}
                        {caseAllocationType === 3 && (
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Verification Category</InputLabel>
                                        <Select
                                            value={verificationCategory}
                                            onChange={(e) => setVerificationCategory(e.target.value)}
                                            disabled={roleName !== 'Regional Manager'}
                                        >
                                            <MenuItem value="">--- Choose Verification category ---</MenuItem>
                                            <MenuItem value="insured_verification_only">Insured verification only</MenuItem>
                                            <MenuItem value="hospital_verification_only">Hospital verification only</MenuItem>
                                            <MenuItem value="employer_verification_only">Employer verification only</MenuItem>
                                            <MenuItem value="insured+hospital_verification_only">Insured + Hospital verification only</MenuItem>
                                            <MenuItem value="insured+employer_verification_only">Insured + Employer verification only</MenuItem>
                                            <MenuItem value="hospital+employer_verification_only">Hospital + Employer verification only</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}

                        {/* Full Case / Part Verification - Assign to Agency */}
                        {((caseAllocationType === 1 && chooseAllocation === 1) || (caseAllocationType === 3 && chooseAllocation === 1)) && (
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        {roleName === 'Regional Manager' && (
                                            <>
                                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                    Assigning investigation to Agency
                                                </Typography>
                                                <RadioGroup
                                                    value={agencyRadioValue}
                                                    onChange={(e) => setAgencyRadioValue(Number(e.target.value))}
                                                >
                                                    <FormControlLabel
                                                        value={0}
                                                        control={<Radio />}
                                                        label="System Suggested Agencies"
                                                    />
                                                    <FormControlLabel
                                                        value={1}
                                                        control={<Radio />}
                                                        label="Choose Agency for Investigation"
                                                    />
                                                </RadioGroup>

                                                {/* Manual Agency Selection */}
                                                {agencyRadioValue === 1 && (
                                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                                        <InputLabel>Choose Agency</InputLabel>
                                                        <Select
                                                            value={agencyCode}
                                                            onChange={(e) => {
                                                                setAgencyCode(e.target.value);
                                                                fetchPerformanceIndex(e.target.value);
                                                            }}
                                                        >
                                                            <MenuItem value="">--- Choose Agency ---</MenuItem>
                                                            {agencyList.map((agency: any) => (
                                                                <MenuItem key={agency.agencyCode} value={agency.agencyCode}>
                                                                    {agency.agencyName}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}

                                                {/* System Suggested Agencies Table */}
                                                {agencyRadioValue === 0 && (
                                                    <TableContainer sx={{ mt: 2 }}>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>#</TableCell>
                                                                    <TableCell>Agency Name</TableCell>
                                                                    <TableCell>Applied Rule</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {systemSuggestedAgencyList.map((agency: any) => (
                                                                    <TableRow key={agency.agencyCode}>
                                                                        <TableCell>
                                                                            <Radio
                                                                                checked={agencyCode === agency.agencyCode}
                                                                                onChange={() => {
                                                                                    setAgencyCode(agency.agencyCode);
                                                                                    fetchPerformanceIndex(agency.agencyCode);
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>{agency.agencyName}</TableCell>
                                                                        <TableCell>{agency.ruleCode}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                )}
                                            </>
                                        )}
                                    </Paper>
                                </Grid>

                                {/* Performance Index */}
                                {/* @ts-ignore */}
                                {performanceIndex && (roleName === 'Regional Manager' || roleName === 'Central Manager') && (
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                Performance Index
                                            </Typography>
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>Total No.cases assigned in last 2 days</TableCell>
                                                            <TableCell>{performanceIndex.totalNoOfCases}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Open Cases</TableCell>
                                                            <TableCell>{performanceIndex.openCases}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Last Month Hit Ratio</TableCell>
                                                            <TableCell>{performanceIndex.lastMonthHitRatio}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Average Rating</TableCell>
                                                            <TableCell>{performanceIndex.averageRating}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        )}

                        {/* Full Case / Part Verification - Assign to Field Officer (Agency Spoc) */}
                        {((caseAllocationType === 1 && chooseAllocation === 4) || (caseAllocationType === 3 && chooseAllocation === 4)) && (
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        {roleName === 'Agency Spoc' && (
                                            <>
                                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                    Assigning investigation to Field Officer
                                                </Typography>
                                                <RadioGroup
                                                    value={agencyRadioValue}
                                                    onChange={(e) => setAgencyRadioValue(Number(e.target.value))}
                                                >
                                                    <FormControlLabel
                                                        value={11}
                                                        control={<Radio />}
                                                        label="Choose Field Officer for investigation"
                                                    />
                                                </RadioGroup>

                                                {agencyRadioValue === 11 && (
                                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                                        <InputLabel>Choose Field officer</InputLabel>
                                                        <Select
                                                            value={agencyCode}
                                                            onChange={(e) => setAgencyCode(e.target.value)}
                                                        >
                                                            <MenuItem value="">--- Choose Field officer ---</MenuItem>
                                                            {fieldOfficerList.map((officer: any) => (
                                                                <MenuItem key={officer.userCode} value={officer.userCode}>
                                                                    {officer.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            </>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}

                        {/* Full Case / Part Verification - Assign to Internal Team */}
                        {((caseAllocationType === 1 || caseAllocationType === 3) && chooseAllocation === 2) && (
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Assigning investigation to internal team</InputLabel>
                                        <Select
                                            value={internalTeamMemCode}
                                            onChange={(e) => setInternalTeamMemCode(e.target.value)}
                                        >
                                            <MenuItem value="">--- Choose Internal Team Member ---</MenuItem>
                                            <MenuItem value="assignToSelf">Assign to self</MenuItem>
                                            {claimDetails?.canAssignToInternalTeam === 'Yes' &&
                                                assignUsers.map((user: any) => (
                                                    <MenuItem key={user.userCode} value={user.userCode}>
                                                        {user.name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}

                        {/* Split Case Allocation */}
                        {caseAllocationType === 2 && (
                            <Box sx={{ mb: 3 }}>
                                {/* Insured Person Visit */}
                                {response?.insuredPersonVisit && (
                                    <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                        <Grid size={{ xs: 12, md: 2 }}>
                                            <Typography variant="subtitle2">Insured person visit</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <FormControl fullWidth>
                                                <InputLabel>Choose Agency</InputLabel>
                                                <Select
                                                    value={ipvAgencyCode}
                                                    onChange={(e) => handleIpvAgencyChange(e.target.value)}
                                                    disabled={disabledIpvAgency}
                                                >
                                                    <MenuItem value="">--- Choose Agency ---</MenuItem>
                                                    {roleName === 'Regional Manager' &&
                                                        agencyList.map((agency: any) => (
                                                            <MenuItem key={agency.agencyCode} value={agency.agencyCode}>
                                                                {agency.agencyName}
                                                            </MenuItem>
                                                        ))}
                                                    {roleName === 'Agency Spoc' && (
                                                        <>
                                                            <MenuItem value="assignToSelf">Assign to self</MenuItem>
                                                            {fieldOfficerList.map((officer: any) => (
                                                                <MenuItem key={officer.userCode} value={officer.userCode}>
                                                                    {officer.name}
                                                                </MenuItem>
                                                            ))}
                                                        </>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {roleName === 'Regional Manager' && (
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Choose Internal</InputLabel>
                                                    <Select
                                                        value={ipvAgencyCode}
                                                        onChange={(e) => handleIpvInternalChange(e.target.value)}
                                                        disabled={disabledIpvInternal}
                                                    >
                                                        <MenuItem value="">--- Choose Internal ---</MenuItem>
                                                        <MenuItem value="assignToSelf">Assign to self</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}

                                {/* Hospital Visit */}
                                {response?.hospitalVisit && (
                                    <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                        <Grid size={{ xs: 12, md: 2 }}>
                                            <Typography variant="subtitle2">Hospital Visit</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <FormControl fullWidth>
                                                <InputLabel>Choose Agency</InputLabel>
                                                <Select
                                                    value={hvAgencyCode}
                                                    onChange={(e) => handleHvAgencyChange(e.target.value)}
                                                    disabled={disabledHvAgency}
                                                >
                                                    <MenuItem value="">--- Choose Agency ---</MenuItem>
                                                    {roleName === 'Regional Manager' &&
                                                        agencyList.map((agency: any) => (
                                                            <MenuItem key={agency.agencyCode} value={agency.agencyCode}>
                                                                {agency.agencyName}
                                                            </MenuItem>
                                                        ))}
                                                    {roleName === 'Agency Spoc' && (
                                                        <>
                                                            <MenuItem value="assignToSelf">Assign to self</MenuItem>
                                                            {fieldOfficerList.map((officer: any) => (
                                                                <MenuItem key={officer.userCode} value={officer.userCode}>
                                                                    {officer.name}
                                                                </MenuItem>
                                                            ))}
                                                        </>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {roleName === 'Regional Manager' && (
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Choose Internal</InputLabel>
                                                    <Select
                                                        value={hvAgencyCode}
                                                        onChange={(e) => handleHvInternalChange(e.target.value)}
                                                        disabled={disabledHvInternal}
                                                    >
                                                        <MenuItem value="">--- Choose Internal ---</MenuItem>
                                                        <MenuItem value="assignToSelf">Assign to self</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}

                                {/* Employer Visit */}
                                {response?.employeerVisit && (
                                    <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                        <Grid size={{ xs: 12, md: 2 }}>
                                            <Typography variant="subtitle2">Employer Visit</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4 }}>
                                            <FormControl fullWidth>
                                                <InputLabel>Choose Agency</InputLabel>
                                                <Select
                                                    value={evAgencyCode}
                                                    onChange={(e) => handleEvAgencyChange(e.target.value)}
                                                    disabled={disabledEvAgency}
                                                >
                                                    <MenuItem value="">--- Choose Agency ---</MenuItem>
                                                    {roleName === 'Regional Manager' &&
                                                        agencyList.map((agency: any) => (
                                                            <MenuItem key={agency.agencyCode} value={agency.agencyCode}>
                                                                {agency.agencyName}
                                                            </MenuItem>
                                                        ))}
                                                    {roleName === 'Agency Spoc' && (
                                                        <>
                                                            <MenuItem value="assignToSelf">Assign to self</MenuItem>
                                                            {fieldOfficerList.map((officer: any) => (
                                                                <MenuItem key={officer.userCode} value={officer.userCode}>
                                                                    {officer.name}
                                                                </MenuItem>
                                                            ))}
                                                        </>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {roleName === 'Regional Manager' && (
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Choose Internal</InputLabel>
                                                    <Select
                                                        value={evAgencyCode}
                                                        onChange={(e) => handleEvInternalChange(e.target.value)}
                                                        disabled={disabledEvInternal}
                                                    >
                                                        <MenuItem value="">--- Choose Internal ---</MenuItem>
                                                        <MenuItem value="assignToSelf">Assign to self</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}
                            </Box>
                        )}
                    </Box>
                )}

                {/* Performance Index for Cashless (if not already shown) */}
                {performanceIndex && claimType === 'cashless' && roleName !== 'Central Manager' && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    Performance Index
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Total No.cases assigned in last 2 days</TableCell>
                                                <TableCell>{performanceIndex.totalNoOfCases}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Open Cases</TableCell>
                                                <TableCell>{performanceIndex.openCases}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Last Month Hit Ratio</TableCell>
                                                <TableCell>{performanceIndex.lastMonthHitRatio}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Average Rating</TableCell>
                                                <TableCell>{performanceIndex.averageRating}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {/* Documents Section */}
                <DocumentUpload
                    roleName={roleName}
                    investigationId={cleanInvestigationId}
                    investigationDocs={investigationDocs}
                    documentsCodes={documentsCodes}
                    setDocumentsCodes={setDocumentsCodes}
                    onDocsUpdate={fetchInvestigationDocs}
                />

                {/* Questionnaire Section */}
                <QuestionnaireSection
                    investigationId={cleanInvestigationId}
                    selectedInsuredQuestions={selectedInsuredQuestions}
                    setSelectedInsuredQuestions={setSelectedInsuredQuestions}
                    selectedTreatingDoctorQuestions={selectedTreatingDoctorQuestions}
                    setSelectedTreatingDoctorQuestions={setSelectedTreatingDoctorQuestions}
                    customInsuredQuestions={customInsuredQuestions}
                    setCustomInsuredQuestions={setCustomInsuredQuestions}
                    customTreatingDoctorQuestions={customTreatingDoctorQuestions}
                    setCustomTreatingDoctorQuestions={setCustomTreatingDoctorQuestions}
                />

                {/* Major Trigger */}
                {roleName === 'Regional Manager' && (
                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth>
                            <InputLabel>Major Trigger *</InputLabel>
                            <Select value={majorTrigger} onChange={(e) => setMajorTrigger(e.target.value)}>
                                <MenuItem value="">--- Select Major Trigger ---</MenuItem>
                                <MenuItem value="Genuinity">Genuinity</MenuItem>
                                <MenuItem value="Exclusion">Exclusion</MenuItem>
                                <MenuItem value="PED">PED</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )}

                {/* Instructions */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Instruction (if any)"
                        value={acceptInstruction}
                        onChange={(e) => setAcceptInstruction(e.target.value)}
                    />
                </Box>

                {/* Submit Button */}
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={roleName === 'Regional Manager' && !majorTrigger}
                    sx={{ minWidth: 200 }}
                >
                    Submit
                </Button>
            </Paper>
        </Box>
    );
};

export default AcceptInternalTeam;