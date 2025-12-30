// File: src/components/CentralInvestigationCompleted.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import CentralInvestigationCompletedCashless from './children/CentralInvestigationCompletedCashless';
import CentralInvestigationCompletedReim from './children/CentralInvestigationCompletedReim';

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

const CentralInvestigationCompleted: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  // Get category from navigation state
  const category = (location.state as any)?.category || '';

  // Set initial tab based on category
  useEffect(() => {
    if (category === 'reim') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [category]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    // <Container sx={{ mt: 2 }}>
    //   <Card elevation={2}>
    //     <CardContent>
    //       {/* Breadcrumbs */}
    //       <Breadcrumbs
    //         separator={<NavigateNextIcon fontSize="small" />}
    //         sx={{ mb: 3 }}
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
    //           Investigation
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
    //           Completed Cases
    //         </Link>
    //         <Typography color="text.primary" fontWeight={600}>
    //           Investigation Completed
    //         </Typography>
    //       </Breadcrumbs>

    //       {/* Tabs */}
    //       <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
    //         <Tabs
    //           value={activeTab}
    //           onChange={handleTabChange}
    //           sx={{
    //             '& .MuiTab-root': {
    //               textTransform: 'none',
    //               fontSize: '1rem',
    //               fontWeight: 600,
    //               minHeight: 48,
    //               '&.Mui-selected': {
    //                 color: '#6F62C2',
    //               },
    //             },
    //             '& .MuiTabs-indicator': {
    //               backgroundColor: '#6F62C2',
    //               height: 3,
    //             },
    //           }}
    //         >
    //           <Tab
    //             icon={<CashlessIcon />}
    //             iconPosition="start"
    //             label="Cashless"
    //           />
    //           <Tab
    //             icon={<ReimIcon />}
    //             iconPosition="start"
    //             label="Reimbursement"
    //           />
    //         </Tabs>
    //       </Box>

    //       {/* Tab Content */}
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
    //         {activeTab === 0 && <CentralInvestigationCompletedCashless />}
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
    //         {activeTab === 1 && <CentralInvestigationCompletedReim />}
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
              <CentralInvestigationCompletedCashless />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <CentralInvestigationCompletedReim />
            </TabPanel>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CentralInvestigationCompleted;