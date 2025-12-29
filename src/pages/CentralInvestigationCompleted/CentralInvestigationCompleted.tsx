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
  Description as CashlessIcon,
  Receipt as ReimIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';

// Import child components
import CentralInvestigationCompletedCashless from './children/CentralInvestigationCompletedCashless';
import CentralInvestigationCompletedReim from './children/CentralInvestigationCompletedReim';

/**
 * Central Investigation Completed Component
 * Shows completed investigation cases in two tabs: Cashless and Reimbursement
 */
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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Card elevation={2}>
        <CardContent>
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 3 }}
          >
            <Link
              color="inherit"
              href="#"
              onClick={(e) => e.preventDefault()}
              sx={{
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Investigation
            </Link>
            <Link
              color="inherit"
              href="#"
              onClick={(e) => e.preventDefault()}
              sx={{
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Completed Cases
            </Link>
            <Typography color="text.primary" fontWeight={600}>
              Investigation Completed
            </Typography>
          </Breadcrumbs>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  minHeight: 48,
                  '&.Mui-selected': {
                    color: '#6F62C2',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#6F62C2',
                  height: 3,
                },
              }}
            >
              <Tab
                icon={<CashlessIcon />}
                iconPosition="start"
                label="Cashless"
              />
              <Tab
                icon={<ReimIcon />}
                iconPosition="start"
                label="Reimbursement"
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box
            role="tabpanel"
            hidden={activeTab !== 0}
            sx={{
              animation: activeTab === 0 ? 'fadeIn 0.3s ease-in' : 'none',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(10px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            {activeTab === 0 && <CentralInvestigationCompletedCashless />}
          </Box>

          <Box
            role="tabpanel"
            hidden={activeTab !== 1}
            sx={{
              animation: activeTab === 1 ? 'fadeIn 0.3s ease-in' : 'none',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(10px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            {activeTab === 1 && <CentralInvestigationCompletedReim />}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CentralInvestigationCompleted;