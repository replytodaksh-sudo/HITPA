import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { caseUpdateService } from '../../../services/caseupdate.service';
import { format } from 'date-fns';

interface Doctor {
  firstName: string;
  middleName: string;
  lastName: string;
  contactNo: string;
  regNo: string;
  qualification: string;
  stream: string;
  fraud: boolean;
}

interface CaseUpdateData {
  boolStatusOfInsured: boolean;
  reason: string;
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
  chemistFraud: boolean | null;
  labFraud: boolean | null;
  chemistName: string;
  chemistAddress: string;
  chemistState: string;
  chemistCity: string;
  chemistPinCode: string;
  chemistLicenceNumber: string;
  chemistGSTNo: string;
  chemistReason: string;
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
  caseUpdateDoctor: Doctor[];
}

interface CentralRegionalCaseUpdateProps {
  isInsuredVisit?: boolean;
  buttonVisible?: boolean;
  previewRefresh?: boolean;
}

const CentralRegionalCaseUpdate: React.FC<CentralRegionalCaseUpdateProps> = ({
  buttonVisible = false,
  previewRefresh = false,
}) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payloadData, setPayloadData] = useState<CaseUpdateData | null>(null);
  const [doctorTable, setDoctorTable] = useState<Doctor[]>([]);
  const [isPresent, setIsPresent] = useState<boolean | null>(null);
  const [reasonVal, setReasonVal] = useState<string>('');

  const cleanInvestigationId = investigationId?.split(' ')[0] || '';

  useEffect(() => {
    fetchDetails();
  }, [investigationId]);

  useEffect(() => {
    if (previewRefresh) {
      fetchDetails();
    }
  }, [previewRefresh]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await caseUpdateService.caseUpdatePreview(cleanInvestigationId);
      if (response?.statusCode === 0) {
        setPayloadData(response.payload);
        setDoctorTable(response.payload.caseUpdateDoctor || []);
        setIsPresent(response.payload.boolStatusOfInsured);
        setReasonVal(response.payload.reason);
      }
    } catch (error) {
      console.error('Error fetching case update details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSubmit = async () => {
    const caseUpdateID = localStorage.getItem('activeCaseID');
    if (!caseUpdateID) {
      alert('Case ID not found. Please try again.');
      return;
    }
    try {
      const response = await caseUpdateService.addCaseUpdateFinal(
        caseUpdateID,
        cleanInvestigationId
      );
      if (response?.statusCode === 0) {
        localStorage.clear();
        alert('Final submission successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error submitting case update:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'd MMMM, y');
    } catch {
      return dateStr;
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <Grid container spacing={2} sx={{ py: 1, borderBottom: '1px solid #e0e0e0' }}>
      <Grid size={{ xs: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
      </Grid>
      <Grid size={{ xs: 9 }}>
        <Typography variant="body2">{value || '-'}</Typography>
      </Grid>
    </Grid>
  );

  const InfoCard = ({ children }: { children: React.ReactNode }) => (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        p: 2,
        height: '100%',
      }}
    >
      {children}
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isPresent === null) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 'bold',
            color: '#6F62C2',
          }}
        >
          FO Update is pending
        </Typography>
      </Box>
    );
  }

  if (!payloadData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No data available</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* Status of Insured */}
        <InfoRow
          label="Status of Insured at the time of Visit"
          value={isPresent ? 'Present' : 'Not Present'}
        />

        {/* Planned Admission Section */}
        {!isPresent && reasonVal === 'plannedadmission' && (
          <>
            <Grid container spacing={2} sx={{ py: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoCard>
                  <InfoRow
                    label="Hospital Visit Done"
                    value={payloadData.hospitalVisitDone ? 'Yes' : 'No'}
                  />
                </InfoCard>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoCard>
                  <InfoRow
                    label="Insured Visit Done"
                    value={payloadData.insuredVisitDone ? 'Yes' : 'No'}
                  />
                </InfoCard>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ py: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoCard>
                  <InfoRow
                    label="Hospital Visit (Expected DOA)"
                    value={payloadData.expectedDateOfAdmission}
                  />
                </InfoCard>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoCard>
                  <InfoRow
                    label="Insured Visit (Expected DOA)"
                    value={payloadData.insuredVisitDoneExpectedDateOfAdmission}
                  />
                </InfoCard>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ py: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoCard>
                  <Box sx={{ mb: 2 }}>
                    <InfoRow label="Treatment Planned" value={payloadData.treatmentPlanned} />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InfoRow label="Estimated Bill" value={payloadData.estimatedBill} />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <InfoRow
                      label="Hospital Visit Reason"
                      value={payloadData.hospitalVisitDoneReason}
                    />
                  </Box>
                  <InfoRow label="Treating Doctor Visit" value={payloadData.treatingDoctorVisit} />
                </InfoCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <InfoCard>
                  <Box sx={{ mb: 1 }}>
                    <InfoRow
                      label="Is Patient willingly admitted"
                      value={payloadData.insuredVisitDoneIsPatientAdmitted}
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <InfoRow
                      label="Treatment Planned Insured Visit"
                      value={payloadData.insuredVisitDoneTreatmentPlanned}
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <InfoRow label="Ailment" value={payloadData.insuredVisitDoneAilment} />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <InfoRow
                      label="Presenting C/O duration"
                      value={payloadData.insuredVisitDonePresentingDuration}
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <InfoRow
                      label="Estimated Bill"
                      value={payloadData.insuredVisitDoneEstimatedBill}
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <InfoRow
                      label="H/O any previous hospitalization"
                      value={payloadData.insuredVisitDoneHOAnyPreviousHospitalization}
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <InfoRow
                      label="Kyc Documents Collected"
                      value={payloadData.kcyDocument ? 'Yes' : 'No'}
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <InfoRow label="Reason" value={payloadData.kcyDocumentsReason} />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <InfoRow
                      label="Withdrawal /Confirmation collected?"
                      value={payloadData.insuredVisitDoneWithdrawalCollected}
                    />
                  </Box>
                  <InfoRow label="Observations" value={payloadData.insuredVisitDoneObservations} />
                </InfoCard>
              </Grid>
            </Grid>
          </>
        )}

        {/* Regular Visit Fields */}
        {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
          <>
            <InfoRow label="Room Category" value={payloadData.roomCategory} />
            <Grid container spacing={2} sx={{ py: 1, borderBottom: '1px solid #e0e0e0' }}>
              <Grid size={{ xs: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Room Rent/ Day
                </Typography>
              </Grid>
              <Grid size={{ xs: 3 }}>
                <Typography variant="body2">INR. {payloadData.roomRent} /-</Typography>
              </Grid>
              <Grid size={{ xs: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  DOA
                </Typography>
              </Grid>
              <Grid size={{ xs: 5 }}>
                <Typography variant="body2">{formatDate(payloadData.doa)}</Typography>
              </Grid>
            </Grid>
            <InfoRow
              label="Expected Date of Discharge"
              value={formatDate(payloadData.expectedDateOfDischarge)}
            />
          </>
        )}

        {reasonVal !== 'notfoundhosp' && (
          <InfoRow label="Diagnosis" value={payloadData.diagnosis} />
        )}

        {/* IPD Section */}
        {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
          <Grid container spacing={2} sx={{ py: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <Box sx={{ mb: 2 }}>
                  <InfoRow
                    label="IPD register entry found"
                    value={payloadData.iPDRegisterEntryFound}
                  />
                </Box>
                <InfoRow label="Observations" value={payloadData.iPDRegisterObservations} />
              </InfoCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <Box sx={{ mb: 1 }}>
                  <InfoRow label="IPDs Collected" value={payloadData.iPDCollectedReason} />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <InfoRow label="Findings" value={payloadData.anyOtherFindings} />
                </Box>
                <InfoRow
                  label="Non-PED Observations"
                  value={payloadData.iPDCollectedDiscrepancyPEDObservations}
                />
              </InfoCard>
            </Grid>
          </Grid>
        )}

        {/* Treating Doctor Section */}
        {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
          <Grid container spacing={2} sx={{ py: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <Box sx={{ mb: 2 }}>
                  <InfoRow label="Treating doctor Visit" value={payloadData.treatingDoctorVisit} />
                </Box>
                <InfoRow label="Findings" value={payloadData.treatingDoctorVisitPEDNotedFindings} />
              </InfoCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <Box sx={{ mb: 1 }}>
                  <InfoRow label="Line of Treatment" value={payloadData.lineOfTreatment} />
                </Box>
                <Box sx={{ mb: 1 }}>
                  <InfoRow
                    label="Is Active line of treatment Given?"
                    value={payloadData.isActiveMedicalManagementLOTGiven}
                  />
                </Box>
                <InfoRow label="Justification" value={payloadData.medicalManagementJustification} />
              </InfoCard>
            </Grid>
          </Grid>
        )}

        {reasonVal !== 'notfoundhosp' && (
          <InfoRow label="Past Records checked with MRD?" value={payloadData.pastRecordsCheckedMRD} />
        )}

        {/* Lab & Chemist Section */}
        {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
          <Grid container spacing={2} sx={{ py: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <Box sx={{ mb: 2 }}>
                  <InfoRow label="Lab Report" value={payloadData.labReportVerified} />
                </Box>
                <InfoRow label="Observations" value={payloadData.labReportObservations} />
              </InfoCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <Box sx={{ mb: 2 }}>
                  <InfoRow label="Chemist" value={payloadData.isChemist} />
                </Box>
                <InfoRow label="Observations" value={payloadData.chemistObservations} />
              </InfoCard>
            </Grid>
          </Grid>
        )}

        {/* Hospital Feedback Section */}
        {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
          <Grid container spacing={2} sx={{ py: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  INSURED VISIT
                </Typography>
                <Grid container spacing={2} sx={{ py: 1 }}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2">Statement collected</Typography>
                  </Grid>
                  <Grid size={{ xs: 2 }}>
                    <Typography variant="body2">Yes</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="body2">KYC Documents: Collected</Typography>
                  </Grid>
                </Grid>
                <Box sx={{ py: 1 }}>
                  <Typography variant="body2">
                    <strong>Insured Habits:</strong> Alcohol Smoking
                  </Typography>
                </Box>
              </InfoCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <Box sx={{ mb: 2 }}>
                  <InfoRow label="Hospital Feedback" value={payloadData.hospitalFeedBack} />
                </Box>
                <InfoRow label="Hospital Remarks" value={payloadData.hospitalRemarks} />
              </InfoCard>
            </Grid>
          </Grid>
        )}

        {/* Additional Observations */}
        <Grid container spacing={2} sx={{ py: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <InfoRow
                label="Any Other Observations / Findings"
                value={payloadData.anyOtherObservationsFindings}
              />
            </InfoCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <Box sx={{ mb: 1 }}>
                <InfoRow
                  label="Is chemist to be tagged as Fraud"
                  value={
                    payloadData.chemistFraud !== null
                      ? payloadData.chemistFraud
                        ? 'Yes'
                        : 'No'
                      : 'None'
                  }
                />
              </Box>
              <InfoRow
                label="Is Lab to be tagged as Fraud"
                value={
                  payloadData.labFraud !== null
                    ? payloadData.labFraud
                      ? 'Yes'
                      : 'No'
                    : 'None'
                }
              />
            </InfoCard>
          </Grid>
        </Grid>

        {/* Chemist & Lab Details */}
        <Grid container spacing={2} sx={{ py: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Chemist Details
              </Typography>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="Chemist Name" value={payloadData.chemistName} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="Address" value={payloadData.chemistAddress} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="State" value={payloadData.chemistState} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="City" value={payloadData.chemistCity} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="Pin" value={payloadData.chemistPinCode} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="License" value={payloadData.chemistLicenceNumber} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="GST" value={payloadData.chemistGSTNo} />
              </Box>
              <InfoRow label="Reason" value={payloadData.chemistReason} />
            </InfoCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Lab Details
              </Typography>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="Lab Name" value={payloadData.labName} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="Address" value={payloadData.labAddress} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="State" value={payloadData.labState} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="City" value={payloadData.labCity} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="Pin" value={payloadData.labPinCode} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="License" value={payloadData.labLicenceNumber} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="GST" value={payloadData.labGSTNo} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow
                  label="Is Pathologist Attached?"
                  value={
                    payloadData.pathologist !== null
                      ? payloadData.pathologist
                        ? 'Yes'
                        : 'No'
                      : '-'
                  }
                />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="Pathologist Name" value={payloadData.pathologistName} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow
                  label="Registration Number"
                  value={payloadData.pathologistRegistrationNumber}
                />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="Pathologists Feedback" value={payloadData.pathologistFeedback} />
              </Box>
              <Box sx={{ mb: 1 }}>
                <InfoRow label="Findings" value={payloadData.pathologistFinding} />
              </Box>
              <InfoRow label="Reason" value={payloadData.labReportReason} />
            </InfoCard>
          </Grid>
        </Grid>

        {/* Doctor Table */}
        {doctorTable.length > 0 && (
          <Box sx={{ py: 2 }}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead sx={{ backgroundColor: '#6F62C2' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Treating doctor Name
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contact No.</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Registration Number
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Qualification</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Stream</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      To be tagged as Fraud / Caution?
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctorTable.map((doctor, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        {`${doctor.firstName} ${doctor.middleName} ${doctor.lastName}`}
                      </TableCell>
                      <TableCell>{doctor.contactNo}</TableCell>
                      <TableCell>{doctor.regNo}</TableCell>
                      <TableCell>{doctor.qualification}</TableCell>
                      <TableCell>{doctor.stream}</TableCell>
                      <TableCell>{doctor.fraud ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Submit Button */}
        {!buttonVisible && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', pt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSaveSubmit}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
                textTransform: 'none',
                px: 4,
              }}
            >
              Save and Submit
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CentralRegionalCaseUpdate;