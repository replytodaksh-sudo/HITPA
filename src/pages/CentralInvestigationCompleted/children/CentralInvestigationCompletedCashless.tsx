import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Chip,
} from '@mui/material';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import claimsService from '../../../services/claims.service';

// ==================== INTERFACES ====================
interface Claim {
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
}

const CentralInvestigationCompletedCashless: React.FC = () => {
  const navigate = useNavigate();
  
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [claimNo, setClaimNo] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  // Fetch total count on mount
  useEffect(() => {
    fetchTotalCount();
  }, []);

  // Fetch data on mount and pagination change
  useEffect(() => {
    fetchClaims(paginationModel.page + 1, paginationModel.pageSize);
  }, [paginationModel]);

  // Fetch total count
  const fetchTotalCount = async () => {
    try {
      const response = await claimsService.getAllCentralInvestigationTotalCompletedReClaims();
      if (response.statusCode === 0) {
        setTotalCount(response.payload || 0);
      }
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  };

  // Fetch claims by page
  const fetchClaims = async (pageNo: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await claimsService.getAllCentralInvestigationCompletedByPageReClaims(
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

  // Handle search
  const handleSearch = async () => {
    if (!claimNo.trim()) {
      return;
    }

    setLoading(true);
    try {
      const response = await claimsService.getAllCentralInvestigationCompletedBySearchReClaims(
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

  // Handle reset
  const handleReset = () => {
    setClaimNo('');
    fetchClaims(1, paginationModel.pageSize);
  };

  // Handle row click
  const handleRowClick = (params: GridRowParams) => {
    const claim = params.row as Claim;
    navigate(
      `/admin/central-completed-form/${claim.investigationID}?claimsType=reim&claimNo=${claim.tpaClaimNo}&sbigclaimno=${claim.sbigClaimNo}`
    );
  };

  // Handle Enter key in search
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Define columns
  const columns: GridColDef[] = [
    {
      field: 'investigationID',
      headerName: 'Investigation No',
      width: 180,
      renderCell: (params) => (
        <Box
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {params.value}
        </Box>
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
      width: 150,
    },
    {
      field: 'corporateName',
      headerName: 'Corporate Name (only if GMC)',
      width: 200,
      renderCell: () => <Typography variant="body2">-</Typography>,
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
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          ₹{params.value?.toLocaleString('en-IN')}
        </Typography>
      ),
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
      width: 130,
    },
    {
      field: 'dischargeDate',
      headerName: 'DOD',
      width: 130,
    },
    {
      field: 'claimIntimationDate',
      headerName: 'DOI',
      width: 130,
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
      renderCell: (params:any) => (
        <Tooltip title="View Details">
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(params);
            }}
          >
            <ViewIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      {/* Search Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, sm: 8, md:6 }}>
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
            <Grid size={{ xs: 12, sm: 4, md:2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                disabled={loading || !claimNo.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                Search
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md:2 }}>
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

      {/* DataGrid */}
      <Card elevation={2}>
        <DataGrid
          rows={claims}
          columns={columns}
          getRowId={(row) => row.investigationID}
          loading={loading}
          pagination
          paginationMode="server"
          rowCount={totalCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[25, 50, 100]}
          onRowClick={handleRowClick}
          sx={{
            minHeight: 500,
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#6F62C2',
              color: 'white',
              fontWeight: 600,
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
              },
            },
          }}
          disableRowSelectionOnClick
        />
      </Card>
    </Box>
  );
};

export default CentralInvestigationCompletedCashless;