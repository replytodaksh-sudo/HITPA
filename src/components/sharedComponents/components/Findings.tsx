// src/components/CaseUpdate/Findings.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { caseUpdateService } from '../../../services/caseupdate.service';
import { dropdownService } from '../../../services/agency.service';

interface FindingsProps {
  isInsuredVisit?: boolean;
  previousData?: any;
  onNextPage?: (pageNumber: number) => void;
}

interface DoctorRow {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  contactNo?: string;
  regNo?: string;
  qualification?: string;
  stream?: string;
  otherStream?: string;
  fraud?: boolean;
}

const Findings: React.FC<FindingsProps> = ({
  isInsuredVisit,
  previousData,
  onNextPage,
}) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  
  // User info
  const [roleName, setRoleName] = useState('');
  const [username, setUsername] = useState('');
  
  // Main form fields
  const [anyOtherFindings, setAnyOtherFindings] = useState('');
  const [rowData, setRowData] = useState<DoctorRow[]>([{}]);
  
  // Chemist Fraud
  const [isChemistFraud, setIsChemistFraud] = useState<boolean | null>(null);
  const [chemistName, setChemistName] = useState('');
  const [chemistAddress, setChemistAddress] = useState('');
  const [chemistState, setChemistState] = useState('');
  const [chemistCity, setChemistCity] = useState('');
  const [chemistPin, setChemistPin] = useState('');
  const [chemistLicence, setChemistLicence] = useState('');
  const [chemistGstNum, setChemistGstNum] = useState('');
  const [chemistReason, setChemistReason] = useState('');
  
  // Lab Fraud
  const [isLabFraud, setIsLabFraud] = useState<boolean | null>(null);
  const [labName, setLabName] = useState('');
  const [labAddress, setLabAddress] = useState('');
  const [labState, setLabState] = useState('');
  const [labCity, setLabCity] = useState('');
  const [labPin, setLabPin] = useState('');
  const [labLicence, setLabLicence] = useState('');
  const [labGstNum, setLabGstNum] = useState('');
  const [labDetails, setLabDetails] = useState('');
  
  // Pathologist
  const [isPathologistAttach, setIsPathologistAttach] = useState<boolean | null>(null);
  const [pathologistName, setPathologistName] = useState('');
  const [pathologistContactNumber, setPathologistContactNumber] = useState('');
  const [pathologistRegistrationNumber, setPathologistRegistrationNumber] = useState('');
  const [pathologistFeedback, setPathologistFeedback] = useState('');
  const [pathologistFinding, setPathologistFinding] = useState('');
  
  // Dropdowns
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [labCities, setLabCities] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);

  // Initialize
  useEffect(() => {
    const role = sessionStorage.getItem('roleName') || '';
    const token = sessionStorage.getItem('token');
    
    setRoleName(role);
    
    // Decode JWT to get username
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        setUsername(decoded.name || '');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    
    fetchAllStates();
  }, []);

  // Populate data from previousData
  useEffect(() => {
    if (previousData) {
      populateData();
    }
  }, [previousData]);

  const populateData = () => {
    if (!previousData) return;
    
    // Auto-fill investigator name for Field Officer
    if (roleName === 'Field Officer') {
      // previousData.investigatorName = username; // If needed
    }
    
    // Doctor table
    if (previousData.caseUpdateDoctor && previousData.caseUpdateDoctor.length > 0) {
      setRowData(previousData.caseUpdateDoctor);
    }
    
    // Other findings
    setAnyOtherFindings(previousData.anyOtherObservationsFindings || '');
    
    // Chemist
    setIsChemistFraud(previousData.chemistFraud);
    setChemistName(previousData.chemistName || '');
    setChemistAddress(previousData.chemistAddress || '');
    setChemistCity(previousData.chemistCity || '');
    setChemistState(previousData.chemistState || '');
    setChemistPin(previousData.chemistPinCode || '');
    setChemistLicence(previousData.chemistLicenceNumber || '');
    setChemistGstNum(previousData.chemistGSTNo || '');
    setChemistReason(previousData.chemistDetails || '');
    
    // Lab
    setIsLabFraud(previousData.labFraud);
    setLabName(previousData.labName || '');
    setLabAddress(previousData.labAddress || '');
    setLabState(previousData.labState || '');
    setLabCity(previousData.labCity || '');
    setLabPin(previousData.labPinCode || '');
    setLabGstNum(previousData.labGSTNo || '');
    setLabLicence(previousData.labLicenceNumber || '');
    setLabDetails(previousData.labDetails || '');
    
    // Pathologist
    setIsPathologistAttach(previousData.pathologist);
    setPathologistName(previousData.pathologistName || '');
    setPathologistContactNumber(previousData.pathologistContactNumber || '');
    setPathologistRegistrationNumber(previousData.pathologistRegistrationNumber || '');
    setPathologistFeedback(previousData.pathologistFeedback || '');
    setPathologistFinding(previousData.pathologistFinding || '');
    
    // Fetch cities if states are already selected
    if (previousData.chemistState) {
      getCity(previousData.chemistState);
    }
    if (previousData.labState) {
      getLabCity(previousData.labState);
    }
  };

  const fetchAllStates = async () => {
    try {
      const response = await dropdownService.getStates();
      if (response.statusCode === 0) {
        setStates(response.payload);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const getCity = async (stateCode: string) => {
    try {
      const response = await dropdownService.getCities(stateCode);
      if (response.statusCode === 0) {
        setCities(response.payload);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const getLabCity = async (stateCode: string) => {
    try {
      const response = await dropdownService.getCities(stateCode);
      if (response.statusCode === 0) {
        setLabCities(response.payload);
      }
    } catch (error) {
      console.error('Error fetching lab cities:', error);
    }
  };

  const addRow = () => {
    setRowData([...rowData, {}]);
  };

  const updateRowField = (index: number, field: string, value: any) => {
    const updatedData = [...rowData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setRowData(updatedData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const payload: any = {
        activeCaseID: localStorage.getItem('activeCaseID'),
        anyOtherObservationsFindings: anyOtherFindings,
        chemistFraud: isChemistFraud,
        labFraud: isLabFraud,
        caseUpdateDoctor: rowData,
      };
      
      // Chemist fraud details
      if (isChemistFraud === true) {
        payload.chemistName = chemistName;
        payload.chemistAddress = chemistAddress;
        payload.chemistCity = chemistCity;
        payload.chemistState = chemistState;
        payload.chemistPinCode = chemistPin;
        payload.chemistLicenceNumber = chemistLicence;
        payload.chemistGSTNo = chemistGstNum;
      }
      
      if (isChemistFraud === false) {
        payload.chemistDetails = chemistReason;
      }
      
      // Lab fraud details
      if (isLabFraud === false) {
        payload.labDetails = labDetails;
      }
      
      if (isLabFraud === true) {
        payload.labName = labName;
        payload.labAddress = labAddress;
        payload.labState = labState;
        payload.labCity = labCity;
        payload.labPinCode = labPin;
        payload.labLicenceNumber = labLicence;
        payload.labGSTNo = labGstNum;
        payload.pathologist = isPathologistAttach;
      }
      
      // Pathologist details
      if (isPathologistAttach === true) {
        payload.pathologistName = pathologistName;
        payload.pathologistContactNumber = pathologistContactNumber;
        payload.pathologistRegistrationNumber = pathologistRegistrationNumber;
        payload.pathologistFeedback = pathologistFeedback;
      }
      
      if (isPathologistAttach === false) {
        payload.pathologistFinding = pathologistFinding;
      }
      
      const cleanInvId = investigationId?.split(' ')[0] || '';
      const response = await caseUpdateService.addCaseUpdateFindings(
        payload,
        cleanInvId
      );
      
      if (response.statusCode === 0) {
        alert('Other observations saved successfully');
        
        if (onNextPage) {
          onNextPage(3);
        }
      }
    } catch (error) {
      console.error('Error saving findings:', error);
      alert('Failed to save findings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      {/* Any Other Observations / Findings */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" fontWeight={500} gutterBottom>
            Any Other Observations / Findings
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder="Any other findings"
            value={anyOtherFindings}
            onChange={(e) => setAnyOtherFindings(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Grid>
      </Grid>

      {/* Doctor Details Table */}
      <Typography variant="h6" gutterBottom sx={{ fontSize: '14px', fontWeight: 600, mb: 2 }}>
        Doctor Details
      </Typography>
      
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>#</TableCell>
              <TableCell>Treating doctor Name</TableCell>
              <TableCell>Contact No.</TableCell>
              <TableCell>Registration Number</TableCell>
              <TableCell>Qualification</TableCell>
              <TableCell>Stream</TableCell>
              <TableCell>To be tagged as Fraud / Caution?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData.map((doctor, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="First"
                      value={doctor.firstName || ''}
                      onChange={(e) => updateRowField(index, 'firstName', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      placeholder="Middle"
                      value={doctor.middleName || ''}
                      onChange={(e) => updateRowField(index, 'middleName', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      placeholder="Last"
                      value={doctor.lastName || ''}
                      onChange={(e) => updateRowField(index, 'lastName', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    inputProps={{ maxLength: 10 }}
                    value={doctor.contactNo || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      updateRowField(index, 'contactNo', value);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    value={doctor.regNo || ''}
                    onChange={(e) => updateRowField(index, 'regNo', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    fullWidth
                    value={doctor.qualification || ''}
                    onChange={(e) => updateRowField(index, 'qualification', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    size="small"
                    fullWidth
                    value={doctor.stream || ''}
                    onChange={(e) => updateRowField(index, 'stream', e.target.value)}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Allopathy">Allopathy</MenuItem>
                    <MenuItem value="Homeopathy">Homeopathy</MenuItem>
                    <MenuItem value="Ayurvedic">Ayurvedic</MenuItem>
                    <MenuItem value="Unani">Unani</MenuItem>
                    <MenuItem value="Naturapathy">Naturapathy</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                  {doctor.stream === 'Others' && (
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Specify other"
                      value={doctor.otherStream || ''}
                      onChange={(e) => updateRowField(index, 'otherStream', e.target.value)}
                      sx={{ mt: 1 }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <RadioGroup
                    row
                    value={doctor.fraud === true ? 'true' : doctor.fraud === false ? 'false' : ''}
                    onChange={(e) => updateRowField(index, 'fraud', e.target.value === 'true')}
                  >
                    <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Button onClick={addRow} sx={{ mb: 3, textTransform: 'none', color: 'blue' }}>
        +Add More
      </Button>

      {/* Chemist & Lab Details */}
      <Typography variant="h6" gutterBottom sx={{ fontSize: '14px', fontWeight: 600, mb: 2 }}>
        Chemist details
      </Typography>

      <Grid container spacing={3}>
        {/* CHEMIST SECTION */}
        <Grid size={{ xs: 6 }}>
          <Paper sx={{ p: 2, bgcolor: '#f9f9f9' }}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2">Is chemist to be tagged as Fraud</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <RadioGroup
                  row
                  value={isChemistFraud === null ? '' : isChemistFraud ? 'true' : 'false'}
                  onChange={(e) => setIsChemistFraud(e.target.value === 'true')}
                >
                  <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </Grid>
            </Grid>

            {isChemistFraud === true && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}><Typography variant="caption">Name of Chemist</Typography></Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField size="small" fullWidth value={chemistName} onChange={(e) => setChemistName(e.target.value)} />
                </Grid>
                
                <Grid size={{ xs: 4 }}><Typography variant="caption">Address</Typography></Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField size="small" fullWidth multiline rows={3} value={chemistAddress} onChange={(e) => setChemistAddress(e.target.value)} />
                </Grid>
                
                <Grid size={{ xs: 4 }}><Typography variant="caption">State</Typography></Grid>
                <Grid size={{ xs: 3 }}>
                  <Select size="small" fullWidth value={chemistState} onChange={(e) => { setChemistState(e.target.value); getCity(e.target.value); }}>
                    <MenuItem value="">Select</MenuItem>
                    {states.map((state) => (
                      <MenuItem key={state.stateCode} value={state.stateCode}>{state.stateName}</MenuItem>
                    ))}
                  </Select>
                </Grid>
                
                <Grid size={{ xs: 2 }}><Typography variant="caption">City</Typography></Grid>
                <Grid size={{ xs: 3 }}>
                  <Select size="small" fullWidth value={chemistCity} onChange={(e) => setChemistCity(e.target.value)}>
                    <MenuItem value="">Select</MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city.cityCode} value={city.cityCode}>{city.cityName}</MenuItem>
                    ))}
                  </Select>
                </Grid>
                
                <Grid size={{ xs: 4 }}><Typography variant="caption">Pin Code</Typography></Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField size="small" fullWidth value={chemistPin} onChange={(e) => setChemistPin(e.target.value)} />
                </Grid>
                
                <Grid size={{ xs: 4 }}><Typography variant="caption">Licence Number</Typography></Grid>
                <Grid size={{ xs: 3 }}>
                  <TextField size="small" fullWidth value={chemistLicence} onChange={(e) => setChemistLicence(e.target.value)} />
                </Grid>
                
                <Grid size={{ xs: 2 }}><Typography variant="caption">GST No.</Typography></Grid>
                <Grid size={{ xs: 3 }}>
                  <TextField size="small" fullWidth value={chemistGstNum} onChange={(e) => setChemistGstNum(e.target.value)} />
                </Grid>
              </Grid>
            )}

            {isChemistFraud === false && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 3 }}><Typography variant="caption">Details</Typography></Grid>
                <Grid size={{ xs: 9 }}>
                  <TextField size="small" fullWidth multiline rows={7} value={chemistReason} onChange={(e) => setChemistReason(e.target.value)} />
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* LAB SECTION */}
        <Grid size={{ xs: 6 }}>
          <Paper sx={{ p: 2, bgcolor: '#f9f9f9' }}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2">Is Lab to be tagged as Fraud</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <RadioGroup
                  row
                  value={isLabFraud === null ? '' : isLabFraud ? 'true' : 'false'}
                  onChange={(e) => setIsLabFraud(e.target.value === 'true')}
                >
                  <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                </RadioGroup>
              </Grid>
            </Grid>

            {isLabFraud === true && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}><Typography variant="caption">Name</Typography></Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField size="small" fullWidth value={labName} onChange={(e) => setLabName(e.target.value)} />
                </Grid>
                
                <Grid size={{ xs: 4 }}><Typography variant="caption">Address</Typography></Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField size="small" fullWidth multiline rows={3} value={labAddress} onChange={(e) => setLabAddress(e.target.value)} />
                </Grid>
                
                <Grid size={{ xs: 4 }}><Typography variant="caption">State</Typography></Grid>
                <Grid size={{ xs: 3 }}>
                  <Select size="small" fullWidth value={labState} onChange={(e) => { setLabState(e.target.value); getLabCity(e.target.value); }}>
                    <MenuItem value="">Select</MenuItem>
                    {states.map((state) => (
                      <MenuItem key={state.stateCode} value={state.stateCode}>{state.stateName}</MenuItem>
                    ))}
                  </Select>
                </Grid>
                
                <Grid size={{ xs: 2 }}><Typography variant="caption">City</Typography></Grid>
                <Grid size={{ xs: 3 }}>
                  <Select size="small" fullWidth value={labCity} onChange={(e) => setLabCity(e.target.value)}>
                    <MenuItem value="">Select</MenuItem>
                    {labCities.map((city) => (
                      <MenuItem key={city.cityCode} value={city.cityCode}>{city.cityName}</MenuItem>
                    ))}
                  </Select>
                </Grid>
                
                <Grid size={{ xs: 4 }}><Typography variant="caption">Pin Code</Typography></Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField size="small" fullWidth value={labPin} onChange={(e) => setLabPin(e.target.value)} />
                </Grid>
                
                <Grid size={{ xs: 4 }}><Typography variant="caption">Licence Number</Typography></Grid>
                <Grid size={{ xs: 3 }}>
                  <TextField size="small" fullWidth value={labLicence} onChange={(e) => setLabLicence(e.target.value)} />
                </Grid>
                
                <Grid size={{ xs: 2 }}><Typography variant="caption">GST No.</Typography></Grid>
                <Grid size={{ xs: 3 }}>
                  <TextField size="small" fullWidth value={labGstNum} onChange={(e) => setLabGstNum(e.target.value)} />
                </Grid>
                
                {/* Pathologist Section */}
                <Grid size={{ xs: 4 }}><Typography variant="caption">Is Pathologist Attached?</Typography></Grid>
                <Grid size={{ xs: 8 }}>
                  <RadioGroup
                    row
                    value={isPathologistAttach === null ? '' : isPathologistAttach ? 'true' : 'false'}
                    onChange={(e) => setIsPathologistAttach(e.target.value === 'true')}
                  >
                    <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                  </RadioGroup>
                </Grid>
                
                {isPathologistAttach === true && (
                  <>
                    <Grid size={{ xs: 4 }}><Typography variant="caption">Pathologist Name</Typography></Grid>
                    <Grid size={{ xs: 8 }}>
                      <TextField size="small" fullWidth value={pathologistName} onChange={(e) => setPathologistName(e.target.value)} />
                    </Grid>
                    
                    <Grid size={{ xs: 4 }}><Typography variant="caption">Contact Number</Typography></Grid>
                    <Grid size={{ xs: 8 }}>
                      <TextField 
                        size="small" 
                        fullWidth 
                        inputProps={{ maxLength: 10 }}
                        value={pathologistContactNumber} 
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setPathologistContactNumber(value);
                        }} 
                      />
                    </Grid>
                    
                    <Grid size={{ xs: 4 }}><Typography variant="caption">Registration Number</Typography></Grid>
                    <Grid size={{ xs: 8 }}>
                      <TextField size="small" fullWidth value={pathologistRegistrationNumber} onChange={(e) => setPathologistRegistrationNumber(e.target.value)} />
                    </Grid>
                    
                    <Grid size={{ xs: 4 }}><Typography variant="caption">Pathologist Feedback</Typography></Grid>
                    <Grid size={{ xs: 8 }}>
                      <Select size="small" fullWidth value={pathologistFeedback} onChange={(e) => setPathologistFeedback(e.target.value)}>
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="Genuine">Genuine</MenuItem>
                        <MenuItem value="Suspected">Suspected</MenuItem>
                        <MenuItem value="Involved in Fraudulent Claims">Involved in Fraudulent Claims</MenuItem>
                      </Select>
                    </Grid>
                  </>
                )}
                
                {isPathologistAttach === false && (
                  <>
                    <Grid size={{ xs: 4 }}><Typography variant="caption">Findings</Typography></Grid>
                    <Grid size={{ xs: 8 }}>
                      <TextField size="small" fullWidth multiline rows={7} value={pathologistFinding} onChange={(e) => setPathologistFinding(e.target.value)} />
                    </Grid>
                  </>
                )}
              </Grid>
            )}

            {isLabFraud === false && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 3 }}><Typography variant="caption">Details</Typography></Grid>
                <Grid size={{ xs: 9 }}>
                  <TextField size="small" fullWidth multiline rows={7} value={labDetails} onChange={(e) => setLabDetails(e.target.value)} />
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Submit Button */}
      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          {loading ? 'Saving...' : 'Save as Draft'}
        </Button>
      </Box>
    </Box>
  );
};

export default Findings;