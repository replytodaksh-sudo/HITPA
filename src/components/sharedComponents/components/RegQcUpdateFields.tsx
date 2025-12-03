// ===========================
// REG QC UPDATE FIELDS - COMPLETE COMPONENT
// ===========================

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Paper,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// ===========================
// INTERFACES
// ===========================
interface RegQcUpdateFieldsProps {
  previewValues?: any;
  previewRefresh?: boolean;
  getDataFrom?: string;
}

interface QcField {
  label: string;
  yesValue: boolean;
  details: string;
  showDetailsWhen: 'yes' | 'no'; // Show details when answer is Yes or No
}

// ===========================
// MAIN COMPONENT
// ===========================
const RegQcUpdateFields: React.FC<RegQcUpdateFieldsProps> = ({
  previewValues,
  previewRefresh,
  getDataFrom
}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const claimsType = searchParams.get('claimsType');

  // ===========================
  // RENDER HELPER - YES/NO INDICATOR
  // ===========================
  const renderYesNo = (value: boolean) => {
    if (value) {
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Yes"
          color="success"
          size="small"
          sx={{ fontWeight: 600 }}
        />
      );
    }
    return (
      <Chip
        icon={<CancelIcon />}
        label="No"
        color="error"
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  // ===========================
  // RENDER HELPER - QC FIELD ROW
  // ===========================
  const renderQcField = (field: QcField) => {
    const shouldShowDetails = 
      (field.showDetailsWhen === 'yes' && field.yesValue) ||
      (field.showDetailsWhen === 'no' && !field.yesValue);

    return (
      <Grid size={{ xs: 12, md: 6 }} key={field.label}>
        {/* Label and Yes/No */}
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid size={{ xs: 8 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {field.label}
            </Typography>
          </Grid>
          <Grid size={{ xs: 4 }}>
            {renderYesNo(field.yesValue)}
          </Grid>
        </Grid>

        {/* Details Textarea (conditional) */}
        {shouldShowDetails && field.details && (
          <Box sx={{ mb: 2, pr: { md: 2 } }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={field.details}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  bgcolor: '#f5f5f5',
                },
              }}
            />
          </Box>
        )}
      </Grid>
    );
  };

  // ===========================
  // QC FIELDS CONFIGURATION
  // ===========================
  const qcFields: QcField[] = [
    // Row 1
    {
      label: 'Any bill inflation Noted (Discount/ LOS / Procedure charges etc.)',
      yesValue: previewValues?.billInflation,
      details: previewValues?.billInflationDetails,
      showDetailsWhen: 'yes',
    },
    {
      label: '24 Hours stay confirmed?',
      yesValue: previewValues?.stayConfirmed,
      details: previewValues?.stayConfirmedDetails,
      showDetailsWhen: 'no',
    },
    // Row 2
    {
      label: 'Any PED noted?',
      yesValue: previewValues?.anyPED,
      details: previewValues?.pedWaitingPeriodDetails,
      showDetailsWhen: 'yes',
    },
    {
      label: 'Any Permanent exclusions?',
      yesValue: previewValues?.permanentExclusions,
      details: previewValues?.anyPermanentExclusionDetails,
      showDetailsWhen: 'yes',
    },
    // Row 3
    {
      label: 'Treating doctor qualification- Allopathy?',
      yesValue: previewValues?.qualificationAllopathy,
      details: previewValues?.qualificationAllopathyDetails,
      showDetailsWhen: 'no',
    },
    {
      label: 'Any discrepancies Observed',
      yesValue: previewValues?.discrepanciesObserved,
      details: previewValues?.discrepanciesObservedDetails,
      showDetailsWhen: 'yes',
    },
    // Row 4
    {
      label: 'Is Hospitalization Justified ?',
      yesValue: previewValues?.hospitalization,
      details: previewValues?.hospitalizationJustifiedDetails,
      showDetailsWhen: 'no',
    },
    {
      label: 'Hospital criteria fulfilled?',
      yesValue: previewValues?.hospitalCriteriaFulfilled,
      details: previewValues?.hospitalCriteriaFulfilledDetails,
      showDetailsWhen: 'no',
    },
    // Row 5
    {
      label: 'Any first year exclusions?',
      yesValue: previewValues?.twoYearExclusions,
      details: previewValues?.firstTwoYearExclusionsDetails,
      showDetailsWhen: 'yes',
    },
    {
      label: 'A 30 days waiting period',
      yesValue: previewValues?.waitingPeriod,
      details: previewValues?.waitingPeriod30DaysDetails,
      showDetailsWhen: 'yes',
    },
    // Row 6
    {
      label: 'Age & ID proof cross checked?',
      yesValue: previewValues?.ageCrossCheck,
      details: previewValues?.ageCrossCheckDetails,
      showDetailsWhen: 'no',
    },
  ];

  // Cashless-only field
  const convertedFullcaseField: QcField = {
    label: 'Is this converted to full case?',
    yesValue: previewValues?.isConvertedFullcase,
    details: previewValues?.convertedFullcaseDetails,
    showDetailsWhen: 'yes',
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, color: '#776BC5', fontWeight: 700 }}>
        QC Update Details
      </Typography>

      <Grid container spacing={2}>
        {/* Render all QC fields */}
        {qcFields.map((field) => renderQcField(field))}

        {/* Cashless-only field */}
        {claimsType === 'cashless' && renderQcField(convertedFullcaseField)}
      </Grid>
    </Paper>
  );
};

export default RegQcUpdateFields;