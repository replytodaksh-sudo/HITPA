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
  Grid,
  TextField,
  Button,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { claimsService } from '../../../services/claims.service';

interface Claim {
  investigationID: string;
  sbigClaimNo: string;
  tpaClaimNo: string;
  tpaName: string;
  proposerName: string;
  policyCode: string;
  policyStartDate: string;
  hospitalName: string;
  tat: number;
  hospitalCity: string;
  hospitalState: string;
  claimAmount: number;
  patientName: string;
  memberAge: number;
  finalDiagnosis: string;
  dateOfIntimetion: string;
  admissionDate: string;
  dischargeDate: string;
  workflowStatus: string;
}

const CentralNewCasesReim: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(50);
  const [claimNo, setClaimNo] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  useEffect(() => {
    fetchTotalCount();
  }, []);

  useEffect(() => {
    fetchClaims(paginationModel.page + 1, paginationModel.pageSize);
  }, [paginationModel]);

  const fetchClaims = async (pageNo: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await claimsService.getAllCentralNewReClaims(
        pageNo,
        pageSize
      );

      if (response.statusCode === 0) {
        setClaims(response.payload || []);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalCount = async () => {
    try {
      const response = await claimsService.getAllNewReCasesCentral();
      if (response.statusCode === 0) {
        setTotalCount(response.payload || 0);
      }
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  };

  const handleViewClick = (investigationID: string, claim: Claim) => {
    console.log("123456789", investigationID, claim)

    navigate(`/admin/central-new-cases/${investigationID}?redirectTo=${location.pathname}&claimsType=reim&claimNo=${claim.tpaClaimNo}&sbigclaimno=${claim.sbigClaimNo}`, {
      state: {
        redirectTo: location.pathname,
        claimsType: 'reim',
        claimNo: claim.tpaClaimNo,
        sbigclaimno: claim.sbigClaimNo,
      },
    });
  };

  const handleRowClick = (params: any) => {
      const claim = params?.row as Claim;
      navigate(`/admin/central-new-cases/${claim?.investigationID}?redirectTo=${location.pathname}&claimsType=reim&claimNo=${claim.tpaClaimNo}&sbigclaimno=${claim.sbigClaimNo}`)
    };

  const getTatColor = (tat: number): string => {
    if (tat <= 3) return theme.palette.success.main;
    if (tat <= 7) return theme.palette.warning.main;
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
      field: 'proposerName',
      headerName: 'Proposer Name',
      width: 180,
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
        if (params?.value) {
          return new Date(params?.value).toLocaleDateString();
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
      renderCell: (params) => (
        <Chip
          label={params?.value}
          size="small"
          sx={{
            bgcolor: alpha(getTatColor(params?.value), 0.1),
            color: getTatColor(params?.value),
            fontWeight: 700,
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
        }).format(params?.value || 0);
      },
    },
    {
      field: 'patientName',
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
      field: 'dateOfIntimetion',
      headerName: 'Date of Intimation',
      width: 150,
      valueFormatter: (params: any) => {
        if (params?.value) {
          return new Date(params?.value).toLocaleDateString();
        }
        return '';
      },
    },
    {
      field: 'admissionDate',
      headerName: 'DOA',
      width: 120,
      valueFormatter: (params: any) => {
        if (params?.value) {
          return new Date(params?.value).toLocaleDateString();
        }
        return '';
      },
    },
    {
      field: 'dischargeDate',
      headerName: 'Expected Discharge',
      width: 150,
      valueFormatter: (params: any) => {
        if (params?.value) {
          return new Date(params?.value).toLocaleDateString();
        }
        return '';
      },
    },
    {
      field: 'workflowStatus',
      headerName: 'Workflow Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params?.value}
          size="small"
          color="primary"
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
            color="primary"
            onClick={() => handleViewClick(params?.row?.investigationID, params?.row)}
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
          <CircularProgress size={60} thickness={4} sx={{ color: '#2E5A96' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading cashless cases...
          </Typography>
        </Box>
      </Box>
    );
  }


  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!claimNo.trim()) {
      return;
    }

    setLoading(true);
    try {
      const response = await claimsService.getAllCentralNewReCaseBySearchClaims(
        claimNo
      );

      if (response.statusCode === 0) {
        setClaims(response.payload || []);
      }
    } catch (error) {
      console.error('Error searching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setClaimNo('');
    fetchClaims(1, paginationModel.pageSize);
  };


  return (
    <Box>
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Cases
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
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
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, sm: 8, md: 6 }}>
              <TextField
                fullWidth
                label="Claim No."
                placeholder="Enter Claim No."
                value={claimNo}
                onChange={(e) => setClaimNo(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                autoComplete="off"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                disabled={loading || !claimNo.trim()}
                sx={{
                  background: loading || !claimNo.trim() ? '' : 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                Search
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card sx={{ height: 700 }}>
        <DataGrid
          rows={claims}
          columns={columns}
          pagination
          pageSizeOptions={[25, 50, 100]}
          // checkboxSelection
          rowCount={totalCount}
          // disableSelectionOnClick
          getRowId={(row) => row?.investigationID}
          loading={loading}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: theme.palette.divider,
            },
            '& .MuiDataGrid-columnHeaders': {
              background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
              color: '#7a7a7a',
              fontSize: '0.875rem',
              fontWeight: 700,
              borderRadius: 0,
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `2px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.primary.main, 0.02),
            },
          }}
        />
      </Card>
    </Box>
  );
};

export default CentralNewCasesReim;



// api/v1/claims/getAllCentralNewCasesBySearch?sbigClaimNo=100621000013-01
// api/v1/claims/getAllCentralNewCasesTotalCompleted -- this will show the total count
// api/v1/claims/getAllCentralNewCasesByPage?pageNo=1&pageSize=10'