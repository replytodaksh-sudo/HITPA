// ===========================
// SURGICAL MANAGEMENT COMPONENT - COMPLETE
// ===========================

import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { caseupdatePrimaryService } from './PrimaryData';

// ===========================
// INTERFACES
// ===========================
interface SurgicalManagementSecProps {
  previuosData?: any;
}

// ===========================
// MAIN COMPONENT
// ===========================
const SurgicalManagementSec: React.FC<SurgicalManagementSecProps> = ({
  previuosData = ''
}) => {
  // ===========================
  // STATE
  // ===========================
  const [operativeNoteValue, setOperativeNoteValue] = useState('');
  const [anaesthesiaNotesValue, setAnaesthesiaNotesValue] = useState('');
  const [implantUsedValue, setImplantUsedValue] = useState('');
  const [invoiceVerifiedValue, setInvoiceVerifiedValue] = useState('');
  
  const [surgicalManagementProcedureCarriedOut, setSurgicalManagementProcedureCarriedOut] = useState('');
  const [surgicalManagementOperativeFindings, setSurgicalManagementOperativeFindings] = useState('');
  const [surgicalManagementOperativeReason, setSurgicalManagementOperativeReason] = useState('');
  const [surgicalManagementAnaesthesiaFindings, setSurgicalManagementAnaesthesiaFindings] = useState('');
  const [surgicalManagementAnaesthesiaReason, setSurgicalManagementAnaesthesiaReason] = useState('');
  const [surgicalManagementInvoiceVerifiedStickerNumber, setSurgicalManagementInvoiceVerifiedStickerNumber] = useState('');
  const [surgicalManagementInvoiceVerifiedManufacturer, setSurgicalManagementInvoiceVerifiedManufacturer] = useState('');
  const [surgicalManagementInvoiceVerifiedFinding, setSurgicalManagementInvoiceVerifiedFinding] = useState('');

  // ===========================
  // LOAD PREVIOUS DATA
  // ===========================
  useEffect(() => {
    populateData();
  }, [previuosData]);

  const populateData = () => {
    if (!previuosData) return;

    // Operative Notes
    const operativeValue = previuosData.surgicalManagementOperative || '';
    setOperativeNoteValue(operativeValue);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementOperative', operativeValue);

    // Anaesthesia Notes
    const anaesthesiaValue = previuosData.surgicalManagementAnaesthesia || '';
    setAnaesthesiaNotesValue(anaesthesiaValue);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementAnaesthesia', anaesthesiaValue);

    // Implant Used (boolean to radio conversion)
    const implantValue = 
      previuosData.surgicalManagementAnyImplantUsed === true ? '1' :
      previuosData.surgicalManagementAnyImplantUsed === false ? '0' : '';
    setImplantUsedValue(implantValue);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementAnyImplantUsed', previuosData.surgicalManagementAnyImplantUsed);

    // Invoice Verified
    const invoiceValue = previuosData.surgicalManagementInvoiceVerified || '';
    setInvoiceVerifiedValue(invoiceValue);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementInvoiceVerified', invoiceValue);

    // Procedure Carried Out
    const procedureValue = previuosData.surgicalManagementProcedureCarriedOut || '';
    setSurgicalManagementProcedureCarriedOut(procedureValue);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementProcedureCarriedOut', procedureValue);

    // Operative Findings
    const operativeFindings = previuosData.surgicalManagementOperativeFindings || '';
    setSurgicalManagementOperativeFindings(operativeFindings);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementOperativeFindings', operativeFindings);

    // Operative Reason
    const operativeReason = previuosData.surgicalManagementOperativeReason || '';
    setSurgicalManagementOperativeReason(operativeReason);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementOperativeReason', operativeReason);

    // Anaesthesia Findings
    const anaesthesiaFindings = previuosData.surgicalManagementAnaesthesiaFindings || '';
    setSurgicalManagementAnaesthesiaFindings(anaesthesiaFindings);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementAnaesthesiaFindings', anaesthesiaFindings);

    // Anaesthesia Reason
    const anaesthesiaReason = previuosData.surgicalManagementAnaesthesiaReason || '';
    setSurgicalManagementAnaesthesiaReason(anaesthesiaReason);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementAnaesthesiaReason', anaesthesiaReason);

    // Invoice Sticker Number
    const stickerNumber = previuosData.surgicalManagementInvoiceVerifiedStickerNumber || '';
    setSurgicalManagementInvoiceVerifiedStickerNumber(stickerNumber);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementInvoiceVerifiedStickerNumber', stickerNumber);

    // Invoice Manufacturer
    const manufacturer = previuosData.surgicalManagementInvoiceVerifiedManufacturer || '';
    setSurgicalManagementInvoiceVerifiedManufacturer(manufacturer);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementInvoiceVerifiedManufacturer', manufacturer);

    // Invoice Finding
    const finding = previuosData.surgicalManagementInvoiceVerifiedFinding || '';
    setSurgicalManagementInvoiceVerifiedFinding(finding);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementInvoiceVerifiedFinding', finding);
  };

  // ===========================
  // CHANGE HANDLERS
  // ===========================
  const handleProcedureCarriedOutChange = (value: string) => {
    setSurgicalManagementProcedureCarriedOut(value);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementProcedureCarriedOut', value);
  };

  const handleOperativeNotesChange = (value: string) => {
    setOperativeNoteValue(value);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementOperative', value);
  };

  const handleOperativeFindingsChange = (value: string) => {
    setSurgicalManagementOperativeFindings(value);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementOperativeFindings', value);
  };

  const handleOperativeReasonChange = (value: string) => {
    setSurgicalManagementOperativeReason(value);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementOperativeReason', value);
  };

  const handleAnaesthesiaNotesChange = (value: string) => {
    setAnaesthesiaNotesValue(value);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementAnaesthesia', value);
  };

  const handleAnaesthesiaFindingsChange = (value: string) => {
    setSurgicalManagementAnaesthesiaFindings(value);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementAnaesthesiaFindings', value);
  };

  const handleAnaesthesiaReasonChange = (value: string) => {
    setSurgicalManagementAnaesthesiaReason(value);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementAnaesthesiaReason', value);
  };

  const handleImplantUsedChange = (value: string) => {
    setImplantUsedValue(value);
    if (value === '1') {
      caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementAnyImplantUsed', true);
    } else if (value === '0') {
      caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementAnyImplantUsed', false);
    }
  };

  const handleInvoiceVerifiedChange = (value: string) => {
    setInvoiceVerifiedValue(value);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementInvoiceVerified', value);
  };

  const handleStickerNumberChange = (value: string) => {
    setSurgicalManagementInvoiceVerifiedStickerNumber(value);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementInvoiceVerifiedStickerNumber', value);
  };

  const handleManufacturerChange = (value: string) => {
    setSurgicalManagementInvoiceVerifiedManufacturer(value);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementInvoiceVerifiedManufacturer', value);
  };

  const handleInvoiceFindingChange = (value: string) => {
    setSurgicalManagementInvoiceVerifiedFinding(value);
    caseupdatePrimaryService.setCaseUpdateVal('surgicalManagementInvoiceVerifiedFinding', value);
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <>
      {/* Procedure carried Out */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormLabel>Procedure carried Out</FormLabel>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            placeholder="Procedure carried out"
            value={surgicalManagementProcedureCarriedOut}
            onChange={(e) => handleProcedureCarriedOutChange(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Operative Notes? */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormLabel>Operative Notes?</FormLabel>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <RadioGroup
            row
            value={operativeNoteValue}
            onChange={(e) => handleOperativeNotesChange(e.target.value)}
          >
            <FormControlLabel value="Provided" control={<Radio />} label="Provided" />
            <FormControlLabel value="Not Provided" control={<Radio />} label="Not Provided" />
          </RadioGroup>
        </Grid>
      </Grid>

      {/* Operative Notes - Findings (if Provided) */}
      {operativeNoteValue === 'Provided' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormLabel>Findings</FormLabel>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={surgicalManagementOperativeFindings}
              onChange={(e) => handleOperativeFindingsChange(e.target.value)}
            />
          </Grid>
        </Grid>
      )}

      {/* Operative Notes - Reason (if Not Provided) */}
      {operativeNoteValue === 'Not Provided' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormLabel>Reason</FormLabel>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={surgicalManagementOperativeReason}
              onChange={(e) => handleOperativeReasonChange(e.target.value)}
            />
          </Grid>
        </Grid>
      )}

      {/* Anaesthesia Notes? */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormLabel>Anaesthesia Notes?</FormLabel>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <RadioGroup
            row
            value={anaesthesiaNotesValue}
            onChange={(e) => handleAnaesthesiaNotesChange(e.target.value)}
          >
            <FormControlLabel value="Provided" control={<Radio />} label="Provided" />
            <FormControlLabel value="Not Provided" control={<Radio />} label="Not Provided" />
          </RadioGroup>
        </Grid>
      </Grid>

      {/* Anaesthesia Notes - Findings (if Provided) */}
      {anaesthesiaNotesValue === 'Provided' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormLabel>Findings</FormLabel>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={surgicalManagementAnaesthesiaFindings}
              onChange={(e) => handleAnaesthesiaFindingsChange(e.target.value)}
            />
          </Grid>
        </Grid>
      )}

      {/* Anaesthesia Notes - Reason (if Not Provided) */}
      {anaesthesiaNotesValue === 'Not Provided' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormLabel>Reason</FormLabel>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={surgicalManagementAnaesthesiaReason}
              onChange={(e) => handleAnaesthesiaReasonChange(e.target.value)}
            />
          </Grid>
        </Grid>
      )}

      {/* Any Implant Used? */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormLabel>Any Implant Used?</FormLabel>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <RadioGroup
            row
            value={implantUsedValue}
            onChange={(e) => handleImplantUsedChange(e.target.value)}
          >
            <FormControlLabel value="1" control={<Radio />} label="Yes" />
            <FormControlLabel value="0" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>
      </Grid>

      {/* Implant Used = Yes */}
      {implantUsedValue === '1' && (
        <>
          {/* Invoice verified */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormLabel>Invoice verified</FormLabel>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <RadioGroup
                value={invoiceVerifiedValue}
                onChange={(e) => handleInvoiceVerifiedChange(e.target.value)}
              >
                <FormControlLabel value="Genuine" control={<Radio />} label="Genuine" />
                <FormControlLabel value="Discrepancy" control={<Radio />} label="Discrepancy" />
                <FormControlLabel value="Not Verified" control={<Radio />} label="Not Verified" />
              </RadioGroup>
            </Grid>
          </Grid>

          {/* Invoice Verified = Genuine */}
          {invoiceVerifiedValue === 'Genuine' && (
            <>
              {/* Invoice / Sticker Number */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormLabel>Invoice / Sticker Number</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    placeholder="Invoice / Sticker Number"
                    value={surgicalManagementInvoiceVerifiedStickerNumber}
                    onChange={(e) => handleStickerNumberChange(e.target.value)}
                  />
                </Grid>
              </Grid>

              {/* Manufacturer */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormLabel>Manufacturer</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    placeholder="Manufacturer"
                    value={surgicalManagementInvoiceVerifiedManufacturer}
                    onChange={(e) => handleManufacturerChange(e.target.value)}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {/* Invoice Verified = Discrepancy */}
          {invoiceVerifiedValue === 'Discrepancy' && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormLabel>Findings</FormLabel>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={surgicalManagementInvoiceVerifiedFinding}
                  onChange={(e) => handleInvoiceFindingChange(e.target.value)}
                />
              </Grid>
            </Grid>
          )}

          {/* Invoice Verified = Not Verified */}
          {invoiceVerifiedValue === 'Not Verified' && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormLabel>Reason</FormLabel>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={surgicalManagementInvoiceVerifiedFinding}
                  onChange={(e) => handleInvoiceFindingChange(e.target.value)}
                />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default SurgicalManagementSec;