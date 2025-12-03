// src/components/CaseUpdate/RTASurgeryManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';

interface RTASurgeryManagementProps {
  previousData?: any;
  onDataChange?: (field: string, value: any) => void;
}

const RTASurgeryManagement: React.FC<RTASurgeryManagementProps> = ({
  previousData,
  onDataChange,
}) => {
  // State variables
  const [operativeNoteValue, setOperativeNoteValue] = useState('');
  const [anaesthesiaNotesValue, setAnaesthesiaNotesValue] = useState('');
  const [implantUsedValue, setImplantUsedValue] = useState('');
  const [invoiceVerifiedValue, setInvoiceVerifiedValue] = useState('');
  
  const [rtaSurgicalProcedureCarriedOut, setRtaSurgicalProcedureCarriedOut] = useState('');
  const [rtaSurgicalOperativeFindings, setRtaSurgicalOperativeFindings] = useState('');
  const [rtaSurgicalOperativeReason, setRtaSurgicalOperativeReason] = useState('');
  const [rtaSurgicalAnaesthesiaFindings, setRtaSurgicalAnaesthesiaFindings] = useState('');
  const [rtaSurgicalAnaesthesiaReason, setRtaSurgicalAnaesthesiaReason] = useState('');
  const [surgicalManagementInvoiceVerifiedStickerNumber, setSurgicalManagementInvoiceVerifiedStickerNumber] = useState('');
  const [surgicalManagementInvoiceVerifiedManufacturer, setSurgicalManagementInvoiceVerifiedManufacturer] = useState('');
  const [surgicalManagementInvoiceVerifiedFinding, setSurgicalManagementInvoiceVerifiedFinding] = useState('');

  // Populate data from previousData
  useEffect(() => {
    if (previousData) {
      populateData();
    }
  }, [previousData]);

  const populateData = () => {
    if (!previousData) return;

    setOperativeNoteValue(previousData.rtaSurgicalOperative || '');
    setAnaesthesiaNotesValue(previousData.rtaSurgicalAnaesthesia || '');
    setImplantUsedValue(previousData.rtaSurgicalAnyImplantUsed || '');
    setInvoiceVerifiedValue(previousData.rtaSurgicalInvoiceVerified || '');
    
    setRtaSurgicalProcedureCarriedOut(previousData.rtaSurgicalProcedureCarriedOut || '');
    setRtaSurgicalOperativeFindings(previousData.rtaSurgicalOperativeFindings || '');
    setRtaSurgicalOperativeReason(previousData.rtaSurgicalOperativeReason || '');
    setRtaSurgicalAnaesthesiaFindings(previousData.rtaSurgicalAnaesthesiaFindings || '');
    setRtaSurgicalAnaesthesiaReason(previousData.rtaSurgicalAnaesthesiaReason || '');
    setSurgicalManagementInvoiceVerifiedStickerNumber(previousData.surgicalManagementInvoiceVerifiedStickerNumber || '');
    setSurgicalManagementInvoiceVerifiedManufacturer(previousData.surgicalManagementInvoiceVerifiedManufacturer || '');
    setSurgicalManagementInvoiceVerifiedFinding(previousData.surgicalManagementInvoiceVerifiedFinding || '');
  };

  // Handler to update parent/service with data changes
  const updateData = (field: string, value: any) => {
    if (onDataChange) {
      onDataChange(field, value);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '16px', fontWeight: 600 }}>
        RTA Surgical Management
      </Typography>

      {/* Procedure carried Out */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid size={{ xs: 4 }}>
          <Typography variant="body2">Procedure carried Out</Typography>
        </Grid>
        <Grid size={{ xs: 8 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Procedure carried out"
            value={rtaSurgicalProcedureCarriedOut}
            onChange={(e) => setRtaSurgicalProcedureCarriedOut(e.target.value)}
            onBlur={() => updateData('rtaSurgicalProcedureCarriedOut', rtaSurgicalProcedureCarriedOut)}
          />
        </Grid>
      </Grid>

      {/* Operative Notes */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid size={{ xs: 4 }}>
          <Typography variant="body2">Operative Notes?</Typography>
        </Grid>
        <Grid size={{ xs: 8 }}>
          <RadioGroup
            row
            value={operativeNoteValue}
            onChange={(e) => {
              setOperativeNoteValue(e.target.value);
              updateData('rtaSurgicalOperative', e.target.value);
            }}
          >
            <FormControlLabel value="Provided" control={<Radio />} label="Provided" />
            <FormControlLabel value="Not Provided" control={<Radio />} label="Not Provided" />
          </RadioGroup>
        </Grid>
      </Grid>

      {/* Operative Notes - Findings (if Provided) */}
      {operativeNoteValue === 'Provided' && (
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid size={{ xs: 4 }}>
            <Typography variant="body2">Findings</Typography>
          </Grid>
          <Grid size={{ xs: 8 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              value={rtaSurgicalOperativeFindings}
              onChange={(e) => setRtaSurgicalOperativeFindings(e.target.value)}
              onBlur={() => updateData('rtaSurgicalOperativeFindings', rtaSurgicalOperativeFindings)}
            />
          </Grid>
        </Grid>
      )}

      {/* Operative Notes - Reason (if Not Provided) */}
      {operativeNoteValue === 'Not Provided' && (
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid size={{ xs: 4 }}>
            <Typography variant="body2">Reason</Typography>
          </Grid>
          <Grid size={{ xs: 8 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              value={rtaSurgicalOperativeReason}
              onChange={(e) => setRtaSurgicalOperativeReason(e.target.value)}
              onBlur={() => updateData('rtaSurgicalOperativeReason', rtaSurgicalOperativeReason)}
            />
          </Grid>
        </Grid>
      )}

      {/* Anaesthesia Notes */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid size={{ xs: 4 }}>
          <Typography variant="body2">Anaesthesia Notes?</Typography>
        </Grid>
        <Grid size={{ xs: 8 }}>
          <RadioGroup
            row
            value={anaesthesiaNotesValue}
            onChange={(e) => {
              setAnaesthesiaNotesValue(e.target.value);
              updateData('rtaSurgicalAnaesthesia', e.target.value);
            }}
          >
            <FormControlLabel value="Provided" control={<Radio />} label="Provided" />
            <FormControlLabel value="Not Provided" control={<Radio />} label="Not Provided" />
          </RadioGroup>
        </Grid>
      </Grid>

      {/* Anaesthesia Notes - Findings (if Provided) */}
      {anaesthesiaNotesValue === 'Provided' && (
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid size={{ xs: 4 }}>
            <Typography variant="body2">Findings</Typography>
          </Grid>
          <Grid size={{ xs: 8 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              value={rtaSurgicalAnaesthesiaFindings}
              onChange={(e) => setRtaSurgicalAnaesthesiaFindings(e.target.value)}
              onBlur={() => updateData('rtaSurgicalAnaesthesiaFindings', rtaSurgicalAnaesthesiaFindings)}
            />
          </Grid>
        </Grid>
      )}

      {/* Anaesthesia Notes - Reason (if Not Provided) */}
      {anaesthesiaNotesValue === 'Not Provided' && (
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid size={{ xs: 4 }}>
            <Typography variant="body2">Reason</Typography>
          </Grid>
          <Grid size={{ xs: 8 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              value={rtaSurgicalAnaesthesiaReason}
              onChange={(e) => setRtaSurgicalAnaesthesiaReason(e.target.value)}
              onBlur={() => updateData('rtaSurgicalAnaesthesiaReason', rtaSurgicalAnaesthesiaReason)}
            />
          </Grid>
        </Grid>
      )}

      {/* Any Implant Used? */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid size={{ xs: 4 }}>
          <Typography variant="body2">Any Implant Used?</Typography>
        </Grid>
        <Grid size={{ xs: 8 }}>
          <RadioGroup
            row
            value={implantUsedValue}
            onChange={(e) => {
              setImplantUsedValue(e.target.value);
              updateData('rtaSurgicalAnyImplantUsed', e.target.value);
            }}
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>
      </Grid>

      {/* If Implant Used = Yes */}
      {implantUsedValue === 'Yes' && (
        <>
          {/* Invoice verified */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid size={{ xs: 4 }}>
              <Typography variant="body2">Invoice verified</Typography>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <RadioGroup
                row
                value={invoiceVerifiedValue}
                onChange={(e) => {
                  setInvoiceVerifiedValue(e.target.value);
                  updateData('rtaSurgicalInvoiceVerified', e.target.value);
                }}
              >
                <FormControlLabel value="Genuine" control={<Radio />} label="Genuine" />
                <FormControlLabel value="Discrepancy" control={<Radio />} label="Discrepancy" />
                <FormControlLabel value="Not Verified" control={<Radio />} label="Not Verified" />
              </RadioGroup>
            </Grid>
          </Grid>

          {/* If Invoice Verified = Genuine */}
          {invoiceVerifiedValue === 'Genuine' && (
            <>
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="body2">Invoice / Sticker Number</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Invoice / Sticker Number"
                    value={surgicalManagementInvoiceVerifiedStickerNumber}
                    onChange={(e) => setSurgicalManagementInvoiceVerifiedStickerNumber(e.target.value)}
                    onBlur={() => updateData('surgicalManagementInvoiceVerifiedStickerNumber', surgicalManagementInvoiceVerifiedStickerNumber)}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="body2">Manufacturer</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Manufacturer"
                    value={surgicalManagementInvoiceVerifiedManufacturer}
                    onChange={(e) => setSurgicalManagementInvoiceVerifiedManufacturer(e.target.value)}
                    onBlur={() => updateData('surgicalManagementInvoiceVerifiedManufacturer', surgicalManagementInvoiceVerifiedManufacturer)}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {/* If Invoice Verified = Discrepancy */}
          {invoiceVerifiedValue === 'Discrepancy' && (
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid size={{ xs: 4 }}>
                <Typography variant="body2">Findings</Typography>
              </Grid>
              <Grid size={{ xs: 8 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  value={surgicalManagementInvoiceVerifiedFinding}
                  onChange={(e) => setSurgicalManagementInvoiceVerifiedFinding(e.target.value)}
                  onBlur={() => updateData('surgicalManagementInvoiceVerifiedFinding', surgicalManagementInvoiceVerifiedFinding)}
                />
              </Grid>
            </Grid>
          )}

          {/* If Invoice Verified = Not Verified */}
          {invoiceVerifiedValue === 'Not Verified' && (
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid size={{ xs: 4 }}>
                <Typography variant="body2">Reason</Typography>
              </Grid>
              <Grid size={{ xs: 8 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  value={surgicalManagementInvoiceVerifiedFinding}
                  onChange={(e) => setSurgicalManagementInvoiceVerifiedFinding(e.target.value)}
                  onBlur={() => updateData('surgicalManagementInvoiceVerifiedFinding', surgicalManagementInvoiceVerifiedFinding)}
                />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default RTASurgeryManagement;