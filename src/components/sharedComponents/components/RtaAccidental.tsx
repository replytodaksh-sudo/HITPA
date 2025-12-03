// src/components/CaseUpdate/RTAAccidental.tsx

import React, { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import RTAMedicalManagement from './RTAMedicalManagement';
import RTASurgeryManagement from './RTASurgeryManagement';

interface RTAAccidentalProps {
    previousData?: any;
    handleChangeRTAAccidental?: (field: string, value: any) => void;
}

export interface RtaMedicalManagementData {
    rtaMedicalIsActive: string;
    rtaMedicalIsHospitalization: string;
    rtaMedicalObsevations: string;
    rtaMedicalJustification: string;
    rtaMedicalFindings: string;
}

const RTAAccidental: React.FC<RTAAccidentalProps> = ({
    previousData,
    handleChangeRTAAccidental,
}) => {
    // FIR Section
    const [firCopyValue, setFirCopyValue] = useState<string>('');
    const [rtaDateOfFIR, setRtaDateOfFIR] = useState<Dayjs | null>(null);
    const [rtaFIRObservations, setRtaFIRObservations] = useState('');
    const [firVerificationValue, setFirVerificationValue] = useState('');
    const [rtaFIRVerificationFinding, setRtaFIRVerificationFinding] = useState('');
    const [rtaFIRVerificationReason, setRtaFIRVerificationReason] = useState('');
    const [rtaFIRReason, setRtaFIRReason] = useState('');

    // MLC Section
    const [mlcCopyValue, setMlcCopyValue] = useState<boolean | null>(null);
    const [rtaDateOfMLC, setRtaDateOfMLC] = useState<Dayjs | null>(null);
    const [rtaMLCObservations, setRtaMLCObservations] = useState('');
    const [mlcVerificationValue, setMlcVerificationValue] = useState('');
    const [rtaMLCVerificationFinding, setRtaMLCVerificationFinding] = useState('');
    const [rtaMLCVerificationReason, setRtaMLCVerificationReason] = useState('');
    const [rtaMLCReason, setRtaMLCReason] = useState('');

    // Alcohol Section
    const [alcoholDrugIntoxinationValueRadio, setAlcoholDrugIntoxinationValueRadio] = useState<string>('0');
    const [rtaAlcoholFindings, setRtaAlcoholFindings] = useState('');

    // Line of Treatment
    const [lineTreatmentValue, setLineTreatmentValue] = useState('');

    const [formDataRtaMedicalManagement, setFormDataRtaMedicalManagement] = useState<RtaMedicalManagementData>({
        rtaMedicalIsActive: '',
        rtaMedicalIsHospitalization: '',
        rtaMedicalObsevations: '',
        rtaMedicalJustification: '',
        rtaMedicalFindings: '',
    });

    // Load previous data on mount
    useEffect(() => {
        if (previousData) {
            setFormDataRtaMedicalManagement({
                rtaMedicalIsActive: previousData.rtaMedicalIsActive || '',
                rtaMedicalIsHospitalization: previousData.rtaMedicalIsHospitalization || '',
                rtaMedicalObsevations: previousData.rtaMedicalObsevations || '',
                rtaMedicalJustification: previousData.rtaMedicalJustification || '',
                rtaMedicalFindings: previousData.rtaMedicalFindings || '',
            });
        }
    }, [previousData]);

    const handleChangeRtaMedicalManagement = (field: keyof RtaMedicalManagementData, value: string) => {
        setFormDataRtaMedicalManagement((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Populate data from previousData
    useEffect(() => {
        if (previousData) {
            populateData();
        }
    }, [previousData]);

    const populateData = () => {
        if (!previousData) return;

        // FIR Data
        setFirCopyValue(previousData.rtaFIRCopyReceived === true ? '1' : '0');
        setFirVerificationValue(previousData.rtaFIRVerification || '');
        setRtaFIRObservations(previousData.rtaFIRObservations || '');
        setRtaFIRVerificationFinding(previousData.rtaFIRVerificationFinding || '');
        setRtaFIRVerificationReason(previousData.rtaFIRVerificationReason || '');
        setRtaFIRReason(previousData.rtaFIRReason || '');

        if (previousData.rtaDateOfFIR) {
            setRtaDateOfFIR(dayjs(previousData.rtaDateOfFIR));
        }

        // MLC Data
        setMlcCopyValue(previousData.rtaMLCCopyreceived);
        setMlcVerificationValue(previousData.rtaMLCVerification || '');
        setRtaMLCObservations(previousData.rtaMLCObservations || '');
        setRtaMLCVerificationFinding(previousData.rtaMLCVerificationFinding || '');
        setRtaMLCVerificationReason(previousData.rtaMLCVerificationReason || '');
        setRtaMLCReason(previousData.rtaMLCReason || '');

        if (previousData.rtaDateOfMLC) {
            setRtaDateOfMLC(dayjs(previousData.rtaDateOfMLC));
        }

        // Alcohol Data
        setRtaAlcoholFindings(previousData.rtaAlcoholFindings || '');
        if (previousData.rtaAlcoholIntoxicationNoted === true) {
            setAlcoholDrugIntoxinationValueRadio('1');
        } else if (previousData.rtaAlcoholIntoxicationNoted === false) {
            setAlcoholDrugIntoxinationValueRadio('0');
        }

        // Line of Treatment
        setLineTreatmentValue(previousData.rtaLineOfTreatment || '');
    };

    // Handler to update parent/service with data changes
    const updateData = (field: string, value: any) => {
        if (handleChangeRTAAccidental) {
            handleChangeRTAAccidental(field, value);
        }
    };

    // FIR Copy change
    const handleFirCopyChange = (value: string) => {
        setFirCopyValue(value);
        updateData('rtaFIRCopyReceived', value === '1');
    };

    // MLC Copy change
    const handleMlcCopyChange = (value: string) => {
        const boolValue = value === 'true';
        setMlcCopyValue(boolValue);
        updateData('rtaMLCCopyreceived', boolValue);
    };

    // Alcohol Intoxication change
    const handleAlcoholChange = (value: string) => {
        setAlcoholDrugIntoxinationValueRadio(value);
        updateData('rtaAlcoholIntoxicationNoted', value === '1');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 2 }}>
                {/* FIR SECTION */}
                <Typography variant="h6" gutterBottom sx={{ fontSize: '16px', fontWeight: 600 }}>
                    RTA Accidental Case Details
                </Typography>

                {/* FIR Copy received? */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="body2">FIR Copy received?</Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                        <RadioGroup
                            row
                            value={firCopyValue}
                            onChange={(e) => handleFirCopyChange(e.target.value)}
                        >
                            <FormControlLabel value="1" control={<Radio />} label="Yes" />
                            <FormControlLabel value="0" control={<Radio />} label="No" />
                        </RadioGroup>
                    </Grid>
                </Grid>

                {/* If FIR Copy = Yes */}
                {firCopyValue === '1' && (
                    <>
                        {/* Date of FIR */}
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Grid size={{ xs: 4 }}>
                                <Typography variant="body2">Date Of FIR</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <DatePicker
                                    value={rtaDateOfFIR}
                                    onChange={(newValue) => {
                                        setRtaDateOfFIR(newValue as Dayjs | null);
                                        updateData('rtaDateOfFIR', newValue?.toISOString());
                                    }}
                                    slotProps={{
                                        textField: { size: 'small', fullWidth: true },
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {/* FIR Observations */}
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Grid size={{ xs: 4 }}>
                                <Typography variant="body2">Observations</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    size="small"
                                    value={rtaFIRObservations}
                                    onChange={(e) => setRtaFIRObservations(e.target.value)}
                                    onBlur={() => updateData('rtaFIRObservations', rtaFIRObservations)}
                                />
                            </Grid>
                        </Grid>

                        {/* FIR Verification */}
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Grid size={{ xs: 4 }}>
                                <Typography variant="body2">FIR Verification</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <RadioGroup
                                    row
                                    value={firVerificationValue}
                                    onChange={(e) => {
                                        setFirVerificationValue(e.target.value);
                                        updateData('rtaFIRVerification', e.target.value);
                                    }}
                                >
                                    <FormControlLabel value="Genuine" control={<Radio />} label="Genuine" />
                                    <FormControlLabel value="Discripancy" control={<Radio />} label="Discripancy" />
                                    <FormControlLabel value="Not Verified" control={<Radio />} label="Not Verified" />
                                </RadioGroup>
                            </Grid>
                        </Grid>

                        {/* FIR Verification - Findings (if Discripancy) */}
                        {firVerificationValue === 'Discripancy' && (
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Grid size={{ xs: 4 }}>
                                    <Typography variant="body2">Findings</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        value={rtaFIRVerificationFinding}
                                        onChange={(e) => setRtaFIRVerificationFinding(e.target.value)}
                                        onBlur={() => updateData('rtaFIRVerificationFinding', rtaFIRVerificationFinding)}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        {/* FIR Verification - Reason (if Not Verified) */}
                        {firVerificationValue === 'Not Verified' && (
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Grid size={{ xs: 4 }}>
                                    <Typography variant="body2">Reason</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        value={rtaFIRVerificationReason}
                                        onChange={(e) => setRtaFIRVerificationReason(e.target.value)}
                                        onBlur={() => updateData('rtaFIRVerificationReason', rtaFIRVerificationReason)}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </>
                )}

                {/* If FIR Copy = No */}
                {firCopyValue === '0' && (
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid size={{ xs: 4 }}>
                            <Typography variant="body2">Reason</Typography>
                        </Grid>
                        <Grid size={{ xs: 8 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                                value={rtaFIRReason}
                                onChange={(e) => setRtaFIRReason(e.target.value)}
                                onBlur={() => updateData('rtaFIRReason', rtaFIRReason)}
                            />
                        </Grid>
                    </Grid>
                )}

                {/* MLC SECTION */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2, mt: 3 }}>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="body2">MLC Copy received?</Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                        <RadioGroup
                            row
                            value={mlcCopyValue === null ? '' : mlcCopyValue ? 'true' : 'false'}
                            onChange={(e) => handleMlcCopyChange(e.target.value)}
                        >
                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio />} label="No" />
                        </RadioGroup>
                    </Grid>
                </Grid>

                {/* If MLC Copy = Yes */}
                {mlcCopyValue === true && (
                    <>
                        {/* Date of MLC */}
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Grid size={{ xs: 4 }}>
                                <Typography variant="body2">Date Of MLC</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <DatePicker
                                    value={rtaDateOfMLC}
                                    onChange={(newValue) => {
                                        setRtaDateOfMLC(newValue as Dayjs | null);
                                        updateData('rtaDateOfMLC', newValue?.toISOString());
                                    }}
                                    slotProps={{
                                        textField: { size: 'small', fullWidth: true },
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {/* MLC Observations */}
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Grid size={{ xs: 4 }}>
                                <Typography variant="body2">Observations</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    size="small"
                                    value={rtaMLCObservations}
                                    onChange={(e) => setRtaMLCObservations(e.target.value)}
                                    onBlur={() => updateData('rtaMLCObservations', rtaMLCObservations)}
                                />
                            </Grid>
                        </Grid>

                        {/* MLC Verification */}
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Grid size={{ xs: 4 }}>
                                <Typography variant="body2">MLC Verification</Typography>
                            </Grid>
                            <Grid size={{ xs: 8 }}>
                                <RadioGroup
                                    row
                                    value={mlcVerificationValue}
                                    onChange={(e) => {
                                        setMlcVerificationValue(e.target.value);
                                        updateData('rtaMLCVerification', e.target.value);
                                    }}
                                >
                                    <FormControlLabel value="Genuine" control={<Radio />} label="Genuine" />
                                    <FormControlLabel value="Discripancy" control={<Radio />} label="Discripancy" />
                                    <FormControlLabel value="Not Verified" control={<Radio />} label="Not Verified" />
                                </RadioGroup>
                            </Grid>
                        </Grid>

                        {/* MLC Verification - Findings (if Discripancy) */}
                        {mlcVerificationValue === 'Discripancy' && (
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Grid size={{ xs: 4 }}>
                                    <Typography variant="body2">Findings</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        value={rtaMLCVerificationFinding}
                                        onChange={(e) => setRtaMLCVerificationFinding(e.target.value)}
                                        onBlur={() => updateData('rtaMLCVerificationFinding', rtaMLCVerificationFinding)}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        {/* MLC Verification - Reason (if Not Verified) */}
                        {mlcVerificationValue === 'Not Verified' && (
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Grid size={{ xs: 4 }}>
                                    <Typography variant="body2">Reason</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                        value={rtaMLCVerificationReason}
                                        onChange={(e) => setRtaMLCVerificationReason(e.target.value)}
                                        onBlur={() => updateData('rtaMLCVerificationReason', rtaMLCVerificationReason)}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </>
                )}

                {/* If MLC Copy = No */}
                {mlcCopyValue === false && (
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid size={{ xs: 4 }}>
                            <Typography variant="body2">Reason</Typography>
                        </Grid>
                        <Grid size={{ xs: 8 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                                value={rtaMLCReason}
                                onChange={(e) => setRtaMLCReason(e.target.value)}
                                onBlur={() => updateData('rtaMLCReason', rtaMLCReason)}
                            />
                        </Grid>
                    </Grid>
                )}

                {/* ALCOHOL/DRUG INTOXICATION */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2, mt: 3 }}>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="body2">Alcohol / drug intoxication Noted</Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                        <RadioGroup
                            row
                            value={alcoholDrugIntoxinationValueRadio}
                            onChange={(e) => handleAlcoholChange(e.target.value)}
                        >
                            <FormControlLabel value="1" control={<Radio />} label="Yes" />
                            <FormControlLabel value="0" control={<Radio />} label="No" />
                        </RadioGroup>
                    </Grid>
                </Grid>

                {/* Alcohol Findings (if Yes) */}
                {alcoholDrugIntoxinationValueRadio === '1' && (
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid size={{ xs: 4 }}>
                            <Typography variant="body2">Findings</Typography>
                        </Grid>
                        <Grid size={{ xs: 8 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                                value={rtaAlcoholFindings}
                                onChange={(e) => setRtaAlcoholFindings(e.target.value)}
                                onBlur={() => updateData('rtaAlcoholFindings', rtaAlcoholFindings)}
                            />
                        </Grid>
                    </Grid>
                )}

                {/* LINE OF TREATMENT */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2, mt: 3 }}>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="body2">Line of Treatment</Typography>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                        <FormControl fullWidth size="small">
                            <Select
                                value={lineTreatmentValue}
                                onChange={(e) => {
                                    setLineTreatmentValue(e.target.value);
                                    updateData('rtaLineOfTreatment', e.target.value);
                                }}
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="medicalmanagement">Medical</MenuItem>
                                <MenuItem value="surgicalmanagement">Surgical</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* MEDICAL MANAGEMENT SECTION */}
                {lineTreatmentValue === 'medicalmanagement' && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                        <RTAMedicalManagement 
                            previousData={formDataRtaMedicalManagement} 
                            onDataChange={(data) => {
                                Object.entries(data).forEach(([field, value]) => {
                                    handleChangeRtaMedicalManagement(field as keyof RtaMedicalManagementData, value as string);
                                });
                            }} 
                        />
                    </Box>
                )}

                {/* SURGICAL MANAGEMENT SECTION */}
                {lineTreatmentValue === 'surgicalmanagement' && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                        <RTASurgeryManagement previousData={previousData} onDataChange={() => { }} />
                    </Box>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default RTAAccidental;