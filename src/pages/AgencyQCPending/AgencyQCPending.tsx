// File: src/components/AgencyQCPending.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  Typography,
} from '@mui/material';
import {
  Description as CashlessIcon,
  Receipt as ReimIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import AgencyQCPendingReimTable from './children/AgencyQCPendingReimTable';
import AgencyQCPendingCashless from './children/AgencyQCPendingCashless';

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

const AgencyQCPending: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Initialize active case type on mount
  useEffect(() => {
    toggleCaseType('');
  }, []);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    
    // Set case type in localStorage based on tab
    const caseType = newValue === 0 ? '' : 'reimtable';
    toggleCaseType(caseType);
  };

  // Toggle case type in localStorage
  const toggleCaseType = (type: string = '') => {
    localStorage.setItem('activeCaseType', type);
  };

  return (
    // <Container maxWidth="xl" sx={{ py: 3 }}>
    //   <Card
    //     elevation={0}
    //     sx={{
    //       background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
    //       color: 'white',
    //       mb: 3,
    //       borderRadius: 2,
    //     }}
    //   >
    //     <CardContent>
    //       {/* Breadcrumbs */}
    //       <Breadcrumbs
    //         separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />}
    //         sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}
    //       >
    //         <Link
    //           color="inherit"
    //           href="#"
    //           onClick={(e) => e.preventDefault()}
    //           sx={{
    //             textDecoration: 'none',
    //             '&:hover': { textDecoration: 'underline' },
    //           }}
    //         >
    //           QC
    //         </Link>
    //         <Link
    //           color="inherit"
    //           href="#"
    //           onClick={(e) => e.preventDefault()}
    //           sx={{
    //             textDecoration: 'none',
    //             '&:hover': { textDecoration: 'underline' },
    //           }}
    //         >
    //           Agency QC
    //         </Link>
    //         <Typography color="inherit" sx={{ fontWeight: 600 }}>
    //           QC Pending
    //         </Typography>
    //       </Breadcrumbs>

    //       {/* Tabs */}
    //       <Tabs
    //         value={activeTab}
    //         onChange={handleTabChange}
    //         sx={{
    //           '& .MuiTabs-indicator': {
    //             backgroundColor: 'white',
    //             height: 3,
    //             borderRadius: '3px 3px 0 0',
    //           },
    //           '& .MuiTab-root': {
    //             color: 'rgba(255,255,255,0.7)',
    //             fontWeight: 600,
    //             fontSize: '1rem',
    //             textTransform: 'none',
    //             minHeight: 48,
    //             '&:hover': {
    //               color: 'rgba(255,255,255,0.9)',
    //             },
    //             '&.Mui-selected': {
    //               color: 'white',
    //             },
    //           },
    //         }}
    //       >
    //         <Tab
    //           icon={<CashlessIcon />}
    //           iconPosition="start"
    //           label="Cashless"
    //         />
    //         <Tab
    //           icon={<ReimIcon />}
    //           iconPosition="start"
    //           label="Reimbursement"
    //         />
    //       </Tabs>
    //     </CardContent>
    //   </Card>

    //   {/* Tab Content */}
    //   <Card elevation={2}>
    //     <CardContent>
    //       <Box
    //         role="tabpanel"
    //         hidden={activeTab !== 0}
    //         sx={{
    //           animation: activeTab === 0 ? 'fadeIn 0.3s ease-in' : 'none',
    //           '@keyframes fadeIn': {
    //             from: { opacity: 0, transform: 'translateY(10px)' },
    //             to: { opacity: 1, transform: 'translateY(0)' },
    //           },
    //         }}
    //       >
    //         {activeTab === 0 && <AgencyQCPendingCashless />}
    //       </Box>

    //       <Box
    //         role="tabpanel"
    //         hidden={activeTab !== 1}
    //         sx={{
    //           animation: activeTab === 1 ? 'fadeIn 0.3s ease-in' : 'none',
    //           '@keyframes fadeIn': {
    //             from: { opacity: 0, transform: 'translateY(10px)' },
    //             to: { opacity: 1, transform: 'translateY(0)' },
    //           },
    //         }}
    //       >
    //         {activeTab === 1 && <AgencyQCPendingReimTable />}
    //       </Box>
    //     </CardContent>
    //   </Card>
    // </Container>
    <Container sx={{ mt: 2 }}>
      <Card
        sx={{
          // borderRadius: 3,
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
              background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
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
              <AgencyQCPendingCashless />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <AgencyQCPendingReimTable />
            </TabPanel>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AgencyQCPending;