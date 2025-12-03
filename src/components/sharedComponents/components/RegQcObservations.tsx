// src/components/QC/RegQcObservations.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

interface RegQcObservationsProps {
  previewRefresh?: boolean;
  previewValues?: any;
  dataRole?: string;
}

const RegQcObservations: React.FC<RegQcObservationsProps> = ({
  previewRefresh,
  previewValues,
  dataRole,
}) => {
  const [roleName, setRoleName] = useState('');
  const [qcObservation, setQcObservation] = useState('');
  const [finalDecision, setFinalDecision] = useState('');
  const [remarks, setRemarks] = useState('');
  const [queryWithRegionalQC, setQueryWithRegionalQC] = useState('');
  const [groundOfRejection, setGroundOfRejection] = useState('');
  const [groundOfRejectionFraud, setGroundOfRejectionFraud] = useState('');
  const [groundOfRejectionExclusion, setGroundOfRejectionExclusion] = useState('');
  const [groundOfRejectionMis, setGroundOfRejectionMis] = useState('');
  const [findings, setFindings] = useState('');
  const [queriesQuery, setQueriesQuery] = useState('');

  // Initialize
  useEffect(() => {
    const role = sessionStorage.getItem('roleName') || '';
    setRoleName(role);
  }, []);

  // Process preview values when they change
  useEffect(() => {
    if (previewValues) {
      getQCPreviewDetails(previewValues);
    }
  }, [previewValues, previewRefresh]);

  const getQCPreviewDetails = (preview: any) => {
    setQcObservation(preview.qcObservations || '');
    setFinalDecision(preview.finalDecision || '');
    setQueryWithRegionalQC(preview.queryWithRegionalQC || '');
    
    const observation = preview.qcObservations || '';
    const decision = preview.finalDecision || '';
    
    // Reset remarks
    setRemarks('');
    
    if (observation === 'Accept Report' || observation === 'Respond to Claims Team') {
      if (decision === 'Payable' || decision === 'Queries to be raised') {
        setRemarks(preview.queriesRemarks || '');
        setQueryWithRegionalQC(preview.queriesQuery || '');
      } else if (decision === 'Repudiate') {
        setRemarks(preview.repudiateFraudulentRemarks || '');
        
        // Ground of Rejection
        if (preview.groundRejectionQCDTO?.groundRejectionQCViewDTOs) {
          const grounds = preview.groundRejectionQCDTO.groundRejectionQCViewDTOs
            .map((o: any) => o.groundRejection)
            .join(', ');
          setGroundOfRejection(grounds);
        }
        
        // Ground of Rejection - Fraud
        if (preview.groundRejectionFraudulentQCDTO?.groundRejectionFraudulentQCViewDTOs) {
          const fraudGrounds = preview.groundRejectionFraudulentQCDTO.groundRejectionFraudulentQCViewDTOs
            .map((o: any) => o.groundRejectionFraudulent)
            .join(', ');
          setGroundOfRejectionFraud(fraudGrounds);
        }
        
        // Ground of Rejection - Exclusion
        if (preview.groundRejectionExclusionQCDTO?.groundRejectionExclusionDTO) {
          const exclusionGrounds = preview.groundRejectionExclusionQCDTO.groundRejectionExclusionDTO
            .map((o: any) => o.groundRejectionExclusion)
            .join(', ');
          setGroundOfRejectionExclusion(exclusionGrounds);
        }
        
        // Ground of Rejection - Misrepresentation
        if (preview.groundRejectionMisrepresentQCDTO?.groundRejectionMisrepresentationDTO) {
          const misGrounds = preview.groundRejectionMisrepresentQCDTO.groundRejectionMisrepresentationDTO
            .map((o: any) => o.groundRejectionMisrepresent)
            .join(', ');
          setGroundOfRejectionMis(misGrounds);
        }
      } else if (decision === 'Suspected Case') {
        setFindings(preview.suspectedCaseFindings || '');
      } else if (decision === 'Loss Minimization') {
        setRemarks(preview.lossMinimizationRemarks || '');
      }
    } else if (observation === 'Response to Central QC Query') {
      setQueriesQuery(preview.queriesQuery || '');
    }
  };

  const getValue = (status: any): string => {
    if (status !== null && status !== undefined) {
      return status ? 'Yes' : 'No';
    }
    return '-';
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid size={{ xs: 2 }}>
        <Typography variant="body2" fontWeight={500}>
          {label}
        </Typography>
      </Grid>
      <Grid size={{ xs: 10 }}>
        <Typography variant="body2" color="text.secondary">
          {value || '-'}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* QC Observations */}
      <InfoRow label="QC Observations" value={qcObservation} />

      {/* Final Decision */}
      {(qcObservation === 'Accept Report' || qcObservation === 'Respond to Claims Team') && (
        <InfoRow label="Final Decision" value={finalDecision} />
      )}

      {/* Ground of Rejection */}
      {(qcObservation === 'Accept Report' || qcObservation === 'Respond to Claims Team') &&
        finalDecision === 'Repudiate' && (
          <InfoRow label="Ground of rejection" value={groundOfRejection} />
        )}

      {/* Ground of Rejection - Fraud */}
      {(qcObservation === 'Accept Report' || qcObservation === 'Respond to Claims Team') &&
        finalDecision === 'Repudiate' &&
        groundOfRejection.includes('Fraud') && (
          <InfoRow label="Ground of rejection Fraud" value={groundOfRejectionFraud} />
        )}

      {/* Ground of Rejection - Exclusion */}
      {(qcObservation === 'Accept Report' || qcObservation === 'Respond to Claims Team') &&
        finalDecision === 'Repudiate' &&
        groundOfRejection.includes('Exclusion') && (
          <InfoRow label="Ground of rejection Exclusion" value={groundOfRejectionExclusion} />
        )}

      {/* Ground of Rejection - Misrepresentation */}
      {(qcObservation === 'Accept Report' || qcObservation === 'Respond to Claims Team') &&
        finalDecision === 'Repudiate' &&
        groundOfRejection.includes('Misrepresentation') && (
          <InfoRow label="Ground of rejection Misrepresentation" value={groundOfRejectionMis} />
        )}

      {/* Remark */}
      {(qcObservation === 'Accept Report' || qcObservation === 'Respond to Claims Team') &&
        finalDecision !== 'Suspected Case' && (
          <InfoRow label="Remark" value={remarks} />
        )}

      {/* Query */}
      {finalDecision !== 'Repudiate' &&
        finalDecision !== 'Suspected Case' &&
        finalDecision !== 'Loss Minimization' &&
        queryWithRegionalQC !== '' &&
        queryWithRegionalQC !== null && (
          <InfoRow label="Query" value={queryWithRegionalQC} />
        )}

      {/* Findings (Suspected Case) */}
      {(qcObservation === 'Accept Report' || qcObservation === 'Respond to Claims Team') &&
        finalDecision === 'Suspected Case' && (
          <InfoRow label="Findings" value={findings} />
        )}

      {/* Response to Central QC Query */}
      {qcObservation === 'Response to Central QC Query' && (
        <InfoRow label="Response to Central QC Query" value={queriesQuery} />
      )}

      {/* Recommendation to Central QC - Comparison Table */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontSize: '16px', fontWeight: 600 }}>
            Recommendation to Central QC
          </Typography>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Regional QC</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Central QC</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Regional QC</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Central QC</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Row 1 */}
                <TableRow>
                  <TableCell>Policy cancellation</TableCell>
                  <TableCell>{getValue(previewValues?.regpolicyCancellation)}</TableCell>
                  <TableCell>{getValue(previewValues?.policyCancellation)}</TableCell>
                  <TableCell>Hospital to be blacklisted</TableCell>
                  <TableCell>{getValue(previewValues?.reghospitalBlacklisted)}</TableCell>
                  <TableCell>{getValue(previewValues?.hospitalBlacklisted)}</TableCell>
                </TableRow>

                {/* Row 2 */}
                <TableRow>
                  <TableCell>Hospital to be Depanelled (applicable only if network - system validations)</TableCell>
                  <TableCell>{getValue(previewValues?.reghospitalDepanelled)}</TableCell>
                  <TableCell>{getValue(previewValues?.hospitalDepanelled)}</TableCell>
                  <TableCell>Hospital to be caution tagged</TableCell>
                  <TableCell>{getValue(previewValues?.reghospitalCautionTagged)}</TableCell>
                  <TableCell>{getValue(previewValues?.hospitalCautionTagged)}</TableCell>
                </TableRow>

                {/* Row 3 */}
                <TableRow>
                  <TableCell>Insured to be blacklisted</TableCell>
                  <TableCell>{getValue(previewValues?.reginsuredBlacklisted)}</TableCell>
                  <TableCell>{getValue(previewValues?.insuredBlacklisted)}</TableCell>
                  <TableCell>Insured to be caution tagged</TableCell>
                  <TableCell>{getValue(previewValues?.reginsuredCautionTagged)}</TableCell>
                  <TableCell>{getValue(previewValues?.insuredCautionTagged)}</TableCell>
                </TableRow>

                {/* Row 4 */}
                <TableRow>
                  <TableCell>Policy to be tagged as fraud</TableCell>
                  <TableCell>{getValue(previewValues?.regpolicyFraud)}</TableCell>
                  <TableCell>{getValue(previewValues?.policyFraud)}</TableCell>
                  <TableCell>Treating doctor be tagged as Fraud / caution</TableCell>
                  <TableCell>{getValue(previewValues?.regtreatingDoctorFraud)}</TableCell>
                  <TableCell>{getValue(previewValues?.treatingDoctorFraud)}</TableCell>
                </TableRow>

                {/* Row 5 */}
                <TableRow>
                  <TableCell>Pathologist be tagged as Fraud / caution</TableCell>
                  <TableCell>{getValue(previewValues?.regpathologistFraud)}</TableCell>
                  <TableCell>{getValue(previewValues?.pathologistFraud)}</TableCell>
                  <TableCell>Chemist to be tagged as Fraud/ caution</TableCell>
                  <TableCell>{getValue(previewValues?.regchemistFraud)}</TableCell>
                  <TableCell>{getValue(previewValues?.chemistFraud)}</TableCell>
                </TableRow>

                {/* Row 6 */}
                <TableRow>
                  <TableCell>Pathology lab to be tagged as fraud / caution</TableCell>
                  <TableCell>{getValue(previewValues?.regpathologyLabFraud)}</TableCell>
                  <TableCell>{getValue(previewValues?.pathologyLabFraud)}</TableCell>
                  <TableCell>Corporate (applicable only in group policy) to be tagged as Fraud/ caution</TableCell>
                  <TableCell>{getValue(previewValues?.regcorporateTaggedFraud)}</TableCell>
                  <TableCell>{getValue(previewValues?.corporateTaggedFraud)}</TableCell>
                </TableRow>

                {/* Row 7 */}
                <TableRow>
                  <TableCell>Legal Action to be initiated</TableCell>
                  <TableCell>{getValue(previewValues?.reglegalActionInitiated)}</TableCell>
                  <TableCell>{getValue(previewValues?.legalActionInitiated)}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegQcObservations;