import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Alert,
  FormGroup,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { agencyService, caseAssignmentService, dropdownService } from '../../services/agency.service';

interface Zone {
  zoneCode: string;
  zoneName: string;
}

interface State {
  stateCode: string;
  stateName: string;
}

interface City {
  cityCode: string;
  cityName: string;
}

interface Pin {
  pinCodeNo: string;
}

interface CaseAssignmentRule {
  ruleCode: string;
  ruleName: string;
  caseType: string;
  thresoldLimit: number;
  claimAmountCap: string;
  isRuleEnable: boolean;
  zones: string[];
  states: string[];
  cities: string[];
  pincodes: string[];
}

const CaseAssignmentRule: React.FC = () => {
  const theme = useTheme();
  const [assignmentRuleList, setAssignmentRuleList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // State for modal
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);

  // Form fields
  const [ruleCode, setRuleCode] = useState('');
  const [ruleName, setRuleName] = useState('');
  const [thresoldLimit, setThresoldLimit] = useState<number>(0);
  const [claimAmountCap, setClaimAmountCap] = useState('');
  const [isRuleEnable, setIsRuleEnable] = useState(false);

  // Dropdown data
  const [zones, setZones] = useState<Zone[]>([]);
  const [multiStates, setMultiStates] = useState<State[]>([]);
  const [multiCities, setMultiCities] = useState<City[]>([]);
  const [multiPins, setMultiPins] = useState<Pin[]>([]);

  // Selected values
  const [allowedZones, setAllowedZones] = useState<string[]>([]);
  const [allowedStates, setAllowedStates] = useState<string[]>([]);
  const [allowedCities, setAllowedCities] = useState<string[]>([]);
  const [allowedPins, setAllowedPins] = useState<string[]>([]);
  const [caseTypeArray, setCaseTypeArray] = useState<string[]>([]);

  // Validation errors
  const [errors, setErrors] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [thresoldLimitError, setThresoldLimitError] = useState(false);

  useEffect(() => {
    fetchZones();
    getAllAssignmentRules();
  }, []);

  const fetchZones = async () => {
    try {
      const response = await dropdownService.getZones();
      if (response.statusCode === 0) {
        setZones(response.payload);
      }
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const getAllAssignmentRules = async () => {
    setLoading(true);
    try {
      const response = await caseAssignmentService.getCaseAssignmentRule();
      if (response.statusCode === 0) {
        setAssignmentRuleList(response.payload);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatesByZone = async (zoneCodes: string[]) => {
    try {
      const response = await dropdownService.getStatesByZones({ zoneCodes });
      if (response.statusCode === 0) {
        setMultiStates(response.payload);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const getCitiesByStates = async (stateCodes: string[]) => {
    try {
      const response = await dropdownService.getCitiesByStates({ stateCodes });
      if (response.statusCode === 0) {
        setMultiCities(response.payload);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const getPinsByCities = async (cityCodes: string[]) => {
    try {
      const response = await dropdownService.getPinsByCities({ cityCodes });
      if (response.statusCode === 0) {
        setMultiPins(response.payload);
      }
    } catch (error) {
      console.error('Error fetching pins:', error);
    }
  };

  // Handle zone selection
  const handleZoneChange = (zoneCode: string, checked: boolean) => {
    let newZones = [...allowedZones];
    if (checked) {
      newZones.push(zoneCode);
    } else {
      newZones = newZones.filter(z => z !== zoneCode);
    }
    setAllowedZones(newZones);

    if (newZones.length > 0) {
      getStatesByZone(newZones);
    } else {
      setMultiStates([]);
      setAllowedStates([]);
      setMultiCities([]);
      setAllowedCities([]);
      setMultiPins([]);
      setAllowedPins([]);
    }
  };

  // Handle state selection
  const handleStateChange = (stateCode: string, checked: boolean) => {
    let newStates = [...allowedStates];
    if (checked) {
      newStates.push(stateCode);
    } else {
      newStates = newStates.filter(s => s !== stateCode);
    }
    setAllowedStates(newStates);

    if (newStates.length > 0) {
      getCitiesByStates(newStates);
    } else {
      setMultiCities([]);
      setAllowedCities([]);
      setMultiPins([]);
      setAllowedPins([]);
    }
  };

  // Handle city selection
  const handleCityChange = (cityCode: string, checked: boolean) => {
    let newCities = [...allowedCities];
    if (checked) {
      newCities.push(cityCode);
    } else {
      newCities = newCities.filter(c => c !== cityCode);
    }
    setAllowedCities(newCities);

    if (newCities.length > 0) {
      getPinsByCities(newCities);
    } else {
      setMultiPins([]);
      setAllowedPins([]);
    }
  };

  // Handle pin selection
  const handlePinChange = (pinCode: string, checked: boolean) => {
    let newPins = [...allowedPins];
    if (checked) {
      newPins.push(pinCode);
    } else {
      newPins = newPins.filter(p => p !== pinCode);
    }
    setAllowedPins(newPins);
  };

  // Toggle Select All for Zones
  const toggleSelectAllZones = (checked: boolean) => {
    setAllowedStates([]);
    setAllowedCities([]);
    setAllowedPins([]);

    if (checked) {
      const allZoneCodes = zones.map(z => z.zoneCode);
      setAllowedZones(allZoneCodes);
      getStatesByZone(allZoneCodes);
    } else {
      setAllowedZones([]);
      setMultiStates([]);
    }
  };

  // Toggle Select All for States
  const toggleSelectAllStates = (checked: boolean) => {
    setAllowedCities([]);
    setAllowedPins([]);

    if (checked) {
      const allStateCodes = multiStates.map(s => s.stateCode);
      setAllowedStates(allStateCodes);
      getCitiesByStates(allStateCodes);
    } else {
      setAllowedStates([]);
      setMultiCities([]);
    }
  };

  // Toggle Select All for Cities
  const toggleSelectAllCities = (checked: boolean) => {
    setAllowedPins([]);

    if (checked) {
      const allCityCodes = multiCities.map(c => c.cityCode);
      setAllowedCities(allCityCodes);
      getPinsByCities(allCityCodes);
    } else {
      setAllowedCities([]);
      setMultiPins([]);
    }
  };

  // Toggle Select All for Pins
  const toggleSelectAllPins = (checked: boolean) => {
    if (checked) {
      const allPinCodes = multiPins.map(p => p.pinCodeNo);
      setAllowedPins(allPinCodes);
    } else {
      setAllowedPins([]);
    }
  };

  // Handle case type selection
  const handleCaseTypeChange = (caseType: string, checked: boolean) => {
    let newCaseTypes = [...caseTypeArray];
    if (checked) {
      newCaseTypes.push(caseType);
    } else {
      newCaseTypes = newCaseTypes.filter(ct => ct !== caseType);
    }
    setCaseTypeArray(newCaseTypes);
  };

  // Open modal for create
  const handleOpenModal = () => {
    clearForm();
    setIsEdit(false);
    setIsView(false);
    setOpen(true);
  };

  // Open modal for edit
  const handleEdit = async (ruleCodeParam: string) => {
    clearForm();
    setIsEdit(true);
    setIsView(false);

    try {
      const response = await caseAssignmentService.getAssignedRuleByCode(ruleCodeParam);
      if (response.statusCode === 0) {
        const data = response.payload;

        setRuleCode(data.ruleCode);
        setRuleName(data.ruleName);
        setThresoldLimit(data.thresoldLimit);
        setClaimAmountCap(data.claimAmountCap);
        setIsRuleEnable(data.isRuleEnable);

        // Set zones and fetch states
        const zoneCodes = data.zones.map((z: any) => z.zoneCode);
        setAllowedZones(zoneCodes);
        await getStatesByZone(zoneCodes);

        // Set states and fetch cities
        const stateCodes = data.states.map((s: any) => s.stateCode);
        setAllowedStates(stateCodes);
        await getCitiesByStates(stateCodes);

        // Set cities and fetch pins
        const cityCodes = data.cities.map((c: any) => c.cityCode);
        setAllowedCities(cityCodes);
        await getPinsByCities(cityCodes);

        // Set pins
        const pinCodes = data.pincodes.map((p: any) => p.pinCodeNo);
        setAllowedPins(pinCodes);

        // Set case types
        const caseTypes = data.caseType.split(',').filter((ct: string) => ct.trim());
        setCaseTypeArray(caseTypes);

        setOpen(true);
      }
    } catch (error) {
      console.error('Error fetching rule details:', error);
    }
  };

  // Clear form
  const clearForm = () => {
    setRuleCode('');
    setRuleName('');
    setThresoldLimit(0);
    setClaimAmountCap('');
    setIsRuleEnable(false);
    setAllowedZones([]);
    setAllowedStates([]);
    setAllowedCities([]);
    setAllowedPins([]);
    setCaseTypeArray([]);
    setMultiStates([]);
    setMultiCities([]);
    setMultiPins([]);
    setErrors({});
    setSubmitted(false);
    setThresoldLimitError(false);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpen(false);
    clearForm();
  };

  // Validate form
  const validateForm = () => {
    const newErrors: any = {};

    if (!ruleCode.trim()) newErrors.ruleCode = 'Rule Code is required';
    if (!ruleName.trim()) newErrors.ruleName = 'Rule Name is required';
    if (allowedZones.length === 0) newErrors.zones = 'Zone is required';
    if (allowedStates.length === 0) newErrors.states = 'State is required';
    if (allowedCities.length === 0) newErrors.cities = 'City is required';
    if (allowedPins.length === 0) newErrors.pins = 'Pincode is required';
    if (caseTypeArray.length === 0) newErrors.caseType = 'Case Type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save changes
  const handleSaveChanges = async () => {
    setSubmitted(true);

    if (!validateForm()) {
      return;
    }

    if (thresoldLimit === 0) {
      setThresoldLimitError(true);
      return;
    }

    try {
      const caseTypeString = caseTypeArray.join(',');

      const payload: CaseAssignmentRule = {
        ruleCode,
        ruleName,
        thresoldLimit,
        claimAmountCap,
        isRuleEnable,
        caseType: caseTypeString,
        zones: allowedZones,
        states: allowedStates,
        cities: allowedCities,
        pincodes: allowedPins,
      };

      await caseAssignmentService.addCaseAssignmentRule(payload);
      await getAllAssignmentRules();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving rule:', error);
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      width: 70,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'ruleCode',
      headerName: 'Rule Code',
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'ruleName',
      headerName: 'Rule Name',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'caseType',
      headerName: 'Case Type',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'zone',
      headerName: 'Zone',
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'location',
      headerName: 'State/City/PinCode',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <IconButton
            size="small"
            sx={{ color: 'primary.main' }}
            title="View"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: 'success.main' }}
            onClick={() => handleEdit(params.row.ruleCode)}
            title="Edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: 'error.main' }}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows = assignmentRuleList.map((item, index) => ({
    id: index + 1,
    ruleCode: item.ruleCode,
    ruleName: item.ruleName,
    caseType: item.caseType,
    zone: '',
    location: '',
  }));

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleOpenModal}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            },
          }}
        >
          + Add New
        </Button>
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              borderColor: theme.palette.divider,
            },
            '& .MuiDataGrid-columnHeaders': {
              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
              color: '#7a7a7a',
              fontSize: '0.875rem',
              fontWeight: 700,
              borderRadius: 0,
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.08)',
            },
          }}
        />
      </Box>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">
            {isEdit ? 'Edit Case Assignment Rule' : 'New Case Assignment Rule'}
          </Typography>
          <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Box sx={{ py: 2 }}>
            {/* Rule Code and Rule Name */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Rule Code"
                  required
                  value={ruleCode}
                  onChange={(e) => setRuleCode(e.target.value)}
                  error={submitted && !!errors.ruleCode}
                  helperText={submitted && errors.ruleCode}
                  disabled={isEdit}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Rule Name"
                  required
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  error={submitted && !!errors.ruleName}
                  helperText={submitted && errors.ruleName}
                />
              </Grid>
            </Grid>

            {/* Zones */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor: submitted && errors.zones ? 'error.main' : 'divider',
                    borderWidth: submitted && errors.zones ? 2 : 1,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Applicable Zones <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={zones.length > 0 && allowedZones.length === zones.length}
                            onChange={(e) => toggleSelectAllZones(e.target.checked)}
                          />
                        }
                        label="Select All"
                      />
                    </Box>
                    <FormGroup>
                      {zones.map((zone) => (
                        <FormControlLabel
                          key={zone.zoneCode}
                          control={
                            <Checkbox
                              checked={allowedZones.includes(zone.zoneCode)}
                              onChange={(e) => handleZoneChange(zone.zoneCode, e.target.checked)}
                            />
                          }
                          label={zone.zoneName}
                        />
                      ))}
                    </FormGroup>
                  </CardContent>
                </Card>
                {submitted && errors.zones && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.zones}
                  </Typography>
                )}
              </Grid>

              {/* States */}
              {allowedZones.length > 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderColor: submitted && errors.states ? 'error.main' : 'divider',
                      borderWidth: submitted && errors.states ? 2 : 1,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Allowed States <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={multiStates.length > 0 && allowedStates.length === multiStates.length}
                              onChange={(e) => toggleSelectAllStates(e.target.checked)}
                            />
                          }
                          label="Select All"
                        />
                      </Box>
                      <FormGroup sx={{ maxHeight: 200, overflowY: 'auto' }}>
                        {multiStates.map((state) => (
                          <FormControlLabel
                            key={state.stateCode}
                            control={
                              <Checkbox
                                checked={allowedStates.includes(state.stateCode)}
                                onChange={(e) => handleStateChange(state.stateCode, e.target.checked)}
                              />
                            }
                            label={state.stateName}
                          />
                        ))}
                      </FormGroup>
                    </CardContent>
                  </Card>
                  {submitted && errors.states && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.states}
                    </Typography>
                  )}
                </Grid>
              )}
            </Grid>

            {/* Cities and Pins */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {allowedStates.length > 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderColor: submitted && errors.cities ? 'error.main' : 'divider',
                      borderWidth: submitted && errors.cities ? 2 : 1,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Allowed Cities <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={multiCities.length > 0 && allowedCities.length === multiCities.length}
                              onChange={(e) => toggleSelectAllCities(e.target.checked)}
                            />
                          }
                          label="Select All"
                        />
                      </Box>
                      <FormGroup sx={{ maxHeight: 200, overflowY: 'auto' }}>
                        {multiCities.map((city) => (
                          <FormControlLabel
                            key={city.cityCode}
                            control={
                              <Checkbox
                                checked={allowedCities.includes(city.cityCode)}
                                onChange={(e) => handleCityChange(city.cityCode, e.target.checked)}
                              />
                            }
                            label={city.cityName}
                          />
                        ))}
                      </FormGroup>
                    </CardContent>
                  </Card>
                  {submitted && errors.cities && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.cities}
                    </Typography>
                  )}
                </Grid>
              )}

              {allowedCities.length > 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderColor: submitted && errors.pins ? 'error.main' : 'divider',
                      borderWidth: submitted && errors.pins ? 2 : 1,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Allowed Pins <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={multiPins.length > 0 && allowedPins.length === multiPins.length}
                              onChange={(e) => toggleSelectAllPins(e.target.checked)}
                            />
                          }
                          label="Select All"
                        />
                      </Box>
                      <FormGroup sx={{ maxHeight: 200, overflowY: 'auto' }}>
                        {multiPins.map((pin) => (
                          <FormControlLabel
                            key={pin.pinCodeNo}
                            control={
                              <Checkbox
                                checked={allowedPins.includes(pin.pinCodeNo)}
                                onChange={(e) => handlePinChange(pin.pinCodeNo, e.target.checked)}
                              />
                            }
                            label={pin.pinCodeNo}
                          />
                        ))}
                      </FormGroup>
                    </CardContent>
                  </Card>
                  {submitted && errors.pins && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.pins}
                    </Typography>
                  )}
                </Grid>
              )}
            </Grid>

            {/* Case Type */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                border: submitted && errors.caseType ? '2px solid' : '1px solid',
                borderColor: submitted && errors.caseType ? 'error.main' : 'divider',
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Case Type <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={caseTypeArray.includes('cashless')}
                      onChange={(e) => handleCaseTypeChange('cashless', e.target.checked)}
                    />
                  }
                  label="Cashless"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={caseTypeArray.includes('reimbursement')}
                      onChange={(e) => handleCaseTypeChange('reimbursement', e.target.checked)}
                    />
                  }
                  label="Reimbursement"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={caseTypeArray.includes('fixedIntimation')}
                      onChange={(e) => handleCaseTypeChange('fixedIntimation', e.target.checked)}
                    />
                  }
                  label="Fixed Intimation"
                />
              </Box>
              {submitted && errors.caseType && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {errors.caseType}
                </Typography>
              )}
            </Box>

            {/* Threshold and Claim Amount */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Threshold limit for Open cases for case assignment"
                  type="number"
                  value={thresoldLimit}
                  onChange={(e) => {
                    setThresoldLimit(Number(e.target.value));
                    setThresoldLimitError(false);
                  }}
                  error={thresoldLimitError}
                  helperText={thresoldLimitError && 'Threshold limit is required'}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Claim amount upto which case will be assigned"
                  value={claimAmountCap}
                  onChange={(e) => setClaimAmountCap(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Enable Rule */}
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRuleEnable}
                    onChange={(e) => setIsRuleEnable(e.target.checked)}
                  />
                }
                label="Enable Rule"
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">
            Close
          </Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              },
            }}
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CaseAssignmentRule;