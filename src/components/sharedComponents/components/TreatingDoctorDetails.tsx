// // // src/components/ReimburseCaseUpdate/TreatingDoctorDetails.tsx
// // import React, { useState, useEffect } from 'react';
// // import {
// //   Box,
// //   Button,
// //   TextField,
// //   Radio,
// //   RadioGroup,
// //   FormControlLabel,
// //   FormControl,
// //   Select,
// //   MenuItem,
// //   Checkbox,
// //   Typography,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   Grid
// // } from '@mui/material';

// // interface TreatingDoctor {
// //   firstName?: string;
// //   middleName?: string;
// //   lastName?: string;
// //   contactNo?: string;
// //   regNo?: string;
// //   qualification?: string;
// //   stream?: string;
// //   fraud?: boolean;
// // }

// // interface TreatingDoctorDetailsProps {
// //   title: string;
// //   buttonEnable: boolean;
// //   previousData?: any;
// // }

// // const TreatingDoctorDetails: React.FC<TreatingDoctorDetailsProps> = ({
// //   title,
// //   buttonEnable,
// //   previousData
// // }) => {
// //   const disableFields = !buttonEnable;

// //   // Table data
// //   const [rowData, setRowData] = useState<TreatingDoctor[]>([{}]);

// //   // Statement fields
// //   const [treatingDrStatementCollected, setTreatingDrStatementCollected] = useState('');
// //   const [treatingDrStatementCollectedDiscrepanciesFound, setTreatingDrStatementCollectedDiscrepanciesFound] = useState('');
// //   const [treatingDrStatementCollectedDiscrepanciesFinding, setTreatingDrStatementCollectedDiscrepanciesFinding] = useState('');
// //   const [treatingDrStatementCollectedPEDNoted, setTreatingDrStatementCollectedPEDNoted] = useState('');
// //   const [treatingDrStatementCollectedPEDNotedFinding, setTreatingDrStatementCollectedPEDNotedFinding] = useState('');
// //   const [treatingDrStatementCollectedReason, setTreatingDrStatementCollectedReason] = useState('');

// //   // Populate data from previousData
// //   useEffect(() => {
// //     if (previousData) {
// //       populateData();
// //     }
// //   }, [previousData]);

// //   const populateData = () => {
// //     if (!previousData) return;

// //     // Populate table data
// //     if (previousData.reCaseUpdateTreatingDocterDetailsDTO) {
// //       setRowData(previousData.reCaseUpdateTreatingDocterDetailsDTO);
// //     }

// //     // Populate statement collected
// //     if (previousData.treatingDrStatementCollected === true) {
// //       setTreatingDrStatementCollected('yes');
// //     } else if (previousData.treatingDrStatementCollected === false) {
// //       setTreatingDrStatementCollected('no');
// //     }

// //     // Populate discrepancies found
// //     if (previousData.treatingDrStatementCollectedDiscrepanciesFound === true) {
// //       setTreatingDrStatementCollectedDiscrepanciesFound('yes');
// //     } else if (previousData.treatingDrStatementCollectedDiscrepanciesFound === false) {
// //       setTreatingDrStatementCollectedDiscrepanciesFound('no');
// //     }
// //     setTreatingDrStatementCollectedDiscrepanciesFinding(
// //       previousData.treatingDrStatementCollectedDiscrepanciesFinding || ''
// //     );

// //     // Populate PED noted
// //     if (previousData.treatingDrStatementCollectedPEDNoted === true) {
// //       setTreatingDrStatementCollectedPEDNoted('yes');
// //     } else if (previousData.treatingDrStatementCollectedPEDNoted === false) {
// //       setTreatingDrStatementCollectedPEDNoted('no');
// //     }
// //     setTreatingDrStatementCollectedPEDNotedFinding(
// //       previousData.treatingDrStatementCollectedPEDNotedFinding || ''
// //     );

// //     // Populate reason
// //     setTreatingDrStatementCollectedReason(
// //       previousData.treatingDrStatementCollectedReason || ''
// //     );
// //   };

// //   // Add new row to table
// //   const addRow = () => {
// //     setRowData([...rowData, {}]);
// //   };

// //   // Update specific row field
// //   const updateRowField = (index: number, field: keyof TreatingDoctor, value: any) => {
// //     const updatedData = [...rowData];
// //     updatedData[index] = { ...updatedData[index], [field]: value };
// //     setRowData(updatedData);
// //   };

// //   // Save table data
// //   const saveTableData = () => {
// //     alert('Treating Doctor Data saved successfully!');
// //     // In Angular, this saves to a service. In React, you might want to:
// //     // 1. Call parent callback: onSave(rowData)
// //     // 2. Or store in context/redux
// //     // 3. Or save to API directly
// //   };

// //   // Get data for submission (to be called by parent component)
// //   const getSubmitData = () => {
// //     return {
// //       reCaseUpdateTreatingDocterDetailsDTO: rowData,
// //       treatingDrStatementCollected: treatingDrStatementCollected === 'yes',
// //       treatingDrStatementCollectedDiscrepanciesFound: treatingDrStatementCollectedDiscrepanciesFound === 'yes',
// //       treatingDrStatementCollectedDiscrepanciesFinding,
// //       treatingDrStatementCollectedPEDNoted: treatingDrStatementCollectedPEDNoted === 'yes',
// //       treatingDrStatementCollectedPEDNotedFinding,
// //       treatingDrStatementCollectedReason
// //     };
// //   };

// //   return (
// //     <Paper sx={{ p: 3 }}>
// //       {/* Title */}
// //       <Typography variant="h6" gutterBottom sx={{ fontSize: '14px', fontWeight: 'bold' }}>
// //         {title}
// //       </Typography>

// //       {/* Treating Doctors Table */}
// //       <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
// //         <Table size="small">
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>#</TableCell>
// //               <TableCell align="center">Treating doctor Name</TableCell>
// //               <TableCell align="center">Contact No.</TableCell>
// //               <TableCell align="center">Registration Number</TableCell>
// //               <TableCell align="center">Qualification</TableCell>
// //               <TableCell align="center">Stream</TableCell>
// //               <TableCell align="center">To be tagged as Fraud / Caution?</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {rowData.map((doctor, index) => (
// //               <TableRow key={index}>
// //                 <TableCell>{index + 1}</TableCell>

// //                 {/* Doctor Name (First, Middle, Last) */}
// //                 <TableCell>
// //                   <Box sx={{ display: 'flex', gap: 1 }}>
// //                     <TextField
// //                       size="small"
// //                       placeholder="First"
// //                       value={doctor.firstName || ''}
// //                       onChange={(e) => updateRowField(index, 'firstName', e.target.value)}
// //                       disabled={disableFields}
// //                       sx={{ flex: 1 }}
// //                     />
// //                     <TextField
// //                       size="small"
// //                       placeholder="Middle"
// //                       value={doctor.middleName || ''}
// //                       onChange={(e) => updateRowField(index, 'middleName', e.target.value)}
// //                       disabled={disableFields}
// //                       sx={{ flex: 1 }}
// //                     />
// //                     <TextField
// //                       size="small"
// //                       placeholder="Last"
// //                       value={doctor.lastName || ''}
// //                       onChange={(e) => updateRowField(index, 'lastName', e.target.value)}
// //                       disabled={disableFields}
// //                       sx={{ flex: 1 }}
// //                     />
// //                   </Box>
// //                 </TableCell>

// //                 {/* Contact No */}
// //                 <TableCell>
// //                   <TextField
// //                     size="small"
// //                     fullWidth
// //                     value={doctor.contactNo || ''}
// //                     onChange={(e) => {
// //                       const value = e.target.value.replace(/\D/g, '').slice(0, 10);
// //                       updateRowField(index, 'contactNo', value);
// //                     }}
// //                     disabled={disableFields}
// //                     inputProps={{ maxLength: 10 }}
// //                   />
// //                 </TableCell>

// //                 {/* Registration Number */}
// //                 <TableCell>
// //                   <TextField
// //                     size="small"
// //                     fullWidth
// //                     value={doctor.regNo || ''}
// //                     onChange={(e) => updateRowField(index, 'regNo', e.target.value)}
// //                     disabled={disableFields}
// //                   />
// //                 </TableCell>

// //                 {/* Qualification */}
// //                 <TableCell>
// //                   <TextField
// //                     size="small"
// //                     fullWidth
// //                     value={doctor.qualification || ''}
// //                     onChange={(e) => updateRowField(index, 'qualification', e.target.value)}
// //                     disabled={disableFields}
// //                   />
// //                 </TableCell>

// //                 {/* Stream */}
// //                 <TableCell>
// //                   <FormControl fullWidth size="small">
// //                     <Select
// //                       value={doctor.stream || ''}
// //                       onChange={(e) => updateRowField(index, 'stream', e.target.value)}
// //                       disabled={disableFields}
// //                     >
// //                       <MenuItem value="">Select</MenuItem>
// //                       <MenuItem value="Allopathy">Allopathy</MenuItem>
// //                       <MenuItem value="Homeopathy">Homeopathy</MenuItem>
// //                       <MenuItem value="Ayurvedic">Ayurvedic</MenuItem>
// //                       <MenuItem value="Unani">Unani</MenuItem>
// //                       <MenuItem value="Naturapathy">Naturapathy</MenuItem>
// //                       <MenuItem value="Others">Others</MenuItem>
// //                     </Select>
// //                   </FormControl>
// //                 </TableCell>

// //                 {/* Fraud Checkbox */}
// //                 <TableCell align="center">
// //                   <Checkbox
// //                     checked={doctor.fraud || false}
// //                     onChange={(e) => updateRowField(index, 'fraud', e.target.checked)}
// //                     disabled={disableFields}
// //                   />
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>

// //       {/* Add More Button */}
// //       {buttonEnable && (
// //         <Button
// //           onClick={addRow}
// //           sx={{ mb: 2, color: 'blue', textTransform: 'none' }}
// //         >
// //           +Add More
// //         </Button>
// //       )}

// //       {/* Save Button */}

// //       {/* Statement Collected */}
// //       <Box sx={{ mb: 3 }}>
// //         <Grid container spacing={2} alignItems="center">
// //           <Grid size={{ xs: 4 }}>
// //             <Typography>Statement collected</Typography>
// //           </Grid>
// //           <Grid size={{ xs: 8 }}>
// //             <FormControl fullWidth size="small">
// //               <Select
// //                 value={treatingDrStatementCollected}
// //                 onChange={(e) => setTreatingDrStatementCollected(e.target.value)}
// //                 disabled={disableFields}
// //               >
// //                 <MenuItem value="">Select</MenuItem>
// //                 <MenuItem value="yes">Yes</MenuItem>
// //                 <MenuItem value="no">No</MenuItem>
// //               </Select>
// //             </FormControl>
// //           </Grid>
// //         </Grid>
// //       </Box>

// //       {/* If Statement Collected = YES */}
// //       {treatingDrStatementCollected === 'yes' && (
// //         <>
// //           {/* Discrepancies Found */}
// //           <Box sx={{ mb: 3 }}>
// //             <Grid container spacing={2} alignItems="center">
// //               <Grid size={{ xs: 4 }}>
// //                 <Typography>Discrepancies found</Typography>
// //               </Grid>
// //               <Grid size={{ xs: 8 }}>
// //                 <FormControl component="fieldset" disabled={disableFields}>
// //                   <RadioGroup
// //                     row
// //                     value={treatingDrStatementCollectedDiscrepanciesFound}
// //                     onChange={(e) => setTreatingDrStatementCollectedDiscrepanciesFound(e.target.value)}
// //                   >
// //                     <FormControlLabel value="yes" control={<Radio />} label="Yes" />
// //                     <FormControlLabel value="no" control={<Radio />} label="No" />
// //                   </RadioGroup>
// //                 </FormControl>
// //               </Grid>
// //             </Grid>
// //           </Box>

// //           {/* Discrepancy Findings */}
// //           {treatingDrStatementCollectedDiscrepanciesFound === 'yes' && (
// //             <Box sx={{ mb: 3 }}>
// //               <Grid container spacing={2} alignItems="center">
// //                 <Grid size={{ xs: 4 }}>
// //                   <Typography>Discrepancy Findings</Typography>
// //                 </Grid>
// //                 <Grid size={{ xs: 8 }}>
// //                   <TextField
// //                     fullWidth
// //                     multiline
// //                     rows={3}
// //                     size="small"
// //                     value={treatingDrStatementCollectedDiscrepanciesFinding}
// //                     onChange={(e) => setTreatingDrStatementCollectedDiscrepanciesFinding(e.target.value)}
// //                     disabled={disableFields}
// //                   />
// //                 </Grid>
// //               </Grid>
// //             </Box>
// //           )}

// //           {/* PED Noted */}
// //           <Box sx={{ mb: 3 }}>
// //             <Grid container spacing={2} alignItems="center">
// //               <Grid size={{ xs: 4 }}>
// //                 <Typography>PED Noted</Typography>
// //               </Grid>
// //               <Grid size={{ xs: 8 }}>
// //                 <FormControl component="fieldset" disabled={disableFields}>
// //                   <RadioGroup
// //                     row
// //                     value={treatingDrStatementCollectedPEDNoted}
// //                     onChange={(e) => setTreatingDrStatementCollectedPEDNoted(e.target.value)}
// //                   >
// //                     <FormControlLabel value="yes" control={<Radio />} label="Yes" />
// //                     <FormControlLabel value="no" control={<Radio />} label="No" />
// //                   </RadioGroup>
// //                 </FormControl>
// //               </Grid>
// //             </Grid>
// //           </Box>

// //           {/* PED Findings */}
// //           {treatingDrStatementCollectedPEDNoted === 'yes' && (
// //             <Box sx={{ mb: 3 }}>
// //               <Grid container spacing={2} alignItems="center">
// //                 <Grid size={{ xs: 4 }}>
// //                   <Typography>PED Findings</Typography>
// //                 </Grid>
// //                 <Grid size={{ xs: 8 }}>
// //                   <TextField
// //                     fullWidth
// //                     multiline
// //                     rows={3}
// //                     size="small"
// //                     value={treatingDrStatementCollectedPEDNotedFinding}
// //                     onChange={(e) => setTreatingDrStatementCollectedPEDNotedFinding(e.target.value)}
// //                     disabled={disableFields}
// //                   />
// //                 </Grid>
// //               </Grid>
// //             </Box>
// //           )}
// //         </>
// //       )}

// //       {/* If Statement Collected = NO */}
// //       {treatingDrStatementCollected === 'no' && (
// //         <Box sx={{ mb: 3 }}>
// //           <Grid container spacing={2} alignItems="center">
// //             <Grid size={{ xs: 4 }}>
// //               <Typography>Reason</Typography>
// //             </Grid>
// //             <Grid size={{ xs: 8 }}>
// //               <TextField
// //                 fullWidth
// //                 multiline
// //                 rows={3}
// //                 size="small"
// //                 value={treatingDrStatementCollectedReason}
// //                 onChange={(e) => setTreatingDrStatementCollectedReason(e.target.value)}
// //                 disabled={disableFields}
// //               />
// //             </Grid>
// //           </Grid>
// //         </Box>
// //       )}
// //       {buttonEnable && (
// //         <Box sx={{ mb: 3 }}>
// //           <Button variant="contained" onClick={saveTableData}>
// //             Save Treating Doctor Data
// //           </Button>
// //         </Box>
// //       )}
// //     </Paper>
// //   );
// // };

// // export default TreatingDoctorDetails;

// // // Export the getSubmitData function reference if needed
// // // You can use React.forwardRef and useImperativeHandle for this

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Checkbox,
//   Button,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Paper,
//   Alert,
// } from '@mui/material';
// import { Add as AddIcon } from '@mui/icons-material';
// import alertService from '../../../services/alertService';
// import message from '../../../constants/messages';
// import { caseUpdateService } from '../../../services/reimCaseUpdateService';

// interface DoctorRow {
//   firstName?: string;
//   middleName?: string;
//   lastName?: string;
//   contactNo?: string;
//   regNo?: string;
//   qualification?: string;
//   stream?: string;
//   fraud?: boolean;
// }

// interface TreatingDoctorDetailsProps {
//   title?: string;
//   buttonEnable?: boolean;
//   previousData?: any;
// }

// const TreatingDoctorDetails: React.FC<TreatingDoctorDetailsProps> = ({
//   title = 'Treating Doctor Details',
//   buttonEnable = false,
//   previousData,
// }) => {
//   // State
//   const [rowData, setRowData] = useState<DoctorRow[]>([{}]);
//   const [treatingDrStatementCollected, setTreatingDrStatementCollected] = useState<string>('');
//   const [treatingDrStatementCollectedDiscrepanciesFound, setTreatingDrStatementCollectedDiscrepanciesFound] = useState<string>('');
//   const [treatingDrStatementCollectedDiscrepanciesFinding, setTreatingDrStatementCollectedDiscrepanciesFinding] = useState<string>('');
//   const [treatingDrStatementCollectedPEDNoted, setTreatingDrStatementCollectedPEDNoted] = useState<string>('');
//   const [treatingDrStatementCollectedPEDNotedFinding, setTreatingDrStatementCollectedPEDNotedFinding] = useState<string>('');
//   const [treatingDrStatementCollectedReason, setTreatingDrStatementCollectedReason] = useState<string>('');
//   const [showSuccess, setShowSuccess] = useState(false);

//   // Populate data when previousData changes
//   useEffect(() => {
//     if (previousData) {
//       populateData();
//     }
//   }, [previousData]);

//   const populateData = () => {
//     console.log("poiuy", previousData)
//     if (!previousData) return;

//     // Populate table rows
//     if (previousData.reCaseUpdateTreatingDocterDetailsDTO) {
//       setRowData(previousData.reCaseUpdateTreatingDocterDetailsDTO);
//       caseUpdateService.setCaseUpdateVal(
//         'reCaseUpdateTreatingDocterDetailsDTO',
//         previousData.reCaseUpdateTreatingDocterDetailsDTO
//       );
//     }

//     // Statement collected
//     if (previousData.treatingDrStatementCollected === true) {
//       setTreatingDrStatementCollected('yes');
//       caseUpdateService.setCaseUpdateVal('treatingDrStatementCollected', true);
//     } else if (previousData.treatingDrStatementCollected === false) {
//       setTreatingDrStatementCollected('no');
//       caseUpdateService.setCaseUpdateVal('treatingDrStatementCollected', false);
//     }

//     // Discrepancies found
//     if (previousData.treatingDrStatementCollectedDiscrepanciesFound === true) {
//       setTreatingDrStatementCollectedDiscrepanciesFound('yes');
//       caseUpdateService.setCaseUpdateVal('treatingDrStatementCollectedDiscrepanciesFound', true);
//     } else if (previousData.treatingDrStatementCollectedDiscrepanciesFound === false) {
//       setTreatingDrStatementCollectedDiscrepanciesFound('no');
//       caseUpdateService.setCaseUpdateVal('treatingDrStatementCollectedDiscrepanciesFound', false);
//     }

//     // Discrepancy finding
//     if (previousData.treatingDrStatementCollectedDiscrepanciesFinding) {
//       setTreatingDrStatementCollectedDiscrepanciesFinding(
//         previousData.treatingDrStatementCollectedDiscrepanciesFinding
//       );
//       caseUpdateService.setCaseUpdateVal(
//         'treatingDrStatementCollectedDiscrepanciesFinding',
//         previousData.treatingDrStatementCollectedDiscrepanciesFinding
//       );
//     }

//     // PED noted
//     if (previousData.treatingDrStatementCollectedPEDNoted === true) {
//       setTreatingDrStatementCollectedPEDNoted('yes');
//       caseUpdateService.setCaseUpdateVal('treatingDrStatementCollectedPEDNoted', true);
//     } else if (previousData.treatingDrStatementCollectedPEDNoted === false) {
//       setTreatingDrStatementCollectedPEDNoted('no');
//       caseUpdateService.setCaseUpdateVal('treatingDrStatementCollectedPEDNoted', false);
//     }

//     // PED finding
//     if (previousData.treatingDrStatementCollectedPEDNotedFinding) {
//       setTreatingDrStatementCollectedPEDNotedFinding(
//         previousData.treatingDrStatementCollectedPEDNotedFinding
//       );
//       caseUpdateService.setCaseUpdateVal(
//         'treatingDrStatementCollectedPEDNotedFinding',
//         previousData.treatingDrStatementCollectedPEDNotedFinding
//       );
//     }

//     // Reason
//     if (previousData.treatingDrStatementCollectedReason) {
//       setTreatingDrStatementCollectedReason(previousData.treatingDrStatementCollectedReason);
//       caseUpdateService.setCaseUpdateVal(
//         'treatingDrStatementCollectedReason',
//         previousData.treatingDrStatementCollectedReason
//       );
//     }
//   };

//   const addRow = () => {
//     setRowData([...rowData, {}]);
//   };

//   const updateRowData = (index: number, field: keyof DoctorRow, value: any) => {
//     const newRowData = [...rowData];
//     newRowData[index] = { ...newRowData[index], [field]: value };
//     setRowData(newRowData);
//   };

//   const saveTableData = () => {
//     caseUpdateService.setCaseUpdateVal('reCaseUpdateTreatingDocterDetailsDTO', rowData);
//     alertService.showAlertSuccess(message.treatingDocSaved);
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 3000);
//   };

//   const handleStatementCollectedChange = (value: string) => {
//     setTreatingDrStatementCollected(value);
//     const boolValue = value === 'yes';
//     caseUpdateService.setCaseUpdateVal('treatingDrStatementCollected', boolValue);
//   };

//   const handleDiscrepanciesFoundChange = (value: string) => {
//     setTreatingDrStatementCollectedDiscrepanciesFound(value);
//     const boolValue = value === 'yes';
//     caseUpdateService.setCaseUpdateVal('treatingDrStatementCollectedDiscrepanciesFound', boolValue);
//   };

//   const handleDiscrepanciesFindingChange = (value: string) => {
//     setTreatingDrStatementCollectedDiscrepanciesFinding(value);
//     caseUpdateService.setCaseUpdateVal('treatingDrStatementCollectedDiscrepanciesFinding', value);
//   };

//   const handlePEDNotedChange = (value: string) => {
//     setTreatingDrStatementCollectedPEDNoted(value);
//     const boolValue = value === 'yes';
//     caseUpdateService.setCaseUpdateVal('treatingDrStatementCollectedPEDNoted', boolValue);
//   };

//   const handlePEDNotedFindingChange = (value: string) => {
//     setTreatingDrStatementCollectedPEDNotedFinding(value);
//     caseUpdateService.setCaseUpdateVal('treatingDrStatementCollectedPEDNotedFinding', value);
//   };

//   const handleReasonChange = (value: string) => {
//     setTreatingDrStatementCollectedReason(value);
//     caseUpdateService.setCaseUpdateVal('treatingDrStatementCollectedReason', value);
//   };

//   return (
//     <Card sx={{ mb: 3, boxShadow: 2 }}>
//       <CardContent>
//         <Typography
//           variant="h6"
//           sx={{
//             mb: 3,
//             fontWeight: 600,
//             color: '#1976d2',
//             borderBottom: '2px solid #1976d2',
//             pb: 1,
//           }}
//         >
//           {title}
//         </Typography>

//         {showSuccess && (
//           <Alert severity="success" sx={{ mb: 2 }}>
//             {message.treatingDocSaved}
//           </Alert>
//         )}

//         {/* Treating Doctors Table */}
//         <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 1, overflowX:"auto" }}>
//           <Table size="small" sx={{ minWidth: 1100 }}>
//             <TableHead>
//               <TableRow sx={{ bgcolor: '#E0F2FE' }}>
//                 <TableCell sx={{ fontWeight: 600, width: '10px' }}>#</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Treating Doctor Name</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Contact No.</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Registration Number</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Qualification</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Stream</TableCell>
//                 <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
//                   To be tagged as Fraud / Caution?
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {rowData.map((row, idx) => (
//                 <TableRow key={idx} hover>
//                   <TableCell sx={{ width: '10px' }}>{idx + 1}</TableCell>
                  
//                   {/* Doctor Name (First, Middle, Last) */}
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <TextField
//                         size="small"
//                         placeholder="First"
//                         value={row.firstName || ''}
//                         onChange={(e) => updateRowData(idx, 'firstName', e.target.value)}
//                         disabled={!buttonEnable}
//                         sx={{ flex: 1, width:"50px" }}
//                       />
//                       <TextField
//                         size="small"
//                         placeholder="Middle"
//                         value={row.middleName || ''}
//                         onChange={(e) => updateRowData(idx, 'middleName', e.target.value)}
//                         disabled={!buttonEnable}
//                         sx={{ flex: 1 }}
//                       />
//                       <TextField
//                         size="small"
//                         placeholder="Last"
//                         value={row.lastName || ''}
//                         onChange={(e) => updateRowData(idx, 'lastName', e.target.value)}
//                         disabled={!buttonEnable}
//                         sx={{ flex: 1 }}
//                       />
//                     </Box>
//                   </TableCell>

//                   {/* Contact No */}
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       fullWidth
//                       value={row.contactNo || ''}
//                       onChange={(e) => updateRowData(idx, 'contactNo', e.target.value)}
//                       disabled={!buttonEnable}
//                       inputProps={{ maxLength: 10 }}
//                     />
//                   </TableCell>

//                   {/* Registration Number */}
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       fullWidth
//                       value={row.regNo || ''}
//                       onChange={(e) => updateRowData(idx, 'regNo', e.target.value)}
//                       disabled={!buttonEnable}
//                     />
//                   </TableCell>

//                   {/* Qualification */}
//                   <TableCell>
//                     <TextField
//                       size="small"
//                       fullWidth
//                       value={row.qualification || ''}
//                       onChange={(e) => updateRowData(idx, 'qualification', e.target.value)}
//                       disabled={!buttonEnable}
//                     />
//                   </TableCell>

//                   {/* Stream */}
//                   <TableCell>
//                     <FormControl size="small" fullWidth>
//                       <Select
//                         value={row.stream || ''}
//                         onChange={(e) => updateRowData(idx, 'stream', e.target.value)}
//                         disabled={!buttonEnable}
//                       >
//                         <MenuItem value="">Select</MenuItem>
//                         <MenuItem value="Allopathy">Allopathy</MenuItem>
//                         <MenuItem value="Homeopathy">Homeopathy</MenuItem>
//                         <MenuItem value="Ayurvedic">Ayurvedic</MenuItem>
//                         <MenuItem value="Unani">Unani</MenuItem>
//                         <MenuItem value="Naturapathy">Naturapathy</MenuItem>
//                         <MenuItem value="Others">Others</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </TableCell>

//                   {/* Fraud Checkbox */}
//                   <TableCell sx={{ textAlign: 'center' }}>
//                     <Checkbox
//                       checked={row.fraud || false}
//                       onChange={(e) => updateRowData(idx, 'fraud', e.target.checked)}
//                       disabled={!buttonEnable}
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Add More Button */}
//         {buttonEnable && (
//           <Box sx={{ mb: 3 }}>
//             <Button
//               variant="text"
//               startIcon={<AddIcon />}
//               onClick={addRow}
//               sx={{ color: '#1976d2', textTransform: 'none' }}
//             >
//               Add More
//             </Button>
//           </Box>
//         )}

//         {/* Save Button */}
//         {buttonEnable && (
//           <Box sx={{ mb: 3 }}>
//             <Button
//               variant="contained"
//               onClick={saveTableData}
//               sx={{
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
//                 },
//               }}
//             >
//               Save Treating Doctor Data
//             </Button>
//           </Box>
//         )}

//         {/* Statement Collected */}
//         <Box sx={{ mb: 3 }}>
//           <FormControl fullWidth>
//             <InputLabel>Statement collected</InputLabel>
//             <Select
//               value={treatingDrStatementCollected}
//               onChange={(e) => handleStatementCollectedChange(e.target.value)}
//               disabled={!buttonEnable}
//               label="Statement collected"
//             >
//               <MenuItem value="">Select</MenuItem>
//               <MenuItem value="yes">Yes</MenuItem>
//               <MenuItem value="no">No</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         {/* Conditional: Statement Collected = Yes */}
//         {treatingDrStatementCollected === 'yes' && (
//           <Box>
//             {/* Discrepancies Found */}
//             <Box sx={{ mb: 3 }}>
//               <Typography variant="subtitle2" sx={{ mb: 1 }}>
//                 Discrepancies found
//               </Typography>
//               <RadioGroup
//                 value={treatingDrStatementCollectedDiscrepanciesFound}
//                 onChange={(e) => handleDiscrepanciesFoundChange(e.target.value)}
//               >
//                 <FormControlLabel
//                   value="yes"
//                   control={<Radio />}
//                   label="Yes"
//                   disabled={!buttonEnable}
//                 />
//                 <FormControlLabel
//                   value="no"
//                   control={<Radio />}
//                   label="No"
//                   disabled={!buttonEnable}
//                 />
//               </RadioGroup>
//             </Box>

//             {/* Conditional: Discrepancies Found = Yes */}
//             {treatingDrStatementCollectedDiscrepanciesFound === 'yes' && (
//               <Box sx={{ mb: 3 }}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={4}
//                   label="Discrepancy Findings"
//                   value={treatingDrStatementCollectedDiscrepanciesFinding}
//                   onChange={(e) => handleDiscrepanciesFindingChange(e.target.value)}
//                   disabled={!buttonEnable}
//                 />
//               </Box>
//             )}

//             {/* PED Noted */}
//             <Box sx={{ mb: 3 }}>
//               <Typography variant="subtitle2" sx={{ mb: 1 }}>
//                 PED Noted
//               </Typography>
//               <RadioGroup
//                 value={treatingDrStatementCollectedPEDNoted}
//                 onChange={(e) => handlePEDNotedChange(e.target.value)}
//               >
//                 <FormControlLabel
//                   value="yes"
//                   control={<Radio />}
//                   label="Yes"
//                   disabled={!buttonEnable}
//                 />
//                 <FormControlLabel
//                   value="no"
//                   control={<Radio />}
//                   label="No"
//                   disabled={!buttonEnable}
//                 />
//               </RadioGroup>
//             </Box>

//             {/* Conditional: PED Noted = Yes */}
//             {treatingDrStatementCollectedPEDNoted === 'yes' && (
//               <Box sx={{ mb: 3 }}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={4}
//                   label="PED Findings"
//                   value={treatingDrStatementCollectedPEDNotedFinding}
//                   onChange={(e) => handlePEDNotedFindingChange(e.target.value)}
//                   disabled={!buttonEnable}
//                 />
//               </Box>
//             )}
//           </Box>
//         )}

//         {/* Conditional: Statement Collected = No */}
//         {treatingDrStatementCollected === 'no' && (
//           <Box sx={{ mb: 3 }}>
//             <TextField
//               fullWidth
//               multiline
//               rows={4}
//               label="Reason"
//               value={treatingDrStatementCollectedReason}
//               onChange={(e) => handleReasonChange(e.target.value)}
//               disabled={!buttonEnable}
//             />
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default TreatingDoctorDetails;



import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import alertService from '../../../services/alertService';
import message from '../../../constants/messages';

interface DoctorRow {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  contactNo?: string;
  regNo?: string;
  qualification?: string;
  stream?: string;
  fraud?: boolean;
}

interface HospitalFormState {
  reCaseUpdateTreatingDocterDetailsDTO: DoctorRow[];
  treatingDrStatementCollected: boolean | null;
  treatingDrStatementCollectedDiscrepanciesFound: boolean | null;
  treatingDrStatementCollectedDiscrepanciesFinding: string;
  treatingDrStatementCollectedPEDNoted: boolean | null;
  treatingDrStatementCollectedPEDNotedFinding: string;
  treatingDrStatementCollectedReason: string;
  [key: string]: any;
}

interface TreatingDoctorDetailsProps {
  title?: string;
  buttonEnable?: boolean;
  formState: HospitalFormState;
  updateFormState: (field: keyof HospitalFormState, value: any) => void;
}

const TreatingDoctorDetails: React.FC<TreatingDoctorDetailsProps> = ({
  title = 'Treating Doctor Details',
  buttonEnable = false,
  formState,
  updateFormState,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [localDoctors, setLocalDoctors] = useState<DoctorRow[]>(formState.reCaseUpdateTreatingDocterDetailsDTO);

  // Sync local state with parent state
  useEffect(() => {
    setLocalDoctors(formState.reCaseUpdateTreatingDocterDetailsDTO);
  }, [formState.reCaseUpdateTreatingDocterDetailsDTO]);

  const addRow = () => {
    const newDoctors = [...localDoctors, {}];
    setLocalDoctors(newDoctors);
  };

  const updateRowData = (index: number, field: keyof DoctorRow, value: any) => {
    const newDoctors = [...localDoctors];
    newDoctors[index] = { ...newDoctors[index], [field]: value };
    setLocalDoctors(newDoctors);
  };

  const saveTableData = () => {
    updateFormState('reCaseUpdateTreatingDocterDetailsDTO', localDoctors);
    alertService.showAlertSuccess(message.treatingDocSaved);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleStatementCollectedChange = (value: string) => {
    const boolValue = value === 'yes';
    updateFormState('treatingDrStatementCollected', boolValue);
  };

  const handleDiscrepanciesFoundChange = (value: string) => {
    const boolValue = value === 'yes';
    updateFormState('treatingDrStatementCollectedDiscrepanciesFound', boolValue);
  };

  const handleDiscrepanciesFindingChange = (value: string) => {
    updateFormState('treatingDrStatementCollectedDiscrepanciesFinding', value);
  };

  const handlePEDNotedChange = (value: string) => {
    const boolValue = value === 'yes';
    updateFormState('treatingDrStatementCollectedPEDNoted', boolValue);
  };

  const handlePEDNotedFindingChange = (value: string) => {
    updateFormState('treatingDrStatementCollectedPEDNotedFinding', value);
  };

  const handleReasonChange = (value: string) => {
    updateFormState('treatingDrStatementCollectedReason', value);
  };

  // Convert boolean to string for select/radio display
  const getStatementCollectedValue = () => {
    if (formState.treatingDrStatementCollected === true) return 'yes';
    if (formState.treatingDrStatementCollected === false) return 'no';
    return '';
  };

  const getDiscrepanciesFoundValue = () => {
    if (formState.treatingDrStatementCollectedDiscrepanciesFound === true) return 'yes';
    if (formState.treatingDrStatementCollectedDiscrepanciesFound === false) return 'no';
    return '';
  };

  const getPEDNotedValue = () => {
    if (formState.treatingDrStatementCollectedPEDNoted === true) return 'yes';
    if (formState.treatingDrStatementCollectedPEDNoted === false) return 'no';
    return '';
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: '#1976d2',
            borderBottom: '2px solid #1976d2',
            pb: 1,
          }}
        >
          {title}
        </Typography>

        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message.treatingDocSaved}
          </Alert>
        )}

        {/* Treating Doctors Table */}
        <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 1, overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#E0F2FE' }}>
                <TableCell sx={{ fontWeight: 600, width: '10px' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Treating Doctor Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact No.</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Registration Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Qualification</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stream</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                  To be tagged as Fraud / Caution?
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localDoctors.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell sx={{ width: '10px' }}>{idx + 1}</TableCell>

                  {/* Doctor Name (First, Middle, Last) */}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        size="small"
                        placeholder="First"
                        value={row.firstName || ''}
                        onChange={(e) => updateRowData(idx, 'firstName', e.target.value)}
                        disabled={!buttonEnable}
                        sx={{ flex: 1, width: "50px" }}
                      />
                      <TextField
                        size="small"
                        placeholder="Middle"
                        value={row.middleName || ''}
                        onChange={(e) => updateRowData(idx, 'middleName', e.target.value)}
                        disabled={!buttonEnable}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        size="small"
                        placeholder="Last"
                        value={row.lastName || ''}
                        onChange={(e) => updateRowData(idx, 'lastName', e.target.value)}
                        disabled={!buttonEnable}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </TableCell>

                  {/* Contact No */}
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      value={row.contactNo || ''}
                      onChange={(e) => updateRowData(idx, 'contactNo', e.target.value)}
                      disabled={!buttonEnable}
                      inputProps={{ maxLength: 10 }}
                    />
                  </TableCell>

                  {/* Registration Number */}
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      value={row.regNo || ''}
                      onChange={(e) => updateRowData(idx, 'regNo', e.target.value)}
                      disabled={!buttonEnable}
                    />
                  </TableCell>

                  {/* Qualification */}
                  <TableCell>
                    <TextField
                      size="small"
                      fullWidth
                      value={row.qualification || ''}
                      onChange={(e) => updateRowData(idx, 'qualification', e.target.value)}
                      disabled={!buttonEnable}
                    />
                  </TableCell>

                  {/* Stream */}
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={row.stream || ''}
                        onChange={(e) => updateRowData(idx, 'stream', e.target.value)}
                        disabled={!buttonEnable}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="Allopathy">Allopathy</MenuItem>
                        <MenuItem value="Homeopathy">Homeopathy</MenuItem>
                        <MenuItem value="Ayurvedic">Ayurvedic</MenuItem>
                        <MenuItem value="Unani">Unani</MenuItem>
                        <MenuItem value="Naturapathy">Naturapathy</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>

                  {/* Fraud Checkbox */}
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Checkbox
                      checked={row.fraud || false}
                      onChange={(e) => updateRowData(idx, 'fraud', e.target.checked)}
                      disabled={!buttonEnable}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add More Button */}
        {buttonEnable && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="text"
              startIcon={<AddIcon />}
              onClick={addRow}
              sx={{ color: '#1976d2', textTransform: 'none' }}
            >
              Add More
            </Button>
          </Box>
        )}

        {/* Save Button */}
        {buttonEnable && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              onClick={saveTableData}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                },
              }}
            >
              Save Treating Doctor Data
            </Button>
          </Box>
        )}

        {/* Statement Collected */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Statement collected</InputLabel>
            <Select
              value={getStatementCollectedValue()}
              onChange={(e) => handleStatementCollectedChange(e.target.value)}
              disabled={!buttonEnable}
              label="Statement collected"
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Conditional: Statement Collected = Yes */}
        {formState.treatingDrStatementCollected === true && (
          <Box>
            {/* Discrepancies Found */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Discrepancies found
              </Typography>
              <RadioGroup
                value={getDiscrepanciesFoundValue()}
                onChange={(e) => handleDiscrepanciesFoundChange(e.target.value)}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Yes"
                  disabled={!buttonEnable}
                />
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label="No"
                  disabled={!buttonEnable}
                />
              </RadioGroup>
            </Box>

            {/* Conditional: Discrepancies Found = Yes */}
            {formState.treatingDrStatementCollectedDiscrepanciesFound === true && (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Discrepancy Findings"
                  value={formState.treatingDrStatementCollectedDiscrepanciesFinding}
                  onChange={(e) => handleDiscrepanciesFindingChange(e.target.value)}
                  disabled={!buttonEnable}
                />
              </Box>
            )}

            {/* PED Noted */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                PED Noted
              </Typography>
              <RadioGroup
                value={getPEDNotedValue()}
                onChange={(e) => handlePEDNotedChange(e.target.value)}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Yes"
                  disabled={!buttonEnable}
                />
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label="No"
                  disabled={!buttonEnable}
                />
              </RadioGroup>
            </Box>

            {/* Conditional: PED Noted = Yes */}
            {formState.treatingDrStatementCollectedPEDNoted === true && (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="PED Findings"
                  value={formState.treatingDrStatementCollectedPEDNotedFinding}
                  onChange={(e) => handlePEDNotedFindingChange(e.target.value)}
                  disabled={!buttonEnable}
                />
              </Box>
            )}
          </Box>
        )}

        {/* Conditional: Statement Collected = No */}
        {formState.treatingDrStatementCollected === false && (
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Reason"
              value={formState.treatingDrStatementCollectedReason}
              onChange={(e) => handleReasonChange(e.target.value)}
              disabled={!buttonEnable}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TreatingDoctorDetails;