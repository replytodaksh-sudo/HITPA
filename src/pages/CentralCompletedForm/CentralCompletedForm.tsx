// src/components/CentralCompletedForm/CentralCompletedForm.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Chip,
  Link,
  Grid,
} from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import QCUpdateService from '../../services/qcupdate.service';
import PreAuth from '../../components/sharedComponents/components/PreAuth';
import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
import Logs from '../../components/sharedComponents/components/Logs';
import { agencyQcUpdateService } from '../../services/agencyqcupdate.service';
import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
import ReimRegionalAgencyQC from '../../components/sharedComponents/components/ReimRegionalAgencyQC';
import QcPreview from '../../components/sharedComponents/components/QcPreview';

// const PAYMENT_LINK = process.env.REACT_APP_PAYMENT_LINK || 'https://payment.example.com';
const PAYMENT_LINK = 'https://payment.example.com';

const CentralCompletedForm: React.FC = () => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);

  // URL params
  const claimsType = searchParams.get('claimsType') || 'cashless';
  const claimNo = searchParams.get('claimNo') || '';
  const sbiclaimNo = searchParams.get('sbigclaimno') || '';

  // State
  const [claimDetails, setClaimDetails] = useState<any>(null);
  const [qcData, setQcData] = useState<any>(null);
  const [buttonEnable, setButtonEnable] = useState(false);
  const [display, setDisplay] = useState('none');
  const [notDisplayMessage, setNotDisplayMessage] = useState(false);
  const [agencyQcForm, setAgencyQcForm] = useState('none');
  const [agencyQcFormEditable, setAgencyQcFormEditable] = useState(false);
  const [previewRefresh] = useState(false);

  const roleName = sessionStorage.getItem('roleName') || '';
  const claimsTypelabel = claimsType === 'cashless' ? 'Cashless' : claimsType === 'reim' ? 'Reimbursement' : '';

  // Fetch claim details
  useEffect(() => {
    if (investigationId) {
      getClaimDetails(investigationId);
    }
  }, [investigationId]);

  const getClaimDetails = async (invId: string) => {
    try {
      const response = await QCUpdateService.qcUpdatePreview(invId, 'regionalQC');
      if (response.statusCode === 0) {
        setClaimDetails(response.payload);
        
        // Set button enable and display based on role and status
        if (roleName === 'Central Manager' && response.payload.noDataStatus === 'NonEditable') {
          setDisplay('block');
          setButtonEnable(false);
        } else if (roleName === 'Central Manager' && response.payload.noDataStatus === 'Editable') {
          setDisplay('block');
          setButtonEnable(true);
        } else {
          setDisplay('none');
        }

        // Get QC data
        getData(invId);
      }
    } catch (error) {
      console.error('Error fetching claim details:', error);
    }
  };

  const getData = async (invId: string) => {
    try {
      let tabName = '';
      if (roleName === 'Regional Manager') {
        tabName = 'regionalQC';
      } else if (roleName === 'Central Manager') {
        tabName = 'centralQC';
      }

      const response = await agencyQcUpdateService.getQCUpdateData(invId, tabName);
      if (response.statusCode === 0) {
        setQcData(response.payload);

        if (roleName === 'Regional Manager' && response.payload.noDataStatus === 'NotToOpenForm') {
          setAgencyQcForm('none');
          setNotDisplayMessage(true);
        } else if (roleName === 'Regional Manager' && response.payload.noDataStatus === 'NonEditable') {
          setAgencyQcForm('block');
          setAgencyQcFormEditable(false);
        }
      }
    } catch (error) {
      console.error('Error fetching QC data:', error);
    }
  };

  // Tab configuration
  const tabs = [
    { label: claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details', show: true },
    { label: 'Insured & Hospital Details', show: true },
    { label: 'Documents', show: true },
    { label: 'F.O Updates', show: true },
    { label: 'Agency QC', show: qcData?.recommendation !== '' },
    { label: 'Reg. QC Updates', show: true },
    { label: 'QC Updates', show: true },
    { label: 'Logs', show: true },
  ];

  const visibleTabs = tabs.filter((tab) => tab.show);

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          {/* Header with Investigation Details */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body1">
                <strong>Investigation No: </strong>
                {investigationId}
                <Chip
                  label={claimsTypelabel}
                  color="warning"
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
              <Typography variant="body1">
                <strong>Claim No: </strong>
                {sbiclaimNo}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'right' }}>
              <Typography variant="body1">
                <strong>TPA Claim No: </strong>
                {claimNo}
              </Typography>
            </Grid>
          </Grid>

          {/* Payment Link */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Link
              href={PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#776BC5',
                fontWeight: 700,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Make payment
            </Link>
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 120,
              },
            }}
          >
            {visibleTabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ mt: 2 }}>
            {/* Pre-Auth / Claim Details */}
            {activeTab === 0 && (
              <>
                {claimsType === 'cashless' ? (
                  <PreAuth claimDetails={claimDetails}/>
                ) : (
                  <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails}/>
                )}
              </>
            )}

            {/* Insured & Hospital Details */}
            {activeTab === 1 && <HospitalInfo claimsType={claimsType} claimDetails={claimDetails}/>}

            {/* Documents */}
            {activeTab === 2 && 
            <CentralRegionalDocuments />
            }

            {/* F.O Updates */}
            {activeTab === 3 && <ReimburseCaseUpdate />}

            {/* Agency QC */}
            {activeTab === 4 && qcData?.recommendation !== '' && (
              <ReimRegionalAgencyQC editable={true} />
            )}

            {/* Reg. QC Updates */}
            {activeTab === (qcData?.recommendation !== '' ? 5 : 4) && (
              <QcPreview
                dataRole="regional"
                previewRefresh={previewRefresh}
                buttonEnable={buttonEnable}
              />
            )}

            {/* QC Updates */}
            {activeTab === (qcData?.recommendation !== '' ? 6 : 5) && (
              <QcPreview dataRole="central" buttonEnable={buttonEnable} />
            )}

            {/* Logs */}
            {activeTab === (qcData?.recommendation !== '' ? 7 : 6) && (
              <Logs claimsType={claimsType} />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CentralCompletedForm;