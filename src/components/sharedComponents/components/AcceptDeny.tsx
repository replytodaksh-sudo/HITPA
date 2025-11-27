// src/components/AcceptDeny.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  Typography,
} from '@mui/material';
import DenyForm from './DenyForm';
import AcceptAgencies from './acceptAgency';
import AcceptInternalTeam from './AcceptInternalTeam';

interface AcceptDenyProps {
  claimType: string;
  accid: string;
  invsid: string;
  invesType: string;
  invesSubType: string;
}

const AcceptDeny: React.FC<AcceptDenyProps> = ({
  claimType,
  accid,
  invsid,
  invesType,
  invesSubType,
}) => {
  const [statusInsuredVisit, setStatusInsuredVisit] = useState<string>('');
  const [roleName, setRoleName] = useState<string>('');
  const [displayDeny, setDisplayDeny] = useState<boolean>(true);

  useEffect(() => {
    // Get role name from session storage
    const role = sessionStorage.getItem('roleName') || '';
    setRoleName(role);

    // Optional: Disable deny option for specific cases
    // if ((role === 'Agency Spoc' || role === 'Field Officer') && invesType === 'Split case allocation') {
    //   setDisplayDeny(false);
    // }
  }, [invesType]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusInsuredVisit(event.target.value);
  };

  // Helper function to check if option should be displayed
  const shouldShowOption = (roles: string[], claimTypes: string[] = ['cashless', 'reim']): boolean => {
    return roles.includes(roleName) && claimTypes.includes(claimType);
  };

console.log("roleName", roleName, claimType)

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            name="acceptAssignRad"
            value={statusInsuredVisit}
            onChange={handleChange}
          >
            {/* Regional Manager - Cashless - Accept & Assign to Agency */}
            {shouldShowOption(['Regional Manager'], ['cashless']) && (
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Accept & Assign to Agency for investigation"
                sx={{ mb: 2 }}
              />
            )}
            
            {shouldShowOption(['Regional Manager'], ['cashless']) && (
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="Accept & Assign to interal team for investigation"
                sx={{ mb: 2 }}
              />
            )}

            {/* Regional Manager - Cashless - Accept & Assign to Internal Team */}
            {shouldShowOption(['Regional Manager'], ['cashless']) && (
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="Accept & Assign to internal team for investigation"
                sx={{ mb: 2 }}
              />
            )}

            {/* Agency Spoc - Cashless - Accept & Assign to Field Officer */}
            {shouldShowOption(['Agency Spoc'], ['cashless']) && (
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Accept & Assign to Field Officer"
                sx={{ mb: 2 }}
              />
            )}

            {/* Agency Spoc - Cashless - Accept & Keep with Agency Central */}
            {shouldShowOption(['Agency Spoc'], ['cashless']) && (
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="Accept & Keep with Agency Central"
                sx={{ mb: 2 }}
              />
            )}

            {/* Central Manager/QC - Both Cashless & Reim - Assign to Regional Team */}
            {((shouldShowOption(['Central Manager', 'Central QC'], ['cashless'])) ||
              (shouldShowOption(['Central Manager', 'Central QC'], ['reim']))) && (
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Accept & assign to Regional Team Member"
                  sx={{ mb: 2 }}
                />
              )}

            {/* Regional Manager/Agency Spoc - Reim - Accept & Assign for Investigation */}
            {shouldShowOption(['Regional Manager', 'Agency Spoc'], ['reim']) && (
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="Accept & assign for investigation"
                sx={{ mb: 2 }}
              />
            )}

            {/* Deny Option - Shown to Regional Manager, Agency Spoc, Central Manager */}
            {shouldShowOption(['Regional Manager', 'Agency Spoc', 'Central Manager']) && displayDeny && (
              <FormControlLabel
                value="3"
                control={<Radio />}
                label="Deny"
                sx={{ mb: 2 }}
              />
            )}
          </RadioGroup>
        </FormControl>

        {/* Conditional rendering based on selected option */}
        <Box sx={{ mt: 3 }}>
          {/* Option 1: Accept & Assign to Agency */}
          {/* {(statusInsuredVisit === '1' || statusInsuredVisit === '2') && (
            <AcceptAgencies
              mode={statusInsuredVisit === '2' ? "internal-team" : statusInsuredVisit === '1' ? "agency" : ""}
              claimType={claimType}
              investigationType={invesType}
              investigationSubType={invesSubType}
              accid={accid}
            />
          )}

          {statusInsuredVisit === '2' && (
            <AcceptInternalTeam
              claimType={claimType}
              accid={accid}
            />
          )}

          {statusInsuredVisit === '3' && (
            <DenyForm
              claimType={claimType}
              invesType={invesType}
              invesSubType={invesSubType}
              acceptAssId={accid}
            />
          )} */}

          {statusInsuredVisit === '1' && (
            <AcceptAgencies
              investigationType={invesType}
              investigationSubType={invesSubType}
              accid={accid}
              // claimType={claimType}
            />
          )}

          {/* Option 2: Accept & Assign to Internal Team */}
          {statusInsuredVisit === '2' && (
            <AcceptInternalTeam
              claimType={claimType}
              accid={accid}
            />
          )}

          {/* Option 3: Deny */}
          {statusInsuredVisit === '3' && (
            <DenyForm
              invesType={invesType}
              invesSubType={invesSubType}
              acceptAssId={accid}
              claimType={claimType}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AcceptDeny;


// ============================================================================
// PLACEHOLDER CHILD COMPONENTS (Create these separately)
// ============================================================================

/*
// src/components/AcceptAgencies.tsx
interface AcceptAgenciesProps {
  investigationType: string;
  investigationSubType: string;
  accid: string;
}

const AcceptAgencies: React.FC<AcceptAgenciesProps> = ({
  investigationType,
  investigationSubType,
  accid,
}) => {
  return (
    <Box>
      <Typography variant="h6">Accept & Assign to Agency</Typography>
      {/* Your agency assignment form here *\/}
    </Box>
  );
};

export default AcceptAgencies;
*/

/*
// src/components/AcceptInternalTeam.tsx
interface AcceptInternalTeamProps {
  claimType: string;
  accid: string;
}

const AcceptInternalTeam: React.FC<AcceptInternalTeamProps> = ({
  claimType,
  accid,
}) => {
  return (
    <Box>
      <Typography variant="h6">Accept & Assign to Internal Team</Typography>
      {/* Your internal team assignment form here *\/}
    </Box>
  );
};

export default AcceptInternalTeam;
*/

/*
// src/components/DenyForm.tsx
interface DenyFormProps {
  invesType: string;
  invesSubType: string;
  acceptAssId: string;
}

const DenyForm: React.FC<DenyFormProps> = ({
  invesType,
  invesSubType,
  acceptAssId,
}) => {
  return (
    <Box>
      <Typography variant="h6">Deny Investigation</Typography>
      {/* Your deny form here *\/}
    </Box>
  );
};

export default DenyForm;
*/