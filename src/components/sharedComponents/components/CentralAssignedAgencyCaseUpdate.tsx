// File: src/components/CentralAssignedAgencyCaseUpdate.tsx
// Complete standalone component - just copy and paste!

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Save,
} from '@mui/icons-material';
import { caseUpdateService } from '../../../services/caseupdate.service';
import { notificationService } from '../../../utils/notification.service';
import { message } from '../../../constants/messages';

interface CentralAssignedAgencyCaseUpdateProps {
  isInsuredVisit?: boolean;
  buttonVisible?: boolean;
  previewRefresh?: boolean;
}

interface DoctorData {
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
  hospitalVisitDone?: boolean;
  insuredVisitDone?: boolean;
  expectedDateOfAdmission?: string;
  insuredVisitDoneExpectedDateOfAdmission?: string;
  treatmentPlanned?: string;
  estimatedBill?: string;
  hospitalVisitDoneReason?: string;
  treatingDoctorVisit?: string;
  insuredVisitDoneIsPatientAdmitted?: string;
  insuredVisitDoneTreatmentPlanned?: string;
  insuredVisitDoneAilment?: string;
  insuredVisitDonePresentingDuration?: string;
  insuredVisitDoneEstimatedBill?: string;
  insuredVisitDoneHOAnyPreviousHospitalization?: string;
  kcyDocument?: boolean;
  kcyDocumentsReason?: string;
  insuredVisitDoneWithdrawalCollected?: string;
  insuredVisitDoneObservations?: string;
  roomCategory?: string;
  roomRent?: string;
  doa?: string;
  expectedDateOfDischarge?: string;
  diagnosis?: string;
  iPDRegisterEntryFound?: string;
  iPDRegisterObservations?: string;
  iPDCollectedReason?: string;
  anyOtherFindings?: string;
  iPDCollectedDiscrepancyPEDObservations?: string;
  treatingDoctorVisitPEDNotedFindings?: string;
  lineOfTreatment?: string;
  isActiveMedicalManagementLOTGiven?: string;
  medicalManagementJustification?: string;
  pastRecordsCheckedMRD?: string;
  labReportVerified?: string;
  labReportObservations?: string;
  isChemist?: string;
  chemistObservations?: string;
  hospitalFeedBack?: string;
  hospitalRemarks?: string;
  anyOtherObservationsFindings?: string;
  chemistFraud?: boolean | null;
  labFraud?: boolean | null;
  chemistName?: string;
  chemistAddress?: string;
  chemistState?: string;
  chemistCity?: string;
  chemistPinCode?: string;
  chemistLicenceNumber?: string;
  chemistGSTNo?: string;
  chemistReason?: string;
  labName?: string;
  labAddress?: string;
  labState?: string;
  labCity?: string;
  labPinCode?: string;
  labLicenceNumber?: string;
  labGSTNo?: string;
  pathologist?: boolean | null;
  pathologistName?: string;
  pathologistRegistrationNumber?: string;
  pathologistFeedback?: string;
  pathologistFinding?: string;
  labReportReason?: string;
  caseUpdateDoctor?: DoctorData[];
}

const CentralAssignedAgencyCaseUpdate: React.FC<CentralAssignedAgencyCaseUpdateProps> = ({
  isInsuredVisit,
  buttonVisible = false,
  previewRefresh = false,
}) => {
  const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [investigationId, setInvestigationId] = useState('');
  const [payloadData, setPayloadData] = useState<PayloadData | null>(null);
  const [doctorTable, setDoctorTable] = useState<DoctorData[]>([]);
  const [isPresent, setIsPresent] = useState<boolean | null>(null);
  const [reasonVal, setReasonVal] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const claimsType = searchParams.get('claimsType') || 'cashless';
  const redirectTo = searchParams.get('redirectTo');

  useEffect(() => {
    if (paramInvestigationId) {
      const cleanId = paramInvestigationId.split(' ')[0];
      setInvestigationId(cleanId);
    }
  }, [paramInvestigationId]);

  useEffect(() => {
    if (investigationId) {
      getDetails();
    }
  }, [investigationId, previewRefresh, claimsType]);

  const getDetails = async () => {
    try {
      setLoading(true);
      let response;

      if (claimsType === 'cashless') {
        response = await caseUpdateService.caseUpdatePreview(investigationId);
      } else if (claimsType === 'reim') {
        response = await caseUpdateService.caseUpdatePreviousDataReim(investigationId);
      }

      if (response && response.statusCode === 0) {
        setPayloadData(response.payload);
        setDoctorTable(response.payload.caseUpdateDoctor || []);
        setIsPresent(response.payload.boolStatusOfInsured);
        setReasonVal(response.payload.reason);
      }
    } catch (error) {
      console.error('Error fetching case update details:', error);
      notificationService.showAlertError('Failed to load case update details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSubmit = async () => {
    try {
      setLoading(true);
      const caseUpdateID = localStorage.getItem('activeCaseID');

      if (!caseUpdateID) {
        notificationService.showAlertError('Case Update ID not found');
        return;
      }

      const response = await caseUpdateService.addCaseUpdateFinal(caseUpdateID, investigationId);

      if (response.statusCode === 0) {
        localStorage.clear();
        notificationService.showAlertSuccess(message.finalSubmit);

        if (redirectTo) {
          navigate(redirectTo.replace('/investigation', ''));
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        notificationService.showAlertError(response.message ?? 'Failed to submit case update');
      }
    } catch (error) {
      console.error('Error submitting case update:', error);
      notificationService.showAlertError('Failed to submit case update');
    } finally {
      setLoading(false);
    }
  };

  const InfoRow: React.FC<{ label: string; value: string | undefined; fullWidth?: boolean }> = ({
    label,
    value,
    fullWidth = false,
  }) => (
    <Grid container spacing={2} sx={{ py: 1 }}>
      <Grid size={{ xs: fullWidth ? 12 : 4 }} >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
      </Grid>
      <Grid size={{ xs: fullWidth ? 12 : 8 }}>
        <Typography variant="body2">{value || '-'}</Typography>
      </Grid>
    </Grid>
  );

  const InfoCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
        borderRadius: 2,
        p: 2,
      }}
    >
      {children}
    </Card>
  );

  if (loading && !payloadData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#2E5A96' }}/>
      </Box>
    );
  }

  if (isPresent === null || !payloadData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            FO Update is pending from agency
          </Typography>
          <Typography variant="body2">
            Field Officer from the agency has not submitted the case update yet.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Status of Insured */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Status of Insured at the time of Visit
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Chip
                icon={isPresent ? <CheckCircle /> : <Cancel />}
                label={isPresent ? 'Present' : 'Not Present'}
                color={isPresent ? 'success' : 'error'}
                sx={{ fontWeight: 600 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Planned Admission Section */}
      {!isPresent && reasonVal === 'plannedadmission' && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <InfoRow
                  label="Hospital Visit Done"
                  value={payloadData?.hospitalVisitDone ? 'Yes' : 'No'}
                />
                <InfoRow
                  label="Hospital Visit (Expected DOA)"
                  value={payloadData?.expectedDateOfAdmission}
                />
                <InfoRow label="Treatment Planned" value={payloadData?.treatmentPlanned} />
                <InfoRow label="Estimated Bill" value={payloadData?.estimatedBill} />
                <InfoRow
                  label="Hospital Visit Reason"
                  value={payloadData?.hospitalVisitDoneReason}
                />
                <InfoRow
                  label="Treating Doctor Visit"
                  value={payloadData?.treatingDoctorVisit}
                />
              </InfoCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <InfoRow
                  label="Insured Visit Done"
                  value={payloadData?.insuredVisitDone ? 'Yes' : 'No'}
                />
                <InfoRow
                  label="Insured Visit (Expected DOA)"
                  value={payloadData?.insuredVisitDoneExpectedDateOfAdmission}
                />
                <InfoRow
                  label="Is Patient willingly admitted"
                  value={payloadData?.insuredVisitDoneIsPatientAdmitted}
                />
                <InfoRow
                  label="Treatment Planned Insured Visit"
                  value={payloadData?.insuredVisitDoneTreatmentPlanned}
                />
                <InfoRow label="Ailment" value={payloadData?.insuredVisitDoneAilment} />
                <InfoRow
                  label="Presenting C/O duration"
                  value={payloadData?.insuredVisitDonePresentingDuration}
                />
                <InfoRow
                  label="Estimated Bill"
                  value={payloadData?.insuredVisitDoneEstimatedBill}
                />
                <InfoRow
                  label="H/O any previous hospitalization"
                  value={payloadData?.insuredVisitDoneHOAnyPreviousHospitalization}
                />
                <InfoRow
                  label="Kyc Documents Collected"
                  value={payloadData?.kcyDocument ? 'Yes' : 'No'}
                />
                <InfoRow label="Reason" value={payloadData?.kcyDocumentsReason} />
                <InfoRow
                  label="Withdrawal /Confirmation collected?"
                  value={payloadData?.insuredVisitDoneWithdrawalCollected}
                />
                <InfoRow
                  label="Observations"
                  value={payloadData?.insuredVisitDoneObservations}
                />
              </InfoCard>
            </Grid>
          </Grid>
        </>
      )}

      {/* Regular Hospital Visit Section */}
      {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <InfoRow label="Room Category" value={payloadData?.roomCategory} />
              <Grid container spacing={2} sx={{ py: 1 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Room Rent/ Day
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="body2">INR. {payloadData?.roomRent} /-</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    DOA
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2">
                    {payloadData?.doa
                      ? new Date(payloadData?.doa).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                      : '-'}
                  </Typography>
                </Grid>
              </Grid>
              <InfoRow
                label="Expected Date of Discharge"
                value={
                  payloadData?.expectedDateOfDischarge
                    ? new Date(payloadData?.expectedDateOfDischarge).toLocaleDateString(
                      'en-IN',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }
                    )
                    : '-'
                }
              />
            </CardContent>
          </Card>

          {/* Diagnosis */}
          {reasonVal !== 'notfoundhosp' && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <InfoRow label="Diagnosis" value={payloadData?.diagnosis} fullWidth />
              </CardContent>
            </Card>
          )}

          {/* IPD Register & Collections */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <InfoRow
                  label="IPD register entry found"
                  value={payloadData.iPDRegisterEntryFound}
                />
                <InfoRow
                  label="Observations"
                  value={payloadData.iPDRegisterObservations}
                />
              </InfoCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <InfoRow label="IPDs Collected" value={payloadData.iPDCollectedReason} />
                <InfoRow label="Findings" value={payloadData.anyOtherFindings} />
                <InfoRow
                  label="Non-PED Observations"
                  value={payloadData.iPDCollectedDiscrepancyPEDObservations}
                />
              </InfoCard>
            </Grid>
          </Grid>

          {/* Treating Doctor Visit & Line of Treatment */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <InfoRow
                  label="Treating doctor Visit"
                  value={payloadData.treatingDoctorVisit}
                />
                <InfoRow
                  label="Findings"
                  value={payloadData.treatingDoctorVisitPEDNotedFindings}
                />
              </InfoCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoCard>
                <InfoRow label="Line of Treatment" value={payloadData.lineOfTreatment} />
                <InfoRow
                  label="Is Active line of treatment Given?"
                  value={payloadData.isActiveMedicalManagementLOTGiven}
                />
                <InfoRow
                  label="Justification"
                  value={payloadData.medicalManagementJustification}
                />
              </InfoCard>
            </Grid>
          </Grid>
        </>
      )}

      {/* Past Records */}
      {reasonVal !== 'notfoundhosp' && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <InfoRow
              label="Past Records checked with MRD?"
              value={payloadData.pastRecordsCheckedMRD}
            />
          </CardContent>
        </Card>
      )}

      {/* Lab Report & Chemist */}
      {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <InfoRow label="Lab Report" value={payloadData.labReportVerified} />
              <InfoRow label="Observations" value={payloadData.labReportObservations} />
            </InfoCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <InfoRow label="Chemist" value={payloadData.isChemist} />
              <InfoRow label="Observations" value={payloadData.chemistObservations} />
            </InfoCard>
          </Grid>
        </Grid>
      )}

      {/* Insured Visit & Hospital Feedback */}
      {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                INSURED VISIT
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Statement collected
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2">Yes</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    KYC Documents
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2">Collected</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Insured Habits
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2">Alcohol Smoking</Typography>
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard>
              <InfoRow label="Hospital Feedback" value={payloadData.hospitalFeedBack} />
              <InfoRow label="Hospital Remarks" value={payloadData.hospitalRemarks} />
            </InfoCard>
          </Grid>
        </Grid>
      )}

      {/* Other Observations & Fraud Flags */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
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
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <InfoCard>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              Chemist Details
            </Typography>
            <InfoRow label="Chemist Name" value={payloadData.chemistName} />
            <InfoRow label="Address" value={payloadData.chemistAddress} />
            <InfoRow label="State" value={payloadData.chemistState} />
            <InfoRow label="City" value={payloadData.chemistCity} />
            <InfoRow label="Pin" value={payloadData.chemistPinCode} />
            <InfoRow label="License" value={payloadData.chemistLicenceNumber} />
            <InfoRow label="GST" value={payloadData.chemistGSTNo} />
            <InfoRow label="Reason" value={payloadData.chemistReason} />
          </InfoCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <InfoCard>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              Lab Details
            </Typography>
            <InfoRow label="Lab Name" value={payloadData.labName} />
            <InfoRow label="Address" value={payloadData.labAddress} />
            <InfoRow label="State" value={payloadData.labState} />
            <InfoRow label="City" value={payloadData.labCity} />
            <InfoRow label="Pin" value={payloadData.labPinCode} />
            <InfoRow label="License" value={payloadData.labLicenceNumber} />
            <InfoRow label="GST" value={payloadData.labGSTNo} />
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
            <InfoRow label="Pathologist Name" value={payloadData.pathologistName} />
            <InfoRow
              label="Registration Number"
              value={payloadData.pathologistRegistrationNumber}
            />
            <InfoRow
              label="Pathologists Feedback"
              value={payloadData.pathologistFeedback}
            />
            <InfoRow label="Findings" value={payloadData.pathologistFinding} />
            <InfoRow label="Reason" value={payloadData.labReportReason} />
          </InfoCard>
        </Grid>
      </Grid>

      {/* Treating Doctor Table */}
      {doctorTable.length > 0 && (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
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
              {doctorTable.map((doctor, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {`${doctor.firstName || ''} ${doctor.middleName || ''} ${doctor.lastName || ''
                      }`.trim()}
                  </TableCell>
                  <TableCell>{doctor.contactNo}</TableCell>
                  <TableCell>{doctor.regNo}</TableCell>
                  <TableCell>{doctor.qualification}</TableCell>
                  <TableCell>{doctor.stream}</TableCell>
                  <TableCell>
                    <Chip
                      label={doctor.fraud ? 'Yes' : 'No'}
                      color={doctor.fraud ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Submit Button */}
      {!buttonVisible && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveSubmit}
            disabled={loading}
            sx={{
              background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764BA2 0%, #667EEA 100%)',
              },
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