// src/components/FreshInvestigation/components/FreshReimTable.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { claimsService } from '../../../services/claims.service';
import { fetchMenuService } from '../../../utils/fetchmenu.service';

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
  acceptAssignId?: string;
  investigationType?: string;
  investigationSubType?: string;
}

const FreshReimTable: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [reimClaims, setReimClaims] = useState<ReimClaim[]>([]);
  const [loading, setLoading] = useState(false);
  const [tatRange, setTatRange] = useState('');
  const [tatDropdownItems, setTatDropdownItems] = useState<any[]>([]);

  useEffect(() => {
    fetchReimClaims();
    setTatDropdownItems(fetchMenuService.getReimDropDownItems());
  }, []);

  const fetchReimClaims = async () => {
    setLoading(true);
    try {
      const response = await claimsService.fetchReimClaims();
      if (response.statusCode === 0) {
        setReimClaims(response.payload);
      }
    } catch (error) {
      console.error('Error fetching reimbursement claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTatFilterChange = async (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setTatRange(value);

    if (value === '') {
      // Reset to all claims
      fetchReimClaims();
      return;
    }

    setLoading(true);
    try {
      const response: any = await claimsService.fetchReimClaimsByTat(value);
      if (response.statusCode === 0) {
        setReimClaims(response.payload);
      }
    } catch (error) {
      console.error('Error fetching claims by TAT:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTatColor = (tat: number): string => {
    if (tat <= 2) {
      return 'tat-light-green';
    } else if (tat <= 5) {
      return 'tat-dark-green';
    } else if (tat <= 7) {
      return 'tat-amber';
    } else {
      return 'tat-red';
    }
  };

  const handleRowClick = (claim: ReimClaim) => {
    navigate(`/admin/fresh-case-form/${claim.investigationID}?redirectTo=${location.pathname}&claimsType=reim&claimNo=${claim.tpaClaimNo}&sbigclaimno=${claim.sbigClaimNo}&acceptAssId=${claim.acceptAssignId}&invsType=${claim.investigationType}&invsSubType=${claim.investigationSubType}`);
  };

  const columns: GridColDef[] = [
    {
      field: 'investigationID',
      headerName: 'Investigation No',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          component="span"
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            textDecoration: 'underline',
            '&:hover': {
              color: 'primary.dark',
            },
          }}
          onClick={() => handleRowClick(params.row)}
        >
          {params.value}
        </Box>
      ),
    },
    { field: 'sbigClaimNo', headerName: 'Claim No', width: 140 },
    { field: 'tpaClaimNo', headerName: 'TPA Claim No', width: 140 },
    { field: 'tpaName', headerName: 'TPA Name', width: 150 },
    {
      field: 'corporateName',
      headerName: 'Corporate Name (only if GMC)',
      width: 200,
      valueGetter: () => '', // Empty column as per Angular template
    },
    { field: 'policyCode', headerName: 'Policy No', width: 140 },
    { field: 'policyStartDate', headerName: 'Policy Start Date', width: 140 },
    { field: 'hospitalName', headerName: 'Hospital Name', width: 180 },
    {
      field: 'tat',
      headerName: 'TAT',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
          }}
        >
          {params.value}
        </Box>
      ),
    },
    { field: 'hospitalCity', headerName: 'City', width: 120 },
    { field: 'hospitalState', headerName: 'State', width: 120 },
    {
      field: 'claimAmount',
      headerName: 'Claim Amount',
      width: 130,
      valueFormatter: (params: any) => `₹${params.value?.toLocaleString('en-IN') || 0}`,
    },
    { field: 'proposerName', headerName: 'Proposer Name', width: 150 },
    { field: 'memberName', headerName: 'Patient Name', width: 150 },
    { field: 'memberAge', headerName: 'Age', width: 80 },
    { field: 'finalDiagnosis', headerName: 'Diagnosis', width: 180 },
    { field: 'admissionDate', headerName: 'DOA', width: 120 },
    { field: 'dischargeDate', headerName: 'DOD', width: 120 },
    { field: 'claimIntimationDate', headerName: 'DOI', width: 120 },
    { field: 'workflowStatus', headerName: 'Status', width: 150 },
  ];

  const rows = reimClaims.map((claim, index) => ({
    id: index,
    ...claim,
  }));

  return (
    <Box>
      {/* TAT Filter Dropdown */}
      <Box sx={{ mb: 3, maxWidth: 300 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Select Color Code</InputLabel>
          <Select
            value={tatRange}
            onChange={handleTatFilterChange}
            label="Select Color Code"
          >
            <MenuItem value="">All Cases</MenuItem>
            {tatDropdownItems.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 50 } },
          }}
          getRowClassName={(params) => getTatColor(params.row.tat)}
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
            // TAT color classes (same as cashless)
            '& .tat-light-green': {
              bgcolor: '#c8e6c9 !important',
            },
            '& .tat-dark-green': {
              bgcolor: '#81c784 !important',
            },
            '& .tat-amber': {
              bgcolor: '#ffcc80 !important',
            },
            '& .tat-red': {
              bgcolor: '#ef5350 !important',
              color: 'white',
            },
            '& .MuiDataGrid-row:hover': {
              opacity: 0.85,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default FreshReimTable;