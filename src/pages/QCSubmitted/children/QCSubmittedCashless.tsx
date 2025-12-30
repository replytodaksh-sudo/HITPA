// // File: src/components/QCSubmittedCashless.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   FormControl,
//   Select,
//   MenuItem,
//   Chip,
//   Typography,
//   Grid,
//   IconButton,
//   Tooltip,
// } from '@mui/material';
// import type { SelectChangeEvent } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import type { GridColDef, GridRowParams } from '@mui/x-data-grid';
// import {
//   Visibility as ViewIcon,
//   FilterList as FilterIcon,
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import claimsService from '../../../services/claims.service';
// import fetchMenuService from '../../../utils/fetchmenu.service';

// // ==================== INTERFACES ====================
// interface CashlessClaim {
//   investigationID: string;
//   sbigClaimNo: string;
//   tpaClaimNo: string;
//   tpaName: string;
//   proposerName: string;
//   policyCode: string;
//   policyStartDate: string;
//   hospitalName: string;
//   tat: number;
//   hospitalCity: string;
//   hospitalState: string;
//   claimAmount: number;
//   patientName: string;
//   memberAge: number;
//   finalDiagnosis: string;
//   claimIntimationDate: string;
//   admissionDate: string;
//   dischargeDate: string;
//   workflowStatus: string;
// }

// interface TatDropdownItem {
//   name: string;
//   value: string;
// }

// /**
//  * QC Submitted Cashless Table Component
//  * Shows submitted cashless QC cases with TAT filtering
//  */
// const QCSubmittedCashless: React.FC = () => {
//   const navigate = useNavigate();
  
//   const [claims, setClaims] = useState<CashlessClaim[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [tatRange, setTatRange] = useState('');
//   const [tatDropdownItems, setTatDropdownItems] = useState<TatDropdownItem[]>([]);

//   // Fetch data on mount
//   useEffect(() => {
//     fetchClaims();
//     loadTatDropdown();
//   }, []);

//   // Load TAT dropdown items from service
//   const loadTatDropdown = () => {
//     const items = fetchMenuService.getCashLessDropDownItems();
//     setTatDropdownItems(items);
//   };

//   // Fetch all claims
//   const fetchClaims = async () => {
//     setLoading(true);
//     try {
//       const response = await claimsService.getAllAgencyPendingFromReg();
      
//       if (response.statusCode === 0) {
//         setClaims(response.payload || []);
//       }
//     } catch (error) {
//       console.error('Error fetching claims:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle TAT filter change
//   const handleTatFilterChange = async (event: SelectChangeEvent<string>) => {
//     const value = event.target.value;
//     setTatRange(value);

//     if (value === '') {
//       // If "Select Color Code" selected, fetch all claims
//       fetchClaims();
//     } else {
//       // Fetch filtered claims by TAT
//       setLoading(true);
//       try {
//         const response = await claimsService.getAllAgencyPendingFromRegByTat(value);
        
//         if (response.statusCode === 0) {
//           setClaims(response.payload || []);
//         }
//       } catch (error) {
//         console.error('Error fetching filtered claims:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // Get TAT color chip
//   const getTatColorChip = (tat: number) => {
//     const cssClass = fetchMenuService.getCashlessCssClass(tat);
    
//     let color: 'success' | 'info' | 'warning' | 'error' = 'info';
//     let bgColor = '';
    
//     if (cssClass === 'tat-light-green') {
//       color = 'success';
//       bgColor = '#4caf50';
//     } else if (cssClass === 'tat-dark-green') {
//       color = 'info';
//       bgColor = '#2196f3';
//     } else if (cssClass === 'tat-amber') {
//       color = 'warning';
//       bgColor = '#ff9800';
//     } else if (cssClass === 'tat-red') {
//       color = 'error';
//       bgColor = '#f44336';
//     }

//     return (
//       <Chip
//         label={tat}
//         size="small"
//         sx={{
//           backgroundColor: bgColor,
//           color: 'white',
//           fontWeight: 600,
//         }}
//       />
//     );
//   };

//   // Handle row click
//   const handleRowClick = (params: GridRowParams) => {
//     const claim = params?.row as CashlessClaim;
//     navigate(
//       `/admin/agency-qc-submitted-form/${claim.investigationID}?claimsType=cashless&claimNo=${claim.tpaClaimNo}&sbigclaimno=${claim.sbigClaimNo}`
//     );
//   };

//   // Define columns
//   const columns: GridColDef[] = [
//     {
//       field: 'investigationID',
//       headerName: 'Investigation No',
//       width: 180,
//       renderCell: (params) => (
//         <Box
//           sx={{
//             color: 'primary.main',
//             fontWeight: 600,
//             cursor: 'pointer',
//             '&:hover': { textDecoration: 'underline' },
//           }}
//         >
//           {params?.value}
//         </Box>
//       ),
//     },
//     {
//       field: 'sbigClaimNo',
//       headerName: 'Claim No',
//       width: 150,
//     },
//     {
//       field: 'tpaClaimNo',
//       headerName: 'TPA Claim No',
//       width: 150,
//     },
//     {
//       field: 'tpaName',
//       headerName: 'TPA Name',
//       width: 150,
//     },
//     {
//       field: 'proposerName',
//       headerName: 'Proposer Name',
//       width: 180,
//     },
//     {
//       field: 'policyCode',
//       headerName: 'Policy No',
//       width: 150,
//     },
//     {
//       field: 'policyStartDate',
//       headerName: 'Policy Start Date',
//       width: 150,
//     },
//     {
//       field: 'hospitalName',
//       headerName: 'Hospital Name',
//       width: 200,
//     },
//     {
//       field: 'tat',
//       headerName: 'TAT',
//       width: 100,
//       renderCell: (params) => getTatColorChip(params?.value),
//     },
//     {
//       field: 'hospitalCity',
//       headerName: 'City',
//       width: 130,
//     },
//     {
//       field: 'hospitalState',
//       headerName: 'State',
//       width: 130,
//     },
//     {
//       field: 'claimAmount',
//       headerName: 'Claim Amount',
//       width: 140,
//       renderCell: (params) => (
//         <Typography variant="body2" fontWeight={600}>
//           ₹{params?.value?.toLocaleString('en-IN')}
//         </Typography>
//       ),
//     },
//     {
//       field: 'patientName',
//       headerName: 'Patient Name',
//       width: 180,
//     },
//     {
//       field: 'memberAge',
//       headerName: 'Age',
//       width: 80,
//     },
//     {
//       field: 'finalDiagnosis',
//       headerName: 'Diagnosis',
//       width: 200,
//     },
//     {
//       field: 'claimIntimationDate',
//       headerName: 'Date of Intimation',
//       width: 160,
//     },
//     {
//       field: 'admissionDate',
//       headerName: 'DOA',
//       width: 130,
//     },
//     {
//       field: 'dischargeDate',
//       headerName: 'Expected Date of Discharge',
//       width: 200,
//     },
//     {
//       field: 'workflowStatus',
//       headerName: 'Status',
//       width: 150,
//       renderCell: (params) => (
//         <Chip
//           label={params?.value}
//           size="small"
//           color="secondary"
//           variant="outlined"
//         />
//       ),
//     },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       width: 100,
//       sortable: false,
//       filterable: false,
//       renderCell: (params:any) => (
//         <Tooltip title="View Details">
//           <IconButton
//             size="small"
//             color="primary"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleRowClick(params);
//             }}
//           >
//             <ViewIcon />
//           </IconButton>
//         </Tooltip>
//       ),
//     },
//   ];

//   // Calculate summary stats
//   const totalCases = claims.length;
//   const totalAmount = claims.reduce((sum, claim) => sum + (claim.claimAmount || 0), 0);
//   const avgTat = totalCases > 0 
//     ? (claims.reduce((sum, claim) => sum + claim.tat, 0) / totalCases).toFixed(1)
//     : '0';

//   return (
//     <Box>
//       {/* Summary Cards */}
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid size={{ xs: 12, lg: 4 }}>
//           <Card
//             elevation={0}
//             sx={{
//               background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
//               color: 'white',
//             }}
//           >
//             <CardContent>
//               <Typography variant="h4" fontWeight={700}>
//                 {totalCases}
//               </Typography>
//               <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                 Total Cases
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid size={{ xs: 12, lg: 4 }}>
//           <Card
//             elevation={0}
//             sx={{
//               background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//               color: 'white',
//             }}
//           >
//             <CardContent>
//               <Typography variant="h4" fontWeight={700}>
//                 ₹{(totalAmount / 100000).toFixed(2)}L
//               </Typography>
//               <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                 Total Amount
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid size={{ xs: 12, lg: 4 }}>
//           <Card
//             elevation={0}
//             sx={{
//               background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
//               color: 'white',
//             }}
//           >
//             <CardContent>
//               <Typography variant="h4" fontWeight={700}>
//                 {avgTat} days
//               </Typography>
//               <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                 Average TAT
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* TAT Filter */}
//       <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
//         <FilterIcon color="action" />
//         <FormControl size="small" sx={{ minWidth: 250 }}>
//           <Select
//             value={tatRange}
//             onChange={handleTatFilterChange}
//             displayEmpty
//           >
//             <MenuItem value="">
//               <em>Select Color Code</em>
//             </MenuItem>
//             {tatDropdownItems.map((item) => (
//               <MenuItem key={item.value} value={item.value}>
//                 {item.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {tatRange && (
//           <Chip
//             label={`Filtered: ${tatDropdownItems.find(i => i.value === tatRange)?.name}`}
//             onDelete={() => handleTatFilterChange({ target: { value: '' } } as any)}
//             color="primary"
//             variant="outlined"
//           />
//         )}
//       </Box>

//       {/* DataGrid */}
//       <Card elevation={2}>
//         <DataGrid
//           rows={claims}
//           columns={columns}
//           getRowId={(row) => row?.investigationID}
//           loading={loading}
//           pageSizeOptions={[25, 50, 100]}
//           initialState={{
//             pagination: { paginationModel: { pageSize: 50 } },
//           }}
//           onRowClick={handleRowClick}
//           sx={{
//             minHeight: 400,
//             '& .MuiDataGrid-row': {
//               cursor: 'pointer',
//               '&:hover': {
//                 backgroundColor: 'action.hover',
//               },
//             },
//             '& .MuiDataGrid-cell': {
//               borderRight: '1px solid',
//               borderColor: 'divider',
//             },
//             '& .MuiDataGrid-columnHeaders': {
//               backgroundColor: '#6F62C2',
//               color: 'white',
//               fontWeight: 600,
//               '& .MuiDataGrid-columnHeaderTitle': {
//                 fontWeight: 600,
//               },
//             },
//           }}
//           disableRowSelectionOnClick
//         />
//       </Card>
//     </Box>
//   );
// };

// export default QCSubmittedCashless;

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

const QCSubmittedCashless: React.FC = () => {
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
            let response: any = await claimsService.getAllAgencyPendingFromReg();

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
            let response: any = await claimsService.getAllAgencyPendingFromRegByTat(selectedRange);

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
        navigate(`/admin/agency-qc-submitted-form/${investigationID}?redirectTo=${location.pathname}&claimsType=cashless&claimNo=${claim.tpaClaimNo}&sbigclaimno=${claim.sbigClaimNo}&acceptAssId=${claim.acceptAssignId}&invsType=${claim.investigationType}&invsSubType=${claim.investigationSubType}`)
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

export default QCSubmittedCashless;