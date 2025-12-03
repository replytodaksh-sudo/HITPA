import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import PlanedAdmissionSec from './PlanedAdmissionSec';
import Preview from './Preview';
import HospitalFeedback from './HospitalFeedback';
import NotFoundInHospital from './NotFoundInHospital';
import Findings from './Findings';


// ===========================
// INTERFACES
// ===========================
interface NotPresentFormProps {
  payloadData?: any;
  isFormEditable: boolean;
}

// ===========================
// MAIN COMPONENT
// ===========================
const NotPresentForm: React.FC<NotPresentFormProps> = ({
  payloadData = '',
  isFormEditable
}) => {
  // ===========================
  // STATE
  // ===========================
  const [activeTab, setActiveTab] = useState(0);
  const [previewRefresh, setPreviewRefresh] = useState(false);
  const [reasonValue, setReasonValue] = useState('');
  const [isInsuredVisit] = useState(false);
  const [isPresent] = useState(false);

  console.log(isFormEditable, payloadData, previewRefresh, isInsuredVisit, isPresent)

  // ===========================
  // LIFECYCLE
  // ===========================
  useEffect(() => {
    // Initialize preview refresh
    setPreviewRefresh(false);
  }, []);

  useEffect(() => {
    // Load reason from payload data after component mounts
    if (payloadData && payloadData.reason) {
      setReasonValue(payloadData.reason);
    }
  }, [payloadData]);

  // ===========================
  // HANDLERS
  // ===========================
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);

    // Apply preview refresh only for the Preview tab (tab 3)
    if (newValue === 3) {
      setPreviewRefresh(true);
    } else {
      setPreviewRefresh(false);
    }
  };

  const handleReasonChange = (event: any) => {
    setReasonValue(event.target.value);
  };

  const nextPage = (value: number) => {
    // Value: 1 = Hospital Feedback, 2 = Findings, 3 = Preview
    setActiveTab(value);

    // Apply preview refresh only for Preview tab
    if (value === 3) {
      setPreviewRefresh(true);
    } else {
      setPreviewRefresh(false);
    }
  };

  // ===========================
  // RENDER PRIMARY DATA CONTENT
  // ===========================
  const renderPrimaryDataContent = () => {
    switch (reasonValue) {
      case 'discharged':
        return (
          "4wervc"
          // <PrimaryData
          //   isPresent={isPresent}
          //   previousData={payloadData}
          //   isFormEditable={isFormEditable}
          //   reasonVal={reasonValue}
          //   onNextPage={nextPage}
          // />
        );

      case 'plannedadmission':
        return (
          <PlanedAdmissionSec
            isPresent={isPresent}
            previuosData={payloadData}
            isFormEditable={isFormEditable}
            reasonVal={reasonValue}
            onNextPage={nextPage}
          />
        );

      case 'notfoundhosp':
        return (
          <NotFoundInHospital
            previousData={payloadData}
            onNextPage={nextPage}
          />
        );

      default:
        return null;
    }
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <Box sx={{ width: '100%' }}>
      {/* Tab Headers */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="not present form tabs"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            minWidth: 'auto',
            fontWeight: 500,
            fontSize: '0.95rem',
            padding: '12px 20px',
          },
          '& .Mui-selected': {
            color: '#6770d2',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#6770d2',
          },
        }}
      >
        <Tab label="Primary Data" />
        <Tab label="Hospital Feedback" />
        <Tab label="Any Other Observations / Findings" />
        <Tab label="Preview & Confirmation" />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>
        {/* Tab 0: Primary Data with Reason Dropdown */}
        {activeTab === 0 && (
          <Box>
            {/* Reason Dropdown */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  <InputLabel sx={{ m: 0 }}>Reason</InputLabel>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <Select
                    value={reasonValue}
                    onChange={handleReasonChange}
                    displayEmpty
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ced4da',
                      },
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="discharged">Discharged</MenuItem>
                    <MenuItem value="plannedadmission">Planned Admission</MenuItem>
                    <MenuItem value="notfoundhosp">Not found in the Hospital</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Conditional Content Based on Reason */}
            {renderPrimaryDataContent()}
          </Box>
        )}

        {/* Tab 1: Hospital Feedback */}
        {activeTab === 1 && (
          <HospitalFeedback
            isInsuredVisit={isInsuredVisit}
            previousData={payloadData}
            isFormEditable={true}
            onNextPage={nextPage}
          />
        )}

        {/* Tab 2: Any Other Observations / Findings */}
        {activeTab === 2 && (
          <Findings
            isInsuredVisit={isInsuredVisit}
            previousData={payloadData}
            onNextPage={nextPage}
          />
        )}

        {/* Tab 3: Preview & Confirmation */}
        {activeTab === 3 && (
          <Preview
            isInsuredVisit={isInsuredVisit}
            previewRefresh={previewRefresh}
            previuosData={payloadData}
          />
        )}
      </Box>
    </Box>
  );
};

export default NotPresentForm;