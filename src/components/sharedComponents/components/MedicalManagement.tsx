// src/components/MedicalManagement/MedicalManagement.tsx

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

interface MedicalManagementProps {
  formDataMedicalManagement?: any;
  handleChangeMedicalManagement?: (field:any, data: any) => void;
}


const MedicalManagement: React.FC<MedicalManagementProps> = ({
  formDataMedicalManagement,
  handleChangeMedicalManagement,
}) => {

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Is active line of Treatment Given? */}
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <FormLabel>Is active line of Treatment Given?</FormLabel>
            <Select
              value={formDataMedicalManagement.isActiveMedicalManagementLOTGiven}
              onChange={(e:any) =>
                handleChangeMedicalManagement?.('isActiveMedicalManagementLOTGiven', e.target.value)
              }
              displayEmpty
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* If Active = No → Is Hospitalization for evaluation? */}
        {formDataMedicalManagement.isActiveMedicalManagementLOTGiven === 'no' && (
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel>Is Hospitalization only for evaluation purpose?</FormLabel>
              <Select
                value={formDataMedicalManagement.medicalManagementIsHospitalization}
                onChange={(e:any) =>
                  handleChangeMedicalManagement?.('medicalManagementIsHospitalization', e.target.value)
                }
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
        {formDataMedicalManagement.isActiveMedicalManagementLOTGiven === 'yes' && (
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Justification"
              value={formDataMedicalManagement.medicalManagementJustification}
              onChange={(e:any) =>
                handleChangeMedicalManagement?.('medicalManagementJustification', e.target.value)
              }
            />
          </Grid>
        )}

        {/* If Active = No AND Hospitalization = Yes → Findings */}
        {formDataMedicalManagement.isActiveMedicalManagementLOTGiven === 'no' &&
          formDataMedicalManagement.medicalManagementIsHospitalization === 'yes' && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Findings"
                value={formDataMedicalManagement.medicalManagementFindings}
                onChange={(e:any) => handleChangeMedicalManagement?.('medicalManagementFindings', e.target.value)}
              />
            </Grid>
          )}

        {/* If Active = No AND Hospitalization = No → Observations */}
        {formDataMedicalManagement.isActiveMedicalManagementLOTGiven === 'no' &&
          formDataMedicalManagement.medicalManagementIsHospitalization === 'no' && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Observations"
                value={formDataMedicalManagement.medicalManagementObsevations}
                onChange={(e:any) =>
                  handleChangeMedicalManagement?.('medicalManagementObsevations', e.target.value)
                }
              />
            </Grid>
          )}
      </Grid>
    </Box>
  );
};

export default MedicalManagement;