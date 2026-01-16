import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { Save, Send } from '@mui/icons-material';
import { reimcaseUpdateService } from '../../../services/reim-case-update.service';
import { notificationService } from '../../../utils/notification.service';
import { message } from '../../../constants/messages';

interface EmployerVerificationProps {
  buttonEnable?: boolean;
  previousData?: any;
}

const EmployerVerification: React.FC<EmployerVerificationProps> = ({
  buttonEnable = true,
  previousData,
}) => {
  const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [investigationId, setInvestigationId] = useState('');
  const [loading, setLoading] = useState(false);

  const acceptAssignId = searchParams.get('acceptAssignId') || '';
  const redirectTo = searchParams.get('redirectTo');

  // Form State
  const [formData, setFormData] = useState({
    acceptAssignId: '',
    activeReCaseID: localStorage.getItem('activeReCaseID') || '',
    employerVerificationDone: '',
    employerAttendanceRecordCollected: '',
    employerObservations: '',
    employerRemarks: '',
    employerReason: '',
    employerAttendanceRemark: '',
    btnAction: '',
  });

  useEffect(() => {
    if (paramInvestigationId) {
      const cleanId = paramInvestigationId.split(' ')[0];
      setInvestigationId(cleanId);
    }
  }, [paramInvestigationId]);

  useEffect(() => {
    if (previousData) {
      setFormData({
        ...formData,
        activeReCaseID: previousData.activeReCaseID || localStorage.getItem('activeReCaseID') || '',
        employerVerificationDone: convertBoolToString(previousData.employerVerificationDone),
        employerAttendanceRecordCollected: convertBoolToString(previousData.employerAttendanceRecordCollected),
        employerObservations: previousData.employerObservations || '',
        employerRemarks: previousData.employerRemarks || '',
        employerReason: previousData.employerReason || '',
        employerAttendanceRemark: previousData.employerAttendanceRemark || '',
      });
    }
  }, [previousData]);

  const convertToBoolean = (status: string): boolean | undefined => {
    if (status === 'yes') return true;
    else if (status === 'no') return false;
    return undefined;
  };

  const convertBoolToString = (val: boolean | undefined | null): string => {
    if (val === true) return 'yes';
    else if (val === false) return 'no';
    return '';
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        ...formData,
        acceptAssignId: acceptAssignId,
        activeReCaseID: localStorage.getItem('activeReCaseID') || '',
        btnAction: 'saveasdraft',
        employerVerificationDone: convertToBoolean(formData.employerVerificationDone),
        employerAttendanceRecordCollected: convertToBoolean(formData.employerAttendanceRecordCollected),
      };

      console.log('Employer Verification Payload:', payload);

      const response = await reimcaseUpdateService.addEmployeerVerify(payload, investigationId);

      if (response.statusCode === 0) {
        notificationService.showAlertSuccess(message.employeerVerifyAddSuccess);
      } else {
        notificationService.showAlertSuccess(response.message || 'Operation completed');
      }
    } catch (error) {
      console.error('Error saving employer verification:', error);
      notificationService.showAlertError('Failed to save employer verification');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        ...formData,
        acceptAssignId: acceptAssignId,
        activeReCaseID: localStorage.getItem('activeReCaseID') || '',
        btnAction: 'submittoqc',
        employerVerificationDone: convertToBoolean(formData.employerVerificationDone),
        employerAttendanceRecordCollected: convertToBoolean(formData.employerAttendanceRecordCollected),
      };

      console.log('Final Employer Verification Payload:', payload);

      const response = await reimcaseUpdateService.addEmployeerVerify(payload, investigationId);

      if (response.statusCode === 0) {
        notificationService.showAlertSuccess(message.finalSubmitDone);

        if (redirectTo) {
          navigate(redirectTo.replace('/investigation', ''));
        } else {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Error submitting employer verification:', error);
      notificationService.showAlertError('Failed to submit employer verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Employer/ School / College / Other
          </Typography>

          <Grid container spacing={3}>
            {/* Verification Done */}
            <Grid size={{ xs: 12 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel
                  component="legend"
                  sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
                >
                  Verification Done
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.employerVerificationDone}
                  onChange={(e) => handleChange('employerVerificationDone', e.target.value)}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                    disabled={!buttonEnable}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="No"
                    disabled={!buttonEnable}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Attendance Record Collected - Show only if Verification Done is Yes */}
            {formData.employerVerificationDone === 'yes' && (
              <Grid size={{ xs: 12 }}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel
                    component="legend"
                    sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
                  >
                    Attendance Record Collected?
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formData.employerAttendanceRecordCollected}
                    onChange={(e) =>
                      handleChange('employerAttendanceRecordCollected', e.target.value)
                    }
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                      disabled={!buttonEnable}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                      disabled={!buttonEnable}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            )}

            {/* Observations - Show only if both are Yes */}
            {formData.employerVerificationDone === 'yes' &&
              formData.employerAttendanceRecordCollected === 'yes' && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <FormLabel
                        sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
                      >
                        Observations
                      </FormLabel>
                      <Select
                        value={formData.employerObservations}
                        onChange={(e) =>
                          handleChange('employerObservations', e.target.value)
                        }
                        disabled={!buttonEnable}
                        displayEmpty
                      >
                        <MenuItem value="">-- Select Option --</MenuItem>
                        <MenuItem value="patientWasPresent">
                          Patient was present
                        </MenuItem>
                        <MenuItem value="absentPeriodHospitalization">
                          Absent for the period of hospitalization
                        </MenuItem>
                        <MenuItem value="patientNotEmployee">
                          Patient is not the Employee
                        </MenuItem>
                        <MenuItem value="anyOther">Any Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <FormLabel
                        sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
                      >
                        Remarks
                      </FormLabel>
                      <TextField
                        multiline
                        rows={4}
                        value={formData.employerRemarks}
                        onChange={(e) =>
                          handleChange('employerRemarks', e.target.value)
                        }
                        disabled={!buttonEnable}
                        InputProps={{
                          readOnly: !buttonEnable,
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}

            {/* Reason - Show if Verification Done is No OR Attendance Record is No */}
            {(formData.employerVerificationDone === 'no' ||
              formData.employerAttendanceRecordCollected === 'no') && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <FormLabel
                      sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
                    >
                      Reason
                    </FormLabel>
                    <TextField
                      multiline
                      rows={4}
                      value={formData.employerReason}
                      onChange={(e) => handleChange('employerReason', e.target.value)}
                      disabled={!buttonEnable}
                      InputProps={{
                        readOnly: !buttonEnable,
                      }}
                    />
                  </FormControl>
                </Grid>
              )}

            {/* Action Buttons */}
            {buttonEnable && (
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Save />}
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      },
                    }}
                  >
                    Save as draft
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    sx={{
                      background:
                        'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #764BA2 0%, #667EEA 100%)',
                      },
                    }}
                  >
                    Submit to QC
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployerVerification;