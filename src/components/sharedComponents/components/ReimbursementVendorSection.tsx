import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Radio,
    FormControlLabel,
    Divider,
} from '@mui/material';

interface VendorFeedback {
    agencyName: string;
    travellingExpenses: number;
    travellingExpensesApproval: string;
    travellingExpensesAppAmount: number;
    travellingExpensesReason: string;
    extraVisit: number;
    extraVisitApproval: string;
    extraVisitAppAmount: number;
    extraVisitReason: string;
    ipdMiscellaneous: number;
    ipdMiscellaneousApproval: string;
    ipdMiscellaneousAppAmount: number;
    ipdMiscellaneousReason: string;
    descriptionExpenses: string;
    totalAmountExpenses: number;
    tatFeedBack: string;
    qualityInvestigationFeedBack: string;
    fieldInvestigationFeedBack: string;
    overallFeedback: string;
    tatFeedBackReg?: string;
    qinvestFeedbackReg?: string;
    fieldFeedbackReg?: string;
    overallFeedbackReg?: string;
}

interface ReimbursementVendorSectionProps {
    vendors: VendorFeedback[];
    roleNameValue: string;
    isDisabled: boolean;
    onVendorChange: (index: number, field: string, value: any, approvalName?: string, decision?: string) => void;
}

const ReimbursementVendorSection: React.FC<ReimbursementVendorSectionProps> = ({
    vendors,
    roleNameValue,
    isDisabled,
    onVendorChange,
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

    const handleExpenseChange = (
        index: number,
        approval: string,
        expenseAmount: number,
        fieldName: string
    ) => {
        if (approval === 'yes') {
            onVendorChange(index, `${fieldName}AppAmount`, expenseAmount, `${fieldName}Approval`, approval);
        } else if (approval === 'no') {
            onVendorChange(index, `${fieldName}AppAmount`, 0, `${fieldName}Approval`, approval);
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            {vendors.map((vendor, idx) => (
                <Paper key={idx} sx={{ p: 3, mb: 3 }}>
                    {/* Agency Header */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#6F62C2' }}>
                            Agency Name: {vendor.agencyName}
                        </Typography>
                    </Box>

                    {/* Expenses Section */}
                    {roleNameValue === 'Regional Manager' && (
                        <>
                            {/* Expenses Header */}
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        Expense raised by vendor
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
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
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">Travelling Expenses</Typography>
                                            <Typography variant="body2">Rs {vendor.travellingExpenses}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Grid container spacing={1}>
                                            <Grid size={{ xs: 4 }}>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <FormControlLabel
                                                        control={
                                                            <Radio
                                                                size="small"
                                                                value="yes"
                                                                checked={vendor.travellingExpensesApproval === 'yes'}
                                                                onChange={(e) => {
                                                                    onVendorChange(idx, 'travellingExpensesApproval', e.target.value, `travellingExpensesApproval`, e.target.value);
                                                                    handleExpenseChange(idx, e.target.value, vendor.travellingExpenses, 'travellingExpenses');
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
                                                                checked={vendor.travellingExpensesApproval === 'no'}
                                                                onChange={(e) => {
                                                                    onVendorChange(idx, 'travellingExpensesApproval', e.target.value, `travellingExpensesApproval`, e.target.value);
                                                                    handleExpenseChange(idx, e.target.value, vendor.travellingExpenses, 'travellingExpenses');
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
                                                    value={vendor.travellingExpensesAppAmount}
                                                    onChange={(e) =>
                                                        onVendorChange(idx, 'travellingExpensesAppAmount', e.target.value)
                                                    }
                                                    disabled={vendor.travellingExpensesApproval === 'yes' || isDisabled}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="text"
                                                    value={vendor.travellingExpensesReason}
                                                    onChange={(e) =>
                                                        onVendorChange(idx, 'travellingExpensesReason', e.target.value)
                                                    }
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
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">Extra Visit</Typography>
                                            <Typography variant="body2">Rs {vendor.extraVisit}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Grid container spacing={1}>
                                            <Grid size={{ xs: 4 }}>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <FormControlLabel
                                                        control={
                                                            <Radio
                                                                size="small"
                                                                value="yes"
                                                                checked={vendor.extraVisitApproval === 'yes'}
                                                                onChange={(e) => {
                                                                    onVendorChange(idx, 'extraVisitApproval', e.target.value, `extraVisitApproval`, e.target.value);
                                                                    handleExpenseChange(idx, e.target.value, vendor.extraVisit, 'extraVisit');
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
                                                                checked={vendor.extraVisitApproval === 'no'}
                                                                onChange={(e) => {
                                                                    onVendorChange(idx, 'extraVisitApproval', e.target.value, `extraVisitApproval`, e.target.value);
                                                                    handleExpenseChange(idx, e.target.value, vendor.extraVisit, 'extraVisit');
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
                                                    value={vendor.extraVisitAppAmount}
                                                    onChange={(e) => onVendorChange(idx, 'extraVisitAppAmount', e.target.value)}
                                                    disabled={vendor.extraVisitApproval === 'yes' || isDisabled}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="text"
                                                    value={vendor.extraVisitReason}
                                                    onChange={(e) => onVendorChange(idx, 'extraVisitReason', e.target.value)}
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
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">IPD & Miscellaneous</Typography>
                                            <Typography variant="body2">Rs {vendor.ipdMiscellaneous}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Grid container spacing={1}>
                                            <Grid size={{ xs: 4 }}>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <FormControlLabel
                                                        control={
                                                            <Radio
                                                                size="small"
                                                                value="yes"
                                                                checked={vendor.ipdMiscellaneousApproval === 'yes'}
                                                                onChange={(e) => {
                                                                    onVendorChange(idx, 'ipdMiscellaneousApproval', e.target.value, `ipdMiscellaneousApproval`, e.target.value);
                                                                    handleExpenseChange(idx, e.target.value, vendor.ipdMiscellaneous, 'ipdMiscellaneous');
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
                                                                checked={vendor.ipdMiscellaneousApproval === 'no'}
                                                                onChange={(e) => {
                                                                    onVendorChange(idx, 'ipdMiscellaneousApproval', e.target.value, `ipdMiscellaneousApproval`, e.target.value);
                                                                    handleExpenseChange(idx, e.target.value, vendor.ipdMiscellaneous, 'ipdMiscellaneous');
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
                                                    value={vendor.ipdMiscellaneousAppAmount}
                                                    onChange={(e) =>
                                                        onVendorChange(idx, 'ipdMiscellaneousAppAmount', e.target.value)
                                                    }
                                                    disabled={vendor.ipdMiscellaneousApproval === 'yes' || isDisabled}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="text"
                                                    value={vendor.ipdMiscellaneousReason}
                                                    onChange={(e) =>
                                                        onVendorChange(idx, 'ipdMiscellaneousReason', e.target.value)
                                                    }
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
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">Description</Typography>
                                            <Typography variant="body2">{vendor.descriptionExpenses}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                Total Expenses
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                Rs {vendor.totalAmountExpenses}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider sx={{ my: 2 }} />
                        </>
                    )}

                    {/* Vendor Feedback Section */}
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            {/* Labels */}
                            <Grid size={{ xs: 12, md: 3 }}>
                                <Paper sx={{ p: 2, bgcolor: '#F3F4F6' }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
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

                            {/* Regional Ratings (if Central Manager) */}
                            {roleNameValue === 'Central Manager' && (
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Paper sx={{ p: 2, bgcolor: '#F3F4F6' }}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                                                Reg. QC Rating
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            {vendor.tatFeedBackReg || '-'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            {vendor.qinvestFeedbackReg || '-'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            {vendor.fieldFeedbackReg || '-'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            {vendor.overallFeedbackReg || '-'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}

                            {/* Central QC Rating (Editable) */}
                            <Grid size={{ xs: 12, md: roleNameValue === 'Central Manager' ? 6 : 9 }}>
                                <Paper sx={{ p: 2, bgcolor: '#FFFFFF' }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                                            Central QC Rating
                                        </Typography>
                                    </Box>

                                    {/* TAT */}
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            {tatOptions.map((option) => (
                                                <FormControlLabel
                                                    key={option.value}
                                                    control={
                                                        <Radio
                                                            size="small"
                                                            value={option.value}
                                                            checked={vendor.tatFeedBack === option.value}
                                                            onChange={(e) => onVendorChange(idx, 'tatFeedBack', e.target.value)}
                                                            disabled={isDisabled}
                                                        />
                                                    }
                                                    label={option.label}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    {/* Quality Investigation */}
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            {ratingOptions.map((option) => (
                                                <FormControlLabel
                                                    key={option.value}
                                                    control={
                                                        <Radio
                                                            size="small"
                                                            value={option.value}
                                                            checked={vendor.qualityInvestigationFeedBack === option.value}
                                                            onChange={(e) =>
                                                                onVendorChange(idx, 'qualityInvestigationFeedBack', e.target.value)
                                                            }
                                                            disabled={isDisabled}
                                                        />
                                                    }
                                                    label={option.label}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    {/* Field Investigation */}
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            {ratingOptions.map((option) => (
                                                <FormControlLabel
                                                    key={option.value}
                                                    control={
                                                        <Radio
                                                            size="small"
                                                            value={option.value}
                                                            checked={vendor.fieldInvestigationFeedBack === option.value}
                                                            onChange={(e) =>
                                                                onVendorChange(idx, 'fieldInvestigationFeedBack', e.target.value)
                                                            }
                                                            disabled={isDisabled}
                                                        />
                                                    }
                                                    label={option.label}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    {/* Overall Feedback */}
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            {ratingOptions.map((option) => (
                                                <FormControlLabel
                                                    key={option.value}
                                                    control={
                                                        <Radio
                                                            size="small"
                                                            value={option.value}
                                                            checked={vendor.overallFeedback === option.value}
                                                            onChange={(e) =>
                                                                onVendorChange(idx, 'overallFeedback', e.target.value)
                                                            }
                                                            disabled={isDisabled}
                                                        />
                                                    }
                                                    label={option.label}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default ReimbursementVendorSection;