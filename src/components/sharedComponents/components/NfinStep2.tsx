// src/components/NotFoundInHospital/components/NfinStep2.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

interface NfinStep2Props {
  previousData?: any;
  onStepTwoDataChange: (data: any) => void;
}

interface Step2FormData {
  pastRecordsCheckedMRD: string;
  pastRecordsCheckedMRDPastTreatment: boolean | null;
  pastRecordsCheckedMRDHospitalizationNoted: string;
  pastRecordsCheckedMRDNOT: boolean | null;
  pastRecordsCheckedMRDReason: string;
  isChemist: boolean | null;
  chemistObservations: string;
  chemistReason: string;
  anyOtherFindings: string;
  labReportVerified: boolean | null;
  labReportReason: string;
  labReportObservations: string;
  copyOfDischargeCardCollected: boolean | null;
  copyOfFinalBillCollected: boolean | null;
  insuredVisit: boolean | null;
  insuredVisitReason: string;
  statementCollected: boolean | null;
  statementCollectedReason: string;
  statementCollectedDiscrepanciesFound: boolean | null;
  statementCollectedDiscrepanciesFindings: string;
  statementCollectedPEDNoted: boolean | null;
  statementCollectedPEDFinidings: string;
  statementCollectedPEDNotedPastDocumentsCollected: boolean | null;
  statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify: string;
  statementCollectedPEDNotedPastDocumentsCollectedReason: string;
  alcoholHistory: boolean | null;
  smokingHistory: boolean | null;
  alcoholHistoryQuantity: string;
  smokingHistoryQuantity: string;
  anyOtherHabits: string;
  kcyDocument: boolean | null;
  kcyDocumentsAnyDiscrepancies: string;
  kcyDocumentsReason: string;
}

const NfinStep2: React.FC<NfinStep2Props> = ({
  previousData,
  onStepTwoDataChange,
}) => {
  const [formData, setFormData] = useState<Step2FormData>({
    pastRecordsCheckedMRD: '',
    pastRecordsCheckedMRDPastTreatment: null,
    pastRecordsCheckedMRDHospitalizationNoted: '',
    pastRecordsCheckedMRDNOT: null,
    pastRecordsCheckedMRDReason: '',
    isChemist: null,
    chemistObservations: '',
    chemistReason: '',
    anyOtherFindings: '',
    labReportVerified: null,
    labReportReason: '',
    labReportObservations: '',
    copyOfDischargeCardCollected: null,
    copyOfFinalBillCollected: null,
    insuredVisit: null,
    insuredVisitReason: '',
    statementCollected: null,
    statementCollectedReason: '',
    statementCollectedDiscrepanciesFound: null,
    statementCollectedDiscrepanciesFindings: '',
    statementCollectedPEDNoted: null,
    statementCollectedPEDFinidings: '',
    statementCollectedPEDNotedPastDocumentsCollected: null,
    statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify: '',
    statementCollectedPEDNotedPastDocumentsCollectedReason: '',
    alcoholHistory: null,
    smokingHistory: null,
    alcoholHistoryQuantity: '',
    smokingHistoryQuantity: '',
    anyOtherHabits: '',
    kcyDocument: null,
    kcyDocumentsAnyDiscrepancies: '',
    kcyDocumentsReason: '',
  });

  const buttonEnable = true; // From Angular: buttonEnable: boolean = true;

  // Load previous data
  useEffect(() => {
    if (previousData) {
      setFormData((prev) => ({
        ...prev,
        ...previousData,
      }));
    }
  }, [previousData]);

  // Send data to parent on every change
  useEffect(() => {
    onStepTwoDataChange(formData);
  }, [formData, onStepTwoDataChange]);

  const handleChange = (field: keyof Step2FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box component="section" sx={{ p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* ==================== LEFT COLUMN ==================== */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Past Records checked with MRD */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Past Records checked with MRD?</FormLabel>
              <Select
                value={formData.pastRecordsCheckedMRD}
                onChange={(e) => handleChange('pastRecordsCheckedMRD', e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>

            {/* If MRD = Yes */}
            {formData.pastRecordsCheckedMRD === 'true' && (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>Past Treatment / Hospitalization Noted</FormLabel>
                  <RadioGroup
                    row
                    value={
                      formData.pastRecordsCheckedMRDPastTreatment === null
                        ? ''
                        : formData.pastRecordsCheckedMRDPastTreatment
                        ? 'true'
                        : 'false'
                    }
                    onChange={(e) =>
                      handleChange(
                        'pastRecordsCheckedMRDPastTreatment',
                        e.target.value === 'true'
                      )
                    }
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>

                {formData.pastRecordsCheckedMRDPastTreatment === true && (
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    placeholder="Enter Details"
                    value={formData.pastRecordsCheckedMRDHospitalizationNoted}
                    onChange={(e) =>
                      handleChange('pastRecordsCheckedMRDHospitalizationNoted', e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />
                )}
              </>
            )}

            {/* If MRD = No */}
            {formData.pastRecordsCheckedMRD === 'false' && (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <RadioGroup
                    row
                    value={
                      formData.pastRecordsCheckedMRDNOT === null
                        ? ''
                        : formData.pastRecordsCheckedMRDNOT
                        ? 'true'
                        : 'false'
                    }
                    onChange={(e) =>
                      handleChange('pastRecordsCheckedMRDNOT', e.target.value === 'true')
                    }
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Not Required" />
                    <FormControlLabel value="false" control={<Radio />} label="Not Allowed" />
                  </RadioGroup>
                </FormControl>

                {formData.pastRecordsCheckedMRDNOT === true && (
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    label="Reason"
                    value={formData.pastRecordsCheckedMRDReason}
                    onChange={(e) =>
                      handleChange('pastRecordsCheckedMRDReason', e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />
                )}
              </>
            )}

            {/* Chemist Verified */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Chemist Verified</FormLabel>
              <RadioGroup
                row
                value={
                  formData.isChemist === null
                    ? ''
                    : formData.isChemist
                    ? 'true'
                    : 'false'
                }
                onChange={(e) => handleChange('isChemist', e.target.value === 'true')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {formData.isChemist === true && (
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Observations"
                value={formData.chemistObservations}
                onChange={(e) => handleChange('chemistObservations', e.target.value)}
                sx={{ mb: 2 }}
              />
            )}

            {formData.isChemist === false && (
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Reason"
                value={formData.chemistReason}
                onChange={(e) => handleChange('chemistReason', e.target.value)}
                sx={{ mb: 2 }}
              />
            )}

            {/* Any Other Findings */}
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Any Other findings"
              value={formData.anyOtherFindings}
              onChange={(e) => handleChange('anyOtherFindings', e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* ==================== RIGHT COLUMN ==================== */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Lab Report Verified */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Lab Report Verified</FormLabel>
              <RadioGroup
                row
                value={
                  formData.labReportVerified === null
                    ? ''
                    : formData.labReportVerified
                    ? 'true'
                    : 'false'
                }
                onChange={(e) => handleChange('labReportVerified', e.target.value === 'true')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {formData.labReportVerified === true && (
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Observations"
                value={formData.labReportObservations}
                onChange={(e) => handleChange('labReportObservations', e.target.value)}
                sx={{ mb: 2 }}
              />
            )}

            {formData.labReportVerified === false && (
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Reason"
                value={formData.labReportReason}
                onChange={(e) => handleChange('labReportReason', e.target.value)}
                sx={{ mb: 2 }}
              />
            )}

            {/* Copy of Discharge Card Collected */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Copy of Discharge Card Collected</FormLabel>
              <RadioGroup
                row
                value={
                  formData.copyOfDischargeCardCollected === null
                    ? ''
                    : formData.copyOfDischargeCardCollected
                    ? 'true'
                    : 'false'
                }
                onChange={(e) =>
                  handleChange('copyOfDischargeCardCollected', e.target.value === 'true')
                }
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {/* Copy of Final Bill Collected */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Copy of Final Bill Collected</FormLabel>
              <RadioGroup
                row
                value={
                  formData.copyOfFinalBillCollected === null
                    ? ''
                    : formData.copyOfFinalBillCollected
                    ? 'true'
                    : 'false'
                }
                onChange={(e) =>
                  handleChange('copyOfFinalBillCollected', e.target.value === 'true')
                }
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {/* Insured Visit */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Insured Visit</FormLabel>
              <RadioGroup
                row
                value={
                  formData.insuredVisit === null
                    ? ''
                    : formData.insuredVisit
                    ? 'true'
                    : 'false'
                }
                onChange={(e) => handleChange('insuredVisit', e.target.value === 'true')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {formData.insuredVisit === false && (
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Reason"
                value={formData.insuredVisitReason}
                onChange={(e) => handleChange('insuredVisitReason', e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
          </Grid>
        </Grid>

        {/* ==================== FULL WIDTH SECTION ==================== */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Left Column - Statement Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Statement Details
            </Typography>

            {/* Statement collected */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Statement collected</FormLabel>
              <RadioGroup
                row
                value={
                  formData.statementCollected === null
                    ? ''
                    : formData.statementCollected
                    ? 'true'
                    : 'false'
                }
                onChange={(e) =>
                  handleChange('statementCollected', e.target.value === 'true')
                }
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" disabled={!buttonEnable}/>
                <FormControlLabel value="false" control={<Radio />} label="No" disabled={!buttonEnable}/>
              </RadioGroup>
            </FormControl>

            {formData.statementCollected === false && (
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Reason"
                value={formData.statementCollectedReason}
                onChange={(e) => handleChange('statementCollectedReason', e.target.value)}
                disabled={!buttonEnable}
                sx={{ mb: 2 }}
              />
            )}

            {/* If Statement Collected = Yes */}
            {formData.statementCollected === true && (
              <Box>
                {/* Discrepancies found */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>Discrepancies found</FormLabel>
                  <RadioGroup
                    row
                    value={
                      formData.statementCollectedDiscrepanciesFound === null
                        ? ''
                        : formData.statementCollectedDiscrepanciesFound
                        ? 'true'
                        : 'false'
                    }
                    onChange={(e) =>
                      handleChange(
                        'statementCollectedDiscrepanciesFound',
                        e.target.value === 'true'
                      )
                    }
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Yes" disabled={!buttonEnable} />
                    <FormControlLabel value="false" control={<Radio />} label="No" disabled={!buttonEnable} />
                  </RadioGroup>
                </FormControl>

                {formData.statementCollectedDiscrepanciesFound === true && (
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    label="Discrepancies Findings"
                    value={formData.statementCollectedDiscrepanciesFindings}
                    onChange={(e) =>
                      handleChange('statementCollectedDiscrepanciesFindings', e.target.value)
                    }
                    disabled={!buttonEnable}
                    sx={{ mb: 2 }}
                  />
                )}

                {/* PED Noted */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>PED Noted</FormLabel>
                  <RadioGroup
                    row
                    value={
                      formData.statementCollectedPEDNoted === null
                        ? ''
                        : formData.statementCollectedPEDNoted
                        ? 'true'
                        : 'false'
                    }
                    onChange={(e) =>
                      handleChange('statementCollectedPEDNoted', e.target.value === 'true')
                    }
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Yes" disabled={!buttonEnable}/>
                    <FormControlLabel value="false" control={<Radio />} label="No" disabled={!buttonEnable}/>
                  </RadioGroup>
                </FormControl>

                {formData.statementCollectedPEDNoted === true && (
                  <Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="PED Findings"
                      value={formData.statementCollectedPEDFinidings}
                      onChange={(e) =>
                        handleChange('statementCollectedPEDFinidings', e.target.value)
                      }
                      disabled={!buttonEnable}
                      sx={{ mb: 2 }}
                    />

                    {/* Past documents collected */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <FormLabel>Past documents collected</FormLabel>
                      <RadioGroup
                        row
                        value={
                          formData.statementCollectedPEDNotedPastDocumentsCollected === null
                            ? ''
                            : formData.statementCollectedPEDNotedPastDocumentsCollected
                            ? 'true'
                            : 'false'
                        }
                        onChange={(e) =>
                          handleChange(
                            'statementCollectedPEDNotedPastDocumentsCollected',
                            e.target.value === 'true'
                          )
                        }
                      >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" disabled={!buttonEnable}/>
                        <FormControlLabel value="false" control={<Radio />} label="No" disabled={!buttonEnable}/>
                      </RadioGroup>
                    </FormControl>

                    {formData.statementCollectedPEDNotedPastDocumentsCollected === true && (
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Please Specify"
                        value={
                          formData.statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify
                        }
                        onChange={(e) =>
                          handleChange(
                            'statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify',
                            e.target.value
                          )
                        }
                        disabled={!buttonEnable}
                        sx={{ mb: 2 }}
                      />
                    )}

                    {formData.statementCollectedPEDNotedPastDocumentsCollected === false && (
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Reason"
                        value={formData.statementCollectedPEDNotedPastDocumentsCollectedReason}
                        onChange={(e) =>
                          handleChange(
                            'statementCollectedPEDNotedPastDocumentsCollectedReason',
                            e.target.value
                          )
                        }
                        disabled={!buttonEnable}
                        sx={{ mb: 2 }}
                      />
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Grid>

          {/* Right Column - Insured Habits & KYC */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Insured Habits
            </Typography>

            {/* Alcohol History */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Alcohol History</FormLabel>
              <RadioGroup
                row
                value={
                  formData.alcoholHistory === null
                    ? ''
                    : formData.alcoholHistory
                    ? 'true'
                    : 'false'
                }
                onChange={(e) => handleChange('alcoholHistory', e.target.value === 'true')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" disabled={!buttonEnable}/>
                <FormControlLabel value="false" control={<Radio />} label="No" disabled={!buttonEnable}/>
              </RadioGroup>
            </FormControl>

            {formData.alcoholHistory === true && (
              <TextField
                fullWidth
                placeholder="Quantity"
                value={formData.alcoholHistoryQuantity}
                onChange={(e) => handleChange('alcoholHistoryQuantity', e.target.value)}
                disabled={!formData.alcoholHistory}
                sx={{ mb: 2 }}
              />
            )}

            {/* Smoking History */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Smoking History</FormLabel>
              <RadioGroup
                row
                value={
                  formData.smokingHistory === null
                    ? ''
                    : formData.smokingHistory
                    ? 'true'
                    : 'false'
                }
                onChange={(e) => handleChange('smokingHistory', e.target.value === 'true')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" disabled={!buttonEnable}/>
                <FormControlLabel value="false" control={<Radio />} label="No" disabled={!buttonEnable}/>
              </RadioGroup>
            </FormControl>

            {formData.smokingHistory === true && (
              <TextField
                fullWidth
                placeholder="Quantity"
                value={formData.smokingHistoryQuantity}
                onChange={(e) => handleChange('smokingHistoryQuantity', e.target.value)}
                disabled={!formData.smokingHistory}
                sx={{ mb: 2 }}
              />
            )}

            {/* Any Other Habits */}
            <TextField
              fullWidth
              multiline
              rows={5}
              placeholder="Any Other Habits (if any)"
              value={formData.anyOtherHabits}
              onChange={(e) => handleChange('anyOtherHabits', e.target.value)}
              disabled={!buttonEnable}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              KYC Documents
            </Typography>

            {/* KYC Documents */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>KYC Documents</FormLabel>
              <RadioGroup
                row
                value={
                  formData.kcyDocument === null
                    ? ''
                    : formData.kcyDocument
                    ? 'true'
                    : 'false'
                }
                onChange={(e) => handleChange('kcyDocument', e.target.value === 'true')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Collected" disabled={!buttonEnable}/>
                <FormControlLabel value="false" control={<Radio />} label="Not Collected" disabled={!buttonEnable}/>
              </RadioGroup>
            </FormControl>

            {formData.kcyDocument === true && (
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Any Discrepancies"
                value={formData.kcyDocumentsAnyDiscrepancies}
                onChange={(e) => handleChange('kcyDocumentsAnyDiscrepancies', e.target.value)}
                disabled={!buttonEnable}
              />
            )}

            {formData.kcyDocument === false && (
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Reason"
                value={formData.kcyDocumentsReason}
                onChange={(e) => handleChange('kcyDocumentsReason', e.target.value)}
                disabled={!buttonEnable}
              />
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default NfinStep2;