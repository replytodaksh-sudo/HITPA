import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Radio,
    FormControlLabel,
} from '@mui/material';

interface CashlessVendorSectionProps {
    // Expenses
    travellingExpenses: number | string;
    travellingExpensesApproval: string;
    travellingExpensesAppAmount: number | string;
    travellingExpensesReason: string;
    onTravellingApprovalChange: (value: string) => void;
    onTravellingAmountChange: (value: string) => void;
    onTravellingReasonChange: (value: string) => void;

    extraVisit: number | string;
    extraVisitApproval: string;
    extraVisitAppAmount: number | string;
    extraVisitReason: string;
    onExtraVisitApprovalChange: (value: string) => void;
    onExtraVisitAmountChange: (value: string) => void;
    onExtraVisitReasonChange: (value: string) => void;

    ipdMiscellaneous: number | string;
    ipdMiscellaneousApproval: string;
    ipdMiscellaneousAppAmount: number | string;
    ipdMiscellaneousReason: string;
    onIpdApprovalChange: (value: string) => void;
    onIpdAmountChange: (value: string) => void;
    onIpdReasonChange: (value: string) => void;

    descriptionExpenses: string;
    totalAmountExpenses: number | string;

    // Feedback
    tatFeedback: string;
    qualityInvestigation: string;
    fieldInvestigation: string;
    overallFeedback: string;
    onTatChange: (value: string) => void;
    onQualityChange: (value: string) => void;
    onFieldChange: (value: string) => void;
    onOverallChange: (value: string) => void;

    // Regional Ratings (if applicable)
    showRegionalRatings?: boolean;
    tatRegional?: string;
    qualityRegional?: string;
    fieldRegional?: string;
    overallRegional?: string;

    roleNameValue: string;
    isDisabled: boolean;
}

const ratingOptions = [
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Average', label: 'Average' },
    { value: 'Poor', label: 'Poor' },
];

const tatOptions = [
    { value: 'Satisfactory', label: 'Satisfactory' },
    { value: 'Not Satisfactory', label: 'Not Satisfactory' },
];

const CashlessVendorSection: React.FC<CashlessVendorSectionProps> = ({
    travellingExpenses,
    travellingExpensesApproval,
    travellingExpensesAppAmount,
    travellingExpensesReason,
    onTravellingApprovalChange,
    onTravellingAmountChange,
    onTravellingReasonChange,
    extraVisit,
    extraVisitApproval,
    extraVisitAppAmount,
    extraVisitReason,
    onExtraVisitApprovalChange,
    onExtraVisitAmountChange,
    onExtraVisitReasonChange,
    ipdMiscellaneous,
    ipdMiscellaneousApproval,
    ipdMiscellaneousAppAmount,
    ipdMiscellaneousReason,
    onIpdApprovalChange,
    onIpdAmountChange,
    onIpdReasonChange,
    descriptionExpenses,
    totalAmountExpenses,
    tatFeedback,
    qualityInvestigation,
    fieldInvestigation,
    overallFeedback,
    onTatChange,
    onQualityChange,
    onFieldChange,
    onOverallChange,
    showRegionalRatings = false,
    tatRegional,
    qualityRegional,
    fieldRegional,
    overallRegional,
    roleNameValue,
    isDisabled,
}) => {
    const ratingOptions = [
        { value: 'Excellent', label: 'Excellent' },
        { value: 'Good', label: 'Good' },
        { value: 'Average', label: 'Average' },
        { value: 'Poor', label: 'Poor' },
    ];

    const tatOptions = [
        { value: 'Satisfactory', label: 'Satisfactory' },
        { value: 'Not Satisfactory', label: 'Not Satisfactory' },
    ];

    const handleExpenseApprovalChange = (
        approval: string,
        expenseAmount: number | string,
        onAmountChange: (value: string) => void
    ) => {
        if (approval === 'yes') {
            onAmountChange(String(expenseAmount));
        } else if (approval === 'no') {
            onAmountChange('0');
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            {/* Regional Manager View - Shows Expenses */}
            {roleNameValue === 'Regional Manager' && (
                <>
                    {/* Expenses Header */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                Expense raised by vendor
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 4 }} sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                                        Approval
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 4 }} sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                                        Approved Amount
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 4 }} sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                                        Reason/Justifications
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Travelling Expenses */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Travelling Expenses</Typography>
                                    <Typography variant="body2">Rs {travellingExpenses}</Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Grid container spacing={1}>
                                    <Grid size={{ xs: 4 }}>
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        size="small"
                                                        value="yes"
                                                        checked={travellingExpensesApproval === 'yes'}
                                                        onChange={(e) => {
                                                            onTravellingApprovalChange(e.target.value);
                                                            handleExpenseApprovalChange(
                                                                e.target.value,
                                                                travellingExpenses,
                                                                onTravellingAmountChange
                                                            );
                                                        }}
                                                        disabled={isDisabled}
                                                    />
                                                }
                                                label="Yes"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        size="small"
                                                        value="no"
                                                        checked={travellingExpensesApproval === 'no'}
                                                        onChange={(e) => {
                                                            onTravellingApprovalChange(e.target.value);
                                                            handleExpenseApprovalChange(
                                                                e.target.value,
                                                                travellingExpenses,
                                                                onTravellingAmountChange
                                                            );
                                                        }}
                                                        disabled={isDisabled}
                                                    />
                                                }
                                                label="No"
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 4 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="text"
                                            value={travellingExpensesAppAmount}
                                            onChange={(e) => onTravellingAmountChange(e.target.value)}
                                            disabled={travellingExpensesApproval === 'yes' || isDisabled}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 4 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="text"
                                            value={travellingExpensesReason}
                                            onChange={(e) => onTravellingReasonChange(e.target.value)}
                                            disabled={isDisabled}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Extra Visit */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Extra Visit</Typography>
                                    <Typography variant="body2">Rs {extraVisit}</Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Grid container spacing={1}>
                                    <Grid size={{ xs: 4 }}>
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        size="small"
                                                        value="yes"
                                                        checked={extraVisitApproval === 'yes'}
                                                        onChange={(e) => {
                                                            onExtraVisitApprovalChange(e.target.value);
                                                            handleExpenseApprovalChange(
                                                                e.target.value,
                                                                extraVisit,
                                                                onExtraVisitAmountChange
                                                            );
                                                        }}
                                                        disabled={isDisabled}
                                                    />
                                                }
                                                label="Yes"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        size="small"
                                                        value="no"
                                                        checked={extraVisitApproval === 'no'}
                                                        onChange={(e) => {
                                                            onExtraVisitApprovalChange(e.target.value);
                                                            handleExpenseApprovalChange(
                                                                e.target.value,
                                                                extraVisit,
                                                                onExtraVisitAmountChange
                                                            );
                                                        }}
                                                        disabled={isDisabled}
                                                    />
                                                }
                                                label="No"
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 4 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="text"
                                            value={extraVisitAppAmount}
                                            onChange={(e) => onExtraVisitAmountChange(e.target.value)}
                                            disabled={extraVisitApproval === 'yes' || isDisabled}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 4 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="text"
                                            value={extraVisitReason}
                                            onChange={(e) => onExtraVisitReasonChange(e.target.value)}
                                            disabled={isDisabled}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* IPD & Miscellaneous */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">IPD & Miscellaneous</Typography>
                                    <Typography variant="body2">Rs {ipdMiscellaneous}</Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Grid container spacing={1}>
                                    <Grid size={{ xs: 4 }}>
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        size="small"
                                                        value="yes"
                                                        checked={ipdMiscellaneousApproval === 'yes'}
                                                        onChange={(e) => {
                                                            onIpdApprovalChange(e.target.value);
                                                            handleExpenseApprovalChange(
                                                                e.target.value,
                                                                ipdMiscellaneous,
                                                                onIpdAmountChange
                                                            );
                                                        }}
                                                        disabled={isDisabled}
                                                    />
                                                }
                                                label="Yes"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        size="small"
                                                        value="no"
                                                        checked={ipdMiscellaneousApproval === 'no'}
                                                        onChange={(e) => {
                                                            onIpdApprovalChange(e.target.value);
                                                            handleExpenseApprovalChange(
                                                                e.target.value,
                                                                ipdMiscellaneous,
                                                                onIpdAmountChange
                                                            );
                                                        }}
                                                        disabled={isDisabled}
                                                    />
                                                }
                                                label="No"
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 4 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="text"
                                            value={ipdMiscellaneousAppAmount}
                                            onChange={(e) => onIpdAmountChange(e.target.value)}
                                            disabled={ipdMiscellaneousApproval === 'yes' || isDisabled}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 4 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="text"
                                            value={ipdMiscellaneousReason}
                                            onChange={(e) => onIpdReasonChange(e.target.value)}
                                            disabled={isDisabled}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Description and Total */}
                    <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Description</Typography>
                                    <Typography variant="body2">{descriptionExpenses}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        Total Expenses
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        Rs {totalAmountExpenses}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}


            <Box>
                <Grid container spacing={3}>
                    {/* Labels Column */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper sx={{ p: 2, bgcolor: '#F3F4F6', height: '100%' }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                                    Vendor Feedback
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                TAT
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Quality of Investigation Report
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Field investigation quality
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Evidence/Document Quality
                            </Typography>
                        </Paper>
                    </Grid>
                    {showRegionalRatings && (
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Paper sx={{ p: 2, bgcolor: '#F3F4F6', height: '100%' }}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                                        Reg. QC Rating
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {tatRegional || '-'}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {qualityRegional || '-'}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {fieldRegional || '-'}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {overallRegional || '-'}
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                    <Grid size={{ xs: 12, md: showRegionalRatings ? 6 : 9 }}>
                        <Paper sx={{ p: 2, bgcolor: '#F3F4F6', height: '100%' }}>
                            <Box sx={{ mb: 2, height: "22px" }}>
                                {/* <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                                    Central QC Rating
                                </Typography> */}
                            </Box>
                            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
                                {tatOptions.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        sx={{ height: "22px" }}
                                        control={
                                            <Radio
                                                size="small"
                                                value={option.value}
                                                checked={tatFeedback === option.value}
                                                onChange={(e) => onTatChange(e.target.value)}
                                                disabled={isDisabled}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">{option.label}</Typography>
                                        }
                                    />
                                ))}
                            </Box>
                            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {ratingOptions.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        sx={{ height: "22px" }}
                                        control={
                                            <Radio
                                                size="small"
                                                value={option.value}
                                                checked={qualityInvestigation === option.value}
                                                onChange={(e) => onQualityChange(e.target.value)}
                                                disabled={isDisabled}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">{option.label}</Typography>
                                        }
                                    />
                                ))}
                            </Box>
                            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {ratingOptions.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        sx={{ height: "22px" }}
                                        control={
                                            <Radio
                                                size="small"
                                                value={option.value}
                                                checked={fieldInvestigation === option.value}
                                                onChange={(e) => onFieldChange(e.target.value)}
                                                disabled={isDisabled}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">{option.label}</Typography>
                                        }
                                    />
                                ))}
                            </Box>
                            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {ratingOptions.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        sx={{ height: "22px" }}
                                        control={
                                            <Radio
                                                size="small"
                                                value={option.value}
                                                checked={overallFeedback === option.value}
                                                onChange={(e) => onOverallChange(e.target.value)}
                                                disabled={isDisabled}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">{option.label}</Typography>
                                        }
                                    />
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>



            {/* <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper sx={{ p: 2, bgcolor: '#F3F4F6', height: '100%' }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                                    Vendor Feedback
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                TAT
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Quality of Investigation Report
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Field investigation quality
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Evidence/Document Quality
                            </Typography>
                        </Paper>
                    </Grid>

                    {showRegionalRatings && (
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Paper sx={{ p: 2, bgcolor: '#F3F4F6', height: '100%' }}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                                        Reg. QC Rating
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {tatRegional || '-'}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {qualityRegional || '-'}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {fieldRegional || '-'}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {overallRegional || '-'}
                                </Typography>
                            </Paper>
                        </Grid>
                    )}

                    <Grid
                        size={{ xs: 12, md: showRegionalRatings ? 6 : 9 }}
                    // item
                    // xs={12}
                    // md={showRegionalRatings ? 6 : 9}
                    >
                        <Paper sx={{ p: 2, bgcolor: '#FFFFFF', height: '100%' }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                                    Central QC Rating
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {tatOptions.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        control={
                                            <Radio
                                                size="small"
                                                value={option.value}
                                                checked={tatFeedback === option.value}
                                                onChange={(e) => onTatChange(e.target.value)}
                                                disabled={isDisabled}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">{option.label}</Typography>
                                        }
                                    />
                                ))}
                            </Box>

                            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {ratingOptions.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        control={
                                            <Radio
                                                size="small"
                                                value={option.value}
                                                checked={qualityInvestigation === option.value}
                                                onChange={(e) => onQualityChange(e.target.value)}
                                                disabled={isDisabled}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">{option.label}</Typography>
                                        }
                                    />
                                ))}
                            </Box>

                            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {ratingOptions.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        control={
                                            <Radio
                                                size="small"
                                                value={option.value}
                                                checked={fieldInvestigation === option.value}
                                                onChange={(e) => onFieldChange(e.target.value)}
                                                disabled={isDisabled}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">{option.label}</Typography>
                                        }
                                    />
                                ))}
                            </Box>

                            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {ratingOptions.map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        control={
                                            <Radio
                                                size="small"
                                                value={option.value}
                                                checked={overallFeedback === option.value}
                                                onChange={(e) => onOverallChange(e.target.value)}
                                                disabled={isDisabled}
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">{option.label}</Typography>
                                        }
                                    />
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box> */}


        </Box>
    );
};

export default CashlessVendorSection;