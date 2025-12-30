import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Visibility as ViewIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { claimsService } from '../../../services/claims.service';
import { fetchMenuService } from '../../../utils/fetchmenu.service';

// ============================================================================
// INTERFACES
// ============================================================================

interface ReimClaim {
  investigationID: string;
  sbigClaimNo: string;
  tpaClaimNo: string;
  tpaName: string;
  policyCode: string;
  policyStartDate: string;
  hospitalName: string;
  tat: number;
  hospitalCity: string;
  hospitalState: string;
  claimAmount: number;
  proposerName: string;
  memberName: string;
  memberAge: number;
  finalDiagnosis: string;
  admissionDate: string;
  dischargeDate: string;
  claimIntimationDate: string;
  workflowStatus: string;
  acceptAssignId: string;
}

interface TATDropdownItem {
  name: string;
  value: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const FieldAssignedToAgencyReim: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const roleName = sessionStorage.getItem('roleName') || '';

  // State
  const [reimClaims, setReimClaims] = useState<ReimClaim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<ReimClaim[]>([]);
  const [tatRange, setTatRange] = useState<string>('');
  const [tatDropdownArray, setTatDropdownArray] = useState<TATDropdownItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 50, page: 0 });

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  useEffect(() => {
    // Load TAT dropdown items
    const dropdownItems = fetchMenuService.getReimDropDownItems();
    setTatDropdownArray(dropdownItems);

    // Load initial data
    loadClaims();
  }, []);

  useEffect(() => {
    // Apply TAT filter if selected
    if (tatRange && reimClaims.length > 0) {
      setFilteredClaims(reimClaims);
    } else {
      setFilteredClaims(reimClaims);
    }
  }, [reimClaims]);

  // ============================================================================
  // API CALLS
  // ============================================================================

  const loadClaims = async () => {
    setLoading(true);

    try {
      let response;

      if (roleName === 'Regional Manager') {
        response = await claimsService.getReclaimsAssignedToAgencyCases();
      } else if (roleName === 'Agency Spoc') {
        response = await claimsService.getReclaimsAssignedToFOCases();
      } else {
        throw new Error('Invalid role');
      }

      if (response.statusCode === 0) {
        setReimClaims(response.payload);
        setFilteredClaims(response.payload);
      }
    } catch (err: any) {
      console.error('Load claims error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCasesByTatRange = async (tatValue: string) => {
    if (!tatValue) {
      loadClaims();
      return;
    }

    setLoading(true);

    try {
      let response: any;

      if (roleName === 'Regional Manager') {
        response = await claimsService.getReclaimsAssignedToAgencyCasesByTat(tatValue);
      } else if (roleName === 'Agency Spoc') {
        response = await claimsService.getReclaimsAssignedToFOCasesByTat(tatValue);
      } else {
        throw new Error('Invalid role');
      }

      if (response.statusCode === 0) {
        setReimClaims(response.payload);
        setFilteredClaims(response.payload);
      }
    } catch (err: any) {
      console.error('Filter claims error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleTatChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setTatRange(value);
    getCasesByTatRange(value);
  };

  const handleViewClick = (investigationID: string, claim: ReimClaim) => {
    navigate(
      `/admin/assignedAgencyCashlessDetails/${investigationID}?claimsType=reim&claimNo=${claim.tpaClaimNo}&sbigclaimno=${claim.sbigClaimNo}&acceptAssignId=${claim.acceptAssignId}`
    );
  };

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getTatColor = (tat: number): string => {
    if (tat >= 0 && tat <= 11) {
      return theme.palette.success.main;
    } else if (tat >= 12 && tat <= 14) {
      return theme.palette.info.main;
    } else if (tat === 15) {
      return theme.palette.warning.main;
    } else {
      return theme.palette.error.main;
    }
  };

  const getTatLabel = (tat: number): string => {
    if (tat >= 0 && tat <= 11) return 'Good';
    if (tat >= 12 && tat <= 14) return 'Fair';
    if (tat === 15) return 'Warning';
    return 'Critical';
  };

  // ============================================================================
  // DATAGRID COLUMNS
  // ============================================================================

  const columns: GridColDef[] = [
    {
      field: 'investigationID',
      headerName: 'Investigation No',
      width: 150,
      renderCell: (params) => (
        <Tooltip title="Click to view details">
          <Box
            onClick={() => handleViewClick(params?.value, params?.row)}
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {params?.value}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'sbigClaimNo',
      headerName: 'Claim No',
      width: 140,
    },
    {
      field: 'tpaClaimNo',
      headerName: 'TPA Claim No',
      width: 140,
    },
    {
      field: 'tpaName',
      headerName: 'TPA Name',
      width: 150,
    },
    {
      field: 'corporateName',
      headerName: 'Corporate Name (GMC)',
      width: 180,
      valueGetter: () => '',
    },
    {
      field: 'policyCode',
      headerName: 'Policy No',
      width: 150,
    },
    {
      field: 'policyStartDate',
      headerName: 'Policy Start Date',
      width: 140,
      valueFormatter: (params: any) => {
        if (params?.value) {
          return new Date(params?.value).toLocaleDateString('en-IN');
        }
        return '';
      },
    },
    {
      field: 'hospitalName',
      headerName: 'Hospital Name',
      width: 200,
    },
    {
      field: 'tat',
      headerName: 'TAT',
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={`${params?.value} days`}
          size="small"
          sx={{
            bgcolor: alpha(getTatColor(params?.value), 0.1),
            color: getTatColor(params?.value),
            fontWeight: 700,
            borderLeft: `4px solid ${getTatColor(params?.value)}`,
          }}
        />
      ),
    },
    {
      field: 'hospitalCity',
      headerName: 'City',
      width: 120,
    },
    {
      field: 'hospitalState',
      headerName: 'State',
      width: 120,
    },
    {
      field: 'claimAmount',
      headerName: 'Claim Amount',
      width: 130,
      type: 'number',
      valueFormatter: (params: any) => {
        return params?.value
          ? new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(params?.value)
          : '';
      },
    },
    {
      field: 'proposerName',
      headerName: 'Proposer Name',
      width: 150,
    },
    {
      field: 'memberName',
      headerName: 'Patient Name',
      width: 150,
    },
    {
      field: 'memberAge',
      headerName: 'Age',
      width: 80,
      type: 'number',
    },
    {
      field: 'finalDiagnosis',
      headerName: 'Diagnosis',
      width: 200,
    },
    {
      field: 'admissionDate',
      headerName: 'DOA',
      width: 110,
      valueFormatter: (params: any) => {
        if (params?.value) {
          return new Date(params?.value).toLocaleDateString('en-IN');
        }
        return '';
      },
    },
    {
      field: 'dischargeDate',
      headerName: 'DOD',
      width: 110,
      valueFormatter: (params: any) => {
        if (params?.value) {
          return new Date(params?.value).toLocaleDateString('en-IN');
        }
        return '';
      },
    },
    {
      field: 'claimIntimationDate',
      headerName: 'DOI',
      width: 110,
      valueFormatter: (params: any) => {
        if (params?.value) {
          return new Date(params?.value).toLocaleDateString('en-IN');
        }
        return '';
      },
    },
    {
      field: 'workflowStatus',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params?.value}
          size="small"
          color="secondary"
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="View Details">
          <IconButton
            size="small"
            color="secondary"
            onClick={() => handleViewClick(params?.row?.investigationID, params?.row)}
          >
            <ViewIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading && reimClaims.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#2E5A96' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading reimbursement cases...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Cases
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'secondary.main' }}>
              {filteredClaims.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Claim Amount
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(
                filteredClaims.reduce((sum, claim) => sum + (claim.claimAmount || 0), 0)
              )}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Avg TAT
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>
              {filteredClaims.length > 0
                ? (filteredClaims.reduce((sum, claim) => sum + claim.tat, 0) / filteredClaims.length).toFixed(1)
                : 0}{' '}
              days
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* TAT Filter */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FilterIcon color="action" />
        <FormControl sx={{ minWidth: 300 }} size="small">
          <Select
            value={tatRange}
            onChange={handleTatChange}
            displayEmpty
          >
            <MenuItem value="">
              <em>All TAT Ranges</em>
            </MenuItem>
            {tatDropdownArray.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {tatRange && (
          <Chip
            label={`Filtered: ${tatRange}`}
            onDelete={() => {
              setTatRange('');
              loadClaims();
            }}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* Data Grid */}
      <Card sx={{ height: 700 }}>
        <DataGrid
          rows={filteredClaims}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[25, 50, 100]}
          checkboxSelection
          getRowId={(row) => row?.investigationID}
          loading={loading}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: theme.palette.divider,
            },
            '& .MuiDataGrid-columnHeaders': {
              background: 'linear-gradient(135deg, #6F62C2 0%, #8B7ED6 100%)',
              color: '#7a7a7a',
              fontSize: '0.875rem',
              fontWeight: 700,
              borderRadius: 0,
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: alpha(theme.palette.secondary.main, 0.05),
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `2px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.secondary.main, 0.02),
            },
          }}
        />
      </Card>
    </Box>
  );
};

export default FieldAssignedToAgencyReim;