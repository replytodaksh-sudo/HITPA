// src/components/CentralNewCasesTabs/components/PreAuth.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { claimsService } from '../../../services/claims.service';
import { encryptionService } from '../../../utils/encryption.service';
import { format } from 'date-fns';

interface ClaimDetails {
  diagnosis?: string;
  lineOfTreatment?: string;
  policyNo?: string;
  claimAmount?: number;
  sumInsured?: number;
  policyStartDate?: string;
  claimCategory?: string;
  policEndDate?: string;
  sbigMemberID?: string;
  enhancementDate?: string;
  insuredDetails?: {
    insuredName?: string;
  };
  pastClaims?: any[];
  billBreakUP?: any;
  editable?: boolean;
  canAssignToInternalTeam?: boolean;
}

interface Props {
  claimDetails: any;   // change `any` to your actual type if known
}

const PreAuth: React.FC<Props> = ({ claimDetails }) => {
  // const { claimDetails } = props;
  const { investigationId } = useParams<{ investigationId: string }>();
  // const [claimDetails, setClaimDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [roleName, setRoleName] = useState('');

  // Table headers
  const pastClaimTableHeader = [
    'Claim Id',
    'Claim no.',
    'TPA Claim No',
    'Payable Amount',
    'Date of Admission',
    'Date of discharge',
    'Claim Amount',
    'Diagnosis',
    'Hospital Name',
    'Claim present status',
    'Claim status',
    'Claim Stage',
  ];

  const billBreakUPTable1Header = [
    'REQUESTED AMOUNT',
    'AL Sanction Amount',
    'INVESTIGATION CHARGES',
    'PHARMACY CHARGES',
    'NURSING CHARGES',
    'ROOM_RENT',
    'ROOM TYPE',
    'SURGEON CHARGES',
  ];

  const billBreakUPTable2Header = [
    'ANESTHETIST_CHARGES',
    'ASSISTANT SURGEON CHARGES',
    'OPERATION THEATRE CHARGES',
    'OTHERS CHARGES',
    'PROCEDURE CHARGES',
    'CONSUMABLE_CHARGES',
    'COST_OF_IMPLANTS If Any',
    'AL Type',
    'TOTAL ENHANCEMENTS',
  ];

  useEffect(() => {
    const role = sessionStorage.getItem('roleName');
    setRoleName(role || '');

    // if (investigationId) {
    //   fetchClaimDetails(investigationId);
    // }
  }, [investigationId]);

  // const fetchClaimDetails = async (invId: string) => {
  //   setLoading(true);
  //   try {
  //     const response = await claimsService.claimDetails(invId);
  //     if (response.statusCode === 0) {
  //       setClaimDetails(response.payload);
  //       sessionStorage.setItem('formEditable', response.payload.editable);
  //       sessionStorage.setItem('canAssignToInternalTeam', response.payload.canAssignToInternalTeam);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching claim details:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const decrypt = (value: string): string => {
    if (value === '-' || !value) {
      return '-';
    }
    return encryptionService.decryptJAVA(value);
  };

  const formatDate = (date: string | undefined): string => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'd MMM yyyy, h:mm a');
    } catch {
      return '-';
    }
  };

  const shouldShowPastClaims =
    roleName === 'Regional Manager' ||
    roleName === 'Central Manager' ||
    roleName === 'Super Admin';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* Past Claim History */}
      {shouldShowPastClaims && (
        <>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: '#6F62C2', mb: 2 }}
          >
            Past Claim History Details
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  {pastClaimTableHeader.map((header, index) => (
                    <TableCell key={index} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {claimDetails?.pastClaims && claimDetails.pastClaims.length > 0 ? (
                  claimDetails.pastClaims.map((pastclaim: any, index: number) => (
                    <TableRow key={index} hover>
                      <TableCell>{pastclaim.claimID}</TableCell>
                      <TableCell>{pastclaim.sbigClaimNo}</TableCell>
                      <TableCell>{pastclaim.tpaClaimNo}</TableCell>
                      <TableCell>{pastclaim.payableAmount}</TableCell>
                      <TableCell>{pastclaim.dateOfAdmission}</TableCell>
                      <TableCell>{pastclaim.dateOfDischarge}</TableCell>
                      <TableCell>{pastclaim.claimAmount}</TableCell>
                      <TableCell>{pastclaim.diagnosis}</TableCell>
                      <TableCell>{pastclaim.hospitalName}</TableCell>
                      <TableCell>{pastclaim.claimPresentStatus}</TableCell>
                      <TableCell>{pastclaim.claimStatus}</TableCell>
                      <TableCell>{pastclaim.claimStage}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Claim Details Card */}
      <Card
        sx={{
          my: 4,
          bgcolor: '#f0f8ff',
          boxShadow: 2,
        }}
      >
        <CardContent>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Row 1 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  DIAGNOSIS
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                  {claimDetails?.diagnosis || ''}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  LINE OF TREATMENT
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                  {claimDetails?.lineOfTreatment || '-'}
                </Typography>
              </Box>
            </Grid>

            {/* Row 2 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  POLICY NO.
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                  {claimDetails?.policyNo || ''}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  CLAIM AMOUNT
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                  {claimDetails?.claimAmount || '-'}
                </Typography>
              </Box>
            </Grid>

            {/* Row 3 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  INSURED NAME
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                  {claimDetails?.insuredDetails?.insuredName || ''}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  SUM INSURED
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                  {claimDetails?.sumInsured || '-'}
                </Typography>
              </Box>
            </Grid>

            {/* Row 4 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  POLICY START DATE
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                  {formatDate(claimDetails?.policyStartDate)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  CLAIM CLASSIFICATION
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                  {claimDetails?.claimCategory || '-'}
                </Typography>
              </Box>
            </Grid>

            {/* Row 5 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  POLICY END DATE
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                  {formatDate(claimDetails?.policEndDate)}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  Member ID
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                  {claimDetails?.sbigMemberID || ''}
                </Typography>
              </Box>
            </Grid>

            {/* Row 6 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                  ENHANCEMENT DATE
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                  {formatDate(claimDetails?.enhancementDate)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Bill Breakup Table 1 */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, color: '#6F62C2', mb: 2 }}
      >
        Bill Breakup
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              {billBreakUPTable1Header.map((header, index) => (
                <TableCell key={index} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} align="center">
                No records found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bill Breakup Table 2 */}
      <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              {billBreakUPTable2Header.map((header, index) => (
                <TableCell key={index} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={9} align="center">
                No records found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PreAuth;