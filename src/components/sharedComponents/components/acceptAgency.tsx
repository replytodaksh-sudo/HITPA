import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';
import { agencyService } from '../../../services/agency.service';
import { QuestionService } from '../../../services/question.service';
import { DocumentsService } from '../../../services/document.service';
import { AssignService } from '../../../services/assign.service';
import AgencySelection from './AgencySelection';
import DocumentUpload from './DocumentUpload';
import QuestionnaireSection from './QuestionnaireSection';

interface AcceptAgenciesProps {
  investigationType?: string;
  investigationSubType?: string;
  accid?: string;
  reassign?: boolean
}

const AcceptAgencies: React.FC<AcceptAgenciesProps> = ({
  investigationType,
  investigationSubType,
  accid,
  reassign = false
}) => {
  const navigate = useNavigate();
  // const { investigationId } = useParams<{ investigationId: string }>();
  const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();

  const claimsType = searchParams.get('claimsType') || '';
  const redirectTo = searchParams.get('redirectTo') || '/admin/dashboard';

  // User role
  const [roleName, setRoleName] = useState('');

  // Agency selection
  const [agencyRadioValue, setAgencyRadioValue] = useState<number>(0);
  const [agencyCode, setAgencyCode] = useState('');
  const [agencyList, setAgencyList] = useState<any[]>([]);
  const [systemSuggestedAgencies, setSystemSuggestedAgencies] = useState<any[]>([]);
  const [fieldOfficerList, setFieldOfficerList] = useState<any[]>([]);
  const [performanceIndex, setPerformanceIndex] = useState<any>(null);

  // Documents
  const [documentsCodes, setDocumentsCodes] = useState<string[]>([]);
  const [investigationDocs, setInvestigationDocs] = useState<any[]>([]);

  // Questions
  const [selectedInsuredQuestions, setSelectedInsuredQuestions] = useState<string[]>([]);
  const [selectedTreatingDoctorQuestions, setSelectedTreatingDoctorQuestions] = useState<string[]>([]);
  const [customInsuredQuestions, setCustomInsuredQuestions] = useState<string[]>([]);
  const [customTreatingDoctorQuestions, setCustomTreatingDoctorQuestions] = useState<string[]>([]);

  // Form fields
  const [instruction, setInstruction] = useState('');
  const [majorTrigger, setMajorTrigger] = useState('');
  const [investigationId, setInvestigationId] = useState('');

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const invId = paramInvestigationId ? paramInvestigationId.split(' ')[0] : ''
    setInvestigationId(invId);
    const role = sessionStorage.getItem('roleName') || '';
    setRoleName(role);

    if (role === 'Agency Spoc') {
      fetchFieldOfficers();
    } else {
      fetchAgencies();
      fetchSystemSuggestedAgencies();
    }

    fetchDocuments();
  }, []);
  
  const fetchAgencies = async () => {
    try {
      const response: any = await agencyService.fetchAllAgency();
      if (response.statusCode === 0) {
        setAgencyList(response.payload);
      }
    } catch (err) {
      console.error('Error fetching agencies:', err);
    }
  };

  const fetchSystemSuggestedAgencies = async () => {
    try {
      const response: any = await agencyService.getSystemSuggestedAgency();
      if (response.statusCode === 0) {
        setSystemSuggestedAgencies(response.payload);
      }
    } catch (err) {
      console.error('Error fetching system suggested agencies:', err);
    }
  };

  const fetchFieldOfficers = async () => {
    try {
      const response: any = await agencyService.fetchAllFieldOfficer();
      if (response.statusCode === 0) {
        setFieldOfficerList(response.payload);
      }
    } catch (err) {
      console.error('Error fetching field officers:', err);
    }
  };

  const fetchDocuments = async () => {
    if (!investigationId) return;

    try {
      let uploadDuring = '';
      if (roleName === 'Regional Manager') {
        uploadDuring = 'caseAssignmentRegional';
      } else if (roleName === 'Agency Spoc') {
        uploadDuring = 'caseAssignmentAgency';
      } else if (roleName === 'Central Manager') {
        uploadDuring = 'caseAssignmentCentral';
      }

      const response: any = await DocumentsService.viewInvestigationDocsView(
        uploadDuring,
        investigationId
      );

      if (response.statusCode === 0) {
        setInvestigationDocs(response.payload);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  const handlePerformanceIndexFetch = async (selectedAgencyCode: string) => {
    try {
      const response: any = await agencyService.getPerformanceIndex(selectedAgencyCode);
      if (response.statusCode === 0) {
        setPerformanceIndex(response.payload);
      }
    } catch (err) {
      console.error('Error fetching performance index:', err);
    }
  };

  const validateForm = (): boolean => {
    if (!agencyCode) {
      setError('Please select an agency or field officer');
      return false;
    }

    if (!instruction) {
      setError('Please provide instructions');
      return false;
    }

    if (roleName === 'Regional Manager' && !majorTrigger) {
      setError('Please select a major trigger');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    console.log("payload", agencyCode)
    try {
      const questionCodes = [
        ...selectedInsuredQuestions,
        ...customInsuredQuestions,
        ...selectedTreatingDoctorQuestions,
        ...customTreatingDoctorQuestions,
      ];

      const payload: any = {
        acceptAssignId: accid,
        investigationId: investigationId,
        agencyCodes: [agencyCode],
        questionCodes,
        acceptInstruction: instruction,
        majorTrigger,
        documentsCodes,
      };
      let response: any;

      if (roleName === 'Agency Spoc') {
        response = await AssignService.assignFO(payload, documentsCodes);
      } else if (claimsType === 'reim') {
        payload.investigationCaseDTO = {
          investigationType,
          subTypeDTO: [{
            investigationSubType,
            assignTo: agencyCode,
          }],
        };
        response = await AssignService.reimAssign(payload, documentsCodes);
      } else {
        response = await AssignService.assign(payload, documentsCodes);
      }

      if (response.statusCode === 0) {
        alert('Assignment successful!');
        if (redirectTo) {
          navigate(redirectTo.replace('/investigation', ''));
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        alert(response.message);
        setError(response.message || 'Assignment failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Investigation Type - Only for Reimbursement */}
      {claimsType === 'reim' && !reassign && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Investigation Type:
                </Typography>
                <TextField
                  fullWidth
                  value={investigationType}
                  disabled
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Investigation Sub Type:
                </Typography>
                <TextField
                  fullWidth
                  value={investigationSubType}
                  disabled
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Agency/Field Officer Selection */}
      <AgencySelection
        roleName={roleName}
        agencyRadioValue={agencyRadioValue}
        setAgencyRadioValue={setAgencyRadioValue}
        agencyCode={agencyCode}
        setAgencyCode={setAgencyCode}
        agencyList={agencyList}
        systemSuggestedAgencies={systemSuggestedAgencies}
        fieldOfficerList={fieldOfficerList}
        performanceIndex={performanceIndex}
        onAgencyChange={handlePerformanceIndexFetch}
      />

      {/* Document Upload Section */}
      <DocumentUpload
        roleName={roleName}
        investigationId={investigationId || ''}
        investigationDocs={investigationDocs}
        documentsCodes={documentsCodes}
        setDocumentsCodes={setDocumentsCodes}
        onDocsUpdate={fetchDocuments}
      />

      {/* Questionnaire Section */}
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

      {/* Major Trigger - Regional Manager Only */}
      {roleName === 'Regional Manager' && (
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Major Trigger *</InputLabel>
            <Select
              value={majorTrigger}
              onChange={(e) => setMajorTrigger(e.target.value)}
              label="Major Trigger *"
            >
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
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Instruction (if any)
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Enter instructions here..."
        />
      </Box>

      {/* Submit Button */}
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading || (roleName === 'Regional Manager' && !majorTrigger)}
        sx={{
          background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
          color: "#fff !important",
          '&:hover': {
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          },
        }}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </Box>
  );
};

export default AcceptAgencies;