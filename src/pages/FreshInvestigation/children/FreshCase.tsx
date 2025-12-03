// src/components/FreshInvestigation/components/FreshCase.tsx
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
    claimIntimationDate: string;
    admissionDate: string;
    dischargeDate: string;
    workflowStatus: string;
    acceptAssignId?: string;
    investigationType?: string;
    investigationSubType?: string;
}

const FreshCase: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(false);
    const [tatRange, setTatRange] = useState('');
    const [tatDropdownItems, setTatDropdownItems] = useState<any[]>([]);

    useEffect(() => {
        fetchClaims();
        setTatDropdownItems(fetchMenuService.getCashLessDropDownItems());
    }, []);

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const response = await claimsService.fetchClaims();
            if (response.statusCode === 0) {
                setClaims(response.payload);
            }
        } catch (error) {
            console.error('Error fetching claims:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTatFilterChange = async (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setTatRange(value);

        if (value === '') {
            // Reset to all claims
            fetchClaims();
            return;
        }

        setLoading(true);
        try {
            const response: any = await claimsService.fetchClaimsByTat(value);
            if (response.statusCode === 0) {
                setClaims(response.payload);
            }
        } catch (error) {
            console.error('Error fetching claims by TAT:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTatColor = (tat: number): string => {
        console.log("tttt", tat, fetchMenuService.getCashlessCssClass(tat))
        return fetchMenuService.getCashlessCssClass(tat);
    };

    const getTatBackgroundColor = (tat: number): string => {
        const cssClass = getTatColor(tat);

        // Map CSS classes to actual colors
        const colorMap: { [key: string]: string } = {
            'tat-light-green': '#c8e6c9',
            'tat-dark-green': '#81c784',
            'tat-amber': '#ffcc80',
            'tat-red': '#ef5350',
        };

        return colorMap[cssClass] || 'transparent';
    };

    const handleRowClick = (claim: Claim) => {
        // navigate(`/admin/fresh-case-form/${claim.investigationID}?redirectTo=${location.pathname}&claimsType=reim&reimclaimNo=${claim.tpaClaimNo}&sbigclaimno=${claim.sbigClaimNo}&acceptAssId=${claim.acceptAssignId}&invsType=${claim.investigationType}&invsSubType=${claim.investigationSubType}`);
        navigate(`/admin/fresh-case-form/${claim.investigationID}?redirectTo=${location.pathname}&claimsType=cashless&claimNo=${claim.tpaClaimNo}&sbigclaimno=${claim.sbigClaimNo}`);
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
                        color: '#fff',
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
        { field: 'proposerName', headerName: 'Proposer Name', width: 150 },
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
        { field: 'patientName', headerName: 'Patient Name', width: 150 },
        { field: 'memberAge', headerName: 'Age', width: 80 },
        { field: 'finalDiagnosis', headerName: 'Diagnosis', width: 180 },
        { field: 'claimIntimationDate', headerName: 'Date of Intimation', width: 140 },
        { field: 'admissionDate', headerName: 'DOA', width: 120 },
        { field: 'dischargeDate', headerName: 'Expected DOD', width: 140 },
        { field: 'workflowStatus', headerName: 'Status', width: 150 },
    ];

    const rows = claims.map((claim, index) => ({
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
                        // TAT color classes
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

export default FreshCase;