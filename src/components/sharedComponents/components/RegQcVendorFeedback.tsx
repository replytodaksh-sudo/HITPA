// src/components/QcPreview/components/RegQcVendorFeedback.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';

interface RegQcVendorFeedbackProps {
  previewValues?: any;
  previewValuesReim?: any;
  previewRefresh?: boolean;
}

const RegQcVendorFeedback: React.FC<RegQcVendorFeedbackProps> = ({
  previewValues,
  previewValuesReim,
  previewRefresh,
}) => {
  const [searchParams] = useSearchParams();
  const claimsType = searchParams.get('claimsType') || 'cashless';
  const roleName = sessionStorage.getItem('roleName') || '';

  const [vendorFeedbackArr, setVendorFeedbackArr] = useState<any[]>([]);

  useEffect(() => {
    if (previewValuesReim?.splitVendorFeedbackDTOs) {
      setVendorFeedbackArr(previewValuesReim.splitVendorFeedbackDTOs);
    }
  }, [previewValuesReim]);

  // Render row helper
  const VendorRow = ({ label, value }: { label: string; value?: string | number }) => (
    <Grid container sx={{ mb: 2 }}>
      <Grid size={{ xs: 3 }}>
        <Typography variant="body2">{label}</Typography>
      </Grid>
      <Grid size={{ xs: 3 }}>
        <Typography variant="body2" fontWeight={600}>
          {value || '-'}
        </Typography>
      </Grid>
      <Grid size={{ xs: 2 }} />
      <Grid size={{ xs: 4 }} />
    </Grid>
  );

  // Render expense row with approval status
  const ExpenseRow = ({
    label,
    amount,
    approval,
    approvedAmount,
    reason,
  }: {
    label: string;
    amount?: number;
    approval?: string;
    approvedAmount?: number;
    reason?: string;
  }) => (
    <Grid container sx={{ mb: 2 }}>
      <Grid size={{ xs: 3 }}>
        <Typography variant="body2">{label}</Typography>
      </Grid>
      <Grid size={{ xs: 3 }}>
        <Typography variant="body2">Rs. {amount || 0}</Typography>
      </Grid>
      <Grid size={{ xs: 2 }}>
        {approval === 'yes' && (
          <Typography variant="body2" color="success.main">
            Approved
          </Typography>
        )}
        {approval === 'no' && (
          <>
            <Typography variant="body2" color="error.main">
              Not Approved
            </Typography>
            <Typography variant="caption">
              Approved Amount: Rs. {approvedAmount}
            </Typography>
          </>
        )}
      </Grid>
      <Grid size={{ xs: 4 }}>
        <Typography variant="body2">{reason || '-'}</Typography>
      </Grid>
    </Grid>
  );

  // ========== REGIONAL MANAGER - CASHLESS ==========
  if (claimsType === 'cashless' && roleName === 'Regional Manager') {
    return (
      <Box sx={{ mt: 2 }}>
        <Card>
          <CardContent>
            {/* Header Row */}
            <Grid container sx={{ mb: 2, fontWeight: 700 }}>
              <Grid size={{ xs: 3 }}>
                Expenses Raised By Vendor
              </Grid>
              <Grid size={{ xs: 3 }} />
              <Grid size={{ xs: 2 }}>
                Status
              </Grid>
              <Grid size={{ xs: 4 }}>
                Reason /Justification
              </Grid>
            </Grid>

            <Divider sx={{ mb: 2 }} />

            {/* Expense Rows */}
            <ExpenseRow
              label="Travelling Expenses"
              amount={previewValues?.travellingExpenses}
              approval={previewValues?.travellingExpensesApproval}
              approvedAmount={previewValues?.travellingExpensesAppAmount}
              reason={previewValues?.travellingExpensesReason}
            />

            <ExpenseRow
              label="Extra Visit"
              amount={previewValues?.extraVisit}
              approval={previewValues?.extraVisitApproval}
              approvedAmount={previewValues?.extraVisitAppAmount}
              reason={previewValues?.extraVisitReason}
            />

            <ExpenseRow
              label="IPD & Miscellaneous Descriptions"
              amount={previewValues?.ipdMiscellaneous}
              approval={previewValues?.ipdMiscellaneousApproval}
              approvedAmount={previewValues?.ipdMiscellaneousAppAmount}
              reason={previewValues?.ipdMiscellaneousReason}
            />

            <VendorRow label="Descriptions" value={previewValues?.descriptionExpenses} />

            <Divider sx={{ my: 2 }} />

            <Grid container sx={{ mb: 2, fontWeight: 700 }}>
              <Grid size={{ xs: 3 }}>
                Total Expenses
              </Grid>
              <Grid size={{ xs: 3 }}>
                <Typography variant="body1" fontWeight={700} color="primary">
                  Rs. {previewValues?.totalAmountExpenses || 0}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Vendor Feedback Section */}
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Vendor Feedback
            </Typography>

            {previewValues && (
              <>
                <VendorRow label="TAT" value={previewValues.tatFeedBack} />
                <VendorRow
                  label="Quality of Investigation Report"
                  value={previewValues.qualityInvestigationFeedBack}
                />
                <VendorRow
                  label="Field investigation quality"
                  value={previewValues.fieldInvestigationFeedBack}
                />
                <VendorRow label="Overall Feedback" value={previewValues.overallFeedback} />
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  }

  // ========== REGIONAL MANAGER - REIMBURSEMENT ==========
  if (
    vendorFeedbackArr.length !== 0 &&
    claimsType === 'reim' &&
    roleName === 'Regional Manager'
  ) {
    return (
      <Box sx={{ mt: 2 }}>
        {vendorFeedbackArr.map((vendorFeedback, index) => (
          <Card key={index} sx={{ mb: 3 }}>
            <CardContent>
              {/* Agency Name */}
              <Typography
                variant="h6"
                sx={{ color: '#6F62C2', fontWeight: 700, mb: 2 }}
              >
                Agency Name: {vendorFeedback.agencyName}
              </Typography>

              {/* Header Row */}
              <Grid container sx={{ mb: 2, fontWeight: 700 }}>
                <Grid size={{ xs: 3 }}>
                  Expenses Raised By Vendor
                </Grid>
                <Grid size={{ xs: 3 }} />
                <Grid size={{ xs: 2 }}>
                  Status
                </Grid>
                <Grid size={{ xs: 4 }}>
                  Reason /Justification
                </Grid>
              </Grid>

              <Divider sx={{ mb: 2 }} />

              {/* Expense Rows */}
              <ExpenseRow
                label="Travelling Expenses"
                amount={vendorFeedback.travellingExpenses}
                approval={vendorFeedback.travellingExpensesApproval}
                approvedAmount={vendorFeedback.travellingExpensesAppAmount}
                reason={vendorFeedback.travellingExpensesReason}
              />

              <ExpenseRow
                label="Extra Visit"
                amount={vendorFeedback.extraVisit}
                approval={vendorFeedback.extraVisitApproval}
                approvedAmount={vendorFeedback.extraVisitAppAmount}
                reason={vendorFeedback.extraVisitReason}
              />

              <ExpenseRow
                label="IPD & Miscellaneous"
                amount={vendorFeedback.ipdMiscellaneous}
                approval={vendorFeedback.ipdMiscellaneousApproval}
                approvedAmount={vendorFeedback.ipdMiscellaneousAppAmount}
                reason={vendorFeedback.ipdMiscellaneousReason}
              />

              <VendorRow
                label="Descriptions"
                value={vendorFeedback.descriptionExpenses}
              />

              <Divider sx={{ my: 2 }} />

              <Grid container sx={{ mb: 2, fontWeight: 700 }}>
                <Grid size={{ xs: 3 }}>
                  Total Expenses
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Typography variant="body1" fontWeight={700} color="primary">
                    Rs. {vendorFeedback.totalAmountExpenses || 0}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Vendor Feedback */}
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Vendor Feedback
              </Typography>

              <VendorRow label="TAT" value={vendorFeedback.tatFeedBack} />
              <VendorRow
                label="Quality of Investigation Report"
                value={vendorFeedback.qualityInvestigationFeedBack}
              />
              <VendorRow
                label="Field investigation quality"
                value={vendorFeedback.fieldInvestigationFeedBack}
              />
              <VendorRow
                label="Overall Feedback"
                value={vendorFeedback.overallFeedback}
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // ========== CENTRAL MANAGER - CASHLESS ==========
  if (claimsType === 'cashless' && roleName === 'Central Manager') {
    return (
      <Box sx={{ mt: 2 }}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              {/* Labels Column */}
              <Grid size={{ xs: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  Vendor Feedback
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">TAT</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Quality of Investigation Report</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Field investigation quality</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Overall Feedback</Typography>
                </Box>
              </Grid>

              {/* Reg. QC Rating Column */}
              <Grid size={{ xs: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  Reg. QC Rating
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">{previewValues?.tatFeedBackReg}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    {previewValues?.qinvestFeedbackReg}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">{previewValues?.fieldFeedbackReg}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    {previewValues?.overallFeedbackReg}
                  </Typography>
                </Box>
              </Grid>

              {/* Central QC Rating Column */}
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  Central QC Rating
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">{previewValues?.tatFeedBack}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    {previewValues?.qualityInvestigationFeedBack}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    {previewValues?.fieldInvestigationFeedBack}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">{previewValues?.overallFeedback}</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // ========== CENTRAL MANAGER - REIMBURSEMENT ==========
  if (
    roleName === 'Central Manager' &&
    vendorFeedbackArr.length !== 0 &&
    claimsType === 'reim'
  ) {
    return (
      <Box sx={{ mt: 2 }}>
        {vendorFeedbackArr.map((previewVal, index) => (
          <Card key={index} sx={{ mb: 3 }}>
            <CardContent>
              {/* Agency Name */}
              <Typography
                variant="h6"
                sx={{ color: '#6F62C2', fontWeight: 700, mb: 2 }}
              >
                Agency Name: {previewVal.agencyName}
              </Typography>

              <Grid container spacing={2}>
                {/* Labels Column */}
                <Grid size={{ xs: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                    Vendor Feedback
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">TAT</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      Quality of Investigation Report
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Field investigation quality</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Overall Feedback</Typography>
                  </Box>
                </Grid>

                {/* Central QC Rating Column */}
                <Grid size={{ xs: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                    Central QC Rating
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">{previewVal.tatFeedBackReg}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {previewVal.qinvestFeedbackReg}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {previewVal.qinvestFeedbackReg}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {previewVal.overallFeedbackReg}
                    </Typography>
                  </Box>
                </Grid>

                {/* Reg. QC Rating Column */}
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                    Reg. QC Rating
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">{previewVal.tatFeedBack}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {previewVal.qualityInvestigationFeedBack}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {previewVal.fieldInvestigationFeedBack}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">{previewVal.overallFeedback}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return null;
};

export default RegQcVendorFeedback;