import React, { useState, useEffect } from 'react';
import {
  Box,
  Tab,
  Tabs,
} from '@mui/material';
import HospitalStepOne from './HospitalStepOne';
import HospitalStepTwo from './HospitalStepTwo';

// Import child components
// import HospitalStepOne from './HospitalStepOne';
// import HospitalStepTwo from './HospitalStepTwo';

interface HospitalVerificationsProps {
  buttonEnable?: boolean;
  previousData?: any;
  onChangeTab: any;
}

const HospitalVerifications: React.FC<HospitalVerificationsProps> = ({
  buttonEnable = true,
  previousData,
  onChangeTab
}) => {
  // State
  const [enableStepTwo, setEnableStepTwo] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Poll localStorage for activeReCaseID to enable/disable Step Two
  useEffect(() => {
    // Initial check
    checkActiveReCaseID();

    // Set up polling interval (every 2 seconds)
    const interval = setInterval(() => {
      checkActiveReCaseID();
    }, 2000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Check if activeReCaseID exists in localStorage
  const checkActiveReCaseID = () => {
    const activeReCaseID = localStorage.getItem('activeReCaseID');
    
    if (activeReCaseID && activeReCaseID.trim() !== '') {
      setEnableStepTwo(true);
    } else {
      setEnableStepTwo(false);
    }
  };

  // Check previousData on changes
  useEffect(() => {
    if (previousData?.activeReCaseID) {
      if (previousData.activeReCaseID.trim() !== '') {
        setEnableStepTwo(true);
      } else {
        setEnableStepTwo(false);
      }
    }
  }, [previousData]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle tab change from child component (e.g., Step One requesting to show Step Two)
  const handleChangeTab = (showStepTwo: boolean) => {
    if (showStepTwo && enableStepTwo) {
      setActiveTab(1); // Switch to Step Two
    } else {
      setActiveTab(0); // Switch to Step One
    }
  };

  return (
    <Box>
      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 120,
              fontWeight: 500,
            },
            '& .Mui-selected': {
              color: '#6F62C2',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#6F62C2',
            },
          }}
        >
          <Tab label="Step One" />
          {enableStepTwo && <Tab label="Step Two" />}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box>
        {/* Step One Tab */}
        <Box
          role="tabpanel"
          hidden={activeTab !== 0}
          sx={{ display: activeTab === 0 ? 'block' : 'none' }}
        >
          {activeTab === 0 && (
            <HospitalStepOne
              buttonEnable={buttonEnable}
              previousData={previousData}
              onChangeTab={handleChangeTab}
            />
          )}
        </Box>

        {/* Step Two Tab */}
        {enableStepTwo && (
          <Box
            role="tabpanel"
            hidden={activeTab !== 1}
            sx={{ display: activeTab === 1 ? 'block' : 'none' }}
          >
            {activeTab === 1 && (
              <HospitalStepTwo
                buttonEnable={buttonEnable}
                previousData={previousData}
                onChangeTab={onChangeTab}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HospitalVerifications;