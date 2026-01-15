// src/components/CentralNewCasesTabs/components/ClaimDetailsReim.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Divider,
} from '@mui/material';
import { claimsService } from '../../../services/claims.service';
import { encryptionService } from '../../../utils/encryption.service';
import { format } from 'date-fns';

interface ClaimDetailsReimProps {
  claimsType: string;
  claimDetails: any
}

interface ClaimDetails {
  tpaName?: string;
  diagnosis?: string;
  claimType?: string;
  claimClassification?: string;
  policyNo?: string;
  claimAmount?: number;
  policyEndDate?: string;
}


const ClaimDetailsReim: React.FC<ClaimDetailsReimProps> = ({ claimDetails, claimsType }) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  // const [claimDetails, setClaimDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);


  const decrypt = (value: string | undefined): string => {
    if (!value || value === '-') {
      return '-';
    }
    return encryptionService.decryptJAVA(value);
  };

  const formatDate = (date: string | undefined): string => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'd MMM yyyy');
    } catch {
      return '-';
    }
  };

  const formatCurrency = (amount: number | undefined): string => {
    if (!amount) return '-';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: '#2E5A96' }}/>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Card
        sx={{
          boxShadow: 3,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        {/* <Box
          sx={{
            background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
            p: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: 'white', fontWeight: 700 }}
          >
            Claim Details - {claimsType === 'reim' ? 'Reimbursement' : 'Cashless'}
          </Typography>
        </Box> */}

        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              {/* TPA Name */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'text.secondary',
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  TPA Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {claimDetails?.tpaName || '-'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Diagnosis */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'text.secondary',
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Diagnosis
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {claimDetails?.diagnosis}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Claim Type */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'text.secondary',
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Claim Type
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: 'text.secondary',
                    mb: 1,
                    fontStyle: 'italic',
                  }}
                >
                  (Claim/Pre-post/OPD / In Patient Hospitalization)
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {claimDetails?.claimType || '-'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Claim Classification */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'text.secondary',
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Claim Classification
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: 'text.secondary',
                    mb: 1,
                    fontStyle: 'italic',
                  }}
                >
                  Member Reimbursement / Network Reimbursement / Cashless
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {claimDetails?.claimClassification || '-'}
                </Typography>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Policy No */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'text.secondary',
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Policy No
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {claimDetails?.policyNo}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Claim Amount */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'text.secondary',
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Claim Amount
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                  }}
                >
                  {formatCurrency(claimDetails?.claimAmount)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Policy End Date */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'text.secondary',
                    mb: 1,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Policy End Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formatDate(claimDetails?.policEndDate)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Additional Info Box */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              bgcolor: 'info.lighter',
              borderRadius: 2,
              borderLeft: 4,
              borderColor: 'info.main',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> This page displays reimbursement claim details. 
              For detailed billing information, please check the other tabs.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClaimDetailsReim;