import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import {
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { claimsService } from '../../../services/claims.service';
import { fetchMenuService } from '../../../utils/fetchmenu.service';

interface ReimClaim {
  investigationID: string;
  sbigClaimNo: string;
  tpaClaimNo: string;
  tpaName: string;
  corporateName?: string;
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
  acceptAssignId?: string;
}

interface TatDropdownItem {
  name: string;
  value: string;
}

const FieldReworkCasesReim: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [claims, setClaims] = useState<ReimClaim[]>([]);
  const [tatRange, setTatRange] = useState('');
  const [tatDropdownArray, setTatDropdownArray] = useState<TatDropdownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleName, setRoleName] = useState('');
  const [paginationModel, setPaginationModel] = useState({ pageSize: 50, page: 0 });

  useEffect(() => {
    const role = sessionStorage.getItem('roleName') || '';
    setRoleName(role);

    const tatItems = fetchMenuService.getReimDropDownItems();
    setTatDropdownArray(tatItems);

    getReworkClaims(role);
  }, []);

  const getReworkClaims = async (role?: string) => {
    try {
      setLoading(true);
      const currentRole = role || sessionStorage.getItem('roleName');
      let response: any;

      if (currentRole === 'Regional Manager') {
        // response = await claimsService.getReworkClaimsRegReim();
        response = await claimsService.fetchAgencyDeniedCases();
      } else if (currentRole === 'Agency Spoc') {
        // response = await claimsService.getReworkClaimsReim();
        response = await claimsService.fetchAgencyDeniedCases();
      }

      if (response?.statusCode === 0) {
        setClaims(response.payload);
      }
    } catch (error) {
      console.error('Error fetching rework claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCasesByTatRange = async (selectedTatRange: string) => {
    if (!selectedTatRange) {
      getReworkClaims();
      return;
    }

    try {
      setLoading(true);
      const currentRole = sessionStorage.getItem('roleName');
      let response: any;

      if (currentRole === 'Regional Manager') {
        // response = await claimsService.getReworkClaimsRegByTatReim(selectedTatRange);
        response = await claimsService.fetchAgencyDeniedCasesByTat(selectedTatRange);
      } else if (currentRole === 'Agency Spoc') {
        response = await claimsService.fetchAgencyDeniedCasesByTat(selectedTatRange);
        // response = await claimsService.getReworkClaimsByTatReim(selectedTatRange);
      }

      if (response?.statusCode === 0) {
        setClaims(response.payload);
      }
    } catch (error) {
      console.error('Error fetching claims by TAT:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTatRangeChange = (event: any) => {
    const value = event.target.value;
    setTatRange(value);
    getCasesByTatRange(value);
  };

  const handleViewClick = (investigationID: string, claim: ReimClaim) => {
    navigate(
      `/admin/regional-rework-form/${investigationID}?redirectTo=${location.pathname}&claimsType=reim&claimNo=${claim.tpaClaimNo}&sbigclaimno=${claim.sbigClaimNo}`,
      {
        state: {
          claimsType: 'reim',
          claimNo: claim.tpaClaimNo,
          sbigclaimno: claim.sbigClaimNo,
          acceptAssignId: claim.acceptAssignId
        }
      }
    );
  };

  const getTatColor = (tat: number): string => {
    if (tat >= 0 && tat <= 11) return theme.palette.success.main;
    if (tat >= 12 && tat <= 14) return theme.palette.info.main;
    if (tat === 15) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const columns: GridColDef[] = [
    {
      field: 'investigationID',
      headerName: 'Investigation No',
      width: 150,
      renderCell: (params) => (
        <Tooltip title="Click to view details">
          <Box
            onClick={() => handleViewClick(params.value, params.row)}
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {params.value}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'sbigClaimNo',
      headerName: 'SBIG Claim No',
      width: 150,
    },
    {
      field: 'tpaClaimNo',
      headerName: 'TPA Claim No',
      width: 150,
    },
    {
      field: 'tpaName',
      headerName: 'TPA Name',
      width: 180,
    },
    {
      field: 'corporateName',
      headerName: 'Corporate Name (only if GMC)',
      width: 200,
    },
    {
      field: 'policyCode',
      headerName: 'Policy No',
      width: 150,
    },
    {
      field: 'policyStartDate',
      headerName: 'Policy Start Date',
      width: 150,
      valueFormatter: (params: any) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString();
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
      width: 100,
      renderCell: (params: any) => (
        <Chip
          label={`${params.value} days`}
          size="small"
          sx={{
            bgcolor: alpha(getTatColor(params.value), 0.1),
            color: getTatColor(params.value),
            fontWeight: 700,
            borderRadius: '6px',
          }}
        />
      ),
    },
    {
      field: 'hospitalCity',
      headerName: 'City',
      width: 130,
    },
    {
      field: 'hospitalState',
      headerName: 'State',
      width: 130,
    },
    {
      field: 'claimAmount',
      headerName: 'Claim Amount',
      width: 130,
      valueFormatter: (params: any) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(params.value ?? 0);
      },
    },
    {
      field: 'proposerName',
      headerName: 'Proposer Name',
      width: 180,
    },
    {
      field: 'memberName',
      headerName: 'Patient Name',
      width: 180,
    },
    {
      field: 'memberAge',
      headerName: 'Age',
      width: 80,
    },
    {
      field: 'finalDiagnosis',
      headerName: 'Diagnosis',
      width: 200,
    },
    {
      field: 'admissionDate',
      headerName: 'DOA',
      width: 120,
      valueFormatter: (params: any) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString();
        }
        return '';
      },
    },
    {
      field: 'dischargeDate',
      headerName: 'DOD',
      width: 120,
      valueFormatter: (params: any) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString();
        }
        return '';
      },
    },
    {
      field: 'claimIntimationDate',
      headerName: 'DOI',
      width: 120,
      valueFormatter: (params: any) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString();
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
          label={params.value}
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
            onClick={() => handleViewClick(params.row.investigationID, params.row)}
          >
            <ViewIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading rework reimbursement cases...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* TAT Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 300 }}>
          <Select
            value={tatRange}
            onChange={handleTatRangeChange}
            displayEmpty
            size="small"
            sx={{
              bgcolor: 'background.paper',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
            }}
          >
            <MenuItem value="">
              <em>All Color Codes</em>
            </MenuItem>
            {tatDropdownArray.map((item, index) => (
              <MenuItem key={index} value={item.value}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Cases
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'secondary.main' }}>
              {claims.length}
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
                claims.reduce((sum, claim) => sum + (claim.claimAmount || 0), 0)
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
              {claims.length > 0
                ? (claims.reduce((sum, claim) => sum + claim.tat, 0) / claims.length).toFixed(1)
                : 0}{' '}
              days
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              High Priority (TAT {'>'} 15)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main' }}>
              {claims.filter(c => c.tat > 15).length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Data Grid */}
      <Card sx={{ height: 700 }}>
        <DataGrid
          rows={claims}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[25, 50, 100]}
          checkboxSelection
          getRowId={(row) => row.investigationID}
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
              background: 'linear-gradient(135deg, #FFA726 0%, #FF7043 100%)',
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

export default FieldReworkCasesReim;