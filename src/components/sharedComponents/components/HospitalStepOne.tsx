// src/components/ReimburseCaseUpdate/HospitalStepOne.tsx
// PART 1: Component Setup + All State Variables

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { reimcaseUpdateService } from '../../../services/reim-case-update.service';

interface HospitalStepOneProps {
    buttonEnable: boolean;
    previousData: any;
    onChangeTab: (showStepTwo: boolean) => void;
}

const HospitalStepOne: React.FC<HospitalStepOneProps> = ({
    buttonEnable,
    previousData,
    onChangeTab
}) => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const disableFields = !buttonEnable;

    // ========== STATE VARIABLES ==========

    // 1. Basic Hospital Info
    const [hospitalName, setHospitalName] = useState('');
    const [hospitalExits, setHospitalExits] = useState('');
    const [hospitalExistsObservations, setHospitalExistsObservations] = useState('');

    // 2. Hospital Details (when exists = yes)
    const [regNo, setRegNo] = useState('');
    const [validity, setValidity] = useState('');
    const [ot, setOt] = useState('');
    const [hospitalOwner, setHospitalOwner] = useState('');
    const [hospitalContact, setHospitalContact] = useState('');
    const [hospitalExistFacilityAvailable, setHospitalExistFacilityAvailable] = useState<string[]>([]);

    // 3. IP Register
    const [ipregisterExits, setIpregisterExits] = useState('');
    const [discrepancyNoted, setDiscrepancyNoted] = useState('');
    const [entrySelector, setEntrySelector] = useState('');
    const [discrepancyNotedFindings, setDiscrepancyNotedFindings] = useState('');

    // 4. ICP Collection
    const [icpCollected, setIcpCollected] = useState('');
    const [icpCollectedReason, setIcpCollectedReason] = useState('');
    const [pedNoted, setPedNoted] = useState('');
    const [pedNotedFindings, setPedNotedFindings] = useState('');
    const [anyOtherDiscrepancyNoted, setAnyOtherDiscrepancyNoted] = useState('');
    const [anyOtherDiscrepancyObservations, setAnyOtherDiscrepancyObservations] = useState('');
    const [icpCollectedOtherDiscrepancyNotedFinding, setIcpCollectedOtherDiscrepancyNotedFinding] = useState('');

    // 5. Vital Chart
    const [vitalChart, setVitalChart] = useState('');
    const [vitalChartObservations, setVitalChartObservations] = useState('');
    const [vitalChartReason, setVitalChartReason] = useState('');

    // 6. MRD Records
    const [checkedMRD, setCheckedMRD] = useState('');
    const [hospitaizationNoted, setHospitaizationNoted] = useState('');
    const [hospitaizationNotedDetails, setHospitaizationNotedDetails] = useState('');
    const [pastRecordMRDCheckedNotRequired, setPastRecordMRDCheckedNotRequired] = useState('');
    const [pastRecordMRDCheckedNotRequiredReason, setPastRecordMRDCheckedNotRequiredReason] = useState('');

    // 7. Hospital Bill Verification
    const [hospitalBillVerification, setHospitalBillVerification] = useState('');
    const [hospitalBillVerificationVerified, setHospitalBillVerificationVerified] = useState('');
    const [hospitalBillVerificationVerifiedDispensaryDetails, setHospitalBillVerificationVerifiedDispensaryDetails] = useState('');
    const [hospitalBillVerificationReason, setHospitalBillVerificationReason] = useState('');

    // 8. Line of Treatment
    const [lineoftreatment, setLineoftreatment] = useState('');

    // 9. Medical Management
    const [lineoFTreatmentGiven, setLineoFTreatmentGiven] = useState('');
    const [medicalManagementJustification, setMedicalManagementJustification] = useState('');
    const [medicalManagementIsHospitalization, setMedicalManagementIsHospitalization] = useState('');
    const [medicalManagementFindings, setMedicalManagementFindings] = useState('');
    const [medicalManagementObsevations, setMedicalManagementObsevations] = useState('');
    const [qualityOfMedicine, setQualityOfMedicine] = useState('');
    const [qualityOfMedicineObservation, setQualityOfMedicineObservation] = useState('');

    // 10. Surgical Management
    const [surgicalManagementProcedureCarriedOut, setSurgicalManagementProcedureCarriedOut] = useState('');
    const [operativeNotes, setOperativeNotes] = useState('');
    const [surgicalManagementOperativeFindings, setSurgicalManagementOperativeFindings] = useState('');
    const [surgicalManagementOperativeReason, setSurgicalManagementOperativeReason] = useState('');
    const [anaesthesiaNotes, setAnaesthesiaNotes] = useState('');
    const [surgicalManagementAnaesthesiaFindings, setSurgicalManagementAnaesthesiaFindings] = useState('');
    const [surgicalManagementAnaesthesiaReason, setSurgicalManagementAnaesthesiaReason] = useState('');
    const [implantUsed, setImplantUsed] = useState('');
    const [invoiceVerified, setInvoiceVerified] = useState('');
    const [surgicalManagementInvoiceVerifiedStickerNumber, setSurgicalManagementInvoiceVerifiedStickerNumber] = useState('');
    const [surgicalManagementInvoiceVerifiedManufacturer, setSurgicalManagementInvoiceVerifiedManufacturer] = useState('');
    const [surgicalManagementInvoiceVerifiedFinding, setSurgicalManagementInvoiceVerifiedFinding] = useState('');

    // 11. Tariff & Hospital Authority
    const [tariffCardCollected, setTariffCardCollected] = useState('');
    const [hospitalTariif, setHospitalTariif] = useState('');
    const [tariffCardCollectedBillHospitalObservation, setTariffCardCollectedBillHospitalObservation] = useState('');
    const [tariffCardCollectedReason, setTariffCardCollectedReason] = useState('');
    const [hospitalAuthorityStatement, setHospitalAuthorityStatement] = useState('');
    const [hospitalAuthorityStatementFindings, setHospitalAuthorityStatementFindings] = useState('');
    const [hospitalAuthorityStatementReason, setHospitalAuthorityStatementReason] = useState('');

    // ========== CONTINUE TO PART 2 FOR POPULATE DATA ==========

    // src/components/ReimburseCaseUpdate/HospitalStepOne.tsx
    // PART 2: Populate Data Function (Add this after state variables)

    // ========== POPULATE DATA FROM previousData ==========
    useEffect(() => {
        if (previousData) {
            populateData();
        }
    }, [previousData]);

    const populateData = () => {
        if (!previousData) return;

        console.log("Populating data: ", JSON.stringify(previousData));

        // 1. Basic Hospital Info
        setHospitalName(previousData.hospitalName || '');

        // 2. Quality of Medicine
        if (previousData.qualityOfMedicine === false) {
            setQualityOfMedicine('no');
            setQualityOfMedicineObservation(previousData.qualityOfMedicineObservation || '');
        } else if (previousData.qualityOfMedicine === true) {
            setQualityOfMedicine('yes');
        }

        // 3. Hospital Exists
        if (previousData.hospitalExist === true) {
            setHospitalExits('yes');
            setRegNo(previousData.hospitalExistRegNo || '');
            setValidity(previousData.hospitalExistValidity === true ? 'yes' : 'no');
            setOt(previousData.hospitalExistOT === true ? 'yes' : 'no');
            setHospitalOwner(previousData.hospitalExistOwnerOfHospital || '');
            setHospitalContact(previousData.hospitalExistHospitalContactNo || '');

            if (previousData.hospitalExistFacilityAvailable) {
                setHospitalExistFacilityAvailable(previousData.hospitalExistFacilityAvailable.split(','));
            }
        } else if (previousData.hospitalExist === false) {
            setHospitalExits('no');
            setHospitalExistsObservations(previousData.hospitalExistsObservations || '');
        }

        // 4. IP Register
        if (previousData.ipRegisterExist === true) {
            setIpregisterExits('yes');

            if (previousData.ipRegisterExistDiscrepancyNoted === true) {
                setDiscrepancyNoted('yes');
                setEntrySelector(previousData.ipRegisterExistDiscrepancyNotedOther || '');
                setDiscrepancyNotedFindings(previousData.ipRegisterExistFinding || '');
            } else if (previousData.ipRegisterExistDiscrepancyNoted === false) {
                setDiscrepancyNoted('no');
            }
        } else if (previousData.ipRegisterExist === false) {
            setIpregisterExits('no');
        }

        // 5. ICP Collection
        if (previousData.icpCollected === true) {
            setIcpCollected('yes');

            if (previousData.icpCollectedPEDNoted === true) {
                setPedNoted('yes');
                setPedNotedFindings(previousData.icpCollectedPEDNotedFinding || '');
            } else if (previousData.icpCollectedPEDNoted === false) {
                setPedNoted('no');
            }

            if (previousData.icpCollectedOtherDiscrepancyNoted === true) {
                setAnyOtherDiscrepancyNoted('yes');
                setAnyOtherDiscrepancyObservations(previousData.icpCollectedOtherDiscrepancyNotedObservations || '');
            } else if (previousData.icpCollectedOtherDiscrepancyNoted === false) {
                setAnyOtherDiscrepancyNoted('no');
            }
        } else if (previousData.icpCollected === false) {
            setIcpCollected('no');
            setIcpCollectedReason(previousData.icpCollectedReason || '');
        }

        // 6. Vital Chart (TBR/BP)
        if (previousData.tbrBp === true) {
            setVitalChart('yes');
            setVitalChartObservations(previousData.tbrBpObservations || '');
        } else if (previousData.tbrBp === false) {
            setVitalChart('no');
            setVitalChartReason(previousData.tbrBpReason || '');
        }

        // 7. Past Records MRD
        if (previousData.pastRecordMRDChecked === true) {
            setCheckedMRD('yes');

            if (previousData.pastRecordMRDCheckedTreatment === true) {
                setHospitaizationNoted('yes');
                setHospitaizationNotedDetails(previousData.pastRecordMRDCheckedTreatmentDetails || '');
            }
        } else if (previousData.pastRecordMRDChecked === false) {
            setCheckedMRD('no');

            if (previousData.pastRecordMRDCheckedNotRequired === true) {
                setPastRecordMRDCheckedNotRequired('yes');
                setPastRecordMRDCheckedNotRequiredReason(previousData.pastRecordMRDCheckedNotRequiredReason || '');
            } else if (previousData.pastRecordMRDCheckedNotRequired === false) {
                setPastRecordMRDCheckedNotRequired('no');
            }
        }

        // 8. Hospital Bill Verification
        if (previousData.hospitalBillVerification === true) {
            setHospitalBillVerification('yes');

            if (previousData.hospitalBillVerificationVerified === true) {
                setHospitalBillVerificationVerified('yes');
            } else if (previousData.hospitalBillVerificationVerified === false) {
                setHospitalBillVerificationVerified('no');
            }
        } else if (previousData.hospitalBillVerification === false) {
            setHospitalBillVerification('no');
            setHospitalBillVerificationReason(previousData.hospitalBillVerificationReason || '');
        }

        // 9. Tariff Card
        if (previousData.tariffCardCollected === true) {
            setTariffCardCollected('yes');
            setHospitalTariif(previousData.tariffCardCollectedBillHospital || '');

            if (previousData.tariffCardCollectedBillHospital === 'no') {
                setTariffCardCollectedBillHospitalObservation(previousData.tariffCardCollectedBillHospitalObservation || '');
            }
        } else if (previousData.tariffCardCollected === false) {
            setTariffCardCollected('no');
            setTariffCardCollectedReason(previousData.tariffCardCollectedReason || '');
        }

        // 10. Hospital Authority Statement
        if (previousData.hospitalAuthorityStatement === true) {
            setHospitalAuthorityStatement('yes');
            setHospitalAuthorityStatementFindings(previousData.hospitalAuthorityStatementFinding || '');
        } else if (previousData.hospitalAuthorityStatement === false) {
            setHospitalAuthorityStatement('no');
            setHospitalAuthorityStatementReason(previousData.hospitalAuthorityStatementReason || '');
        }

        // 11. Line of Treatment
        setLineoftreatment(previousData.lineOfTreatment || '');

        // 12. Medical Management
        if (previousData.lineOfTreatment === 'medicalmanagement') {
            setLineoFTreatmentGiven(previousData.isActiveMedicalManagementLOTGiven || '');

            if (previousData.isActiveMedicalManagementLOTGiven === 'yes') {
                setMedicalManagementJustification(previousData.medicalManagementJustification || '');
            } else if (previousData.isActiveMedicalManagementLOTGiven === 'no') {
                setMedicalManagementIsHospitalization(previousData.medicalManagementIsHospitalization || '');

                if (previousData.medicalManagementIsHospitalization === 'yes') {
                    setMedicalManagementFindings(previousData.medicalManagementFindings || '');
                } else if (previousData.medicalManagementIsHospitalization === 'no') {
                    setMedicalManagementObsevations(previousData.medicalManagementObsevations || '');
                }
            }
        }

        // 13. Surgical Management
        if (previousData.lineOfTreatment === 'surgicalmanagement') {
            setSurgicalManagementProcedureCarriedOut(previousData.surgicalManagementProcedureCarriedOut || '');
            setOperativeNotes(previousData.surgicalManagementOperative || '');

            if (previousData.surgicalManagementOperative === 'Provided') {
                setSurgicalManagementOperativeFindings(previousData.surgicalManagementOperativeFindings || '');
            } else if (previousData.surgicalManagementOperative === 'Not Provided') {
                setSurgicalManagementOperativeReason(previousData.surgicalManagementOperativeReason || '');
            }

            setAnaesthesiaNotes(previousData.surgicalManagementAnaesthesia || '');

            if (previousData.surgicalManagementAnaesthesia === 'Provided') {
                setSurgicalManagementAnaesthesiaFindings(previousData.surgicalManagementAnaesthesiaFindings || '');
            } else if (previousData.surgicalManagementAnaesthesia === 'Not Provided') {
                setSurgicalManagementAnaesthesiaReason(previousData.surgicalManagementAnaesthesiaReason || '');
            }

            setImplantUsed(previousData.surgicalManagementAnyImplantUsed || '');

            if (previousData.surgicalManagementAnyImplantUsed === 'yes') {
                setInvoiceVerified(previousData.surgicalManagementInvoiceVerified || '');

                if (previousData.surgicalManagementInvoiceVerified === 'Genuine') {
                    setSurgicalManagementInvoiceVerifiedManufacturer(previousData.surgicalManagementInvoiceVerifiedManufacturer || '');
                    setSurgicalManagementInvoiceVerifiedStickerNumber(previousData.surgicalManagementInvoiceVerifiedStickerNumber || '');
                } else if (previousData.surgicalManagementInvoiceVerified === 'Discrepancy' ||
                    previousData.surgicalManagementInvoiceVerified === 'Not Verified') {
                    setSurgicalManagementInvoiceVerifiedFinding(previousData.surgicalManagementInvoiceVerifiedFinding || '');
                }
            }
        }
    };


    // src/components/ReimburseCaseUpdate/HospitalStepOne.tsx
    // PART 7: Submit Logic - The Grand Finale!
    // Add this function BEFORE the return statement

    const saveStepOne = async () => {
        try {
            const reimCaseUpdate: any = {};

            // Get activeReCaseID from localStorage
            const activeReCaseID = localStorage.getItem('activeReCaseID');
            reimCaseUpdate.activeReCaseID = activeReCaseID || null;

            // 1. Basic Hospital Info
            reimCaseUpdate.hospitalName = hospitalName;

            // 2. Hospital Exists
            if (hospitalExits === 'yes') {
                reimCaseUpdate.hospitalExist = true;
                reimCaseUpdate.hospitalExistRegNo = regNo;
                reimCaseUpdate.hospitalExistValidity = validity === 'yes';
                reimCaseUpdate.hospitalExistNoOfBeds = ''; // Not captured in form
                reimCaseUpdate.hospitalExistRMONumber = ''; // Not captured in form
                reimCaseUpdate.hospitalExistRegNursingStaff = ''; // Not captured in form
                reimCaseUpdate.hospitalExistOT = ot === 'yes';
                reimCaseUpdate.hospitalExistOwnerOfHospital = hospitalOwner;
                reimCaseUpdate.hospitalExistHospitalContactNo = hospitalContact;

                if (hospitalExistFacilityAvailable && hospitalExistFacilityAvailable.length > 0) {
                    reimCaseUpdate.hospitalExistFacilityAvailable = hospitalExistFacilityAvailable.toString();
                }
            } else if (hospitalExits === 'no') {
                reimCaseUpdate.hospitalExist = false;
                reimCaseUpdate.hospitalExistObservation = hospitalExistsObservations;
            }

            // 3. IP Register
            if (ipregisterExits === 'yes') {
                reimCaseUpdate.ipRegisterExist = true;

                if (discrepancyNoted === 'yes') {
                    reimCaseUpdate.ipRegisterExistDiscrepancyNoted = true;
                    reimCaseUpdate.ipRegisterExistDiscrepancyNotedOther = entrySelector;
                    reimCaseUpdate.ipRegisterExistFinding = discrepancyNotedFindings;
                } else if (discrepancyNoted === 'no') {
                    reimCaseUpdate.ipRegisterExistDiscrepancyNoted = false;
                }
            } else if (ipregisterExits === 'no') {
                reimCaseUpdate.ipRegisterExist = false;
            }

            // 4. ICP Collection
            if (icpCollected === 'yes') {
                reimCaseUpdate.icpCollected = true;

                if (pedNoted === 'yes') {
                    reimCaseUpdate.icpCollectedPEDNoted = true;
                    reimCaseUpdate.icpCollectedPEDNotedFinding = pedNotedFindings;
                } else if (pedNoted === 'no') {
                    reimCaseUpdate.icpCollectedPEDNoted = false;
                }

                if (anyOtherDiscrepancyNoted === 'yes') {
                    reimCaseUpdate.icpCollectedOtherDiscrepancyNoted = true;
                    reimCaseUpdate.icpCollectedOtherDiscrepancyNotedFinding = icpCollectedOtherDiscrepancyNotedFinding;
                    reimCaseUpdate.icpCollectedOtherDiscrepancyNotedObservations = anyOtherDiscrepancyObservations;
                } else if (anyOtherDiscrepancyNoted === 'no') {
                    reimCaseUpdate.icpCollectedOtherDiscrepancyNoted = false;
                }
            } else if (icpCollected === 'no') {
                reimCaseUpdate.icpCollected = false;
                reimCaseUpdate.icpCollectedReason = icpCollectedReason;
            }

            // 5. Vital Chart (TBR/BP)
            if (vitalChart === 'yes') {
                reimCaseUpdate.tbrBp = true;
                reimCaseUpdate.tbrBpObservations = vitalChartObservations;
            } else if (vitalChart === 'no') {
                reimCaseUpdate.tbrBp = false;
                reimCaseUpdate.tbrBpReason = vitalChartReason;
            }

            // 6. Past Record MRD
            if (checkedMRD === 'yes') {
                reimCaseUpdate.pastRecordMRDChecked = true;

                if (hospitaizationNoted === 'yes') {
                    reimCaseUpdate.pastRecordMRDCheckedTreatment = true;
                    reimCaseUpdate.pastRecordMRDCheckedTreatmentDetails = hospitaizationNotedDetails;
                }
            } else if (checkedMRD === 'no') {
                reimCaseUpdate.pastRecordMRDChecked = false;

                if (pastRecordMRDCheckedNotRequired === 'yes') {
                    reimCaseUpdate.pastRecordMRDCheckedNotRequired = true;
                    reimCaseUpdate.pastRecordMRDCheckedNotRequiredReason = pastRecordMRDCheckedNotRequiredReason;
                } else if (pastRecordMRDCheckedNotRequired === 'no') {
                    reimCaseUpdate.pastRecordMRDCheckedNotRequired = false;
                }
            }

            // 7. Hospital Bill Verification
            if (hospitalBillVerification === 'yes') {
                reimCaseUpdate.hospitalBillVerification = true;

                if (hospitalBillVerificationVerified === 'yes') {
                    reimCaseUpdate.hospitalBillVerificationVerified = true;
                } else if (hospitalBillVerificationVerified === 'no') {
                    reimCaseUpdate.hospitalBillVerificationVerified = false;
                    reimCaseUpdate.hospitalBillVerificationVerifiedDispensaryDetails = hospitalBillVerificationVerifiedDispensaryDetails;
                }
            } else if (hospitalBillVerification === 'no') {
                reimCaseUpdate.hospitalBillVerification = false;
                reimCaseUpdate.hospitalBillVerificationReason = hospitalBillVerificationReason;
            }

            // 8. Tariff Card
            if (tariffCardCollected === 'yes') {
                reimCaseUpdate.tariffCardCollected = true;
                reimCaseUpdate.tariffCardCollectedBillHospital = hospitalTariif;

                if (hospitalTariif === 'no') {
                    reimCaseUpdate.tariffCardCollectedBillHospitalObservation = tariffCardCollectedBillHospitalObservation;
                }
            } else if (tariffCardCollected === 'no') {
                reimCaseUpdate.tariffCardCollected = false;
                reimCaseUpdate.tariffCardCollectedReason = tariffCardCollectedReason;
            }

            // 9. Hospital Authority Statement
            if (hospitalAuthorityStatement === 'yes') {
                reimCaseUpdate.hospitalAuthorityStatement = true;
                reimCaseUpdate.hospitalAuthorityStatementFinding = hospitalAuthorityStatementFindings;
            } else if (hospitalAuthorityStatement === 'no') {
                reimCaseUpdate.hospitalAuthorityStatement = false;
                reimCaseUpdate.hospitalAuthorityStatementReason = hospitalAuthorityStatementReason;
            }

            // 10. Line of Treatment
            reimCaseUpdate.lineOfTreatment = lineoftreatment;

            // 11. Medical Management
            if (lineoftreatment === 'medicalmanagement') {
                reimCaseUpdate.isActiveMedicalManagementLOTGiven = lineoFTreatmentGiven;

                if (lineoFTreatmentGiven === 'yes') {
                    reimCaseUpdate.medicalManagementJustification = medicalManagementJustification;
                } else if (lineoFTreatmentGiven === 'no') {
                    reimCaseUpdate.medicalManagementIsHospitalization = medicalManagementIsHospitalization;

                    if (medicalManagementIsHospitalization === 'yes') {
                        reimCaseUpdate.medicalManagementFindings = medicalManagementFindings;
                    } else if (medicalManagementIsHospitalization === 'no') {
                        reimCaseUpdate.medicalManagementObsevations = medicalManagementObsevations;
                    }
                }

                if (qualityOfMedicine === 'yes') {
                    reimCaseUpdate.qualityOfMedicine = true;
                } else if (qualityOfMedicine === 'no') {
                    reimCaseUpdate.qualityOfMedicine = false;
                    reimCaseUpdate.qualityOfMedicineObservation = qualityOfMedicineObservation;
                }
            }

            // 12. Surgical Management
            if (lineoftreatment === 'surgicalmanagement') {
                reimCaseUpdate.surgicalManagementProcedureCarriedOut = surgicalManagementProcedureCarriedOut;
                reimCaseUpdate.surgicalManagementOperative = operativeNotes;

                if (operativeNotes === 'Provided') {
                    reimCaseUpdate.surgicalManagementOperativeFindings = surgicalManagementOperativeFindings;
                } else if (operativeNotes === 'Not Provided') {
                    reimCaseUpdate.surgicalManagementOperativeReason = surgicalManagementOperativeReason;
                }

                reimCaseUpdate.surgicalManagementAnaesthesia = anaesthesiaNotes;

                if (anaesthesiaNotes === 'Provided') {
                    reimCaseUpdate.surgicalManagementAnaesthesiaFindings = surgicalManagementAnaesthesiaFindings;
                } else if (anaesthesiaNotes === 'Not Provided') {
                    reimCaseUpdate.surgicalManagementAnaesthesiaReason = surgicalManagementAnaesthesiaReason;
                }

                reimCaseUpdate.surgicalManagementAnyImplantUsed = implantUsed;

                if (implantUsed === 'yes') {
                    reimCaseUpdate.surgicalManagementInvoiceVerified = invoiceVerified;

                    if (invoiceVerified === 'Genuine') {
                        reimCaseUpdate.surgicalManagementInvoiceVerifiedManufacturer = surgicalManagementInvoiceVerifiedManufacturer;
                        reimCaseUpdate.surgicalManagementInvoiceVerifiedStickerNumber = surgicalManagementInvoiceVerifiedStickerNumber;
                    } else if (invoiceVerified === 'Discrepancy' || invoiceVerified === 'Not Verified') {
                        reimCaseUpdate.surgicalManagementInvoiceVerifiedFinding = surgicalManagementInvoiceVerifiedFinding;
                    }
                }
            }

            // 13. RTA Accidental - Would need separate handling
            // if (lineoftreatment === 'rtaaccidental') {
            //   // RTA fields would go here
            // }

            console.log('Submitting reimCaseUpdate:', JSON.stringify(reimCaseUpdate, null, 2));

            // Make API call
            const cleanInvestigationId = investigationId?.split(' ')[0];
            const response = await reimcaseUpdateService.addHospitalVerify(reimCaseUpdate, cleanInvestigationId || '');

            if (response.statusCode === 0) {
                // Update localStorage with new activeReCaseID
                localStorage.setItem('activeReCaseID', response.payload.activeReCaseID);

                // Show success message
                alert('Hospital verification Step One saved successfully!');

                // Trigger tab change to Step Two
                onChangeTab(false);
            } else {
                alert('Failed to save: ' + (response.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error saving Step One:', error);
            alert('Error saving hospital verification');
        }
    };


    // ========== HOSPITAL STEP ONE COMPLETE! 🎉 ==========

    // ========== CONTINUE TO PART 3 FOR FORM FIELDS ==========

    // src/components/ReimburseCaseUpdate/HospitalStepOne.tsx
    // PART 3: Basic Hospital Info Form Fields (Replace the return statement)

    return (
        <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* LEFT COLUMN */}
                <Grid size={{ xs: 12, md: 6 }}>

                    {/* 1. Hospital Name */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 4 }}>
                                <Typography>Hospital Name</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={hospitalName}
                                    onChange={(e) => setHospitalName(e.target.value)}
                                    disabled={disableFields}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 2. Does the Hospital Exist */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 4 }}>
                                <Typography>Does the Hospital Exists</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <FormControl component="fieldset" disabled={disableFields}>
                                    <RadioGroup
                                        row
                                        value={hospitalExits}
                                        onChange={(e) => setHospitalExits(e.target.value)}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 3. If Hospital Exists = YES */}
                    {hospitalExits === 'yes' && (
                        <>
                            {/* Reg No */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Reg No</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="reg. no."
                                            value={regNo}
                                            onChange={(e) => setRegNo(e.target.value)}
                                            disabled={disableFields}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Validity */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Validity</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={validity}
                                                onChange={(e) => setValidity(e.target.value)}
                                                disabled={disableFields}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="yes">Yes</MenuItem>
                                                <MenuItem value="no">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* OT */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>OT</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={ot}
                                                onChange={(e) => setOt(e.target.value)}
                                                disabled={disableFields}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="yes">Yes</MenuItem>
                                                <MenuItem value="no">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Owner Of Hospital */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Owner Of Hospital</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Owner Of Hospital"
                                            value={hospitalOwner}
                                            onChange={(e) => setHospitalOwner(e.target.value)}
                                            disabled={disableFields}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Hospital Contact Number */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Hospital Contact Number</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="hospital Contact"
                                            value={hospitalContact}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setHospitalContact(value);
                                            }}
                                            disabled={disableFields}
                                            inputProps={{ maxLength: 10 }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Facilities Available */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Facilities available at the hospital</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                multiple
                                                value={hospitalExistFacilityAvailable}
                                                onChange={(e) => setHospitalExistFacilityAvailable(
                                                    typeof e.target.value === 'string'
                                                        ? e.target.value.split(',')
                                                        : e.target.value
                                                )}
                                                disabled={disableFields}
                                                renderValue={(selected) => (selected as string[]).join(', ')}
                                            >
                                                <MenuItem value="ICU">ICU</MenuItem>
                                                <MenuItem value="ICCU">ICCU</MenuItem>
                                                <MenuItem value="PICU">PICU</MenuItem>
                                                <MenuItem value="CCU">CCU</MenuItem>
                                                <MenuItem value="None">None</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>
                        </>
                    )}

                    {/* 4. If Hospital Exists = NO */}
                    {hospitalExits === 'no' && (
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 4 }}>
                                    <Typography>Observations</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        placeholder="Hospital Exists Observations"
                                        value={hospitalExistsObservations}
                                        onChange={(e) => setHospitalExistsObservations(e.target.value)}
                                        disabled={disableFields}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* 5. IP Register Exists */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 4 }}>
                                <Typography>IP register exists</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={ipregisterExits}
                                        onChange={(e) => setIpregisterExits(e.target.value)}
                                        disabled={disableFields}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="yes">Yes</MenuItem>
                                        <MenuItem value="no">No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 6. If IP Register = YES */}
                    {ipregisterExits === 'yes' && (
                        <>
                            {/* Discrepancy Noted */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Discrepancy Noted</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl component="fieldset" disabled={disableFields}>
                                            <RadioGroup
                                                row
                                                value={discrepancyNoted}
                                                onChange={(e) => setDiscrepancyNoted(e.target.value)}
                                            >
                                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Entry Selector (if Discrepancy = Yes) */}
                            {discrepancyNoted === 'yes' && (
                                <>
                                    <Box sx={{ mb: 3 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid size={{ xs: 4 }}></Grid>
                                            <Grid size={{ xs: 8 }}>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        value={entrySelector}
                                                        onChange={(e) => setEntrySelector(e.target.value)}
                                                        disabled={disableFields}
                                                    >
                                                        <MenuItem value="">Select</MenuItem>
                                                        <MenuItem value="random">Random Entry</MenuItem>
                                                        <MenuItem value="overwitten">Overwritten entry</MenuItem>
                                                        <MenuItem value="multiple">Multiple entry</MenuItem>
                                                        <MenuItem value="others">others</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* Findings */}
                                    <Box sx={{ mb: 3 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid size={{ xs: 4 }}>
                                                <Typography>Findings</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 8 }}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    size="small"
                                                    placeholder="Findings"
                                                    value={discrepancyNotedFindings}
                                                    onChange={(e) => setDiscrepancyNotedFindings(e.target.value)}
                                                    disabled={disableFields}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </>
                            )}
                        </>
                    )}

                    {/* 7. ICPs Collected */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 4 }}>
                                <Typography>ICPs Collected</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={icpCollected}
                                        onChange={(e) => setIcpCollected(e.target.value)}
                                        disabled={disableFields}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="yes">Yes</MenuItem>
                                        <MenuItem value="no">No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 8. If ICP Collected = YES */}
                    {icpCollected === 'yes' && (
                        <>
                            {/* PED Noted */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>PED Noted</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl component="fieldset" disabled={disableFields}>
                                            <RadioGroup
                                                row
                                                value={pedNoted}
                                                onChange={(e) => setPedNoted(e.target.value)}
                                            >
                                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* PED Findings */}
                            {pedNoted === 'yes' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}>
                                            <Typography>Findings</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                                placeholder="Findings"
                                                value={pedNotedFindings}
                                                onChange={(e) => setPedNotedFindings(e.target.value)}
                                                disabled={disableFields}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Any Other Discrepancy Noted */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Any Other Discrepancy Noted</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl component="fieldset" disabled={disableFields}>
                                            <RadioGroup
                                                row
                                                value={anyOtherDiscrepancyNoted}
                                                onChange={(e) => setAnyOtherDiscrepancyNoted(e.target.value)}
                                            >
                                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Other Discrepancy Findings */}
                            {anyOtherDiscrepancyNoted === 'yes' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}>
                                            <Typography>Findings</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                                placeholder="Findings"
                                                value={icpCollectedOtherDiscrepancyNotedFinding}
                                                onChange={(e) => setIcpCollectedOtherDiscrepancyNotedFinding(e.target.value)}
                                                disabled={disableFields}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Observations */}
                            {pedNoted === 'yes' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}>
                                            <Typography>Observations</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                                value={anyOtherDiscrepancyObservations}
                                                onChange={(e) => setAnyOtherDiscrepancyObservations(e.target.value)}
                                                disabled={disableFields}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </>
                    )}

                    {/* 9. If ICP Collected = NO */}
                    {icpCollected === 'no' && (
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 4 }}>
                                    <Typography>Reason</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        value={icpCollectedReason}
                                        onChange={(e) => setIcpCollectedReason(e.target.value)}
                                        disabled={disableFields}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* 10. TPR/BP/Vital Chart */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 4 }}>
                                <Typography>TPR/BP/Vital Chart</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <FormControl component="fieldset" disabled={disableFields}>
                                    <RadioGroup
                                        row
                                        value={vitalChart}
                                        onChange={(e) => setVitalChart(e.target.value)}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="Maintained" />
                                        <FormControlLabel value="no" control={<Radio />} label="Not Maintained" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Vital Chart Observations */}
                    {vitalChart === 'yes' && (
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 4 }}>
                                    <Typography>Observations</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        value={vitalChartObservations}
                                        onChange={(e) => setVitalChartObservations(e.target.value)}
                                        disabled={disableFields}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Vital Chart Reason */}
                    {vitalChart === 'no' && (
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 4 }}>
                                    <Typography>Reason</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        value={vitalChartReason}
                                        onChange={(e) => setVitalChartReason(e.target.value)}
                                        disabled={disableFields}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* 11. Past Records checked with MRD */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 4 }}>
                                <Typography>Past Records checked with MRD?</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={checkedMRD}
                                        onChange={(e) => setCheckedMRD(e.target.value)}
                                        disabled={disableFields}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="yes">Yes</MenuItem>
                                        <MenuItem value="no">No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* If MRD Checked = YES */}
                    {checkedMRD === 'yes' && (
                        <>
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Past Treatment / Hospitalization Noted</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl component="fieldset" disabled={disableFields}>
                                            <RadioGroup
                                                row
                                                value={hospitaizationNoted}
                                                onChange={(e) => setHospitaizationNoted(e.target.value)}
                                            >
                                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {hospitaizationNoted === 'yes' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}></Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                                value={hospitaizationNotedDetails}
                                                onChange={(e) => setHospitaizationNotedDetails(e.target.value)}
                                                disabled={disableFields}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </>
                    )}

                    {/* If MRD Checked = NO */}
                    {checkedMRD === 'no' && (
                        <>
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}></Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl component="fieldset" disabled={disableFields}>
                                            <RadioGroup
                                                row
                                                value={pastRecordMRDCheckedNotRequired}
                                                onChange={(e) => setPastRecordMRDCheckedNotRequired(e.target.value)}
                                            >
                                                <FormControlLabel value="yes" control={<Radio />} label="Not required" />
                                                <FormControlLabel value="no" control={<Radio />} label="Not allowed" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {pastRecordMRDCheckedNotRequired === 'yes' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}>
                                            <Typography>Reason</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                                value={pastRecordMRDCheckedNotRequiredReason}
                                                onChange={(e) => setPastRecordMRDCheckedNotRequiredReason(e.target.value)}
                                                disabled={disableFields}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </>
                    )}

                    {/* 12. Hospital Bill Verification */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 4 }}>
                                <Typography>Hospital Bill Verification</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <FormControl component="fieldset" disabled={disableFields}>
                                    <RadioGroup
                                        row
                                        value={hospitalBillVerification}
                                        onChange={(e) => setHospitalBillVerification(e.target.value)}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="Verified" />
                                        <FormControlLabel value="no" control={<Radio />} label="Not Verified" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* If Verified = YES */}
                    {hospitalBillVerification === 'yes' && (
                        <>
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}></Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl component="fieldset" disabled={disableFields}>
                                            <RadioGroup
                                                row
                                                value={hospitalBillVerificationVerified}
                                                onChange={(e) => setHospitalBillVerificationVerified(e.target.value)}
                                            >
                                                <FormControlLabel value="yes" control={<Radio />} label="Genuine" />
                                                <FormControlLabel value="no" control={<Radio />} label="Discrepancy" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {hospitalBillVerificationVerified === 'no' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}></Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={hospitalBillVerificationVerifiedDispensaryDetails}
                                                    onChange={(e) => setHospitalBillVerificationVerifiedDispensaryDetails(e.target.value)}
                                                    disabled={disableFields}
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
                                </Box>
                            )}
                        </>
                    )}

                    {/* If Verified = NO */}
                    {hospitalBillVerification === 'no' && (
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 4 }}>
                                    <Typography>Reason/Observations</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        value={hospitalBillVerificationReason}
                                        onChange={(e) => setHospitalBillVerificationReason(e.target.value)}
                                        disabled={disableFields}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* ========== LEFT COLUMN COMPLETE! ========== */}
                    {/* ========== CONTINUE TO PART 5 FOR RIGHT COLUMN ========== */}

                </Grid>

                {/* RIGHT COLUMN - Will be added in Part 5 */}

                {/* RIGHT COLUMN */}
                <Grid size={{ xs: 12, md: 6 }}>

                    {/* 1. Line of Treatment Selector */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 4 }}>
                                <Typography>Line of Treatment</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={lineoftreatment}
                                        onChange={(e) => setLineoftreatment(e.target.value)}
                                        disabled={disableFields}
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="medicalmanagement">Medical Management</MenuItem>
                                        <MenuItem value="surgicalmanagement">Surgical Management (Non Accidental)</MenuItem>
                                        <MenuItem value="rtaaccidental">RTA Accidental Case</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* ========== MEDICAL MANAGEMENT SECTION ========== */}
                    {lineoftreatment === 'medicalmanagement' && (
                        <>
                            {/* Is Active Line of Treatment Given */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Is Active line of treatment Given?</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={lineoFTreatmentGiven}
                                                onChange={(e) => setLineoFTreatmentGiven(e.target.value)}
                                                disabled={disableFields}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="yes">Yes</MenuItem>
                                                <MenuItem value="no">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* If Active Treatment = NO */}
                            {lineoFTreatmentGiven === 'no' && (
                                <>
                                    <Box sx={{ mb: 3 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid size={{ xs: 4 }}>
                                                <Typography>Is Hospitalization only for evaluation purpose?</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 8 }}>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        value={medicalManagementIsHospitalization}
                                                        onChange={(e) => setMedicalManagementIsHospitalization(e.target.value)}
                                                        disabled={disableFields}
                                                    >
                                                        <MenuItem value="">Select</MenuItem>
                                                        <MenuItem value="yes">Yes</MenuItem>
                                                        <MenuItem value="no">No</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* If Evaluation = NO - Observations */}
                                    {medicalManagementIsHospitalization === 'no' && (
                                        <Box sx={{ mb: 3 }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid size={{ xs: 4 }}>
                                                    <Typography>Observations</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 8 }}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        size="small"
                                                        value={medicalManagementObsevations}
                                                        onChange={(e) => setMedicalManagementObsevations(e.target.value)}
                                                        disabled={disableFields}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}

                                    {/* If Evaluation = YES - Findings */}
                                    {medicalManagementIsHospitalization === 'yes' && (
                                        <Box sx={{ mb: 3 }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid size={{ xs: 4 }}>
                                                    <Typography>Findings</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 8 }}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        size="small"
                                                        value={medicalManagementFindings}
                                                        onChange={(e) => setMedicalManagementFindings(e.target.value)}
                                                        disabled={disableFields}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}
                                </>
                            )}

                            {/* If Active Treatment = YES - Justifications */}
                            {lineoFTreatmentGiven === 'yes' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}>
                                            <Typography>Justifications</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                                value={medicalManagementJustification}
                                                onChange={(e) => setMedicalManagementJustification(e.target.value)}
                                                disabled={disableFields}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Quality of Medicine */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Quantity of Medicine purchased matches with actual treatment administered?</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qualityOfMedicine}
                                                onChange={(e) => setQualityOfMedicine(e.target.value)}
                                                disabled={disableFields}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="yes">Yes</MenuItem>
                                                <MenuItem value="no">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Quality of Medicine Observations */}
                            {qualityOfMedicine === 'no' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}>
                                            <Typography>Observations</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                                value={qualityOfMedicineObservation}
                                                onChange={(e) => setQualityOfMedicineObservation(e.target.value)}
                                                disabled={disableFields}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </>
                    )}

                    {/* ========== SURGICAL MANAGEMENT SECTION ========== */}
                    {lineoftreatment === 'surgicalmanagement' && (
                        <>
                            {/* Procedure Carried Out */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Procedure carried Out</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            size="small"
                                            value={surgicalManagementProcedureCarriedOut}
                                            onChange={(e) => setSurgicalManagementProcedureCarriedOut(e.target.value)}
                                            disabled={disableFields}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Operative Notes */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Operative Notes</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl component="fieldset" disabled={disableFields}>
                                            <RadioGroup
                                                row
                                                value={operativeNotes}
                                                onChange={(e) => setOperativeNotes(e.target.value)}
                                            >
                                                <FormControlLabel value="Provided" control={<Radio />} label="Provided" />
                                                <FormControlLabel value="Not Provided" control={<Radio />} label="Not Provided" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Operative Notes - Findings */}
                            {operativeNotes === 'Provided' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}>
                                            <Typography>Findings</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                                value={surgicalManagementOperativeFindings}
                                                onChange={(e) => setSurgicalManagementOperativeFindings(e.target.value)}
                                                disabled={disableFields}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Operative Notes - Reason */}
                            {operativeNotes === 'Not Provided' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}>
                                            <Typography>Reason</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                                value={surgicalManagementOperativeReason}
                                                onChange={(e) => setSurgicalManagementOperativeReason(e.target.value)}
                                                disabled={disableFields}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Anaesthesia Notes */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Anaesthesia Notes</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl component="fieldset" disabled={disableFields}>
                                            <RadioGroup
                                                row
                                                value={anaesthesiaNotes}
                                                onChange={(e) => setAnaesthesiaNotes(e.target.value)}
                                            >
                                                <FormControlLabel value="Provided" control={<Radio />} label="Provided" />
                                                <FormControlLabel value="Not Provided" control={<Radio />} label="Not Provided" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Anaesthesia Notes - Findings */}
                            {anaesthesiaNotes === 'Provided' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}>
                                            <Typography>Findings</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                                value={surgicalManagementAnaesthesiaFindings}
                                                onChange={(e) => setSurgicalManagementAnaesthesiaFindings(e.target.value)}
                                                disabled={disableFields}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Anaesthesia Notes - Reason */}
                            {anaesthesiaNotes === 'Not Provided' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}>
                                            <Typography>Reason</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                                value={surgicalManagementAnaesthesiaReason}
                                                onChange={(e) => setSurgicalManagementAnaesthesiaReason(e.target.value)}
                                                disabled={disableFields}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Any Implant Used */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Any Implant Used?</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl component="fieldset" disabled={disableFields}>
                                            <RadioGroup
                                                row
                                                value={implantUsed}
                                                onChange={(e) => setImplantUsed(e.target.value)}
                                            >
                                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Implant Used = YES */}
                            {implantUsed === 'yes' && (
                                <>
                                    {/* Invoice Verified */}
                                    <Box sx={{ mb: 3 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid size={{ xs: 4 }}>
                                                <Typography>Invoice verified</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 8 }}>
                                                <FormControl component="fieldset" disabled={disableFields}>
                                                    <RadioGroup
                                                        row
                                                        value={invoiceVerified}
                                                        onChange={(e) => setInvoiceVerified(e.target.value)}
                                                    >
                                                        <FormControlLabel value="Genuine" control={<Radio />} label="Genuine" />
                                                        <FormControlLabel value="Discrepancy" control={<Radio />} label="Discrepancy" />
                                                        <FormControlLabel value="Not Verified" control={<Radio />} label="Not Verified" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* Invoice Verified = Discrepancy or Not Verified */}
                                    {(invoiceVerified === 'Discrepancy' || invoiceVerified === 'Not Verified') && (
                                        <Box sx={{ mb: 3 }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid size={{ xs: 4 }}>
                                                    <Typography>Findings</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 8 }}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        size="small"
                                                        value={surgicalManagementInvoiceVerifiedFinding}
                                                        onChange={(e) => setSurgicalManagementInvoiceVerifiedFinding(e.target.value)}
                                                        disabled={disableFields}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}

                                    {/* Invoice Verified = Genuine */}
                                    {invoiceVerified === 'Genuine' && (
                                        <>
                                            {/* Invoice Sticker Number */}
                                            <Box sx={{ mb: 3 }}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid size={{ xs: 4 }}>
                                                        <Typography>Invoice sticker number</Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 8 }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            value={surgicalManagementInvoiceVerifiedStickerNumber}
                                                            onChange={(e) => setSurgicalManagementInvoiceVerifiedStickerNumber(e.target.value)}
                                                            disabled={disableFields}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>

                                            {/* Manufacturer */}
                                            <Box sx={{ mb: 3 }}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid size={{ xs: 4 }}>
                                                        <Typography>Manufacturer</Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 8 }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            value={surgicalManagementInvoiceVerifiedManufacturer}
                                                            onChange={(e) => setSurgicalManagementInvoiceVerifiedManufacturer(e.target.value)}
                                                            disabled={disableFields}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* ========== RTA ACCIDENTAL CASE ========== */}
                    {lineoftreatment === 'rtaaccidental' && (
                        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                RTA Accidental Hospital Verification Component
                                (Will need separate component implementation)
                            </Typography>
                        </Box>
                    )}

                    {/* ========== CONTINUE TO PART 6 FOR TARIFF & AUTHORITY ========== */}

                    {/* ========== TARIFF CARD SECTION ========== */}
                    {/* This appears for ALL treatment types */}

                    {/* 1. Tariff Card Collected */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 4 }}>
                                <Typography>Tariff Card Collected?</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <FormControl component="fieldset" disabled={disableFields}>
                                    <RadioGroup
                                        row
                                        value={tariffCardCollected}
                                        onChange={(e) => setTariffCardCollected(e.target.value)}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 2. If Tariff Card = YES */}
                    {tariffCardCollected === 'yes' && (
                        <>
                            {/* Bill according to Hospital Tariff */}
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 4 }}>
                                        <Typography>Bill according to Hospital Tariff?</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={hospitalTariif}
                                                onChange={(e) => setHospitalTariif(e.target.value)}
                                                disabled={disableFields}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="yes">Yes</MenuItem>
                                                <MenuItem value="no">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* If Hospital Tariff = NO - Observations */}
                            {hospitalTariif === 'no' && (
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 4 }}>
                                            <Typography>Observations</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                size="small"
                                                value={tariffCardCollectedBillHospitalObservation}
                                                onChange={(e) => setTariffCardCollectedBillHospitalObservation(e.target.value)}
                                                disabled={disableFields}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </>
                    )}

                    {/* 3. If Tariff Card = NO - Reason */}
                    {tariffCardCollected === 'no' && (
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 4 }}>
                                    <Typography>Reason</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        value={tariffCardCollectedReason}
                                        onChange={(e) => setTariffCardCollectedReason(e.target.value)}
                                        disabled={disableFields}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* ========== HOSPITAL AUTHORITY STATEMENT ========== */}

                    {/* 4. Hospital Authority Statement */}
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 4 }}>
                                <Typography>Hospital Authority statement</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <FormControl component="fieldset" disabled={disableFields}>
                                    <RadioGroup
                                        row
                                        value={hospitalAuthorityStatement}
                                        onChange={(e) => setHospitalAuthorityStatement(e.target.value)}
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="Collected" />
                                        <FormControlLabel value="no" control={<Radio />} label="Not Collected" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 5. If Authority Statement = YES - Findings */}
                    {hospitalAuthorityStatement === 'yes' && (
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 4 }}>
                                    <Typography>Findings</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        value={hospitalAuthorityStatementFindings}
                                        onChange={(e) => setHospitalAuthorityStatementFindings(e.target.value)}
                                        disabled={disableFields}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* 6. If Authority Statement = NO - Reason */}
                    {hospitalAuthorityStatement === 'no' && (
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 4 }}>
                                    <Typography>hospital Authority Statement Reason</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        value={hospitalAuthorityStatementReason}
                                        onChange={(e) => setHospitalAuthorityStatementReason(e.target.value)}
                                        disabled={disableFields}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* ========== RIGHT COLUMN COMPLETE! ========== */}
                    {/* ========== CONTINUE TO PART 7 FOR SUBMIT LOGIC ========== */}
                    {buttonEnable && (
                        <Box sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                onClick={saveStepOne}
                            >
                                Save as Draft
                            </Button>
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* Save Button */}
            {buttonEnable && (
                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={saveStepOne}
                    >
                        Save as Draft
                    </Button>
                </Box>
            )}
        </Paper>
    );

    // ========== CONTINUE TO PART 4 FOR IP REGISTER + ICP + VITAL CHARTS ==========
};

export default HospitalStepOne;