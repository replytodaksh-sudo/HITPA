import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Grid,
    Select,
    MenuItem,
    TextField,
    Button,
    FormControl,
    Typography,
} from '@mui/material';
import QCUpdateService from '../../../services/qcupdate.service';
import alertService from '../../../services/alertService';

interface QcupdateFieldsProps {
    previewValues?: any;
    buttonEnable?: boolean;
    onChangeTab?: (value: boolean) => void;
}

const QcupdateFields: React.FC<QcupdateFieldsProps> = ({
    previewValues = null,
    buttonEnable = false,
    onChangeTab,
}) => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();

    // Dropdown options
    const dropdownOptions = [
        { label: 'Select', value: '' },
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
    ];

    // State - Left Column
    const [billInflation, setBillInflation] = useState('');
    const [billInflationDetails, setBillInflationDetails] = useState('');
    const [stayConfirmed, setStayConfirmed] = useState('');
    const [stayConfirmedDetails, setStayConfirmedDetails] = useState('');
    const [anyPED, setAnyPED] = useState('');
    const [pedWaitingPeriodDetails, setPedWaitingPeriodDetails] = useState('');
    const [permanentExclusions, setPermanentExclusions] = useState('');
    const [anyPermanentExclusionDetails, setAnyPermanentExclusionDetails] = useState('');
    const [qualificationAllopathy, setQualificationAllopathy] = useState('');
    const [qualificationAllopathyDetails, setQualificationAllopathyDetails] = useState('');
    const [discrepanciesObserved, setDiscrepanciesObserved] = useState('');
    const [discrepanciesObservedDetails, setDiscrepanciesObservedDetails] = useState('');
    const [convertedfullcase, setConvertedfullcase] = useState('');
    const [convertedfullcaseDescription, setConvertedfullcaseDescription] = useState('');

    // State - Right Column
    const [hospitalization, setHospitalization] = useState('');
    const [hospitalizationJustifiedDetails, setHospitalizationJustifiedDetails] = useState('');
    const [hospitalCriteriaFulfilled, setHospitalCriteriaFulfilled] = useState('');
    const [hospitalCriteriaFulfilledDetails, setHospitalCriteriaFulfilledDetails] = useState('');
    const [twoYearExclusions, setTwoYearExclusions] = useState('');
    const [firstTwoYearExclusionsDetails, setFirstTwoYearExclusionsDetails] = useState('');
    const [waitingPeriod, setWaitingPeriod] = useState('');
    const [waitingPeriod30DaysDetails, setWaitingPeriod30DaysDetails] = useState('');
    const [ageCrossCheck, setAgeCrossCheck] = useState('');
    const [ageCrossCheckDetails, setAgeCrossCheckDetails] = useState('');

    // Other state
    const [claimsType, setClaimsType] = useState('');
    const [editAble, setEditAble] = useState<string | null>(null);
    const [roleName, setRoleName] = useState('');

    // Initialize
    useEffect(() => {
        const type = searchParams.get('claimsType') || '';
        setClaimsType(type);

        const role = sessionStorage.getItem('roleName') || '';
        setRoleName(role);

        const qcNonEdit = sessionStorage.getItem('qcNonEdit');
        if (qcNonEdit === 'undefined') {
            setEditAble(null);
        } else {
            setEditAble(qcNonEdit);
        }

        if (previewValues) {
            loadPreviewValues(previewValues);
        }
    }, [previewValues, searchParams]);

    const loadPreviewValues = (values: any) => {
        // Bill Inflation
        if (values.billInflation === true) {
            setBillInflation('Yes');
        } else if (values.billInflation === false) {
            setBillInflation('No');
        } else {
            setBillInflation('');
        }
        setBillInflationDetails(values.billInflationDetails || '');

        // Stay Confirmed
        if (values.stayConfirmed === true) {
            setStayConfirmed('Yes');
        } else if (values.stayConfirmed === false) {
            setStayConfirmed('No');
        } else {
            setStayConfirmed('');
        }
        setStayConfirmedDetails(values.stayConfirmedDetails || '');

        // Any PED
        if (values.anyPED === true) {
            setAnyPED('Yes');
        } else if (values.anyPED === false) {
            setAnyPED('No');
        } else {
            setAnyPED('');
        }
        setPedWaitingPeriodDetails(values.pedWaitingPeriodDetails || '');

        // Permanent Exclusions
        if (values.permanentExclusions === true) {
            setPermanentExclusions('Yes');
        } else if (values.permanentExclusions === false) {
            setPermanentExclusions('No');
        } else {
            setPermanentExclusions('');
        }
        setAnyPermanentExclusionDetails(values.anyPermanentExclusionDetails || '');

        // Qualification Allopathy
        if (values.qualificationAllopathy === true) {
            setQualificationAllopathy('Yes');
        } else if (values.qualificationAllopathy === false) {
            setQualificationAllopathy('No');
        } else {
            setQualificationAllopathy('');
        }
        setQualificationAllopathyDetails(values.qualificationAllopathyDetails || '');

        // Discrepancies Observed
        if (values.discrepanciesObserved === true) {
            setDiscrepanciesObserved('Yes');
        } else if (values.discrepanciesObserved === false) {
            setDiscrepanciesObserved('No');
        } else {
            setDiscrepanciesObserved('');
        }
        setDiscrepanciesObservedDetails(values.discrepanciesObservedDetails || '');

        // Converted Full Case
        if (values.isConvertedFullcase === true) {
            setConvertedfullcase('Yes');
            setConvertedfullcaseDescription(values.convertedFullcaseDetails || '');
        } else if (values.isConvertedFullcase === false) {
            setConvertedfullcase('No');
        } else {
            setConvertedfullcase('');
        }

        // Hospitalization
        if (values.hospitalization === true) {
            setHospitalization('Yes');
        } else if (values.hospitalization === false) {
            setHospitalization('No');
        } else {
            setHospitalization('');
        }
        setHospitalizationJustifiedDetails(values.hospitalizationJustifiedDetails || '');

        // Hospital Criteria Fulfilled
        if (values.hospitalCriteriaFulfilled === true) {
            setHospitalCriteriaFulfilled('Yes');
        } else if (values.hospitalCriteriaFulfilled === false) {
            setHospitalCriteriaFulfilled('No');
        } else {
            setHospitalCriteriaFulfilled('');
        }
        setHospitalCriteriaFulfilledDetails(values.hospitalCriteriaFulfilledDetails || '');

        // Two Year Exclusions
        if (values.twoYearExclusions === true) {
            setTwoYearExclusions('Yes');
        } else if (values.twoYearExclusions === false) {
            setTwoYearExclusions('No');
        } else {
            setTwoYearExclusions('');
        }
        setFirstTwoYearExclusionsDetails(values.firstTwoYearExclusionsDetails || '');

        // Waiting Period
        if (values.waitingPeriod === true) {
            setWaitingPeriod('Yes');
        } else if (values.waitingPeriod === false) {
            setWaitingPeriod('No');
        } else {
            setWaitingPeriod('');
        }
        setWaitingPeriod30DaysDetails(values.waitingPeriod30DaysDetails || '');

        // Age Cross Check
        if (values.ageCrossCheck === true) {
            setAgeCrossCheck('Yes');
        } else if (values.ageCrossCheck === false) {
            setAgeCrossCheck('No');
        } else {
            setAgeCrossCheck('');
        }
        setAgeCrossCheckDetails(values.ageCrossCheckDetails || '');
    };

    const isDisabled = editAble !== null && editAble === 'Non-Editable';

    const onqcSubmit = async () => {
        const cleanInvId = investigationId?.split(' ')[0] || '';

        const qcupdatemodel: any = {
            qcUpdateID: localStorage.getItem('qcUpdateID') || '',
            claimType: claimsType,
        };

        // Bill Inflation
        if (billInflation === 'Yes') {
            qcupdatemodel.billInflation = true;
            qcupdatemodel.billInflationDetails = billInflationDetails;
        } else if (billInflation === 'No') {
            qcupdatemodel.billInflation = false;
        }

        // Stay Confirmed
        if (stayConfirmed === 'Yes') {
            qcupdatemodel.stayConfirmed = true;
        } else if (stayConfirmed === 'No') {
            qcupdatemodel.stayConfirmed = false;
            qcupdatemodel.stayConfirmedDetails = stayConfirmedDetails;
        }

        // Any PED
        if (anyPED === 'Yes') {
            qcupdatemodel.anyPED = true;
            qcupdatemodel.pedWaitingPeriodDetails = pedWaitingPeriodDetails;
        } else if (anyPED === 'No') {
            qcupdatemodel.anyPED = false;
        }

        // Permanent Exclusions
        if (permanentExclusions === 'Yes') {
            qcupdatemodel.permanentExclusions = true;
            qcupdatemodel.anyPermanentExclusionDetails = anyPermanentExclusionDetails;
        } else if (permanentExclusions === 'No') {
            qcupdatemodel.permanentExclusions = false;
        }

        // Qualification Allopathy
        if (qualificationAllopathy === 'Yes') {
            qcupdatemodel.qualificationAllopathy = true;
        } else if (qualificationAllopathy === 'No') {
            qcupdatemodel.qualificationAllopathy = false;
            qcupdatemodel.qualificationAllopathyDetails = qualificationAllopathyDetails;
        }

        // Discrepancies Observed
        if (discrepanciesObserved === 'Yes') {
            qcupdatemodel.discrepanciesObserved = true;
            qcupdatemodel.discrepanciesObservedDetails = discrepanciesObservedDetails;
        } else if (discrepanciesObserved === 'No') {
            qcupdatemodel.discrepanciesObserved = false;
        }

        // Hospital Criteria Fulfilled
        if (hospitalCriteriaFulfilled === 'Yes') {
            qcupdatemodel.hospitalCriteriaFulfilled = true;
        } else if (hospitalCriteriaFulfilled === 'No') {
            qcupdatemodel.hospitalCriteriaFulfilled = false;
            qcupdatemodel.hospitalCriteriaFulfilledDetails = hospitalCriteriaFulfilledDetails;
        }

        // Two Year Exclusions
        if (twoYearExclusions === 'Yes') {
            qcupdatemodel.twoYearExclusions = true;
            qcupdatemodel.firstTwoYearExclusionsDetails = firstTwoYearExclusionsDetails;
        } else if (twoYearExclusions === 'No') {
            qcupdatemodel.twoYearExclusions = false;
        }

        // Hospitalization
        if (hospitalization === 'Yes') {
            qcupdatemodel.hospitalization = true;
        } else if (hospitalization === 'No') {
            qcupdatemodel.hospitalization = false;
            qcupdatemodel.hospitalizationJustifiedDetails = hospitalizationJustifiedDetails;
        }

        // Waiting Period
        if (waitingPeriod === 'Yes') {
            qcupdatemodel.waitingPeriod = true;
            qcupdatemodel.waitingPeriod30DaysDetails = waitingPeriod30DaysDetails;
        } else if (waitingPeriod === 'No') {
            qcupdatemodel.waitingPeriod = false;
        }

        // Age Cross Check
        if (ageCrossCheck === 'Yes') {
            qcupdatemodel.ageCrossCheck = true;
        } else if (ageCrossCheck === 'No') {
            qcupdatemodel.ageCrossCheck = false;
            qcupdatemodel.ageCrossCheckDetails = ageCrossCheckDetails;
        }

        // Converted Full Case
        if (convertedfullcase === 'Yes') {
            qcupdatemodel.isConvertedFullcase = true;
            qcupdatemodel.convertedFullcaseDetails = convertedfullcaseDescription;
        }

        try {
            const response = await QCUpdateService.addQCUpdate(qcupdatemodel, cleanInvId);
            if (response.statusCode === 0) {
                localStorage.setItem('qcUpdateID', response.payload.qcUpdateID);
                alertService.showAlertSuccess('QC Update Fields submitted successfully');
                if (onChangeTab) {
                    onChangeTab(true);
                }
            }
        } catch (error) {
            console.error('Error submitting QC update:', error);
            alertService.showAlertError('Error submitting QC update');
        }
    };

    return (
        <Box sx={{ mt: 1 }}>
            <Grid container spacing={3}>
                {/* Left Column */}
                <Grid size={{ xs: 12, md: 6 }}>
                    {/* Bill Inflation */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 8 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Any bill inflation Noted (Discount/ LOS / Procedure charges etc.)
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={billInflation}
                                        onChange={(e) => setBillInflation(e.target.value)}
                                        disabled={isDisabled}
                                    >
                                        {dropdownOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {billInflation === 'Yes' && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={billInflationDetails}
                                    onChange={(e) => setBillInflationDetails(e.target.value)}
                                    disabled={isDisabled}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Stay Confirmed */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 8 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    24 Hours stay confirmed?
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={stayConfirmed}
                                        onChange={(e) => setStayConfirmed(e.target.value)}
                                        disabled={isDisabled}
                                    >
                                        {dropdownOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {stayConfirmed === 'No' && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={stayConfirmedDetails}
                                    onChange={(e) => setStayConfirmedDetails(e.target.value)}
                                    disabled={isDisabled}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Any PED */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 8 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Any PED noted?
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={anyPED}
                                        onChange={(e) => setAnyPED(e.target.value)}
                                        disabled={isDisabled}
                                    >
                                        {dropdownOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {anyPED === 'Yes' && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={pedWaitingPeriodDetails}
                                    onChange={(e) => setPedWaitingPeriodDetails(e.target.value)}
                                    disabled={isDisabled}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Permanent Exclusions */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 8 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Any Permanent exclusions?
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={permanentExclusions}
                                        onChange={(e) => setPermanentExclusions(e.target.value)}
                                        disabled={isDisabled}
                                    >
                                        {dropdownOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {permanentExclusions === 'Yes' && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={anyPermanentExclusionDetails}
                                    onChange={(e) => setAnyPermanentExclusionDetails(e.target.value)}
                                    disabled={isDisabled}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Qualification Allopathy */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 8 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Treating doctor qualification- Allopathy?
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={qualificationAllopathy}
                                        onChange={(e) => setQualificationAllopathy(e.target.value)}
                                        disabled={isDisabled}
                                    >
                                        {dropdownOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {qualificationAllopathy === 'No' && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={qualificationAllopathyDetails}
                                    onChange={(e) => setQualificationAllopathyDetails(e.target.value)}
                                    disabled={isDisabled}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Discrepancies Observed */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 8 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Any discrepancies Observed
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={discrepanciesObserved}
                                        onChange={(e) => setDiscrepanciesObserved(e.target.value)}
                                        disabled={isDisabled}
                                    >
                                        {dropdownOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {discrepanciesObserved === 'Yes' && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={discrepanciesObservedDetails}
                                    onChange={(e) => setDiscrepanciesObservedDetails(e.target.value)}
                                    disabled={isDisabled}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Converted Full Case (Cashless only) */}
                    {claimsType === 'cashless' && (
                        <Box sx={{ mb: 2 }}>
                            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                                <Grid size={{ xs: 8 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        Is this converted to full case?
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={convertedfullcase}
                                            onChange={(e) => setConvertedfullcase(e.target.value)}
                                            disabled={isDisabled}
                                        >
                                            {dropdownOptions.map((opt) => (
                                                <MenuItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            {convertedfullcase === 'Yes' && (
                                <Box sx={{ mt: 1, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={convertedfullcaseDescription}
                                        onChange={(e) => setConvertedfullcaseDescription(e.target.value)}
                                        disabled={isDisabled}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                </Grid>

                {/* Right Column */}
                <Grid size={{ xs: 8, md: 6 }}>
                    {/* Hospitalization */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 8 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Is Hospitalization Justified?
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={hospitalization}
                                        onChange={(e) => setHospitalization(e.target.value)}
                                        disabled={isDisabled}
                                    >
                                        {dropdownOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {hospitalization === 'No' && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={hospitalizationJustifiedDetails}
                                    onChange={(e) => setHospitalizationJustifiedDetails(e.target.value)}
                                    disabled={isDisabled}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Hospital Criteria */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 8 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Hospital criteria fulfilled?
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={hospitalCriteriaFulfilled}
                                        onChange={(e) => setHospitalCriteriaFulfilled(e.target.value)}
                                        disabled={isDisabled}
                                    >
                                        {dropdownOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {hospitalCriteriaFulfilled === 'No' && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={hospitalCriteriaFulfilledDetails}
                                    onChange={(e) => setHospitalCriteriaFulfilledDetails(e.target.value)}
                                    disabled={isDisabled}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Two Year Exclusions */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 8 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Any first year exclusions?
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={twoYearExclusions}
                                        onChange={(e) => setTwoYearExclusions(e.target.value)}
                                        disabled={isDisabled}
                                    >
                                        {dropdownOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {twoYearExclusions === 'Yes' && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={firstTwoYearExclusionsDetails}
                                    onChange={(e) => setFirstTwoYearExclusionsDetails(e.target.value)}
                                    disabled={isDisabled}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Waiting Period */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 8 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    A 30 days waiting period
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={waitingPeriod}
                                        onChange={(e) => setWaitingPeriod(e.target.value)}
                                        disabled={isDisabled}
                                    >
                                        {dropdownOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {waitingPeriod === 'Yes' && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={waitingPeriod30DaysDetails}
                                    onChange={(e) => setWaitingPeriod30DaysDetails(e.target.value)}
                                    disabled={isDisabled}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Age Cross Check */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid size={{ xs: 8 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Age & ID proof cross checked?
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={ageCrossCheck}
                                        onChange={(e) => setAgeCrossCheck(e.target.value)}
                                        disabled={isDisabled}
                                    >
                                        {dropdownOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {ageCrossCheck === 'No' && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={ageCrossCheckDetails}
                                    onChange={(e) => setAgeCrossCheckDetails(e.target.value)}
                                    disabled={isDisabled}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Submit Button */}
                    {roleName !== 'Super Admin' && editAble === null && (
                        <Box sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onqcSubmit}
                                disabled={!buttonEnable}
                            >
                                Submit
                            </Button>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default QcupdateFields;