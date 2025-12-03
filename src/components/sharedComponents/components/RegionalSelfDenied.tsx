// src/components/RegionalCompletedCase/RegionalSelfDenied.tsx

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import DeniedDenyForm from './DeniedDenyForm ';
import AcceptAgencies from './acceptAgency';
import AcceptInternalTeam from './AcceptInternalTeam';

interface RegionalSelfDeniedProps {
  claimType?: string;
}

const RegionalSelfDenied: React.FC<RegionalSelfDeniedProps> = ({
  claimType = '',
}) => {
  // State
  const [statusInsuredVisit, setStatusInsuredVisit] = useState<number>(0);
  const [denialAgencyJustified, setDenialAgencyJustified] = useState<string>('');
  const [roleName, setRoleName] = useState('');

  // Initialize
  useEffect(() => {
    const role = sessionStorage.getItem('roleName') || '';
    setRoleName(role);
    console.log(`${claimType} ${role}`);
  }, [claimType]);

  return (
    <Box sx={{ p: 2 }}>
      {/* Denied Deny Form - Always shows the denial information */}
      <Box sx={{ mb: 3 }}>
        <DeniedDenyForm />
      </Box>

      {/* Conditional Accept/Assign Components */}
      {/* Show Accept Agencies if status = 1 and denial was rejected (not justified) */}
      {statusInsuredVisit === 1 && denialAgencyJustified === '2' && (
        <Box sx={{ mt: 3 }}>
          <AcceptAgencies />
        </Box>
      )}

      {/* Show Accept Internal Team if status = 2 and denial was rejected (not justified) */}
      {statusInsuredVisit === 2 && denialAgencyJustified === '2' && (
        <Box sx={{ mt: 3 }}>
          <AcceptInternalTeam claimType={claimType} />
        </Box>
      )}
    </Box>
  );
};

export default RegionalSelfDenied;