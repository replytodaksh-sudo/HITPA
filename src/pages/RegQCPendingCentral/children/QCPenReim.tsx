// File: src/components/QCPenCashless.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { claimsService } from '../../../services/claims.service';
import { fetchMenuService } from '../../../utils/fetchmenu.service';

// ============================================================================
// INTERFACES
// ============================================================================

interface CashlessClaim {
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

interface TATDropdownItem {
    name: string;
    value: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const QCPenReim: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // State
    const [claims, setClaims] = useState<CashlessClaim[]>([]);
    const [filteredClaims, setFilteredClaims] = useState<CashlessClaim[]>([]);
    const [tatRange, setTatRange] = useState<string>('');
    const [tatDropdownArray, setTatDropdownArray] = useState<TATDropdownItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [paginationModel, setPaginationModel] = useState({ pageSize: 50, page: 0 });

    // ============================================================================
    // LIFECYCLE
    // ============================================================================

    useEffect(() => {
        // Load TAT dropdown items for cashless
        const dropdownItems = fetchMenuService.getReimDropDownItems();
        setTatDropdownArray(dropdownItems);

        // Fetch claims
        fetchClaims();
    }, []);

    useEffect(() => {
        setFilteredClaims(claims);
    }, [claims]);

    // ============================================================================
    // API CALLS
    // ============================================================================

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const response = await claimsService.fetchPendingFromCentralReim();
            if (response.statusCode === 0) {
                setClaims(response.payload);
                setFilteredClaims(response.payload);
            }
        } catch (error) {
            console.error('Failed to fetch claims:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCasesByTatRange = async (tatValue: string) => {
        if (!tatValue) {
            fetchClaims();
            return;
        }

        setLoading(true);
        try {
            const response: any = await claimsService.fetchPendingFromCentralReimByTat(tatValue);
            if (response.statusCode === 0) {
                setClaims(response.payload);
                setFilteredClaims(response.payload);
            }
        } catch (error) {
            console.error('Failed to filter claims by TAT:', error);
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

    const handleViewClick = (investigationID: string, claim: CashlessClaim) => {
        navigate(
            `/admin/qc-pending-central-form/${investigationID}?claimsType=cashless&claimNo=${claim.tpaClaimNo}&sbigclaimno=${claim.sbigClaimNo}`
        );
    };

    // ============================================================================
    // HELPERS
    // ============================================================================

    const getTatColor = (tat: number): string => {
        if (tat === 0) {
            return theme.palette.success.main; // Light green
        } else if (tat >= 1 && tat <= 2) {
            return theme.palette.info.main; // Dark green/blue
        } else if (tat >= 3 && tat <= 7) {
            return theme.palette.warning.main; // Amber
        } else {
            return theme.palette.error.main; // Red
        }
    };

    const getTatLabel = (tat: number): string => {
        if (tat === 0) return 'Excellent';
        if (tat >= 1 && tat <= 2) return 'Good';
        if (tat >= 3 && tat <= 7) return 'Warning';
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
            renderCell: (params: any) => (
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
            field: 'proposerName',
            headerName: 'Proposer Name',
            width: 150,
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
            field: 'patientName',
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
            field: 'dateOfIntimetion',
            headerName: 'Date of Intimation',
            width: 150,
            valueFormatter: (params: any) => {
                if (params?.value) {
                    return new Date(params?.value).toLocaleDateString('en-IN');
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
                    return new Date(params?.value).toLocaleDateString('en-IN');
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
                    return new Date(params?.value).toLocaleDateString('en-IN');
                }
                return '';
            },
        },
        {
            field: 'workflowStatus',
            headerName: 'Workflow Status',
            width: 150,
            renderCell: (params: any) => (
                <Chip label={params?.value} size="small" color="secondary" variant="outlined" />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
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
    // STATISTICS
    // ============================================================================

    const totalCases = filteredClaims.length;
    const totalAmount = filteredClaims.reduce((sum, claim) => sum + (claim.claimAmount || 0), 0);
    const avgTat =
        filteredClaims.length > 0
            ? (filteredClaims.reduce((sum, claim) => sum + claim.tat, 0) / filteredClaims.length).toFixed(1)
            : 0;

    // ============================================================================
    // RENDER
    // ============================================================================

    if (loading && claims.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 8,
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} thickness={4} sx={{ color: '#2E5A96' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Loading cashless cases...
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
                            {totalCases}
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
                            }).format(totalAmount)}
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Avg TAT
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>
                            {avgTat} days
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* TAT Filter */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <FilterIcon color="action" />
                <FormControl sx={{ minWidth: 300 }} size="small">
                    <Select value={tatRange} onChange={handleTatChange} displayEmpty>
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
                            fetchClaims();
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
                            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                            color: 'white',
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

export default QCPenReim;