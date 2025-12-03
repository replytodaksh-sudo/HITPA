// ============================================================================
// PART 1 of 5: Imports, Interface, State Setup
// ============================================================================
// src/components/NotFoundInHospital/components/NfinStep1.tsx

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
    Paper,
} from '@mui/material';

interface NfinStep1Props {
    previousData?: any;
    onStepOneDataChange: (data: any) => void;
}

interface Step1FormData {
    // Basic fields
    reasonForNotPresent: string;

    // IPD Register section
    iPDRegisterEntryFound: string;
    iPDRegisterObservations: string;
    ipdRegisterDiscrepancyNoted: boolean | null;
    iPDRegisterDiscrepancyObservations: string;

    // IPD Collected section
    ipdCollected: string;
    iPDCollectedReason: string;
    ipdCollectedPEDNoted: boolean | null;
    iPDCollectedPEDNotedFindings: string;
    isIPDCollectedDiscrepancyPED: boolean | null;
    iPDCollectedDiscrepancyPEDObservations: string;

    // Treating Doctor section
    treatingDoctorVisit: string;
    treatingDoctorVisitReason: string;
    treatingDoctorVisitPEDNoted: boolean | null;
    treatingDoctorVisitPEDNotedFindings: string;
    treatingDoctorVisitDiscrepancyPED: boolean | null;
    treatingDoctorVisitPEDObservations: string;

    // Line of Treatment
    lineOfTreatment: string;

    // Medical Management
    isActiveMedicalManagementLOTGiven: string;
    medicalManagementJustification: string;
    medicalManagementIsHospitalization: string;
    medicalManagementObsevations: string;
    medicalManagementFindings: string;

    // Surgical Management
    surgicalManagementProcedureCarriedOut: string;
    surgicalManagementOperative: string;
    surgicalManagementOperativeFindings: string;
    surgicalManagementOperativeReason: string;
    surgicalManagementAnaesthesia: string;
    surgicalManagementAnaesthesiaFindings: string;
    surgicalManagementAnaesthesiaReason: string;
    surgicalManagementAnyImplantUsed: boolean | null;
    surgicalManagementInvoiceVerified: string;
    surgicalManagementInvoiceVerifiedStickerNumber: string;
    surgicalManagementInvoiceVerifiedManufacturer: string;
    surgicalManagementInvoiceVerifiedFinding: string;

    // RTA Section
    rtaFIRReason: string;
    rtaFIRCopyReceived: boolean | null;
    rtaDateOfFIR: string;
    rtaFIRObservations: string;
    rtaFIRVerification: string;
    rtaFIRVerificationFinding: string;
    rtaFIRVerificationReason: string;

    rtaMLCCopyreceived: boolean | null;
    rtaDateOfMLC: string;
    rtaMLCObservations: string;
    rtaMLCVerification: string;
    rtaMLCVerificationFinding: string;
    rtaMLCVerificationReason: string;
    rtaMLCReason: string;

    rtaAlcoholIntoxicationNoted: boolean | null;
    rtaAlcoholFindings: string;
    rtaLineOfTreatment: string;

    // RTA Medical
    rtaMedicalIsActive: string;
    rtaMedicalJustification: string;
    rtaMedicalIsHospitalization: string;
    rtaMedicalFindings: string;
    rtaMedicalObsevations: string;

    // RTA Surgical
    rtaSurgicalProcedureCarriedOut: string;
    rtaSurgicalOperative: string;
    rtaSurgicalOperativeFindings: string;
    rtaSurgicalOperativeReason: string;
    rtaSurgicalAnaesthesia: string;
    rtaSurgicalAnaesthesiaFindings: string;
    rtaSurgicalAnaesthesiaReason: string;
    rtaSurgicalAnyImplantUsed: boolean | null;
    rtaSurgicalInvoiceVerified: string;
}

const NfinStep1: React.FC<NfinStep1Props> = ({
    previousData,
    onStepOneDataChange,
}) => {
    const [formData, setFormData] = useState<Step1FormData>({
        reasonForNotPresent: '',
        iPDRegisterEntryFound: '',
        iPDRegisterObservations: '',
        ipdRegisterDiscrepancyNoted: null,
        iPDRegisterDiscrepancyObservations: '',
        ipdCollected: '',
        iPDCollectedReason: '',
        ipdCollectedPEDNoted: null,
        iPDCollectedPEDNotedFindings: '',
        isIPDCollectedDiscrepancyPED: null,
        iPDCollectedDiscrepancyPEDObservations: '',
        treatingDoctorVisit: '',
        treatingDoctorVisitReason: '',
        treatingDoctorVisitPEDNoted: null,
        treatingDoctorVisitPEDNotedFindings: '',
        treatingDoctorVisitDiscrepancyPED: null,
        treatingDoctorVisitPEDObservations: '',
        lineOfTreatment: '',
        isActiveMedicalManagementLOTGiven: '',
        medicalManagementJustification: '',
        medicalManagementIsHospitalization: '',
        medicalManagementObsevations: '',
        medicalManagementFindings: '',
        surgicalManagementProcedureCarriedOut: '',
        surgicalManagementOperative: '',
        surgicalManagementOperativeFindings: '',
        surgicalManagementOperativeReason: '',
        surgicalManagementAnaesthesia: '',
        surgicalManagementAnaesthesiaFindings: '',
        surgicalManagementAnaesthesiaReason: '',
        surgicalManagementAnyImplantUsed: null,
        surgicalManagementInvoiceVerified: '',
        surgicalManagementInvoiceVerifiedStickerNumber: '',
        surgicalManagementInvoiceVerifiedManufacturer: '',
        surgicalManagementInvoiceVerifiedFinding: '',
        rtaFIRReason: '',
        rtaFIRCopyReceived: null,
        rtaDateOfFIR: '',
        rtaFIRObservations: '',
        rtaFIRVerification: '',
        rtaFIRVerificationFinding: '',
        rtaFIRVerificationReason: '',
        rtaMLCCopyreceived: null,
        rtaDateOfMLC: '',
        rtaMLCObservations: '',
        rtaMLCVerification: '',
        rtaMLCVerificationFinding: '',
        rtaMLCVerificationReason: '',
        rtaMLCReason: '',
        rtaAlcoholIntoxicationNoted: null,
        rtaAlcoholFindings: '',
        rtaLineOfTreatment: '',
        rtaMedicalIsActive: '',
        rtaMedicalJustification: '',
        rtaMedicalIsHospitalization: '',
        rtaMedicalFindings: '',
        rtaMedicalObsevations: '',
        rtaSurgicalProcedureCarriedOut: '',
        rtaSurgicalOperative: '',
        rtaSurgicalOperativeFindings: '',
        rtaSurgicalOperativeReason: '',
        rtaSurgicalAnaesthesia: '',
        rtaSurgicalAnaesthesiaFindings: '',
        rtaSurgicalAnaesthesiaReason: '',
        rtaSurgicalAnyImplantUsed: null,
        rtaSurgicalInvoiceVerified: '',
    });

    // Load previous data
    useEffect(() => {
        if (previousData) {
            setFormData((prev) => ({
                ...prev,
                ...previousData,
                // Format dates if they exist
                rtaDateOfFIR: previousData.rtaDateOfFIR || '',
                rtaDateOfMLC: previousData.rtaDateOfMLC || '',
            }));
        }
    }, [previousData]);

    // Send data to parent on every change
    useEffect(() => {
        onStepOneDataChange(formData);
    }, [formData, onStepOneDataChange]);

    const handleChange = (field: keyof Step1FormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // ============================================================================
    // END OF PART 1
    // Next: Part 2 will contain the LEFT COLUMN render (IPD & Doctor sections)
    // ============================================================================
    // ============================================================================
    // PART 5 of 5: RTA SURGICAL MANAGEMENT + CLOSING TAGS
    // ============================================================================
    // This goes AFTER Part 4 in the same file

    return (
        <Box component="section" sx={{ p: 2 }}>
            <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* ==================== LEFT COLUMN ==================== */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        {/* Reason for not present */}
                        <TextField
                            fullWidth
                            label="Reason for not present"
                            value={formData.reasonForNotPresent}
                            onChange={(e) => handleChange('reasonForNotPresent', e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        {/* IPD register entry found */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <FormLabel>IPD register entry found</FormLabel>
                            <Select
                                value={formData.iPDRegisterEntryFound}
                                onChange={(e) => handleChange('iPDRegisterEntryFound', e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="true">Yes</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </Select>
                        </FormControl>

                        {/* If IPD Register = No → Observations */}
                        {formData.iPDRegisterEntryFound === 'false' && (
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                label="Observations"
                                value={formData.iPDRegisterObservations}
                                onChange={(e) => handleChange('iPDRegisterObservations', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                        )}

                        {/* If IPD Register = Yes → Discrepancy checkbox */}
                        {formData.iPDRegisterEntryFound === 'true' && (
                            <Box sx={{ mb: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.ipdRegisterDiscrepancyNoted === true}
                                            onChange={(e) =>
                                                handleChange('ipdRegisterDiscrepancyNoted', e.target.checked)
                                            }
                                        />
                                    }
                                    label="Discrepancy noted"
                                />

                                {formData.ipdRegisterDiscrepancyNoted === true && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Observations"
                                        value={formData.iPDRegisterDiscrepancyObservations}
                                        onChange={(e) =>
                                            handleChange('iPDRegisterDiscrepancyObservations', e.target.value)
                                        }
                                        sx={{ mt: 2 }}
                                    />
                                )}
                            </Box>
                        )}

                        {/* IPDs Collected */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <FormLabel>IPDs Collected</FormLabel>
                            <Select
                                value={formData.ipdCollected}
                                onChange={(e) => handleChange('ipdCollected', e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="true">Yes</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </Select>
                        </FormControl>

                        {/* If IPD Collected = No → Reason */}
                        {formData.ipdCollected === 'false' && (
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                label="Reason"
                                value={formData.iPDCollectedReason}
                                onChange={(e) => handleChange('iPDCollectedReason', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                        )}

                        {/* If IPD Collected = Yes → PED Noted checkbox */}
                        {formData.ipdCollected === 'true' && (
                            <Box sx={{ mb: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.ipdCollectedPEDNoted === true}
                                            onChange={(e) => handleChange('ipdCollectedPEDNoted', e.target.checked)}
                                        />
                                    }
                                    label="PED Noted"
                                />

                                {/* If PED NOT Noted → Findings */}
                                {formData.ipdCollectedPEDNoted !== true && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Findings"
                                        value={formData.iPDCollectedPEDNotedFindings}
                                        onChange={(e) =>
                                            handleChange('iPDCollectedPEDNotedFindings', e.target.value)
                                        }
                                        sx={{ mt: 2, mb: 2 }}
                                    />
                                )}

                                {/* If PED Noted = Yes → Discrepancy other than PED checkbox */}
                                {formData.ipdCollectedPEDNoted === true && (
                                    <Box sx={{ mt: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formData.isIPDCollectedDiscrepancyPED === true}
                                                    onChange={(e) =>
                                                        handleChange('isIPDCollectedDiscrepancyPED', e.target.checked)
                                                    }
                                                />
                                            }
                                            label="Discrepancy noted other than PED"
                                        />

                                        {formData.isIPDCollectedDiscrepancyPED === true && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Observations"
                                                value={formData.iPDCollectedDiscrepancyPEDObservations}
                                                onChange={(e) =>
                                                    handleChange('iPDCollectedDiscrepancyPEDObservations', e.target.value)
                                                }
                                                sx={{ mt: 2 }}
                                            />
                                        )}
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Treating doctor Visit */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <FormLabel>Treating doctor Visit</FormLabel>
                            <Select
                                value={formData.treatingDoctorVisit}
                                onChange={(e) => handleChange('treatingDoctorVisit', e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="true">Statement Collected</MenuItem>
                                <MenuItem value="false">Statement not Collected</MenuItem>
                            </Select>
                        </FormControl>

                        {/* If Doctor Visit = No → Reason */}
                        {formData.treatingDoctorVisit === 'false' && (
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                label="Reason"
                                value={formData.treatingDoctorVisitReason}
                                onChange={(e) => handleChange('treatingDoctorVisitReason', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                        )}

                        {/* If Doctor Visit = Yes → PED Noted checkbox */}
                        {formData.treatingDoctorVisit === 'true' && (
                            <Box sx={{ mb: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.treatingDoctorVisitPEDNoted === true}
                                            onChange={(e) =>
                                                handleChange('treatingDoctorVisitPEDNoted', e.target.checked)
                                            }
                                        />
                                    }
                                    label="PED Noted"
                                />

                                {formData.treatingDoctorVisitPEDNoted === true && (
                                    <Box sx={{ mt: 2 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            label="Findings"
                                            value={formData.treatingDoctorVisitPEDNotedFindings}
                                            onChange={(e) =>
                                                handleChange('treatingDoctorVisitPEDNotedFindings', e.target.value)
                                            }
                                            sx={{ mb: 2 }}
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formData.treatingDoctorVisitDiscrepancyPED === true}
                                                    onChange={(e) =>
                                                        handleChange('treatingDoctorVisitDiscrepancyPED', e.target.checked)
                                                    }
                                                />
                                            }
                                            label="Discrepancy noted other than PED"
                                        />

                                        {formData.treatingDoctorVisitDiscrepancyPED === true && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Observations"
                                                value={formData.treatingDoctorVisitPEDObservations}
                                                onChange={(e) =>
                                                    handleChange('treatingDoctorVisitPEDObservations', e.target.value)
                                                }
                                                sx={{ mt: 2 }}
                                            />
                                        )}
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        {/* Line of Treatment */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <FormLabel>Line of Treatment</FormLabel>
                            <Select
                                value={formData.lineOfTreatment}
                                onChange={(e) => handleChange('lineOfTreatment', e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="medicalManagement">Medical Management</MenuItem>
                                <MenuItem value="surgicalManagement">
                                    Surgical Management(Non Accidental)
                                </MenuItem>
                                <MenuItem value="rtaAccidentalCase">RTA-Accidental case</MenuItem>
                            </Select>
                        </FormControl>

                        {/* ========== MEDICAL MANAGEMENT ========== */}
                        {formData.lineOfTreatment === 'medicalManagement' && (
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>Is Active line of treatment Given?</FormLabel>
                                            <Select
                                                value={formData.isActiveMedicalManagementLOTGiven}
                                                onChange={(e) =>
                                                    handleChange('isActiveMedicalManagementLOTGiven', e.target.value)
                                                }
                                                displayEmpty
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* If Active = Yes → Justification */}
                                    {formData.isActiveMedicalManagementLOTGiven === 'true' && (
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Justification"
                                                value={formData.medicalManagementJustification}
                                                onChange={(e) =>
                                                    handleChange('medicalManagementJustification', e.target.value)
                                                }
                                            />
                                        </Grid>
                                    )}

                                    {/* If Active = No → Is Hospitalization for evaluation? */}
                                    {formData.isActiveMedicalManagementLOTGiven === 'false' && (
                                        <Grid size={{ xs: 12 }}>
                                            <FormControl fullWidth>
                                                <FormLabel>
                                                    Is Hospitalization only for evaluation purpose?
                                                </FormLabel>
                                                <Select
                                                    value={formData.medicalManagementIsHospitalization}
                                                    onChange={(e) =>
                                                        handleChange('medicalManagementIsHospitalization', e.target.value)
                                                    }
                                                    displayEmpty
                                                >
                                                    <MenuItem value="">Select</MenuItem>
                                                    <MenuItem value="true">Yes</MenuItem>
                                                    <MenuItem value="false">No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    )}

                                    {/* If Hospitalization = No → Observations */}
                                    {formData.isActiveMedicalManagementLOTGiven === 'false' &&
                                        formData.medicalManagementIsHospitalization === 'false' && (
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={5}
                                                    label="Observations"
                                                    value={formData.medicalManagementObsevations}
                                                    onChange={(e) =>
                                                        handleChange('medicalManagementObsevations', e.target.value)
                                                    }
                                                />
                                            </Grid>
                                        )}

                                    {/* If Hospitalization = Yes → Findings */}
                                    {formData.isActiveMedicalManagementLOTGiven === 'false' &&
                                        formData.medicalManagementIsHospitalization === 'true' && (
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={5}
                                                    label="Findings"
                                                    value={formData.medicalManagementFindings}
                                                    onChange={(e) =>
                                                        handleChange('medicalManagementFindings', e.target.value)
                                                    }
                                                />
                                            </Grid>
                                        )}
                                </Grid>
                            </Box>
                        )}

                        {/* ========== SURGICAL MANAGEMENT ========== */}
                        {formData.lineOfTreatment === 'surgicalManagement' && (
                            <Box>
                                {/* Procedure carried Out */}
                                <TextField
                                    fullWidth
                                    label="Procedure carried Out"
                                    value={formData.surgicalManagementProcedureCarriedOut}
                                    onChange={(e) =>
                                        handleChange('surgicalManagementProcedureCarriedOut', e.target.value)
                                    }
                                    sx={{ mb: 2 }}
                                />

                                {/* Operative Notes */}
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <FormLabel>Operative Notes</FormLabel>
                                    <RadioGroup
                                        row
                                        value={formData.surgicalManagementOperative}
                                        onChange={(e) =>
                                            handleChange('surgicalManagementOperative', e.target.value)
                                        }
                                    >
                                        <FormControlLabel value="provided" control={<Radio />} label="Provided" />
                                        <FormControlLabel
                                            value="notProvided"
                                            control={<Radio />}
                                            label="Not Provided"
                                        />
                                    </RadioGroup>
                                </FormControl>

                                {formData.surgicalManagementOperative === 'provided' && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Findings"
                                        value={formData.surgicalManagementOperativeFindings}
                                        onChange={(e) =>
                                            handleChange('surgicalManagementOperativeFindings', e.target.value)
                                        }
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                {formData.surgicalManagementOperative === 'notProvided' && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Reason"
                                        value={formData.surgicalManagementOperativeReason}
                                        onChange={(e) =>
                                            handleChange('surgicalManagementOperativeReason', e.target.value)
                                        }
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                {/* Anaesthesia Notes */}
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <FormLabel>Anaesthesia Notes</FormLabel>
                                    <RadioGroup
                                        row
                                        value={formData.surgicalManagementAnaesthesia}
                                        onChange={(e) =>
                                            handleChange('surgicalManagementAnaesthesia', e.target.value)
                                        }
                                    >
                                        <FormControlLabel value="provided" control={<Radio />} label="Provided" />
                                        <FormControlLabel
                                            value="notProvided"
                                            control={<Radio />}
                                            label="Not Provided"
                                        />
                                    </RadioGroup>
                                </FormControl>

                                {formData.surgicalManagementAnaesthesia === 'provided' && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Findings"
                                        value={formData.surgicalManagementAnaesthesiaFindings}
                                        onChange={(e) =>
                                            handleChange('surgicalManagementAnaesthesiaFindings', e.target.value)
                                        }
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                {formData.surgicalManagementAnaesthesia === 'notProvided' && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Reason"
                                        value={formData.surgicalManagementAnaesthesiaReason}
                                        onChange={(e) =>
                                            handleChange('surgicalManagementAnaesthesiaReason', e.target.value)
                                        }
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                {/* Any Implant Used? */}
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <FormLabel>Any Implant Used?</FormLabel>
                                    <RadioGroup
                                        row
                                        value={
                                            formData.surgicalManagementAnyImplantUsed === null
                                                ? ''
                                                : formData.surgicalManagementAnyImplantUsed
                                                    ? 'true'
                                                    : 'false'
                                        }
                                        onChange={(e) =>
                                            handleChange('surgicalManagementAnyImplantUsed', e.target.value === 'true')
                                        }
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="false" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>

                                {/* If Implant = Yes → Invoice verified */}
                                {formData.surgicalManagementAnyImplantUsed === true && (
                                    <Box>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <FormLabel>Invoice verified</FormLabel>
                                            <RadioGroup
                                                row
                                                value={formData.surgicalManagementInvoiceVerified}
                                                onChange={(e) =>
                                                    handleChange('surgicalManagementInvoiceVerified', e.target.value)
                                                }
                                            >
                                                <FormControlLabel value="genuine" control={<Radio />} label="Genuine" />
                                                <FormControlLabel
                                                    value="discrepency"
                                                    control={<Radio />}
                                                    label="Discrepency"
                                                />
                                                <FormControlLabel
                                                    value="notVerified"
                                                    control={<Radio />}
                                                    label="Not Verified"
                                                />
                                            </RadioGroup>
                                        </FormControl>

                                        {/* If Genuine → Sticker Number & Manufacturer */}
                                        {formData.surgicalManagementInvoiceVerified === 'genuine' && (
                                            <Box>
                                                <TextField
                                                    fullWidth
                                                    label="Invoice / Sticker Number"
                                                    value={formData.surgicalManagementInvoiceVerifiedStickerNumber}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            'surgicalManagementInvoiceVerifiedStickerNumber',
                                                            e.target.value
                                                        )
                                                    }
                                                    sx={{ mb: 2 }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Manufacturer"
                                                    value={formData.surgicalManagementInvoiceVerifiedManufacturer}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            'surgicalManagementInvoiceVerifiedManufacturer',
                                                            e.target.value
                                                        )
                                                    }
                                                    sx={{ mb: 2 }}
                                                />
                                            </Box>
                                        )}

                                        {/* If Discrepancy or Not Verified → Findings */}
                                        {(formData.surgicalManagementInvoiceVerified === 'discrepency' ||
                                            formData.surgicalManagementInvoiceVerified === 'notVerified') && (
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={5}
                                                    label="Findings"
                                                    value={formData.surgicalManagementInvoiceVerifiedFinding}
                                                    onChange={(e) =>
                                                        handleChange('surgicalManagementInvoiceVerifiedFinding', e.target.value)
                                                    }
                                                    sx={{ mb: 2 }}
                                                />
                                            )}
                                    </Box>
                                )}
                            </Box>
                        )}

                        {formData.lineOfTreatment === 'rtaAccidentalCase' && (
                            <Box>
                                {/* ===== FIR SECTION ===== */}
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <FormLabel>FIR Copy received</FormLabel>
                                    <RadioGroup
                                        row
                                        value={
                                            formData.rtaFIRCopyReceived === null
                                                ? ''
                                                : formData.rtaFIRCopyReceived
                                                    ? 'true'
                                                    : 'false'
                                        }
                                        onChange={(e) =>
                                            handleChange('rtaFIRCopyReceived', e.target.value === 'true')
                                        }
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="false" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>

                                {/* If FIR = Yes */}
                                {formData.rtaFIRCopyReceived === true && (
                                    <Box>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Date of FIR"
                                            value={formData.rtaDateOfFIR}
                                            onChange={(e) => handleChange('rtaDateOfFIR', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ mb: 2 }}
                                        />

                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            label="Observations"
                                            value={formData.rtaFIRObservations}
                                            onChange={(e) => handleChange('rtaFIRObservations', e.target.value)}
                                            sx={{ mb: 2 }}
                                        />

                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <FormLabel>FIR Verification</FormLabel>
                                            <RadioGroup
                                                row
                                                value={formData.rtaFIRVerification}
                                                onChange={(e) => handleChange('rtaFIRVerification', e.target.value)}
                                            >
                                                <FormControlLabel value="genuine" control={<Radio />} label="Genuine" />
                                                <FormControlLabel
                                                    value="discrepency"
                                                    control={<Radio />}
                                                    label="Discrepency"
                                                />
                                                <FormControlLabel
                                                    value="notVerified"
                                                    control={<Radio />}
                                                    label="Not Verified"
                                                />
                                            </RadioGroup>
                                        </FormControl>

                                        {formData.rtaFIRVerification === 'discrepency' && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Findings"
                                                value={formData.rtaFIRVerificationFinding}
                                                onChange={(e) =>
                                                    handleChange('rtaFIRVerificationFinding', e.target.value)
                                                }
                                                sx={{ mb: 2 }}
                                            />
                                        )}

                                        {formData.rtaFIRVerification === 'notVerified' && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Reason"
                                                value={formData.rtaFIRVerificationReason}
                                                onChange={(e) =>
                                                    handleChange('rtaFIRVerificationReason', e.target.value)
                                                }
                                                sx={{ mb: 2 }}
                                            />
                                        )}
                                    </Box>
                                )}

                                {/* If FIR = No */}
                                {formData.rtaFIRCopyReceived === false && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Reason"
                                        value={formData.rtaFIRReason}
                                        onChange={(e) => handleChange('rtaFIRReason', e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                {/* ===== MLC SECTION ===== */}
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <FormLabel>MLC Copy received</FormLabel>
                                    <RadioGroup
                                        row
                                        value={
                                            formData.rtaMLCCopyreceived === null
                                                ? ''
                                                : formData.rtaMLCCopyreceived
                                                    ? 'true'
                                                    : 'false'
                                        }
                                        onChange={(e) =>
                                            handleChange('rtaMLCCopyreceived', e.target.value === 'true')
                                        }
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="false" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>

                                {/* If MLC = Yes */}
                                {formData.rtaMLCCopyreceived === true && (
                                    <Box>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Date of MLC"
                                            value={formData.rtaDateOfMLC}
                                            onChange={(e) => handleChange('rtaDateOfMLC', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ mb: 2 }}
                                        />

                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            label="Observations"
                                            value={formData.rtaMLCObservations}
                                            onChange={(e) => handleChange('rtaMLCObservations', e.target.value)}
                                            sx={{ mb: 2 }}
                                        />

                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <FormLabel>MLC Verification</FormLabel>
                                            <RadioGroup
                                                row
                                                value={formData.rtaMLCVerification}
                                                onChange={(e) => handleChange('rtaMLCVerification', e.target.value)}
                                            >
                                                <FormControlLabel value="genuine" control={<Radio />} label="Genuine" />
                                                <FormControlLabel
                                                    value="discrepency"
                                                    control={<Radio />}
                                                    label="Discrepency"
                                                />
                                                <FormControlLabel
                                                    value="notVerified"
                                                    control={<Radio />}
                                                    label="Not Verified"
                                                />
                                            </RadioGroup>
                                        </FormControl>

                                        {formData.rtaMLCVerification === 'discrepency' && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Findings"
                                                value={formData.rtaMLCVerificationFinding}
                                                onChange={(e) =>
                                                    handleChange('rtaMLCVerificationFinding', e.target.value)
                                                }
                                                sx={{ mb: 2 }}
                                            />
                                        )}

                                        {formData.rtaMLCVerification === 'notVerified' && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Reason"
                                                value={formData.rtaMLCVerificationReason}
                                                onChange={(e) =>
                                                    handleChange('rtaMLCVerificationReason', e.target.value)
                                                }
                                                sx={{ mb: 2 }}
                                            />
                                        )}
                                    </Box>
                                )}

                                {/* If MLC = No */}
                                {formData.rtaMLCCopyreceived === false && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Reason"
                                        value={formData.rtaMLCReason}
                                        onChange={(e) => handleChange('rtaMLCReason', e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                {/* ===== ALCOHOL INTOXICATION ===== */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.rtaAlcoholIntoxicationNoted === true}
                                            onChange={(e) =>
                                                handleChange('rtaAlcoholIntoxicationNoted', e.target.checked)
                                            }
                                        />
                                    }
                                    label="Alcohol / drug intoxication Noted"
                                    sx={{ mb: 2 }}
                                />

                                {formData.rtaAlcoholIntoxicationNoted === true && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Findings"
                                        value={formData.rtaAlcoholFindings}
                                        onChange={(e) => handleChange('rtaAlcoholFindings', e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                {/* ===== RTA LINE OF TREATMENT ===== */}
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <FormLabel>Line of Treatment</FormLabel>
                                    <Select
                                        value={formData.rtaLineOfTreatment}
                                        onChange={(e) => handleChange('rtaLineOfTreatment', e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="medicalManagement">Medical</MenuItem>
                                        <MenuItem value="surgicalManagement">Surgical</MenuItem>
                                    </Select>
                                </FormControl>

                                {/* RTA MEDICAL MANAGEMENT */}
                                {formData.rtaLineOfTreatment === 'medicalManagement' && (
                                    <Box>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12 }}>
                                                <FormControl fullWidth>
                                                    <FormLabel>Is Active line of treatment Given?</FormLabel>
                                                    <Select
                                                        value={formData.rtaMedicalIsActive}
                                                        onChange={(e) => handleChange('rtaMedicalIsActive', e.target.value)}
                                                        displayEmpty
                                                    >
                                                        <MenuItem value="">Select</MenuItem>
                                                        <MenuItem value="true">Yes</MenuItem>
                                                        <MenuItem value="false">No</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            {formData.rtaMedicalIsActive === 'false' && (
                                                <Grid size={{ xs: 12 }}>
                                                    <FormControl fullWidth>
                                                        <FormLabel>
                                                            Is Hospitalization only for evaluation purpose?
                                                        </FormLabel>
                                                        <Select
                                                            value={formData.rtaMedicalIsHospitalization}
                                                            onChange={(e) =>
                                                                handleChange('rtaMedicalIsHospitalization', e.target.value)
                                                            }
                                                            displayEmpty
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            )}

                                            {formData.rtaMedicalIsActive === 'true' && (
                                                <Grid size={{ xs: 12 }}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={5}
                                                        label="Justification"
                                                        value={formData.rtaMedicalJustification}
                                                        onChange={(e) =>
                                                            handleChange('rtaMedicalJustification', e.target.value)
                                                        }
                                                    />
                                                </Grid>
                                            )}

                                            {formData.rtaMedicalIsActive === 'false' &&
                                                formData.rtaMedicalIsHospitalization === 'true' && (
                                                    <Grid size={{ xs: 12 }}>
                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            rows={5}
                                                            label="Findings"
                                                            value={formData.rtaMedicalFindings}
                                                            onChange={(e) => handleChange('rtaMedicalFindings', e.target.value)}
                                                        />
                                                    </Grid>
                                                )}

                                            {formData.rtaMedicalIsActive === 'false' &&
                                                formData.rtaMedicalIsHospitalization === 'false' && (
                                                    <Grid size={{ xs: 12 }}>
                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            rows={5}
                                                            label="Observations"
                                                            value={formData.rtaMedicalObsevations}
                                                            onChange={(e) =>
                                                                handleChange('rtaMedicalObsevations', e.target.value)
                                                            }
                                                        />
                                                    </Grid>
                                                )}
                                        </Grid>
                                    </Box>
                                )}

                                {/* RTA SURGICAL MANAGEMENT */}
                                {formData.rtaLineOfTreatment === 'surgicalManagement' && (
                                    <Box>
                                        <TextField
                                            fullWidth
                                            label="Procedure carried Out"
                                            value={formData.rtaSurgicalProcedureCarriedOut}
                                            onChange={(e) =>
                                                handleChange('rtaSurgicalProcedureCarriedOut', e.target.value)
                                            }
                                            sx={{ mb: 2 }}
                                        />

                                        {/* Operative Notes */}
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <FormLabel>Operative Notes</FormLabel>
                                            <RadioGroup
                                                row
                                                value={formData.rtaSurgicalOperative}
                                                onChange={(e) => handleChange('rtaSurgicalOperative', e.target.value)}
                                            >
                                                <FormControlLabel value="provided" control={<Radio />} label="Provided" />
                                                <FormControlLabel
                                                    value="notProvided"
                                                    control={<Radio />}
                                                    label="Not Provided"
                                                />
                                            </RadioGroup>
                                        </FormControl>

                                        {formData.rtaSurgicalOperative === 'provided' && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Findings"
                                                value={formData.rtaSurgicalOperativeFindings}
                                                onChange={(e) =>
                                                    handleChange('rtaSurgicalOperativeFindings', e.target.value)
                                                }
                                                sx={{ mb: 2 }}
                                            />
                                        )}

                                        {formData.rtaSurgicalOperative === 'notProvided' && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Reason"
                                                value={formData.rtaSurgicalOperativeReason}
                                                onChange={(e) =>
                                                    handleChange('rtaSurgicalOperativeReason', e.target.value)
                                                }
                                                sx={{ mb: 2 }}
                                            />
                                        )}

                                        {/* Anaesthesia Notes */}
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <FormLabel>Anaesthesia Notes</FormLabel>
                                            <RadioGroup
                                                row
                                                value={formData.rtaSurgicalAnaesthesia}
                                                onChange={(e) => handleChange('rtaSurgicalAnaesthesia', e.target.value)}
                                            >
                                                <FormControlLabel value="provided" control={<Radio />} label="Provided" />
                                                <FormControlLabel
                                                    value="notProvided"
                                                    control={<Radio />}
                                                    label="Not Provided"
                                                />
                                            </RadioGroup>
                                        </FormControl>

                                        {formData.rtaSurgicalAnaesthesia === 'provided' && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Findings"
                                                value={formData.rtaSurgicalAnaesthesiaFindings}
                                                onChange={(e) =>
                                                    handleChange('rtaSurgicalAnaesthesiaFindings', e.target.value)
                                                }
                                                sx={{ mb: 2 }}
                                            />
                                        )}

                                        {formData.rtaSurgicalAnaesthesia === 'notProvided' && (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Reason"
                                                value={formData.rtaSurgicalAnaesthesiaReason}
                                                onChange={(e) =>
                                                    handleChange('rtaSurgicalAnaesthesiaReason', e.target.value)
                                                }
                                                sx={{ mb: 2 }}
                                            />
                                        )}

                                        {/* Any Implant Used? */}
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <FormLabel>Any Implant Used?</FormLabel>
                                            <RadioGroup
                                                row
                                                value={
                                                    formData.rtaSurgicalAnyImplantUsed === null
                                                        ? ''
                                                        : formData.rtaSurgicalAnyImplantUsed
                                                            ? 'true'
                                                            : 'false'
                                                }
                                                onChange={(e) =>
                                                    handleChange('rtaSurgicalAnyImplantUsed', e.target.value === 'true')
                                                }
                                            >
                                                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="false" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>

                                        {/* If Implant = Yes → Invoice verified */}
                                        {formData.rtaSurgicalAnyImplantUsed === true && (
                                            <Box>
                                                <FormControl fullWidth sx={{ mb: 2 }}>
                                                    <FormLabel>Invoice verified</FormLabel>
                                                    <RadioGroup
                                                        row
                                                        value={formData.rtaSurgicalInvoiceVerified}
                                                        onChange={(e) =>
                                                            handleChange('rtaSurgicalInvoiceVerified', e.target.value)
                                                        }
                                                    >
                                                        <FormControlLabel
                                                            value="genuine"
                                                            control={<Radio />}
                                                            label="Genuine"
                                                        />
                                                        <FormControlLabel
                                                            value="discrepency"
                                                            control={<Radio />}
                                                            label="Discrepency"
                                                        />
                                                        <FormControlLabel
                                                            value="notVerified"
                                                            control={<Radio />}
                                                            label="Not Verified"
                                                        />
                                                    </RadioGroup>
                                                </FormControl>

                                                {/* If Genuine → Sticker Number & Manufacturer */}
                                                {formData.rtaSurgicalInvoiceVerified === 'genuine' && (
                                                    <Box>
                                                        <TextField
                                                            fullWidth
                                                            label="Invoice / Sticker Number"
                                                            value={formData.surgicalManagementInvoiceVerifiedStickerNumber}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    'surgicalManagementInvoiceVerifiedStickerNumber',
                                                                    e.target.value
                                                                )
                                                            }
                                                            sx={{ mb: 2 }}
                                                        />
                                                        <TextField
                                                            fullWidth
                                                            label="Manufacturer"
                                                            value={formData.surgicalManagementInvoiceVerifiedManufacturer}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    'surgicalManagementInvoiceVerifiedManufacturer',
                                                                    e.target.value
                                                                )
                                                            }
                                                            sx={{ mb: 2 }}
                                                        />
                                                    </Box>
                                                )}

                                                {/* If Discrepancy or Not Verified → Findings */}
                                                {(formData.rtaSurgicalInvoiceVerified === 'discrepency' ||
                                                    formData.rtaSurgicalInvoiceVerified === 'notVerified') && (
                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            rows={5}
                                                            label="Findings"
                                                            value={formData.surgicalManagementInvoiceVerifiedFinding}
                                                            onChange={(e) =>
                                                                handleChange(
                                                                    'surgicalManagementInvoiceVerifiedFinding',
                                                                    e.target.value
                                                                )
                                                            }
                                                            sx={{ mb: 2 }}
                                                        />
                                                    )}
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Grid>
                    {/* END RIGHT COLUMN */}
                </Grid>
                {/* END MAIN GRID CONTAINER */}
            </Paper>
        </Box>
    );
};

export default NfinStep1;
