import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
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
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  LockReset as LockResetIcon,
} from '@mui/icons-material';
import { userService } from '../../services/user.service';
import DropdownService from '../../services/dropdown.service';

interface User {
  userCode: string;
  employeeCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  userType: string;
  emailId: string;
  mobileNo: string;
}

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [selectedUserCode, setSelectedUserCode] = useState('');

  // Dropdown data
  const [userTypes, setUserTypes] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  // Cascading dropdowns
  const [multiStates, setMultiStates] = useState<any[]>([]);
  const [multiCities, setMultiCities] = useState<any[]>([]);
  const [multiPins, setMultiPins] = useState<any[]>([]);

  // Form data
  const [formData, setFormData] = useState({
    sbigEmpId: '',
    userType: '',
    firstName: '',
    middleName: '',
    lastName: '',
    emailId: '',
    mobileNo: '',
    address1: '',
    address2: '',
    stateCode: '',
    cityCode: '',
    pinCode: '',
    userEnable: false,
  });

  // Selected areas and roles
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Password reset
  const [resetUsername, setResetUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordBox, setShowPasswordBox] = useState(false);

  // Role name from session
  const [roleName, setRoleName] = useState('');
  const [displaySec, setDisplaySec] = useState('superSec');

  useEffect(() => {
    const storedRole = sessionStorage.getItem('roleName');
    setRoleName(storedRole || '');
    setDisplaySec(storedRole === 'Agency Spoc' ? 'agencySec' : 'superSec');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers();
      console.log("users response", response)
      if (response.statusCode === 0) {
        setUsers(response.payload);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTypes = async () => {
    const response = await DropdownService.getUserType();
    if (response.statusCode === 0) {
      setUserTypes(response.payload || []);
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

  const fetchAssociatedRoles = async (userTypeCode: string) => {
    const response = await DropdownService.getRoles(userTypeCode);
    if (response.statusCode === 0) {
      setRoles(response.payload || []);
    }
  };

  // Cascading selections
  const fetchStatesByZones = async (zoneCodes: string[]) => {
    if (zoneCodes.length === 0) {
      setMultiStates([]);
      return;
    }
    const response = await DropdownService.getStatesByZones( zoneCodes);
    if (response.statusCode === 0) {
      setMultiStates(response.payload || []);
    }
  };

  const fetchCitiesByStates = async (stateCodes: string[]) => {
    if (stateCodes.length === 0) {
      setMultiCities([]);
      return;
    }
    const response = await DropdownService.getCitiesByStates( stateCodes);
    if (response.statusCode === 0) {
      setMultiCities(response.payload || []);
    }
  };

  const fetchPinsByCities = async (cityCodes: string[]) => {
    if (cityCodes.length === 0) {
      setMultiPins([]);
      return;
    }
    const response = await DropdownService.getPinsByCities( cityCodes);
    if (response.statusCode === 0) {
      setMultiPins(response.payload || []);
    }
  };

  // Modal handlers
  const handleOpenModal = async () => {
    resetForm();
    setOpenModal(true);
    await Promise.all([fetchUserTypes(), fetchZones(), fetchStates()]);
  };

  const handleEditUser = async (userCode: string) => {
    resetForm();
    setIsEdit(true);
    setSelectedUserCode(userCode);
    await Promise.all([fetchUserTypes(), fetchZones(), fetchStates()]);
    await populateUser(userCode);
    setOpenModal(true);
  };

  const handleViewUser = async (userCode: string) => {
    resetForm();
    setIsView(true);
    await Promise.all([fetchUserTypes(), fetchZones(), fetchStates()]);
    await populateUser(userCode);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      sbigEmpId: '',
      userType: '',
      firstName: '',
      middleName: '',
      lastName: '',
      emailId: '',
      mobileNo: '',
      address1: '',
      address2: '',
      stateCode: '',
      cityCode: '',
      pinCode: '',
      userEnable: false,
    });
    setSelectedZones([]);
    setSelectedStates([]);
    setSelectedCities([]);
    setSelectedPincodes([]);
    setSelectedRoles([]);
    setMultiStates([]);
    setMultiCities([]);
    setMultiPins([]);
    setCities([]);
    setRoles([]);
    setIsEdit(false);
    setIsView(false);
    setSelectedUserCode('');
  };

  const populateUser = async (userCode: string) => {
    const response = await userService.getUserByCode(userCode);
    console.log("Asdf", response)
    if (response.statusCode === 0) {
      const data = response.payload;

      setFormData({
        sbigEmpId: data.employeeCode || '',
        userType: data.userType || '',
        firstName: data.firstName || '',
        middleName: data.middleName || '',
        lastName: data.lastName || '',
        emailId: data.emailId || '',
        mobileNo: data.mobileNo || '',
        address1: data.addressLine1 || '',
        address2: data.addressLine2 || '',
        stateCode: data.stateCode || '',
        cityCode: data.cityCode || '',
        pinCode: data.pinCode || '',
        userEnable: data.userEnable || false,
      });

      // Fetch associated roles
      if (data.userType) {
        await fetchAssociatedRoles(data.userType);
      }

      // Set selected roles
      if (data.roleDetails) {
        setSelectedRoles(data.roleDetails.map((r: any) => r.roleCode));
      }

      // Set zones, states, cities, pincodes if user type requires them
      if (data.userType !== 'CO0015') {
        if (data.zones) {
          setSelectedZones(data.zones.map((z: any) => z.zoneCode));
          await fetchStatesByZones(data.zones.map((z: any) => z.zoneCode));
        }
        if (data.states) {
          setSelectedStates(data.states.map((s: any) => s.stateCode));
          await fetchCitiesByStates(data.states.map((s: any) => s.stateCode));
        }
        if (data.cities) {
          setSelectedCities(data.cities.map((c: any) => c.cityCode));
          await fetchPinsByCities(data.cities.map((c: any) => c.cityCode));
        }
        if (data.pincodes) {
          setSelectedPincodes(data.pincodes.map((p: any) => p.pinCode));
        }
      }

      // Fetch cities for address dropdown
      if (data.stateCode) {
        await fetchCities(data.stateCode);
      }
    }
  };

  const handleUserTypeChange = async (userTypeCode: string) => {
    setFormData({ ...formData, userType: userTypeCode });
    await fetchAssociatedRoles(userTypeCode);
    setSelectedRoles([]);

    // Clear zone/state/city/pin if not required
    if (userTypeCode !== 'CO0018' && userTypeCode !== 'CO0014') {
      setSelectedZones([]);
      setSelectedStates([]);
      setSelectedCities([]);
      setSelectedPincodes([]);
      setMultiStates([]);
      setMultiCities([]);
      setMultiPins([]);
    }
  };

  const handleZoneChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const zones = typeof value === 'string' ? value.split(',') : value;
    setSelectedZones(zones);
    fetchStatesByZones(zones);

    // Clear child selections
    setSelectedStates([]);
    setSelectedCities([]);
    setSelectedPincodes([]);
    setMultiCities([]);
    setMultiPins([]);
  };

  const handleStateChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const states = typeof value === 'string' ? value.split(',') : value;
    setSelectedStates(states);
    fetchCitiesByStates(states);

    // Clear child selections
    setSelectedCities([]);
    setSelectedPincodes([]);
    setMultiPins([]);
  };

  const handleCityChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const cities = typeof value === 'string' ? value.split(',') : value;
    setSelectedCities(cities);
    fetchPinsByCities(cities);

    // Clear child selections
    setSelectedPincodes([]);
  };

  const handlePincodeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const pincodes = typeof value === 'string' ? value.split(',') : value;
    setSelectedPincodes(pincodes);
  };

  const handleRoleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const roles = typeof value === 'string' ? value.split(',') : value;
    setSelectedRoles(roles);
  };

  // Submit handler
  const handleSubmit = async () => {
    const userModel = {
      employeeCode: formData.sbigEmpId,
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      emailId: formData.emailId,
      mobileNo: formData.mobileNo,
      addressLine1: formData.address1,
      addressLine2: formData.address2,
      stateCode: formData.stateCode,
      cityCode: formData.cityCode,
      pinCode: formData.pinCode,
      userName: formData.sbigEmpId,
      password: formData.sbigEmpId,
      roleCodes: selectedRoles,
      zones: selectedZones,
      states: selectedStates,
      cities: selectedCities,
      pincodes: selectedPincodes,
    };

    try {
      let response;
      if (isEdit) {
        response = await userService.editUser({
          ...userModel,
          userCode: selectedUserCode,
        });
      } else {
        response = await userService.addUser(userModel);
      }

      if (response.statusCode === 0) {
        handleCloseModal();
        fetchUsers();
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Password reset handlers
  const handleOpenPasswordModal = (username: string) => {
    setResetUsername(username);
    setNewPassword('');
    setShowPasswordBox(false);
    setOpenPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
    setResetUsername('');
    setNewPassword('');
    setShowPasswordBox(false);
  };

  const verifyPassword = async () => {
    const response = await userService.verifyPassword(resetUsername);
    if (response.statusCode === 0) {
      setShowPasswordBox(true);
    } else {
      alert(response.message);
    }
  };

  const resetPassword = async () => {
    const response = await userService.resetPassword(resetUsername, newPassword);
    if (response.statusCode === 0) {
      alert(response.message);
      handleClosePasswordModal();
    } else {
      alert(response.message);
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', width: 70 },
    { field: 'employeeCode', headerName: 'Emp ID', width: 120 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <span>{params.row?.firstName} {params.row?.middleName || ''} {params.row?.lastName}</span>
      )
      //   valueGetter: (params: any) =>
      // `${params.row?.firstName} ${params.row?.middleName || ''} ${params.row?.lastName}`.trim(),
    },
    { field: 'userType', headerName: 'User Type', width: 150 },
    { field: 'emailId', headerName: 'Email', width: 200 },
    { field: 'mobileNo', headerName: 'Mobile', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => handleViewUser(params.row.userCode)}
            sx={{ color: 'primary.main' }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEditUser(params.row.userCode)}
            sx={{ color: 'success.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleOpenPasswordModal(params.row.employeeCode)}
            sx={{ color: 'warning.main' }}
          >
            <LockResetIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows = users.map((user, index) => ({
    id: index + 1,
    ...user,
  }));

  const shouldShowZoneCityPinFields =
    formData.userType === 'CO0018' || formData.userType === 'CO0014';

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            },
          }}
        >
          Add New User
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

      {/* User Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
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
            {isEdit ? 'Edit User' : isView ? 'User Details' : 'New User'}
          </Typography>
          <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* Employee ID */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={displaySec === 'agencySec' ? 'Agency EMP ID' : 'EMP ID'}
                required
                value={formData.sbigEmpId}
                onChange={(e) => setFormData({ ...formData, sbigEmpId: e.target.value })}
                disabled={isView || isEdit}
              />
            </Grid>

            {/* User Type */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>User Type</InputLabel>
                <Select
                  value={formData.userType}
                  onChange={(e) => handleUserTypeChange(e.target.value)}
                  disabled={isView}
                  label="User Type"
                >
                  {userTypes.map((type) => (
                    <MenuItem key={type.userTypeCode} value={type.userTypeCode}>
                      {type.userType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Zone (conditional) */}
            {shouldShowZoneCityPinFields && (
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Zone</InputLabel>
                  <Select
                    multiple
                    value={selectedZones}
                    onChange={handleZoneChange}
                    disabled={isView}
                    input={<OutlinedInput label="Zone" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const zone = zones.find(z => z.zoneCode === value);
                          return <Chip key={value} label={zone?.zoneName} size="small" />;
                        })}
                      </Box>
                    )}
                  >
                    {zones.map((zone) => (
                      <MenuItem key={zone.zoneCode} value={zone.zoneCode}>
                        <Checkbox checked={selectedZones.indexOf(zone.zoneCode) > -1} />
                        {zone.zoneName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* State (conditional) */}
            {shouldShowZoneCityPinFields && selectedZones.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>State</InputLabel>
                  <Select
                    multiple
                    value={selectedStates}
                    onChange={handleStateChange}
                    disabled={isView}
                    input={<OutlinedInput label="State" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const state = multiStates.find(s => s.stateCode === value);
                          return <Chip key={value} label={state?.stateName} size="small" />;
                        })}
                      </Box>
                    )}
                  >
                    {multiStates.map((state) => (
                      <MenuItem key={state.stateCode} value={state.stateCode}>
                        <Checkbox checked={selectedStates.indexOf(state.stateCode) > -1} />
                        {state.stateName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* City (conditional) */}
            {shouldShowZoneCityPinFields && selectedStates.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>City</InputLabel>
                  <Select
                    multiple
                    value={selectedCities}
                    onChange={handleCityChange}
                    disabled={isView}
                    input={<OutlinedInput label="City" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const city = multiCities.find(c => c.cityCode === value);
                          return <Chip key={value} label={city?.cityName} size="small" />;
                        })}
                      </Box>
                    )}
                  >
                    {multiCities.map((city) => (
                      <MenuItem key={city.cityCode} value={city.cityCode}>
                        <Checkbox checked={selectedCities.indexOf(city.cityCode) > -1} />
                        {city.cityName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Pincode (conditional) */}
            {shouldShowZoneCityPinFields && selectedCities.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Pincode</InputLabel>
                  <Select
                    multiple
                    value={selectedPincodes}
                    onChange={handlePincodeChange}
                    disabled={isView}
                    input={<OutlinedInput label="Pincode" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {multiPins.map((pin: any) => (
                      <MenuItem key={pin.pinCode} value={pin.pinCode}>
                        <Checkbox checked={selectedPincodes.indexOf(pin.pinCode) > -1} />
                        {pin.pinCodeNo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Associated Roles */}
            {formData.userType && (
              <Grid size={{ xs: 12 }}>
                <Card sx={{ boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      Associated Roles *
                    </Typography>
                    <FormControl fullWidth required>
                      <InputLabel>Roles</InputLabel>
                      <Select
                        multiple
                        value={selectedRoles}
                        onChange={handleRoleChange}
                        disabled={isView}
                        input={<OutlinedInput label="Roles" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => {
                              const role = roles.find(r => r.roleCode === value);
                              return <Chip key={value} label={role?.roleName} size="small" />;
                            })}
                          </Box>
                        )}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.roleCode} value={role.roleCode}>
                            <Checkbox checked={selectedRoles.indexOf(role.roleCode) > -1} />
                            {role.roleName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Name Fields */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={isView}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Middle Name"
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                disabled={isView}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={isView}
              />
            </Grid>

            {/* Email and Mobile */}
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                required
                value={formData.emailId}
                onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
                disabled={isView}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Mobile No"
                required
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                disabled={isView}
                inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
              />
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address Line 1"
                required
                value={formData.address1}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                disabled={isView}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Address Line 2"
                value={formData.address2}
                onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                disabled={isView}
              />
            </Grid>

            {/* State, City, Pincode for Address */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth required>
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
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth required>
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
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Pincode"
                required
                value={formData.pinCode}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                disabled={isView}
                inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
              />
            </Grid>

            {/* Enable Checkbox */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.userEnable}
                    onChange={(e) => setFormData({ ...formData, userEnable: e.target.checked })}
                    disabled={isView}
                  />
                }
                label="Enable"
              />
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

      {/* Password Reset Modal */}
      <Dialog
        open={openPasswordModal}
        onClose={handleClosePasswordModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
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
          <Typography variant="h6">Reset Password</Typography>
          <IconButton onClick={handleClosePasswordModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 10 }}>
              <TextField
                fullWidth
                label="User Name"
                value={resetUsername}
                disabled
              />
            </Grid>
            <Grid size={{ xs: 2 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={verifyPassword}
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Verify
              </Button>
            </Grid>

            {showPasswordBox && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter Password..."
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={resetPassword}
            disabled={!showPasswordBox || !newPassword}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              },
            }}
          >
            Submit
          </Button>
          <Button variant="outlined" onClick={handleClosePasswordModal}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;