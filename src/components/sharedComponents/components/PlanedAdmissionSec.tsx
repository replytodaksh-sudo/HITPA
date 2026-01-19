import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {
    Grid,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Select,
    MenuItem,
    Button,
    Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import alertService from '../../../services/alertService';
import caseUpdateService from '../../../services/caseupdate.service';

// ===========================
// INTERFACES
// ===========================
interface PlanedAdmissionSecProps {
    previuosData?: any;
    reasonVal: any;
    isFormEditable: boolean;
    isPresent: boolean;
    onNextPage: (tabIndex: number) => void;
}

interface CaseUpdateModel {
    boolStatusOfInsured: boolean;
    hospitalVisitDone?: boolean;
    expectedDateOfAdmission?: any;
    diagnosis?: string;
    treatmentPlanned?: string;
    estimatedBill?: number;
    mrdcheck?: boolean;
    hospitalVisitDoneHOAnyPreviousHospitalization?: string;
    hospitalVisitDoneReason?: string;
    treatingDoctorVisit?: string;
    treatingDoctorVisitAnyOtherObservations?: string;
    treatingDoctorVisitPEDNoted?: boolean;
    treatingDoctorVisitPEDNotedFindings?: string;
    treatingDoctorVisitDiscrepancyPED?: boolean;
    treatingDoctorVisitPEDObservations?: string;
    treatingDoctorVisitReason?: string;
    insuredVisitDone?: boolean;
    insuredVisitDoneIsPatientAdmitted?: string;
    insuredVisitDoneExpectedDateOfAdmission?: any;
    insuredVisitDoneTreatmentPlanned?: string;
    insuredVisitDoneAilment?: string;
    insuredVisitDonePresentingDuration?: string;
    insuredVisitDoneEstimatedBill?: string;
    insuredVisitDoneHOAnyPreviousHospitalization?: string;
    kcyDocument?: boolean;
    kcyDocumentsReason?: string;
    insuredVisitDoneWithdrawalCollected?: string;
    insuredVisitDoneObservations?: string;
    reason: string;
}


// ===========================
// MAIN COMPONENT
// ===========================
const PlanedAdmissionSec: React.FC<PlanedAdmissionSecProps> = ({
    previuosData = '',
    reasonVal,
    isFormEditable,
    isPresent,
    onNextPage
}) => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const [loading, setLoading] = useState(false);

    // ===========================
    // STATE - LEFT COLUMN (Hospital Visit)
    // ===========================
    const [hospitalVisitValue, setHospitalVisitValue] = useState('');
    const [expectedDateOfAdmission, setExpectedDateOfAdmission] = useState<any>(null);
    const [diagnosis, setDiagnosis] = useState('');
    const [treatmentPlanned, setTreatmentPlanned] = useState('');
    const [estimatedBill, setEstimatedBill] = useState(0);
    const [mrdCheckRadio, setMrdCheckRadio] = useState('');
    const [hospitalVisitDoneHOAnyPreviousHospitalization, setHospitalVisitDoneHOAnyPreviousHospitalization] = useState('');
    const [hospitalVisitDoneReason, setHospitalVisitDoneReason] = useState('');

    // Treating Doctor
    const [treatingDoctorVisitValue, setTreatingDoctorVisitValue] = useState('');
    const [treatingDoctorVisitReason, setTreatingDoctorVisitReason] = useState('');
    const [treatingDoctorVisitPEDNoted, setTreatingDoctorVisitPEDNoted] = useState('');
    const [treatingDoctorVisitPEDNotedFindings, setTreatingDoctorVisitPEDNotedFindings] = useState('');
    const [treatingDoctorVisitDiscrepancyPED, setTreatingDoctorVisitDiscrepancyPED] = useState('');
    const [treatingDoctorVisitPEDObservations, setTreatingDoctorVisitPEDObservations] = useState('');
    const [treatingDoctorVisitAnyOtherObservations, setTreatingDoctorVisitAnyOtherObservations] = useState('');

    // ===========================
    // STATE - RIGHT COLUMN (Insured Visit)
    // ===========================
    const [insuredVisitValue, setInsuredVisitValue] = useState('');
    const [insuredVisitDoneIsPatientAdmitted, setInsuredVisitDoneIsPatientAdmitted] = useState('');
    const [insuredVisitDoneExpectedDateOfAdmission, setInsuredVisitDoneExpectedDateOfAdmission] = useState<any>(null);
    const [insuredVisitDoneTreatmentPlanned, setInsuredVisitDoneTreatmentPlanned] = useState('');
    const [insuredVisitDoneAilment, setInsuredVisitDoneAilment] = useState('');
    const [insuredVisitDonePresentingDuration, setInsuredVisitDonePresentingDuration] = useState('');
    const [insuredVisitDoneEstimatedBill, setInsuredVisitDoneEstimatedBill] = useState('');
    const [insuredVisitDoneHOAnyPreviousHospitalization, setInsuredVisitDoneHOAnyPreviousHospitalization] = useState('');
    const [kcyDocument, setKcyDocument] = useState('');
    const [kcyDocumentsReason, setKcyDocumentsReason] = useState('');
    const [insuredVisitDoneWithdrawalCollected, setInsuredVisitDoneWithdrawalCollected] = useState('');
    const [insuredVisitDoneObservations, setInsuredVisitDoneObservations] = useState('');

    // ===========================
    // LOAD PREVIOUS DATA
    // ===========================
    useEffect(() => {
        if (!previuosData) return;

        if (previuosData.expectedDateOfAdmission) {
            setExpectedDateOfAdmission(moment(previuosData.expectedDateOfAdmission));
        }

        if (previuosData.hospitalVisitDone === true) {
            setHospitalVisitValue('1');
        } else if (previuosData.hospitalVisitDone === false) {
            setHospitalVisitValue('0');
        }

        setDiagnosis(previuosData.diagnosis || '');
        setTreatmentPlanned(previuosData.treatmentPlanned || '');
        setEstimatedBill(previuosData.estimatedBill || 0);

        if (previuosData.mrdcheck === true) {
            setMrdCheckRadio('1');
            setHospitalVisitDoneHOAnyPreviousHospitalization(
                previuosData.hospitalVisitDoneHOAnyPreviousHospitalization || ''
            );
        } else if (previuosData.mrdcheck === false) {
            setMrdCheckRadio('0');
        }

        setHospitalVisitDoneReason(previuosData.hospitalVisitDoneReason || '');
        setTreatingDoctorVisitValue(previuosData.treatingDoctorVisit || '');

        if (previuosData.treatingDoctorVisit === 'statementcollected') {
            setTreatingDoctorVisitAnyOtherObservations(
                previuosData.treatingDoctorVisitAnyOtherObservations || ''
            );

            if (previuosData.treatingDoctorVisitPEDNoted === true) {
                setTreatingDoctorVisitPEDNoted('1');
                setTreatingDoctorVisitPEDNotedFindings(
                    previuosData.treatingDoctorVisitPEDNotedFindings || ''
                );

                if (previuosData.treatingDoctorVisitDiscrepancyPED === true) {
                    setTreatingDoctorVisitDiscrepancyPED('1');
                    setTreatingDoctorVisitPEDObservations(
                        previuosData.treatingDoctorVisitPEDObservations || ''
                    );
                } else if (previuosData.treatingDoctorVisitDiscrepancyPED === false) {
                    setTreatingDoctorVisitDiscrepancyPED('0');
                }
            } else if (previuosData.treatingDoctorVisitPEDNoted === false) {
                setTreatingDoctorVisitPEDNoted('0');
            }
        }

        if (previuosData.treatingDoctorVisit === 'statementnotcollected') {
            setTreatingDoctorVisitReason(previuosData.treatingDoctorVisitReason || '');
        }

        if (previuosData.insuredVisitDone === true) {
            setInsuredVisitValue('1');
            setInsuredVisitDoneIsPatientAdmitted(previuosData.insuredVisitDoneIsPatientAdmitted || '');

            if (previuosData.insuredVisitDoneExpectedDateOfAdmission) {
                setInsuredVisitDoneExpectedDateOfAdmission(
                    moment(previuosData.insuredVisitDoneExpectedDateOfAdmission)
                );
            }

            setInsuredVisitDoneTreatmentPlanned(previuosData.insuredVisitDoneTreatmentPlanned || '');
            setInsuredVisitDoneAilment(previuosData.insuredVisitDoneAilment || '');
            setInsuredVisitDonePresentingDuration(previuosData.insuredVisitDonePresentingDuration || '');
            setInsuredVisitDoneEstimatedBill(previuosData.insuredVisitDoneEstimatedBill || '');
            setInsuredVisitDoneHOAnyPreviousHospitalization(
                previuosData.insuredVisitDoneHOAnyPreviousHospitalization || ''
            );
            setInsuredVisitDoneWithdrawalCollected(previuosData.insuredVisitDoneWithdrawalCollected || '');
            setInsuredVisitDoneObservations(previuosData.insuredVisitDoneObservations || '');

            if (previuosData.kcyDocument === true) {
                setKcyDocument('yes');
            } else if (previuosData.kcyDocument === false) {
                setKcyDocument('no');
            }

            setKcyDocumentsReason(previuosData.kcyDocumentsReason || '');
        } else if (previuosData.insuredVisitDone === false) {
            setInsuredVisitValue('0');
        }
    }, [previuosData]);

    // ===========================
    // SUBMIT HANDLER
    // ===========================
    const handleSubmit = async () => {
        setLoading(true);

        const caseUpdateModel: CaseUpdateModel = {
            boolStatusOfInsured: isPresent,
            reason: reasonVal
        };

        if (hospitalVisitValue === '1') {
            caseUpdateModel.hospitalVisitDone = true;
            caseUpdateModel.expectedDateOfAdmission = expectedDateOfAdmission;
            caseUpdateModel.diagnosis = diagnosis;
            caseUpdateModel.treatmentPlanned = treatmentPlanned;
            caseUpdateModel.estimatedBill = estimatedBill;

            if (mrdCheckRadio === '1') {
                caseUpdateModel.mrdcheck = true;
                caseUpdateModel.hospitalVisitDoneHOAnyPreviousHospitalization =
                    hospitalVisitDoneHOAnyPreviousHospitalization;
            } else if (mrdCheckRadio === '0') {
                caseUpdateModel.mrdcheck = false;
            }
        } else if (hospitalVisitValue === '0') {
            caseUpdateModel.hospitalVisitDone = false;
            caseUpdateModel.hospitalVisitDoneReason = hospitalVisitDoneReason;
        }

        caseUpdateModel.treatingDoctorVisit = treatingDoctorVisitValue;

        if (treatingDoctorVisitValue === 'statementcollected') {
            caseUpdateModel.treatingDoctorVisitAnyOtherObservations =
                treatingDoctorVisitAnyOtherObservations;

            if (treatingDoctorVisitPEDNoted === '1') {
                caseUpdateModel.treatingDoctorVisitPEDNoted = true;
                caseUpdateModel.treatingDoctorVisitPEDNotedFindings =
                    treatingDoctorVisitPEDNotedFindings;

                if (treatingDoctorVisitDiscrepancyPED === '1') {
                    caseUpdateModel.treatingDoctorVisitDiscrepancyPED = true;
                    caseUpdateModel.treatingDoctorVisitPEDObservations =
                        treatingDoctorVisitPEDObservations;
                } else if (treatingDoctorVisitDiscrepancyPED === '0') {
                    caseUpdateModel.treatingDoctorVisitDiscrepancyPED = false;
                }
            } else if (treatingDoctorVisitPEDNoted === '0') {
                caseUpdateModel.treatingDoctorVisitPEDNoted = false;
            }
        } else if (treatingDoctorVisitValue === 'statementnotcollected') {
            caseUpdateModel.treatingDoctorVisitReason = treatingDoctorVisitReason;
        }

        if (insuredVisitValue === '1') {
            caseUpdateModel.insuredVisitDone = true;
            caseUpdateModel.insuredVisitDoneIsPatientAdmitted = insuredVisitDoneIsPatientAdmitted;

            if (insuredVisitDoneIsPatientAdmitted === 'yes') {
                caseUpdateModel.insuredVisitDoneExpectedDateOfAdmission =
                    insuredVisitDoneExpectedDateOfAdmission;
                caseUpdateModel.insuredVisitDoneTreatmentPlanned = insuredVisitDoneTreatmentPlanned;
                caseUpdateModel.insuredVisitDoneAilment = insuredVisitDoneAilment;
                caseUpdateModel.insuredVisitDonePresentingDuration = insuredVisitDonePresentingDuration;
                caseUpdateModel.insuredVisitDoneEstimatedBill = insuredVisitDoneEstimatedBill;
                caseUpdateModel.insuredVisitDoneHOAnyPreviousHospitalization =
                    insuredVisitDoneHOAnyPreviousHospitalization;

                if (kcyDocument === 'yes') {
                    caseUpdateModel.kcyDocument = true;
                } else if (kcyDocument === 'no') {
                    caseUpdateModel.kcyDocument = false;
                    caseUpdateModel.kcyDocumentsReason = kcyDocumentsReason;
                }
            } else if (insuredVisitDoneIsPatientAdmitted === 'no') {
                caseUpdateModel.insuredVisitDoneWithdrawalCollected =
                    insuredVisitDoneWithdrawalCollected;
                caseUpdateModel.insuredVisitDoneObservations = insuredVisitDoneObservations;
            }
        } else if (insuredVisitValue === '0') {
            caseUpdateModel.insuredVisitDone = false;
        }

        try {
            const data = await caseUpdateService.addCaseUpdate(
                caseUpdateModel,
                investigationId!
            );

            if (data.payload && data.payload.activeCaseID) {
                localStorage.setItem('activeCaseID', data.payload.activeCaseID);
            }

            alertService.showAlertSuccess('Primary data submitted successfully');
            onNextPage(1);
        } catch (error) {
            console.error('Error saving case update:', error);
            alert('Failed to save case update');
        } finally {
            setLoading(false);
        }
    };

    // ===========================
    // RENDER
    // ===========================
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Grid container spacing={3}>
                {/* LEFT COLUMN */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormLabel>Hospital Visit Done</FormLabel>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <RadioGroup
                                row
                                value={hospitalVisitValue}
                                onChange={(e) => setHospitalVisitValue(e.target.value)}
                            >
                                <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                <FormControlLabel value="0" control={<Radio />} label="No" />
                            </RadioGroup>
                        </Grid>
                    </Grid>

                    {hospitalVisitValue === '1' && (
                        <>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Expected Date of Admission</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <DatePicker
                                        value={expectedDateOfAdmission}
                                        onChange={(newValue: any) => setExpectedDateOfAdmission(newValue)}
                                        disabled={!isFormEditable}
                                        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Diagnosis</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField
                                        multiline
                                        rows={3}
                                        fullWidth
                                        value={diagnosis}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Treatment Planned</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <Select
                                        fullWidth
                                        value={treatmentPlanned}
                                        onChange={(e) => setTreatmentPlanned(e.target.value)}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="medical">Medical</MenuItem>
                                        <MenuItem value="surgical">Surgical</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Estimated Bill</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField
                                        type="number"
                                        fullWidth
                                        placeholder="Estimated Bill"
                                        value={estimatedBill}
                                        onChange={(e) => setEstimatedBill(Number(e.target.value))}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>MRD Check</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <RadioGroup
                                        row
                                        value={mrdCheckRadio}
                                        onChange={(e) => setMrdCheckRadio(e.target.value)}
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="0" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>

                            {mrdCheckRadio === '1' && (
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <FormLabel>H/O any previous hospitalization</FormLabel>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <TextField
                                            multiline
                                            rows={3}
                                            fullWidth
                                            value={hospitalVisitDoneHOAnyPreviousHospitalization}
                                            onChange={(e) =>
                                                setHospitalVisitDoneHOAnyPreviousHospitalization(e.target.value)
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </>
                    )}

                    {hospitalVisitValue === '0' && (
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Reason</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    multiline
                                    rows={3}
                                    fullWidth
                                    value={hospitalVisitDoneReason}
                                    onChange={(e) => setHospitalVisitDoneReason(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    )}

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormLabel>Treating doctor Visit</FormLabel>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Select
                                fullWidth
                                value={treatingDoctorVisitValue}
                                onChange={(e) => setTreatingDoctorVisitValue(e.target.value)}
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="statementcollected">Statement Collected</MenuItem>
                                <MenuItem value="statementnotcollected">Statement not Collected</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>

                    {treatingDoctorVisitValue === 'statementnotcollected' && (
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Reason</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    multiline
                                    rows={3}
                                    fullWidth
                                    value={treatingDoctorVisitReason}
                                    onChange={(e) => setTreatingDoctorVisitReason(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {treatingDoctorVisitValue === 'statementcollected' && (
                        <>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>PED Noted</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <RadioGroup
                                        row
                                        value={treatingDoctorVisitPEDNoted}
                                        onChange={(e) => setTreatingDoctorVisitPEDNoted(e.target.value)}
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="0" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>

                            {treatingDoctorVisitPEDNoted === '1' && (
                                <>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <FormLabel>Findings</FormLabel>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <TextField
                                                multiline
                                                rows={3}
                                                fullWidth
                                                value={treatingDoctorVisitPEDNotedFindings}
                                                onChange={(e) =>
                                                    setTreatingDoctorVisitPEDNotedFindings(e.target.value)
                                                }
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <FormLabel>Discrepancy noted other than PED</FormLabel>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <RadioGroup
                                                row
                                                value={treatingDoctorVisitDiscrepancyPED}
                                                onChange={(e) => setTreatingDoctorVisitDiscrepancyPED(e.target.value)}
                                            >
                                                <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="0" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </Grid>
                                    </Grid>

                                    {treatingDoctorVisitDiscrepancyPED === '1' && (
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <FormLabel>Observations</FormLabel>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 8 }}>
                                                <TextField
                                                    multiline
                                                    rows={3}
                                                    fullWidth
                                                    value={treatingDoctorVisitPEDObservations}
                                                    onChange={(e) =>
                                                        setTreatingDoctorVisitPEDObservations(e.target.value)
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    )}
                                </>
                            )}

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Any other observations</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField
                                        multiline
                                        rows={3}
                                        fullWidth
                                        value={treatingDoctorVisitAnyOtherObservations}
                                        onChange={(e) =>
                                            setTreatingDoctorVisitAnyOtherObservations(e.target.value)
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Grid>

                {/* RIGHT COLUMN */}
                <Grid size={{ xs: 12, md: 6 }}>
                    {/* Insured Visit Done */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormLabel>Insured Visit Done</FormLabel>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <RadioGroup
                                row
                                value={insuredVisitValue}
                                onChange={(e) => setInsuredVisitValue(e.target.value)}
                            >
                                <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                <FormControlLabel value="0" control={<Radio />} label="No" />
                            </RadioGroup>
                        </Grid>
                    </Grid>

                    {/* Insured Visit = Yes */}
                    {insuredVisitValue === '1' && (
                        <>
                            {/* Is patient willing to get admitted? */}
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Is patient willing to get admitted?</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <Select
                                        fullWidth
                                        value={insuredVisitDoneIsPatientAdmitted}
                                        onChange={(e) => setInsuredVisitDoneIsPatientAdmitted(e.target.value)}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="yes">Yes</MenuItem>
                                        <MenuItem value="no">No</MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>

                            {/* Patient Admitted = Yes */}
                            {insuredVisitDoneIsPatientAdmitted === 'yes' && (
                                <>
                                    {/* Expected Date of Admission */}
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <FormLabel>Expected Date of Admission</FormLabel>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <DatePicker
                                                value={insuredVisitDoneExpectedDateOfAdmission}
                                                onChange={(newValue: any) =>
                                                    setInsuredVisitDoneExpectedDateOfAdmission(newValue)
                                                }
                                                disabled={!isFormEditable}
                                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                                            />
                                        </Grid>
                                    </Grid>

                                    {/* Treatment Planned */}
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <FormLabel>Treatment Planned</FormLabel>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <TextField
                                                fullWidth
                                                placeholder="Treatment Planned"
                                                value={insuredVisitDoneTreatmentPlanned}
                                                onChange={(e) =>
                                                    setInsuredVisitDoneTreatmentPlanned(e.target.value)
                                                }
                                            />
                                        </Grid>
                                    </Grid>

                                    {/* Ailment */}
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <FormLabel>Ailment</FormLabel>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <TextField
                                                fullWidth
                                                placeholder="Ailment"
                                                value={insuredVisitDoneAilment}
                                                onChange={(e) => setInsuredVisitDoneAilment(e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>

                                    {/* Presenting c/o duration */}
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <FormLabel>Presenting c/o duration</FormLabel>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <TextField
                                                fullWidth
                                                value={insuredVisitDonePresentingDuration}
                                                onChange={(e) =>
                                                    setInsuredVisitDonePresentingDuration(e.target.value)
                                                }
                                            />
                                        </Grid>
                                    </Grid>

                                    {/* Estimated Bill */}
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <FormLabel>Estimated Bill</FormLabel>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <TextField
                                                fullWidth
                                                value={insuredVisitDoneEstimatedBill}
                                                onChange={(e) =>
                                                    setInsuredVisitDoneEstimatedBill(e.target.value)
                                                }
                                            />
                                        </Grid>
                                    </Grid>

                                    {/* H/O any previous hospitalization */}
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <FormLabel>H/O any previous hospitalization</FormLabel>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <TextField
                                                multiline
                                                rows={3}
                                                fullWidth
                                                value={insuredVisitDoneHOAnyPreviousHospitalization}
                                                onChange={(e) =>
                                                    setInsuredVisitDoneHOAnyPreviousHospitalization(e.target.value)
                                                }
                                            />
                                        </Grid>
                                    </Grid>

                                    {/* KYC Documents collected */}
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <FormLabel>KYC Documents collected</FormLabel>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <Select
                                                fullWidth
                                                value={kcyDocument}
                                                onChange={(e) => setKcyDocument(e.target.value)}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="yes">Yes</MenuItem>
                                                <MenuItem value="no">No</MenuItem>
                                            </Select>
                                        </Grid>
                                    </Grid>

                                    {/* KYC - Reason (if No) */}
                                    {kcyDocument === 'no' && (
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <FormLabel>Reason</FormLabel>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 8 }}>
                                                <TextField
                                                    multiline
                                                    rows={3}
                                                    fullWidth
                                                    value={kcyDocumentsReason}
                                                    onChange={(e) => setKcyDocumentsReason(e.target.value)}
                                                />
                                            </Grid>
                                        </Grid>
                                    )}
                                </>
                            )}

                            {/* Patient Admitted = No */}
                            {insuredVisitDoneIsPatientAdmitted === 'no' && (
                                <>
                                    {/* Withdrawal /Confirmation collected? */}
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <FormLabel>Withdrawal /Confirmation collected?</FormLabel>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <RadioGroup
                                                row
                                                value={insuredVisitDoneWithdrawalCollected}
                                                onChange={(e) =>
                                                    setInsuredVisitDoneWithdrawalCollected(e.target.value)
                                                }
                                            >
                                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </Grid>
                                    </Grid>

                                    {/* Observations */}
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <FormLabel>Observations</FormLabel>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <TextField
                                                multiline
                                                rows={3}
                                                fullWidth
                                                value={insuredVisitDoneObservations}
                                                onChange={(e) =>
                                                    setInsuredVisitDoneObservations(e.target.value)
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        },
                    }}
                >
                    {loading ? 'Saving...' : 'Save as Draft'}
                </Button>
            </Box>
        </LocalizationProvider>
    );
};

export default PlanedAdmissionSec;