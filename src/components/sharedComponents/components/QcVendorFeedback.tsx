import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import ReimbursementVendorSection from './ReimbursementVendorSection';
import CashlessVendorSection from './CashlessVendorSection';
import alertService from '../../../services/alertService';
import QCUpdateService from '../../../services/qcupdate.service';

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

interface QcVendorFeedbackProps {
  previewValues?: any;
  previewValues2?: any;
  buttonEnable?: boolean;
  onChangeTab?: (value: boolean) => void;
}

const QcVendorFeedback: React.FC<QcVendorFeedbackProps> = ({
  previewValues = null,
  previewValues2 = null,
  buttonEnable = false,
  onChangeTab,
}) => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();

  // State - General
  const [claimsType, setClaimsType] = useState('');
  const [roleName, setRoleName] = useState('');
  const [editAble, setEditAble] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [vendorFeedbackArr, setVendorFeedbackArr] = useState<VendorFeedback[]>([]);

  // State - Cashless Single Vendor
  const [travellingExpenses, setTravellingExpenses] = useState<number | string>(0);
  const [travellingExpensesApproval, setTravellingExpensesApproval] = useState('');
  const [travellingExpensesAppAmount, setTravellingExpensesAppAmount] = useState<number | string>(0);
  const [travellingExpensesReason, setTravellingExpensesReason] = useState('');

  const [extraVisit, setExtraVisit] = useState<number | string>(0);
  const [extraVisitApproval, setExtraVisitApproval] = useState('');
  const [extraVisitAppAmount, setExtraVisitAppAmount] = useState<number | string>(0);
  const [extraVisitReason, setExtraVisitReason] = useState('');

  const [ipdMiscellaneous, setIpdMiscellaneous] = useState<number | string>(0);
  const [ipdMiscellaneousApproval, setIpdMiscellaneousApproval] = useState('');
  const [ipdMiscellaneousAppAmount, setIpdMiscellaneousAppAmount] = useState<number | string>(0);
  const [ipdMiscellaneousReason, setIpdMiscellaneousReason] = useState('');

  const [descriptionExpenses, setDescriptionExpenses] = useState('');
  const [totalAmountExpenses, setTotalAmountExpenses] = useState<number | string>(0);

  // State - Feedback Ratings
  const [tatFeedBack, setTatFeedBack] = useState('');
  const [qualityInvestigationReport, setQualityInvestigationReport] = useState('');
  const [fieldInvestigationQuality, setFieldInvestigationQuality] = useState('');
  const [overallFeedback, setOverallFeedback] = useState('');

  // State - Regional Ratings (for Central Manager view)
  const [tatFeedBackReg, setTatFeedBackReg] = useState('');
  const [qinvestFeedbackReg, setQinvestFeedbackReg] = useState('');
  const [fieldFeedbackReg, setFieldFeedbackReg] = useState('');
  const [overallFeedbackReg, setOverallFeedbackReg] = useState('');

  const isDisabled = editAble !== null && editAble === 'Non-Editable';

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
    // Feedback Ratings
    setTatFeedBack(values.tatFeedBack || '');
    setQualityInvestigationReport(values.qualityInvestigationFeedBack || '');
    setFieldInvestigationQuality(values.fieldInvestigationFeedBack || '');
    setOverallFeedback(values.overallFeedback || '');

    // Regional Ratings
    setTatFeedBackReg(values.tatFeedBackReg || '');
    setQinvestFeedbackReg(values.qinvestFeedbackReg || '');
    setFieldFeedbackReg(values.fieldFeedbackReg || '');
    setOverallFeedbackReg(values.overallFeedbackReg || '');

    // Cashless Expenses
    setTravellingExpenses(values.travellingExpenses || 0);
    setTravellingExpensesApproval(values.travellingExpensesApproval || '');
    setTravellingExpensesAppAmount(values.travellingExpensesAppAmount || 0);
    setTravellingExpensesReason(values.travellingExpensesReason || '');

    setExtraVisit(values.extraVisit || 0);
    setExtraVisitApproval(values.extraVisitApproval || '');
    setExtraVisitAppAmount(values.extraVisitAppAmount || 0);
    setExtraVisitReason(values.extraVisitReason || '');

    setIpdMiscellaneous(values.ipdMiscellaneous || 0);
    setIpdMiscellaneousApproval(values.ipdMiscellaneousApproval || '');
    setIpdMiscellaneousAppAmount(values.ipdMiscellaneousAppAmount || 0);
    setIpdMiscellaneousReason(values.ipdMiscellaneousReason || '');

    setDescriptionExpenses(values.descriptionExpenses || '');
    setTotalAmountExpenses(values.totalAmountExpenses || 0);

    // Reimbursement Vendors
    if (values.splitVendorFeedbackDTOs && Array.isArray(values.splitVendorFeedbackDTOs)) {
      setVendorFeedbackArr(values.splitVendorFeedbackDTOs);
    }
  };

  const handleVendorChange = (index: number, field: string, value: any, approvalName?: string, decision?: string) => {
    const updatedVendors = [...vendorFeedbackArr];
    updatedVendors[index] = {
      ...updatedVendors[index],
      [field]: value,
      ...(approvalName && { [approvalName]: decision }),
    };
    setVendorFeedbackArr(updatedVendors);
  };
  

  // Validation for reimbursement split case allocation
  const validateReimbursementSubmission = (): boolean => {
    if (previewValues?.investigationType === 'Split case allocation') {
      const allDone =
        previewValues?.hospitalVisitStatus === 'Done' &&
        previewValues?.insuredVisitStatus === 'Done' &&
        previewValues?.employerVisitStatus === 'Done';

      if (!allDone && roleName !== 'Central Manager') {
        let message = '';
        if (previewValues?.hospitalVisitStatus === 'Pending' || previewValues?.hospitalVisitStatus === '' || previewValues?.hospitalVisitStatus === null) {
          message += 'Hospital Visit Pending ';
        }
        if (previewValues?.insuredVisitStatus === 'Pending' || previewValues?.insuredVisitStatus === '' || previewValues?.insuredVisitStatus === null) {
          message += 'Insured Visit Pending ';
        }
        if (previewValues?.employerVisitStatus === 'Pending' || previewValues?.employerVisitStatus === '' || previewValues?.employerVisitStatus === null) {
          message += 'Employer Visit Pending ';
        }
        alertService.showAlertError(message);
        return false;
      }
    }
    return true;
  };

  const handleCashlessSubmit = async () => {
    setLoading(true);
    const cleanInvId = investigationId?.split(' ')[0] || '';

    const payload: any = {
      tatFeedBack,
      qualityInvestigationFeedBack: qualityInvestigationReport,
      fieldInvestigationFeedBack: fieldInvestigationQuality,
      overallFeedback,
      travellingExpenses,
      travellingExpensesApproval,
      travellingExpensesReason,
      travellingExpensesAppAmount,
      extraVisit,
      extraVisitAppAmount,
      extraVisitApproval,
      extraVisitReason,
      ipdMiscellaneous,
      ipdMiscellaneousAppAmount,
      ipdMiscellaneousApproval,
      ipdMiscellaneousReason,
      totalAmountExpenses,
      descriptionExpenses,
      qcUpdateID: localStorage.getItem('qcUpdateID') || '',
    };

    try {
      const response = await QCUpdateService.addQCVendorFeedback(payload, cleanInvId);
      if (response?.statusCode === 0) {
        alertService.showAlertSuccess('Vendor feedback submitted successfully');
        if (onChangeTab) {
          onChangeTab(true);
        }
      }
    } catch (error) {
      console.error('Error submitting vendor feedback:', error);
      alertService.showAlertError('Error submitting vendor feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleReimbursementSubmit = async () => {
    if (!validateReimbursementSubmission()) {
      return;
    }

    setLoading(true);
    const cleanInvId = investigationId?.split(' ')[0] || '';

    const payload: any = {
      splitVendorFeedbackDTOs: vendorFeedbackArr,
      qcUpdateID: localStorage.getItem('qcUpdateID') || '',
    };

    try {
      const response = await QCUpdateService.addQCVendorFeedbackReim(payload, cleanInvId);
      if (response?.statusCode === 0) {
        alertService.showAlertSuccess('Vendor feedback submitted successfully');
        if (onChangeTab) {
          onChangeTab(true);
        }
      }
    } catch (error) {
      console.error('Error submitting vendor feedback:', error);
      alertService.showAlertError('Error submitting vendor feedback');
    } finally {
      setLoading(false);
    }
  };

  // Determine visibility conditions
  const showReimbursementRegional =
    roleName === 'Regional Manager' && vendorFeedbackArr.length !== 0 && claimsType === 'reim';

  const showReimbursementCentral =
    roleName === 'Central Manager' && vendorFeedbackArr.length !== 0 && claimsType === 'reim';

  const showCashlessRegional =
    roleName === 'Regional Manager' && claimsType === 'cashless';

  const showCashlessCentral =
    roleName === 'Central Manager' && claimsType === 'cashless';

  //   if (!previewValues) {
  //     return (
  //       <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
  //         <Alert severity="info">No vendor feedback data available</Alert>
  //       </Box>
  //     );
  //   }

  return (
    <Box sx={{ mt: 1, mb: 3 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Reimbursement - Regional Manager View */}
      {showReimbursementRegional && (
        <>
          <ReimbursementVendorSection
            vendors={vendorFeedbackArr}
            roleNameValue={roleName}
            isDisabled={isDisabled}
            onVendorChange={handleVendorChange}
          />
          <Box sx={{ mt: 3, mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReimbursementSubmit}
              disabled={!buttonEnable || loading}
            >
              Submit
            </Button>
          </Box>
        </>
      )}

      {/* Reimbursement - Central Manager View */}
      {showReimbursementCentral && (
        <>
          <ReimbursementVendorSection
            vendors={vendorFeedbackArr}
            roleNameValue={roleName}
            isDisabled={isDisabled}
            onVendorChange={handleVendorChange}
          />
          {editAble === null && (
            <Box sx={{ mt: 3, mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleReimbursementSubmit}
                disabled={!buttonEnable || loading}
              >
                Submit
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Cashless - Regional Manager View */}
      {showCashlessRegional && (
        <>
          <CashlessVendorSection
            travellingExpenses={travellingExpenses}
            travellingExpensesApproval={travellingExpensesApproval}
            travellingExpensesAppAmount={travellingExpensesAppAmount}
            travellingExpensesReason={travellingExpensesReason}
            onTravellingApprovalChange={setTravellingExpensesApproval}
            onTravellingAmountChange={setTravellingExpensesAppAmount}
            onTravellingReasonChange={setTravellingExpensesReason}
            extraVisit={extraVisit}
            extraVisitApproval={extraVisitApproval}
            extraVisitAppAmount={extraVisitAppAmount}
            extraVisitReason={extraVisitReason}
            onExtraVisitApprovalChange={setExtraVisitApproval}
            onExtraVisitAmountChange={setExtraVisitAppAmount}
            onExtraVisitReasonChange={setExtraVisitReason}
            ipdMiscellaneous={ipdMiscellaneous}
            ipdMiscellaneousApproval={ipdMiscellaneousApproval}
            ipdMiscellaneousAppAmount={ipdMiscellaneousAppAmount}
            ipdMiscellaneousReason={ipdMiscellaneousReason}
            onIpdApprovalChange={setIpdMiscellaneousApproval}
            onIpdAmountChange={setIpdMiscellaneousAppAmount}
            onIpdReasonChange={setIpdMiscellaneousReason}
            descriptionExpenses={descriptionExpenses}
            totalAmountExpenses={totalAmountExpenses}
            tatFeedback={tatFeedBack}
            qualityInvestigation={qualityInvestigationReport}
            fieldInvestigation={fieldInvestigationQuality}
            overallFeedback={overallFeedback}
            onTatChange={setTatFeedBack}
            onQualityChange={setQualityInvestigationReport}
            onFieldChange={setFieldInvestigationQuality}
            onOverallChange={setOverallFeedback}
            roleNameValue={roleName}
            isDisabled={isDisabled}
          />
          <Box sx={{ mt: 3, mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCashlessSubmit}
              disabled={!buttonEnable || loading}
            >
              Submit
            </Button>
          </Box>
        </>
      )}

      {/* Cashless - Central Manager View */}
      {showCashlessCentral && (
        <>
          <CashlessVendorSection
            travellingExpenses={travellingExpenses}
            travellingExpensesApproval={travellingExpensesApproval}
            travellingExpensesAppAmount={travellingExpensesAppAmount}
            travellingExpensesReason={travellingExpensesReason}
            onTravellingApprovalChange={setTravellingExpensesApproval}
            onTravellingAmountChange={setTravellingExpensesAppAmount}
            onTravellingReasonChange={setTravellingExpensesReason}
            extraVisit={extraVisit}
            extraVisitApproval={extraVisitApproval}
            extraVisitAppAmount={extraVisitAppAmount}
            extraVisitReason={extraVisitReason}
            onExtraVisitApprovalChange={setExtraVisitApproval}
            onExtraVisitAmountChange={setExtraVisitAppAmount}
            onExtraVisitReasonChange={setExtraVisitReason}
            ipdMiscellaneous={ipdMiscellaneous}
            ipdMiscellaneousApproval={ipdMiscellaneousApproval}
            ipdMiscellaneousAppAmount={ipdMiscellaneousAppAmount}
            ipdMiscellaneousReason={ipdMiscellaneousReason}
            onIpdApprovalChange={setIpdMiscellaneousApproval}
            onIpdAmountChange={setIpdMiscellaneousAppAmount}
            onIpdReasonChange={setIpdMiscellaneousReason}
            descriptionExpenses={descriptionExpenses}
            totalAmountExpenses={totalAmountExpenses}
            tatFeedback={tatFeedBack}
            qualityInvestigation={qualityInvestigationReport}
            fieldInvestigation={fieldInvestigationQuality}
            overallFeedback={overallFeedback}
            onTatChange={setTatFeedBack}
            onQualityChange={setQualityInvestigationReport}
            onFieldChange={setFieldInvestigationQuality}
            onOverallChange={setOverallFeedback}
            showRegionalRatings={true}
            tatRegional={tatFeedBackReg}
            qualityRegional={qinvestFeedbackReg}
            fieldRegional={fieldFeedbackReg}
            overallRegional={overallFeedbackReg}
            roleNameValue={roleName}
            isDisabled={isDisabled}
          />
          {editAble === null && (
            <Box sx={{ mt: 3, mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCashlessSubmit}
                disabled={!buttonEnable || loading}
              >
                Submit
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default QcVendorFeedback;