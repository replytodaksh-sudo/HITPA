import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
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
import FreshCase from './children/FreshCase';
import FreshReimTable from './children/FreshReimTable';

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
      id={`fresh-tabpanel-${index}`}
      aria-labelledby={`fresh-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const FreshInvestigation: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Get category from navigation state (like Angular's history.state)
    const category = (location.state as any)?.category;
    
    // Set active tab based on category
    if (category === 'reim') {
      setActiveTab(1); // Reimbursement tab
    } else {
      setActiveTab(0); // Cashless tab (default)
    }
  }, [location.state]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card
        sx={{
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <CardContent>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              mb: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                minHeight: 48,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          >
            <Tab
              label="Cashless"
              icon={<PaymentIcon />}
              iconPosition="start"
              id="fresh-tab-0"
              aria-controls="fresh-tabpanel-0"
            />
            <Tab
              label="Reimbursement"
              icon={<ReceiptIcon />}
              iconPosition="start"
              id="fresh-tab-1"
              aria-controls="fresh-tabpanel-1"
            />
          </Tabs>

          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{
              mb: 3,
              '& .MuiBreadcrumbs-ol': {
                flexWrap: 'nowrap',
              },
            }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="#"
              onClick={(e) => e.preventDefault()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Investigation
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="#"
              onClick={(e) => e.preventDefault()}
              sx={{
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Fresh Cases
            </Link>
            <Typography
              color="text.primary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
              }}
            >
              New Cases
            </Typography>
          </Breadcrumbs>

          {/* Tab Panels */}
          <TabPanel value={activeTab} index={0}>
            <FreshCase />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <FreshReimTable />
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FreshInvestigation;