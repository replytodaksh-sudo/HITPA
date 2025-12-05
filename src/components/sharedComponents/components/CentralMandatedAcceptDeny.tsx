// File: src/components/CentralMandatedAcceptDeny.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
} from '@mui/material';
import AcceptInternalTeam from './AcceptInternalTeam';
import AcceptAgencies from './acceptAgency';

interface CentralMandatedAcceptDenyProps {
  claimType: string;
}

const CentralMandatedAcceptDeny: React.FC<CentralMandatedAcceptDenyProps> = ({
  claimType,
}) => {
  const [statusInsuredVisit, setStatusInsuredVisit] = useState<string>('');
  const [roleName, setRoleName] = useState<string>('');

  useEffect(() => {
    // Get role from session storage
    const role = sessionStorage.getItem('roleName') || '';
    setRoleName(role);
    console.log(`${claimType} ${role}`);
  }, [claimType]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusInsuredVisit(event.target.value);
  };

  // Helper function to determine which radio options to show
  const getRadioOptions = () => {
    const options: { value: string; label: string }[] = [];

    // Regional Manager - Cashless
    if (roleName === 'Regional Manager' && claimType === 'cashless') {
      options.push(
        { value: '1', label: 'Accept & Assign to Agency for investigation' },
        {
          value: '2',
          label: 'Accept & Assign to internal team for investigation',
        }
      );
    }

    // Agency Spoc - Cashless
    if (roleName === 'Agency Spoc' && claimType === 'cashless') {
      options.push(
        { value: '1', label: 'Accept & Assign to Field Officer' },
        { value: '2', label: 'Accept & Keep with Agency Central' }
      );
    }

    // Central Manager OR Central QC - Cashless OR Reimbursement
    if (
      (roleName === 'Central Manager' || roleName === 'Central QC') &&
      (claimType === 'cashless' || claimType === 'reim')
    ) {
      options.push({
        value: '2',
        label: 'Accept & assign to Regional Team Member',
      });
    }

    // Regional Manager OR Agency Spoc - Reimbursement
    if (
      (roleName === 'Regional Manager' || roleName === 'Agency Spoc') &&
      claimType === 'reim'
    ) {
      options.push({
        value: '2',
        label: 'Accept & assign for investigation',
      });
    }

    return options;
  };

  const radioOptions = getRadioOptions();

  // If no options available for this role/claimType combination
  if (radioOptions.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No accept/deny options available for your role ({roleName}) and claim
          type ({claimType}).
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Accept & Assign Investigation
        </Typography>

        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <RadioGroup
            value={statusInsuredVisit}
            onChange={handleStatusChange}
            name="status-insured-visit"
          >
            {radioOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                sx={{ mb: 1 }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 2 }}
        >
          Role: {roleName} | Claim Type: {claimType}
        </Typography>
      </Paper>

      {/* Conditional Forms Based on Selection */}
      {statusInsuredVisit === '1' && (
        <Box sx={{ mt: 3 }}>
          <AcceptAgencies />
        </Box>
      )}

      {statusInsuredVisit === '2' && (
        <Box sx={{ mt: 3 }}>
          <AcceptInternalTeam claimType={claimType} />
        </Box>
      )}
    </Box>
  );
};

export default CentralMandatedAcceptDeny;