import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { QCUpdateService } from '../../../services/qcupdate.service';
import DropdownService from '../../../services/dropdown.service';

interface CentralQCUpdateFieldsProps {
  investigationId?: string;
  previewValues?: any;
  buttonEnable?: boolean;
  readOnly?: boolean;
  onNextTab?: () => void;
}

interface QCUpdateModel {
  isCaseInOrder: string;
  isCaseInOrderReason: string;
  primaryDiscripencyCode: string;
  investigatorVerified: string;
  investigatorVerifiedReason: string;
  referBackInvestigator: string;
  discrepancyNoted: string;
  entityComittingFraud: string;
  stakeHolderAlert: string;
  blacklistEntity: string;
  documents: string;
  other: string;
}

const CentralQCUpdateFields: React.FC<CentralQCUpdateFieldsProps> = ({
  investigationId: propInvestigationId,
  previewValues,
  buttonEnable = true,
  readOnly = false,
  onNextTab,
}) => {
  const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
  
  // State
  const [investigationId, setInvestigationId] = useState('');
  const [qcUpdateModel, setQCUpdateModel] = useState<QCUpdateModel>({
    isCaseInOrder: '',
    isCaseInOrderReason: '',
    primaryDiscripencyCode: '',
    investigatorVerified: '',
    investigatorVerifiedReason: '',
    referBackInvestigator: '',
    discrepancyNoted: '',
    entityComittingFraud: '',
    stakeHolderAlert: '',
    blacklistEntity: '',
    documents: '',
    other: '',
  });
  
  // Dropdown options
  const [discrepancyDropdownOptions, setDiscrepancyDropdownOptions] = useState<any[]>([]);
  const [discrepancySecondaryOptions, setDiscrepancySecondaryOptions] = useState<any[]>([]);
  const [evidenceOptions, setEvidenceOptions] = useState<any[]>([]);
  const [selectedSecondaryDiscrepancy, setSelectedSecondaryDiscrepancy] = useState<string[]>([]);
  const [allEvidenceSupporting, setAllEvidenceSupporting] = useState<string[]>([]);
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const invId = propInvestigationId || (paramInvestigationId ? paramInvestigationId.split(' ')[0] : '');
    setInvestigationId(invId);

    // Fetch dropdowns
    fetchAllPrimaryDiscrepancy();
    fetchEvidences();

    // Load existing data if available
    if (invId) {
      fetchQCUpdateData(invId);
    }
  }, [propInvestigationId, paramInvestigationId]);

  useEffect(() => {
    // Fetch secondary discrepancies when primary changes
    if (qcUpdateModel.primaryDiscripencyCode) {
      fetchSecondary(qcUpdateModel.primaryDiscripencyCode);
    }
  }, [qcUpdateModel.primaryDiscripencyCode]);

  const fetchQCUpdateData = async (invId: string) => {
    try {
      const response = await QCUpdateService.getRegQCUpdateData(invId, 'centralQC');
      
      if (response.statusCode === 0) {
        const payload = response.payload;
        
        setQCUpdateModel({
          ...payload,
          primaryDiscripencyCode: payload.primaryDiscripencyCode?.[0] || '',
        });
        
        // Set evidence supporting
        if (payload.fraudClaimEvidencesClaimQCDTO) {
          const evidences = payload.fraudClaimEvidencesClaimQCDTO.fraudClaimEvidencesViewQCDTO.map(
            (fc: any) => fc.fraudClaimEvidenceCode
          );
          setAllEvidenceSupporting(evidences);
        }
        
        // Set secondary discrepancies
        if (payload.secondaryDiscripencyQCDTO) {
          const secondary = payload.secondaryDiscripencyQCDTO.secondaryDiscripencyViewQCDTO.map(
            (fc: any) => fc.secondaryDiscripencyCode
          );
          setSelectedSecondaryDiscrepancy(secondary);
        }
      }
    } catch (error) {
      console.error('Error fetching QC update data:', error);
    }
  };

  const fetchAllPrimaryDiscrepancy = async () => {
    try {
      const response = await DropdownService.getAllPrimaryDiscrepancy();
      if (response.statusCode === 0) {
        setDiscrepancyDropdownOptions(response.payload || []);
      }
    } catch (error) {
      console.error('Error fetching primary discrepancies:', error);
    }
  };

  const fetchSecondary = async (primaryCode: string) => {
    try {
      const response = await DropdownService.getSecondaryDiscrepancy(primaryCode);
      if (response.statusCode === 0) {
        setDiscrepancySecondaryOptions(response.payload || []);
      }
    } catch (error) {
      console.error('Error fetching secondary discrepancies:', error);
    }
  };

  const fetchEvidences = async () => {
    try {
      const response = await DropdownService.getAllEvidenceSupporting();
      if (response.statusCode === 0) {
        setEvidenceOptions(response.payload || []);
      }
    } catch (error) {
      console.error('Error fetching evidences:', error);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setQCUpdateModel({ ...qcUpdateModel, [field]: value });
  };

  const handleSecondaryDiscrepancyChange = (code: string, checked: boolean) => {
    if (checked) {
      setSelectedSecondaryDiscrepancy([...selectedSecondaryDiscrepancy, code]);
    } else {
      setSelectedSecondaryDiscrepancy(selectedSecondaryDiscrepancy.filter(c => c !== code));
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const response = await QCUpdateService.addQCUpdate(qcUpdateModel, investigationId);
      
      if (response.statusCode === 0) {
        localStorage.setItem('qcUpdateID', response.payload.qcUpdateID);
        alert('QC Update data submitted');
        
        if (onNextTab) {
          onNextTab();
        }
      }
    } catch (error) {
      console.error('Error submitting QC update:', error);
      alert('Error submitting QC update');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* LEFT COLUMN */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Whether case is in order */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormLabel>Whether cases is in order</FormLabel>
                <Select
                  value={qcUpdateModel.isCaseInOrder}
                  onChange={(e) => handleFieldChange('isCaseInOrder', e.target.value)}
                  disabled={readOnly}
                  sx={{ width: '50%' }}
                  size="small"
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </Box>
            </FormControl>
          </Box>

          {/* Reason if not in order */}
          {qcUpdateModel.isCaseInOrder === 'no' && (
            <Box sx={{ mb: 3 }}>
              <FormLabel>Reason</FormLabel>
              <TextField
                fullWidth
                multiline
                rows={5}
                value={qcUpdateModel.isCaseInOrderReason}
                onChange={(e) => handleFieldChange('isCaseInOrderReason', e.target.value)}
                disabled={readOnly}
              />
            </Box>
          )}

          {/* Primary Discrepancy */}
          {qcUpdateModel.isCaseInOrder === 'no' && (
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormLabel>Discrepancy (Primary)</FormLabel>
                  <Select
                    value={qcUpdateModel.primaryDiscripencyCode}
                    onChange={(e) => handleFieldChange('primaryDiscripencyCode', e.target.value)}
                    disabled={readOnly}
                    sx={{ width: '50%' }}
                    size="small"
                  >
                    <MenuItem value="">--- Choose---</MenuItem>
                    {discrepancyDropdownOptions.map((disc) => (
                      <MenuItem key={disc.primaryDiscrepancyCode} value={disc.primaryDiscrepancyCode}>
                        {disc.primaryDiscrepancyDesc}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </FormControl>
            </Box>
          )}

          {/* Secondary Discrepancy */}
          {qcUpdateModel.isCaseInOrder === 'no' && qcUpdateModel.primaryDiscripencyCode && (
            <Box sx={{ mb: 3 }}>
              <FormLabel>Discrepancy (Secondary)</FormLabel>
              <Box sx={{ mt: 1 }}>
                {discrepancySecondaryOptions.map((disc: any) => (
                  <FormControlLabel
                    key={disc.secondaryDiscripencyCode}
                    control={
                      <Checkbox
                        checked={selectedSecondaryDiscrepancy.includes(disc.secondaryDiscripencyCode)}
                        onChange={(e) => handleSecondaryDiscrepancyChange(disc.secondaryDiscripencyCode, e.target.checked)}
                        disabled={readOnly}
                      />
                    }
                    label={disc.secondaryDiscripencyDesc}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Vehicle Documents (PR0970) */}
          {qcUpdateModel.isCaseInOrder === 'no' && qcUpdateModel.primaryDiscripencyCode === 'PR0970' && (
            <>
              <Box sx={{ mb: 3 }}>
                <FormLabel>
                  Any other vehicular documents / information which is critical to admissibility
                </FormLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={qcUpdateModel.documents}
                  onChange={(e) => handleFieldChange('documents', e.target.value)}
                  disabled={readOnly}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <FormLabel>Other</FormLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={qcUpdateModel.other}
                  onChange={(e) => handleFieldChange('other', e.target.value)}
                  disabled={readOnly}
                />
              </Box>
            </>
          )}

          {/* Evidence Supporting */}
          {qcUpdateModel.isCaseInOrder === 'no' && (
            <Box sx={{ mb: 3 }}>
              <FormLabel>Evidence supporting the fraud</FormLabel>
              <Select
                multiple
                value={allEvidenceSupporting}
                onChange={(e) => setAllEvidenceSupporting(e.target.value as string[])}
                disabled={readOnly}
                fullWidth
                size="small"
              >
                {evidenceOptions.map((ev: any) => (
                  <MenuItem key={ev.fraudClaimEvidenceCode} value={ev.fraudClaimEvidenceCode}>
                    {ev.fraudClaimEvidence}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Investigator Verified */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              Has the Investigator verified all the requisite points as per the questionaire?
            </Typography>
            <Select
              value={qcUpdateModel.investigatorVerified}
              onChange={(e) => handleFieldChange('investigatorVerified', e.target.value)}
              disabled={readOnly}
              fullWidth
              size="small"
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </Box>

          {/* Investigator Verified Reason */}
          {qcUpdateModel.investigatorVerified === 'no' && (
            <Box sx={{ mb: 3 }}>
              <FormLabel>Reason</FormLabel>
              <TextField
                fullWidth
                multiline
                rows={5}
                value={qcUpdateModel.investigatorVerifiedReason}
                onChange={(e) => handleFieldChange('investigatorVerifiedReason', e.target.value)}
                disabled={readOnly}
              />
            </Box>
          )}

          {/* Refer Back to Investigator */}
          {qcUpdateModel.isCaseInOrder === 'no' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Need to refer back to Investigator?
              </Typography>
              <Select
                value={qcUpdateModel.referBackInvestigator}
                onChange={(e) => handleFieldChange('referBackInvestigator', e.target.value)}
                disabled={readOnly}
                fullWidth
                size="small"
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </Box>
          )}

          {/* Discrepancy Noted */}
          {qcUpdateModel.isCaseInOrder === 'no' && qcUpdateModel.referBackInvestigator === 'yes' && (
            <Box sx={{ mb: 3 }}>
              <FormLabel>Enter Discrepancy Noted</FormLabel>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={qcUpdateModel.discrepancyNoted}
                onChange={(e) => handleFieldChange('discrepancyNoted', e.target.value)}
                disabled={readOnly}
              />
            </Box>
          )}

          {/* Entity Committing Fraud */}
          {qcUpdateModel.isCaseInOrder === 'no' && (
            <Box sx={{ mb: 3 }}>
              <FormLabel>Name of the Entity committing fraud</FormLabel>
              <Select
                value={qcUpdateModel.entityComittingFraud}
                onChange={(e) => handleFieldChange('entityComittingFraud', e.target.value)}
                disabled={readOnly}
                fullWidth
                size="small"
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Insured">Insured</MenuItem>
                <MenuItem value="Driver">Driver</MenuItem>
                <MenuItem value="Agent">Agent</MenuItem>
                <MenuItem value="Dealership">Dealership</MenuItem>
                <MenuItem value="Pre Inspection Agency">Pre Inspection Agency</MenuItem>
                <MenuItem value="Current Owner">Current Owner</MenuItem>
              </Select>
            </Box>
          )}

          {/* Alert Stakeholders */}
          {qcUpdateModel.isCaseInOrder === 'no' && (
            <Box sx={{ mb: 3 }}>
              <FormLabel>
                Whether to Alert the Stake Holders? (Claims Team, Motor Underwritting, Sales Channel)
              </FormLabel>
              <RadioGroup
                value={qcUpdateModel.stakeHolderAlert}
                onChange={(e) => handleFieldChange('stakeHolderAlert', e.target.value)}
              >
                <FormControlLabel value="1" control={<Radio disabled={readOnly} />} label="Yes" />
                <FormControlLabel value="0" control={<Radio disabled={readOnly} />} label="No" />
              </RadioGroup>
            </Box>
          )}

          {/* Blacklist Entity */}
          {qcUpdateModel.isCaseInOrder === 'no' && (
            <Box sx={{ mb: 3 }}>
              <FormLabel>Whether to recommend Blacklisting of the entity?</FormLabel>
              <RadioGroup
                value={qcUpdateModel.blacklistEntity}
                onChange={(e) => handleFieldChange('blacklistEntity', e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio disabled={readOnly} />} label="Yes" />
                <FormControlLabel value="no" control={<Radio disabled={readOnly} />} label="No" />
              </RadioGroup>
            </Box>
          )}
        </Grid>

        {/* Submit Button */}
        {buttonEnable && !readOnly && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Save & Next'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default CentralQCUpdateFields;