import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
  Alert,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { agencyService } from '../../services/agency.service';
import DropdownService from '../../services/dropdown.service';
import caseAssignmentService from '../../services/caseAssignmentService';
// import { agencyService, caseAssignmentService, DropdownService } from '../../services/agency.service';

interface Agency {
  agencyCode: string;
  mdmCode: string;
  userName: string;
  agencyName: string;
  agencyType: string;
  comemail: string;
  commobileNo: string;
  panNo: string;
}

const AgencyManagement: React.FC = () => {
  const theme = useTheme();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState('');

  // Dropdown data
  const [agencyTypes, setAgencyTypes] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [caseAssignmentRules, setCaseAssignmentRules] = useState<any[]>([]);

  // Cascading dropdowns
  const [multiStates, setMultiStates] = useState<any[]>([]);
  const [multiCities, setMultiCities] = useState<any[]>([]);
  const [multiPins, setMultiPins] = useState<any[]>([]);

  // Form data
  const [formData, setFormData] = useState({
    mdmId: '',
    agencyName: '',
    userName: '',
    agencyType: '',
    addressLine1: '',
    addressLine2: '',
    stateCode: '',
    cityCode: '',
    pinCode: '',
    commobileNo: '',
    mobile: '',
    comemail: '',
    email1: '',
    email2: '',
    usersAllowed: '',
    enableBx: false,
  });

  // Selected areas
  const [allowedZones, setAllowedZones] = useState<string[]>([]);
  const [allowedStates, setAllowedStates] = useState<string[]>([]);
  const [allowedCities, setAllowedCities] = useState<string[]>([]);
  const [allowedPins, setAllowedPins] = useState<string[]>([]);
  const [ruleCode, setRuleCode] = useState<string[]>([]);

  // Search state
  const [readonlyAgencyName, setReadonlyAgencyName] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAgencies(),
        fetchAgencyTypes(),
        fetchZones(),
        fetchStates(),
        fetchCaseAssignmentRules(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgencies = async () => {
    const response = await agencyService.fetchAllAgency();
    if (response.statusCode === 0) {
      setAgencies(response.payload);
    }
  };

  const fetchAgencyTypes = async () => {
    const response = await DropdownService.getAgencyType();
    if (response.statusCode === 0) {
      setAgencyTypes(response.payload || []);
    }
  };

  const fetchZones = async () => {
    const response = await DropdownService.getZones();
    if (response.statusCode === 0) {
      setZones(response.payload || []);
    }
  };

  const fetchStates = async () => {
    const response = await DropdownService.getStates();
    if (response.statusCode === 0) {
      setStates(response.payload || []);
    }
  };

  const fetchCities = async (stateCode: string) => {
    const response = await DropdownService.getCities(stateCode);
    if (response.statusCode === 0) {
      setCities(response.payload || []);
    }
  };

  const fetchCaseAssignmentRules = async () => {
    const response = await caseAssignmentService.getCaseAssignmentRule();
    if (response.statusCode === 0) {
      setCaseAssignmentRules(response.payload || []);
    }
  };

  // Cascading selections
  const fetchStatesByZones = async (zoneCodes: string[]) => {
    const response = await DropdownService.getStatesByZones(zoneCodes);
    if (response.statusCode === 0) {
      setMultiStates(response.payload || []);
    }
  };

  const fetchCitiesByStates = async (stateCodes: string[]) => {
    const response = await DropdownService.getCitiesByStates(stateCodes);
    if (response.statusCode === 0) {
      setMultiCities(response.payload || []);
    }
  };

  const fetchPinsByCities = async (cityCodes: string[]) => {
    const response = await DropdownService.getPinsByCities(cityCodes);
    if (response.statusCode === 0) {
      setMultiPins(response.payload || []);
    }
  };

  // Modal handlers
  const handleOpenModal = (mode: 'create' | 'edit' | 'view', agencyCode?: string) => {
    if (mode === 'create') {
      resetForm();
      setIsEdit(false);
      setIsView(false);
    } else if (mode === 'edit') {
      setIsEdit(true);
      setIsView(false);
      if (agencyCode) {
        setSelectedAgency(agencyCode);
        populateAgency(agencyCode);
      }
    } else if (mode === 'view') {
      setIsEdit(false);
      setIsView(true);
      if (agencyCode) {
        populateAgency(agencyCode);
      }
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      mdmId: '',
      agencyName: '',
      userName: '',
      agencyType: '',
      addressLine1: '',
      addressLine2: '',
      stateCode: '',
      cityCode: '',
      pinCode: '',
      commobileNo: '',
      mobile: '',
      comemail: '',
      email1: '',
      email2: '',
      usersAllowed: '',
      enableBx: false,
    });
    setAllowedZones([]);
    setAllowedStates([]);
    setAllowedCities([]);
    setAllowedPins([]);
    setRuleCode([]);
    setMultiStates([]);
    setMultiCities([]);
    setMultiPins([]);
    setCities([]);
    setReadonlyAgencyName(false);
    setSelectedAgency('');
  };

  const populateAgency = async (agencyCode: string) => {
    const response = await agencyService.getAgencyUserByCode(agencyCode);
    if (response.statusCode === 0) {
      const data = response.payload;
      
      setFormData({
        mdmId: data.mdmCode || '',
        agencyName: data.agencyName || '',
        userName: data.userName || '',
        agencyType: data.agencyTypeCode || '',
        addressLine1: data.addressLine1 || '',
        addressLine2: data.addressLine2 || '',
        stateCode: data.stateCode || '',
        cityCode: data.cityCode || '',
        pinCode: data.pincode || '',
        commobileNo: data.commobileNo || '',
        mobile: data.mobile || '',
        comemail: data.comemail || '',
        email1: data.agencyEmails?.[0] || '',
        email2: data.agencyEmails?.[1] || '',
        usersAllowed: data.noOfUserAllow || '',
        enableBx: false,
      });

      if (data.stateCode) {
        fetchCities(data.stateCode);
      }

      setAllowedZones(data.agencyZones || []);
      setAllowedStates(data.agencyStates || []);
      setAllowedCities(data.agencyCities || []);
      setAllowedPins(data.agencyPincode || []);
      setRuleCode(data.caseAssignmentRules || []);

      if (data.agencyZones?.length > 0) {
        fetchStatesByZones(data.agencyZones);
      }
      if (data.agencyStates?.length > 0) {
        fetchCitiesByStates(data.agencyStates);
      }
      if (data.agencyCities?.length > 0) {
        fetchPinsByCities(data.agencyCities);
      }
    }
  };

  const searchAgency = async () => {
    if (!formData.mdmId) return;
    
    const response = await agencyService.fetchAgency(formData.mdmId);
    if (response.statusCode === 0) {
      setFormData(prev => ({ ...prev, agencyName: response.payload.investigatorName }));
      setReadonlyAgencyName(true);
    }
  };

  const resetAgencySearch = () => {
    setFormData(prev => ({ ...prev, mdmId: '', agencyName: '' }));
    setReadonlyAgencyName(false);
  };

  // Zone/State/City/Pin handlers
  const handleZoneChange = (zoneCode: string, checked: boolean) => {
    let newZones = [...allowedZones];
    if (checked) {
      newZones.push(zoneCode);
    } else {
      newZones = newZones.filter(z => z !== zoneCode);
    }
    setAllowedZones(newZones);
    
    if (newZones.length > 0) {
      fetchStatesByZones(newZones);
    } else {
      setMultiStates([]);
      setAllowedStates([]);
      setMultiCities([]);
      setAllowedCities([]);
      setMultiPins([]);
      setAllowedPins([]);
    }
  };

  const handleStateChange = (stateCode: string, checked: boolean) => {
    let newStates = [...allowedStates];
    if (checked) {
      newStates.push(stateCode);
    } else {
      newStates = newStates.filter(s => s !== stateCode);
    }
    setAllowedStates(newStates);
    
    if (newStates.length > 0) {
      fetchCitiesByStates(newStates);
    } else {
      setMultiCities([]);
      setAllowedCities([]);
      setMultiPins([]);
      setAllowedPins([]);
    }
  };

  const handleCityChange = (cityCode: string, checked: boolean) => {
    let newCities = [...allowedCities];
    if (checked) {
      newCities.push(cityCode);
    } else {
      newCities = newCities.filter(c => c !== cityCode);
    }
    setAllowedCities(newCities);
    
    if (newCities.length > 0) {
      fetchPinsByCities(newCities);
    } else {
      setMultiPins([]);
      setAllowedPins([]);
    }
  };

  const handlePinChange = (pinCode: string, checked: boolean) => {
    if (checked) {
      setAllowedPins([...allowedPins, pinCode]);
    } else {
      setAllowedPins(allowedPins.filter(p => p !== pinCode));
    }
  };

  // Select All handlers
  const toggleSelectAllZones = (checked: boolean) => {
    if (checked) {
      const allZoneCodes = zones.map(z => z.zoneCode);
      setAllowedZones(allZoneCodes);
      fetchStatesByZones(allZoneCodes);
    } else {
      setAllowedZones([]);
      setMultiStates([]);
    }
    setAllowedStates([]);
    setAllowedCities([]);
    setAllowedPins([]);
  };

  const toggleSelectAllStates = (checked: boolean) => {
    if (checked) {
      const allStateCodes = multiStates.map(s => s.stateCode);
      setAllowedStates(allStateCodes);
      fetchCitiesByStates(allStateCodes);
    } else {
      setAllowedStates([]);
      setMultiCities([]);
    }
    setAllowedCities([]);
    setAllowedPins([]);
  };

  const toggleSelectAllCities = (checked: boolean) => {
    if (checked) {
      const allCityCodes = multiCities.map(c => c.cityCode);
      setAllowedCities(allCityCodes);
      fetchPinsByCities(allCityCodes);
    } else {
      setAllowedCities([]);
      setMultiPins([]);
    }
    setAllowedPins([]);
  };

  const toggleSelectAllPins = (checked: boolean) => {
    if (checked) {
      setAllowedPins(multiPins.map(p => p.pinCode));
    } else {
      setAllowedPins([]);
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    const agencyRequest = {
      mdmCode: formData.mdmId,
      agencyName: formData.agencyName,
      userName: formData.userName,
      agencyTypeCode: formData.agencyType,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      stateCode: formData.stateCode,
      cityCode: formData.cityCode,
      pincode: formData.pinCode,
      commobileNo: formData.commobileNo,
      mobile: formData.mobile,
      comemail: formData.comemail,
      noOfUserAllow: formData.usersAllowed,
      agencyZones: allowedZones,
      agencyStates: allowedStates,
      agencyCities: allowedCities,
      agencyPincode: allowedPins,
      caseAssignmentRules: ruleCode,
      agencyEmails: [formData.email1, formData.email2].filter(Boolean),
    };

    try {
      let response;
      if (isEdit) {
        response = await agencyService.editAgency({
          ...agencyRequest,
          agencyCode: selectedAgency,
        });
      } else {
        response = await agencyService.addAgency(agencyRequest);
      }

      if (response.statusCode === 0) {
        handleCloseModal();
        fetchAgencies();
      }
    } catch (error) {
      console.error('Error saving agency:', error);
    }
  };

  const handleDelete = async (agencyCode: string) => {
    if (window.confirm('Are you sure you want to delete this agency?')) {
      const response = await agencyService.deleteAgency(agencyCode);
      if (response.statusCode === 0) {
        fetchAgencies();
      }
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', width: 70 },
    { field: 'mdmCode', headerName: 'MDM', width: 120 },
    { field: 'userName', headerName: 'UserName', width: 150 },
    { field: 'agencyName', headerName: 'Agency Name', width: 200 },
    { field: 'agencyType', headerName: 'Agency Type', width: 150 },
    { field: 'comemail', headerName: 'Email', width: 200 },
    { field: 'commobileNo', headerName: 'Mobile', width: 130 },
    { field: 'panNo', headerName: 'PAN No.', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleOpenModal('view', params.row.agencyCode)}
            sx={{ color: 'primary.main' }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleOpenModal('edit', params.row.agencyCode)}
            sx={{ color: 'success.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.agencyCode)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows = agencies.map((agency, index) => ({
    id: index + 1,
    ...agency,
  }));

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal('create')}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            },
          }}
        >
          Add New Agency
        </Button>
      </Box>

      {/* DataGrid */}
      <Card sx={{ boxShadow: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
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
              bgcolor: 'action.hover',
            },
          }}
        />
      </Card>

      {/* Modal Dialog */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          },
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
            {isEdit ? 'Edit Agency' : isView ? 'View Agency' : 'New Agency'}
          </Typography>
          <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              {/* MDM ID */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="MDM ID"
                  required
                  value={formData.mdmId}
                  onChange={(e) => setFormData({ ...formData, mdmId: e.target.value })}
                  disabled={isView || isEdit}
                />
                <Button
                  variant="outlined"
                  onClick={searchAgency}
                  disabled={isView || isEdit}
                >
                  <SearchIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={resetAgencySearch}
                  disabled={isView || isEdit}
                >
                  <RefreshIcon />
                </Button>
              </Box>

              <TextField
                fullWidth
                label="Agency Name"
                required
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                disabled={isView || readonlyAgencyName}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="UserName"
                required
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                disabled={isView || isEdit}
                sx={{ mb: 2 }}
              />

              {/* Address Section */}
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Registered Office Address
              </Typography>

              <TextField
                fullWidth
                label="Address Line 1"
                required
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                disabled={isView}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Address Line 2"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                disabled={isView}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.stateCode}
                  onChange={(e) => {
                    setFormData({ ...formData, stateCode: e.target.value, cityCode: '' });
                    fetchCities(e.target.value);
                  }}
                  disabled={isView}
                  label="State"
                >
                  {states.map((state) => (
                    <MenuItem key={state.stateCode} value={state.stateCode}>
                      {state.stateName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>City</InputLabel>
                <Select
                  value={formData.cityCode}
                  onChange={(e) => setFormData({ ...formData, cityCode: e.target.value })}
                  disabled={isView}
                  label="City"
                >
                  {cities.map((city) => (
                    <MenuItem key={city.cityCode} value={city.cityCode}>
                      {city.cityName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Pincode"
                required
                value={formData.pinCode}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                disabled={isView}
                inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Contact"
                required
                value={formData.commobileNo}
                onChange={(e) => setFormData({ ...formData, commobileNo: e.target.value })}
                disabled={isView}
                inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                disabled={isView}
                inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                required
                value={formData.comemail}
                onChange={(e) => setFormData({ ...formData, comemail: e.target.value })}
                disabled={isView}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="No. of Users Allowed"
                type="number"
                value={formData.usersAllowed}
                onChange={(e) => setFormData({ ...formData, usersAllowed: e.target.value })}
                disabled={isView}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.enableBx}
                    onChange={(e) => setFormData({ ...formData, enableBx: e.target.checked })}
                    disabled={isView}
                  />
                }
                label="Enable"
              />
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Agency Type</InputLabel>
                <Select
                  value={formData.agencyType}
                  onChange={(e) => setFormData({ ...formData, agencyType: e.target.value })}
                  disabled={isView}
                  label="Agency Type"
                 >
                  {agencyTypes.map((type) => (
                    <MenuItem key={type.code} value={type.code}>
                      {type.codeDescription}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Area Coverage Section */}
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Area Covered for Case Handling
              </Typography>

              {/* Zones */}
              <Card sx={{ mb: 2, boxShadow: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Applicable Zones *
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => toggleSelectAllZones(e.target.checked)}
                          disabled={isView}
                        />
                      }
                      label="Select All"
                    />
                  </Box>
                  <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
                    {zones.map((zone) => (
                      <FormControlLabel
                        key={zone.zoneCode}
                        control={
                          <Checkbox
                            checked={allowedZones.includes(zone.zoneCode)}
                            onChange={(e) => handleZoneChange(zone.zoneCode, e.target.checked)}
                            disabled={isView}
                          />
                        }
                        label={zone.zoneName}
                        sx={{ display: 'block' }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* States */}
              {allowedZones.length > 0 && (
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Allowed States *
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => toggleSelectAllStates(e.target.checked)}
                            disabled={isView}
                          />
                        }
                        label="Select All"
                      />
                    </Box>
                    <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
                      {multiStates.map((state) => (
                        <FormControlLabel
                          key={state.stateCode}
                          control={
                            <Checkbox
                              checked={allowedStates.includes(state.stateCode)}
                              onChange={(e) => handleStateChange(state.stateCode, e.target.checked)}
                              disabled={isView}
                            />
                          }
                          label={state.stateName}
                          sx={{ display: 'block' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Cities */}
              {allowedStates.length > 0 && (
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Allowed Cities *
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => toggleSelectAllCities(e.target.checked)}
                            disabled={isView}
                          />
                        }
                        label="Select All"
                      />
                    </Box>
                    <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
                      {multiCities.map((city) => (
                        <FormControlLabel
                          key={city.cityCode}
                          control={
                            <Checkbox
                              checked={allowedCities.includes(city.cityCode)}
                              onChange={(e) => handleCityChange(city.cityCode, e.target.checked)}
                              disabled={isView}
                            />
                          }
                          label={city.cityName}
                          sx={{ display: 'block' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Pins */}
              {allowedCities.length > 0 && (
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Allowed Pins *
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => toggleSelectAllPins(e.target.checked)}
                            disabled={isView}
                          />
                        }
                        label="Select All"
                      />
                    </Box>
                    <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
                      {multiPins.map((pin) => (
                        <FormControlLabel
                          key={pin.pinCode}
                          control={
                            <Checkbox
                              checked={allowedPins.includes(pin.pinCode)}
                              onChange={(e) => handlePinChange(pin.pinCode, e.target.checked)}
                              disabled={isView}
                            />
                          }
                          label={pin.pinCodeNo}
                          sx={{ display: 'block' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Additional Emails */}
              <TextField
                fullWidth
                label="Email 1"
                type="email"
                value={formData.email1}
                onChange={(e) => setFormData({ ...formData, email1: e.target.value })}
                disabled={isView}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email 2"
                type="email"
                value={formData.email2}
                onChange={(e) => setFormData({ ...formData, email2: e.target.value })}
                disabled={isView}
                sx={{ mb: 2 }}
              />

              {/* Case Assignment Rules */}
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Case Assignment Rules
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Case Assignment Rules</InputLabel>
                <Select
                  multiple
                  value={ruleCode}
                  onChange={(e) => setRuleCode(e.target.value as string[])}
                  disabled={isView}
                  label="Case Assignment Rules"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const rule = caseAssignmentRules.find(r => r.ruleCode === value);
                        return <Chip key={value} label={rule?.ruleName} size="small" />;
                      })}
                    </Box>
                  )}
                >
                  {caseAssignmentRules.map((rule) => (
                    <MenuItem key={rule.ruleCode} value={rule.ruleCode}>
                      {rule.ruleName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          {!isView && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              }}
            >
              Submit
            </Button>
          )}
          <Button variant="outlined" onClick={handleCloseModal}>
            {isView ? 'Close' : 'Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgencyManagement;