import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import ReimService from '../../../services/reim.service';
import reimcaseUpdateService from '../../../services/reim-case-update.service';

// ========== INTERFACES ==========
interface InsuredVerificationProps {
  buttonEnable?: boolean;
  previousData?: any;
  onChangeTab?: (value: boolean) => void;
}

interface FormData {
  insuredVisitDone: boolean | null;
  insuredAppointmentTaken: string;
  insureName: string;
  insuredContactNumber: string;
  insuredReason: string;
  insuredStatementCollected: boolean | null;
  insuredStatementCollectedReason: string;
  insuredDiscrepanciesFound: boolean | null;
  insuredPEDNoted: boolean | null;
  insuredPEDFinding: string;
  insuredPastDocumentCollected: boolean | null;
  insuredPastDocumentSpecify: string;
  insuredPastDocumentReason: string;
  insuredAlcoholHistory: boolean | null;
  insuredSmokingHistory: boolean | null;
  insuredAnyOtherHabits: boolean | null;
  insuredOtherHabits: string;
  insuredAlcoholQuantity: string;
  insuredSmokingQuantity: string;
  insuredKYCCollected: boolean | null;
  insuredKYCDiscrepancies: string;
  insuredKYCReason: string;
  insuredFamilyPhysicianName: string;
  insuredFamilyPhysicianContactNo: string;
  insuredFamilyPhysicianRegNo: string;
  insuredFamilyPhysicianIsStatementCollected: boolean | null;
  insuredFamilyPhysicianPEDNoted: string;
  insuredFamilyPhysicianIsDiscrepancyNoted: string;
  insuredFamilyPhysicianDiscrepancyFindings: string;
  insuredFamilyPhysicianNoStatementCollectedReason: string;
  insuredReferralDoctorName: string;
  insuredReferralDoctorContactNo: string;
  insuredReferralDoctorRegNo: string;
  insuredReferralDoctorIsStatementCollected: boolean | null;
  insuredReferralDoctorPEDNoted: string;
  insuredReferralDoctorIsDiscrepancyNoted: string;
  insuredReferralDoctorPEDFindings: string;
  insuredReferralDoctorDiscrepancyFindings: string;
  insuredReferralDoctorNoStatementCollectedReason: string;
  insuredFamilyPhysicianIsVicinityChecked: string;
  insuredFamilyPhysicianVicinityFindings: string;
  insuredAnyOtherInvestigationFindings: string;
}

interface TabCheck {
  employeerVisit: boolean;
  hospitalVisit: boolean;
  insuredPersonVisit: boolean;
}

// ========== SERVICES ==========
// const reimcaseUpdateService = {
//   addInsuredVerify: async (formData: any, investigationId: string) => {
//     const response = await fetch(
//       `${import.meta.env.VITE_API_BASE_URL}/api/reim-case-update/insured-verify/${investigationId}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       }
//     );
//     return response.json();
//   },
// };

// const reimService = {
//   getTabDetails: async (investigationId: string, type: string) => {
//     const response = await fetch(
//       `${import.meta.env.VITE_API_BASE_URL}/api/reim/tab-details/${investigationId}?type=${type}`
//     );
//     return response.json();
//   },
// };

const notificationService = {
  showAlertSuccess: (msg: string) => alert(msg),
  showAlertError: (msg: string) => alert(msg),
};

const messages = {
  insuredSavedDraft: 'Insured verification saved as draft successfully',
};

// ========== HELPERS ==========
const convertBoolToString = (val: any): string => {
  if (val === true) return 'true';
  if (val === false) return 'false';
  return '';
};

const convertToBoolean = (status: string): boolean | null => {
  if (status === 'true') return true;
  if (status === 'false') return false;
  return null;
};

const getDefaultFormData = (): FormData => ({
  insuredVisitDone: null,
  insuredAppointmentTaken: '',
  insureName: '',
  insuredContactNumber: '',
  insuredReason: '',
  insuredStatementCollected: null,
  insuredStatementCollectedReason: '',
  insuredDiscrepanciesFound: null,
  insuredPEDNoted: null,
  insuredPEDFinding: '',
  insuredPastDocumentCollected: null,
  insuredPastDocumentSpecify: '',
  insuredPastDocumentReason: '',
  insuredAlcoholHistory: null,
  insuredSmokingHistory: null,
  insuredAnyOtherHabits: null,
  insuredOtherHabits: '',
  insuredAlcoholQuantity: '',
  insuredSmokingQuantity: '',
  insuredKYCCollected: null,
  insuredKYCDiscrepancies: '',
  insuredKYCReason: '',
  insuredFamilyPhysicianName: '',
  insuredFamilyPhysicianContactNo: '',
  insuredFamilyPhysicianRegNo: '',
  insuredFamilyPhysicianIsStatementCollected: null,
  insuredFamilyPhysicianPEDNoted: '',
  insuredFamilyPhysicianIsDiscrepancyNoted: '',
  insuredFamilyPhysicianDiscrepancyFindings: '',
  insuredFamilyPhysicianNoStatementCollectedReason: '',
  insuredReferralDoctorName: '',
  insuredReferralDoctorContactNo: '',
  insuredReferralDoctorRegNo: '',
  insuredReferralDoctorIsStatementCollected: null,
  insuredReferralDoctorPEDNoted: '',
  insuredReferralDoctorIsDiscrepancyNoted: '',
  insuredReferralDoctorPEDFindings: '',
  insuredReferralDoctorDiscrepancyFindings: '',
  insuredReferralDoctorNoStatementCollectedReason: '',
  insuredFamilyPhysicianIsVicinityChecked: '',
  insuredFamilyPhysicianVicinityFindings: '',
  insuredAnyOtherInvestigationFindings: '',
});

// ========== MAIN COMPONENT ==========
const InsuredVerification: React.FC<InsuredVerificationProps> = ({
  buttonEnable = true,
  previousData = {},
  onChangeTab,
}) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const acceptAssignId = searchParams.get('acceptAssignId');
  const redirectTo = searchParams.get('redirectTo');

  const [formData, setFormData] = useState<FormData>(getDefaultFormData());
  const [showSmoking, setShowSmoking] = useState(false);
  const [showAlcohol, setShowAlcohol] = useState(false);
  const [showHabit, setShowHabit] = useState(false);
  const [tabCheck, setTabCheck] = useState<TabCheck>({
    employeerVisit: false,
    hospitalVisit: false,
    insuredPersonVisit: false,
  });
  const [loading, setLoading] = useState(false);

  // Load tab details
  useEffect(() => {
    if (investigationId) {
      const cleanId = investigationId.split(' ')[0];
      ReimService.getTabDetails(cleanId, 'caseUpdate').then((data) => {
        if (data.statusCode === 0) setTabCheck(data.payload);
      });
    }
  }, [investigationId]);

  // Populate from previousData
  useEffect(() => {
    if (previousData && Object.keys(previousData).length > 0) {
      setFormData({
        insuredVisitDone: previousData.insuredVisitDone,
        insuredAppointmentTaken: convertBoolToString(previousData.insuredAppointmentTaken),
        insureName: previousData.insureName || '',
        insuredContactNumber: previousData.insuredContactNumber || '',
        insuredReason: previousData.insuredReason || '',
        insuredStatementCollected: previousData.insuredStatementCollected,
        insuredStatementCollectedReason: previousData.insuredStatementCollectedReason || '',
        insuredDiscrepanciesFound: previousData.insuredDiscrepanciesFound,
        insuredPEDNoted: previousData.insuredPEDNoted,
        insuredPEDFinding: previousData.insuredPEDFinding || '',
        insuredPastDocumentCollected: previousData.insuredPastDocumentCollected,
        insuredPastDocumentSpecify: previousData.insuredPastDocumentSpecify || '',
        insuredPastDocumentReason: previousData.insuredPastDocumentReason || '',
        insuredAlcoholHistory: previousData.insuredAlcoholHistory,
        insuredSmokingHistory: previousData.insuredSmokingHistory,
        insuredAnyOtherHabits:
          previousData.insuredAnyOtherHabits === 'yes'
            ? true
            : previousData.insuredAnyOtherHabits === 'no'
              ? false
              : null,
        insuredOtherHabits: previousData.insuredOtherHabits || '',
        insuredAlcoholQuantity: previousData.insuredAlcoholQuantity || '',
        insuredSmokingQuantity: previousData.insuredSmokingQuantity || '',
        insuredKYCCollected: previousData.insuredKYCCollected,
        insuredKYCDiscrepancies: previousData.insuredKYCDiscrepancies || '',
        insuredKYCReason: previousData.insuredKYCReason || '',
        insuredFamilyPhysicianName: previousData.insuredFamilyPhysicianName || '',
        insuredFamilyPhysicianContactNo: previousData.insuredFamilyPhysicianContactNo || '',
        insuredFamilyPhysicianRegNo: previousData.insuredFamilyPhysicianRegNo || '',
        insuredFamilyPhysicianIsStatementCollected:
          previousData.insuredFamilyPhysicianIsStatementCollected,
        insuredFamilyPhysicianPEDNoted: convertBoolToString(
          previousData.insuredFamilyPhysicianPEDNoted
        ),
        insuredFamilyPhysicianIsDiscrepancyNoted: convertBoolToString(
          previousData.insuredFamilyPhysicianIsDiscrepancyNoted
        ),
        insuredFamilyPhysicianDiscrepancyFindings:
          previousData.insuredFamilyPhysicianDiscrepancyFindings || '',
        insuredFamilyPhysicianNoStatementCollectedReason:
          previousData.insuredFamilyPhysicianNoStatementCollectedReason || '',
        insuredReferralDoctorName: previousData.insuredReferralDoctorName || '',
        insuredReferralDoctorContactNo: previousData.insuredReferralDoctorContactNo || '',
        insuredReferralDoctorRegNo: previousData.insuredReferralDoctorRegNo || '',
        insuredReferralDoctorIsStatementCollected:
          previousData.insuredReferralDoctorIsStatementCollected,
        insuredReferralDoctorPEDNoted: convertBoolToString(previousData.insuredReferralDoctorPEDNoted),
        insuredReferralDoctorIsDiscrepancyNoted: convertBoolToString(
          previousData.insuredReferralDoctorIsDiscrepancyNoted
        ),
        insuredReferralDoctorPEDFindings: previousData.insuredReferralDoctorPEDFindings || '',
        insuredReferralDoctorDiscrepancyFindings:
          previousData.insuredReferralDoctorDiscrepancyFindings || '',
        insuredReferralDoctorNoStatementCollectedReason:
          previousData.insuredReferralDoctorNoStatementCollectedReason || '',
        insuredFamilyPhysicianIsVicinityChecked: convertBoolToString(
          previousData.insuredFamilyPhysicianIsVicinityChecked
        ),
        insuredFamilyPhysicianVicinityFindings:
          previousData.insuredFamilyPhysicianVicinityFindings || '',
        insuredAnyOtherInvestigationFindings:
          previousData.insuredAnyOtherInvestigationFindings || '',
      });
      if (previousData.insuredAnyOtherHabits === 'yes') setShowHabit(true);
      if (previousData.insuredSmokingHistory) setShowSmoking(true);
      if (previousData.insuredAlcoholHistory) setShowAlcohol(true);
    }
  }, [previousData]);

  // Handlers
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSmokingChange = (value: boolean) => {
    handleChange('insuredSmokingHistory', value);
    setShowSmoking(value);
    if (!value) handleChange('insuredSmokingQuantity', '');
  };

  const handleAlcoholChange = (value: boolean) => {
    handleChange('insuredAlcoholHistory', value);
    setShowAlcohol(value);
    if (!value) handleChange('insuredAlcoholQuantity', '');
  };

  const handleHabitsChange = (value: boolean) => {
    handleChange('insuredAnyOtherHabits', value);
    setShowHabit(value);
    if (!value) handleChange('insuredOtherHabits', '');
  };

  const saveInsured = async () => {
    setLoading(true);
    const cleanId = investigationId?.split(' ')[0] || '';
    const submitData = {
      ...formData,
      acceptAssignId: localStorage.getItem('acceptAssignId') || acceptAssignId,
      activeReCaseID: localStorage.getItem('activeReCaseID'),
      insuredAppointmentTaken: convertToBoolean(formData.insuredAppointmentTaken),
      insuredFamilyPhysicianPEDNoted: convertToBoolean(formData.insuredFamilyPhysicianPEDNoted),
      insuredFamilyPhysicianIsDiscrepancyNoted: convertToBoolean(
        formData.insuredFamilyPhysicianIsDiscrepancyNoted
      ),
      insuredReferralDoctorPEDNoted: convertToBoolean(formData.insuredReferralDoctorPEDNoted),
      insuredReferralDoctorIsDiscrepancyNoted: convertToBoolean(
        formData.insuredReferralDoctorIsDiscrepancyNoted
      ),
      insuredFamilyPhysicianIsVicinityChecked: convertToBoolean(
        formData.insuredFamilyPhysicianIsVicinityChecked
      ),
      btnAction: 'saveasdraft',
    };
    try {
      const data: any = await reimcaseUpdateService.addInsuredVerify(submitData, cleanId);
      if (data.statusCode === 0) {
        notificationService.showAlertSuccess(messages.insuredSavedDraft);
        if (onChangeTab) onChangeTab(true);
      } else {
        notificationService.showAlertError(data.message);
      }
    } catch (error) {
      notificationService.showAlertError('Error saving');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    const cleanId = investigationId?.split(' ')[0] || '';
    const submitData = {
      ...formData,
      acceptAssignId: localStorage.getItem('acceptAssignId') || acceptAssignId,
      activeReCaseID: localStorage.getItem('activeReCaseID'),
      insuredAppointmentTaken: convertToBoolean(formData.insuredAppointmentTaken),
      insuredFamilyPhysicianPEDNoted: convertToBoolean(formData.insuredFamilyPhysicianPEDNoted),
      insuredFamilyPhysicianIsDiscrepancyNoted: convertToBoolean(
        formData.insuredFamilyPhysicianIsDiscrepancyNoted
      ),
      insuredReferralDoctorPEDNoted: convertToBoolean(formData.insuredReferralDoctorPEDNoted),
      insuredReferralDoctorIsDiscrepancyNoted: convertToBoolean(
        formData.insuredReferralDoctorIsDiscrepancyNoted
      ),
      insuredFamilyPhysicianIsVicinityChecked: convertToBoolean(
        formData.insuredFamilyPhysicianIsVicinityChecked
      ),
      btnAction: 'submittoqc',
    };
    try {
      const data: any = await reimcaseUpdateService.addInsuredVerify(submitData, cleanId);
      if (data.statusCode === 0) {
        notificationService.showAlertSuccess(messages.insuredSavedDraft);
        navigate(redirectTo || '/admin/dashboard');
      } else {
        notificationService.showAlertError(data.message);
      }
    } catch (error) {
      notificationService.showAlertError('Error submitting');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !buttonEnable;

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 2 }}>
                  <FormLabel>Visit Done</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 10 }}>
                  <RadioGroup
                    row
                    value={formData.insuredVisitDone === null ? '' : String(formData.insuredVisitDone)}
                    onChange={(e) => handleChange('insuredVisitDone', e.target.value === 'true')}
                  >
                    <FormControlLabel value="true" control={<Radio disabled={isDisabled} />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio disabled={isDisabled} />} label="No" />
                  </RadioGroup>
                </Grid>
              </Grid>
              {formData.insuredVisitDone === true && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <FormLabel>Appointment Taken</FormLabel>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Select
                      fullWidth
                      value={formData.insuredAppointmentTaken}
                      onChange={(e) => handleChange('insuredAppointmentTaken', e.target.value)}
                      disabled={isDisabled}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              )}
              {formData.insuredVisitDone === true && formData.insuredAppointmentTaken === 'true' && (
                <>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <FormLabel>Name</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        value={formData.insureName}
                        onChange={(e) => handleChange('insureName', e.target.value)}
                        disabled={isDisabled}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <FormLabel>Contact Number</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        value={formData.insuredContactNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            handleChange('insuredContactNumber', value);
                          }
                        }}
                        disabled={isDisabled}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              {formData.insuredVisitDone === false && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <FormLabel>Reason</FormLabel>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      value={formData.insuredReason}
                      onChange={(e) => handleChange('insuredReason', e.target.value)}
                      disabled={isDisabled}
                    />
                  </Grid>
                </Grid>
              )}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormLabel>Statement collected</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <RadioGroup
                    row
                    value={
                      formData.insuredStatementCollected === null
                        ? ''
                        : String(formData.insuredStatementCollected)
                    }
                    onChange={(e) =>
                      handleChange('insuredStatementCollected', e.target.value === 'true')
                    }
                  >
                    <FormControlLabel value="true" control={<Radio disabled={isDisabled} />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio disabled={isDisabled} />} label="No" />
                  </RadioGroup>
                </Grid>
              </Grid>

              {formData.insuredStatementCollected === false && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormLabel>Reason</FormLabel>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      value={formData.insuredStatementCollectedReason}
                      onChange={(e) =>
                        handleChange('insuredStatementCollectedReason', e.target.value)
                      }
                      disabled={isDisabled}
                    />
                  </Grid>
                </Grid>
              )}

              {formData.insuredStatementCollected === true && (
                <>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormLabel>Discrepancies found</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <RadioGroup
                        row
                        value={
                          formData.insuredDiscrepanciesFound === null
                            ? ''
                            : String(formData.insuredDiscrepanciesFound)
                        }
                        onChange={(e) =>
                          handleChange('insuredDiscrepanciesFound', e.target.value === 'true')
                        }
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio disabled={isDisabled} />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio disabled={isDisabled} />}
                          label="No"
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>

                  {/* {formData.insuredDiscrepanciesFound === true && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <FormLabel>Discrepancies Findings</FormLabel>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={5}
                            value={formData.insuredPEDFinding}
                            onChange={(e) => handleChange('insuredPEDFinding', e.target.value)}
                            disabled={isDisabled}
                          />
                        </Grid>
                      </Grid>
                  )} */}

                  {/* PED Noted */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormLabel>PED Noted</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <RadioGroup
                        row
                        value={formData.insuredPEDNoted === null ? '' : String(formData.insuredPEDNoted)}
                        onChange={(e) => handleChange('insuredPEDNoted', e.target.value === 'true')}
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio disabled={isDisabled} />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio disabled={isDisabled} />}
                          label="No"
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>

                  {/* PED Findings (if PED noted) */}
                  {formData.insuredPEDNoted === true && (
                    <>
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <FormLabel>PED Findings</FormLabel>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={5}
                            value={formData.insuredPEDFinding}
                            onChange={(e) => handleChange('insuredPEDFinding', e.target.value)}
                            disabled={isDisabled}
                          />
                        </Grid>
                      </Grid>

                      {/* Past Documents Collected */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <FormLabel>Past documents collected</FormLabel>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}>
                          <RadioGroup
                            row
                            value={
                              formData.insuredPastDocumentCollected === null
                                ? ''
                                : String(formData.insuredPastDocumentCollected)
                            }
                            onChange={(e) =>
                              handleChange('insuredPastDocumentCollected', e.target.value === 'true')
                            }
                          >
                            <FormControlLabel
                              value="true"
                              control={<Radio disabled={isDisabled} />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value="false"
                              control={<Radio disabled={isDisabled} />}
                              label="No"
                            />
                          </RadioGroup>
                        </Grid>
                      </Grid>

                      {/* Please Specify (if past docs collected) */}
                      {formData.insuredPastDocumentCollected === true && (
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <FormLabel>Please Specify</FormLabel>
                          </Grid>
                          <Grid size={{ xs: 12, md: 8 }}>
                            <TextField
                              fullWidth
                              multiline
                              rows={5}
                              value={formData.insuredPastDocumentSpecify}
                              onChange={(e) =>
                                handleChange('insuredPastDocumentSpecify', e.target.value)
                              }
                              disabled={isDisabled}
                            />
                          </Grid>
                        </Grid>
                      )}

                      {/* Reason (if past docs not collected) */}
                      {formData.insuredPastDocumentCollected === false && (
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <FormLabel>Reason</FormLabel>
                          </Grid>
                          <Grid size={{ xs: 12, md: 8 }}>
                            <TextField
                              fullWidth
                              multiline
                              rows={5}
                              value={formData.insuredPastDocumentReason}
                              onChange={(e) =>
                                handleChange('insuredPastDocumentReason', e.target.value)
                              }
                              disabled={isDisabled}
                            />
                          </Grid>
                        </Grid>
                      )}
                    </>
                  )}
                </>
              )}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Physician
              </Typography>

              {/* Name */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormLabel>Name</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    value={formData.insuredFamilyPhysicianName}
                    onChange={(e) => handleChange('insuredFamilyPhysicianName', e.target.value)}
                    disabled={isDisabled}
                  />
                </Grid>
              </Grid>

              {/* Contact Number */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormLabel>Contact Number</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    value={formData.insuredFamilyPhysicianContactNo}
                    onChange={(e) =>
                      handleChange('insuredFamilyPhysicianContactNo', e.target.value)
                    }
                    disabled={isDisabled}
                  />
                </Grid>
              </Grid>

              {/* Registration Number */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormLabel>Registration Number</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    value={formData.insuredFamilyPhysicianRegNo}
                    onChange={(e) => handleChange('insuredFamilyPhysicianRegNo', e.target.value)}
                    disabled={isDisabled}
                  />
                </Grid>
              </Grid>

              {/* Statement Collected */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormLabel>Statement collected</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <RadioGroup
                    row
                    value={
                      formData.insuredFamilyPhysicianIsStatementCollected === null
                        ? ''
                        : String(formData.insuredFamilyPhysicianIsStatementCollected)
                    }
                    onChange={(e) =>
                      handleChange(
                        'insuredFamilyPhysicianIsStatementCollected',
                        e.target.value === 'true'
                      )
                    }
                  >
                    <FormControlLabel value="true" control={<Radio disabled={isDisabled} />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio disabled={isDisabled} />} label="No" />
                  </RadioGroup>
                </Grid>
              </Grid>

              {/* If Statement Collected = Yes */}
              {formData.insuredFamilyPhysicianIsStatementCollected === true && (
                <>
                  {/* Any PED noted */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormLabel>Any PED noted?</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Select
                        fullWidth
                        value={formData.insuredFamilyPhysicianPEDNoted}
                        onChange={(e) =>
                          handleChange('insuredFamilyPhysicianPEDNoted', e.target.value)
                        }
                        disabled={isDisabled}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>

                  {formData.insuredFamilyPhysicianPEDNoted === 'true' && (
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="PED Findings"
                      value={formData.insuredFamilyPhysicianDiscrepancyFindings}
                      onChange={(e) => handleChange('insuredFamilyPhysicianDiscrepancyFindings', e.target.value)}
                      disabled={!buttonEnable}
                      sx={{ mb: 2 }}
                    />
                  )}

                  {/* Any Discrepancy noted */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormLabel>Any Discrepancy noted?</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Select
                        fullWidth
                        value={formData.insuredFamilyPhysicianIsDiscrepancyNoted}
                        onChange={(e) =>
                          handleChange('insuredFamilyPhysicianIsDiscrepancyNoted', e.target.value)
                        }
                        disabled={isDisabled}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>

                  {/* Discrepancy Findings (if yes) */}
                  {formData.insuredFamilyPhysicianIsDiscrepancyNoted === 'true' && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormLabel>Discrepancy Findings</FormLabel>
                      </Grid>
                      <Grid size={{ xs: 12, md: 8 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={5}
                          value={formData.insuredFamilyPhysicianDiscrepancyFindings}
                          onChange={(e) =>
                            handleChange('insuredFamilyPhysicianDiscrepancyFindings', e.target.value)
                          }
                          disabled={isDisabled}
                        />
                      </Grid>
                    </Grid>
                  )}
                </>
              )}

              {/* If Statement Not Collected */}
              {formData.insuredFamilyPhysicianIsStatementCollected === false && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormLabel>Reason</FormLabel>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      value={formData.insuredFamilyPhysicianNoStatementCollectedReason}
                      onChange={(e) =>
                        handleChange(
                          'insuredFamilyPhysicianNoStatementCollectedReason',
                          e.target.value
                        )
                      }
                      disabled={isDisabled}
                    />
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>Vicinity Check</Typography>
                  <Select
                    name="insuredFamilyPhysicianIsVicinityChecked"
                    value={formData.insuredFamilyPhysicianIsVicinityChecked}
                    fullWidth
                    disabled={isDisabled}
                    sx={{ mb: 2 }}
                    onChange={(e) =>
                      handleChange('insuredFamilyPhysicianIsVicinityChecked', e.target.value)
                    }
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="true">Done</MenuItem>
                    <MenuItem value="false">Not Done</MenuItem>
                  </Select>
                  {(formData.insuredFamilyPhysicianIsVicinityChecked === 'true') && (
                    <TextField
                      fullWidth
                      disabled={isDisabled}
                      multiline
                      rows={3}
                      label="Findings"
                      name="insuredFamilyPhysicianVicinityFindings"
                      value={formData.insuredFamilyPhysicianVicinityFindings}
                      onChange={(e) =>
                        handleChange('insuredFamilyPhysicianVicinityFindings', e.target.value)
                      }
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={4} sx={{ mt: 3 }}>
                {/* Alcohol History */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormLabel>Alcohol History</FormLabel>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <RadioGroup
                      row
                      value={
                        formData.insuredAlcoholHistory === null ? '' : String(formData.insuredAlcoholHistory)
                      }
                      onChange={(e) => handleAlcoholChange(e.target.value === 'true')}
                    >
                      <FormControlLabel value="true" control={<Radio disabled={isDisabled} />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio disabled={isDisabled} />} label="No" />
                    </RadioGroup>
                  </Grid>
                </Grid>

                {/* Alcohol Quantity (if yes) */}
                {showAlcohol && (
                  <Grid container spacing={2} sx={{ mb: 2, pl: { md: '33%' } }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        placeholder="Quantity"
                        value={formData.insuredAlcoholQuantity}
                        onChange={(e) => handleChange('insuredAlcoholQuantity', e.target.value)}
                        disabled={isDisabled}
                      />
                    </Grid>
                  </Grid>
                )}

                {/* Smoking History */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormLabel>Smoking History</FormLabel>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <RadioGroup
                      row
                      value={
                        formData.insuredSmokingHistory === null ? '' : String(formData.insuredSmokingHistory)
                      }
                      onChange={(e) => handleSmokingChange(e.target.value === 'true')}
                    >
                      <FormControlLabel value="true" control={<Radio disabled={isDisabled} />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio disabled={isDisabled} />} label="No" />
                    </RadioGroup>
                  </Grid>
                </Grid>

                {/* Smoking Quantity (if yes) */}
                {showSmoking && (
                  <Grid container spacing={2} sx={{ mb: 2, pl: { md: '33%' } }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        placeholder="Quantity"
                        value={formData.insuredSmokingQuantity}
                        onChange={(e) => handleChange('insuredSmokingQuantity', e.target.value)}
                        disabled={isDisabled}
                      />
                    </Grid>
                  </Grid>
                )}

                {/* Any Other Habit */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormLabel>Any other habit</FormLabel>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <RadioGroup
                      row
                      value={
                        formData.insuredAnyOtherHabits === null ? '' : String(formData.insuredAnyOtherHabits)
                      }
                      onChange={(e) => handleHabitsChange(e.target.value === 'true')}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                  </Grid>
                </Grid>

                {/* Other Habits Textarea (if yes) */}
                {showHabit && (
                  <Grid container spacing={2} sx={{ mb: 2, pl: { md: '33%' } }}>
                    <Grid size={{ xs: 12, md: 9 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        placeholder="Any Other Habits (if any)"
                        value={formData.insuredOtherHabits}
                        onChange={(e) => handleChange('insuredOtherHabits', e.target.value)}
                        disabled={isDisabled}
                      />
                    </Grid>
                  </Grid>
                )}

                {/* KYC Documents */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormLabel>KYC Documents</FormLabel>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <RadioGroup
                      row
                      value={formData.insuredKYCCollected === null ? '' : String(formData.insuredKYCCollected)}
                      onChange={(e) => handleChange('insuredKYCCollected', e.target.value === 'true')}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio disabled={isDisabled} />}
                        label="Collected"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio disabled={isDisabled} />}
                        label="Not Collected"
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>

                {/* KYC Discrepancies (if collected) */}
                {formData.insuredKYCCollected === true && (
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormLabel>Any Discrepancies</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        value={formData.insuredKYCDiscrepancies}
                        onChange={(e) => handleChange('insuredKYCDiscrepancies', e.target.value)}
                        disabled={isDisabled}
                      />
                    </Grid>
                  </Grid>
                )}

                {/* KYC Reason (if not collected) */}
                {formData.insuredKYCCollected === false && (
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormLabel>Reason</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        value={formData.insuredKYCReason}
                        onChange={(e) => handleChange('insuredKYCReason', e.target.value)}
                        disabled={isDisabled}
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                First Consulting/ Referral Doctor
              </Typography>

              {/* Name */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormLabel>Name</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    value={formData.insuredReferralDoctorName}
                    onChange={(e) => handleChange('insuredReferralDoctorName', e.target.value)}
                    disabled={isDisabled}
                  />
                </Grid>
              </Grid>

              {/* Contact Number */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormLabel>Contact Number</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    value={formData.insuredReferralDoctorContactNo}
                    onChange={(e) =>
                      handleChange('insuredReferralDoctorContactNo', e.target.value)
                    }
                    disabled={isDisabled}
                  />
                </Grid>
              </Grid>

              {/* Registration Number */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormLabel>Registration Number</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    value={formData.insuredReferralDoctorRegNo}
                    onChange={(e) => handleChange('insuredReferralDoctorRegNo', e.target.value)}
                    disabled={isDisabled}
                  />
                </Grid>
              </Grid>

              {/* Statement Collected */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormLabel>Statement collected</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <RadioGroup
                    row
                    value={
                      formData.insuredReferralDoctorIsStatementCollected === null
                        ? ''
                        : String(formData.insuredReferralDoctorIsStatementCollected)
                    }
                    onChange={(e) =>
                      handleChange(
                        'insuredReferralDoctorIsStatementCollected',
                        e.target.value === 'true'
                      )
                    }
                  >
                    <FormControlLabel value="true" control={<Radio disabled={isDisabled} />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio disabled={isDisabled} />} label="No" />
                  </RadioGroup>
                </Grid>
              </Grid>

              {/* If Statement Collected = Yes */}
              {formData.insuredReferralDoctorIsStatementCollected === true && (
                <>
                  {/* Any PED noted */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormLabel>Any PED noted?</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Select
                        fullWidth
                        value={formData.insuredReferralDoctorPEDNoted}
                        onChange={(e) =>
                          handleChange('insuredReferralDoctorPEDNoted', e.target.value)
                        }
                        disabled={isDisabled}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>

                  {formData.insuredReferralDoctorPEDNoted === 'true' && (
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="PED Findings"
                      value={formData.insuredReferralDoctorPEDFindings}
                      onChange={(e) => handleChange('insuredReferralDoctorPEDFindings', e.target.value)}
                      disabled={!buttonEnable}
                      sx={{ mb: 2 }}
                    />
                  )}

                  {/* Any Discrepancy noted */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormLabel>Any Discrepancy noted?</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Select
                        fullWidth
                        value={formData.insuredReferralDoctorIsDiscrepancyNoted}
                        onChange={(e) =>
                          handleChange('insuredReferralDoctorIsDiscrepancyNoted', e.target.value)
                        }
                        disabled={isDisabled}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>

                  {/* Discrepancy Findings (if yes) */}
                  {formData.insuredReferralDoctorIsDiscrepancyNoted === 'true' && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormLabel>Discrepancy Findings</FormLabel>
                      </Grid>
                      <Grid size={{ xs: 12, md: 8 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={5}
                          value={formData.insuredReferralDoctorDiscrepancyFindings}
                          onChange={(e) =>
                            handleChange('insuredReferralDoctorDiscrepancyFindings', e.target.value)
                          }
                          disabled={isDisabled}
                        />
                      </Grid>
                    </Grid>
                  )}
                </>
              )}

              {/* If Statement Not Collected */}
              {formData.insuredReferralDoctorIsStatementCollected === false && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormLabel>Reason</FormLabel>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      value={formData.insuredReferralDoctorNoStatementCollectedReason}
                      onChange={(e) =>
                        handleChange(
                          'insuredReferralDoctorNoStatementCollectedReason',
                          e.target.value
                        )
                      }
                      disabled={isDisabled}
                    />
                  </Grid>
                </Grid>
              )}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormLabel>Any other findings related to Insured</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    value={formData.insuredAnyOtherInvestigationFindings}
                    onChange={(e) =>
                      handleChange(
                        'insuredAnyOtherInvestigationFindings',
                        e.target.value
                      )
                    }
                    disabled={isDisabled}
                  />
                </Grid>
              </Grid>

            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {buttonEnable && tabCheck.insuredPersonVisit && (
              <>
                {/* Save as Draft - Always show when insuredPersonVisit is true */}
                <Button
                  onClick={saveInsured}
                  disabled={loading}
                  variant="contained"
                >
                  {loading ? <CircularProgress size={24} /> : 'Save as Draft'}
                </Button>

                {/* Submit To QC 1 - Only when just insured visit */}
                {!tabCheck.employeerVisit && !tabCheck.hospitalVisit && (
                  <Button variant="contained" onClick={saveInsured} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Submit To QC 1'}
                  </Button>
                )}

                {/* Submit To QC 2 - Only when insured + hospital visits */}
                {!tabCheck.employeerVisit && tabCheck.hospitalVisit && (
                  <Button variant="contained" onClick={saveInsured} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Submit To QC 2'}
                  </Button>
                )}
              </>
            )}
          </Box>

        </CardContent>
      </Card>
    </Box >
  );
};

export default InsuredVerification;