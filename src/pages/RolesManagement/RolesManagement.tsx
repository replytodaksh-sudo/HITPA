// src/components/RolesManagement.tsx

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
  Select,
  MenuItem,
  IconButton,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

interface Permission {
  name: string;
  accessType?: 'dropdown' | 'checkboxes' | 'na';
  accessValue?: string;
  read?: boolean;
  write?: boolean;
  delete?: boolean;
  moderate?: boolean;
}

interface PermissionModule {
  title: string;
  isHeader?: boolean;
  permissions: Permission[];
}

const RolesManagement: React.FC = () => {
  const theme = useTheme();
  const [rolesData, setRolesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [userType, setUserType] = useState('');
  const [enableRole, setEnableRole] = useState(false);

  const dropdownOptions = [
    { label: 'Type', value: 'Type' },
    { label: 'All', value: 'All' },
    { label: 'Owned', value: 'Owned' },
  ];

  const userTypeOptions = [
    { label: 'Choose', value: '' },
    { label: 'Delegate Admin User', value: 'Delegate Admin User' },
    { label: 'Central Team User', value: 'Central Team User' },
    { label: 'Regional Team User', value: 'Regional Team User' },
    { label: 'External Team User', value: 'External Team User' },
  ];

  const initialPermissions: PermissionModule[] = [
    {
      title: 'INVESTIGATION',
      isHeader: true,
      permissions: [
        { name: 'Case assignment to Agency', accessType: 'dropdown', accessValue: 'Type' },
        { name: 'Case assignment to Internal team', accessType: 'dropdown', accessValue: 'Type' },
        { name: 'Case updates', accessType: 'dropdown', accessValue: 'Type' },
        { name: 'Re-assign case', accessType: 'dropdown', accessValue: 'Type' },
        { name: 'Delete Case', accessType: 'dropdown', accessValue: 'Type' },
      ],
    },
    {
      title: 'Case QC',
      isHeader: true,
      permissions: [
        { name: 'Accept/reject case submission by investigator', accessType: 'dropdown', accessValue: 'Type' },
        { name: 'Open for re-work', accessType: 'dropdown', accessValue: 'Type' },
        { name: 'Re-assign case', accessType: 'dropdown', accessValue: 'Type' },
        { name: 'Final Case closure', accessType: 'dropdown', accessValue: 'Type' },
      ],
    },
    {
      title: 'INVESTIGATION DATA HOUSE',
      isHeader: true,
      permissions: [],
    },
    {
      title: 'Core Master',
      isHeader: true,
      permissions: [
        { name: 'Caution/ blacklisted hospitals', accessType: 'checkboxes', read: false, write: false, delete: false, moderate: false },
        { name: 'Negative customers Marking', accessType: 'checkboxes', read: false, write: false, delete: false, moderate: false },
        { name: 'Policy tagging', accessType: 'checkboxes', read: false, write: false, delete: false, moderate: false },
        { name: 'Active agent tagging', accessType: 'checkboxes', read: false, write: false, delete: false, moderate: false },
        { name: 'Doctors tagging', accessType: 'checkboxes', read: false, write: false, delete: false, moderate: false },
        { name: 'pathologist tagging', accessType: 'checkboxes', read: false, write: false, delete: false, moderate: false },
        { name: 'lab tagging', accessType: 'checkboxes', read: false, write: false, delete: false, moderate: false },
        { name: 'chemist tagging', accessType: 'checkboxes', read: false, write: false, delete: false, moderate: false },
        { name: 'insured tagging', accessType: 'checkboxes', read: false, write: false, delete: false, moderate: false },
        { name: 'negative pin codes', accessType: 'checkboxes', read: false, write: false, delete: false, moderate: false },
        { name: 'negative agents', accessType: 'checkboxes', read: false, write: false, delete: false, moderate: false },
        { name: 'ICD tagging', accessType: 'checkboxes', read: false, write: false, delete: false, moderate: false },
      ],
    },
    {
      title: 'Reports',
      isHeader: true,
      permissions: [
        { name: 'Investigation Dump - Claims/New Business (Open and closed cases)', accessType: 'dropdown', accessValue: 'Type' },
        { name: 'Case Type wise reports', accessType: 'dropdown', accessValue: 'Type' },
        { name: 'Manager (regional user) wise investigation reports', accessType: 'dropdown', accessValue: 'Type' },
        { name: 'Vendor (Agency) wise Investigation Reports', accessType: 'dropdown', accessValue: 'Type' },
        { name: 'Depanelled / blacklisted / caution hospital report and dump', accessType: 'dropdown', accessValue: 'Type' },
        { name: 'Fraud Monitoring', accessType: 'dropdown', accessValue: 'Type' },
      ],
    },
  ];

  const [permissions, setPermissions] = useState<PermissionModule[]>(initialPermissions);

  useEffect(() => {
    loadRolesData();
  }, []);

  const loadRolesData = () => {
    // Mock data - replace with actual API call
    setRolesData([
      { id: 1, role: 'Admin', userType: 'Central Team User', status: 'Active' },
      { id: 2, role: 'Manager', userType: 'Regional Team User', status: 'Active' },
    ]);
  };

  const handlePermissionDropdownChange = (moduleIndex: number, permIndex: number, value: string) => {
    const updated = [...permissions];
    updated[moduleIndex].permissions[permIndex].accessValue = value;
    setPermissions(updated);
  };

  const handlePermissionCheckboxChange = (
    moduleIndex: number,
    permIndex: number,
    field: 'read' | 'write' | 'delete' | 'moderate',
    checked: boolean
  ) => {
    const updated = [...permissions];
    updated[moduleIndex].permissions[permIndex][field] = checked;
    setPermissions(updated);
  };

  const handleOpenModal = () => {
    clearForm();
    setIsEdit(false);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    clearForm();
  };

  const clearForm = () => {
    setRoleName('');
    setUserType('');
    setEnableRole(false);
    setPermissions(JSON.parse(JSON.stringify(initialPermissions)));
  };

  const handleSubmit = () => {
    console.log('Submitting role:', {
      roleName,
      userType,
      enableRole,
      permissions,
    });

    // Here you would make API call to save the role
    // await roleService.createRole({ roleName, userType, enableRole, permissions });

    handleCloseModal();
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      width: 80,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'userType',
      headerName: 'User Type',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
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
          <IconButton size="small" sx={{ color: 'primary.main' }} title="Edit">
            <EditIcon />
          </IconButton>
          <IconButton size="small" sx={{ color: 'error.main' }} title="Delete">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Add Button */}
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

      {/* DataGrid Table */}
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rolesData}
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

      {/* Modal Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
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
          <Typography variant="h6">New Role</Typography>
          <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Box sx={{ py: 2 }}>
            {/* Role Name and User Type */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Role Name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>User type*</InputLabel>
                  <Select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    label="User type*"
                  >
                    {userTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Permissions Section Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
                pb: 1,
                borderBottom: '2px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Module / Components Permissions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Note: Module/component may differ during the development.
              </Typography>
            </Box>

            {/* Permissions Table */}
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell
                      sx={{ width: '40%', fontWeight: 'bold', border: '1px solid #ccc' }}
                    >
                      Module/Component
                    </TableCell>
                    <TableCell
                      sx={{
                        width: '15%',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        border: '1px solid #ccc',
                      }}
                    >
                      Access Type
                    </TableCell>
                    <TableCell
                      sx={{
                        width: '11.25%',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        border: '1px solid #ccc',
                      }}
                    >
                      Read
                    </TableCell>
                    <TableCell
                      sx={{
                        width: '11.25%',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        border: '1px solid #ccc',
                      }}
                    >
                      Write
                    </TableCell>
                    <TableCell
                      sx={{
                        width: '11.25%',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        border: '1px solid #ccc',
                      }}
                    >
                      Delete
                    </TableCell>
                    <TableCell
                      sx={{
                        width: '11.25%',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        border: '1px solid #ccc',
                      }}
                    >
                      Moderate
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissions.map((module, moduleIndex) => (
                    <React.Fragment key={moduleIndex}>
                      {/* Module Header Row */}
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          sx={{
                            fontWeight: 700,
                            backgroundColor: '#f9f9f9',
                            border: '1px solid #ccc',
                          }}
                        >
                          {module.title}
                        </TableCell>
                      </TableRow>

                      {/* Permission Rows */}
                      {module.permissions.map((perm, permIndex) => (
                        <TableRow key={permIndex}>
                          <TableCell sx={{ border: '1px solid #ccc' }}>
                            {perm.name}
                          </TableCell>

                          {/* Access Type Column */}
                          <TableCell sx={{ border: '1px solid #ccc', textAlign: 'center' }}>
                            {perm.accessType === 'dropdown' ? (
                              <FormControl size="small" fullWidth>
                                <Select
                                  value={perm.accessValue || 'Type'}
                                  onChange={(e) =>
                                    handlePermissionDropdownChange(
                                      moduleIndex,
                                      permIndex,
                                      e.target.value
                                    )
                                  }
                                >
                                  {dropdownOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            ) : perm.accessType === 'checkboxes' ? (
                              <Typography variant="body2">N/A</Typography>
                            ) : null}
                          </TableCell>

                          {/* Read, Write, Delete, Moderate Columns */}
                          {perm.accessType === 'checkboxes' ? (
                            <>
                              <TableCell sx={{ border: '1px solid #ccc', textAlign: 'center' }}>
                                <Checkbox
                                  checked={perm.read || false}
                                  onChange={(e) =>
                                    handlePermissionCheckboxChange(
                                      moduleIndex,
                                      permIndex,
                                      'read',
                                      e.target.checked
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell sx={{ border: '1px solid #ccc', textAlign: 'center' }}>
                                <Checkbox
                                  checked={perm.write || false}
                                  onChange={(e) =>
                                    handlePermissionCheckboxChange(
                                      moduleIndex,
                                      permIndex,
                                      'write',
                                      e.target.checked
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell sx={{ border: '1px solid #ccc', textAlign: 'center' }}>
                                <Checkbox
                                  checked={perm.delete || false}
                                  onChange={(e) =>
                                    handlePermissionCheckboxChange(
                                      moduleIndex,
                                      permIndex,
                                      'delete',
                                      e.target.checked
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell sx={{ border: '1px solid #ccc', textAlign: 'center' }}>
                                <Checkbox
                                  checked={perm.moderate || false}
                                  onChange={(e) =>
                                    handlePermissionCheckboxChange(
                                      moduleIndex,
                                      permIndex,
                                      'moderate',
                                      e.target.checked
                                    )
                                  }
                                />
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell sx={{ border: '1px solid #ccc' }}></TableCell>
                              <TableCell sx={{ border: '1px solid #ccc' }}></TableCell>
                              <TableCell sx={{ border: '1px solid #ccc' }}></TableCell>
                              <TableCell sx={{ border: '1px solid #ccc' }}></TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Enable Checkbox */}
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enableRole}
                    onChange={(e) => setEnableRole(e.target.checked)}
                  />
                }
                label="Enable"
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolesManagement;