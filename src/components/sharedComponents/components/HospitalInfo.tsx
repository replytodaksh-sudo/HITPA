// src/components/CentralNewCasesTabs/components/HospitalInfo.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import { claimsService } from '../../../services/claims.service';
import { encryptionService } from '../../../utils/encryption.service';
import { format } from 'date-fns';

interface HospitalInfoProps {
  claimsType: string;
}

interface InsuredDetails {
  insuredName?: string;
  relationshipWithInsured?: string;
  age?: string;
  patientname?: string;
  memberId?: string;
  insuredGender?: string;
  insuredAddress?: string;
  insuredState?: string;
  insuredPincode?: string;
  insuredCity?: string;
  insuredContactNo?: string;
}

interface HospitalDetails {
  hospitalName?: string;
  hospitalCode?: string;
  hospitalInNetwork?: string;
  hospitalAddress?: string;
  hospitalCity?: string;
  dateOfAddmission?: string;
  lengthOfStay?: string;
  hospitalRegistrationNo?: string;
  rohiniCode?: string;
  hospitalType?: string;
  hospitalState?: string;
  hospitalContactNo?: string;
  hospitalFlag?: string;
  expectedDateOfDischargeRem?: string;
}

interface ClaimDetails {
  insuredDetails?: InsuredDetails;
  hospitalDetails?: HospitalDetails;
  dateOfBirth?: string;
  proposerName?: string;
}

interface Props {
  claimDetails: any;
  claimsType: string;   // change `any` to your actual type if known
}

const HospitalInfo: React.FC<Props> = ({ claimDetails, claimsType }) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  // const [claimDetails, setClaimDetails] = useState<ClaimDetails | null>(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (investigationId) {
  //     fetchClaimDetails(investigationId);
  //   }
  // }, [investigationId, claimsType]);

  // const fetchClaimDetails = async (invId: string) => {
  //   setLoading(true);
  //   try {
  //     let response;
  //     if (claimsType === 'cashless') {
  //       response = await claimsService.claimDetails(invId);
  //     } else if (claimsType === 'reim') {
  //       response = await claimsService.reclaimDetails(invId);
  //     }

  //     if (response && response.statusCode === 0) {
  //       setClaimDetails(response.payload);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching claim details:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const decrypt = (value: string | undefined): string => {
    if (!value || value === '-') {
      return '-';
    }
    return encryptionService.decryptJAVA(value);
  };

  const getActualValue = (value: string | undefined): string => {
    if (!value) return '-';
    const actualValue = value.split('.')[0];
    return actualValue;
  };

  const formatDate = (date: string | undefined): string => {
    if (!date || date === '-') return '-';
    try {
      return format(new Date(date), 'd MMMM yyyy, h:mm a');
    } catch {
      return '-';
    }
  };

  const formatDateShort = (date: string | undefined): string => {
    if (!date || date === '-') return '-';
    try {
      return format(new Date(date), 'd MMMM yyyy');
    } catch {
      return '-';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: '#2E5A96' }}/>
      </Box>
    );
  }

  const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: 'text.secondary',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          textAlign: 'right',
          fontWeight: 500,
          maxWidth: '60%',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ mt: 3 }}>
      {/* Insured Details Card */}
      <Card
        sx={{
          my: 4,
          bgcolor: '#f0f8ff',
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{
              width: '100%',
              color: '#6F62C2',
              fontSize: 14,
              fontWeight: 700,
              mb: 2,
            }}
          >
            INSURED DETAILS
          </Typography>

          <Grid container spacing={2}>
            {/* Left Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DetailRow
                label="Insured Name"
                value={claimDetails?.insuredDetails?.insuredName}
              />
              <DetailRow
                label="Relationship with Insured"
                value={claimDetails?.insuredDetails?.relationshipWithInsured}
              />
              <DetailRow
                label="Age"
                value={getActualValue(claimDetails?.insuredDetails?.age)}
              />
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DetailRow
                label="Patient Name"
                value={claimDetails?.insuredDetails?.patientname}
              />
              <DetailRow
                label="EMPID/Member ID"
                value={claimDetails?.insuredDetails?.memberId || '-'}
              />
              <DetailRow
                label="Gender"
                value={claimDetails?.insuredDetails?.insuredGender}
              />
            </Grid>

            {/* Full Width Address */}
            <Grid size={{ xs: 12 }}>
              <DetailRow
                label="Address"
                value={claimDetails?.insuredDetails?.insuredAddress}
              />
            </Grid>

            {/* State & City */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DetailRow
                label="State"
                value={claimDetails?.insuredDetails?.insuredState}
              />
              <DetailRow
                label="Pincode"
                value={claimDetails?.insuredDetails?.insuredPincode}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DetailRow
                label="City"
                value={claimDetails?.insuredDetails?.insuredCity}
              />
              <DetailRow
                label="Contact No"
                value={claimDetails?.insuredDetails?.insuredContactNo}
              />
            </Grid>

            {/* Date of Birth & Corporate Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DetailRow
                label="Date of Birth"
                value={formatDateShort(claimDetails?.dateOfBirth)}
              />
              <DetailRow
                label="Corporate Name"
                value={claimDetails?.proposerName || '-'}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Hospital Details Card */}
      <Card
        sx={{
          my: 4,
          bgcolor: '#f0f8ff',
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{
              width: '100%',
              fontSize: 14,
              fontWeight: 700,
              color: '#6F62C2',
              mb: 2,
            }}
          >
            HOSPITAL DETAILS
          </Typography>

          <Grid container spacing={2}>
            {/* Left Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DetailRow
                label="Hospital Name"
                value={claimDetails?.hospitalDetails?.hospitalName}
              />
              <DetailRow
                label="Hospital Code"
                value={claimDetails?.hospitalDetails?.hospitalCode}
              />
              <DetailRow
                label="Hospital in Network"
                value={claimDetails?.hospitalDetails?.hospitalInNetwork || '-'}
              />
              <DetailRow
                label="Hospital Address"
                value={claimDetails?.hospitalDetails?.hospitalAddress || '-'}
              />
              <DetailRow
                label="Hospital City"
                value={claimDetails?.hospitalDetails?.hospitalCity || '-'}
              />
              <DetailRow
                label={claimsType === 'cashless' ? 'Expected DOA' : 'DOA'}
                value={formatDate(claimDetails?.hospitalDetails?.dateOfAddmission)}
              />
              <DetailRow
                label="Length of Stay"
                value={getActualValue(claimDetails?.hospitalDetails?.lengthOfStay)}
              />
              <DetailRow
                label="Hospital Registration No"
                value={claimDetails?.hospitalDetails?.hospitalRegistrationNo}
              />
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <DetailRow
                label="Rohini Code"
                value={claimDetails?.hospitalDetails?.rohiniCode}
              />
              <DetailRow
                label="Hospital Type"
                value={claimDetails?.hospitalDetails?.hospitalType || '-'}
              />
              <DetailRow
                label="Hospital State"
                value={claimDetails?.hospitalDetails?.hospitalState || '-'}
              />
              <DetailRow
                label="Hospital Contact No"
                value={claimDetails?.hospitalDetails?.hospitalContactNo}
              />
              <DetailRow
                label="Hospital Flag"
                value={claimDetails?.hospitalDetails?.hospitalFlag}
              />
              <DetailRow
                label={claimsType === 'cashless' ? 'Expected DOD' : 'DOD'}
                value={formatDate(claimDetails?.hospitalDetails?.expectedDateOfDischargeRem)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HospitalInfo;