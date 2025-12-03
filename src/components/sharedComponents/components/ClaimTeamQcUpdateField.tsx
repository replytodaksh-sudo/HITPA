// ==================== COMPLETE QC UPDATE FIELD COMPONENT ====================
// ClaimTeamQcUpdateField.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Grid,
    FormLabel,
    Select,
    MenuItem,
    TextField,
    Button,
} from '@mui/material';

// ==================== INTERFACES ====================

interface ClaimTeamQcUpdateFieldProps {
    previewValues?: any;
    buttonEnable?: boolean;
    dataRole?: any
    claimType?: any
    onRefresh?: any
}

interface QcFormData {
    // Bill Inflation
    billInflation: string;
    billInflationDetails: string;

    // 24 Hours Stay
    stayConfirmed: string;
    stayConfirmedDetails: string;

    // PED
    anyPED: string;
    pedWaitingPeriodDetails: string;

    // Permanent Exclusions
    permanentExclusions: string;
    anyPermanentExclusionDetails: string;

    // Qualification Allopathy
    qualificationAllopathy: string;
    qualificationAllopathyDetails: string;

    // Discrepancies
    discrepanciesObserved: string;
    discrepanciesObservedDetails: string;

    // Hospitalization
    hospitalization: string;
    hospitalizationJustifiedDetails: string;

    // Hospital Criteria
    hospitalCriteriaFulfilled: string;
    hospitalCriteriaFulfilledDetails: string;

    // Two Year Exclusions
    twoYearExclusions: string;
    firstTwoYearExclusionsDetails: string;

    // Waiting Period
    waitingPeriod: string;
    waitingPeriod30DaysDetails: string;

    // Age Cross Check
    ageCrossCheck: string;
    ageCrossCheckDetails: string;
}

// ==================== DROPDOWN OPTIONS ====================

const dropdownOptions = [
    { label: 'Select', value: '' },
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
];

// ==================== DEFAULT FORM STATE ====================

const getDefaultFormData = (): QcFormData => ({
    billInflation: '',
    billInflationDetails: '',
    stayConfirmed: '',
    stayConfirmedDetails: '',
    anyPED: '',
    pedWaitingPeriodDetails: '',
    permanentExclusions: '',
    anyPermanentExclusionDetails: '',
    qualificationAllopathy: '',
    qualificationAllopathyDetails: '',
    discrepanciesObserved: '',
    discrepanciesObservedDetails: '',
    hospitalization: '',
    hospitalizationJustifiedDetails: '',
    hospitalCriteriaFulfilled: '',
    hospitalCriteriaFulfilledDetails: '',
    twoYearExclusions: '',
    firstTwoYearExclusionsDetails: '',
    waitingPeriod: '',
    waitingPeriod30DaysDetails: '',
    ageCrossCheck: '',
    ageCrossCheckDetails: '',
});

// ==================== SERVICES ====================

const qcUpdateService = {
    addQCUpdate: async (qcData: any, investigationId: string) => {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/qc-update/${investigationId}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(qcData),
            }
        );
        return response.json();
    },
};

const notificationService = {
    showAlertSuccess: (msg: string) => alert(msg),
    showAlertError: (msg: string) => alert(msg),
};

const messages = {
    QCUpdateFields: 'QC Update fields saved successfully',
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Converts boolean to Yes/No string
 */
const convertBoolToYesNo = (val: any): string => {
    if (val === true) return 'Yes';
    if (val === false) return 'No';
    return '';
};

/**
 * Converts Yes/No string to boolean
 */
const convertYesNoToBool = (val: string): boolean | null => {
    if (val === 'Yes') return true;
    if (val === 'No') return false;
    return null;
};

// ==================== MAIN COMPONENT ====================

const ClaimTeamQcUpdateField: React.FC<ClaimTeamQcUpdateFieldProps> = ({
    previewValues = {},
    buttonEnable = true,
}) => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const [formData, setFormData] = useState<QcFormData>(getDefaultFormData());
    const [loading, setLoading] = useState(false);

    // Get role from session storage
    const roleName = sessionStorage.getItem('roleName');

    // ==================== POPULATE FROM PREVIEW VALUES ====================

    useEffect(() => {
        if (previewValues && Object.keys(previewValues).length > 0) {
            setFormData({
                billInflation: convertBoolToYesNo(previewValues.billInflation),
                billInflationDetails: previewValues.billInflationDetails || '',
                stayConfirmed: convertBoolToYesNo(previewValues.stayConfirmed),
                stayConfirmedDetails: previewValues.stayConfirmedDetails || '',
                anyPED: convertBoolToYesNo(previewValues.anyPED),
                pedWaitingPeriodDetails: previewValues.pedWaitingPeriodDetails || '',
                permanentExclusions: convertBoolToYesNo(previewValues.permanentExclusions),
                anyPermanentExclusionDetails: previewValues.anyPermanentExclusionDetails || '',
                qualificationAllopathy: convertBoolToYesNo(previewValues.qualificationAllopathy),
                qualificationAllopathyDetails: previewValues.qualificationAllopathyDetails || '',
                discrepanciesObserved: convertBoolToYesNo(previewValues.discrepanciesObserved),
                discrepanciesObservedDetails: previewValues.discrepanciesObservedDetails || '',
                hospitalization: convertBoolToYesNo(previewValues.hospitalization),
                hospitalizationJustifiedDetails: previewValues.hospitalizationJustifiedDetails || '',
                hospitalCriteriaFulfilled: convertBoolToYesNo(previewValues.hospitalCriteriaFulfilled),
                hospitalCriteriaFulfilledDetails: previewValues.hospitalCriteriaFulfilledDetails || '',
                twoYearExclusions: convertBoolToYesNo(previewValues.twoYearExclusions),
                firstTwoYearExclusionsDetails: previewValues.firstTwoYearExclusionsDetails || '',
                waitingPeriod: convertBoolToYesNo(previewValues.waitingPeriod),
                waitingPeriod30DaysDetails: previewValues.waitingPeriod30DaysDetails || '',
                ageCrossCheck: convertBoolToYesNo(previewValues.ageCrossCheck),
                ageCrossCheckDetails: previewValues.ageCrossCheckDetails || '',
            });
        }
    }, [previewValues]);

    // ==================== HANDLE FIELD CHANGE ====================

    const handleChange = (field: keyof QcFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // ==================== SUBMIT HANDLER ====================

    const handleSubmit = async () => {
        setLoading(true);
        const cleanId = investigationId?.split(' ')[0] || '';

        // Build QC update model based on form data
        const qcUpdateModel: any = {
            qcUpdateID:
                localStorage.getItem('qcUpdateID') !== '' ? localStorage.getItem('qcUpdateID') : '',
        };

        // Bill Inflation
        if (formData.billInflation === 'Yes') {
            qcUpdateModel.billInflation = true;
            qcUpdateModel.billInflationDetails = formData.billInflationDetails;
        } else if (formData.billInflation === 'No') {
            qcUpdateModel.billInflation = false;
        }

        // Stay Confirmed
        if (formData.stayConfirmed === 'Yes') {
            qcUpdateModel.stayConfirmed = true;
            qcUpdateModel.stayConfirmedDetails = formData.stayConfirmedDetails;
        } else if (formData.stayConfirmed === 'No') {
            qcUpdateModel.stayConfirmed = false;
            qcUpdateModel.stayConfirmedDetails = formData.stayConfirmedDetails;
        }

        // Any PED
        if (formData.anyPED === 'Yes') {
            qcUpdateModel.anyPED = true;
            qcUpdateModel.pedWaitingPeriodDetails = formData.pedWaitingPeriodDetails;
        } else if (formData.anyPED === 'No') {
            qcUpdateModel.anyPED = false;
        }

        // Permanent Exclusions
        if (formData.permanentExclusions === 'Yes') {
            qcUpdateModel.permanentExclusions = true;
            qcUpdateModel.anyPermanentExclusionDetails = formData.anyPermanentExclusionDetails;
        } else if (formData.permanentExclusions === 'No') {
            qcUpdateModel.permanentExclusions = false;
        }

        // Qualification Allopathy
        if (formData.qualificationAllopathy === 'Yes') {
            qcUpdateModel.qualificationAllopathy = true;
        } else if (formData.qualificationAllopathy === 'No') {
            qcUpdateModel.qualificationAllopathy = false;
            qcUpdateModel.qualificationAllopathyDetails = formData.qualificationAllopathyDetails;
        }

        // Discrepancies Observed
        if (formData.discrepanciesObserved === 'Yes') {
            qcUpdateModel.discrepanciesObserved = true;
            qcUpdateModel.discrepanciesObservedDetails = formData.discrepanciesObservedDetails;
        } else if (formData.discrepanciesObserved === 'No') {
            qcUpdateModel.discrepanciesObserved = false;
        }

        // Hospital Criteria Fulfilled
        if (formData.hospitalCriteriaFulfilled === 'Yes') {
            qcUpdateModel.hospitalCriteriaFulfilled = true;
        } else if (formData.hospitalCriteriaFulfilled === 'No') {
            qcUpdateModel.hospitalCriteriaFulfilled = false;
            qcUpdateModel.hospitalCriteriaFulfilledDetails = formData.hospitalCriteriaFulfilledDetails;
        }

        // Two Year Exclusions
        if (formData.twoYearExclusions === 'Yes') {
            qcUpdateModel.twoYearExclusions = true;
            qcUpdateModel.firstTwoYearExclusionsDetails = formData.firstTwoYearExclusionsDetails;
        } else if (formData.twoYearExclusions === 'No') {
            qcUpdateModel.twoYearExclusions = false;
        }

        // Hospitalization
        if (formData.hospitalization === 'Yes') {
            qcUpdateModel.hospitalization = true;
        } else if (formData.hospitalization === 'No') {
            qcUpdateModel.hospitalization = false;
            qcUpdateModel.hospitalizationJustifiedDetails = formData.hospitalizationJustifiedDetails;
        }

        // Waiting Period
        if (formData.waitingPeriod === 'Yes') {
            qcUpdateModel.waitingPeriod = true;
            qcUpdateModel.waitingPeriod30DaysDetails = formData.waitingPeriod30DaysDetails;
        } else if (formData.waitingPeriod === 'No') {
            qcUpdateModel.waitingPeriod = false;
        }

        // Age Cross Check
        if (formData.ageCrossCheck === 'Yes') {
            qcUpdateModel.ageCrossCheck = true;
        } else if (formData.ageCrossCheck === 'No') {
            qcUpdateModel.ageCrossCheck = false;
            qcUpdateModel.ageCrossCheckDetails = formData.ageCrossCheckDetails;
        }

        try {
            const data = await qcUpdateService.addQCUpdate(qcUpdateModel, cleanId);
            if (data.payload && data.payload.qcUpdateID) {
                localStorage.setItem('qcUpdateID', data.payload.qcUpdateID);
            }
            notificationService.showAlertSuccess(messages.QCUpdateFields);
        } catch (error) {
            notificationService.showAlertError('Error saving QC update');
        } finally {
            setLoading(false);
        }
    };

    // ==================== RENDER FIELD ====================

    const renderField = (
        label: string,
        fieldName: keyof QcFormData,
        detailsFieldName: keyof QcFormData,
        showDetailsWhen: 'Yes' | 'No'
    ) => (
        <Box sx={{ mb: 3 }}>
            {/* Dropdown */}
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 8 }}>
                    <FormLabel sx={{ fontSize: '0.95rem' }}>{label}</FormLabel>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Select
                        fullWidth
                        value={formData[fieldName]}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        size="small"
                    >
                        {dropdownOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            </Grid>

            {/* Conditional Textarea */}
            {formData[fieldName] === showDetailsWhen && (
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={formData[detailsFieldName]}
                        onChange={(e) => handleChange(detailsFieldName, e.target.value)}
                        variant="outlined"
                    />
                </Box>
            )}
        </Box>
    );

    // ==================== RENDER ====================

    return (
        <Box sx={{ mt: 2 }}>
            <Card>
                <CardContent>
                    <Grid container spacing={4}>
                        {/* LEFT COLUMN */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            {renderField(
                                'Any bill inflation Noted (Discount/ LOS / Procedure charges etc.)',
                                'billInflation',
                                'billInflationDetails',
                                'Yes'
                            )}

                            {renderField(
                                '24 Hours stay confirmed?',
                                'stayConfirmed',
                                'stayConfirmedDetails',
                                'No'
                            )}

                            {renderField('Any PED noted?', 'anyPED', 'pedWaitingPeriodDetails', 'Yes')}

                            {renderField(
                                'Any Permanent exclusions?',
                                'permanentExclusions',
                                'anyPermanentExclusionDetails',
                                'Yes'
                            )}

                            {renderField(
                                'Treating doctor qualification- Allopathy?',
                                'qualificationAllopathy',
                                'qualificationAllopathyDetails',
                                'No'
                            )}

                            {renderField(
                                'Any discrepancies Observed',
                                'discrepanciesObserved',
                                'discrepanciesObservedDetails',
                                'Yes'
                            )}
                        </Grid>

                        {/* RIGHT COLUMN */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            {renderField(
                                'Is Hospitalization Justified ?',
                                'hospitalization',
                                'hospitalizationJustifiedDetails',
                                'No'
                            )}

                            {renderField(
                                'Hospital criteria fulfilled?',
                                'hospitalCriteriaFulfilled',
                                'hospitalCriteriaFulfilledDetails',
                                'No'
                            )}

                            {renderField(
                                'Any first year exclusions?',
                                'twoYearExclusions',
                                'firstTwoYearExclusionsDetails',
                                'Yes'
                            )}

                            {renderField(
                                'A 30 days waiting period',
                                'waitingPeriod',
                                'waitingPeriod30DaysDetails',
                                'Yes'
                            )}

                            {renderField(
                                'Age & ID proof cross checked?',
                                'ageCrossCheck',
                                'ageCrossCheckDetails',
                                'No'
                            )}

                            {/* Submit Button */}
                            {buttonEnable && roleName !== 'Super Admin' && (
                                <Box sx={{ textAlign: 'right', mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        sx={{
                                            background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5568D3 0%, #63408B 100%)',
                                            },
                                        }}
                                    >
                                        {loading ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ClaimTeamQcUpdateField;