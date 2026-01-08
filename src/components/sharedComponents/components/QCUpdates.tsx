// File: src/components/QCUpdates.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import DropdownService from '../../../services/dropdown.service';
import claimsService from '../../../services/claims.service';
import agencyQcUpdateService from '../../../services/agencyqcupdate.service';
import ReimService from '../../../services/reim.service';


// ==================== INTERFACES ====================
interface QCUpdatesProps {
  editable?: boolean;
}

interface AgencyQCData {
  recommendation: string;
  remarks: string;
  repudiationGrounds: string;
  exclusionReason: string;
  exclusionReasonRemarks: string;
  otherRemark: string;
  others: string;
  fraudRemark: string;
  misrepresentationRemark: string;
  ailment: string;
  pedEvidence?: string[];
  pedRemark: string;
  description: string;
  travellingExpenses: string;
  extraVisit: string;
  ipdMiscellaneous: string;
  sumOfExp: string;
  totalExpenses: string;
  noDataStatus: 'Editable' | 'NonEditable' | 'NotToOpenForm';
  fraudClaimReasonClaimQCDTO?: {
    fraudClaimReasonCode?: string[];
  };
  fraudClaimEvidencesClaimQCDTO?: {
    fraudClaimEvidenceCode?: string[];
  };
  pedClaimEvidenceQCDTO?: {
    pedClaimEvidenceCode?: string[];
  };
  hospitalVisitStatus?: string;
  insuredVisitStatus?: string;
  employerVisitStatus?: string;
  acceptAssignId?: string;
}

interface DropdownItem {
  code: string;
  codeDescription: string;
}

interface FraudReasonItem {
  fraudClaimReasonCode: string;
  fraudClaimReason: string;
}

interface FraudEvidenceItem {
  fraudClaimEvidenceCode: string;
  fraudClaimEvidence: string;
}

interface PEDEvidenceItem {
  pedClaimEvidenceCode: string;
  pedClaimEvidence: string;
}

interface TabCheck {
  hospitalVisit?: boolean;
  insuredPersonVisit?: boolean;
  employeerVisit?: boolean;
}

/**
 * QC Updates Component
 * Complex form for QC updates with conditional rendering based on recommendation and repudiation grounds
 */
const QCUpdates: React.FC<QCUpdatesProps> = ({ editable = true }) => {
  const { investigationId: rawInvestigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL params
  const claimsType = searchParams.get('claimsType') || '';
  const acceptAssignId = searchParams.get('acceptAssignId') || null;

  // State
  const [investigationId, setInvestigationId] = useState('');
  const [agencyQC, setAgencyQC] = useState<AgencyQCData>({
    recommendation: '',
    remarks: '',
    repudiationGrounds: '',
    exclusionReason: '',
    exclusionReasonRemarks: '',
    otherRemark: '',
    others: '',
    fraudRemark: '',
    misrepresentationRemark: '',
    ailment: '',
    pedRemark: '',
    description: '',
    travellingExpenses: '0',
    extraVisit: '0',
    ipdMiscellaneous: '0',
    sumOfExp: '0',
    totalExpenses: '0',
    noDataStatus: 'Editable',
  });

  const [fraudClaimReason, setFraudClaimReason] = useState<string[]>([]);
  const [fraudClaimEvidence, setFraudClaimEvidence] = useState<string[]>([]);
  const [pedEvidenceVal, setPedEvidenceVal] = useState<string[]>([]);

  // Dropdowns
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [repudiationGrounds, setRepudiationGrounds] = useState<DropdownItem[]>([]);
  const [fraudClaimReasons, setFraudClaimReasons] = useState<FraudReasonItem[]>([]);
  const [fraudClaimEvidences, setFraudClaimEvidences] = useState<FraudEvidenceItem[]>([]);
  const [pedEvidences, setPedEvidences] = useState<PEDEvidenceItem[]>([]);

  // Other state
  const [tabCheck, setTabCheck] = useState<TabCheck>({});
  const [loading, setLoading] = useState(false);

  const roleName = sessionStorage.getItem('roleName') || '';

  // Initialize
  useEffect(() => {
    if (rawInvestigationId) {
      const cleanId = rawInvestigationId.split(' ')[0].split('-')[0];
      setInvestigationId(cleanId);
    }
  }, [rawInvestigationId]);

  // Fetch data when investigation ID is set
  useEffect(() => {
    if (investigationId) {
      fetchDropdowns();
      fetchData();
      fetchTabCheck();
    }
  }, [investigationId]);

  // Fetch all dropdowns
  const fetchDropdowns = async () => {
    try {
      // Fetch recommendations
      const recResponse = await DropdownService.getRecomendation();
      console.log("12345678",recResponse)
      if (recResponse.statusCode === 0) {
        setRecommendations(recResponse.payload || []);
      }

      // Fetch repudiation grounds
      const repResponse:any = await DropdownService.getRepudiationGrounds();
      if (repResponse.statusCode === 0) {
        setRepudiationGrounds(repResponse.payload || []);
      }

      // Fetch fraud claim reasons
      const frResponse:any = await DropdownService.getFraudClaimReason();
      if (frResponse.statusCode === 0) {
        setFraudClaimReasons(frResponse.payload || []);
      }

      // Fetch fraud claim evidences
      const feResponse:any = await DropdownService.getFraudClaimEvedance();
      if (feResponse.statusCode === 0) {
        setFraudClaimEvidences(feResponse.payload || []);
      }

      // Fetch PED evidences
      const pedResponse:any = await claimsService.getAllPEDEvidences();
      if (pedResponse.statusCode === 0) {
        setPedEvidences(pedResponse.payload || []);
      }
    } catch (error) {
      console.error('Error fetching dropdowns:', error);
    }
  };

  // Fetch QC data
  const fetchData = async () => {
    try {
      const tabName = roleName === 'Regional Manager' ? 'regionalQC' : '';
      
      if (claimsType === 'cashless') {
        const response = await agencyQcUpdateService.getQCUpdateData(investigationId, tabName);
        if (response.statusCode === 0) {
          populateData(response.payload);
        }
      } else {
        const response = await agencyQcUpdateService.getReClaimQCData(investigationId, tabName);
        if (response.statusCode === 0 && response.payload?.[0]) {
          populateData(response.payload[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching QC data:', error);
    }
  };

  // Populate form with fetched data
  const populateData = (data: any) => {
    setAgencyQC({
      recommendation: data.recommendation || '',
      remarks: data.remarks || '',
      repudiationGrounds: data.repudiationGrounds || '',
      exclusionReason: data.exclusionReason || '',
      exclusionReasonRemarks: data.exclusionReasonRemarks || '',
      otherRemark: data.otherRemark || '',
      others: data.others || '',
      fraudRemark: data.fraudRemark || '',
      misrepresentationRemark: data.misrepresentationRemark || '',
      ailment: data.ailment || '',
      pedRemark: data.pedRemark || '',
      description: data.description || '',
      travellingExpenses: data.travellingExpenses || '0',
      extraVisit: data.extraVisit || '0',
      ipdMiscellaneous: data.ipdMiscellaneous || '0',
      sumOfExp: data.sumOfExp || '0',
      totalExpenses: data.totalExpenses || '0',
      noDataStatus: data.noDataStatus || 'Editable',
      hospitalVisitStatus: data.hospitalVisitStatus,
      insuredVisitStatus: data.insuredVisitStatus,
      employerVisitStatus: data.employerVisitStatus,
    });

    setFraudClaimReason(data.fraudClaimReasonClaimQCDTO?.fraudClaimReasonCode || []);
    setFraudClaimEvidence(data.fraudClaimEvidencesClaimQCDTO?.fraudClaimEvidenceCode || []);
    setPedEvidenceVal(data.pedClaimEvidenceQCDTO?.pedClaimEvidenceCode || []);
  };

  // Fetch tab check data
  const fetchTabCheck = async () => {
    try {
      const response = await ReimService.getTabDetails(investigationId, 'caseUpdate');
      if (response.statusCode === 0) {
        setTabCheck(response.payload || {});
      }
    } catch (error) {
      console.error('Error fetching tab check:', error);
    }
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof AgencyQCData, value: any) => {
    setAgencyQC(prev => ({ ...prev, [field]: value }));
  };

  // Calculate total expenses
  const calculateTotal = () => {
    const travel = parseFloat(agencyQC.travellingExpenses) || 0;
    const extra = parseFloat(agencyQC.extraVisit) || 0;
    const ipd = parseFloat(agencyQC.ipdMiscellaneous) || 0;
    return travel + extra + ipd;
  };

  // Submit QC update
  const submitQCUpdate = async () => {
    // Validation
    if (!agencyQC.recommendation || !agencyQC.remarks) {
      alert('Please enter the required fields (marked with *)');
      return;
    }

    if (agencyQC.recommendation === 'CO0061' && !agencyQC.repudiationGrounds) {
      alert('Please enter the required fields (marked with *)');
      return;
    }

    if ((agencyQC.repudiationGrounds === 'CO0068' || agencyQC.repudiationGrounds === 'CO0065') &&
        (fraudClaimReason.length === 0 || fraudClaimEvidence.length === 0 || !agencyQC.fraudRemark)) {
      alert('Please enter the required fields (marked with *)');
      return;
    }

    if (agencyQC.repudiationGrounds === 'CO0066' &&
        (!agencyQC.ailment || pedEvidenceVal.length === 0 || !agencyQC.pedRemark)) {
      alert('Please enter the required fields (marked with *)');
      return;
    }

    if (agencyQC.repudiationGrounds === 'CO0067' &&
        (!agencyQC.exclusionReason || !agencyQC.exclusionReasonRemarks)) {
      alert('Please enter the required fields (marked with *)');
      return;
    }

    if (agencyQC.repudiationGrounds === 'CO0069' &&
        (!agencyQC.otherRemark || !agencyQC.others)) {
      alert('Please enter the required fields (marked with *)');
      return;
    }

    // Check expenses description
    const total = calculateTotal();
    if (total > 0 && !agencyQC.description) {
      alert('Please enter description');
      return;
    }

    // Prepare payload
    const payload: any = {
      ...agencyQC,
      acceptAssignId,
      sumOfExp: String(total),
    };

    // Add fraud data if applicable
    if (agencyQC.recommendation === 'CO0061' && 
        (agencyQC.repudiationGrounds === 'CO0068' || agencyQC.repudiationGrounds === 'CO0065')) {
      payload.fraudClaimReasonClaimQCDTO = { fraudClaimReasonCode: fraudClaimReason };
      payload.fraudClaimEvidencesClaimQCDTO = { fraudClaimEvidenceCode: fraudClaimEvidence };
    }

    // Add PED data if applicable
    if (agencyQC.recommendation === 'CO0061' && agencyQC.repudiationGrounds === 'CO0066') {
      payload.pedClaimEvidenceQCDTO = { pedClaimEvidenceCode: pedEvidenceVal };
    }

    setLoading(true);
    try {
      let response;
      if (claimsType === 'reim') {
        response = await agencyQcUpdateService.addQCUpdateReim(payload, investigationId);
      } else {
        response = await agencyQcUpdateService.addQCUpdate(payload, investigationId);
      }

      if (response.statusCode === 0) {
        alert('QC Updated Successfully!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error submitting QC update:', error);
      alert('Failed to submit QC update');
    } finally {
      setLoading(false);
    }
  };

  const isEditable = agencyQC.noDataStatus === 'Editable';

  return (
    <Box>
      {/* Visit Status Table (Reimbursement only, not for Agency Spoc) */}
      {claimsType === 'reim' && roleName !== 'Agency Spoc' && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#6F62C2' }}>
                    {tabCheck.hospitalVisit && (
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                        Hospital Visit Status
                      </TableCell>
                    )}
                    {tabCheck.insuredPersonVisit && (
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                        Insured Visit Status
                      </TableCell>
                    )}
                    {tabCheck.employeerVisit && (
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                        Employer Visit Status
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {tabCheck.hospitalVisit && (
                      <TableCell>{agencyQC.hospitalVisitStatus || '-'}</TableCell>
                    )}
                    {tabCheck.insuredPersonVisit && (
                      <TableCell>{agencyQC.insuredVisitStatus || '-'}</TableCell>
                    )}
                    {tabCheck.employeerVisit && (
                      <TableCell>{agencyQC.employerVisitStatus || '-'}</TableCell>
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* LEFT COLUMN - Conclusion */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: '#6F62C2', fontWeight: 700, mb: 3 }}
              >
                Conclusion
              </Typography>

              {/* Recommendation */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Recommendation*</InputLabel>
                <Select
                  value={agencyQC.recommendation}
                  onChange={(e) => handleFieldChange('recommendation', e.target.value)}
                  disabled={!isEditable}
                  label="Recommendation*"
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
                label="Remarks*"
                multiline
                rows={5}
                value={agencyQC.remarks}
                onChange={(e) => handleFieldChange('remarks', e.target.value)}
                disabled={!isEditable}
                sx={{ mb: 3 }}
              />

              {/* Repudiation Grounds (if recommendation = CO0061) */}
              {agencyQC.recommendation === 'CO0061' && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Repudiation Grounds*</InputLabel>
                  <Select
                    value={agencyQC.repudiationGrounds}
                    onChange={(e) => handleFieldChange('repudiationGrounds', e.target.value)}
                    disabled={!isEditable}
                    label="Repudiation Grounds*"
                  >
                    {repudiationGrounds.map((rep) => (
                      <MenuItem key={rep.code} value={rep.code}>
                        {rep.codeDescription}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* EXCLUSION (CO0067) */}
              {agencyQC.repudiationGrounds === 'CO0067' && agencyQC.recommendation === 'CO0061' && (
                <>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Exclusion Reason*</InputLabel>
                    <Select
                      value={agencyQC.exclusionReason}
                      onChange={(e) => handleFieldChange('exclusionReason', e.target.value)}
                      disabled={!isEditable}
                      label="Exclusion Reason*"
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="permanent">Permanent</MenuItem>
                      <MenuItem value="firstTwoYear">First Two Years</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Remarks*"
                    multiline
                    rows={5}
                    value={agencyQC.exclusionReasonRemarks}
                    onChange={(e) => handleFieldChange('exclusionReasonRemarks', e.target.value)}
                    disabled={!isEditable}
                    sx={{ mb: 3 }}
                  />
                </>
              )}

              {/* OTHERS (CO0069) */}
              {agencyQC.repudiationGrounds === 'CO0069' && agencyQC.recommendation === 'CO0061' && (
                <>
                  <TextField
                    fullWidth
                    label="Remarks*"
                    multiline
                    rows={5}
                    value={agencyQC.otherRemark}
                    onChange={(e) => handleFieldChange('otherRemark', e.target.value)}
                    disabled={!isEditable}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Final Remarks*"
                    multiline
                    rows={5}
                    value={agencyQC.others}
                    onChange={(e) => handleFieldChange('others', e.target.value)}
                    disabled={!isEditable}
                    sx={{ mb: 3 }}
                  />
                </>
              )}

              {/* MISREPRESENTATION (CO0068) or FRAUD (CO0065) */}
              {(agencyQC.repudiationGrounds === 'CO0068' || agencyQC.repudiationGrounds === 'CO0065') &&
                agencyQC.recommendation === 'CO0061' && (
                <>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Fraud Claim Reasons*</InputLabel>
                    <Select
                      multiple
                      value={fraudClaimReason}
                      onChange={(e) => setFraudClaimReason(e.target.value as string[])}
                      disabled={!isEditable}
                      input={<OutlinedInput label="Fraud Claim Reasons*" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => {
                            const item = fraudClaimReasons.find(f => f.fraudClaimReasonCode === value);
                            return (
                              <Chip key={value} label={item?.fraudClaimReason || value} size="small" />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {fraudClaimReasons.map((reason) => (
                        <MenuItem key={reason.fraudClaimReasonCode} value={reason.fraudClaimReasonCode}>
                          {reason.fraudClaimReason}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Fraud Claim Evidence*</InputLabel>
                    <Select
                      multiple
                      value={fraudClaimEvidence}
                      onChange={(e) => setFraudClaimEvidence(e.target.value as string[])}
                      disabled={!isEditable}
                      input={<OutlinedInput label="Fraud Claim Evidence*" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => {
                            const item = fraudClaimEvidences.find(f => f.fraudClaimEvidenceCode === value);
                            return (
                              <Chip key={value} label={item?.fraudClaimEvidence || value} size="small" />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {fraudClaimEvidences.map((evidence) => (
                        <MenuItem key={evidence.fraudClaimEvidenceCode} value={evidence.fraudClaimEvidenceCode}>
                          {evidence.fraudClaimEvidence}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label={agencyQC.repudiationGrounds === 'CO0068' ? 'Remarks' : 'Remarks*'}
                    multiline
                    rows={5}
                    value={agencyQC.repudiationGrounds === 'CO0068' ? agencyQC.misrepresentationRemark : agencyQC.fraudRemark}
                    onChange={(e) => handleFieldChange(
                      agencyQC.repudiationGrounds === 'CO0068' ? 'misrepresentationRemark' : 'fraudRemark',
                      e.target.value
                    )}
                    disabled={!isEditable}
                    sx={{ mb: 3 }}
                  />
                </>
              )}

              {/* PED (CO0066) */}
              {agencyQC.repudiationGrounds === 'CO0066' && agencyQC.recommendation === 'CO0061' && (
                <>
                  <TextField
                    fullWidth
                    label="Ailment*"
                    multiline
                    rows={5}
                    value={agencyQC.ailment}
                    onChange={(e) => handleFieldChange('ailment', e.target.value)}
                    disabled={!isEditable}
                    helperText="Disease Name with duration*"
                    sx={{ mb: 3 }}
                  />

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>PED Evidences*</InputLabel>
                    <Select
                      multiple
                      value={pedEvidenceVal}
                      onChange={(e) => setPedEvidenceVal(e.target.value as string[])}
                      disabled={!isEditable}
                      input={<OutlinedInput label="PED Evidences*" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => {
                            const item = pedEvidences.find(p => p.pedClaimEvidenceCode === value);
                            return (
                              <Chip key={value} label={item?.pedClaimEvidence || value} size="small" />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {pedEvidences.map((ped) => (
                        <MenuItem key={ped.pedClaimEvidenceCode} value={ped.pedClaimEvidenceCode}>
                          {ped.pedClaimEvidence}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Remarks*"
                    multiline
                    rows={5}
                    value={agencyQC.pedRemark}
                    onChange={(e) => handleFieldChange('pedRemark', e.target.value)}
                    disabled={!isEditable}
                    sx={{ mb: 3 }}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT COLUMN - Expense Details */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: '#6F62C2', fontWeight: 700, mb: 3 }}
              >
                Expense Details
              </Typography>

              <TextField
                fullWidth
                label="Travelling Expense"
                type="number"
                value={agencyQC.travellingExpenses}
                onChange={(e) => handleFieldChange('travellingExpenses', e.target.value)}
                disabled={!isEditable}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Extra Visit"
                type="number"
                value={agencyQC.extraVisit}
                onChange={(e) => handleFieldChange('extraVisit', e.target.value)}
                disabled={!isEditable}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="IPD & Miscellaneous"
                type="number"
                value={agencyQC.ipdMiscellaneous}
                onChange={(e) => handleFieldChange('ipdMiscellaneous', e.target.value)}
                disabled={!isEditable}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={5}
                value={agencyQC.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                disabled={!isEditable}
                sx={{ mb: 3 }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Total Expenses
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} color="primary">
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </Typography>
              </Box>

              {isEditable && (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={submitQCUpdate}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                    },
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QCUpdates;