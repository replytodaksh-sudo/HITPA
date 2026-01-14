// src/components/CaseUpdate/Preview.tsx - Part 1: Setup & State

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import { caseUpdateService } from '../../../services/caseupdate.service';

// ============================================
// PART 1: INTERFACE DEFINITIONS & STATE SETUP
// ============================================

interface PreviewProps {
  isInsuredVisit?: boolean;
  buttonVisible?: boolean;
  previewRefresh?: boolean;
  previuosData?:any
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

interface PreviewData {
  // ===== STATUS & REASON =====
  boolStatusOfInsured: boolean;
  reason: string; // 'plannedadmission', 'notfoundhosp', or regular
  
  // ===== BASIC DETAILS =====
  roomCategory?: string;
  roomRent?: number;
  doa?: string;
  expectedDateOfDischarge?: string;
  diagnosis?: string;
  
  // ===== PLANNED ADMISSION - HOSPITAL VISIT =====
  hospitalVisitDone?: boolean;
  insuredVisitDone?: boolean;
  expectedDateOfAdmission?: string;
  insuredVisitDoneExpectedDateOfAdmission?: string;
  treatmentPlanned?: string;
  estimatedBill?: string;
  hospitalVisitDoneReason?: string;
  treatingDoctorVisit?: string;
  hospitalVisitDoneHOAnyPreviousHospitalization?: string;
  treatingDoctorVisitPEDNoted?: boolean;
  treatingDoctorVisitPEDNotedFindings?: string;
  treatingDoctorVisitDiscrepancyPED?: boolean;
  treatingDoctorVisitPEDObservations?: string;
  treatingDoctorVisitReason?: string;
  
  // ===== PLANNED ADMISSION - INSURED VISIT =====
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
  
  // ===== NOT FOUND AT HOSPITAL =====
  patientReferredAnotherCenter?: boolean;
  anotherHospitalName?: string;
  anotherVerificationDone?: boolean;
  anotherObservations?: string;
  ipdnotingsFound?: boolean;
  iPDNotingsFoundObservations?: string;
  ipdnotingsFoundClarification?: boolean;
  iPDNotingsFoundClarificationObservations?: string;
  iPDNotingsFoundClarificationJustification?: string;
  reasonForNotPresent?: string;
  
  // ===== IPD REGISTER & COLLECTION =====
  iPDRegisterEntryFound?: string;
  iPDRegisterObservations?: string;
  ipdRegisterDiscrepancyNoted?: boolean;
  iPDRegisterDiscrepancyObservations?: string;
  ipdCollected?: string;
  iPDCollectedReason?: string;
  ipdCollectedPEDNoted?: boolean;
  iPDCollectedPEDNotedFindings?: string;
  isIPDCollectedDiscrepancyPED?: boolean;
  iPDCollectedDiscrepancyPEDObservations?: string;
  ipdCollectedDiscrepancyPED?: boolean;
  
  // ===== LINE OF TREATMENT =====
  lineOfTreatment?: string; // 'medicalmanagement', 'surgicalmanagement', 'rtaaccidental'
  
  // ===== MEDICAL MANAGEMENT =====
  isActiveMedicalManagementLOTGiven?: string;
  medicalManagementJustification?: string;
  medicalManagementIsHospitalization?: string;
  medicalManagementObsevations?: string;
  medicalManagementFindings?: string;
  
  // ===== SURGICAL MANAGEMENT =====
  surgicalManagementProcedureCarriedOut?: string;
  surgicalManagementOperative?: string;
  surgicalManagementOperativeFindings?: string;
  surgicalManagementOperativeReason?: string;
  surgicalManagementAnaesthesia?: string;
  surgicalManagementAnaesthesiaFindings?: string;
  surgicalManagementAnaesthesiaReason?: string;
  surgicalManagementAnyImplantUsed?: boolean;
  surgicalManagementInvoiceVerified?: string;
  surgicalManagementInvoiceVerifiedStickerNumber?: string;
  surgicalManagementInvoiceVerifiedManufacturer?: string;
  surgicalManagementInvoiceVerifiedFinding?: string;
  
  // ===== RTA ACCIDENTAL - MAIN =====
  rtaFIRCopyReceived?: boolean;
  rtaDateOfFIR?: string;
  rtaFIRObservations?: string;
  rtaFIRVerification?: string;
  rtaFIRVerificationFinding?: string;
  rtaFIRVerificationReason?: string;
  rtaFIRReason?: string;
  rtaMLCCopyreceived?: boolean;
  rtaDateOfMLC?: string;
  rtaMLCObservations?: string;
  rtaMLCVerification?: string;
  rtaMLCVerificationFinding?: string;
  rtaMLCVerificationReason?: string;
  rtaMLCReason?: string;
  rtaAlcoholIntoxicationNoted?: boolean;
  rtaAlcoholFindings?: string;
  rtaLineOfTreatment?: string; // 'medicalmanagement' or 'surgicalmanagement'
  
  // ===== RTA - MEDICAL MANAGEMENT =====
  rtaMedicalIsActive?: string;
  rtaMedicalJustification?: string;
  rtaMedicalIsHospitalization?: string;
  rtaMedicalFindings?: string;
  rtaMedicalObsevations?: string;
  
  // ===== RTA - SURGICAL MANAGEMENT =====
  rtaSurgicalProcedureCarriedOut?: string;
  rtaSurgicalOperative?: string;
  rtaSurgicalOperativeFindings?: string;
  rtaSurgicalOperativeReason?: string;
  rtaSurgicalAnaesthesia?: string;
  rtaSurgicalAnaesthesiaFindings?: string;
  rtaSurgicalAnaesthesiaReason?: string;
  rtaSurgicalAnyImplantUsed?: boolean;
  rtaSurgicalInvoiceVerified?: string;
  
  // ===== PAST RECORDS / MRD =====
  pastRecordsCheckedMRD?: string;
  pastRecordsCheckedMRDPastTreatment?: boolean;
  pastRecordsCheckedMRDHospitalizationNoted?: string;
  pastRecordsCheckedMRDNOT?: boolean;
  pastRecordsCheckedMRDReason?: string;
  
  // ===== LAB & CHEMIST =====
  labReportVerified?: boolean;
  labReportReason?: string;
  labReportObservations?: string;
  chemist?: boolean;
  chemistObservations?: string;
  chemistReason?: string;
  
  // ===== INSURED HABITS & KYC =====
  alcoholHistory?: boolean;
  alcoholHistoryQuantity?: string;
  smokingHistory?: boolean;
  smokingHistoryQuantity?: string;
  anyOtherHabits?: string;
  kcyDocumentsAnyDiscrepancies?: string;
  
  // ===== HOSPITAL FEEDBACK =====
  hospitalFeedBack?: string;
  hospitalRemarks?: string;
  
  // ===== STATEMENT COLLECTION =====
  statementCollected?: boolean;
  statementCollectedReason?: string;
  statementCollectedDiscrepanciesFound?: boolean;
  statementCollectedDiscrepanciesFindings?: string;
  statementCollectedPEDNoted?: boolean;
  statementCollectedPEDFinidings?: string;
  statementCollectedPEDNotedPastDocumentsCollected?: boolean;
  statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify?: string;
  statementCollectedPEDNotedPastDocumentsCollectedReason?: string;
  
  // ===== OTHER FINDINGS =====
  anyOtherFindings?: string;
  anyOtherObservationsFindings?: string;
  
  // ===== FRAUD TAGGING - CHEMIST =====
  chemistFraud?: boolean | null;
  chemistDetails?: string;
  chemistName?: string;
  chemistAddress?: string;
  chemistStateName?: string;
  chemistCityName?: string;
  chemistPinCode?: string;
  chemistLicenceNumber?: string;
  chemistGSTNo?: string;
  
  // ===== FRAUD TAGGING - LAB =====
  labFraud?: boolean | null;
  labDetails?: string;
  labName?: string;
  labAddress?: string;
  labStateName?: string;
  labCityName?: string;
  labPinCode?: string;
  labLicenceNumber?: string;
  labGSTNo?: string;
  
  // ===== FRAUD TAGGING - PATHOLOGIST =====
  pathologist?: boolean | null;
  pathologistName?: string;
  pathologistRegistrationNumber?: string;
  pathologistFeedback?: string;
  pathologistFinding?: string;
  
  // ===== OTHER =====
  insuredVisit?: boolean;
  insuredVisitReason?: string;
  copyOfDischargeCardCollected?: boolean;
  copyOfFinalBillCollected?: boolean;
  
  // ===== DOCTOR TABLE =====
  caseUpdateDoctor?: DoctorData[];
}

const Preview: React.FC<PreviewProps> = ({
  isInsuredVisit,
  buttonVisible = false,
  previewRefresh = false,
  previuosData,
}) => {
  // ===== ROUTER HOOKS =====
  const { investigationId } = useParams<{ investigationId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // ===== STATE VARIABLES =====
  const [payloadData, setPayloadData] = useState<PreviewData | null>(null);
  const [doctorTable, setDoctorTable] = useState<DoctorData[]>([]);
  const [isPresent, setIsPresent] = useState(false);
  const [reasonVal, setReasonVal] = useState('');
  const [loading, setLoading] = useState(true);
  
  const redirectTo = searchParams.get('redirectTo');

  // ===== EFFECTS =====
  useEffect(() => {
    if (investigationId) {
      getDetails();
    }
  }, [investigationId, previewRefresh]);

  // ============================================
  // PART 2: DATA FETCHING & HELPER FUNCTIONS
  // ============================================

  /**
   * Fetch investigation preview details from API
   */
  const getDetails = async () => {
    try {
      setLoading(true);
      const cleanInvId = investigationId?.split(' ')[0] || '';
      const response = await caseUpdateService.caseUpdatePreview(cleanInvId);
      
      if (response.statusCode === 0) {
        setPayloadData(response.payload);
        setDoctorTable(response.payload.caseUpdateDoctor || []);
        setIsPresent(response.payload.boolStatusOfInsured);
        setReasonVal(response.payload.reason);
        console.log('Preview data loaded:', response.payload);
      }
    } catch (error) {
      console.error('Error fetching preview:', error);
      alert('Failed to load preview data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submit case to QC for review
   */
  const saveSubmit = async () => {
    try {
      const caseUpdateID = localStorage.getItem('activeCaseID');
      
      if (!caseUpdateID) {
        alert('Case ID not found. Please save your changes first.');
        return;
      }
      
      const cleanInvId = investigationId?.split(' ')[0] || '';
      const response = await caseUpdateService.addCaseUpdateFinal(
        caseUpdateID,
        cleanInvId
      );
      
      if (response.statusCode === 0) {
        // Clear localStorage
        localStorage.removeItem('activeCaseID');
        
        alert('Case submitted successfully to QC');
        
        // Navigate to redirect URL or dashboard
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Error submitting case:', error);
      alert('Failed to submit case to QC');
    }
  };

  /**
   * Format date string to readable format
   * @param date - ISO date string
   * @returns Formatted date like "21 November, 2025"
   */
  const formatDate = (date: string | undefined): string => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  /**
   * Display boolean as Yes/No
   */
  const displayBoolean = (value: boolean | undefined | null): string => {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return 'None';
  };

  /**
   * Get line of treatment display text
   */
  const getLineOfTreatmentText = (lot: string | undefined): string => {
    if (lot === 'medicalmanagement' || lot === 'medicalManagement') return 'Medical Management';
    if (lot === 'surgicalmanagement' || lot === 'surgicalManagement') return 'Surgical Management (Non Accidental)';
    if (lot === 'rtaaccidental' || lot === 'rtaAccidentalCase') return 'RTA-Accidental case';
    return 'None';
  };

  /**
   * Get treating doctor visit display text
   */
  const getTreatingDoctorVisitText = (visit: string | undefined): string => {
    if (visit === 'statementcollected') return 'Statement Collected';
    if (visit === 'statementnotcollected') return 'Statement not collected';
    return 'None';
  };

  /**
   * Reusable Info Row Component
   * Displays label-value pair in a consistent format
   */
  const InfoRow: React.FC<{ label: string; value: any }> = ({ label, value }) => (
    <Grid container spacing={1} sx={{ mb: 1 }}>
      <Grid size={{ xs: 4 }}>
        <Typography variant="body2" fontWeight={500}>
          {label}
        </Typography>
      </Grid>
      <Grid size={{ xs: 8 }}>
        <Typography variant="body2" color="text.secondary">
          {value !== undefined && value !== null && value !== '' ? value : 'None'}
        </Typography>
      </Grid>
    </Grid>
  );

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading preview...</Typography>
      </Box>
    );
  }

  if (!payloadData) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">No preview data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* ============================================ */}
      {/* PART 3: STATUS HEADER + PLANNED ADMISSION */}
      {/* ============================================ */}

      {/* Status of Insured */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
        <InfoRow
          label="Status of Insured at the time of Visit"
          value={isPresent ? 'Present' : 'Not Present'}
        />
      </Paper>

      {/* PLANNED ADMISSION SECTION */}
      {!isPresent && reasonVal === 'plannedadmission' && (
        <>
          {/* Hospital Visit Done / Insured Visit Done */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <InfoRow
                  label="Hospital Visit Done"
                  // value={displayBoolean(payloadData.hospitalVisitDone)}
                  value={payloadData.hospitalVisitDone}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <InfoRow
                  label="Insured Visit Done"
                  // value={displayBoolean(payloadData.insuredVisitDone)}
                  value={payloadData.insuredVisitDone}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Expected DOA Dates */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <InfoRow
                  label="Hospital Visit (Expected DOA)"
                  value={formatDate(payloadData.expectedDateOfAdmission)}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <InfoRow
                  label="Insured Visit (Expected DOA)"
                  value={formatDate(payloadData.insuredVisitDoneExpectedDateOfAdmission)}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Hospital Visit Details & Insured Visit Details */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* LEFT: Hospital Visit Details */}
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Hospital Visit Details
                </Typography>
                
                <InfoRow label="Treatment Planned" value={payloadData.treatmentPlanned} />
                <InfoRow label="Estimated Bill" value={payloadData.estimatedBill} />
                <InfoRow label="Hospital Visit Reason" value={payloadData.hospitalVisitDoneReason} />
                <InfoRow
                  label="Treating Doctor Visit"
                  value={getTreatingDoctorVisitText(payloadData.treatingDoctorVisit)}
                />
                <InfoRow
                  label="H/O any previous hospitalization"
                  value={payloadData.hospitalVisitDoneHOAnyPreviousHospitalization}
                />
                
                <Divider sx={{ my: 2 }} />
                
                <InfoRow
                  label="PED Noted"
                  value={displayBoolean(payloadData.treatingDoctorVisitPEDNoted)}
                />
                <InfoRow
                  label="PED Noted Findings"
                  value={payloadData.treatingDoctorVisitPEDNotedFindings}
                />
                <InfoRow
                  label="Discrepancy noted other than PED"
                  value={displayBoolean(payloadData.treatingDoctorVisitDiscrepancyPED)}
                />
                <InfoRow
                  label="Discrepancy Observations"
                  value={payloadData.treatingDoctorVisitPEDObservations}
                />
                <InfoRow
                  label="Any Other Observations"
                  value={payloadData.treatingDoctorVisitReason}
                />
              </Paper>
            </Grid>

            {/* RIGHT: Insured Visit Details */}
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Insured Visit Details
                </Typography>
                
                <InfoRow
                  label="Is Patient willingly admitted"
                  value={payloadData.insuredVisitDoneIsPatientAdmitted}
                />
                <InfoRow
                  label="Treatment Planned Insured Visit"
                  value={payloadData.insuredVisitDoneTreatmentPlanned}
                />
                <InfoRow label="Ailment" value={payloadData.insuredVisitDoneAilment} />
                <InfoRow
                  label="Presenting C/O duration"
                  value={payloadData.insuredVisitDonePresentingDuration}
                />
                <InfoRow
                  label="Estimated Bill"
                  value={payloadData.insuredVisitDoneEstimatedBill}
                />
                
                <Divider sx={{ my: 2 }} />
                
                <InfoRow
                  label="H/O any previous hospitalization"
                  value={payloadData.insuredVisitDoneHOAnyPreviousHospitalization}
                />
                <InfoRow
                  label="Kyc Documents Collected"
                  value={displayBoolean(payloadData.kcyDocument)}
                />
                <InfoRow label="Reason" value={payloadData.kcyDocumentsReason} />
                <InfoRow
                  label="Withdrawal /Confirmation collected?"
                  value={payloadData.insuredVisitDoneWithdrawalCollected}
                />
                <InfoRow
                  label="Observations"
                  value={payloadData.insuredVisitDoneObservations}
                />
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* ============================================ */}
      {/* PART 4: NOT FOUND AT HOSPITAL SECTION */}
      {/* ============================================ */}

      {!isPresent && reasonVal === 'notfoundhosp' && (
        <>
          {/* Is patient referred to another centre? */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <InfoRow
              label="Is patient referred to another centre?"
              value={displayBoolean(payloadData.patientReferredAnotherCenter)}
            />
          </Paper>

          {/* If Referred to Another Center */}
          {payloadData.patientReferredAnotherCenter && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* Left: Another Hospital Details */}
              <Grid size={{ xs: 6 }}>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <InfoRow label="Name of the Hospital" value={payloadData.anotherHospitalName} />
                  <InfoRow
                    label="Verification done"
                    value={displayBoolean(payloadData.anotherVerificationDone)}
                  />
                  <InfoRow label="Observations" value={payloadData.anotherObservations} />
                </Paper>
              </Grid>

              {/* Right: IPD Notings */}
              <Grid size={{ xs: 6 }}>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <InfoRow
                    label="IPDs Notings found"
                    value={displayBoolean(payloadData.ipdnotingsFound)}
                  />
                  
                  {payloadData.ipdnotingsFound ? (
                    <InfoRow label="Observations" value={payloadData.iPDNotingsFoundObservations} />
                  ) : (
                    <>
                      <InfoRow
                        label="Clarification taken from the Hospital?"
                        value={displayBoolean(payloadData.ipdnotingsFoundClarification)}
                      />
                      {payloadData.ipdnotingsFoundClarification ? (
                        <InfoRow
                          label="Observations"
                          value={payloadData.iPDNotingsFoundClarificationObservations}
                        />
                      ) : (
                        <InfoRow
                          label="Justification"
                          value={payloadData.iPDNotingsFoundClarificationJustification}
                        />
                      )}
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* If NOT Referred to Another Center - LARGE 3-COLUMN LAYOUT */}
          {!payloadData.patientReferredAnotherCenter && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* COLUMN 1: IPD Register & Treatment Details */}
              <Grid size={{ xs: 6 }}>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                    IPD Register & Treatment Details
                  </Typography>
                  
                  <InfoRow label="Reason for not present" value={payloadData.reasonForNotPresent} />
                  <InfoRow
                    label="IPD register entry found"
                    value={payloadData.iPDRegisterEntryFound === 'true' ? 'Yes' : 'No'}
                  />
                  
                  {payloadData.iPDRegisterEntryFound === 'false' && (
                    <InfoRow label="Observations" value={payloadData.iPDRegisterObservations} />
                  )}
                  
                  {payloadData.iPDRegisterEntryFound === 'true' && (
                    <>
                      <InfoRow
                        label="Discrepancy noted"
                        value={displayBoolean(payloadData.ipdRegisterDiscrepancyNoted)}
                      />
                      {payloadData.ipdRegisterDiscrepancyNoted && (
                        <InfoRow
                          label="Observations"
                          value={payloadData.iPDRegisterDiscrepancyObservations}
                        />
                      )}
                    </>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <InfoRow
                    label="IPDs Collected"
                    value={payloadData.ipdCollected === 'true' ? 'Yes' : 'No'}
                  />
                  
                  {payloadData.ipdCollected === 'false' && (
                    <InfoRow label="Reason" value={payloadData.iPDCollectedReason} />
                  )}
                  
                  {payloadData.ipdCollected === 'true' && (
                    <>
                      <InfoRow
                        label="PED Noted"
                        value={displayBoolean(payloadData.ipdCollectedPEDNoted)}
                      />
                      {!payloadData.ipdCollectedPEDNoted && (
                        <InfoRow label="Findings" value={payloadData.iPDCollectedPEDNotedFindings} />
                      )}
                      {payloadData.ipdCollectedPEDNoted && (
                        <>
                          <InfoRow
                            label="Discrepancy noted other than PED"
                            value={displayBoolean(payloadData.isIPDCollectedDiscrepancyPED)}
                          />
                          {payloadData.isIPDCollectedDiscrepancyPED && (
                            <InfoRow
                              label="Observations"
                              value={payloadData.iPDCollectedDiscrepancyPEDObservations}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <InfoRow
                    label="Treating doctor Visit"
                    value={payloadData.treatingDoctorVisit === 'true'
                      ? 'Statement Collected'
                      : 'Statement not Collected'}
                  />
                  
                  {payloadData.treatingDoctorVisit === 'false' && (
                    <InfoRow label="Reason" value={payloadData.treatingDoctorVisitReason} />
                  )}
                  
                  {payloadData.treatingDoctorVisit === 'true' && (
                    <>
                      <InfoRow
                        label="PED Noted"
                        value={displayBoolean(payloadData.treatingDoctorVisitPEDNoted)}
                      />
                      {payloadData.treatingDoctorVisitPEDNoted && (
                        <>
                          <InfoRow
                            label="Findings"
                            value={payloadData.treatingDoctorVisitPEDNotedFindings}
                          />
                          <InfoRow
                            label="Discrepancy noted other than PED"
                            value={displayBoolean(payloadData.treatingDoctorVisitDiscrepancyPED)}
                          />
                          {payloadData.treatingDoctorVisitDiscrepancyPED && (
                            <InfoRow
                              label="Observations"
                              value={payloadData.treatingDoctorVisitPEDObservations}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </Paper>
              </Grid>

              {/* COLUMN 2: Line of Treatment */}
              <Grid size={{ xs: 6 }}>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <InfoRow
                    label="Line of Treatment"
                    value={getLineOfTreatmentText(payloadData.lineOfTreatment)}
                  />
                  
                  {/* Medical Management */}
                  {payloadData.lineOfTreatment === 'medicalManagement' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                        Medical Management
                      </Typography>
                      <InfoRow
                        label="Is Active line of treatment Given?"
                        value={payloadData.isActiveMedicalManagementLOTGiven === 'true' ? 'Yes' : 'No'}
                      />
                      {payloadData.isActiveMedicalManagementLOTGiven === 'true' && (
                        <InfoRow label="Justification" value={payloadData.medicalManagementJustification} />
                      )}
                      {payloadData.isActiveMedicalManagementLOTGiven === 'false' && (
                        <>
                          <InfoRow
                            label="Is Hospitalization only for evaluation purpose?"
                            value={payloadData.medicalManagementIsHospitalization === 'true' ? 'Yes' : 'No'}
                          />
                          {payloadData.medicalManagementIsHospitalization === 'false' && (
                            <InfoRow label="Observations" value={payloadData.medicalManagementObsevations} />
                          )}
                          {payloadData.medicalManagementIsHospitalization === 'true' && (
                            <InfoRow label="Findings" value={payloadData.medicalManagementFindings} />
                          )}
                        </>
                      )}
                    </Box>
                  )}
                  
                  {/* Surgical Management */}
                  {payloadData.lineOfTreatment === 'surgicalManagement' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                        Surgical Management
                      </Typography>
                      <InfoRow
                        label="Procedure carried Out"
                        value={payloadData.surgicalManagementProcedureCarriedOut}
                      />
                      <InfoRow
                        label="Operative Notes"
                        value={payloadData.surgicalManagementOperative}
                      />
                      {payloadData.surgicalManagementOperative === 'provided' && (
                        <InfoRow label="Findings" value={payloadData.surgicalManagementOperativeFindings} />
                      )}
                      {payloadData.surgicalManagementOperative === 'notprovided' && (
                        <InfoRow label="Reason" value={payloadData.surgicalManagementOperativeReason} />
                      )}
                      <InfoRow
                        label="Anaesthesia Notes"
                        value={payloadData.surgicalManagementAnaesthesia}
                      />
                      {payloadData.surgicalManagementAnaesthesia === 'provided' && (
                        <InfoRow label="Findings" value={payloadData.surgicalManagementAnaesthesiaFindings} />
                      )}
                      {payloadData.surgicalManagementAnaesthesia === 'notprovided' && (
                        <InfoRow label="Reason" value={payloadData.surgicalManagementAnaesthesiaReason} />
                      )}
                      <InfoRow
                        label="Any Implant Used?"
                        value={displayBoolean(payloadData.surgicalManagementAnyImplantUsed)}
                      />
                      {payloadData.surgicalManagementAnyImplantUsed && (
                        <>
                          <InfoRow
                            label="Invoice verified"
                            value={payloadData.surgicalManagementInvoiceVerified}
                          />
                          {payloadData.surgicalManagementInvoiceVerified === 'genuine' && (
                            <>
                              <InfoRow
                                label="Invoice / Sticker Number"
                                value={payloadData.surgicalManagementInvoiceVerifiedStickerNumber}
                              />
                              <InfoRow
                                label="Manufacturer"
                                value={payloadData.surgicalManagementInvoiceVerifiedManufacturer}
                              />
                            </>
                          )}
                          {(payloadData.surgicalManagementInvoiceVerified === 'discrepency' ||
                            payloadData.surgicalManagementInvoiceVerified === 'notVerified') && (
                            <>
                              <InfoRow
                                label="Invoice / Sticker Number"
                                value={payloadData.surgicalManagementInvoiceVerifiedStickerNumber}
                              />
                              <InfoRow
                                label="Manufacturer"
                                value={payloadData.surgicalManagementInvoiceVerifiedFinding}
                              />
                            </>
                          )}
                        </>
                      )}
                    </Box>
                  )}
                  
                  {/* RTA Accidental Case - Preview in Part 4, Full details in Part 6 */}
                  {payloadData.lineOfTreatment === 'rtaAccidentalCase' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        RTA Accidental details shown below in regular visit section
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* COLUMN 3: Past Records & Additional Details (shown when not referred) */}
          {!payloadData.patientReferredAnotherCenter && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 6 }}>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                    Past Records & Verification
                  </Typography>
                  
                  <InfoRow
                    label="Past Records checked with MRD"
                    value={payloadData.pastRecordsCheckedMRD === 'true' ? 'Yes' : 'No'}
                  />
                  <InfoRow
                    label="Past Treatment / Hospitalization Noted"
                    value={displayBoolean(payloadData.pastRecordsCheckedMRDPastTreatment)}
                  />
                  {payloadData.pastRecordsCheckedMRDPastTreatment && (
                    <InfoRow label="Details" value={payloadData.pastRecordsCheckedMRDHospitalizationNoted} />
                  )}
                  {payloadData.pastRecordsCheckedMRDNOT && (
                    <InfoRow label="Not Required" value={payloadData.pastRecordsCheckedMRDReason} />
                  )}
                  {payloadData.pastRecordsCheckedMRDNOT === false && (
                    <InfoRow label="Not Allowed" value="Not Allowed" />
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <InfoRow label="Chemist Verified" value={displayBoolean(payloadData.chemist)} />
                  {payloadData.chemist && (
                    <InfoRow label="Observations" value={payloadData.chemistObservations} />
                  )}
                  {!payloadData.chemist && (
                    <InfoRow label="Reason" value={payloadData.chemistReason} />
                  )}
                  
                  <InfoRow label="Any Other findings" value={payloadData.anyOtherFindings} />
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <InfoRow
                    label="Statement collected"
                    value={displayBoolean(payloadData.statementCollected)}
                  />
                  {!payloadData.statementCollected && (
                    <InfoRow label="Reason" value={payloadData.statementCollectedReason} />
                  )}
                  {payloadData.statementCollected && (
                    <>
                      <InfoRow
                        label="Discrepancies found"
                        value={displayBoolean(payloadData.statementCollectedDiscrepanciesFound)}
                      />
                      {payloadData.statementCollectedDiscrepanciesFound && (
                        <InfoRow
                          label="Discrepancies Findings"
                          value={payloadData.statementCollectedDiscrepanciesFindings}
                        />
                      )}
                      <InfoRow
                        label="PED Noted"
                        value={displayBoolean(payloadData.statementCollectedPEDNoted)}
                      />
                      {payloadData.statementCollectedPEDNoted && (
                        <>
                          <InfoRow label="PED Finidings" value={payloadData.statementCollectedPEDFinidings} />
                          <InfoRow
                            label="Past documents collected"
                            value={displayBoolean(payloadData.statementCollectedPEDNotedPastDocumentsCollected)}
                          />
                          {payloadData.statementCollectedPEDNotedPastDocumentsCollected && (
                            <InfoRow
                              label="Please Specify"
                              value={payloadData.statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify}
                            />
                          )}
                          {!payloadData.statementCollectedPEDNotedPastDocumentsCollected && (
                            <InfoRow
                              label="Reason"
                              value={payloadData.statementCollectedPEDNotedPastDocumentsCollectedReason}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </Paper>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                    Lab & Additional Details
                  </Typography>
                  
                  <InfoRow label="Lab Report" value={displayBoolean(payloadData.labReportVerified)} />
                  {!payloadData.labReportVerified && (
                    <InfoRow label="Reason" value={payloadData.labReportReason} />
                  )}
                  {payloadData.labReportVerified && (
                    <InfoRow label="Observations" value={payloadData.labReportObservations} />
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <InfoRow
                    label="Copy of Discharge Card Collected"
                    value={displayBoolean(payloadData.copyOfDischargeCardCollected)}
                  />
                  <InfoRow
                    label="Copy of Final Bill Collected"
                    value={displayBoolean(payloadData.copyOfFinalBillCollected)}
                  />
                  <InfoRow label="Insured Visit" value={displayBoolean(payloadData.insuredVisit)} />
                  {!payloadData.insuredVisit && (
                    <InfoRow label="Observations" value={payloadData.insuredVisitReason} />
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <InfoRow label="Alcohol History" value={displayBoolean(payloadData.alcoholHistory)} />
                  {payloadData.alcoholHistory && (
                    <InfoRow label="Quantity" value={payloadData.alcoholHistoryQuantity} />
                  )}
                  <InfoRow label="Smoking History" value={displayBoolean(payloadData.smokingHistory)} />
                  {payloadData.smokingHistory && (
                    <InfoRow label="Quantity" value={payloadData.smokingHistoryQuantity} />
                  )}
                  <InfoRow label="Any Other Habits" value={payloadData.anyOtherHabits} />
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <InfoRow
                    label="KYC Documents"
                    value={payloadData.kcyDocument ? 'Collected' : 'Not Collected'}
                  />
                  {payloadData.kcyDocument && (
                    <InfoRow label="Any Discrepancies" value={payloadData.kcyDocumentsAnyDiscrepancies} />
                  )}
                  {!payloadData.kcyDocument && (
                    <InfoRow label="Reason" value={payloadData.kcyDocumentsReason} />
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}
        </>
      )}

      {/* ============================================ */}
      {/* PART 5: REGULAR VISIT DETAILS */}
      {/* ============================================ */}

      {/* Show for regular visits (not planned admission and not notfoundhosp) */}
      {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
        <>
          {/* Basic Room & Admission Details */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <InfoRow label="Room Category" value={payloadData.roomCategory} />
          </Paper>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <InfoRow
                  label="Room Rent/ Day"
                  value={payloadData.roomRent ? `INR. ${payloadData.roomRent} /-` : 'None'}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <InfoRow label="DOA" value={formatDate(payloadData.doa)} />
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
            <InfoRow
              label="Expected Date of Discharge"
              value={formatDate(payloadData.expectedDateOfDischarge)}
            />
          </Paper>
        </>
      )}

      {/* Diagnosis - Show for all except notfoundhosp */}
      {reasonVal !== 'notfoundhosp' && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
          <InfoRow label="Diagnosis" value={payloadData.diagnosis} />
        </Paper>
      )}

      {/* IPD Register & Collections - Regular Visit */}
      {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* Left: IPD Register */}
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  IPD Register
                </Typography>
                
                <InfoRow label="IPD register entry found" value={payloadData.iPDRegisterEntryFound} />
                <InfoRow
                  label="Discripancy Noted"
                  value={displayBoolean(payloadData.ipdRegisterDiscrepancyNoted)}
                />
                <InfoRow
                  label="Observations"
                  value={payloadData.iPDRegisterDiscrepancyObservations}
                />
              </Paper>
            </Grid>

            {/* Right: IPDs Collected */}
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  IPDs Collected
                </Typography>
                
                <InfoRow label="IPDs Collected" value={payloadData.ipdCollected} />
                <InfoRow
                  label="PED Noted"
                  value={displayBoolean(payloadData.ipdCollectedPEDNoted)}
                />
                <InfoRow label="PED Findings" value={payloadData.iPDCollectedPEDNotedFindings} />
                <InfoRow
                  label="Discripancy Noted"
                  value={displayBoolean(payloadData.ipdCollectedDiscrepancyPED)}
                />
                <InfoRow
                  label="Non-PED Observations"
                  value={payloadData.iPDCollectedDiscrepancyPEDObservations}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Treating Doctor Visit & Past Records */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* Left: Treating Doctor */}
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Treating Doctor Visit
                </Typography>
                
                <InfoRow
                  label="Treating doctor Visit"
                  value={getTreatingDoctorVisitText(payloadData.treatingDoctorVisit)}
                />
                <InfoRow
                  label="PED Noted"
                  value={displayBoolean(payloadData.treatingDoctorVisitPEDNoted)}
                />
                <InfoRow label="Findings" value={payloadData.treatingDoctorVisitPEDNotedFindings} />
                <InfoRow
                  label="Discrepancy noted other than PED"
                  value={displayBoolean(payloadData.treatingDoctorVisitDiscrepancyPED)}
                />
                <InfoRow
                  label="Observation"
                  value={payloadData.treatingDoctorVisitPEDObservations}
                />
              </Paper>
            </Grid>

            {/* Right: Past Records MRD */}
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Past Records MRD
                </Typography>
                
                <InfoRow
                  label="Past Records checked with MRD?"
                  value={payloadData.pastRecordsCheckedMRD}
                />
                <InfoRow
                  label="Past Treatment / Hospitalization Noted"
                  value={displayBoolean(payloadData.pastRecordsCheckedMRDPastTreatment)}
                />
                <InfoRow
                  label="Past Records"
                  value={payloadData.pastRecordsCheckedMRDHospitalizationNoted}
                />
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* Lab Report & Chemist - Show for all except plannedadmission */}
      {reasonVal !== 'plannedadmission' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Left: Lab Report */}
          <Grid size={{ xs: 6 }}>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Lab Report
              </Typography>
              
              <InfoRow label="Lab Report" value={displayBoolean(payloadData.labReportVerified)} />
              {!payloadData.labReportVerified && (
                <InfoRow label="Reason" value={payloadData.labReportReason} />
              )}
              {payloadData.labReportVerified && (
                <InfoRow label="Observations" value={payloadData.labReportObservations} />
              )}
            </Paper>
          </Grid>

          {/* Right: Chemist */}
          <Grid size={{ xs: 6 }}>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Chemist
              </Typography>
              
              <InfoRow label="Chemist" value={displayBoolean(payloadData.chemist)} />
              {payloadData.chemist && (
                <InfoRow label="Observations" value={payloadData.chemistObservations} />
              )}
              {!payloadData.chemist && (
                <InfoRow label="Reason" value={payloadData.chemistReason} />
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Insured Visit & Hospital Feedback - Regular visits only */}
      {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Left: Insured Visit Details */}
          <Grid size={{ xs: 6 }}>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                INSURED VISIT
              </Typography>
              
              <InfoRow
                label="KYC Documents"
                value={payloadData.kcyDocument ? 'Collected' : 'Not Collected'}
              />
              {payloadData.kcyDocument && (
                <InfoRow label="Any Discrepancies" value={payloadData.kcyDocumentsAnyDiscrepancies} />
              )}
              {!payloadData.kcyDocument && (
                <InfoRow label="Reason" value={payloadData.kcyDocumentsReason} />
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 1 }}>
                Insured Habits
              </Typography>
              <InfoRow label="Alcohol History" value={displayBoolean(payloadData.alcoholHistory)} />
              <InfoRow label="Alcohol Quantity" value={payloadData.alcoholHistoryQuantity} />
              <InfoRow label="Smoking History" value={displayBoolean(payloadData.smokingHistory)} />
              <InfoRow label="Smoking Quantity" value={payloadData.smokingHistoryQuantity} />
              <InfoRow label="Any other habits" value={payloadData.anyOtherHabits} />
            </Paper>
          </Grid>

          {/* Right: Hospital Feedback */}
          <Grid size={{ xs: 6 }}>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Hospital Rating
              </Typography>
              
              <InfoRow label="Hospital Feedback" value={payloadData.hospitalFeedBack} />
              <InfoRow label="Hospital Remarks" value={payloadData.hospitalRemarks} />
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ============================================ */}
      {/* PART 6: LINE OF TREATMENT (REGULAR VISITS) */}
      {/* ============================================ */}

      {/* Line of Treatment & Statement Collection - Regular visits only */}
      {reasonVal !== 'plannedadmission' && reasonVal !== 'notfoundhosp' && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* LEFT: Line of Treatment */}
          <Grid size={{ xs: 6 }}>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Line of Treatment
              </Typography>
              
              <InfoRow
                label="Line of Treatment"
                value={getLineOfTreatmentText(payloadData.lineOfTreatment)}
              />

              {/* MEDICAL MANAGEMENT */}
              {payloadData.lineOfTreatment === 'medicalmanagement' && (
                <Box sx={{ mt: 2 }}>
                  <InfoRow
                    label="Is active line of Treatment Given?"
                    value={payloadData.isActiveMedicalManagementLOTGiven}
                  />
                  <InfoRow
                    label="Is Hospitalization only for evaluation purpose?"
                    value={payloadData.medicalManagementIsHospitalization}
                  />
                  <InfoRow
                    label="Justifications"
                    value={payloadData.medicalManagementJustification}
                  />
                  <InfoRow label="Findings" value={payloadData.medicalManagementFindings} />
                  <InfoRow
                    label="Observations"
                    value={payloadData.medicalManagementObsevations}
                  />
                </Box>
              )}

              {/* SURGICAL MANAGEMENT */}
              {payloadData.lineOfTreatment === 'surgicalmanagement' && (
                <Box sx={{ mt: 2 }}>
                  <InfoRow
                    label="Procedure carried Out"
                    value={payloadData.surgicalManagementProcedureCarriedOut}
                  />
                  <InfoRow
                    label="Operative Notes"
                    value={payloadData.surgicalManagementOperative}
                  />
                  <InfoRow
                    label="Operative Findings"
                    value={payloadData.surgicalManagementOperativeFindings}
                  />
                  <InfoRow
                    label="Operative Reason"
                    value={payloadData.surgicalManagementOperativeReason}
                  />
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <InfoRow
                    label="Anaesthesia Notes"
                    value={payloadData.surgicalManagementAnaesthesia}
                  />
                  <InfoRow
                    label="Anaesthesia Reason"
                    value={payloadData.surgicalManagementAnaesthesiaReason}
                  />
                  <InfoRow
                    label="Anaesthesia Findings"
                    value={payloadData.surgicalManagementAnaesthesiaFindings}
                  />
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <InfoRow
                    label="Any Implant Used"
                    value={displayBoolean(payloadData.surgicalManagementAnyImplantUsed)}
                  />
                  <InfoRow
                    label="Invoice verified"
                    value={payloadData.surgicalManagementInvoiceVerified}
                  />
                  <InfoRow
                    label="Invoice verified Findings"
                    value={payloadData.surgicalManagementInvoiceVerifiedFinding}
                  />
                  <InfoRow
                    label="Sticker Number"
                    value={payloadData.surgicalManagementInvoiceVerifiedStickerNumber}
                  />
                  <InfoRow
                    label="Manufacturer"
                    value={payloadData.surgicalManagementInvoiceVerifiedManufacturer}
                  />
                </Box>
              )}

              {/* RTA ACCIDENTAL */}
              {payloadData.lineOfTreatment === 'rtaaccidental' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 1 }}>
                    RTA - FIR Details
                  </Typography>
                  
                  <InfoRow
                    label="FIR Copy received"
                    value={displayBoolean(payloadData.rtaFIRCopyReceived)}
                  />
                  <InfoRow label="FIR Date" value={formatDate(payloadData.rtaDateOfFIR)} />
                  <InfoRow label="FIR Observations" value={payloadData.rtaFIRObservations} />
                  <InfoRow label="FIR Reason" value={payloadData.rtaFIRReason} />
                  <InfoRow label="FIR Verification" value={payloadData.rtaFIRVerification} />
                  <InfoRow
                    label="FIR Verification Finding"
                    value={payloadData.rtaFIRVerificationFinding}
                  />
                  <InfoRow
                    label="FIR Verification Reason"
                    value={payloadData.rtaFIRVerificationReason}
                  />
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 1 }}>
                    RTA - MLC Details
                  </Typography>
                  
                  <InfoRow
                    label="MLC Copy received"
                    value={displayBoolean(payloadData.rtaMLCCopyreceived)}
                  />
                  <InfoRow label="MLC Observation" value={payloadData.rtaMLCObservations} />
                  <InfoRow label="MLC Reason" value={payloadData.rtaMLCReason} />
                  <InfoRow label="MLC Verification" value={payloadData.rtaMLCVerification} />
                  <InfoRow
                    label="MLC Findings"
                    value={payloadData.rtaMLCVerificationFinding}
                  />
                  <InfoRow
                    label="MLC Verification Reason"
                    value={payloadData.rtaMLCVerificationReason}
                  />
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <InfoRow
                    label="Alcohol / drug intoxication Noted"
                    value={displayBoolean(payloadData.rtaAlcoholIntoxicationNoted)}
                  />
                  <InfoRow label="Alcohol Findings" value={payloadData.rtaAlcoholFindings} />
                </Box>
              )}
            </Paper>
          </Grid>

          {/* RIGHT: Statement Collection */}
          <Grid size={{ xs: 6 }}>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Statement Collection
              </Typography>
              
              <InfoRow
                label="Statement collected"
                value={displayBoolean(payloadData.statementCollected)}
              />
              <InfoRow
                label="Discrepancies found"
                value={displayBoolean(payloadData.statementCollectedDiscrepanciesFound)}
              />
              <InfoRow
                label="Discrepancies Findings"
                value={payloadData.statementCollectedDiscrepanciesFindings}
              />
              <InfoRow
                label="PED found"
                value={displayBoolean(payloadData.statementCollectedPEDNoted)}
              />
              <InfoRow label="PED Findings" value={payloadData.statementCollectedPEDFinidings} />
              <InfoRow
                label="Past Document collected"
                value={displayBoolean(payloadData.statementCollectedPEDNotedPastDocumentsCollected)}
              />
              <InfoRow
                label="Please Specify"
                value={payloadData.statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify}
              />
              <InfoRow
                label="Past Document not collected Reason"
                value={payloadData.statementCollectedPEDNotedPastDocumentsCollectedReason}
              />

              {/* RTA Line of Treatment (nested within RTA Accidental) */}
              {payloadData.lineOfTreatment === 'rtaaccidental' && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    RTA Line of Treatment
                  </Typography>
                  
                  <InfoRow
                    label="RTA Line of Treatment"
                    value={getLineOfTreatmentText(payloadData.rtaLineOfTreatment)}
                  />

                  {/* RTA - Medical Management */}
                  {payloadData.rtaLineOfTreatment === 'medicalmanagement' && (
                    <Box sx={{ mt: 1, pl: 2 }}>
                      <InfoRow
                        label="Is active line of Treatment Given"
                        value={payloadData.rtaMedicalIsActive}
                      />
                      <InfoRow
                        label="Is Hospitalization only for evaluation purpose"
                        value={payloadData.rtaMedicalIsHospitalization}
                      />
                      <InfoRow label="Findings" value={payloadData.rtaMedicalFindings} />
                      <InfoRow label="Observations" value={payloadData.rtaMedicalObsevations} />
                      <InfoRow
                        label="Justifications"
                        value={payloadData.rtaMedicalJustification}
                      />
                    </Box>
                  )}

                  {/* RTA - Surgical Management */}
                  {payloadData.rtaLineOfTreatment === 'surgicalmanagement' && (
                    <Box sx={{ mt: 1, pl: 2 }}>
                      <InfoRow
                        label="Procedure carried Out"
                        value={payloadData.rtaSurgicalProcedureCarriedOut}
                      />
                      <InfoRow
                        label="Operative Notes"
                        value={payloadData.rtaSurgicalOperative}
                      />
                      <InfoRow
                        label="Operative Findings"
                        value={payloadData.rtaSurgicalOperativeFindings}
                      />
                      <InfoRow
                        label="Operative Reason"
                        value={payloadData.rtaSurgicalOperativeReason}
                      />
                      <InfoRow
                        label="Anaesthesia Notes"
                        value={payloadData.rtaSurgicalAnaesthesia}
                      />
                      <InfoRow
                        label="Anaesthesia Reason"
                        value={payloadData.rtaSurgicalAnaesthesiaReason}
                      />
                      <InfoRow
                        label="Anaesthesia Findings"
                        value={payloadData.rtaSurgicalAnaesthesiaFindings}
                      />
                      <InfoRow
                        label="Any Implant Used"
                        value={displayBoolean(payloadData.rtaSurgicalAnyImplantUsed)}
                      />
                      <InfoRow
                        label="Invoice verified"
                        value={payloadData.rtaSurgicalInvoiceVerified}
                      />
                      <InfoRow
                        label="Findings"
                        value={payloadData.surgicalManagementInvoiceVerifiedFinding}
                      />
                      <InfoRow
                        label="Sticker Number"
                        value={payloadData.surgicalManagementInvoiceVerifiedStickerNumber}
                      />
                      <InfoRow
                        label="Manufacturer"
                        value={payloadData.surgicalManagementInvoiceVerifiedManufacturer}
                      />
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ============================================ */}
      {/* PART 7: OTHER FINDINGS & FRAUD TAGGING PREVIEW */}
      {/* ============================================ */}

      {/* Any Other Observations / Findings & Fraud Tagging Preview */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6 }}>
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <InfoRow
              label="Any Other Observations / Findings"
              value={payloadData.anyOtherObservationsFindings}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <InfoRow
              label="Is chemist to be tagged as Fraud"
              value={
                payloadData.chemistFraud !== null
                  ? displayBoolean(payloadData.chemistFraud)
                  : 'None'
              }
            />
            {payloadData.chemistFraud === false && (
              <InfoRow label="Chemist Details" value={payloadData.chemistDetails} />
            )}
            
            <Divider sx={{ my: 1 }} />
            
            <InfoRow
              label="Is Lab to be tagged as Fraud"
              value={
                payloadData.labFraud !== null
                  ? displayBoolean(payloadData.labFraud)
                  : 'None'
              }
            />
            {payloadData.labFraud === false && (
              <InfoRow label="Lab Details" value={payloadData.labDetails} />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ============================================ */}
      {/* PART 8: FRAUD DETAILS + DOCTOR TABLE + SUBMIT */}
      {/* ============================================ */}

      {/* Chemist & Lab Fraud Details (Full Information) */}
      {(payloadData.chemistFraud || payloadData.labFraud) && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Chemist Fraud Details */}
          {payloadData.chemistFraud && (
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'error.main' }}>
                  Chemist Fraud Details
                </Typography>
                
                <InfoRow label="Chemist Name" value={payloadData.chemistName} />
                <InfoRow label="Address" value={payloadData.chemistAddress} />
                <InfoRow label="State" value={payloadData.chemistStateName} />
                <InfoRow label="City" value={payloadData.chemistCityName} />
                <InfoRow label="Pin" value={payloadData.chemistPinCode} />
                <InfoRow label="License" value={payloadData.chemistLicenceNumber} />
                <InfoRow label="GST" value={payloadData.chemistGSTNo} />
              </Paper>
            </Grid>
          )}

          {/* Lab Fraud Details */}
          {payloadData.labFraud && (
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'error.main' }}>
                  Lab Fraud Details
                </Typography>
                
                <InfoRow label="Lab Name" value={payloadData.labName} />
                <InfoRow label="Address" value={payloadData.labAddress} />
                <InfoRow label="State" value={payloadData.labStateName} />
                <InfoRow label="City" value={payloadData.labCityName} />
                <InfoRow label="Pin" value={payloadData.labPinCode} />
                <InfoRow label="License" value={payloadData.labLicenceNumber} />
                <InfoRow label="GST" value={payloadData.labGSTNo} />
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 1 }}>
                  Pathologist Details
                </Typography>
                
                <InfoRow
                  label="Is Pathologist Attached?"
                  value={
                    payloadData.pathologist !== null
                      ? displayBoolean(payloadData.pathologist)
                      : 'None'
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
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* Doctor Table */}
      {doctorTable && doctorTable.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Treating Doctor Details
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Treating doctor Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact No.</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Registration Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Qualification</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Stream</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    To be tagged as Fraud / Caution?
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctorTable.map((doctor, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <span>{doctor.firstName}</span>
                        <span>{doctor.middleName}</span>
                        <span>{doctor.lastName}</span>
                      </Box>
                    </TableCell>
                    <TableCell>{doctor.contactNo}</TableCell>
                    <TableCell>{doctor.regNo}</TableCell>
                    <TableCell>{doctor.qualification}</TableCell>
                    <TableCell>{doctor.stream}</TableCell>
                    <TableCell>
                      {doctor.fraud ? (
                        <Typography color="error.main" fontWeight={600}>
                          Yes
                        </Typography>
                      ) : (
                        <Typography color="success.main">No</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Submit Button */}
      {!buttonVisible && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={saveSubmit}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
            }}
          >
            Save and Submit to QC
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Preview;
