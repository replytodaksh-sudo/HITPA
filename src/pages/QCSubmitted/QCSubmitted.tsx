// File: src/components/QCSubmitted.tsx
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
import QCSubmittedCashless from './children/QCSubmittedCashless';
import QCSubmittedReimTable from './children/QCSubmittedReimTable';

const QCSubmitted: React.FC = () => {
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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Card
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />}
            sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}
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
              QC
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
              Agency QC
            </Link>
            <Typography color="inherit" sx={{ fontWeight: 600 }}>
              QC Submitted
            </Typography>
          </Breadcrumbs>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'white',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                minHeight: 48,
                '&:hover': {
                  color: 'rgba(255,255,255,0.9)',
                },
                '&.Mui-selected': {
                  color: 'white',
                },
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
        </CardContent>
      </Card>

      {/* Tab Content */}
      <Card elevation={2}>
        <CardContent>
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
            {activeTab === 0 && <QCSubmittedCashless />}
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
            {activeTab === 1 && <QCSubmittedReimTable />}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default QCSubmitted;