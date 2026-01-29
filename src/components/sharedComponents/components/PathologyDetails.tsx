// // PathologyDetails.tsx - FIXED VERSION

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   TextField,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   Select,
//   MenuItem,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import DropdownService from '../../../services/dropdown.service';
// import { caseUpdateService } from '../../../services/reimCaseUpdateService';

// interface PathologyDetail {
//   isPathologist?: boolean;
//   pathologistName?: string;
//   pathologistContactNumber?: string;
//   pathologistRegistrationNumber?: string;
//   pathologistFeedback?: string;
//   pathologistFinding?: string;
//   labReportVerified?: boolean;
//   labReportVerifiedReason?: string;
//   labReportVerifiedObservation?: string;
//   labReportVerifiedObservationDetails?: string;
//   labReportVerifiedFinding?: string;
//   pathFraud?: boolean;
//   labInHouse?: boolean;
//   labName?: string;
//   labAddress?: string;
//   labState?: string;
//   labCity?: string;
//   labPin?: string;
//   labLicenceNumber?: string;
//   labGstNum?: string;
// }

// interface PathologyDetailsProps {
//   buttonEnable: boolean;
//   previousData?: any;
// }

// const PathologyDetails: React.FC<PathologyDetailsProps> = ({
//   buttonEnable,
//   previousData
// }) => {
//   // Main state - synchronized with service
//   const [isLabExists, setIsLabExists] = useState('');
//   const [labExistFinding, setLabExistFinding] = useState('');
//   const [labData, setLabData] = useState<PathologyDetail[]>([]);

//   // Modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [states, setStates] = useState<any[]>([]);
//   const [cities, setCities] = useState<any[]>([]);

//   // Modal form fields
//   const [isPathologist, setIsPathologist] = useState('');
//   const [pathologistName, setPathologistName] = useState('');
//   const [pathologistContactNumber, setPathologistContactNumber] = useState('');
//   const [pathologistRegistrationNumber, setPathologistRegistrationNumber] = useState('');
//   const [pathologistFeedback, setPathologistFeedback] = useState('');
//   const [pathologistFinding, setPathologistFinding] = useState('');
//   const [labReportVerified, setLabReportVerified] = useState('');
//   const [labReportVerifiedReason, setLabReportVerifiedReason] = useState('');
//   const [labReportVerifiedObservation, setLabReportVerifiedObservation] = useState('');
//   const [labReportVerifiedObservationDetails, setLabReportVerifiedObservationDetails] = useState('');
//   const [labReportVerifiedFinding, setLabReportVerifiedFinding] = useState('');
//   const [pathFraud, setPathFraud] = useState('');
//   const [labInHouse, setLabInHouse] = useState('');
//   const [labName, setLabName] = useState('');
//   const [labAddress, setLabAddress] = useState('');
//   const [labState, setLabState] = useState('');
//   const [labCity, setLabCity] = useState('');
//   const [labPin, setLabPin] = useState('');
//   const [labLicence, setLabLicence] = useState('');
//   const [labGstNum, setLabGstNum] = useState('');

//   // Populate data from previousData - matches Angular's ngOnChanges
//   useEffect(() => {
//     if (previousData) {
//       populateData();
//     }
//   }, [previousData]);

//   const populateData = () => {
//     if (!previousData) return;

//     // Set lab data
//     if (previousData.reCaseUpdatePathologyDetailsDTO) {
//       setLabData(previousData.reCaseUpdatePathologyDetailsDTO);
//       caseUpdateService.setCaseUpdateVal('reCaseUpdatePathologyDetailsDTO', previousData.reCaseUpdatePathologyDetailsDTO);
//     }

//     // Set lab exist status
//     if (previousData.labExist === true) {
//       setIsLabExists('1');
//       caseUpdateService.setCaseUpdateVal('labExist', true);
//     } else if (previousData.labExist === false) {
//       setIsLabExists('0');
//       caseUpdateService.setCaseUpdateVal('labExist', false);
//       setLabExistFinding(previousData.labExistFinding || '');
//       caseUpdateService.setCaseUpdateVal('labExistFinding', previousData.labExistFinding);
//     }
//   };

//   // Matches Angular's pathologyExists(e)
//   const pathologyExists = (value: string) => {
//     setIsLabExists(value);

//     if (value === '1') {
//       caseUpdateService.setCaseUpdateVal('labExist', true);
//     } else if (value === '0') {
//       caseUpdateService.setCaseUpdateVal('labExist', false);
//       caseUpdateService.setCaseUpdateVal('labExistFinding', labExistFinding);
//     }
//   };

//   // Matches Angular's changepathologyExistFinding(e)
//   const changepathologyExistFinding = (value: string) => {
//     setLabExistFinding(value);
//     caseUpdateService.setCaseUpdateVal('labExistFinding', value);
//   };

//   // Fetch states
//   const fetchAllStates = async () => {
//     try {
//       const response = await DropdownService.getStates();
//       if (response.statusCode === 0) {
//         setStates(response.payload || []);
//       }
//     } catch (error) {
//       console.error('Error fetching states:', error);
//     }
//   };

//   // Fetch cities
//   const getCity = async (stateCode: string) => {
//     try {
//       const response = await DropdownService.getCities(stateCode);
//       if (response.statusCode === 0) {
//         setCities(response.payload || []);
//       }
//     } catch (error) {
//       console.error('Error fetching cities:', error);
//     }
//   };

//   // Open modal
//   const openModal = () => {
//     resetValue();
//     fetchAllStates();
//     setModalOpen(true);
//   };

//   // Close modal
//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   // Reset modal values - matches Angular's resetValue()
//   const resetValue = () => {
//     setIsPathologist('');
//     setPathologistName('');
//     setPathologistContactNumber('');
//     setPathologistRegistrationNumber('');
//     setPathologistFeedback('');
//     setPathologistFinding('');
//     setLabReportVerified('');
//     setLabReportVerifiedReason('');
//     setLabReportVerifiedObservation('');
//     setLabReportVerifiedObservationDetails('');
//     setLabReportVerifiedFinding('');
//     setPathFraud('');
//     setLabInHouse('');
//     setLabName('');
//     setLabAddress('');
//     setLabState('');
//     setLabCity('');
//     setLabPin('');
//     setLabLicence('');
//     setLabGstNum('');
//     setCities([]);
//   };

//   // Add lab details - matches Angular's addLabDetails(id)
//   const addLabDetails = () => {
//     const ch: PathologyDetail = {
//       labName,
//       labAddress,
//       labState,
//       labCity,
//       labLicenceNumber: labLicence
//     };

//     if (labInHouse === 'yes') {
//       ch.labInHouse = true;
//     } else if (labInHouse === 'no') {
//       ch.labInHouse = false;
//     }

//     if (isPathologist === '1') {
//       ch.isPathologist = true;
//       ch.pathologistName = pathologistName;
//       ch.pathologistContactNumber = pathologistContactNumber;
//       ch.pathologistRegistrationNumber = pathologistRegistrationNumber;
//       ch.pathologistFeedback = pathologistFeedback;
//       if (pathologistFeedback === 'Suspected' || pathologistFeedback === 'Involved in Fraudulent claims') {
//         ch.pathologistFinding = pathologistFinding;
//       }
//     } else if (isPathologist === '0') {
//       ch.isPathologist = false;
//       ch.pathologistFinding = pathologistFinding;
//     }

//     if (labReportVerified === '1') {
//       ch.labReportVerified = true;
//     } else if (labReportVerified === '0') {
//       ch.labReportVerified = false;
//       ch.labReportVerifiedReason = labReportVerifiedReason;
//     }

//     if (pathFraud === '1') {
//       ch.pathFraud = true;
//     } else if (pathFraud === '0') {
//       ch.pathFraud = false;
//     }

//     ch.labReportVerifiedObservation = labReportVerifiedObservation;
//     if (labReportVerifiedObservation === 'Discrepancy') {
//       ch.labReportVerifiedObservationDetails = labReportVerifiedObservationDetails;
//       ch.labReportVerifiedFinding = labReportVerifiedFinding;
//     }

//     const updatedLabData = [...labData, ch];
//     setLabData(updatedLabData);
//     caseUpdateService.setCaseUpdateVal('reCaseUpdatePathologyDetailsDTO', updatedLabData);

//     closeModal();
//   };

//   // Helper function
//   const changeVal = (value: any): string => {
//     if (value === true) return 'Yes';
//     if (value === false) return 'No';
//     return '';
//   };

//   // Handle state change
//   const handleStateChange = (stateCode: string) => {
//     setLabState(stateCode);
//     setLabCity('');
//     setCities([]);
//     if (stateCode) {
//       getCity(stateCode);
//     }
//   };

//   return (
//     <Paper sx={{ p: 3, mt: 2 }}>
//       <Typography variant="h6" gutterBottom sx={{ fontSize: '14px', fontWeight: 'bold' }}>
//         Lab Details
//       </Typography>

//       {/* Does the lab exist */}
//       <Box sx={{ mb: 3 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid size={{ xs: 4 }}>
//             <Typography>Does the lab Exists</Typography>
//           </Grid>
//           <Grid size={{ xs: 8 }}>
//             <RadioGroup
//               row
//               value={isLabExists}
//               onChange={(e) => pathologyExists(e.target.value)}
//             >
//               <FormControlLabel
//                 value="1"
//                 control={<Radio />}
//                 label="Yes"
//                 disabled={!buttonEnable}
//               />
//               <FormControlLabel
//                 value="0"
//                 control={<Radio />}
//                 label="No"
//                 disabled={!buttonEnable}
//               />
//             </RadioGroup>
//           </Grid>
//         </Grid>
//       </Box>

//       {/* If Lab Exists = NO - Findings */}
//       {isLabExists === '0' && (
//         <Box sx={{ mb: 3 }}>
//           <Grid container spacing={2}>
//             <Grid size={{ xs: 4 }}>
//               <Typography>Findings</Typography>
//             </Grid>
//             <Grid size={{ xs: 8 }}>
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={3}
//                 size="small"
//                 value={labExistFinding}
//                 onChange={(e) => changepathologyExistFinding(e.target.value)}
//                 disabled={!buttonEnable}
//               />
//             </Grid>
//           </Grid>
//         </Box>
//       )}

//       {/* If Lab Exists = YES */}
//       {isLabExists === '1' && (
//         <>
//           {/* Add Button */}
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
//             {buttonEnable && (
//               <Button variant="contained" onClick={openModal}>
//                 +Details Of Pathologist
//               </Button>
//             )}
//           </Box>

//           {/* Lab Data Table */}
//           {labData.length > 0 && (
//             <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, maxHeight: 500, overflow: 'auto' }}>
//               <Table size="small" stickyHeader>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Pathologist Attached?</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Pathologist Name</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Contact Number</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Registration Number</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Pathologist Feedback</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Lab Report Verified?</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Observation</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Pathologist to be tagged as fraud/Caution?</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Is Lab Inhouse?</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Lab name</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Address</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>City</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>State</TableCell>
//                     <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>License No.</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {labData.map((lab, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{changeVal(lab.isPathologist)}</TableCell>
//                       <TableCell>{lab.pathologistName}</TableCell>
//                       <TableCell>{lab.pathologistContactNumber}</TableCell>
//                       <TableCell>{lab.pathologistRegistrationNumber}</TableCell>
//                       <TableCell>{lab.pathologistFeedback}</TableCell>
//                       <TableCell>{changeVal(lab.labReportVerified)}</TableCell>
//                       <TableCell>{lab.labReportVerifiedObservation}</TableCell>
//                       <TableCell>{changeVal(lab.pathFraud)}</TableCell>
//                       <TableCell>{changeVal(lab.labInHouse)}</TableCell>
//                       <TableCell>{lab.labName}</TableCell>
//                       <TableCell>{lab.labAddress}</TableCell>
//                       <TableCell>{lab.labCity}</TableCell>
//                       <TableCell>{lab.labState}</TableCell>
//                       <TableCell>{lab.labLicenceNumber}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//         </>
//       )}

//       {/* Modal Dialog */}
//       <Dialog
//         open={modalOpen}
//         onClose={closeModal}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           Details Of Pathologist
//           <IconButton
//             onClick={closeModal}
//             sx={{ position: 'absolute', right: 8, top: 8 }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent sx={{ maxHeight: '500px', overflowY: 'auto' }}>
//           <Box sx={{ pt: 2 }}>
//             {/* Is Pathologist attached */}
//             <Box sx={{ mb: 3 }}>
//               <Grid container spacing={2} alignItems="center">
//                 <Grid size={{ xs: 4 }}>
//                   <Typography>Is Pathologist attached?</Typography>
//                 </Grid>
//                 <Grid size={{ xs: 8 }}>
//                   <RadioGroup
//                     row
//                     value={isPathologist}
//                     onChange={(e) => setIsPathologist(e.target.value)}
//                   >
//                     <FormControlLabel value="1" control={<Radio />} label="Yes" />
//                     <FormControlLabel value="0" control={<Radio />} label="No" />
//                   </RadioGroup>
//                 </Grid>
//               </Grid>
//             </Box>

//             {/* If Pathologist = YES */}
//             {isPathologist === '1' && (
//               <>
//                 <Box sx={{ mb: 2 }}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 4 }}><Typography>Pathologist Name</Typography></Grid>
//                     <Grid size={{ xs: 8 }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={pathologistName}
//                         onChange={(e) => setPathologistName(e.target.value)}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 4 }}><Typography>Contact Number</Typography></Grid>
//                     <Grid size={{ xs: 8 }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={pathologistContactNumber}
//                         onChange={(e) => {
//                           const value = e.target.value.replace(/\D/g, '').slice(0, 10);
//                           setPathologistContactNumber(value);
//                         }}
//                         inputProps={{ maxLength: 10 }}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 4 }}><Typography>Registration Number</Typography></Grid>
//                     <Grid size={{ xs: 8 }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={pathologistRegistrationNumber}
//                         onChange={(e) => setPathologistRegistrationNumber(e.target.value)}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 4 }}><Typography>Pathologists Feedback</Typography></Grid>
//                     <Grid size={{ xs: 4 }}>
//                       <FormControl fullWidth size="small">
//                         <Select
//                           value={pathologistFeedback}
//                           onChange={(e) => setPathologistFeedback(e.target.value)}
//                         >
//                           <MenuItem value="">Select</MenuItem>
//                           <MenuItem value="Genuine">Genuine</MenuItem>
//                           <MenuItem value="Suspected">Suspected</MenuItem>
//                           <MenuItem value="Involved in Fraudulent claims">Involved in Fraudulent claims</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 {(pathologistFeedback === 'Suspected' || pathologistFeedback === 'Involved in Fraudulent claims') && (
//                   <Box sx={{ mb: 2 }}>
//                     <Grid container spacing={2}>
//                       <Grid size={{ xs: 4 }}><Typography>Findings</Typography></Grid>
//                       <Grid size={{ xs: 8 }}>
//                         <TextField
//                           fullWidth
//                           multiline
//                           rows={3}
//                           size="small"
//                           value={pathologistFinding}
//                           onChange={(e) => setPathologistFinding(e.target.value)}
//                         />
//                       </Grid>
//                     </Grid>
//                   </Box>
//                 )}
//               </>
//             )}

//             {/* If Pathologist = NO - Findings */}
//             {isPathologist === '0' && (
//               <Box sx={{ mb: 2 }}>
//                 <Grid container spacing={2}>
//                   <Grid size={{ xs: 4 }}><Typography>Findings</Typography></Grid>
//                   <Grid size={{ xs: 8 }}>
//                     <TextField
//                       fullWidth
//                       multiline
//                       rows={3}
//                       size="small"
//                       value={pathologistFinding}
//                       onChange={(e) => setPathologistFinding(e.target.value)}
//                     />
//                   </Grid>
//                 </Grid>
//               </Box>
//             )}

//             {/* Lab Report Verified */}
//             <Box sx={{ mb: 3 }}>
//               <Grid container spacing={2} alignItems="center">
//                 <Grid size={{ xs: 4 }}><Typography>Lab Report Verified?</Typography></Grid>
//                 <Grid size={{ xs: 8 }}>
//                   <RadioGroup
//                     row
//                     value={labReportVerified}
//                     onChange={(e) => setLabReportVerified(e.target.value)}
//                   >
//                     <FormControlLabel value="1" control={<Radio />} label="Yes" />
//                     <FormControlLabel value="0" control={<Radio />} label="No" />
//                   </RadioGroup>
//                 </Grid>
//               </Grid>
//             </Box>

//             {labReportVerified === '0' && (
//               <Box sx={{ mb: 2 }}>
//                 <Grid container spacing={2}>
//                   <Grid size={{ xs: 4 }}><Typography>Reason</Typography></Grid>
//                   <Grid size={{ xs: 8 }}>
//                     <TextField
//                       fullWidth
//                       multiline
//                       rows={3}
//                       size="small"
//                       value={labReportVerifiedReason}
//                       onChange={(e) => setLabReportVerifiedReason(e.target.value)}
//                     />
//                   </Grid>
//                 </Grid>
//               </Box>
//             )}

//             {/* Observation */}
//             <Box sx={{ mb: 2 }}>
//               <Grid container spacing={2} alignItems="center">
//                 <Grid size={{ xs: 4 }}><Typography>Observation</Typography></Grid>
//                 <Grid size={{ xs: 4 }}>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={labReportVerifiedObservation}
//                       onChange={(e) => setLabReportVerifiedObservation(e.target.value)}
//                     >
//                       <MenuItem value="">Select</MenuItem>
//                       <MenuItem value="Genuine">Genuine</MenuItem>
//                       <MenuItem value="Discrepancy">Discrepancy</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               </Grid>
//             </Box>

//             {labReportVerifiedObservation === 'Discrepancy' && (
//               <>
//                 <Box sx={{ mb: 2 }}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 4 }}></Grid>
//                     <Grid size={{ xs: 4 }}>
//                       <FormControl fullWidth size="small">
//                         <Select
//                           value={labReportVerifiedObservationDetails}
//                           onChange={(e) => setLabReportVerifiedObservationDetails(e.target.value)}
//                         >
//                           <MenuItem value="">Select</MenuItem>
//                           <MenuItem value="Not Issued by lab">Not Issued by lab</MenuItem>
//                           <MenuItem value="Not seen by pathologist">Not seen by pathologist</MenuItem>
//                           <MenuItem value="Amount inflated">Amount inflated</MenuItem>
//                           <MenuItem value="Format not matching">Format not matching</MenuItem>
//                           <MenuItem value="Bills not paid">Bills not paid</MenuItem>
//                           <MenuItem value="Others">Others</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                   <Grid container spacing={2}>
//                     <Grid size={{ xs: 4 }}><Typography>Findings</Typography></Grid>
//                     <Grid size={{ xs: 8 }}>
//                       <TextField
//                         fullWidth
//                         multiline
//                         rows={3}
//                         size="small"
//                         value={labReportVerifiedFinding}
//                         onChange={(e) => setLabReportVerifiedFinding(e.target.value)}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Box>
//               </>
//             )}

//             {/* Pathologist to be tagged as fraud */}
//             <Box sx={{ mb: 3 }}>
//               <Grid container spacing={2} alignItems="center">
//                 <Grid size={{ xs: 4 }}><Typography>Pathologist to be tagged as fraud/Caution?</Typography></Grid>
//                 <Grid size={{ xs: 8 }}>
//                   <RadioGroup
//                     row
//                     value={pathFraud}
//                     onChange={(e) => setPathFraud(e.target.value)}
//                   >
//                     <FormControlLabel value="1" control={<Radio />} label="Yes" />
//                     <FormControlLabel value="0" control={<Radio />} label="No" />
//                   </RadioGroup>
//                 </Grid>
//               </Grid>
//             </Box>

//             {/* If Fraud = YES - Lab Details */}
//             {pathFraud === '1' && (
//               <>
//                 <Box sx={{ mb: 2 }}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 4 }}><Typography>is Lab Inhouse?</Typography></Grid>
//                     <Grid size={{ xs: 4 }}>
//                       <FormControl fullWidth size="small">
//                         <Select
//                           value={labInHouse}
//                           onChange={(e) => setLabInHouse(e.target.value)}
//                         >
//                           <MenuItem value="">Select</MenuItem>
//                           <MenuItem value="yes">Yes</MenuItem>
//                           <MenuItem value="no">No</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 4 }}><Typography>Name</Typography></Grid>
//                     <Grid size={{ xs: 8 }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={labName}
//                         onChange={(e) => setLabName(e.target.value)}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                   <Grid container spacing={2}>
//                     <Grid size={{ xs: 4 }}><Typography>Address</Typography></Grid>
//                     <Grid size={{ xs: 8 }}>
//                       <TextField
//                         fullWidth
//                         multiline
//                         rows={3}
//                         size="small"
//                         value={labAddress}
//                         onChange={(e) => setLabAddress(e.target.value)}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 2 }}><Typography>State</Typography></Grid>
//                     <Grid size={{ xs: 4 }}>
//                       <FormControl fullWidth size="small">
//                         <Select
//                           value={labState}
//                           onChange={(e) => handleStateChange(e.target.value)}
//                         >
//                           <MenuItem value="">Select</MenuItem>
//                           {states.map((state) => (
//                             <MenuItem key={state.stateCode} value={state.stateCode}>
//                               {state.stateName}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                     <Grid size={{ xs: 2 }}><Typography>City</Typography></Grid>
//                     <Grid size={{ xs: 4 }}>
//                       <FormControl fullWidth size="small">
//                         <Select
//                           value={labCity}
//                           onChange={(e) => setLabCity(e.target.value)}
//                           disabled={!labState}
//                         >
//                           <MenuItem value="">Select</MenuItem>
//                           {cities.map((city) => (
//                             <MenuItem key={city.cityCode} value={city.cityCode}>
//                               {city.cityName}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 4 }}><Typography>Pin Code</Typography></Grid>
//                     <Grid size={{ xs: 8 }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={labPin}
//                         onChange={(e) => setLabPin(e.target.value)}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 <Box sx={{ mb: 2 }}>
//                   <Grid container spacing={2} alignItems="center">
//                     <Grid size={{ xs: 2 }}><Typography>Licence Number</Typography></Grid>
//                     <Grid size={{ xs: 4 }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={labLicence}
//                         onChange={(e) => setLabLicence(e.target.value)}
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 2 }}><Typography>GST No.</Typography></Grid>
//                     <Grid size={{ xs: 4 }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         value={labGstNum}
//                         onChange={(e) => setLabGstNum(e.target.value)}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Box>
//               </>
//             )}
//           </Box>
//         </DialogContent>

//         <DialogActions>
//           {buttonEnable && (
//             <Button variant="contained" onClick={addLabDetails}>
//               Submit
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>
//     </Paper>
//   );
// };

// export default PathologyDetails;






import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DropdownService from '../../../services/dropdown.service';

interface PathologyDetail {
  isPathologist?: boolean;
  pathologistName?: string;
  pathologistContactNumber?: string;
  pathologistRegistrationNumber?: string;
  pathologistFeedback?: string;
  pathologistFinding?: string;
  labReportVerified?: boolean;
  labReportVerifiedReason?: string;
  labReportVerifiedObservation?: string;
  labReportVerifiedObservationDetails?: string;
  labReportVerifiedFinding?: string;
  pathFraud?: boolean;
  labInHouse?: boolean;
  labName?: string;
  labAddress?: string;
  labState?: string;
  labCity?: string;
  labPin?: string;
  labLicenceNumber?: string;
  labGstNum?: string;
}

interface HospitalFormState {
  labExist: boolean | null;
  labExistFinding: string;
  reCaseUpdatePathologyDetailsDTO: PathologyDetail[];
  [key: string]: any;
}

interface PathologyDetailsProps {
  buttonEnable: boolean;
  formState: HospitalFormState;
  updateFormState: (field: keyof HospitalFormState, value: any) => void;
}

const PathologyDetails: React.FC<PathologyDetailsProps> = ({
  buttonEnable,
  formState,
  updateFormState
}) => {
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Modal form fields
  const [isPathologist, setIsPathologist] = useState('');
  const [pathologistName, setPathologistName] = useState('');
  const [pathologistContactNumber, setPathologistContactNumber] = useState('');
  const [pathologistRegistrationNumber, setPathologistRegistrationNumber] = useState('');
  const [pathologistFeedback, setPathologistFeedback] = useState('');
  const [pathologistFinding, setPathologistFinding] = useState('');
  const [labReportVerified, setLabReportVerified] = useState('');
  const [labReportVerifiedReason, setLabReportVerifiedReason] = useState('');
  const [labReportVerifiedObservation, setLabReportVerifiedObservation] = useState('');
  const [labReportVerifiedObservationDetails, setLabReportVerifiedObservationDetails] = useState('');
  const [labReportVerifiedFinding, setLabReportVerifiedFinding] = useState('');
  const [pathFraud, setPathFraud] = useState('');
  const [labInHouse, setLabInHouse] = useState('');
  const [labName, setLabName] = useState('');
  const [labAddress, setLabAddress] = useState('');
  const [labState, setLabState] = useState('');
  const [labCity, setLabCity] = useState('');
  const [labPin, setLabPin] = useState('');
  const [labLicence, setLabLicence] = useState('');
  const [labGstNum, setLabGstNum] = useState('');

  // Handle lab exists change
  const pathologyExists = (value: string) => {
    if (value === '1') {
      updateFormState('labExist', true);
    } else if (value === '0') {
      updateFormState('labExist', false);
    }
  };

  // Handle lab exist finding change
  const changepathologyExistFinding = (value: string) => {
    updateFormState('labExistFinding', value);
  };

  // Fetch states
  const fetchAllStates = async () => {
    try {
      const response = await DropdownService.getStates();
      if (response.statusCode === 0) {
        setStates(response.payload || []);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  // Fetch cities
  const getCity = async (stateCode: string) => {
    try {
      const response = await DropdownService.getCities(stateCode);
      if (response.statusCode === 0) {
        setCities(response.payload || []);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  // Open modal
  const openModal = () => {
    resetValue();
    fetchAllStates();
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Reset modal values
  const resetValue = () => {
    setIsPathologist('');
    setPathologistName('');
    setPathologistContactNumber('');
    setPathologistRegistrationNumber('');
    setPathologistFeedback('');
    setPathologistFinding('');
    setLabReportVerified('');
    setLabReportVerifiedReason('');
    setLabReportVerifiedObservation('');
    setLabReportVerifiedObservationDetails('');
    setLabReportVerifiedFinding('');
    setPathFraud('');
    setLabInHouse('');
    setLabName('');
    setLabAddress('');
    setLabState('');
    setLabCity('');
    setLabPin('');
    setLabLicence('');
    setLabGstNum('');
    setCities([]);
  };

  // Add lab details
  const addLabDetails = () => {
    const ch: PathologyDetail = {
      labName,
      labAddress,
      labState,
      labCity,
      labLicenceNumber: labLicence
    };

    if (labInHouse === 'yes') {
      ch.labInHouse = true;
    } else if (labInHouse === 'no') {
      ch.labInHouse = false;
    }

    if (isPathologist === '1') {
      ch.isPathologist = true;
      ch.pathologistName = pathologistName;
      ch.pathologistContactNumber = pathologistContactNumber;
      ch.pathologistRegistrationNumber = pathologistRegistrationNumber;
      ch.pathologistFeedback = pathologistFeedback;
      if (pathologistFeedback === 'Suspected' || pathologistFeedback === 'Involved in Fraudulent claims') {
        ch.pathologistFinding = pathologistFinding;
      }
    } else if (isPathologist === '0') {
      ch.isPathologist = false;
      ch.pathologistFinding = pathologistFinding;
    }

    if (labReportVerified === '1') {
      ch.labReportVerified = true;
    } else if (labReportVerified === '0') {
      ch.labReportVerified = false;
      ch.labReportVerifiedReason = labReportVerifiedReason;
    }

    if (pathFraud === '1') {
      ch.pathFraud = true;
    } else if (pathFraud === '0') {
      ch.pathFraud = false;
    }

    ch.labReportVerifiedObservation = labReportVerifiedObservation;
    if (labReportVerifiedObservation === 'Discrepancy') {
      ch.labReportVerifiedObservationDetails = labReportVerifiedObservationDetails;
      ch.labReportVerifiedFinding = labReportVerifiedFinding;
    }

    // Add to array and update parent state
    const updatedLabData = [...(formState.reCaseUpdatePathologyDetailsDTO || []), ch];
    updateFormState('reCaseUpdatePathologyDetailsDTO', updatedLabData);

    closeModal();
  };

  // Helper function
  const changeVal = (value: any): string => {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return '';
  };

  // Handle state change
  const handleStateChange = (stateCode: string) => {
    setLabState(stateCode);
    setLabCity('');
    setCities([]);
    if (stateCode) {
      getCity(stateCode);
    }
  };

  // Get lab exists value for radio
  const getLabExistsValue = () => {
    if (formState.labExist === true) return '1';
    if (formState.labExist === false) return '0';
    return '';
  };

  const labData = formState.reCaseUpdatePathologyDetailsDTO || [];

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '14px', fontWeight: 'bold' }}>
        Lab Details
      </Typography>

      {/* Does the lab exist */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 4 }}>
            <Typography>Does the lab Exists</Typography>
          </Grid>
          <Grid size={{ xs: 8 }}>
            <RadioGroup
              row
              value={getLabExistsValue()}
              onChange={(e) => pathologyExists(e.target.value)}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Yes"
                disabled={!buttonEnable}
              />
              <FormControlLabel
                value="0"
                control={<Radio />}
                label="No"
                disabled={!buttonEnable}
              />
            </RadioGroup>
          </Grid>
        </Grid>
      </Box>

      {/* If Lab Exists = NO - Findings */}
      {formState.labExist === false && (
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 4 }}>
              <Typography>Findings</Typography>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                value={formState.labExistFinding || ''}
                onChange={(e) => changepathologyExistFinding(e.target.value)}
                disabled={!buttonEnable}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* If Lab Exists = YES */}
      {formState.labExist === true && (
        <>
          {/* Add Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            {buttonEnable && (
              <Button variant="contained" onClick={openModal}>
                +Details Of Pathologist
              </Button>
            )}
          </Box>

          {/* Lab Data Table */}
          {labData.length > 0 && (
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, maxHeight: 500, overflow: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Pathologist Attached?</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Pathologist Name</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Contact Number</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Registration Number</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Pathologist Feedback</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Lab Report Verified?</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Observation</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Pathologist to be tagged as fraud/Caution?</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Is Lab Inhouse?</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Lab name</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>Address</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>City</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>State</TableCell>
                    <TableCell sx={{ bgcolor: '#6F62C2', color: 'white', fontWeight: 200 }}>License No.</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {labData.map((lab, index) => (
                    <TableRow key={index}>
                      <TableCell>{changeVal(lab.isPathologist)}</TableCell>
                      <TableCell>{lab.pathologistName}</TableCell>
                      <TableCell>{lab.pathologistContactNumber}</TableCell>
                      <TableCell>{lab.pathologistRegistrationNumber}</TableCell>
                      <TableCell>{lab.pathologistFeedback}</TableCell>
                      <TableCell>{changeVal(lab.labReportVerified)}</TableCell>
                      <TableCell>{lab.labReportVerifiedObservation}</TableCell>
                      <TableCell>{changeVal(lab.pathFraud)}</TableCell>
                      <TableCell>{changeVal(lab.labInHouse)}</TableCell>
                      <TableCell>{lab.labName}</TableCell>
                      <TableCell>{lab.labAddress}</TableCell>
                      <TableCell>{lab.labCity}</TableCell>
                      <TableCell>{lab.labState}</TableCell>
                      <TableCell>{lab.labLicenceNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Modal Dialog */}
      <Dialog
        open={modalOpen}
        onClose={closeModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Details Of Pathologist
          <IconButton
            onClick={closeModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ maxHeight: '500px', overflowY: 'auto' }}>
          <Box sx={{ pt: 2 }}>
            {/* Is Pathologist attached */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 4 }}>
                  <Typography>Is Pathologist attached?</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <RadioGroup
                    row
                    value={isPathologist}
                    onChange={(e) => setIsPathologist(e.target.value)}
                  >
                    <FormControlLabel value="1" control={<Radio />} label="Yes" />
                    <FormControlLabel value="0" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>
              </Grid>
            </Box>

            {/* If Pathologist = YES */}
            {isPathologist === '1' && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 4 }}><Typography>Pathologist Name</Typography></Grid>
                    <Grid size={{ xs: 8 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={pathologistName}
                        onChange={(e) => setPathologistName(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 4 }}><Typography>Contact Number</Typography></Grid>
                    <Grid size={{ xs: 8 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={pathologistContactNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPathologistContactNumber(value);
                        }}
                        inputProps={{ maxLength: 10 }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 4 }}><Typography>Registration Number</Typography></Grid>
                    <Grid size={{ xs: 8 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={pathologistRegistrationNumber}
                        onChange={(e) => setPathologistRegistrationNumber(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 4 }}><Typography>Pathologists Feedback</Typography></Grid>
                    <Grid size={{ xs: 4 }}>
                      <FormControl fullWidth size="small">
                        <Select
                          value={pathologistFeedback}
                          onChange={(e) => setPathologistFeedback(e.target.value)}
                        >
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="Genuine">Genuine</MenuItem>
                          <MenuItem value="Suspected">Suspected</MenuItem>
                          <MenuItem value="Involved in Fraudulent claims">Involved in Fraudulent claims</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                {(pathologistFeedback === 'Suspected' || pathologistFeedback === 'Involved in Fraudulent claims') && (
                  <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 4 }}><Typography>Findings</Typography></Grid>
                      <Grid size={{ xs: 8 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          size="small"
                          value={pathologistFinding}
                          onChange={(e) => setPathologistFinding(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </>
            )}

            {/* If Pathologist = NO - Findings */}
            {isPathologist === '0' && (
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 4 }}><Typography>Findings</Typography></Grid>
                  <Grid size={{ xs: 8 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      value={pathologistFinding}
                      onChange={(e) => setPathologistFinding(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Lab Report Verified */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 4 }}><Typography>Lab Report Verified?</Typography></Grid>
                <Grid size={{ xs: 8 }}>
                  <RadioGroup
                    row
                    value={labReportVerified}
                    onChange={(e) => setLabReportVerified(e.target.value)}
                  >
                    <FormControlLabel value="1" control={<Radio />} label="Yes" />
                    <FormControlLabel value="0" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>
              </Grid>
            </Box>

            {labReportVerified === '0' && (
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 4 }}><Typography>Reason</Typography></Grid>
                  <Grid size={{ xs: 8 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      value={labReportVerifiedReason}
                      onChange={(e) => setLabReportVerifiedReason(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Observation */}
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 4 }}><Typography>Observation</Typography></Grid>
                <Grid size={{ xs: 4 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={labReportVerifiedObservation}
                      onChange={(e) => setLabReportVerifiedObservation(e.target.value)}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Genuine">Genuine</MenuItem>
                      <MenuItem value="Discrepancy">Discrepancy</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {labReportVerifiedObservation === 'Discrepancy' && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 4 }}></Grid>
                    <Grid size={{ xs: 4 }}>
                      <FormControl fullWidth size="small">
                        <Select
                          value={labReportVerifiedObservationDetails}
                          onChange={(e) => setLabReportVerifiedObservationDetails(e.target.value)}
                        >
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="Not Issued by lab">Not Issued by lab</MenuItem>
                          <MenuItem value="Not seen by pathologist">Not seen by pathologist</MenuItem>
                          <MenuItem value="Amount inflated">Amount inflated</MenuItem>
                          <MenuItem value="Format not matching">Format not matching</MenuItem>
                          <MenuItem value="Bills not paid">Bills not paid</MenuItem>
                          <MenuItem value="Others">Others</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}><Typography>Findings</Typography></Grid>
                    <Grid size={{ xs: 8 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        value={labReportVerifiedFinding}
                        onChange={(e) => setLabReportVerifiedFinding(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}

            {/* Pathologist to be tagged as fraud */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 4 }}><Typography>Pathologist to be tagged as fraud/Caution?</Typography></Grid>
                <Grid size={{ xs: 8 }}>
                  <RadioGroup
                    row
                    value={pathFraud}
                    onChange={(e) => setPathFraud(e.target.value)}
                  >
                    <FormControlLabel value="1" control={<Radio />} label="Yes" />
                    <FormControlLabel value="0" control={<Radio />} label="No" />
                  </RadioGroup>
                </Grid>
              </Grid>
            </Box>

            {/* If Fraud = YES - Lab Details */}
            {pathFraud === '1' && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 4 }}><Typography>is Lab Inhouse?</Typography></Grid>
                    <Grid size={{ xs: 4 }}>
                      <FormControl fullWidth size="small">
                        <Select
                          value={labInHouse}
                          onChange={(e) => setLabInHouse(e.target.value)}
                        >
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 4 }}><Typography>Name</Typography></Grid>
                    <Grid size={{ xs: 8 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={labName}
                        onChange={(e) => setLabName(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}><Typography>Address</Typography></Grid>
                    <Grid size={{ xs: 8 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        value={labAddress}
                        onChange={(e) => setLabAddress(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 2 }}><Typography>State</Typography></Grid>
                    <Grid size={{ xs: 4 }}>
                      <FormControl fullWidth size="small">
                        <Select
                          value={labState}
                          onChange={(e) => handleStateChange(e.target.value)}
                        >
                          <MenuItem value="">Select</MenuItem>
                          {states.map((state) => (
                            <MenuItem key={state.stateCode} value={state.stateCode}>
                              {state.stateName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 2 }}><Typography>City</Typography></Grid>
                    <Grid size={{ xs: 4 }}>
                      <FormControl fullWidth size="small">
                        <Select
                          value={labCity}
                          onChange={(e) => setLabCity(e.target.value)}
                          disabled={!labState}
                        >
                          <MenuItem value="">Select</MenuItem>
                          {cities.map((city) => (
                            <MenuItem key={city.cityCode} value={city.cityCode}>
                              {city.cityName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 4 }}><Typography>Pin Code</Typography></Grid>
                    <Grid size={{ xs: 8 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={labPin}
                        onChange={(e) => setLabPin(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 2 }}><Typography>Licence Number</Typography></Grid>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={labLicence}
                        onChange={(e) => setLabLicence(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 2 }}><Typography>GST No.</Typography></Grid>
                    <Grid size={{ xs: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={labGstNum}
                        onChange={(e) => setLabGstNum(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          {buttonEnable && (
            <Button variant="contained" onClick={addLabDetails}>
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PathologyDetails;