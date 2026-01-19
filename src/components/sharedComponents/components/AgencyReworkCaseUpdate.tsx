import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import caseUpdateService from '../../../services/caseupdate.service';
import AcceptAgencies from './acceptAgency';
import AcceptDeny from './AcceptDeny';
import PresentForm from './PresentForm';
import NotPresentForm from './NoPresentForm';

interface PreviousData {
  activeCaseID?: string;
  boolStatusOfInsured?: boolean;
  createdBy?: string;
  noDataStatus?: string;
  reworkCaseComments?: string;
  prevInvestigatorReport?: string;
  [key: string]: any;
}

interface AgencyReworkCaseUpdateProps {
  onDataLoaded?: (data: PreviousData) => void;
}

const AgencyReworkCaseUpdate: React.FC<AgencyReworkCaseUpdateProps> = ({ onDataLoaded }) => {
  const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();

  // State Management
  const [statusInsuredVisit, setStatusInsuredVisit] = useState<string>('');
  const [investigationId, setInvestigationId] = useState<string>('');
  const [previousData, setPreviousData] = useState<PreviousData>({});
  const [checkEditable, setCheckEditable] = useState<boolean>(false);
  const [fieldType, setFieldType] = useState<string>('');
  const [roleName, setRoleName] = useState<string>('');
  const [assignFieldOfficer, setAssignFieldOfficer] = useState<string>('No');
  const [accid, setAccid] = useState<string>('');
  const [claimsType, setClaimsType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  /**
   * Initialize component - Extract route parameters
   */
  useEffect(() => {
    const fieldTypeParam = searchParams.get('fieldType') || '';
    const claimsTypeParam = searchParams.get('claimsType') || '';
    setFieldType(fieldTypeParam);
    setClaimsType(claimsTypeParam);

    const role = sessionStorage.getItem('roleName') || '';
    setRoleName(role);

    getInvestigationId();
  }, [searchParams]);

  /**
   * Extract and clean investigation ID from route parameters
   */
  const getInvestigationId = () => {
    if (paramInvestigationId) {
      const cleanId = paramInvestigationId.split(' ')[0];
      setInvestigationId(cleanId);
    }
  };

  /**
   * Fetch saved form data from API
   */
  useEffect(() => {
    if (investigationId) {
      getSavedFormData();
    }
  }, [investigationId]);

  const getSavedFormData = async () => {
    setLoading(true);
    setError('');
    try {
      const response: any = await caseUpdateService.caseUpdatePreviousData(investigationId);

      if (response?.statusCode === 0) {
        setPreviousData(response.payload);

        // Store active case ID in localStorage
        if (response.payload?.activeCaseID) {
          localStorage.setItem('activeCaseID', response.payload.activeCaseID);
        }

        // Set insured visit status
        if (response.payload?.boolStatusOfInsured !== null && response.payload?.boolStatusOfInsured !== undefined) {
          setStatusInsuredVisit(response.payload.boolStatusOfInsured ? '1' : '0');
        }

        // Callback for parent component
        if (onDataLoaded) {
          onDataLoaded(response.payload);
        }

        checkIsEditable(response.payload);
      } else {
        setPreviousData(response?.payload || {});
        checkIsEditable(response?.payload || {});
      }
    } catch (err: any) {
      console.error('Error fetching saved form data:', err);
      setError('Failed to load case data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if form is editable based on status
   */
  const checkIsEditable = (data: PreviousData) => {
    if (!data) return;

    const noDataStatus = data.noDataStatus || '';

    if (noDataStatus === 'NonEditable') {
      setCheckEditable(true);
    } else if (noDataStatus === 'Editable') {
      setCheckEditable(false);
    }

    console.log('Form Editable Status:', noDataStatus);
  };

  /**
   * Handle insured visit status change
   */
  const handleStatusInsuredVisitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusInsuredVisit(e.target.value);
  };

  /**
   * Handle assign field officer change
   */
  const handleAssignFieldOfficerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignFieldOfficer(e.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }
console.log("previousData", previousData?.reworkCaseComments)
  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* REWORK CASE COMMENTS SECTION */}
      {previousData?.reworkCaseComments && fieldType === 'rework' && (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ color: '#776BC5', fontWeight: 700, display: 'inline' }}>
              Rework case:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, ml: 2, display: 'inline' }}>
              {previousData.reworkCaseComments}
            </Typography>
          </Box>

          {/* Assign Field Officer Radio Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, mb: 2 }}>
            <Typography variant="body2" sx={{ mt: 1.5 }}>
              Accept and assign to Field Officer
            </Typography>
            <RadioGroup
              row
              name="assignFieldOfficer"
              value={assignFieldOfficer}
              onChange={handleAssignFieldOfficerChange}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </Box>

          {/* Accept Agencies Component */}
          {assignFieldOfficer === 'Yes' && (
            <Box sx={{ mt: 2 }}>
              <AcceptAgencies accid={accid} />
            </Box>
          )}
        </Box>
      )}

      {/* REASSIGN SECTION */}
      {fieldType === 'reassign' && previousData?.reworkCaseComments && (
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
          <Typography variant="body1" sx={{ color: '#776BC5', fontWeight: 700, display: 'inline', mb: 2 }}>
            Rework case:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, ml: 2, display: 'inline', mb: 2 }}>
            {previousData.reworkCaseComments}
          </Typography>

          {/* Accept/Deny Component */}
          {previousData.prevInvestigatorReport !== 'yes' && (
            <Box sx={{ mt: 2 }}>
              <AcceptDeny claimType={claimsType} accid={accid} />
            </Box>
          )}
        </Box>
      )}

      {/* STATUS OF INSURED SECTION */}
      {checkEditable === false && assignFieldOfficer === 'No' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            Status of Insured at the time of Visit
          </Typography>

          <RadioGroup
            name="statusInsuredVisit"
            value={statusInsuredVisit}
            onChange={handleStatusInsuredVisitChange}
          >
            <FormControlLabel
              value="1"
              control={<Radio disabled={checkEditable} />}
              label="Present"
            />
            <FormControlLabel
              value="0"
              control={<Radio disabled={checkEditable} />}
              label="Not Present"
            />
          </RadioGroup>
        </Box>
      )}

      {/* PRESENT FORM SECTION */}
      {statusInsuredVisit === '1' && checkEditable === false && (
        <Container maxWidth="lg" sx={{ my: 3 }}>
          <PresentForm isFormEditable={checkEditable} payloadData={previousData} />
        </Container>
      )}

      {/* NOT PRESENT FORM SECTION */}
      {statusInsuredVisit === '0' && checkEditable === false && (
        <Container maxWidth="lg" sx={{ my: 3 }}>
          <NotPresentForm payloadData={previousData} isFormEditable={checkEditable} />
        </Container>
      )}
    </Box>
  );
};

export default AgencyReworkCaseUpdate;