// File: src/components/CentralAssignedAgencyCaseUpdate.tsx - Part 1: Interfaces & Setup
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import { caseUpdateService } from '../../../services/caseupdate.service';

// ==================== INTERFACES ====================
interface CaseUpdateDoctor {
  firstName: string;
  middleName: string;
  lastName: string;
  contactNo: string;
  regNo: string;
  qualification: string;
  stream: string;
  fraud: boolean;
}

interface PayloadData {
  boolStatusOfInsured: boolean;
  reason: string;
  
  // Planned Admission Fields
  hospitalVisitDone: boolean;
  insuredVisitDone: boolean;
  expectedDateOfAdmission: string;
  insuredVisitDoneExpectedDateOfAdmission: string;
  treatmentPlanned: string;
  estimatedBill: string;
  hospitalVisitDoneReason: string;
  treatingDoctorVisit: string;
  insuredVisitDoneIsPatientAdmitted: string;
  insuredVisitDoneTreatmentPlanned: string;
  insuredVisitDoneAilment: string;
  insuredVisitDonePresentingDuration: string;
  insuredVisitDoneEstimatedBill: string;
  insuredVisitDoneHOAnyPreviousHospitalization: string;
  kcyDocument: boolean;
  kcyDocumentsReason: string;
  insuredVisitDoneWithdrawalCollected: string;
  insuredVisitDoneObservations: string;
  
  // Regular Fields
  roomCategory: string;
  roomRent: string;
  doa: string;
  expectedDateOfDischarge: string;
  diagnosis: string;
  iPDRegisterEntryFound: string;
  iPDRegisterObservations: string;
  iPDCollectedReason: string;
  anyOtherFindings: string;
  iPDCollectedDiscrepancyPEDObservations: string;
  treatingDoctorVisitPEDNotedFindings: string;
  lineOfTreatment: string;
  isActiveMedicalManagementLOTGiven: string;
  medicalManagementJustification: string;
  pastRecordsCheckedMRD: string;
  labReportVerified: string;
  labReportObservations: string;
  isChemist: string;
  chemistObservations: string;
  hospitalFeedBack: string;
  hospitalRemarks: string;
  anyOtherObservationsFindings: string;
  
  // Fraud Flags
  chemistFraud: boolean | null;
  labFraud: boolean | null;
  
  // Chemist Details
  chemistName: string;
  chemistAddress: string;
  chemistState: string;
  chemistCity: string;
  chemistPinCode: string;
  chemistLicenceNumber: string;
  chemistGSTNo: string;
  chemistReason: string;
  
  // Lab Details
  labName: string;
  labAddress: string;
  labState: string;
  labCity: string;
  labPinCode: string;
  labLicenceNumber: string;
  labGSTNo: string;
  pathologist: boolean | null;
  pathologistName: string;
  pathologistRegistrationNumber: string;
  pathologistFeedback: string;
  pathologistFinding: string;
  labReportReason: string;
  
  // Doctor Table
  caseUpdateDoctor: CaseUpdateDoctor[];
}

interface CentralAssignedAgencyCaseUpdateProps {
  isInsuredVisit?: boolean;
  buttonVisible?: boolean;
  previewRefresh?: boolean;
}

// ==================== COMPONENT ====================
const CentralAssignedAgencyCaseUpdate: React.FC<CentralAssignedAgencyCaseUpdateProps> = ({
  isInsuredVisit,
  buttonVisible = true,
  previewRefresh = false,
}) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL Parameters
  const claimsType = searchParams.get('claimsType') || '';
  const redirectTo = searchParams.get('redirectTo') || '';

  // State
  const [payloadData, setPayloadData] = useState<PayloadData | null>(null);
  const [doctorTable, setDoctorTable] = useState<CaseUpdateDoctor[]>([]);
  const [isPresent, setIsPresent] = useState<boolean | null>(null);
  const [reasonVal, setReasonVal] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch details when component mounts or previewRefresh changes
  useEffect(() => {
    if (investigationId) {
      getDetails();
    }
  }, [investigationId, previewRefresh]);

  const getDetails = async () => {
    try {
      setLoading(true);
      const cleanId = investigationId!.split(' ')[0];
      
      let response;
      if (claimsType === 'cashless') {
        response = await caseUpdateService.caseUpdatePreview(cleanId);
      } else if (claimsType === 'reim') {
        response = await caseUpdateService.caseUpdatePreviousDataReim(cleanId);
      }

      if (response && response.statusCode === 0) {
        setPayloadData(response.payload);
        setDoctorTable(response.payload.caseUpdateDoctor || []);
        setIsPresent(response.payload.boolStatusOfInsured);
        setReasonVal(response.payload.reason);
      }
    } catch (error) {
      console.error('Error fetching case details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSubmit = async () => {
    try {
      const caseUpdateID = localStorage.getItem('activeCaseID');
      if (!caseUpdateID || !investigationId) return;

      const cleanId = investigationId.split(' ')[0];
      const response = await caseUpdateService.addCaseUpdateFinal(
        caseUpdateID,
        cleanId
      );

      if (response.statusCode === 0) {
        localStorage.clear();
        alert('Case submitted successfully!');
        
        if (redirectTo) {
          navigate(redirectTo.replace('/investigation', ''));
        } else {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Error submitting case:', error);
      alert('Error submitting case. Please try again.');
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading case details...</Typography>
      </Box>
    );
  }

  // If FO Update is pending
  if (isPresent === null) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#6F62C2',
          }}
        >
          FO Update is pending from agency
        </Typography>
      </Box>
    );
  }

  if (!payloadData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  // Part 3: JSX Rendering Logic
// Add this to the return statement after Part 2

return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Status of Insured */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography fontWeight="600">
              Status of Insured at the time of Visit
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 10 }}>
            <Typography>{isPresent ? 'Present' : 'Not Present'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* PLANNED ADMISSION SECTION */}
      {!isPresent && reasonVal === 'plannedadmission' && (
        <>
          {/* Hospital Visit Done & Insured Visit Done */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 5.9 }}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Hospital Visit Done</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Typography>
                      {payloadData.hospitalVisitDone ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 5.9 }}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Insured Visit Done</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Typography>
                      {payloadData.insuredVisitDone ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {/* Expected DOA */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 5.9 }}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">
                      Hospital Visit (Expected DOA)
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Typography>{payloadData.expectedDateOfAdmission}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 5.9 }}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">
                      Insured Visit (Expected DOA)
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Typography>
                      {payloadData.insuredVisitDoneExpectedDateOfAdmission}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {/* Detailed Hospital & Insured Visit Information */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* LEFT COLUMN - Hospital Visit Details */}
            <Grid size={{ xs: 12, md: 5.9 }}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600">Treatment Planned</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>{payloadData.treatmentPlanned}</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600">Estimated Bill</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>{payloadData.estimatedBill}</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600">Hospital Visit Reason</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>{payloadData.hospitalVisitDoneReason}</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600">Treating Doctor Visit</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>{payloadData.treatingDoctorVisit}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* RIGHT COLUMN - Insured Visit Details */}
            <Grid size={{ xs: 12, md: 5.9 }}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Box sx={{ mb: 1.5 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600" fontSize="0.9rem">
                        Is Patient willingly admitted
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>
                        {payloadData.insuredVisitDoneIsPatientAdmitted}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 1.5 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600" fontSize="0.9rem">
                        Treatment Planned Insured Visit
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>
                        {payloadData.insuredVisitDoneTreatmentPlanned}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 1.5 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600">Ailment</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>{payloadData.insuredVisitDoneAilment}</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 1.5 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600" fontSize="0.9rem">
                        Presenting C/O duration
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>
                        {payloadData.insuredVisitDonePresentingDuration}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 1.5 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600">Estimated Bill</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>
                        {payloadData.insuredVisitDoneEstimatedBill}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 1.5 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600" fontSize="0.9rem">
                        H/O any previous hospitalization
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>
                        {payloadData.insuredVisitDoneHOAnyPreviousHospitalization}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 1.5 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600">Kyc Documents Collected</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>
                        {payloadData.kcyDocument ? 'Yes' : 'No'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 1.5 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600">Reason</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>{payloadData.kcyDocumentsReason}</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ mb: 1.5 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600" fontSize="0.9rem">
                        Withdrawal /Confirmation collected?
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>
                        {payloadData.insuredVisitDoneWithdrawalCollected}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography fontWeight="600">Observations</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography>
                        {payloadData.insuredVisitDoneObservations}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      // Part 4: Regular Fields (for Present or Discharged status)
// Add after Part 3

      {/* REGULAR FIELDS (not plannedadmission, not notfoundhosp) */}
      {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
        <>
          {/* Room Category */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 2 }}>
                <Typography fontWeight="600">Room Category</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 10 }}>
                <Typography>{payloadData.roomCategory}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Room Rent & DOA */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 2 }}>
                <Typography fontWeight="600">Room Rent/ Day</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Typography>INR. {payloadData.roomRent} /-</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 1 }}>
                <Typography fontWeight="600">DOA</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography>{formatDate(payloadData.doa)}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Expected Date of Discharge */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 2 }}>
                <Typography fontWeight="600">Expected Date of Discharge</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 10 }}>
                <Typography>
                  {formatDate(payloadData.expectedDateOfDischarge)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}

      {/* Diagnosis (not notfoundhosp) */}
      {reasonVal !== 'notfoundhosp' && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 2 }}>
              <Typography fontWeight="600">Diagnosis</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 10 }}>
              <Typography>{payloadData.diagnosis}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* IPD Register & IPD Collected */}
      {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 5.9 }}>
            <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">IPD register entry found</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>{payloadData.iPDRegisterEntryFound}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Observations</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>{payloadData.iPDRegisterObservations}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5.9 }}>
            <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">IPDs Collected</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>{payloadData.iPDCollectedReason}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Findings</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>{payloadData.anyOtherFindings}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Non-PED Observations</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>
                      {payloadData.iPDCollectedDiscrepancyPEDObservations}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Treating Doctor & Line of Treatment */}
      {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 5.9 }}>
            <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Treating doctor Visit</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>{payloadData.treatingDoctorVisit}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Findings</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>
                      {payloadData.treatingDoctorVisitPEDNotedFindings}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5.9 }}>
            <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Line of Treatment</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>{payloadData.lineOfTreatment}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600" fontSize="0.9rem">
                      Is Active line of treatment Given?
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>
                      {payloadData.isActiveMedicalManagementLOTGiven}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Justification</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>
                      {payloadData.medicalManagementJustification}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Past Records checked with MRD */}
      {reasonVal !== 'notfoundhosp' && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 2 }}>
              <Typography fontWeight="600">
                Past Records checked with MRD?
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 10 }}>
              <Typography>{payloadData.pastRecordsCheckedMRD}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Lab Report & Chemist */}
      {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 5.9 }}>
            <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Lab Report</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>{payloadData.labReportVerified}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Observations</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>{payloadData.labReportObservations}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5.9 }}>
            <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Chemist</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>{payloadData.isChemist}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Observations</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>{payloadData.chemistObservations}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      // Part 5: Insured Visit, Hospital Feedback, Fraud Tags, and Doctor Table
// Add after Part 4

      {/* Insured Visit & Hospital Feedback */}
      {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 5.9 }}>
            <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
              <Typography fontWeight="700" sx={{ mb: 2 }}>
                INSURED VISIT
              </Typography>
              <Box sx={{ mb: 1.5 }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 4 }}>
                    <Typography fontWeight="600">Statement collected</Typography>
                  </Grid>
                  <Grid size={{ xs: 2 }}>
                    <Typography>Yes</Typography>
                  </Grid>
                  <Grid size={{ xs: 3 }}>
                    <Typography fontWeight="600">KYC Documents</Typography>
                  </Grid>
                  <Grid size={{ xs: 3 }}>
                    <Typography>Collected</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 4 }}>
                    <Typography fontWeight="600">Insured Habits</Typography>
                  </Grid>
                  <Grid size={{ xs: 8 }}>
                    <Typography>Alcohol Smoking</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5.9 }}>
            <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Hospital Feedback</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>{payloadData.hospitalFeedBack}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography fontWeight="600">Hospital Remarks</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography>{payloadData.hospitalRemarks}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Any Other Observations & Fraud Tags */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 5.9 }}>
          <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography fontWeight="600">
                  Any Other Observations / Findings
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography>{payloadData.anyOtherObservationsFindings}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5.9 }}>
          <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography fontWeight="600">
                    Is chemist to be tagged as Fraud
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography>
                    {payloadData.chemistFraud !== null
                      ? payloadData.chemistFraud
                        ? 'Yes'
                        : 'No'
                      : 'None'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography fontWeight="600">
                    Is Lab to be tagged as Fraud
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography>
                    {payloadData.labFraud !== null
                      ? payloadData.labFraud
                        ? 'Yes'
                        : 'No'
                      : 'None'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Chemist & Lab Details */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* CHEMIST DETAILS */}
        <Grid size={{ xs: 12, md: 5.9 }}>
          <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Chemist Name</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.chemistName}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Address</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.chemistAddress}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">State</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.chemistState}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">City</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.chemistCity}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Pin</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.chemistPinCode}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">License</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.chemistLicenceNumber}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">GST</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.chemistGSTNo}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Reason</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.chemistReason}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* LAB DETAILS */}
        <Grid size={{ xs: 12, md: 5.9 }}>
          <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Lab Name</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.labName}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Address</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.labAddress}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">State</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.labState}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">City</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.labCity}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Pin</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.labPinCode}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">License</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.labLicenceNumber}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">GST</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.labGSTNo}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Is Pathologist Attached?</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>
                    {payloadData.pathologist !== null
                      ? payloadData.pathologist
                        ? 'Yes'
                        : 'No'
                      : ''}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Pathologist Name</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.pathologistName}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Registration Number</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>
                    {payloadData.pathologistRegistrationNumber}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Pathologists Feedback</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.pathologistFeedback}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Findings</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.pathologistFinding}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <Typography fontWeight="600">Reason</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>{payloadData.labReportReason}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* DOCTOR TABLE */}
      {doctorTable.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align="center">Treating doctor Name</TableCell>
                  <TableCell align="center">Contact No.</TableCell>
                  <TableCell align="center">Registration Number</TableCell>
                  <TableCell align="center">Qualification</TableCell>
                  <TableCell align="center">Stream</TableCell>
                  <TableCell align="center">
                    To be tagged as Fraud / Caution?
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctorTable.map((doctor, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{doctor.firstName}</span>
                        <span>{doctor.middleName}</span>
                        <span>{doctor.lastName}</span>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{doctor.contactNo}</TableCell>
                    <TableCell align="center">{doctor.regNo}</TableCell>
                    <TableCell align="center">{doctor.qualification}</TableCell>
                    <TableCell align="center">{doctor.stream}</TableCell>
                    <TableCell align="center">
                      {doctor.fraud ? 'Yes' : 'No'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* SUBMIT BUTTON */}
      {!buttonVisible && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSaveSubmit}
            sx={{
              background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
              },
              mr: 2,
            }}
          >
            Save and Submit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CentralAssignedAgencyCaseUpdate;