import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Container,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import AgencyNewCasesCashless from './children/agencyNewCasesCashless';
import AgencyNewCasesReim from './children/agencyNewCasesReim';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const AgencyNewCases: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Set initial case type on component mount
    toggleCaseType(activeTab === 0 ? '' : 'reimtable');
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    toggleCaseType(newValue === 0 ? '' : 'reimtable');
  };

  const toggleCaseType = (type: string = '') => {
    localStorage.setItem('activeCaseType', type);
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4 }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Modern Tabs */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
              px: 3,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              TabIndicatorProps={{
                sx: {
                  height: 3,
                  backgroundColor: 'white',
                  borderRadius: '3px 3px 0 0',
                },
              }}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  minHeight: 64,
                  px: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                  '&.Mui-selected': {
                    color: 'white',
                  },
                },
              }}
            >
              <Tab
                icon={<PaymentIcon sx={{ mb: 0.5 }} />}
                iconPosition="start"
                label="Cashless"
                id="tab-0"
                aria-controls="tabpanel-0"
              />
              <Tab
                icon={<ReceiptIcon sx={{ mb: 0.5 }} />}
                iconPosition="start"
                label="Reimbursement"
                id="tab-1"
                aria-controls="tabpanel-1"
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ px: 3, pb: 3 }}>
            <TabPanel value={activeTab} index={0}>
              <AgencyNewCasesCashless />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <AgencyNewCasesReim />
            </TabPanel>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AgencyNewCases;