import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Grid,
    Paper,
    IconButton,
    FormControlLabel,
    Checkbox,
    Alert,
    Divider,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

// Reuse components from AcceptAgencies
import QuestionnaireSection from './QuestionnaireSection';
import DocumentUpload from './DocumentUpload';

// Import services
import { AssignService } from '../../../services/assign.service';
import { DocumentService } from '../../../services/document.service';

interface AcceptInternalTeamProps {
    claimType: string;
    accid: string;
}

interface TeamMember {
    userCode: string;
    userName: string;
    userType: string;
}

interface Question {
    questionId: string;
    questionText: string;
    answerType: string;
    options?: string[];
}

interface CustomQuestion {
    id: string;
    question: string;
    answerType: 'text' | 'radio' | 'checkbox';
    options: string[];
}

const AcceptInternalTeam: React.FC<AcceptInternalTeamProps> = ({ claimType, accid }) => {
    const navigate = useNavigate();
    const { investigationId } = useParams<{ investigationId: string }>();
    const roleName = sessionStorage.getItem('roleName') || '';

    // State Management
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [instructions, setInstructions] = useState('');
    const [isMajorTrigger, setIsMajorTrigger] = useState(false);

    // Reimbursement specific states
    const [caseAllocationType, setCaseAllocationType] = useState(''); // full/split/part
    const [splitUsers, setSplitUsers] = useState<string[]>(['', '']);
    const [partCaseType, setPartCaseType] = useState(''); // document_verification/field_verification

    // Documents - for DocumentUpload component
    const [investigationDocs, setInvestigationDocs] = useState<any[]>([]);
    const [documentsCodes, setDocumentsCodes] = useState<string[]>([]);

    // Questionnaire - for QuestionnaireSection component (cashless only)
    const [selectedInsuredQuestions, setSelectedInsuredQuestions] = useState<string[]>([]);
    const [selectedTreatingDoctorQuestions, setSelectedTreatingDoctorQuestions] = useState<string[]>([]);
    const [customInsuredQuestions, setCustomInsuredQuestions] = useState<string[]>([]);
    const [customTreatingDoctorQuestions, setCustomTreatingDoctorQuestions] = useState<string[]>([]);

    // Loading & Error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch team members and documents on mount
    useEffect(() => {
        fetchTeamMembers();
        if (investigationId) {
            fetchDocuments();
        }
    }, [investigationId]);

    const fetchTeamMembers = async () => {
        try {
            const response:any = await AssignService.getAvailableInternalTeam();
            if (response.statusCode === 0) {
                setTeamMembers(response.payload);
            }
        } catch (err) {
            setError('Failed to fetch team members');
        }
    };

    const fetchDocuments = async () => {
        try {
            const response:any = await DocumentService.viewInvestigationDocsView('', investigationId || '');
            if (response.data.statusCode === 0) {
                setInvestigationDocs(response.data.payload);
            }
        } catch (err) {
            console.error('Failed to fetch documents:', err);
        }
    };

    // Split Case Handlers
    const handleAddSplitUser = () => {
        if (splitUsers.length < 5) {
            setSplitUsers((prev) => [...prev, '']);
        }
    };

    const handleRemoveSplitUser = (index: number) => {
        if (splitUsers.length > 2) {
            setSplitUsers((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleSplitUserChange = (index: number, value: string) => {
        setSplitUsers((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    // Form Submission
    const handleSubmit = async () => {
        // Validation
        if (claimType === 'reim' && !caseAllocationType) {
            setError('Please select case allocation type');
            return;
        }

        if (caseAllocationType === 'full' && !selectedMember) {
            setError('Please select a team member');
            return;
        }

        if (caseAllocationType === 'split') {
            const validUsers = splitUsers.filter((u) => u.trim());
            if (validUsers.length < 2) {
                setError('Please select at least 2 users for split allocation');
                return;
            }
        }

        if (caseAllocationType === 'part') {
            if (!partCaseType) {
                setError('Please select part case type');
                return;
            }
            if (!selectedMember) {
                setError('Please select a team member');
                return;
            }
        }

        if (claimType === 'cashless' && !selectedMember) {
            setError('Please select a team member');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Prepare payload
            const payload: any = {
                acceptAssignmentId: accid,
                investigationId: investigationId,
                instructions: instructions,
                isMajorTrigger: isMajorTrigger,
                documents: documentsCodes, // From DocumentUpload component
            };

            // Add questionnaire data if available (cashless only)
            if (claimType === 'cashless') {
                payload.questions = {
                    insured: [
                        ...selectedInsuredQuestions.map((q:any) => ({ questionId: q.questionId, isCustom: false })),
                        ...customInsuredQuestions.map((q:any) => ({ ...q, isCustom: true })),
                    ],
                    treatingDoctor: [
                        ...selectedTreatingDoctorQuestions.map((q:any) => ({ questionId: q.questionId, isCustom: false })),
                        ...customTreatingDoctorQuestions.map((q:any) => ({ ...q, isCustom: true })),
                    ],
                };
            }

            if (claimType === 'cashless') {
                payload.assignedTo = selectedMember;
                payload.assignmentType = 'internal_team';
            } else if (claimType === 'reim') {
                payload.caseAllocationType = caseAllocationType;

                if (caseAllocationType === 'full') {
                    payload.assignedTo = selectedMember;
                } else if (caseAllocationType === 'split') {
                    payload.splitUsers = splitUsers.filter((u) => u.trim());
                } else if (caseAllocationType === 'part') {
                    payload.assignedTo = selectedMember;
                    payload.partCaseType = partCaseType;
                }
            }

            // Submit assignment
            const response:any = await AssignService.assignToInternalTeam(payload);

            if (response.data.statusCode === 0) {
                alert('Assignment completed successfully!');
                navigate('/investigations');
            } else {
                setError(response.data.message || 'Assignment failed');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to submit assignment');
        } finally {
            setLoading(false);
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
                <Typography variant="h6" gutterBottom sx={{ color: '#6F62C2', fontWeight: 600 }}>
                    Assign to Internal Team
                </Typography>

                <Grid container spacing={3}>
                    {/* Reimbursement Case Allocation Type */}
                    {claimType === 'reim' && (
                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth>
                                <InputLabel>Case Allocation Type *</InputLabel>
                                <Select
                                    value={caseAllocationType}
                                    onChange={(e) => {
                                        setCaseAllocationType(e.target.value);
                                        setSelectedMember('');
                                        setSplitUsers(['', '']);
                                        setPartCaseType('');
                                    }}
                                    label="Case Allocation Type *"
                                >
                                    <MenuItem value="full">Full Case Allocation</MenuItem>
                                    <MenuItem value="split">Split Case Allocation</MenuItem>
                                    <MenuItem value="part">Part Case Allocation</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    {/* Full Case Allocation - Single User */}
                    {(claimType === 'cashless' || caseAllocationType === 'full') && (
                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth>
                                <InputLabel>
                                    {roleName === 'Regional Manager'
                                        ? 'Assigning investigation to internal team'
                                        : 'Select Team Member'}{' '}
                                    *
                                </InputLabel>
                                <Select
                                    value={selectedMember}
                                    onChange={(e) => setSelectedMember(e.target.value)}
                                    label="Select Team Member *"
                                >
                                    {teamMembers.map((member:any) => (
                                        <MenuItem key={member.userCode} value={member.userCode}>
                                            {member.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    {/* Split Case Allocation - Multiple Users */}
                    {caseAllocationType === 'split' && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                Split Case Allocation (2-5 users)
                            </Typography>

                            {splitUsers.map((user, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                    <FormControl fullWidth>
                                        <InputLabel>User {index + 1} *</InputLabel>
                                        <Select
                                            value={user}
                                            onChange={(e) => handleSplitUserChange(index, e.target.value)}
                                            label={`User ${index + 1} *`}
                                        >
                                            {teamMembers.map((member:any) => (
                                                <MenuItem key={member.userCode} value={member.userCode}>
                                                    {member.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {splitUsers.length > 2 && (
                                        <IconButton color="error" onClick={() => handleRemoveSplitUser(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}

                            {splitUsers.length < 5 && (
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={handleAddSplitUser}
                                    variant="outlined"
                                    size="small"
                                >
                                    Add User
                                </Button>
                            )}
                        </Grid>
                    )}

                    {/* Part Case Allocation */}
                    {caseAllocationType === 'part' && (
                        <>
                            <Grid size={{xs:12, md:6}}>
                                <FormControl fullWidth>
                                    <InputLabel>Part Case Type *</InputLabel>
                                    <Select
                                        value={partCaseType}
                                        onChange={(e) => setPartCaseType(e.target.value)}
                                        label="Part Case Type *"
                                    >
                                        <MenuItem value="document_verification">Document Verification</MenuItem>
                                        <MenuItem value="field_verification">Field Verification</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{xs:12, md:6}}>
                                <FormControl fullWidth>
                                    <InputLabel>Assign To *</InputLabel>
                                    <Select
                                        value={selectedMember}
                                        onChange={(e) => setSelectedMember(e.target.value)}
                                        label="Assign To *"
                                    >
                                        {teamMembers.map((member:any) => (
                                            <MenuItem key={member.userCode} value={member.userCode}>
                                                {member.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </>
                    )}

                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                    </Grid>

                    {/* Document Upload Section - REUSED COMPONENT */}
                    <Grid size={{ xs: 12 }}>
                        <DocumentUpload
                            roleName={roleName}
                            investigationId={investigationId || ''}
                            investigationDocs={investigationDocs}
                            documentsCodes={documentsCodes}
                            setDocumentsCodes={setDocumentsCodes}
                            onDocsUpdate={fetchDocuments}
                        />
                    </Grid>

                    {/* Questionnaire Section - REUSED COMPONENT (Cashless Only) */}
                    {claimType === 'cashless' && (
                        <>
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 2 }} />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <QuestionnaireSection
                                    investigationId={investigationId || ''}
                                    selectedInsuredQuestions={selectedInsuredQuestions}
                                    setSelectedInsuredQuestions={setSelectedInsuredQuestions}
                                    selectedTreatingDoctorQuestions={selectedTreatingDoctorQuestions}
                                    setSelectedTreatingDoctorQuestions={setSelectedTreatingDoctorQuestions}
                                    customInsuredQuestions={customInsuredQuestions}
                                    setCustomInsuredQuestions={setCustomInsuredQuestions}
                                    customTreatingDoctorQuestions={customTreatingDoctorQuestions}
                                    setCustomTreatingDoctorQuestions={setCustomTreatingDoctorQuestions}
                                />
                            </Grid>
                        </>
                    )}

                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                    </Grid>

                    {/* Instructions */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Instructions"
                            multiline
                            rows={4}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Enter any special instructions for the investigation..."
                        />
                    </Grid>

                    {/* Major Trigger - Only for Regional Manager */}
                    {roleName === 'Regional Manager' && (
                        <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isMajorTrigger}
                                        onChange={(e) => setIsMajorTrigger(e.target.checked)}
                                    />
                                }
                                label="Mark as Major Trigger Investigation"
                            />
                        </Grid>
                    )}

                    {/* Submit Button */}
                    <Grid size={{ xs: 12 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{
                                background: 'linear-gradient(45deg, #6F62C2 30%, #9C89E3 90%)',
                                color: 'white',
                                px: 4,
                            }}
                        >
                            {loading ? 'Submitting...' : 'Submit Assignment'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AcceptInternalTeam;