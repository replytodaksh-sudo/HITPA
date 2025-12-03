// src/components/ReimburseCaseUpdate/ReferralDoctorVerification.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid
} from '@mui/material';

interface ReferralDoctor {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  contactNo?: string;
  regNo?: string;
  qualification?: string;
  stream?: string;
  fraud?: boolean;
}

interface ReferralDoctorVerificationProps {
  title: string;
  buttonEnable: boolean;
  previousData?: any;
}

const ReferralDoctorVerification: React.FC<ReferralDoctorVerificationProps> = ({
  title,
  buttonEnable,
  previousData
}) => {
  const disableFields = !buttonEnable;

  // Table data
  const [rowData, setRowData] = useState<ReferralDoctor[]>([{}]);

  // Statement fields
  const [referralDrStatementCollected, setReferralDrStatementCollected] = useState('');
  const [referralDrStatementCollectedDiscrepanciesFound, setReferralDrStatementCollectedDiscrepanciesFound] = useState('');
  const [referralDrStatementCollectedDiscrepanciesFinding, setReferralDrStatementCollectedDiscrepanciesFinding] = useState('');
  const [referralDrStatementCollectedPEDNoted, setReferralDrStatementCollectedPEDNoted] = useState('');
  const [referralDrStatementCollectedPEDNotedFinding, setReferralDrStatementCollectedPEDNotedFinding] = useState('');
  const [referralDrStatementCollectedReason, setReferralDrStatementCollectedReason] = useState('');

  // Populate data from previousData
  useEffect(() => {
    if (previousData) {
      populateData();
    }
  }, [previousData]);

  const populateData = () => {
    if (!previousData) return;

    // Populate table data
    if (previousData.reCaseUpdateReferralDocterDetailsDTO) {
      setRowData(previousData.reCaseUpdateReferralDocterDetailsDTO);
    }

    // Populate statement collected
    if (previousData.referralDrStatementCollected === true) {
      setReferralDrStatementCollected('yes');
    } else if (previousData.referralDrStatementCollected === false) {
      setReferralDrStatementCollected('no');
    }

    // Populate discrepancies found
    if (previousData.referralDrStatementCollectedDiscrepanciesFound === true) {
      setReferralDrStatementCollectedDiscrepanciesFound('yes');
    } else if (previousData.referralDrStatementCollectedDiscrepanciesFound === false) {
      setReferralDrStatementCollectedDiscrepanciesFound('no');
    }
    setReferralDrStatementCollectedDiscrepanciesFinding(
      previousData.referralDrStatementCollectedDiscrepanciesFinding || ''
    );

    // Populate PED noted
    if (previousData.referralDrStatementCollectedPEDNoted === true) {
      setReferralDrStatementCollectedPEDNoted('yes');
    } else if (previousData.referralDrStatementCollectedPEDNoted === false) {
      setReferralDrStatementCollectedPEDNoted('no');
    }
    setReferralDrStatementCollectedPEDNotedFinding(
      previousData.referralDrStatementCollectedPEDNotedFinding || ''
    );

    // Populate reason
    setReferralDrStatementCollectedReason(
      previousData.referralDrStatementCollectedReason || ''
    );
  };

  // Add new row to table
  const addRow = () => {
    setRowData([...rowData, {}]);
  };

  // Update specific row field
  const updateRowField = (index: number, field: keyof ReferralDoctor, value: any) => {
    const updatedData = [...rowData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setRowData(updatedData);
  };

  // Save table data
  const saveTableData = () => {
    alert('Referral Doctor Data saved successfully!');
    console.log('Saving referral doctor data:', rowData);
  };

  // Get data for submission (to be called by parent component)
  const getSubmitData = () => {
    return {
      reCaseUpdateReferralDocterDetailsDTO: rowData,
      referralDrStatementCollected: referralDrStatementCollected === 'yes',
      referralDrStatementCollectedDiscrepanciesFound: referralDrStatementCollectedDiscrepanciesFound === 'yes',
      referralDrStatementCollectedDiscrepanciesFinding,
      referralDrStatementCollectedPEDNoted: referralDrStatementCollectedPEDNoted === 'yes',
      referralDrStatementCollectedPEDNotedFinding,
      referralDrStatementCollectedReason
    };
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Title */}
      <Typography variant="h6" gutterBottom sx={{ fontSize: '14px', fontWeight: 'bold' }}>
        {title}
      </Typography>

      {/* Referral Doctors Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="center">Treating doctor Name</TableCell>
              <TableCell align="center">Contact No.</TableCell>
              <TableCell align="center">Registration Number</TableCell>
              <TableCell align="center">Qualification</TableCell>
              <TableCell align="center">Stream</TableCell>
              <TableCell align="center">To be tagged as Fraud / Caution?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData.map((doctor, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                
                {/* Doctor Name (First, Middle, Last) */}
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="First"
                      value={doctor.firstName || ''}
                      onChange={(e) => updateRowField(index, 'firstName', e.target.value)}
                      disabled={disableFields}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      placeholder="Middle"
                      value={doctor.middleName || ''}
                      onChange={(e) => updateRowField(index, 'middleName', e.target.value)}
                      disabled={disableFields}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      placeholder="Last"
                      value={doctor.lastName || ''}
                      onChange={(e) => updateRowField(index, 'lastName', e.target.value)}
                      disabled={disableFields}
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </TableCell>

                {/* Contact No */}
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    value={doctor.contactNo || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      updateRowField(index, 'contactNo', value);
                    }}
                    disabled={disableFields}
                    inputProps={{ maxLength: 10 }}
                  />
                </TableCell>

                {/* Registration Number */}
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    value={doctor.regNo || ''}
                    onChange={(e) => updateRowField(index, 'regNo', e.target.value)}
                    disabled={disableFields}
                  />
                </TableCell>

                {/* Qualification */}
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    value={doctor.qualification || ''}
                    onChange={(e) => updateRowField(index, 'qualification', e.target.value)}
                    disabled={disableFields}
                  />
                </TableCell>

                {/* Stream */}
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      value={doctor.stream || ''}
                      onChange={(e) => updateRowField(index, 'stream', e.target.value)}
                      disabled={disableFields}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Allopathy">Allopathy</MenuItem>
                      <MenuItem value="Homeopathy">Homeopathy</MenuItem>
                      <MenuItem value="Ayurvedic">Ayurvedic</MenuItem>
                      <MenuItem value="Unani">Unani</MenuItem>
                      <MenuItem value="Naturapathy">Naturapathy</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>

                {/* Fraud Checkbox */}
                <TableCell align="center">
                  <Checkbox
                    checked={doctor.fraud || false}
                    onChange={(e) => updateRowField(index, 'fraud', e.target.checked)}
                    disabled={disableFields}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add More Button */}
      {buttonEnable && (
        <Button
          onClick={addRow}
          sx={{ mb: 2, color: 'blue', textTransform: 'none' }}
        >
          +Add More
        </Button>
      )}

      {/* Save Button */}
      {buttonEnable && (
        <Box sx={{ mb: 3 }}>
          <Button variant="contained" onClick={saveTableData}>
            Save Referral Doctor Data
          </Button>
        </Box>
      )}

      {/* Statement Collected */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 4 }}>
            <Typography>Statement collected</Typography>
          </Grid>
          <Grid size={{ xs: 8 }}>
            <FormControl fullWidth size="small">
              <Select
                value={referralDrStatementCollected}
                onChange={(e) => setReferralDrStatementCollected(e.target.value)}
                disabled={disableFields}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* If Statement Collected = YES */}
      {referralDrStatementCollected === 'yes' && (
        <>
          {/* Discrepancies Found */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 4 }}>
                <Typography>Discrepancies found</Typography>
              </Grid>
              <Grid size={{ xs: 8 }}>
                <FormControl component="fieldset" disabled={disableFields}>
                  <RadioGroup
                    row
                    value={referralDrStatementCollectedDiscrepanciesFound}
                    onChange={(e) => setReferralDrStatementCollectedDiscrepanciesFound(e.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Discrepancy Findings */}
          {referralDrStatementCollectedDiscrepanciesFound === 'yes' && (
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 4 }}>
                  <Typography>Discrepancy Findings</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    value={referralDrStatementCollectedDiscrepanciesFinding}
                    onChange={(e) => setReferralDrStatementCollectedDiscrepanciesFinding(e.target.value)}
                    disabled={disableFields}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* PED Noted */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 4 }}>
                <Typography>PED Noted</Typography>
              </Grid>
              <Grid size={{ xs: 8 }}>
                <FormControl component="fieldset" disabled={disableFields}>
                  <RadioGroup
                    row
                    value={referralDrStatementCollectedPEDNoted}
                    onChange={(e) => setReferralDrStatementCollectedPEDNoted(e.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* PED Findings */}
          {referralDrStatementCollectedPEDNoted === 'yes' && (
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 4 }}>
                  <Typography>PED Findings</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    value={referralDrStatementCollectedPEDNotedFinding}
                    onChange={(e) => setReferralDrStatementCollectedPEDNotedFinding(e.target.value)}
                    disabled={disableFields}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </>
      )}

      {/* If Statement Collected = NO */}
      {referralDrStatementCollected === 'no' && (
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 4 }}>
              <Typography>Reason</Typography>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                value={referralDrStatementCollectedReason}
                onChange={(e) => setReferralDrStatementCollectedReason(e.target.value)}
                disabled={disableFields}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default ReferralDoctorVerification;

// Export the getSubmitData function reference if needed
// You can use React.forwardRef and useImperativeHandle for this