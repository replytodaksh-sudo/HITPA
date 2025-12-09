import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DropdownService from '../../../services/dropdown.service';

interface ChemistDetails {
  chemistName: string;
  chemistAddress: string;
  chemistState: string;
  chemistCity: string;
  chemistLicenceNumber: string;
  chemistGSTNo: string;
  chemistBillVerified?: boolean;
  chemistBillVerifiedObservation?: string;
  chemistBillVerifiedObservationDetails?: string;
  chemistBillVerifiedReason?: string;
  chemistPurchaseCollected?: boolean;
  chemistPurchaseCollectedObservation?: string;
  chemistPurchaseCollectedObservationFinding?: string;
  chemistPurchaseCollectedReason?: string;
  chemistStatementCollect?: boolean;
  chemistStatementCollectReason?: string;
  chemistFraud?: boolean;
}

interface ChemistDetailsComponentProps {
  buttonEnable: boolean;
  previousData?: any;
  onDataChange: (key: string, value: any) => void;
}

const ChemistDetailsComponent: React.FC<ChemistDetailsComponentProps> = ({
  buttonEnable,
  previousData,
  onDataChange,
}) => {
  // Main states
  const [isChemistExists, setIsChemistExists] = useState<string>('');
  const [chemistExistFinding, setChemistExistFinding] = useState('');
  const [chemistData, setChemistData] = useState<ChemistDetails[]>([]);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Form states
  const [chemistName, setChemistName] = useState('');
  const [chemistAddress, setChemistAddress] = useState('');
  const [chemistState, setChemistState] = useState('');
  const [chemistCity, setChemistCity] = useState('');
  const [chemistPin, setChemistPin] = useState('');
  const [chemistLicence, setChemistLicence] = useState('');
  const [chemistGstNum, setChemistGstNum] = useState('');

  // Verification states
  const [chemistBillVerified, setChemistBillVerified] = useState('');
  const [chemistBillVerifiedObservation, setChemistBillVerifiedObservation] = useState('');
  const [chemistBillVerifiedObservationDetails, setChemistBillVerifiedObservationDetails] = useState('');
  const [chemistBillVerifiedReason, setChemistBillVerifiedReason] = useState('');

  const [chemistPurchaseCollected, setChemistPurchaseCollected] = useState('');
  const [chemistPurchaseCollectedObservation, setChemistPurchaseCollectedObservation] = useState('');
  const [chemistPurchaseCollectedObservationFinding, setChemistPurchaseCollectedObservationFinding] = useState('');
  const [chemistPurchaseCollectedReason, setChemistPurchaseCollectedReason] = useState('');

  const [chemistStatementCollect, setChemistStatementCollect] = useState('');
  const [chemistStatementCollectReason, setChemistStatementCollectReason] = useState('');

  const [chemistFraud, setChemistFraud] = useState('');

  useEffect(() => {
    if (previousData) {
      populateData();
    }
  }, [previousData]);

  const populateData = () => {
    if (!previousData) return;

    const data = previousData.reCaseUpdateChemistDetailsDTO || [];
    setChemistData(data);
    onDataChange('reCaseUpdateChemistDetailsDTO', data);

    if (previousData.chemistExist === true) {
      setIsChemistExists('1');
      onDataChange('chemistExist', true);
    } else if (previousData.chemistExist === false) {
      setIsChemistExists('0');
      onDataChange('chemistExist', false);
      setChemistExistFinding(previousData.chemistExistFinding || '');
      onDataChange('chemistExistFinding', previousData.chemistExistFinding);
    }
  };

  const fetchStates = async () => {
    try {
      const response: any = await DropdownService.getStates();
      if (response.statusCode === 0) {
        setStates(response.payload || []);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (stateCode: string) => {
    try {
      const response: any = await DropdownService.getCities(stateCode);
      if (response.statusCode === 0) {
        setCities(response.payload || []);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleChemistExistsChange = (value: string) => {
    setIsChemistExists(value);
    if (value === '1') {
      onDataChange('chemistExist', true);
    } else if (value === '0') {
      onDataChange('chemistExist', false);
    }
  };

  const handleChemistExistFindingChange = (value: string) => {
    setChemistExistFinding(value);
    onDataChange('chemistExistFinding', value);
  };

  const handleOpenModal = () => {
    resetFormValues();
    fetchStates();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleStateChange = (stateCode: string) => {
    setChemistState(stateCode);
    setChemistCity('');
    if (stateCode) {
      fetchCities(stateCode);
    }
  };

  const handleAddChemist = () => {
    const newChemist: ChemistDetails = {
      chemistName,
      chemistAddress,
      chemistState,
      chemistCity,
      chemistLicenceNumber: chemistLicence,
      chemistGSTNo: chemistGstNum,
    };

    // Bills Verified
    if (chemistBillVerified === 'yes') {
      newChemist.chemistBillVerified = true;
      newChemist.chemistBillVerifiedObservation = chemistBillVerifiedObservation;
      if (chemistBillVerifiedObservation === 'Discrepancy') {
        newChemist.chemistBillVerifiedObservationDetails = chemistBillVerifiedObservationDetails;
      }
    } else if (chemistBillVerified === 'no') {
      newChemist.chemistBillVerifiedReason = chemistBillVerifiedReason;
    }

    // Purchase Invoices
    if (chemistPurchaseCollected === 'yes') {
      newChemist.chemistPurchaseCollected = true;
      newChemist.chemistPurchaseCollectedObservation = chemistPurchaseCollectedObservation;
      if (chemistPurchaseCollectedObservation === 'Discrepancy') {
        newChemist.chemistPurchaseCollectedObservationFinding = chemistPurchaseCollectedObservationFinding;
      }
    } else if (chemistPurchaseCollected === 'no') {
      newChemist.chemistPurchaseCollectedReason = chemistPurchaseCollectedReason;
    }

    // Statement Collected
    if (chemistStatementCollect === 'yes') {
      newChemist.chemistStatementCollect = true;
    } else if (chemistStatementCollect === 'no') {
      newChemist.chemistStatementCollect = false;
      newChemist.chemistStatementCollectReason = chemistStatementCollectReason;
    }

    // Fraud
    if (chemistFraud === 'yes') {
      newChemist.chemistFraud = true;
    } else if (chemistFraud === 'no') {
      newChemist.chemistFraud = false;
    }

    const updatedChemistData = [...chemistData, newChemist];
    setChemistData(updatedChemistData);
    onDataChange('reCaseUpdateChemistDetailsDTO', updatedChemistData);
    handleCloseModal();
  };

  const resetFormValues = () => {
    setChemistName('');
    setChemistAddress('');
    setChemistState('');
    setChemistCity('');
    setChemistPin('');
    setChemistLicence('');
    setChemistGstNum('');
    setChemistBillVerified('');
    setChemistBillVerifiedObservation('');
    setChemistBillVerifiedObservationDetails('');
    setChemistBillVerifiedReason('');
    setChemistPurchaseCollected('');
    setChemistPurchaseCollectedObservation('');
    setChemistPurchaseCollectedObservationFinding('');
    setChemistPurchaseCollectedReason('');
    setChemistStatementCollect('');
    setChemistStatementCollectReason('');
    setChemistFraud('');
  };

  const changeVal = (value: boolean | undefined): string => {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return '';
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: 14 }}>
        Chemist Details
      </Typography>

      {/* Does Chemist Exist */}
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography>Does the Chemist Exists</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <RadioGroup
            row
            value={isChemistExists}
            onChange={(e) => handleChemistExistsChange(e.target.value)}
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

      {/* Findings if No */}
      {isChemistExists === '0' && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography>Findings</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <TextField
              fullWidth
              multiline
              rows={7}
              value={chemistExistFinding}
              onChange={(e) => handleChemistExistFindingChange(e.target.value)}
              disabled={!buttonEnable}
            />
          </Grid>
        </Grid>
      )}

      {/* Add Chemist Button */}
      {isChemistExists === '1' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleOpenModal}
            disabled={!buttonEnable}
          >
            + Details of chemist
          </Button>
        </Box>
      )}

      {/* Chemist Table */}
      {isChemistExists === '1' && chemistData.length > 0 && (
        <TableContainer component={Paper} sx={{ mb: 3, maxHeight: 500, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#6F62C2' }}>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>#</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>Chemist name</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>Address</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>City</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>State</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>License No.</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>Bills Verified</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>Observation</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>Observation Details</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>Purchase Invoices collected</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>Purchase Observation</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>Findings</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>Chemist Statement collected</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>Reason</TableCell>
                <TableCell sx={{ backgroundColor: '#6F62C2', color: 'white', fontWeight: 200 }}>Chemist to be tagged as fraud/Caution?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chemistData.map((chemist, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{chemist.chemistName}</TableCell>
                  <TableCell>{chemist.chemistAddress}</TableCell>
                  <TableCell>{chemist.chemistCity}</TableCell>
                  <TableCell>{chemist.chemistState}</TableCell>
                  <TableCell>{chemist.chemistLicenceNumber}</TableCell>
                  <TableCell>{changeVal(chemist.chemistBillVerified)}</TableCell>
                  <TableCell>{chemist.chemistBillVerifiedObservation}</TableCell>
                  <TableCell>{chemist.chemistBillVerifiedObservationDetails}</TableCell>
                  <TableCell>{changeVal(chemist.chemistPurchaseCollected)}</TableCell>
                  <TableCell>{chemist.chemistPurchaseCollectedObservation}</TableCell>
                  <TableCell>{chemist.chemistPurchaseCollectedObservationFinding}</TableCell>
                  <TableCell>{changeVal(chemist.chemistStatementCollect)}</TableCell>
                  <TableCell>{chemist.chemistStatementCollectReason}</TableCell>
                  <TableCell>{changeVal(chemist.chemistFraud)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Chemist Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Details of chemist
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: 500 }}>
          {/* Bills Verified */}
          <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
            <Grid size={{ xs: 4 }}>
              <Typography>Bills Verified</Typography>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <RadioGroup
                row
                value={chemistBillVerified}
                onChange={(e) => setChemistBillVerified(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>
          </Grid>

          {/* Observation (if Bills Verified = Yes) */}
          {chemistBillVerified === 'yes' && (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                <Grid size={{ xs: 4 }}>
                  <Typography>Observation</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={chemistBillVerifiedObservation}
                      onChange={(e) => setChemistBillVerifiedObservation(e.target.value)}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Genuine">Genuine</MenuItem>
                      <MenuItem value="Discrepancy">Discrepancy</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Observation Details (if Discrepancy) */}
              {chemistBillVerifiedObservation === 'Discrepancy' && (
                <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                  <Grid size={{ xs: 4 }}></Grid>
                  <Grid size={{ xs: 8 }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={chemistBillVerifiedObservationDetails}
                        onChange={(e) => setChemistBillVerifiedObservationDetails(e.target.value)}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="Fake bill not issued by chemist">Fake bill not issued by chemist</MenuItem>
                        <MenuItem value="Fake bill issued on request of patient's request">Fake bill issued on request of patient's request</MenuItem>
                        <MenuItem value="Bill inflated on request of patient">Bill inflated on request of patient</MenuItem>
                        <MenuItem value="Forged bill amount">Forged bill amount</MenuItem>
                        <MenuItem value="Bill particulars do not match with submitted bills">Bill particulars do not match with submitted bills</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </>
          )}

          {/* Reason (if Bills Verified = No) */}
          {chemistBillVerified === 'no' && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 4 }}>
                <Typography>Reason</Typography>
              </Grid>
              <Grid size={{ xs: 8 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={7}
                  value={chemistBillVerifiedReason}
                  onChange={(e) => setChemistBillVerifiedReason(e.target.value)}
                />
              </Grid>
            </Grid>
          )}

          {/* Purchase Invoices collected */}
          <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
            <Grid size={{ xs: 4 }}>
              <Typography>Purchase Invoices collected?</Typography>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <RadioGroup
                row
                value={chemistPurchaseCollected}
                onChange={(e) => setChemistPurchaseCollected(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>
          </Grid>

          {/* Purchase Observation (if Yes) */}
          {chemistPurchaseCollected === 'yes' && (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                <Grid size={{ xs: 4 }}>
                  <Typography>Observation</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={chemistPurchaseCollectedObservation}
                      onChange={(e) => setChemistPurchaseCollectedObservation(e.target.value)}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Genuine">Genuine</MenuItem>
                      <MenuItem value="Discrepancy">Discrepancy</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Findings (if Discrepancy) */}
              {chemistPurchaseCollectedObservation === 'Discrepancy' && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 4 }}>
                    <Typography>Findings</Typography>
                  </Grid>
                  <Grid size={{ xs: 8 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={7}
                      value={chemistPurchaseCollectedObservationFinding}
                      onChange={(e) => setChemistPurchaseCollectedObservationFinding(e.target.value)}
                    />
                  </Grid>
                </Grid>
              )}
            </>
          )}

          {/* Reason (if Purchase = No) */}
          {chemistPurchaseCollected === 'no' && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 4 }}>
                <Typography>Reason</Typography>
              </Grid>
              <Grid size={{ xs: 8 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={7}
                  value={chemistPurchaseCollectedReason}
                  onChange={(e) => setChemistPurchaseCollectedReason(e.target.value)}
                />
              </Grid>
            </Grid>
          )}

          {/* Chemist Statement collected */}
          <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
            <Grid size={{ xs: 4 }}>
              <Typography>Chemist Statement collected?</Typography>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <RadioGroup
                row
                value={chemistStatementCollect}
                onChange={(e) => setChemistStatementCollect(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>
          </Grid>

          {/* Reason (if Statement = No) */}
          {chemistStatementCollect === 'no' && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 4 }}>
                <Typography>Reason</Typography>
              </Grid>
              <Grid size={{ xs: 8 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={7}
                  value={chemistStatementCollectReason}
                  onChange={(e) => setChemistStatementCollectReason(e.target.value)}
                />
              </Grid>
            </Grid>
          )}

          {/* Chemist to be tagged as fraud */}
          <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
            <Grid size={{ xs: 4 }}>
              <Typography>Chemist to be tagged as fraud/Caution?</Typography>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <RadioGroup
                row
                value={chemistFraud}
                onChange={(e) => setChemistFraud(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>
          </Grid>

          {/* Chemist Details Form (if Fraud = Yes) */}
          {chemistFraud === 'yes' && (
            <Box sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: 14 }}>
                Chemist Details
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <Typography>Name of Chemist</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={chemistName}
                    onChange={(e) => setChemistName(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 4 }}>
                  <Typography>Address</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={chemistAddress}
                    onChange={(e) => setChemistAddress(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 4 }}>
                  <Typography>State</Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={chemistState}
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

                <Grid size={{ xs: 2 }}>
                  <Typography>City</Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={chemistCity}
                      onChange={(e) => setChemistCity(e.target.value)}
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

                <Grid size={{ xs: 4 }}>
                  <Typography>Pin Code</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={chemistPin}
                    onChange={(e) => setChemistPin(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 4 }}>
                  <Typography>Licence Number</Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={chemistLicence}
                    onChange={(e) => setChemistLicence(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 2 }}>
                  <Typography>GST No.</Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={chemistGstNum}
                    onChange={(e) => setChemistGstNum(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleAddChemist} variant="contained" disabled={!buttonEnable}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChemistDetailsComponent;