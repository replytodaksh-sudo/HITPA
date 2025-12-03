// src/components/RtaMedicalManagement/RtaMedicalManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
} from '@mui/material';

interface RtaMedicalManagementProps {
  previousData?: any;
  onDataChange: (data: RtaMedicalManagementData) => void;
}

export interface RtaMedicalManagementData {
  rtaMedicalIsActive: string;
  rtaMedicalIsHospitalization: string;
  rtaMedicalObsevations: string;
  rtaMedicalJustification: string;
  rtaMedicalFindings: string;
}

const RtaMedicalManagement: React.FC<RtaMedicalManagementProps> = ({
  previousData,
  onDataChange,
}) => {
  const [formData, setFormData] = useState<RtaMedicalManagementData>({
    rtaMedicalIsActive: '',
    rtaMedicalIsHospitalization: '',
    rtaMedicalObsevations: '',
    rtaMedicalJustification: '',
    rtaMedicalFindings: '',
  });

  // Load previous data on mount
  useEffect(() => {
    if (previousData) {
      setFormData({
        rtaMedicalIsActive: previousData.rtaMedicalIsActive || '',
        rtaMedicalIsHospitalization: previousData.rtaMedicalIsHospitalization || '',
        rtaMedicalObsevations: previousData.rtaMedicalObsevations || '',
        rtaMedicalJustification: previousData.rtaMedicalJustification || '',
        rtaMedicalFindings: previousData.rtaMedicalFindings || '',
      });
    }
  }, [previousData]);

  // Send data to parent on every change
  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleChange = (field: keyof RtaMedicalManagementData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Is active line of Treatment Given? */}
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <FormLabel>Is active line of Treatment Given?</FormLabel>
            <Select
              value={formData.rtaMedicalIsActive}
              onChange={(e) => handleChange('rtaMedicalIsActive', e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* If Active = No → Is Hospitalization for evaluation? */}
        {formData.rtaMedicalIsActive === 'no' && (
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>Is Hospitalization only for evaluation purpose?</FormLabel>
              <Select
                value={formData.rtaMedicalIsHospitalization}
                onChange={(e) => handleChange('rtaMedicalIsHospitalization', e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* If Active = Yes → Justification */}
        {formData.rtaMedicalIsActive === 'yes' && (
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Justification"
              value={formData.rtaMedicalJustification}
              onChange={(e) => handleChange('rtaMedicalJustification', e.target.value)}
            />
          </Grid>
        )}

        {/* If Active = No AND Hospitalization = Yes → Findings */}
        {formData.rtaMedicalIsActive === 'no' &&
          formData.rtaMedicalIsHospitalization === 'yes' && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Findings"
                value={formData.rtaMedicalFindings}
                onChange={(e) => handleChange('rtaMedicalFindings', e.target.value)}
              />
            </Grid>
          )}

        {/* If Active = No AND Hospitalization = No → Observations */}
        {formData.rtaMedicalIsActive === 'no' &&
          formData.rtaMedicalIsHospitalization === 'no' && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Observations"
                value={formData.rtaMedicalObsevations}
                onChange={(e) => handleChange('rtaMedicalObsevations', e.target.value)}
              />
            </Grid>
          )}
      </Grid>
    </Box>
  );
};

export default RtaMedicalManagement;