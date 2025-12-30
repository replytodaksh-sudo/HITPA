import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  TextField,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { caseUpdateService } from '../../../services/caseupdate.service';
import NfinStep1 from './NfinStep1';
import NfinStep2 from './NfinStep2';

interface NotFoundInHospitalProps {
  previousData?: any;
  onNextPage?: (step: number) => void;
}

interface FormData {
  patientReferredAnotherCenter: boolean | null;
  anotherCenterType: string;
  anotherHospitalName: string;
  anotherVerificationDone: boolean | null;
  anotherObservations: string;
  ipdnotingsFound: string;
  iPDNotingsFoundObservations: string;
  ipdnotingsFoundClarification: boolean | null;
  iPDNotingsFoundClarificationObservations: string;
  iPDNotingsFoundClarificationJustification: string;
}

const NotFoundInHospital: React.FC<NotFoundInHospitalProps> = ({
  previousData,
  onNextPage,
}) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [activeTab, setActiveTab] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    patientReferredAnotherCenter: null,
    anotherCenterType: '',
    anotherHospitalName: '',
    anotherVerificationDone: null,
    anotherObservations: '',
    ipdnotingsFound: '',
    iPDNotingsFoundObservations: '',
    ipdnotingsFoundClarification: null,
    iPDNotingsFoundClarificationObservations: '',
    iPDNotingsFoundClarificationJustification: '',
  });

  const [stepOneData, setStepOneData] = useState<any>(null);
  const [stepTwoData, setStepTwoData] = useState<any>(null);

  // Load previous data
  useEffect(() => {
    if (previousData) {
      setFormData({
        patientReferredAnotherCenter: previousData.patientReferredAnotherCenter ?? null,
        anotherCenterType: previousData.anotherCenterType || '',
        anotherHospitalName: previousData.anotherHospitalName || '',
        anotherVerificationDone: previousData.anotherVerificationDone ?? null,
        anotherObservations: previousData.anotherObservations || '',
        ipdnotingsFound: previousData.ipdnotingsFound || '',
        iPDNotingsFoundObservations: previousData.iPDNotingsFoundObservations || '',
        ipdnotingsFoundClarification: previousData.ipdnotingsFoundClarification ?? null,
        iPDNotingsFoundClarificationObservations:
          previousData.iPDNotingsFoundClarificationObservations || '',
        iPDNotingsFoundClarificationJustification:
          previousData.iPDNotingsFoundClarificationJustification || '',
      });
    }
  }, [previousData]);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStepOneDataChange = (data: any) => {
    setStepOneData(data);
  };

  const handleStepTwoDataChange = (data: any) => {
    setStepTwoData(data);
  };

  const saveAsDraft = async () => {
    try {
      const invId = investigationId?.split(' ')[0];

      const caseUpdateModel = {
        ...formData,
        ...stepOneData,
        ...stepTwoData,
        // Format dates if they exist in stepOneData
        ...(stepOneData?.rtaDateOfFIR && {
          rtaDateOfFIR: new Date(stepOneData.rtaDateOfFIR).toISOString(),
        }),
        ...(stepOneData?.rtaDateOfMLC && {
          rtaDateOfMLC: new Date(stepOneData.rtaDateOfMLC).toISOString(),
        }),
        reason: 'notfoundhosp',
        boolStatusOfInsured: false,
      };

      const response = await caseUpdateService.addCaseUpdate(caseUpdateModel, invId!);
      
      if (response.payload?.activeCaseID) {
        localStorage.setItem('activeCaseID', response.payload.activeCaseID);
      }

      alert('Primary data saved successfully');
      
      if (onNextPage) {
        onNextPage(1);
      }
    } catch (error) {
      console.error('Error saving case update:', error);
      alert('Failed to save case update');
    }
  };

  return (
    <Box component="section" sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Question 1: Is patient referred to another centre? */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <FormLabel component="legend">
              Is patient referred to another centre?
            </FormLabel>
          </Grid>
          <Grid size={{ xs: 12, sm: 9 }}>
            <RadioGroup
              row
              value={
                formData.patientReferredAnotherCenter === null
                  ? ''
                  : formData.patientReferredAnotherCenter
                  ? 'true'
                  : 'false'
              }
              onChange={(e) =>
                handleChange('patientReferredAnotherCenter', e.target.value === 'true')
              }
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </Grid>
        </Grid>

        {/* If YES - Show referral details */}
        {formData.patientReferredAnotherCenter === true && (
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Select
                  value={formData.anotherCenterType}
                  onChange={(e) => handleChange('anotherCenterType', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Select referred to</MenuItem>
                  <MenuItem value="hospital">Another Hospital</MenuItem>
                  <MenuItem value="xray">X-Ray</MenuItem>
                  <MenuItem value="sonography">Sonography</MenuItem>
                  <MenuItem value="pathology">Pathology Lab</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
              </FormControl>

              {formData.anotherCenterType && (
                <Box>
                  <TextField
                    fullWidth
                    label={
                      formData.anotherCenterType === 'hospital'
                        ? 'Name of the Hospital'
                        : 'Name of the Center'
                    }
                    value={formData.anotherHospitalName}
                    onChange={(e) => handleChange('anotherHospitalName', e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel>Verification done</FormLabel>
                    <RadioGroup
                      row
                      value={
                        formData.anotherVerificationDone === null
                          ? ''
                          : formData.anotherVerificationDone
                          ? 'true'
                          : 'false'
                      }
                      onChange={(e) =>
                        handleChange('anotherVerificationDone', e.target.value === 'true')
                      }
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>

                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    label="Observations"
                    value={formData.anotherObservations}
                    onChange={(e) => handleChange('anotherObservations', e.target.value)}
                  />
                </Box>
              )}
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>IPDs Notings found</FormLabel>
                <Select
                  value={formData.ipdnotingsFound}
                  onChange={(e) => handleChange('ipdnotingsFound', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>

              {/* If IPD Notings Found = Yes */}
              {formData.ipdnotingsFound === 'true' && (
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Observations"
                  value={formData.iPDNotingsFoundObservations}
                  onChange={(e) =>
                    handleChange('iPDNotingsFoundObservations', e.target.value)
                  }
                />
              )}

              {/* If IPD Notings Found = No */}
              {formData.ipdnotingsFound === 'false' && (
                <Box>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel>Clarification taken from the Hospital?</FormLabel>
                    <RadioGroup
                      row
                      value={
                        formData.ipdnotingsFoundClarification === null
                          ? ''
                          : formData.ipdnotingsFoundClarification
                          ? 'true'
                          : 'false'
                      }
                      onChange={(e) =>
                        handleChange(
                          'ipdnotingsFoundClarification',
                          e.target.value === 'true'
                        )
                      }
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>

                  {/* If Clarification = Yes */}
                  {formData.ipdnotingsFoundClarification === true && (
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="Observations"
                      value={formData.iPDNotingsFoundClarificationObservations}
                      onChange={(e) =>
                        handleChange(
                          'iPDNotingsFoundClarificationObservations',
                          e.target.value
                        )
                      }
                    />
                  )}

                  {/* If Clarification = No */}
                  {formData.ipdnotingsFoundClarification === false && (
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="Justification"
                      value={formData.iPDNotingsFoundClarificationJustification}
                      onChange={(e) =>
                        handleChange(
                          'iPDNotingsFoundClarificationJustification',
                          e.target.value
                        )
                      }
                    />
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        )}

        {/* If NO - Show Step 1 and Step 2 tabs */}
        {formData.patientReferredAnotherCenter === false && (
          <Box sx={{ mt: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                mb: 2,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minWidth: 100,
                },
              }}
            >
              <Tab label="Step 1" />
              <Tab label="Step 2" />
            </Tabs>

            <Box sx={{ mt: 2 }}>
              {activeTab === 0 && (
                <NfinStep1
                  previousData={previousData}
                  onStepOneDataChange={handleStepOneDataChange}
                />
              )}
              {activeTab === 1 && (
                <NfinStep2
                  previousData={previousData}
                  onStepTwoDataChange={handleStepTwoDataChange}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Save Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={saveAsDraft}
            sx={{
              background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
              color: 'white',
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
              },
            }}
          >
            Save as Draft
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFoundInHospital;