// File: src/components/RegQCPendingCentral.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Container,
  Tabs,
  Tab,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  MonetizationOn,
  Receipt,
  NavigateNext,
} from '@mui/icons-material';
import RegQcPendingCashless from './children/RegQcPendingCashless';
import RegQcPendingReim from './children/RegQcPendingReim';

// ============================================================================
// INTERFACES
// ============================================================================

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface LocationState {
  category?: string;
}

// ============================================================================
// TAB PANEL COMPONENT
// ============================================================================

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`qc-tabpanel-${index}`}
      aria-labelledby={`qc-tab-${index}`}
    >
      {value === index && (
        <Box
          sx={{
            py: 3,
            animation: 'fadeIn 0.3s ease-in',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(10px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const RegQcPending: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  // Initialize active tab based on category from navigation state
  const initialCategory = state?.category || '';
  const [activeTab, setActiveTab] = useState<number>(initialCategory === 'reim' ? 1 : 0);

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  useEffect(() => {
    // Set active case type on mount
    const caseType = initialCategory === 'reim' ? 'reimtable' : '';
    toggleCaseType(caseType);
  }, [initialCategory]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    const caseType = newValue === 1 ? 'reimtable' : '';
    toggleCaseType(caseType);
  };

  const toggleCaseType = (type: string = '') => {
    // Store active case type for child components to access
    localStorage.setItem('activeCaseType', type);
    console.log('Active case type set to:', type);
  };

  // ============================================================================
  // TAB CONFIGURATION
  // ============================================================================

  const tabs = [
    {
      label: 'Cashless',
      icon: <MonetizationOn />,
      component: <RegQcPendingCashless />,
    },
    {
      label: 'Reimbursement',
      icon: <Receipt />,
      component: <RegQcPendingReim />,
    },
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header Section with Gradient */}
          <Box
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              color: 'white',
              borderRadius: '12px 12px 0 0',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Regional QC - QC Pending
            </Typography>

            {/* Breadcrumbs */}
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />}
              sx={{
                color: 'white',
                '& .MuiBreadcrumbs-ol': {
                  flexWrap: 'nowrap',
                },
              }}
            >
              <Link
                underline="hover"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  cursor: 'pointer',
                  '&:hover': { color: 'white' },
                }}
                onClick={() => console.log('Navigate to QC')}
              >
                QC
              </Link>
              <Link
                underline="hover"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  cursor: 'pointer',
                  '&:hover': { color: 'white' },
                }}
                onClick={() => console.log('Navigate to Regional QC')}
              >
                Regional QC
              </Link>
              <Typography sx={{ color: 'white', fontWeight: 600 }}>QC Pending</Typography>
            </Breadcrumbs>
          </Box>

          {/* Tabs Section */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              background: 'linear-gradient(to bottom, #EFF6FF 0%, #FFFFFF 100%)',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                px: 2,
                '& .MuiTab-root': {
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: '64px',
                  color: 'text.secondary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'primary.main',
                    background: 'rgba(59, 130, 246, 0.05)',
                  },
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
                '& .MuiTabs-indicator': {
                  height: '3px',
                  borderRadius: '3px 3px 0 0',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                  id={`qc-tab-${index}`}
                  aria-controls={`qc-tabpanel-${index}`}
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <Box sx={{ px: 3 }}>
            {tabs.map((tab, index) => (
              <TabPanel key={index} value={activeTab} index={index}>
                {tab.component}
              </TabPanel>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegQcPending;