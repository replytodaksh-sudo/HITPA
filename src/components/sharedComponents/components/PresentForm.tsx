import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import HospitalFeedback from './HospitalFeedback';
import Preview from './Preview';
import Findings from './Findings';
import PrimaryData from './PrimaryData';

// ===========================
// CHILD COMPONENT IMPORTS
// ===========================
// Replace these with your actual component imports


// ===========================
// INTERFACES
// ===========================
interface PresentFormProps {
    isFormEditable: boolean;
    payloadData?: any;
    refetch?: () => void;
}

// ===========================
// MAIN COMPONENT
// ===========================
const PresentForm: React.FC<PresentFormProps> = ({
    isFormEditable,
    payloadData = '',
    refetch,
}) => {
    // ===========================
    // STATE
    // ===========================
    const [activeTab, setActiveTab] = useState(0);
    const [previewRefresh, setPreviewRefresh] = useState(false);
    const [isInsuredVisit] = useState(true);
    const [isPresent] = useState(true);

    console.log(isFormEditable, payloadData, previewRefresh, isInsuredVisit, isPresent)
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

    // useEffect(() => {
    //     if (activeTab > 0)
    //         refetch?.()
    // }, [activeTab])

    // ===========================
    // RENDER
    // ===========================
    return (
        <Box sx={{ width: '100%' }}>
            {/* Tab Headers */}
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="presentation form tabs"
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
                {/* Tab 0: Primary Data */}
                {activeTab === 0 && (
                    <PrimaryData
                        isPresent={isPresent}
                        isFormEditable={isFormEditable}
                        previuosData={payloadData}
                        onNextPage={nextPage}
                    />
                )}

                {/* Tab 1: Hospital Feedback */}
                {activeTab === 1 && (
                    <HospitalFeedback
                        isInsuredVisit={isInsuredVisit}
                        isFormEditable={isFormEditable}
                        previousData={payloadData}
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
                        buttonVisible={isFormEditable}
                        isInsuredVisit={isInsuredVisit}
                        previewRefresh={previewRefresh}
                    />
                )}
            </Box>
        </Box>
    );
};

export default PresentForm;