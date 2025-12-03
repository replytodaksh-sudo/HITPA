// src/components/ReimRegionalAgencyQC/ReimRegionalAgencyQC.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import { dropdownService } from '../../../services/agency.service';
import { claimsService } from '../../../services/claims.service';
import { agencyQCService } from '../../../services/agencyqcupdate.service';

interface ReimRegionalAgencyQCProps {
  editable: boolean;
}

const ReimRegionalAgencyQC: React.FC<ReimRegionalAgencyQCProps> = ({ editable }) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const claimsType = searchParams.get('claimsType');

  // State
  const [qcdataList, setQcdataList] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [repudiationGrounds, setRepudiationGrounds] = useState<any[]>([]);
  const [fraudClaimReasons, setFraudClaimReasons] = useState<any[]>([]);
  const [fraudClaimEvidences, setFraudClaimEvidences] = useState<any[]>([]);
  const [pedEvidences, setPedEvidences] = useState<any[]>([]);

  const roleName = sessionStorage.getItem('roleName') || '';

  // Fetch dropdown data
  useEffect(() => {
    fetchDropdowns();
    if (investigationId) {
      getData();
    }
  }, [investigationId]);

  const fetchDropdowns = async () => {
    try {
      const [recResp, repResp, fraudReasonResp, fraudEvidResp, pedResp] = await Promise.all([
        dropdownService.getRecomendation(),
        dropdownService.getRepudiationGrounds(),
        dropdownService.getFraudClaimReason(),
        dropdownService.getFraudClaimEvedance(),
        claimsService.getAllPEDEvidences(),
      ]);

      if (recResp.statusCode === 0) setRecommendations(recResp.payload);
      if (repResp.statusCode === 0) setRepudiationGrounds(repResp.payload);
      if (fraudReasonResp.statusCode === 0) setFraudClaimReasons(fraudReasonResp.payload);
      if (fraudEvidResp.statusCode === 0) setFraudClaimEvidences(fraudEvidResp.payload);
      if (pedResp.statusCode === 0) setPedEvidences(pedResp.payload);
    } catch (error) {
      console.error('Error fetching dropdowns:', error);
    }
  };

  const getData = async () => {
    try {
      const response = await agencyQCService.getReClaimQCData(investigationId!, '');
      if (response.statusCode === 0) {
        setQcdataList(response.payload);
      }
    } catch (error) {
      console.error('Error fetching QC data:', error);
    }
  };

  const handleFieldChange = (index: number, field: string, value: any) => {
    setQcdataList((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotalExpenses = (qcData: any) => {
    const travel = parseFloat(qcData.travellingExpenses) || 0;
    const extra = parseFloat(qcData.extraVisit) || 0;
    const ipd = parseFloat(qcData.ipdMiscellaneous) || 0;
    return travel + extra + ipd;
  };

  if (qcdataList.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No QC data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {qcdataList.map((qcData, index) => (
        <Card key={index} sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            {/* Agency Name Header */}
            <Typography
              variant="h6"
              sx={{
                color: '#6F62C2',
                fontWeight: 700,
                mb: 2,
              }}
            >
              Agency Name: {qcData.agencyName}
            </Typography>

            <Grid container spacing={3}>
              {/* ==================== LEFT COLUMN - Conclusion ==================== */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: '#6F62C2', fontWeight: 700, mb: 2 }}
                >
                  Conclusion
                </Typography>

                {/* Recommendation */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>Recommendation</FormLabel>
                  <Select
                    value={qcData.recommendation || ''}
                    onChange={(e) =>
                      handleFieldChange(index, 'recommendation', e.target.value)
                    }
                    disabled={qcData.noDataStatus === 'NonEditable'}
                    displayEmpty
                  >
                    <MenuItem value="">--- Select Recommendation ---</MenuItem>
                    {recommendations.map((rec) => (
                      <MenuItem key={rec.code} value={rec.code}>
                        {rec.codeDescription}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Remarks */}
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Remarks"
                  value={qcData.remarks || ''}
                  onChange={(e) => handleFieldChange(index, 'remarks', e.target.value)}
                  disabled={qcData.noDataStatus === 'NonEditable'}
                  sx={{ mb: 2 }}
                />

                {/* Repudiation Grounds (if recommendation = CO0061) */}
                {qcData.recommendation === 'CO0061' && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel>Repudiation grounds</FormLabel>
                    <Select
                      value={qcData.repudiationGrounds || ''}
                      onChange={(e) =>
                        handleFieldChange(index, 'repudiationGrounds', e.target.value)
                      }
                      disabled={qcData.noDataStatus === 'NonEditable'}
                      displayEmpty
                    >
                      <MenuItem value="">--- Select Repudiation ground ---</MenuItem>
                      {repudiationGrounds.map((ground) => (
                        <MenuItem key={ground.code} value={ground.code}>
                          {ground.codeDescription}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* ========== EXCLUSION (CO0067) ========== */}
                {qcData.repudiationGrounds === 'CO0067' &&
                  qcData.recommendation === 'CO0061' && (
                    <>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel>Exclusion reason</FormLabel>
                        <Select
                          value={qcData.exclusionReason || ''}
                          onChange={(e) =>
                            handleFieldChange(index, 'exclusionReason', e.target.value)
                          }
                          disabled={qcData.noDataStatus === 'NonEditable'}
                          displayEmpty
                        >
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="permanent">permanent</MenuItem>
                          <MenuItem value="firstTwoYear">first two years</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Remarks"
                        value={qcData.exclusionReasonRemarks || ''}
                        onChange={(e) =>
                          handleFieldChange(index, 'exclusionReasonRemarks', e.target.value)
                        }
                        disabled={qcData.noDataStatus === 'NonEditable'}
                        sx={{ mb: 2 }}
                      />
                    </>
                  )}

                {/* ========== OTHERS (CO0069) ========== */}
                {qcData.repudiationGrounds === 'CO0069' &&
                  qcData.recommendation === 'CO0061' && (
                    <>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Remarks"
                        value={qcData.otherRemark || ''}
                        onChange={(e) =>
                          handleFieldChange(index, 'otherRemark', e.target.value)
                        }
                        disabled={qcData.noDataStatus === 'NonEditable'}
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Final Remarks"
                        value={qcData.others || ''}
                        onChange={(e) => handleFieldChange(index, 'others', e.target.value)}
                        disabled={qcData.noDataStatus === 'NonEditable'}
                        sx={{ mb: 2 }}
                      />
                    </>
                  )}

                {/* ========== MISREPRESENTATION (CO0068) ========== */}
                {qcData.repudiationGrounds === 'CO0068' &&
                  qcData.recommendation === 'CO0061' && (
                    <>
                      {qcData.fraudClaimReasonClaimQCDTO && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <FormLabel>Fraud Claim Reasons</FormLabel>
                          <Select
                            multiple
                            value={
                              qcData.fraudClaimReasonClaimQCDTO.fraudClaimReasonCode || []
                            }
                            onChange={(e) => {
                              const updated = { ...qcData.fraudClaimReasonClaimQCDTO };
                              updated.fraudClaimReasonCode = e.target.value;
                              handleFieldChange(index, 'fraudClaimReasonClaimQCDTO', updated);
                            }}
                            disabled={qcData.noDataStatus === 'NonEditable'}
                            renderValue={(selected) => (selected as string[]).join(', ')}
                          >
                            {fraudClaimReasons.map((reason) => (
                              <MenuItem
                                key={reason.fraudClaimReasonCode}
                                value={reason.fraudClaimReasonCode}
                              >
                                {reason.fraudClaimReason}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}

                      {qcData.fraudClaimEvidencesClaimQCDTO && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <FormLabel>Fraud Claim Evidence</FormLabel>
                          <Select
                            multiple
                            value={
                              qcData.fraudClaimEvidencesClaimQCDTO.fraudClaimEvidenceCode || []
                            }
                            onChange={(e) => {
                              const updated = { ...qcData.fraudClaimEvidencesClaimQCDTO };
                              updated.fraudClaimEvidenceCode = e.target.value;
                              handleFieldChange(
                                index,
                                'fraudClaimEvidencesClaimQCDTO',
                                updated
                              );
                            }}
                            disabled={qcData.noDataStatus === 'NonEditable'}
                            renderValue={(selected) => (selected as string[]).join(', ')}
                          >
                            {fraudClaimEvidences.map((evidence) => (
                              <MenuItem
                                key={evidence.fraudClaimEvidenceCode}
                                value={evidence.fraudClaimEvidenceCode}
                              >
                                {evidence.fraudClaimEvidence}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}

                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Remarks"
                        value={qcData.misrepresentationRemark || ''}
                        onChange={(e) =>
                          handleFieldChange(index, 'misrepresentationRemark', e.target.value)
                        }
                        disabled={qcData.noDataStatus === 'NonEditable'}
                        sx={{ mb: 2 }}
                      />
                    </>
                  )}

                {/* ========== FRAUD (CO0065) ========== */}
                {qcData.repudiationGrounds === 'CO0065' &&
                  qcData.recommendation === 'CO0061' && (
                    <>
                      {qcData.fraudClaimReasonClaimQCDTO && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <FormLabel>Fraud Claim Reasons</FormLabel>
                          <Select
                            multiple
                            value={
                              qcData.fraudClaimReasonClaimQCDTO.fraudClaimReasonCode || []
                            }
                            onChange={(e) => {
                              const updated = { ...qcData.fraudClaimReasonClaimQCDTO };
                              updated.fraudClaimReasonCode = e.target.value;
                              handleFieldChange(index, 'fraudClaimReasonClaimQCDTO', updated);
                            }}
                            disabled={qcData.noDataStatus === 'NonEditable'}
                            renderValue={(selected) => (selected as string[]).join(', ')}
                          >
                            {fraudClaimReasons.map((reason) => (
                              <MenuItem
                                key={reason.fraudClaimReasonCode}
                                value={reason.fraudClaimReasonCode}
                              >
                                {reason.fraudClaimReason}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}

                      {qcData.fraudClaimEvidencesClaimQCDTO && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <FormLabel>Fraud Claim Evidence</FormLabel>
                          <Select
                            multiple
                            value={
                              qcData.fraudClaimEvidencesClaimQCDTO.fraudClaimEvidenceCode || []
                            }
                            onChange={(e) => {
                              const updated = { ...qcData.fraudClaimEvidencesClaimQCDTO };
                              updated.fraudClaimEvidenceCode = e.target.value;
                              handleFieldChange(
                                index,
                                'fraudClaimEvidencesClaimQCDTO',
                                updated
                              );
                            }}
                            disabled={qcData.noDataStatus === 'NonEditable'}
                            renderValue={(selected) => (selected as string[]).join(', ')}
                          >
                            {fraudClaimEvidences.map((evidence) => (
                              <MenuItem
                                key={evidence.fraudClaimEvidenceCode}
                                value={evidence.fraudClaimEvidenceCode}
                              >
                                {evidence.fraudClaimEvidence}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}

                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Remarks"
                        value={qcData.fraudRemark || ''}
                        onChange={(e) =>
                          handleFieldChange(index, 'fraudRemark', e.target.value)
                        }
                        disabled={qcData.noDataStatus === 'NonEditable'}
                        sx={{ mb: 2 }}
                      />
                    </>
                  )}

                {/* ========== PED (CO0066) ========== */}
                {qcData.repudiationGrounds === 'CO0066' &&
                  qcData.recommendation === 'CO0061' && (
                    <>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Ailment"
                        placeholder="Disease Name with duration"
                        value={qcData.ailment || ''}
                        onChange={(e) => handleFieldChange(index, 'ailment', e.target.value)}
                        disabled={qcData.noDataStatus === 'NonEditable'}
                        sx={{ mb: 2 }}
                        helperText="Disease Name with duration"
                      />

                      {qcData.pedClaimEvidenceQCDTO && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <FormLabel>PED Evidences</FormLabel>
                          <Select
                            multiple
                            value={qcData.pedClaimEvidenceQCDTO.pedClaimEvidenceCode || []}
                            disabled={qcData.noDataStatus === 'NonEditable'}
                            renderValue={(selected) => (selected as string[]).join(', ')}
                          >
                            {pedEvidences.map((evidence) => (
                              <MenuItem
                                key={evidence.pedClaimEvidenceCode}
                                value={evidence.pedClaimEvidenceCode}
                              >
                                {evidence.pedClaimEvidence}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}

                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Remarks"
                        value={qcData.pedRemark || ''}
                        onChange={(e) => handleFieldChange(index, 'pedRemark', e.target.value)}
                        disabled={qcData.noDataStatus === 'NonEditable'}
                        sx={{ mb: 2 }}
                      />
                    </>
                  )}
              </Grid>

              {/* ==================== RIGHT COLUMN - Expense Details ==================== */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: '#6F62C2', fontWeight: 700, mb: 2 }}
                >
                  Expense Details
                </Typography>

                <TextField
                  fullWidth
                  type="number"
                  label="Travelling Expense"
                  value={qcData.travellingExpenses || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'travellingExpenses', e.target.value)
                  }
                  disabled={qcData.noDataStatus === 'NonEditable'}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Extra Visit"
                  value={qcData.extraVisit || ''}
                  onChange={(e) => handleFieldChange(index, 'extraVisit', e.target.value)}
                  disabled={qcData.noDataStatus === 'NonEditable'}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="IPD & Miscellaneous"
                  value={qcData.ipdMiscellaneous || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'ipdMiscellaneous', e.target.value)
                  }
                  disabled={qcData.noDataStatus === 'NonEditable'}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Description"
                  value={qcData.description || ''}
                  onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                  disabled={qcData.noDataStatus === 'NonEditable'}
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    Total Expenses
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="primary">
                    ₹{calculateTotalExpenses(qcData).toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ReimRegionalAgencyQC;