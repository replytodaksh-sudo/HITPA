// src/components/AssignedToSelf/AssignedToSelf.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Container,
  Link,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import AssignedToSelfCashless from './children/AssignedToSelfCashless';
import AssignedToSelfReimburse from './children/AssignedToSelfReimburse';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`assigned-tabpanel-${index}`}
      aria-labelledby={`assigned-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AssignedToSelf: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [category, setCategory] = useState('');

  useEffect(() => {
    // Get category from navigation state
    const stateCategory = (location.state as any)?.category || '';
    setCategory(stateCategory);
    
    // Set active tab based on category
    if (stateCategory === 'reim') {
      setActiveTab(1); // Reimbursement tab
      toggleCaseType('reimtable');
    } else {
      setActiveTab(0); // Cashless tab (default)
      toggleCaseType('');
    }
  }, [location.state]);

  const toggleCaseType = (type: string = '') => {
    // Set the type for Case update component load
    localStorage.setItem('activeCaseType', type);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    
    // Update localStorage based on selected tab
    if (newValue === 0) {
      toggleCaseType('');
      setCategory('');
    } else {
      toggleCaseType('reimtable');
      setCategory('reim');
    }
  };

  return (
    // <Box sx={{ p: 3 }}>
    //   <Card
    //     sx={{
    //       boxShadow: 3,
    //       borderRadius: 3,
    //     }}
    //   >
    //     <CardContent>
    //       {/* Tabs */}
    //       <Tabs
    //         value={activeTab}
    //         onChange={handleTabChange}
    //         sx={{
    //           mb: 2,
    //           '& .MuiTab-root': {
    //             textTransform: 'none',
    //             fontWeight: 600,
    //             fontSize: '0.95rem',
    //             minHeight: 48,
    //             transition: 'all 0.3s ease',
    //             '&:hover': {
    //               bgcolor: 'action.hover',
    //             },
    //             '&.Mui-selected': {
    //               color: 'primary.main',
    //             },
    //           },
    //           '& .MuiTabs-indicator': {
    //             height: 3,
    //             borderRadius: '3px 3px 0 0',
    //             background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
    //           },
    //         }}
    //       >
    //         <Tab
    //           label="Cashless"
    //           icon={<PaymentIcon />}
    //           iconPosition="start"
    //           id="assigned-tab-0"
    //           aria-controls="assigned-tabpanel-0"
    //         />
    //         <Tab
    //           label="Reimbursement"
    //           icon={<ReceiptIcon />}
    //           iconPosition="start"
    //           id="assigned-tab-1"
    //           aria-controls="assigned-tabpanel-1"
    //         />
    //       </Tabs>

    //       {/* Breadcrumbs */}
    //       <Breadcrumbs
    //         separator={<NavigateNextIcon fontSize="small" />}
    //         aria-label="breadcrumb"
    //         sx={{
    //           mb: 3,
    //           '& .MuiBreadcrumbs-ol': {
    //             flexWrap: 'nowrap',
    //           },
    //         }}
    //       >
    //         <Link
    //           underline="hover"
    //           color="inherit"
    //           href="#"
    //           onClick={(e) => e.preventDefault()}
    //           sx={{
    //             display: 'flex',
    //             alignItems: 'center',
    //             '&:hover': {
    //               color: 'primary.main',
    //             },
    //           }}
    //         >
    //           Investigation
    //         </Link>
    //         <Link
    //           underline="hover"
    //           color="inherit"
    //           href="#"
    //           onClick={(e) => e.preventDefault()}
    //           sx={{
    //             display: 'flex',
    //             alignItems: 'center',
    //             '&:hover': {
    //               color: 'primary.main',
    //             },
    //           }}
    //         >
    //           On Field Cases
    //         </Link>
    //         <Typography
    //           color="text.primary"
    //           sx={{
    //             display: 'flex',
    //             alignItems: 'center',
    //             fontWeight: 600,
    //           }}
    //         >
    //           Assigned To Self
    //         </Typography>
    //       </Breadcrumbs>

    //       {/* Tab Panels */}
    //       <TabPanel value={activeTab} index={0}>
    //         <AssignedToSelfCashless />
    //       </TabPanel>
    //       <TabPanel value={activeTab} index={1}>
    //         <AssignedToSelfReimburse />
    //       </TabPanel>
    //     </CardContent>
    //   </Card>
    // </Box>
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
              <AssignedToSelfCashless />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <AssignedToSelfReimburse />
            </TabPanel>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AssignedToSelf;