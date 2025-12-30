import React, { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    Paper,
    Typography,
    CircularProgress,
    useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useNavigate, useLocation } from 'react-router-dom';
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
}

const QCSubmittedReimTable: React.FC = () => {
    const theme = useTheme();
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [tatRange, setTatRange] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Get TAT dropdown items
    const tatDropdownItems = fetchMenuService.getCashLessDropDownItems();

    useEffect(() => {
        fetchAssignedCases();
    }, []);

    const fetchAssignedCases = async () => {
        setLoading(true);
        try {
            const role = sessionStorage.getItem('roleName');
            let response: any = await claimsService.getAllAgencyPendingFromRegReim();

            if (response?.statusCode === 0) {
                setClaims(response.payload);
            }
        } catch (error) {
            console.error('Error fetching assigned cases:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTatChange = async (event: any) => {
        const selectedRange = event.target.value as string;
        setTatRange(selectedRange);

        if (!selectedRange) {
            fetchAssignedCases();
            return;
        }

        setLoading(true);
        try {
            let response: any = await claimsService.getAllAgencyPendingFromRegReimByTat(selectedRange);

            if (response?.statusCode === 0) {
                setClaims(response.payload);
            }
        } catch (error) {
            console.error('Error filtering by TAT:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTatColor = (tat: number): string => {
        return fetchMenuService.getCashlessHexColor(tat);
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };
    // INV000427?redirectTo=/admin/freshNewCases&claimsType=cashless&claimNo=IP-1004G&sbigclaimno=199922000042-01

    // fieldAssignedToSelf
    const handleRowClick = (investigationID: string, claim: any) => {
        navigate(`/admin/agency-qc-submitted-form/${investigationID}?redirectTo=${location.pathname}&claimsType=reim&claimNo=${claim.tpaClaimNo}&sbigclaimno=${claim.sbigClaimNo}&acceptAssId=${claim.acceptAssignId}&invsType=${claim.investigationType}&invsSubType=${claim.investigationSubType}`)
    };

    const columns: GridColDef[] = [
        {
            field: 'investigationID',
            headerName: 'Investigation No',
            width: 150,
            renderCell: (params) => (
                <Typography
                    sx={{
                        color: '#1976d2',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        '&:hover': { color: '#1565c0' },
                    }}
                    onClick={() => handleRowClick(params?.value, params?.row)}
                >
                    {params?.value}
                </Typography>
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
            renderCell: (params) => (
                <Typography sx={{ fontWeight: 'bold' }}>{params?.value}</Typography>
            ),
        },
        { field: 'hospitalCity', headerName: 'City', width: 120 },
        { field: 'hospitalState', headerName: 'State', width: 120 },
        {
            field: 'claimAmount',
            headerName: 'Claim Amount',
            width: 130,
            renderCell: (params) => (
                <Typography sx={{ color: '#1976d2', fontWeight: 500 }}>
                    {formatCurrency(params?.value)}
                </Typography>
            ),
        },
        { field: 'patientName', headerName: 'Patient Name', width: 150 },
        { field: 'memberAge', headerName: 'Age', width: 80 },
        { field: 'finalDiagnosis', headerName: 'Diagnosis', width: 180 },
        { field: 'claimIntimationDate', headerName: 'Date of Intimation', width: 140 },
        { field: 'admissionDate', headerName: 'DOA', width: 120 },
        { field: 'dischargeDate', headerName: 'Expected Date of Discharge', width: 180 },
        { field: 'workflowStatus', headerName: 'Status', width: 140 },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                {/* TAT Filter */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start' }}>
                    <FormControl sx={{ minWidth: 250 }}>
                        <Select
                            value={tatRange}
                            onChange={handleTatChange}
                            displayEmpty
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#6F62C2',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#5a4fa3',
                                },
                            }}
                        >
                            <MenuItem value="">Select Color Code</MenuItem>
                            {tatDropdownItems.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* DataGrid Table */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress sx={{ color: '#2E5A96' }}/>
                    </Box>
                ) : (
                    <Box sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={claims}
                            columns={columns}
                            getRowId={(row) => row?.investigationID}
                            pageSizeOptions={[25, 50, 100]}
                            getRowClassName={(params) => ''}
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
                                '& .MuiDataGrid-row': {
                                    cursor: 'pointer',
                                },
                            }}
                        // componentsProps={{
                        //     row: {
                        //         style: (params: any) => ({
                        //             backgroundColor: getTatColor(params?.row.tat),
                        //         }),
                        //     },
                        // }}
                        />
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default QCSubmittedReimTable;