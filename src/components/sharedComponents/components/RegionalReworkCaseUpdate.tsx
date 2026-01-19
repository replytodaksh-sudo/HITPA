// ===========================
// REGIONAL REWORK CASE UPDATE - COMPLETE COMPONENT
// ===========================

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Divider,
} from '@mui/material';
import NotPresentForm from './NoPresentForm';
import PresentForm from './PresentForm';
import AcceptDeny from './AcceptDeny';
import AcceptAgencies from './acceptAgency';
import caseUpdateService from '../../../services/caseupdate.service';


// ===========================
// INTERFACES
// ===========================
interface RouteParams extends Record<string, string | undefined> {
  investigationId: string;
}


// ===========================
// MAIN COMPONENT
// ===========================
const RegionalReworkCaseUpdate: React.FC = () => {
  const { investigationId } = useParams<RouteParams>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // ===========================
  // STATE
  // ===========================
  const [statusInsuredVisit, setStatusInsuredVisit] = useState('');
  const [previuosData, setPreviuosData] = useState<any>('');
  const [checkEditable, setCheckEditable] = useState(false);
  const [fieldType, setFieldType] = useState('');
  const [claimsType, setClaimsType] = useState('');
  const [assignFieldOfficer, setAssignFieldOfficer] = useState('No');
  const [accid] = useState<any>(null);

  // Get role name from session storage
  const roleName = sessionStorage.getItem('roleName') || '';

  // ===========================
  // LOAD DATA ON MOUNT
  // ===========================
  useEffect(() => {
    // Get query parameters
    const fieldTypeParam = searchParams.get('fieldType') || '';
    const claimsTypeParam = searchParams.get('claimsType') || '';
    
    setFieldType(fieldTypeParam);
    setClaimsType(claimsTypeParam);

    // Load case data
    if (investigationId) {
      getSavedFormData();
    }
  }, [investigationId]);

  // ===========================
  // FETCH CASE DATA
  // ===========================
  const getSavedFormData = async () => {
    try {
      const data = await caseUpdateService.caseUpdatePreviousData(investigationId!);
      
      if (data.statusCode === 0) {
        setPreviuosData(data.payload);
        
        // Save activeCaseID to localStorage
        if (data.payload.activeCaseID) {
          localStorage.setItem('activeCaseID', data.payload.activeCaseID);
        }
        
        // Set insured visit status
        if (data.payload.boolStatusOfInsured !== null) {
          setStatusInsuredVisit(data.payload.boolStatusOfInsured ? '1' : '0');
        }
        
        checkIsEditable(data.payload);
      } else {
        setPreviuosData(data.payload);
        checkIsEditable(data.payload);
      }
    } catch (error) {
      console.error('Error fetching case data:', error);
    }
  };

  // ===========================
  // CHECK IF EDITABLE
  // ===========================
  const checkIsEditable = (data: any) => {
    // Determine if form is editable based on noDataStatus
    if (data.noDataStatus === 'NonEditable') {
      setCheckEditable(true); // Form is disabled (read-only)
    } else if (data.noDataStatus === 'Editable') {
      setCheckEditable(false); // Form is enabled (editable)
    }
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <Box>
      {/* Rework Case Comments - For Rework Field Type */}
      {previuosData.reworkCaseComments && 
       fieldType === 'rework' && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Reinvestigation case:</strong> {previuosData.reworkCaseComments}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Accept and Assign to Field Officer */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ width: 300 }}>
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

          {/* Accept Agencies Component */}
          {assignFieldOfficer === 'Yes' && (
            <Box sx={{ mt: 2 }}>
              <AcceptAgencies accid={accid} />
            </Box>
          )}
        </Paper>
      )}

      {/* Rework Case Comments - For Reassign Field Type */}
      {fieldType === 'reassign' && 
       previuosData.reworkCaseComments && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Reinvestigation case:</strong> {previuosData.reworkCaseComments}
          </Typography>

          {/* Accept/Deny Component */}
          {previuosData.prevInvestigatorReport !== 'yes' && (
            <Box sx={{ mt: 2 }}>
              <AcceptDeny claimType={claimsType} accid={accid} />
            </Box>
          )}
        </Paper>
      )}

      {/* Status of Insured - Only if editable */}
      {!checkEditable && (
        <>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            Status of Insured at the time of Visit
          </Typography>

          <RadioGroup
            value={statusInsuredVisit}
            onChange={(e) => setStatusInsuredVisit(e.target.value)}
            sx={{ mb: 3 }}
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
        </>
      )}

      {/* Present Form */}
      {statusInsuredVisit === '1' && !checkEditable && (
        <Box className="container fiori-container">
          <PresentForm
            isFormEditable={checkEditable}
            payloadData={previuosData}
          />
        </Box>
      )}

      {/* Not Present Form */}
      {statusInsuredVisit === '0' && !checkEditable && (
        <Box className="container fiori-container">
          <NotPresentForm
            payloadData={previuosData}
            isFormEditable={checkEditable}
          />
        </Box>
      )}
    </Box>
  );
};

export default RegionalReworkCaseUpdate;