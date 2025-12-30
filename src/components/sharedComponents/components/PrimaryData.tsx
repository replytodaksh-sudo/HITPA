// ===========================
// src/components/PrimaryData.tsx
// ===========================

// ================================================================
// PRIMARY DATA COMPONENT - PART 1: INTERFACES & SETUP
// ================================================================

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Typography,
    Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

// ===========================
// CHILD COMPONENT IMPORTS
// ===========================
import MedicalManagement from './MedicalManagement';
import SurgicalManagementSec from './SurgicalManagementSec';
import RtaAccidental from './RtaAccidental';

// ===========================
// INTERFACES
// ===========================
interface PrimaryDataProps {
    isPresent: boolean;
    reasonVal?: any;
    previuosData?: any;
    isFormEditable: boolean;
    onNextPage: (tabIndex: number) => void;
}

interface CaseUpdateModel {
    roomCategory?: string;
    roomRent?: string;
    doa?: any;
    expectedDateOfDischarge?: any;
    diagnosis?: string;
    iPDRegisterEntryFound?: string;
    ipdRegisterDiscrepancyNoted?: boolean;
    iPDRegisterDiscrepancyObservations?: string;
    treatingDoctorVisit?: string;
    treatingDoctorVisitPEDNoted?: boolean;
    treatingDoctorVisitPEDNotedFindings?: string;
    treatingDoctorVisitDiscrepancyPED?: boolean;
    treatingDoctorVisitPEDObservations?: string;
    treatingDoctorVisitReason?: string;
    ipdCollected?: string;
    ipdCollectedPEDNoted?: boolean;
    iPDCollectedPEDNotedFindings?: string;
    ipdCollectedDiscrepancyPED?: boolean;
    iPDCollectedDiscrepancyPEDObservations?: string;
    iPDCollectedReason?: string;
    lineOfTreatment?: string;
    pastRecordsCheckedMRD?: string;
    pastRecordsCheckedMRDPastTreatment?: boolean;
    pastRecordsCheckedMRDHospitalizationNoted?: string;
    pastRecordsCheckedMRDNOT?: boolean;
    pastRecordsCheckedMRDReason?: string;
    labReportVerified?: boolean;
    labReportObservations?: string;
    labReportReason?: string;
    copyOfDischargeCardCollected?: boolean;
    copyOfFinalBillCollected?: boolean;
    insuredVisit?: boolean;
    insuredVisitReason?: string;
    chemist?: boolean;
    chemistObservations?: string;
    chemistReason?: string;
    anyOtherFindings?: string;
    secondVisit?: boolean;
    secondVisitReason?: string;
    secondVisitObservation?: string;
    statementCollected?: boolean;
    statementCollectedDiscrepanciesFound?: boolean;
    statementCollectedDiscrepanciesFindings?: string;
    statementCollectedPEDNoted?: boolean;
    statementCollectedPEDFinidings?: string;
    statementCollectedPEDNotedPastDocumentsCollected?: boolean;
    statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify?: string;
    statementCollectedPEDNotedPastDocumentsCollectedReason?: string;
    statementCollectedReason?: string;
    boolStatusOfInsured?: boolean;
    reason?: string;
    alcoholHistory?: boolean;
    alcoholHistoryQuantity?: string;
    smokingHistory?: boolean;
    smokingHistoryQuantity?: string;
    anyOtherHabits?: string;
    kcyDocument?: boolean;
    kcyDocumentsAnyDiscrepancies?: string;
    kcyDocumentsReason?: string;

    // Medical Management fields
    isActiveMedicalManagementLOTGiven?: string;
    medicalManagementJustification?: string;
    medicalManagementIsHospitalization?: string;
    medicalManagementFindings?: string;
    medicalManagementObsevations?: string;

    // Surgical Management fields
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

    // RTA Accidental fields
    rtaFIRCopyReceived?: boolean;
    rtaDateOfFIR?: any;
    rtaFIRObservations?: string;
    rtaFIRVerification?: string;
    rtaFIRVerificationFinding?: string;
    rtaFIRVerificationReason?: string;
    rtaFIRReason?: string;
    rtaMLCCopyreceived?: boolean;
    rtaDateOfMLC?: any;
    rtaMLCObservations?: string;
    rtaMLCVerification?: string;
    rtaMLCVerificationFinding?: string;
    rtaMLCVerificationReason?: string;
    rtaMLCReason?: string;
    rtaAlcoholIntoxicationNoted?: boolean;
    rtaAlcoholFindings?: string;
    rtaLineOfTreatment?: string;

    // RTA Medical
    rtaMedicalIsActive?: string;
    rtaMedicalJustification?: string;
    rtaMedicalIsHospitalization?: string;
    rtaMedicalFindings?: string;
    rtaMedicalObsevations?: string;

    // RTA Surgical
    rtaSurgicalProcedureCarriedOut?: string;
    rtaSurgicalOperative?: string;
    rtaSurgicalOperativeFindings?: string;
    rtaSurgicalOperativeReason?: string;
    rtaSurgicalAnaesthesia?: string;
    rtaSurgicalAnaesthesiaFindings?: string;
    rtaSurgicalAnaesthesiaReason?: string;
    rtaSurgicalAnyImplantUsed?: string;
    rtaSurgicalInvoiceVerified?: string;
}


export interface MedicalManagementData {
    isActiveMedicalManagementLOTGiven: string;
    medicalManagementIsHospitalization: string;
    medicalManagementObsevations: string;
    medicalManagementJustification: string;
    medicalManagementFindings: string;
}
// ===========================
// SERVICES
// ===========================
const caseUpdateService = {
    addCaseUpdate: async (model: CaseUpdateModel, investigationId: string) => {
        const response = await fetch(`/api/case-update/${investigationId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(model)
        });
        if (!response.ok) throw new Error('Failed to save case update');
        return response.json();
    }
};

// Case Update Service (for child components like Medical/Surgical Management)
export const caseupdatePrimaryService = {
    store: {} as Record<string, any>,

    getCaseUpdateVal: (key: string) => {
        return caseupdatePrimaryService.store[key];
    },

    setCaseUpdateVal: (key: string, value: any) => {
        caseupdatePrimaryService.store[key] = value;
    }
};

const alertService = {
    showAlertSuccess: (message: string) => {
        alert(message); // Replace with your toast/snackbar
    }
};

const message = {
    primaryDataSaved: 'Primary data submitted successfully'
};

// Component continues in Part 2...

// ================================================================
// PRIMARY DATA COMPONENT - PART 2: STATE MANAGEMENT
// ================================================================

const PrimaryData: React.FC<PrimaryDataProps> = ({
    isPresent,
    reasonVal,
    previuosData = '',
    isFormEditable,
    onNextPage
}) => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const [loading, setLoading] = useState(false);

    // ===========================
    // BASIC FORM FIELDS STATE
    // ===========================
    const [roomCategory, setRoomCategory] = useState('');
    const [roomRent, setRoomRent] = useState('');
    const [doa, setDoa] = useState<any>(null);
    const [dod, setDod] = useState<any>(null);
    const [diagnosis, setDiagnosis] = useState('');

    // ===========================
    // IPD REGISTRY ENTRY STATE
    // ===========================
    const [ipdRegistryEntryValue, setIpdRegistryEntryValue] = useState('');
    const [discrepancyCheckValue, setDiscrepancyCheckValue] = useState(false);
    const [discrepancyCheckValueRadio, setDiscrepancyCheckValueRadio] = useState('');
    const [iPDRegisterDiscrepancyObservations, setIPDRegisterDiscrepancyObservations] = useState('');

    // ===========================
    // TREATING DOCTOR STATE
    // ===========================
    const [treatingDoctorValue, setTreatingDoctorValue] = useState('');
    const [treatingDoctorPedNotedCheckValue, setTreatingDoctorPedNotedCheckValue] = useState(false);
    const [treatingDoctorPedNotedCheckValueRadio, setTreatingDoctorPedNotedCheckValueRadio] = useState('');
    const [treatingDoctorPedFindings, setTreatingDoctorPedFindings] = useState('');
    const [treatingDoctorDiscrepancyCheckValue, setTreatingDoctorDiscrepancyCheckValue] = useState(false);
    const [treatingDoctorDiscrepancyCheckValueRadio, setTreatingDoctorDiscrepancyCheckValueRadio] = useState('');
    const [treatingDoctorObservation, setTreatingDoctorObservation] = useState('');
    const [treatingDoctorReason, setTreatingDoctorReason] = useState('');

    // ===========================
    // IPD COLLECTED STATE
    // ===========================
    const [ipdCollectedValue, setIpdCollectedValue] = useState('');
    const [pedNotedCheckValue, setPedNotedCheckValue] = useState(false);
    const [pedNotedCheckValueRadio, setPedNotedCheckValueRadio] = useState('');
    const [iPDCollectedPEDNotedFindings, setIPDCollectedPEDNotedFindings] = useState('');
    const [discrepancyNotPedNotedCheckValue, setDiscrepancyNotPedNotedCheckValue] = useState(false);
    const [discrepancyNotPedNotedCheckValueRadio, setDiscrepancyNotPedNotedCheckValueRadio] = useState('');
    const [iPDCollectedDiscrepancyPEDObservations, setIPDCollectedDiscrepancyPEDObservations] = useState('');
    const [iPDCollectedReason, setIPDCollectedReason] = useState('');

    // ===========================
    // LINE OF TREATMENT STATE
    // ===========================
    const [lineOfTreatmentValue, setLineOfTreatmentValue] = useState('');

    // ===========================
    // PAST RECORDS MRD STATE
    // ===========================
    const [pastRecordCheckedValue, setPastRecordCheckedValue] = useState('');
    const [pastTreatmentHosNotedValue, setPastTreatmentHosNotedValue] = useState(false);
    const [pastTreatmentHosNotedValueRadio, setPastTreatmentHosNotedValueRadio] = useState('');
    const [pastRecordsCheckedMRDHospitalizationNoted, setPastRecordsCheckedMRDHospitalizationNoted] = useState('');
    const [pastRecordsCheckedMRDNOT, setPastRecordsCheckedMRDNOT] = useState(false);
    const [pastRecordsCheckedMRDReason, setPastRecordsCheckedMRDReason] = useState('');

    // ===========================
    // LAB REPORT STATE
    // ===========================
    const [labReportCheckValue, setLabReportCheckValue] = useState(false);
    const [labReportCheckValueRadio, setLabReportCheckValueRadio] = useState('');
    const [labReportObservations, setLabReportObservations] = useState('');
    const [labReportReason, setLabReportReason] = useState('');

    // ===========================
    // OTHER DOCUMENTS STATE (for Not Present cases)
    // ===========================
    const [copyOfDischargeCardCollected, setCopyOfDischargeCardCollected] = useState(false);
    const [copyOfFinalBillCollected, setCopyOfFinalBillCollected] = useState(false);
    const [insuredVisit, setInsuredVisit] = useState(false);
    const [insuredVisitReason, setInsuredVisitReason] = useState('');

    // ===========================
    // CHEMIST STATE
    // ===========================
    const [chemistValue, setChemistValue] = useState(false);
    const [chemistValueRadio, setChemistValueRadio] = useState('');
    const [chemistObservations, setChemistObservations] = useState('');
    const [chemistReason, setChemistReason] = useState('');

    // ===========================
    // OTHER FINDINGS & SECOND VISIT STATE
    // ===========================
    const [anyOtherFindings, setAnyOtherFindings] = useState('');
    const [secondVisitValue, setSecondVisitValue] = useState('');
    const [secondVisitReason, setSecondVisitReason] = useState('');
    const [secondVisitObservation, setSecondVisitObservation] = useState('');

    // ===========================
    // STATEMENT COLLECTED STATE
    // ===========================
    const [statementCollectedValue, setStatementCollectedValue] = useState('');
    const [discrepancyFoundValue, setDiscrepancyFoundValue] = useState(false);
    const [discrepancyFoundValueRadio, setDiscrepancyFoundValueRadio] = useState('');
    const [statementCollectedDiscrepanciesFindings, setStatementCollectedDiscrepanciesFindings] = useState('');
    const [pedNotedValue, setPedNotedValue] = useState(false);
    const [pedNotedValueRadio, setPedNotedValueRadio] = useState('');
    const [statementCollectedPEDFindings, setStatementCollectedPEDFindings] = useState('');
    const [pastDocsCollectedValue, setPastDocsCollectedValue] = useState('');
    const [statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify, setStatementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify] = useState('');
    const [statementCollectedPEDNotedPastDocumentsCollectedReason, setStatementCollectedPEDNotedPastDocumentsCollectedReason] = useState('');
    const [statementCollectedReason, setStatementCollectedReason] = useState('');

    // ===========================
    // INSURED HABITS STATE
    // ===========================
    const [alcoholHistory, setAlcoholHistory] = useState(false);
    const [alcoholHistoryQuantity, setAlcoholHistoryQuantity] = useState('');
    const [smokingHistory, setSmokingHistory] = useState(false);
    const [smokingHistoryQuantity, setSmokingHistoryQuantity] = useState('');
    const [anyOtherHabits, setAnyOtherHabits] = useState('');

    // ===========================
    // KYC DOCUMENTS STATE
    // ===========================
    const [kcyDocument, setKcyDocument] = useState(false);
    const [kcyDocumentsAnyDiscrepancies, setKcyDocumentsAnyDiscrepancies] = useState('');
    const [kcyDocumentsReason, setKcyDocumentsReason] = useState('');


    const [formDataMedicalManagement, setFormDataMedicalManagement] = useState<MedicalManagementData>({
        isActiveMedicalManagementLOTGiven: '',
        medicalManagementIsHospitalization: '',
        medicalManagementObsevations: '',
        medicalManagementJustification: '',
        medicalManagementFindings: '',
    });

    // Load previous data on mount
    useEffect(() => {
        if (previuosData) {
            setFormDataMedicalManagement({
                isActiveMedicalManagementLOTGiven:
                    previuosData.isActiveMedicalManagementLOTGiven || '',
                medicalManagementIsHospitalization:
                    previuosData.medicalManagementIsHospitalization || '',
                medicalManagementObsevations: previuosData.medicalManagementObsevations || '',
                medicalManagementJustification: previuosData.medicalManagementJustification || '',
                medicalManagementFindings: previuosData.medicalManagementFindings || '',
            });
        }
    }, [previuosData]);

    const handleChangeMedicalManagement = (field: keyof MedicalManagementData, value: string) => {
        setFormDataMedicalManagement((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    
    const handleChangeRTAAccidental = (field: string, value: any) => {
        // Handle RTA Accidental form data changes
        caseupdatePrimaryService.setCaseUpdateVal(field, value);
    };

    // Data loading logic will be in Part 3...
    // ================================================================
    // PRIMARY DATA COMPONENT - PART 3: DATA LOADING
    // ================================================================

    // ===========================
    // LOAD PREVIOUS DATA
    // ===========================
    useEffect(() => {
        if (!previuosData) return;

        // Basic Fields
        setRoomCategory(previuosData.roomCategory || '');
        setRoomRent(previuosData.roomRent || '');
        setDiagnosis(previuosData.diagnosis || '');

        if (previuosData.doa) {
            setDoa(moment(previuosData.doa));
        }
        if (previuosData.expectedDateOfDischarge) {
            setDod(moment(previuosData.expectedDateOfDischarge));
        }

        // IPD Registry Entry
        setIpdRegistryEntryValue(previuosData.iPDRegisterEntryFound || '');
        setIPDRegisterDiscrepancyObservations(previuosData.iPDRegisterDiscrepancyObservations || '');

        if (previuosData.ipdRegisterDiscrepancyNoted === true) {
            setDiscrepancyCheckValue(true);
            setDiscrepancyCheckValueRadio('1');
        } else if (previuosData.ipdRegisterDiscrepancyNoted === false) {
            setDiscrepancyCheckValue(false);
            setDiscrepancyCheckValueRadio('0');
        }

        // Treating Doctor
        setTreatingDoctorValue(previuosData.treatingDoctorVisit || '');
        setTreatingDoctorPedFindings(previuosData.treatingDoctorVisitPEDNotedFindings || '');
        setTreatingDoctorObservation(previuosData.treatingDoctorVisitPEDObservations || '');
        setTreatingDoctorReason(previuosData.treatingDoctorVisitReason || '');

        if (previuosData.treatingDoctorVisitPEDNoted === true) {
            setTreatingDoctorPedNotedCheckValue(true);
            setTreatingDoctorPedNotedCheckValueRadio('1');
        } else if (previuosData.treatingDoctorVisitPEDNoted === false) {
            setTreatingDoctorPedNotedCheckValue(false);
            setTreatingDoctorPedNotedCheckValueRadio('0');
        }

        if (previuosData.treatingDoctorVisitDiscrepancyPED === true) {
            setTreatingDoctorDiscrepancyCheckValue(true);
            setTreatingDoctorDiscrepancyCheckValueRadio('1');
        } else if (previuosData.treatingDoctorVisitDiscrepancyPED === false) {
            setTreatingDoctorDiscrepancyCheckValue(false);
            setTreatingDoctorDiscrepancyCheckValueRadio('0');
        }

        // IPD Collected
        setIpdCollectedValue(previuosData.ipdCollected || '');
        setIPDCollectedPEDNotedFindings(previuosData.iPDCollectedPEDNotedFindings || '');
        setIPDCollectedDiscrepancyPEDObservations(previuosData.iPDCollectedDiscrepancyPEDObservations || '');
        setIPDCollectedReason(previuosData.iPDCollectedReason || '');

        if (previuosData.ipdCollectedPEDNoted === true) {
            setPedNotedCheckValue(true);
            setPedNotedCheckValueRadio('1');
        } else if (previuosData.ipdCollectedPEDNoted === false) {
            setPedNotedCheckValue(false);
            setPedNotedCheckValueRadio('0');
        }

        if (previuosData.ipdCollectedDiscrepancyPED === true) {
            setDiscrepancyNotPedNotedCheckValue(true);
            setDiscrepancyNotPedNotedCheckValueRadio('1');
        } else if (previuosData.ipdCollectedDiscrepancyPED === false) {
            setDiscrepancyNotPedNotedCheckValue(false);
            setDiscrepancyNotPedNotedCheckValueRadio('0');
        }

        // Line of Treatment
        setLineOfTreatmentValue(previuosData.lineOfTreatment || '');

        // Past Records MRD
        setPastRecordCheckedValue(previuosData.pastRecordsCheckedMRD || '');
        setPastRecordsCheckedMRDHospitalizationNoted(previuosData.pastRecordsCheckedMRDHospitalizationNoted || '');
        setPastRecordsCheckedMRDNOT(previuosData.pastRecordsCheckedMRDNOT || false);
        setPastRecordsCheckedMRDReason(previuosData.pastRecordsCheckedMRDReason || '');

        if (previuosData.pastRecordsCheckedMRDPastTreatment === true) {
            setPastTreatmentHosNotedValue(true);
            setPastTreatmentHosNotedValueRadio('1');
        } else if (previuosData.pastRecordsCheckedMRDPastTreatment === false) {
            setPastTreatmentHosNotedValue(false);
            setPastTreatmentHosNotedValueRadio('0');
        }

        // Lab Report
        setLabReportObservations(previuosData.labReportObservations || '');
        setLabReportReason(previuosData.labReportReason || '');

        if (previuosData.labReportVerified === true) {
            setLabReportCheckValue(true);
            setLabReportCheckValueRadio('1');
        } else if (previuosData.labReportVerified === false) {
            setLabReportCheckValue(false);
            setLabReportCheckValueRadio('0');
        }

        // Other Documents (Not Present cases)
        setCopyOfDischargeCardCollected(previuosData.copyOfDischargeCardCollected || false);
        setCopyOfFinalBillCollected(previuosData.copyOfFinalBillCollected || false);
        setInsuredVisit(previuosData.insuredVisit || false);
        setInsuredVisitReason(previuosData.insuredVisitReason || '');

        // Chemist
        setChemistObservations(previuosData.chemistObservations || '');
        setChemistReason(previuosData.chemistReason || '');

        if (previuosData.chemist === true) {
            setChemistValue(true);
            setChemistValueRadio('1');
        } else if (previuosData.chemist === false) {
            setChemistValue(false);
            setChemistValueRadio('0');
        }

        // Other Findings & Second Visit
        setAnyOtherFindings(previuosData.anyOtherFindings || '');
        setSecondVisitReason(previuosData.secondVisitReason || '');
        setSecondVisitObservation(previuosData.secondVisitObservation || '');

        if (previuosData.secondVisit === true) {
            setSecondVisitValue('1');
        } else if (previuosData.secondVisit === false) {
            setSecondVisitValue('0');
        }

        // Statement Collected
        setStatementCollectedDiscrepanciesFindings(previuosData.statementCollectedDiscrepanciesFindings || '');
        setStatementCollectedPEDFindings(previuosData.statementCollectedPEDFinidings || '');
        setStatementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify(
            previuosData.statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify || ''
        );
        setStatementCollectedPEDNotedPastDocumentsCollectedReason(
            previuosData.statementCollectedPEDNotedPastDocumentsCollectedReason || ''
        );
        setStatementCollectedReason(previuosData.statementCollectedReason || '');

        if (previuosData.statementCollected === true) {
            setStatementCollectedValue('1');
        } else if (previuosData.statementCollected === false) {
            setStatementCollectedValue('0');
        }

        if (previuosData.statementCollectedPEDNotedPastDocumentsCollected === true) {
            setPastDocsCollectedValue('1');
        } else if (previuosData.statementCollectedPEDNotedPastDocumentsCollected === false) {
            setPastDocsCollectedValue('0');
        }

        if (previuosData.statementCollectedDiscrepanciesFound === true) {
            setDiscrepancyFoundValue(true);
            setDiscrepancyFoundValueRadio('1');
        } else if (previuosData.statementCollectedDiscrepanciesFound === false) {
            setDiscrepancyFoundValue(false);
            setDiscrepancyFoundValueRadio('0');
        }

        if (previuosData.statementCollectedPEDNoted === true) {
            setPedNotedValue(true);
            setPedNotedValueRadio('1');
        } else if (previuosData.statementCollectedPEDNoted === false) {
            setPedNotedValue(false);
            setPedNotedValueRadio('0');
        }

        // Habits
        setAlcoholHistory(previuosData.alcoholHistory || false);
        setAlcoholHistoryQuantity(previuosData.alcoholHistoryQuantity || '');
        setSmokingHistory(previuosData.smokingHistory || false);
        setSmokingHistoryQuantity(previuosData.smokingHistoryQuantity || '');
        setAnyOtherHabits(previuosData.anyOtherHabits || '');

        // KYC Documents
        setKcyDocument(previuosData.kcyDocument || false);

        if (previuosData.kcyDocument === true) {
            setKcyDocumentsAnyDiscrepancies(previuosData.kcyDocumentsAnyDiscrepancies || '');
        } else if (previuosData.kcyDocument === false) {
            setKcyDocumentsReason(previuosData.kcyDocumentsReason || '');
        }
    }, [previuosData]);

    // Event handlers will be in Part 4...

    // ================================================================
    // PRIMARY DATA COMPONENT - PART 4: EVENT HANDLERS & SUBMIT
    // ================================================================

    // ===========================
    // RADIO BUTTON CHANGE HANDLERS
    // ===========================
    const handleDiscrepancyChange = (value: string) => {
        if (value === '1') {
            setDiscrepancyCheckValue(true);
        } else if (value === '0') {
            setDiscrepancyCheckValue(false);
        }
    };

    const handlePedNotedChange = (value: string) => {
        if (value === '1') {
            setPedNotedCheckValue(true);
        } else if (value === '0') {
            setPedNotedCheckValue(false);
        }
    };

    const handleTreatingDoctorPedNotedChange = (value: string) => {
        if (value === '1') {
            setTreatingDoctorPedNotedCheckValue(true);
        } else if (value === '0') {
            setTreatingDoctorPedNotedCheckValue(false);
        }
    };

    const handleDiscrepancyNotPedChange = (value: string) => {
        if (value === '1') {
            setDiscrepancyNotPedNotedCheckValue(true);
        } else if (value === '0') {
            setDiscrepancyNotPedNotedCheckValue(false);
        }
    };

    const handleTreatingDoctorDiscrepancyChange = (value: string) => {
        if (value === '1') {
            setTreatingDoctorDiscrepancyCheckValue(true);
        } else if (value === '0') {
            setTreatingDoctorDiscrepancyCheckValue(false);
        }
    };

    const handlePastTreatmentChange = (value: string) => {
        if (value === '1') {
            setPastTreatmentHosNotedValue(true);
        } else if (value === '0') {
            setPastTreatmentHosNotedValue(false);
        }
    };

    const handleLabReportChange = (value: string) => {
        if (value === '1') {
            setLabReportCheckValue(true);
        } else if (value === '0') {
            setLabReportCheckValue(false);
        }
    };

    const handleChemistChange = (value: string) => {
        if (value === '1') {
            setChemistValue(true);
        } else if (value === '0') {
            setChemistValue(false);
        }
    };

    const handleDiscrepancyFoundChange = (value: string) => {
        if (value === '1') {
            setDiscrepancyFoundValue(true);
        } else if (value === '0') {
            setDiscrepancyFoundValue(false);
        }
    };

    const handlePedNotedStatementChange = (value: string) => {
        if (value === '1') {
            setPedNotedValue(true);
        } else if (value === '0') {
            setPedNotedValue(false);
        }
    };

    // ===========================
    // SUBMIT HANDLER (Building the Complex Payload)
    // ===========================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const caseUpdateModel: CaseUpdateModel = {
            roomCategory,
            roomRent,
            doa,
            expectedDateOfDischarge: dod,
            diagnosis,
            pastRecordsCheckedMRDNOT,
            pastRecordsCheckedMRDReason,
            copyOfDischargeCardCollected,
            copyOfFinalBillCollected,
            insuredVisit,
            insuredVisitReason,
            boolStatusOfInsured: isPresent
        };

        // IPD Registry Entry
        caseUpdateModel.iPDRegisterEntryFound = ipdRegistryEntryValue;
        if (ipdRegistryEntryValue === 'yes') {
            caseUpdateModel.ipdRegisterDiscrepancyNoted = discrepancyCheckValue;
            if (discrepancyCheckValue) {
                caseUpdateModel.iPDRegisterDiscrepancyObservations = iPDRegisterDiscrepancyObservations;
            }
        } else if (ipdRegistryEntryValue === 'no') {
            caseUpdateModel.iPDRegisterDiscrepancyObservations = iPDRegisterDiscrepancyObservations;
        }

        // Treating Doctor Visit
        caseUpdateModel.treatingDoctorVisit = treatingDoctorValue;
        if (treatingDoctorValue === 'statementcollected') {
            caseUpdateModel.treatingDoctorVisitPEDNoted = treatingDoctorPedNotedCheckValue;
            if (treatingDoctorPedNotedCheckValue) {
                caseUpdateModel.treatingDoctorVisitPEDNotedFindings = treatingDoctorPedFindings;
                caseUpdateModel.treatingDoctorVisitDiscrepancyPED = treatingDoctorDiscrepancyCheckValue;
                if (treatingDoctorDiscrepancyCheckValue) {
                    caseUpdateModel.treatingDoctorVisitPEDObservations = treatingDoctorObservation;
                }
            }
        } else if (treatingDoctorValue === 'statementnotcollected') {
            caseUpdateModel.treatingDoctorVisitReason = treatingDoctorReason;
        }

        // IPD Collected
        caseUpdateModel.ipdCollected = ipdCollectedValue;
        if (ipdCollectedValue === 'yes') {
            caseUpdateModel.ipdCollectedPEDNoted = pedNotedCheckValue;
            if (pedNotedCheckValue) {
                caseUpdateModel.iPDCollectedPEDNotedFindings = iPDCollectedPEDNotedFindings;
                caseUpdateModel.ipdCollectedDiscrepancyPED = discrepancyNotPedNotedCheckValue;
                if (discrepancyNotPedNotedCheckValue) {
                    caseUpdateModel.iPDCollectedDiscrepancyPEDObservations = iPDCollectedDiscrepancyPEDObservations;
                }
            }
        } else if (ipdCollectedValue === 'no') {
            caseUpdateModel.iPDCollectedReason = iPDCollectedReason;
        }

        // Past Records MRD
        caseUpdateModel.pastRecordsCheckedMRD = pastRecordCheckedValue;
        if (pastRecordCheckedValue === 'yes') {
            caseUpdateModel.pastRecordsCheckedMRDPastTreatment = pastTreatmentHosNotedValue || false;
            if (pastTreatmentHosNotedValue) {
                caseUpdateModel.pastRecordsCheckedMRDHospitalizationNoted = pastRecordsCheckedMRDHospitalizationNoted;
            }
        }

        // Lab Report
        caseUpdateModel.labReportVerified = labReportCheckValue;
        if (labReportCheckValue) {
            caseUpdateModel.labReportObservations = labReportObservations;
        } else {
            caseUpdateModel.labReportReason = labReportReason;
        }

        // Chemist
        caseUpdateModel.chemist = chemistValue;
        if (chemistValue) {
            caseUpdateModel.chemistObservations = chemistObservations;
        } else {
            caseUpdateModel.chemistReason = chemistReason;
        }

        caseUpdateModel.anyOtherFindings = anyOtherFindings;

        // Second Visit
        if (secondVisitValue === '1') {
            caseUpdateModel.secondVisit = true;
            caseUpdateModel.secondVisitObservation = secondVisitObservation;
            caseUpdateModel.secondVisitReason = secondVisitReason;
        } else if (secondVisitValue === '0') {
            caseUpdateModel.secondVisit = false;
        }

        // Statement Collected
        if (statementCollectedValue === '1') {
            caseUpdateModel.statementCollected = true;
            caseUpdateModel.statementCollectedDiscrepanciesFound = discrepancyFoundValue;
            if (discrepancyFoundValue) {
                caseUpdateModel.statementCollectedDiscrepanciesFindings = statementCollectedDiscrepanciesFindings;
            }
            caseUpdateModel.statementCollectedPEDNoted = pedNotedValue;
            if (pedNotedValue) {
                caseUpdateModel.statementCollectedPEDFinidings = statementCollectedPEDFindings;
                if (pastDocsCollectedValue === '1') {
                    caseUpdateModel.statementCollectedPEDNotedPastDocumentsCollected = true;
                    caseUpdateModel.statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify =
                        statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify;
                } else if (pastDocsCollectedValue === '0') {
                    caseUpdateModel.statementCollectedPEDNotedPastDocumentsCollected = false;
                    caseUpdateModel.statementCollectedPEDNotedPastDocumentsCollectedReason =
                        statementCollectedPEDNotedPastDocumentsCollectedReason;
                }
            }
        } else if (statementCollectedValue === '0') {
            caseUpdateModel.statementCollected = false;
            caseUpdateModel.statementCollectedReason = statementCollectedReason;
        }

        // Line of Treatment (Get from child components via service)
        caseUpdateModel.lineOfTreatment = lineOfTreatmentValue;

        // Medical Management data (from child component)
        if (lineOfTreatmentValue === 'medicalmanagement') {
            caseUpdateModel.isActiveMedicalManagementLOTGiven = caseupdatePrimaryService.getCaseUpdateVal('isActiveMedicalManagementLOTGiven');
            if (caseUpdateModel.isActiveMedicalManagementLOTGiven === 'yes') {
                caseUpdateModel.medicalManagementJustification = caseupdatePrimaryService.getCaseUpdateVal('medicalManagementJustification');
            } else if (caseUpdateModel.isActiveMedicalManagementLOTGiven === 'no') {
                caseUpdateModel.medicalManagementIsHospitalization = caseupdatePrimaryService.getCaseUpdateVal('medicalManagementIsHospitalization');
                if (caseUpdateModel.medicalManagementIsHospitalization === 'yes') {
                    caseUpdateModel.medicalManagementFindings = caseupdatePrimaryService.getCaseUpdateVal('medicalManagementFindings');
                } else if (caseUpdateModel.medicalManagementIsHospitalization === 'no') {
                    caseUpdateModel.medicalManagementObsevations = caseupdatePrimaryService.getCaseUpdateVal('medicalManagementObsevations');
                }
            }
        }

        // Surgical Management data (from child component) - abbreviated for space
        if (lineOfTreatmentValue === 'surgicalmanagement') {
            // Similar structure as Medical Management
            // Get all surgical fields from caseupdatePrimaryService...
        }

        // RTA Accidental data (from child component) - abbreviated for space
        if (lineOfTreatmentValue === 'rtaaccidental') {
            // Similar structure
            // Get all RTA fields from caseupdatePrimaryService...
        }

        // Reason (for Not Present cases)
        if (!isPresent) {
            caseUpdateModel.reason = reasonVal;
        }

        // Habits
        caseUpdateModel.alcoholHistory = alcoholHistory;
        caseUpdateModel.smokingHistory = smokingHistory;
        if (alcoholHistory) {
            caseUpdateModel.alcoholHistoryQuantity = alcoholHistoryQuantity;
        }
        if (smokingHistory) {
            caseUpdateModel.smokingHistoryQuantity = smokingHistoryQuantity;
        }
        caseUpdateModel.anyOtherHabits = anyOtherHabits;

        // KYC Documents
        caseUpdateModel.kcyDocument = kcyDocument;
        if (kcyDocument) {
            caseUpdateModel.kcyDocumentsAnyDiscrepancies = kcyDocumentsAnyDiscrepancies;
        } else {
            caseUpdateModel.kcyDocumentsReason = kcyDocumentsReason;
        }

        try {
            const data = await caseUpdateService.addCaseUpdate(caseUpdateModel, investigationId!);
            if (data.payload && data.payload.activeCaseID) {
                localStorage.setItem('activeCaseID', data.payload.activeCaseID);
            }
            alertService.showAlertSuccess(message.primaryDataSaved);
            onNextPage(1); // Navigate to Hospital Feedback tab
        } catch (error) {
            console.error('Error saving case update:', error);
            alert('Failed to save case update');
        } finally {
            setLoading(false);
        }
    };

    // JSX rendering will be in Parts 5A and 5B...

    // 5. Now assemble the JSX return statement:

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <form onSubmit={handleSubmit}>
                {/* ==================== BASIC FIELDS (Full Width) ==================== */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <FormLabel>Room category*</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 10 }}>
                        <TextField
                            fullWidth
                            placeholder="Room Category"
                            value={roomCategory}
                            onChange={(e) => setRoomCategory(e.target.value)}
                            disabled={isFormEditable}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <FormLabel>Room Rent/Day*</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            placeholder="Room Rent/Day"
                            value={roomRent}
                            onChange={(e) => setRoomRent(e.target.value)}
                            disabled={isFormEditable}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }} sx={{ textAlign: { sm: 'right' } }}>
                        <FormLabel>DOA*</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <DatePicker
                            value={doa}
                            onChange={(newValue) => setDoa(newValue)}
                            disabled={isFormEditable}
                            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <FormLabel>
                            {reasonVal !== 'discharged' ? 'Expected Date of Discharge*' : 'Date of Discharge'}
                        </FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <DatePicker
                            value={dod}
                            onChange={(newValue) => setDod(newValue)}
                            disabled={isFormEditable}
                            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <FormLabel>Diagnosis*</FormLabel>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 10 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Enter Diagnosis"
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            disabled={isFormEditable}
                        />
                    </Grid>
                </Grid>

                {/* ==================== TWO COLUMN LAYOUT STARTS ==================== */}
                <Grid container spacing={3}>
                    {/* ==================== LEFT COLUMN ==================== */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        {/* IPD Register Entry Found */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>IPD Register Entry Found*</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <Select
                                    fullWidth
                                    value={ipdRegistryEntryValue}
                                    onChange={(e) => setIpdRegistryEntryValue(e.target.value)}
                                    disabled={isFormEditable}
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="yes">Yes</MenuItem>
                                    <MenuItem value="no">No</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>

                        {/* Discrepancy noted (if IPD Entry = Yes) */}
                        {ipdRegistryEntryValue === 'yes' && (
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Discrepancy noted*</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <RadioGroup
                                        row
                                        value={discrepancyCheckValueRadio}
                                        onChange={(e) => {
                                            setDiscrepancyCheckValueRadio(e.target.value);
                                            handleDiscrepancyChange(e.target.value);
                                        }}
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="0" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                        )}

                        {/* Observations (if IPD Entry = No OR Discrepancy = Yes) */}
                        {(ipdRegistryEntryValue === 'no' || discrepancyCheckValue) && (
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Observations*</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={iPDRegisterDiscrepancyObservations}
                                        onChange={(e) => setIPDRegisterDiscrepancyObservations(e.target.value)}
                                        disabled={isFormEditable}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        {/* Treating doctor Visit */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Treating doctor Visit</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <Select
                                    fullWidth
                                    value={treatingDoctorValue}
                                    onChange={(e) => setTreatingDoctorValue(e.target.value)}
                                    disabled={isFormEditable}
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="statementcollected">Statement collected</MenuItem>
                                    <MenuItem value="statementnotcollected">Statement not collected</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>

                        {/* Treating Doctor - Statement Not Collected Reason */}
                        {treatingDoctorValue === 'statementnotcollected' && (
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Reason</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={treatingDoctorReason}
                                        onChange={(e) => setTreatingDoctorReason(e.target.value)}
                                        disabled={isFormEditable}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        {/* Treating Doctor - Statement Collected - PED Section */}
                        {treatingDoctorValue === 'statementcollected' && (
                            <>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <FormLabel>PED Noted</FormLabel>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <RadioGroup
                                            row
                                            value={treatingDoctorPedNotedCheckValueRadio}
                                            onChange={(e) => {
                                                setTreatingDoctorPedNotedCheckValueRadio(e.target.value);
                                                handleTreatingDoctorPedNotedChange(e.target.value);
                                            }}
                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="0" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                </Grid>

                                {treatingDoctorPedNotedCheckValue && (
                                    <>
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <FormLabel>Findings</FormLabel>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 8 }}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    value={treatingDoctorPedFindings}
                                                    onChange={(e) => setTreatingDoctorPedFindings(e.target.value)}
                                                    disabled={isFormEditable}
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
                                                    value={treatingDoctorDiscrepancyCheckValueRadio}
                                                    onChange={(e) => {
                                                        setTreatingDoctorDiscrepancyCheckValueRadio(e.target.value);
                                                        handleTreatingDoctorDiscrepancyChange(e.target.value);
                                                    }}
                                                >
                                                    <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                                    <FormControlLabel value="0" control={<Radio />} label="No" />
                                                </RadioGroup>
                                            </Grid>
                                        </Grid>

                                        {treatingDoctorDiscrepancyCheckValue && (
                                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <FormLabel>Observations</FormLabel>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 8 }}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        value={treatingDoctorObservation}
                                                        onChange={(e) => setTreatingDoctorObservation(e.target.value)}
                                                        disabled={isFormEditable}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </Grid>

                    {/* RIGHT COLUMN CONTINUES IN PART 5B... */}

                    {/* ==================== RIGHT COLUMN ==================== */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        {/* IPDs Collected */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>IPDs Collected*</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <Select
                                    fullWidth
                                    value={ipdCollectedValue}
                                    onChange={(e) => setIpdCollectedValue(e.target.value)}
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="yes">Yes</MenuItem>
                                    <MenuItem value="no">No</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>

                        {/* IPD Collected = Yes */}
                        {ipdCollectedValue === 'yes' && (
                            <>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <FormLabel>PED noted</FormLabel>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <RadioGroup
                                            row
                                            value={pedNotedCheckValueRadio}
                                            onChange={(e) => {
                                                setPedNotedCheckValueRadio(e.target.value);
                                                handlePedNotedChange(e.target.value);
                                            }}
                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="0" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                </Grid>

                                {pedNotedCheckValue && (
                                    <>
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <FormLabel>Findings*</FormLabel>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 8 }}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    value={iPDCollectedPEDNotedFindings}
                                                    onChange={(e) => setIPDCollectedPEDNotedFindings(e.target.value)}
                                                    disabled={isFormEditable}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <FormLabel>Discrepancy noted other than PED*</FormLabel>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 8 }}>
                                                <RadioGroup
                                                    row
                                                    value={discrepancyNotPedNotedCheckValueRadio}
                                                    onChange={(e) => {
                                                        setDiscrepancyNotPedNotedCheckValueRadio(e.target.value);
                                                        handleDiscrepancyNotPedChange(e.target.value);
                                                    }}
                                                >
                                                    <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                                    <FormControlLabel value="0" control={<Radio />} label="No" />
                                                </RadioGroup>
                                            </Grid>
                                        </Grid>

                                        {discrepancyNotPedNotedCheckValue && (
                                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <FormLabel>Observations*</FormLabel>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 8 }}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        value={iPDCollectedDiscrepancyPEDObservations}
                                                        onChange={(e) => setIPDCollectedDiscrepancyPEDObservations(e.target.value)}
                                                        disabled={isFormEditable}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {/* IPD Collected = No */}
                        {ipdCollectedValue === 'no' && (
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Reason</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={iPDCollectedReason}
                                        onChange={(e) => setIPDCollectedReason(e.target.value)}
                                        disabled={isFormEditable}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                {/* ==================== LINE OF TREATMENT + PAST RECORDS (Two Columns) ==================== */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {/* LEFT: Line of Treatment */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Line of Treatment*</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <Select
                                    fullWidth
                                    value={lineOfTreatmentValue}
                                    onChange={(e) => setLineOfTreatmentValue(e.target.value)}
                                // disabled={isFormEditable}
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="medicalmanagement">Medical Management</MenuItem>
                                    <MenuItem value="surgicalmanagement">Surgical Management (Non Accidental)</MenuItem>
                                    <MenuItem value="rtaaccidental">RTA Accidental Case</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>

                        {/* Medical Management Component */}
                        {lineOfTreatmentValue === 'medicalmanagement' && (
                            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                                <MedicalManagement formDataMedicalManagement={formDataMedicalManagement} handleChangeMedicalManagement={handleChangeMedicalManagement} />
                            </Box>
                        )}

                        {/* Surgical Management Component */}
                        {lineOfTreatmentValue === 'surgicalmanagement' && (
                            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                                <SurgicalManagementSec previuosData={previuosData} />
                            </Box>
                        )}

                        {/* RTA Accidental Component */}
                        {lineOfTreatmentValue === 'rtaaccidental' && (
                            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                                <RtaAccidental previousData={previuosData} handleChangeRTAAccidental={handleChangeRTAAccidental}/>
                            </Box>
                        )}
                    </Grid>

                    {/* RIGHT: Past Records, Lab Reports, etc. - CONTINUES IN PART 5C */}
                </Grid>

                {/* Part 5C will have: Past Records MRD, Lab Report, Chemist, Second Visit */}
                {/* Part 5D will have: Statement Collected, Habits, KYC, Submit Button */}


                {/* RIGHT: Past Records MRD, Lab Reports, Chemist, Second Visit */}
                <Grid size={{ xs: 12, md: 6 }}>
                    {/* Past Records checked with MRD? */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormLabel>Past Records checked with MRD?</FormLabel>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Select
                                fullWidth
                                value={pastRecordCheckedValue}
                                onChange={(e) => setPastRecordCheckedValue(e.target.value)}
                                disabled={isFormEditable}
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="yes">Yes</MenuItem>
                                <MenuItem value="no">No</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>

                    {/* Past Records = Yes */}
                    {pastRecordCheckedValue === 'yes' && (
                        <>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Past Treatment / Hospitalization Noted</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <RadioGroup
                                        row
                                        value={pastTreatmentHosNotedValueRadio}
                                        onChange={(e) => {
                                            setPastTreatmentHosNotedValueRadio(e.target.value);
                                            handlePastTreatmentChange(e.target.value);
                                        }}
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="0" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>

                            {pastTreatmentHosNotedValue && (
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        {/* Empty label space */}
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="Enter details"
                                            value={pastRecordsCheckedMRDHospitalizationNoted}
                                            onChange={(e) => setPastRecordsCheckedMRDHospitalizationNoted(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </>
                    )}

                    {/* Past Records = No */}
                    {pastRecordCheckedValue === 'no' && (
                        <>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}></Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <RadioGroup
                                        row
                                        value={pastRecordsCheckedMRDNOT}
                                        onChange={(e) => setPastRecordsCheckedMRDNOT(e.target.value === 'true')}
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label="Not Required" />
                                        <FormControlLabel value="false" control={<Radio />} label="Not Allowed" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>

                            {pastRecordsCheckedMRDNOT === true && (
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <FormLabel>Reason</FormLabel>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            value={pastRecordsCheckedMRDReason}
                                            onChange={(e) => setPastRecordsCheckedMRDReason(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </>
                    )}

                    {/* Lab Report Verified */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormLabel>Lab Report Verified</FormLabel>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <RadioGroup
                                row
                                value={labReportCheckValueRadio}
                                onChange={(e) => {
                                    setLabReportCheckValueRadio(e.target.value);
                                    handleLabReportChange(e.target.value);
                                }}
                            >
                                <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                <FormControlLabel value="0" control={<Radio />} label="No" />
                            </RadioGroup>
                        </Grid>
                    </Grid>

                    {labReportCheckValue && (
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Observations</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={labReportObservations}
                                    onChange={(e) => setLabReportObservations(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {!labReportCheckValue && (
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Reason</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={labReportReason}
                                    onChange={(e) => setLabReportReason(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* Copy of Discharge Card Collected (Not Present only) */}
                    {!isPresent && (
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Copy of Discharge Card Collected</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <RadioGroup
                                    row
                                    value={copyOfDischargeCardCollected}
                                    onChange={(e) => setCopyOfDischargeCardCollected(e.target.value === 'true')}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    )}

                    {/* Copy of Final Bill Collected (Not Present only) */}
                    {!isPresent && (
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Copy of Final Bill Collected</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <RadioGroup
                                    row
                                    value={copyOfFinalBillCollected}
                                    onChange={(e) => setCopyOfFinalBillCollected(e.target.value === 'true')}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    )}

                    {/* Insured Visit (Not Present only) */}
                    {!isPresent && (
                        <>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Insured Visit</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <RadioGroup
                                        row
                                        value={insuredVisit}
                                        onChange={(e) => setInsuredVisit(e.target.value === 'true')}
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="false" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </Grid>
                            </Grid>

                            {insuredVisit === false && (
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <FormLabel>Reason</FormLabel>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            value={insuredVisitReason}
                                            onChange={(e) => setInsuredVisitReason(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                        </>
                    )}

                    {/* Chemist Verified */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormLabel>Chemist Verified</FormLabel>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <RadioGroup
                                row
                                value={chemistValueRadio}
                                onChange={(e) => {
                                    setChemistValueRadio(e.target.value);
                                    handleChemistChange(e.target.value);
                                }}
                            >
                                <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                <FormControlLabel value="0" control={<Radio />} label="No" />
                            </RadioGroup>
                        </Grid>
                    </Grid>

                    {chemistValue && (
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Observations</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={chemistObservations}
                                    onChange={(e) => setChemistObservations(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {!chemistValue && (
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Reason</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={chemistReason}
                                    onChange={(e) => setChemistReason(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* Any other findings */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormLabel>Any other findings</FormLabel>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={anyOtherFindings}
                                onChange={(e) => setAnyOtherFindings(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    {/* Second visit? */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormLabel>Second visit?</FormLabel>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8 }}>
                            <RadioGroup
                                row
                                value={secondVisitValue}
                                onChange={(e) => setSecondVisitValue(e.target.value)}
                            >
                                <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                <FormControlLabel value="0" control={<Radio />} label="No" />
                            </RadioGroup>
                        </Grid>
                    </Grid>

                    {secondVisitValue === '1' && (
                        <>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Reason</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={secondVisitReason}
                                        onChange={(e) => setSecondVisitReason(e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Observation</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={secondVisitObservation}
                                        onChange={(e) => setSecondVisitObservation(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Grid>

                {/* Part 5D will have: Statement Collected Section, Habits, KYC, Submit */}

                {/* ==================== STATEMENT COLLECTED + HABITS + KYC (Two Columns) ==================== */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {/* LEFT: Insured Visit - Statement Collected */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h6" sx={{ color: '#776BC5', fontWeight: 700, mb: 2 }}>
                            Insured Visit
                        </Typography>

                        {/* Statement collected? */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Statement collected?</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <RadioGroup
                                    row
                                    value={statementCollectedValue}
                                    onChange={(e) => setStatementCollectedValue(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="0" control={<Radio />} label="No" />
                                </RadioGroup>
                            </Grid>
                        </Grid>

                        {/* Statement Collected = Yes */}
                        {statementCollectedValue === '1' && (
                            <>
                                {/* Discrepancies found */}
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <FormLabel>Discrepancies found</FormLabel>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <RadioGroup
                                            row
                                            value={discrepancyFoundValueRadio}
                                            onChange={(e) => {
                                                setDiscrepancyFoundValueRadio(e.target.value);
                                                handleDiscrepancyFoundChange(e.target.value);
                                            }}
                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="0" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                </Grid>

                                {discrepancyFoundValue && (
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <FormLabel>Discrepancies Findings</FormLabel>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                value={statementCollectedDiscrepanciesFindings}
                                                onChange={(e) => setStatementCollectedDiscrepanciesFindings(e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                )}

                                {/* PED Noted */}
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <FormLabel>PED Noted</FormLabel>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <RadioGroup
                                            row
                                            value={pedNotedValueRadio}
                                            onChange={(e) => {
                                                setPedNotedValueRadio(e.target.value);
                                                handlePedNotedStatementChange(e.target.value);
                                            }}
                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="0" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </Grid>
                                </Grid>

                                {pedNotedValue && (
                                    <>
                                        {/* PED Findings */}
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <FormLabel>PED Findings</FormLabel>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 8 }}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    value={statementCollectedPEDFindings}
                                                    onChange={(e) => setStatementCollectedPEDFindings(e.target.value)}
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* Past Document collected? */}
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <FormLabel>Past Document collected?</FormLabel>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 8 }}>
                                                <RadioGroup
                                                    row
                                                    value={pastDocsCollectedValue}
                                                    onChange={(e) => setPastDocsCollectedValue(e.target.value)}
                                                >
                                                    <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                                    <FormControlLabel value="0" control={<Radio />} label="No" />
                                                </RadioGroup>
                                            </Grid>
                                        </Grid>

                                        {pastDocsCollectedValue === '1' && (
                                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <FormLabel>Please Specify</FormLabel>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 8 }}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        value={statementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify}
                                                        onChange={(e) =>
                                                            setStatementCollectedPEDNotedPastDocumentsCollectedPleaseSpecify(e.target.value)
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}

                                        {pastDocsCollectedValue === '0' && (
                                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <FormLabel>Reason</FormLabel>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 8 }}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        value={statementCollectedPEDNotedPastDocumentsCollectedReason}
                                                        onChange={(e) =>
                                                            setStatementCollectedPEDNotedPastDocumentsCollectedReason(e.target.value)
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {/* Statement Collected = No */}
                        {statementCollectedValue === '0' && (
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Reason</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={statementCollectedReason}
                                        onChange={(e) => setStatementCollectedReason(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Grid>

                    {/* RIGHT: Insured Habits + KYC */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        {/* Insured Habits Section */}
                        <Typography variant="h6" sx={{ color: '#776BC5', fontWeight: 700, mb: 2 }}>
                            Insured Habits
                        </Typography>

                        {/* Alcohol History */}
                        <Grid container spacing={2} sx={{ mb: 1 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Alcohol History</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <RadioGroup
                                    row
                                    value={alcoholHistory}
                                    onChange={(e) => setAlcoholHistory(e.target.value === 'true')}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </Grid>
                        </Grid>

                        {alcoholHistory && (
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}></Grid>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Quantity"
                                        value={alcoholHistoryQuantity}
                                        onChange={(e) => setAlcoholHistoryQuantity(e.target.value)}
                                        disabled={!alcoholHistory}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        {/* Smoking History */}
                        <Grid container spacing={2} sx={{ mb: 1 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>Smoking History</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <RadioGroup
                                    row
                                    value={smokingHistory}
                                    onChange={(e) => setSmokingHistory(e.target.value === 'true')}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </Grid>
                        </Grid>

                        {smokingHistory && (
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}></Grid>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Quantity"
                                        value={smokingHistoryQuantity}
                                        onChange={(e) => setSmokingHistoryQuantity(e.target.value)}
                                        disabled={!smokingHistory}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        {/* Any Other Habits */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 12, sm: 4 }}></Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={5}
                                    placeholder="Any Other Habits (if any)"
                                    value={anyOtherHabits}
                                    onChange={(e) => setAnyOtherHabits(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        {/* Insured KYC Section */}
                        <Typography variant="h6" sx={{ color: '#776BC5', fontWeight: 700, mb: 2 }}>
                            Insured KYC
                        </Typography>

                        {/* KYC Documents */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <FormLabel>KYC Documents</FormLabel>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <RadioGroup
                                    row
                                    value={kcyDocument}
                                    onChange={(e) => setKcyDocument(e.target.value === 'true')}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="Collected" />
                                    <FormControlLabel value="false" control={<Radio />} label="Not Collected" />
                                </RadioGroup>
                            </Grid>
                        </Grid>

                        {/* KYC Collected - Any Discrepancies */}
                        {kcyDocument === true && (
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Any Discrepancies</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        value={kcyDocumentsAnyDiscrepancies}
                                        onChange={(e) => setKcyDocumentsAnyDiscrepancies(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        {/* KYC Not Collected - Reason */}
                        {kcyDocument === false && (
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormLabel>Reason</FormLabel>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        value={kcyDocumentsReason}
                                        onChange={(e) => setKcyDocumentsReason(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                {/* ==================== SUBMIT BUTTON ==================== */}
                <Grid container sx={{ mt: 3 }}>
                    <Grid size={{ xs: 12, sm: 10 }} offset={{ sm: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
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
                    </Grid>
                </Grid>
            </form>
        </LocalizationProvider>
    );
};

export default PrimaryData;
