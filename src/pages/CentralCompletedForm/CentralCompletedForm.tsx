// // src/components/CentralCompletedForm/CentralCompletedForm.tsx

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Tabs,
//   Tab,
//   Chip,
//   Link,
//   Grid,
// } from '@mui/material';
// import { useParams, useSearchParams } from 'react-router-dom';
// import QCUpdateService from '../../services/qcupdate.service';
// import PreAuth from '../../components/sharedComponents/components/PreAuth';
// import ClaimDetailsReim from '../../components/sharedComponents/components/ClaimDetailsReim';
// import HospitalInfo from '../../components/sharedComponents/components/HospitalInfo';
// import ReimburseCaseUpdate from '../../components/sharedComponents/components/ReimburseCaseUpdate';
// import Logs from '../../components/sharedComponents/components/Logs';
// import { agencyQcUpdateService } from '../../services/agencyqcupdate.service';
// import CentralRegionalDocuments from '../../components/sharedComponents/components/CentralRegionalDocuments';
// import ReimRegionalAgencyQC from '../../components/sharedComponents/components/ReimRegionalAgencyQC';
// import QcPreview from '../../components/sharedComponents/components/QcPreview';

// // const PAYMENT_LINK = process.env.REACT_APP_PAYMENT_LINK || 'https://payment.example.com';
// const PAYMENT_LINK = 'https://payment.example.com';

// const CentralCompletedForm: React.FC = () => {
//   const { investigationId } = useParams<{ investigationId: string }>();
//   const [searchParams] = useSearchParams();
//   const [activeTab, setActiveTab] = useState(0);

//   // URL params
//   const claimsType = searchParams.get('claimsType') || 'cashless';
//   const claimNo = searchParams.get('claimNo') || '';
//   const sbiclaimNo = searchParams.get('sbigclaimno') || '';

//   // State
//   const [claimDetails, setClaimDetails] = useState<any>(null);
//   const [qcData, setQcData] = useState<any>(null);
//   const [buttonEnable, setButtonEnable] = useState(false);
//   const [display, setDisplay] = useState('none');
//   const [notDisplayMessage, setNotDisplayMessage] = useState(false);
//   const [agencyQcForm, setAgencyQcForm] = useState('none');
//   const [agencyQcFormEditable, setAgencyQcFormEditable] = useState(false);
//   const [previewRefresh] = useState(false);

//   const roleName = sessionStorage.getItem('roleName') || '';
//   const claimsTypelabel = claimsType === 'cashless' ? 'Cashless' : claimsType === 'reim' ? 'Reimbursement' : '';

//   // Fetch claim details
//   useEffect(() => {
//     if (investigationId) {
//       getClaimDetails(investigationId);
//     }
//   }, [investigationId]);

//   const getClaimDetails = async (invId: string) => {
//     try {
//       const response = await QCUpdateService.qcUpdatePreview(invId, 'regionalQC');
//       if (response.statusCode === 0) {
//         setClaimDetails(response.payload);
        
//         // Set button enable and display based on role and status
//         if (roleName === 'Central Manager' && response.payload.noDataStatus === 'NonEditable') {
//           setDisplay('block');
//           setButtonEnable(false);
//         } else if (roleName === 'Central Manager' && response.payload.noDataStatus === 'Editable') {
//           setDisplay('block');
//           setButtonEnable(true);
//         } else {
//           setDisplay('none');
//         }

//         // Get QC data
//         getData(invId);
//       }
//     } catch (error) {
//       console.error('Error fetching claim details:', error);
//     }
//   };

//   const getData = async (invId: string) => {
//     try {
//       let tabName = '';
//       if (roleName === 'Regional Manager') {
//         tabName = 'regionalQC';
//       } else if (roleName === 'Central Manager') {
//         tabName = 'centralQC';
//       }

//       const response = await agencyQcUpdateService.getQCUpdateData(invId, tabName);
//       if (response.statusCode === 0) {
//         setQcData(response.payload);

//         if (roleName === 'Regional Manager' && response.payload.noDataStatus === 'NotToOpenForm') {
//           setAgencyQcForm('none');
//           setNotDisplayMessage(true);
//         } else if (roleName === 'Regional Manager' && response.payload.noDataStatus === 'NonEditable') {
//           setAgencyQcForm('block');
//           setAgencyQcFormEditable(false);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching QC data:', error);
//     }
//   };

//   // Tab configuration
//   const tabs = [
//     { label: claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details', show: true },
//     { label: 'Insured & Hospital Details', show: true },
//     { label: 'Documents', show: true },
//     { label: 'F.O Updates', show: true },
//     { label: 'Agency QC', show: qcData?.recommendation !== '' },
//     { label: 'Reg. QC Updates', show: true },
//     { label: 'QC Updates', show: true },
//     { label: 'Logs', show: true },
//   ];

//   const visibleTabs = tabs.filter((tab) => tab.show);

//   return (
//     <Box sx={{ p: 3 }}>
//       <Card sx={{ boxShadow: 3 }}>
//         <CardContent>
//           {/* Header with Investigation Details */}
//           <Grid container spacing={2} sx={{ mb: 2 }}>
//             <Grid size={{ xs: 12, md: 4 }}>
//               <Typography variant="body1">
//                 <strong>Investigation No: </strong>
//                 {investigationId}
//                 <Chip
//                   label={claimsTypelabel}
//                   color="warning"
//                   size="small"
//                   sx={{ ml: 1 }}
//                 />
//               </Typography>
//             </Grid>
//             <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
//               <Typography variant="body1">
//                 <strong>Claim No: </strong>
//                 {sbiclaimNo}
//               </Typography>
//             </Grid>
//             <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'right' }}>
//               <Typography variant="body1">
//                 <strong>TPA Claim No: </strong>
//                 {claimNo}
//               </Typography>
//             </Grid>
//           </Grid>

//           {/* Payment Link */}
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
//             <Link
//               href={PAYMENT_LINK}
//               target="_blank"
//               rel="noopener noreferrer"
//               sx={{
//                 color: '#776BC5',
//                 fontWeight: 700,
//                 textDecoration: 'none',
//                 '&:hover': {
//                   textDecoration: 'underline',
//                 },
//               }}
//             >
//               Make payment
//             </Link>
//           </Box>

//           {/* Tabs */}
//           <Tabs
//             value={activeTab}
//             onChange={(e, newValue) => setActiveTab(newValue)}
//             variant="scrollable"
//             scrollButtons="auto"
//             sx={{
//               mb: 2,
//               '& .MuiTab-root': {
//                 textTransform: 'none',
//                 minWidth: 120,
//               },
//             }}
//           >
//             {visibleTabs.map((tab, index) => (
//               <Tab key={index} label={tab.label} />
//             ))}
//           </Tabs>

//           {/* Tab Content */}
//           <Box sx={{ mt: 2 }}>
//             {/* Pre-Auth / Claim Details */}
//             {activeTab === 0 && (
//               <>
//                 {claimsType === 'cashless' ? (
//                   <PreAuth claimDetails={claimDetails}/>
//                 ) : (
//                   <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails}/>
//                 )}
//               </>
//             )}

//             {/* Insured & Hospital Details */}
//             {activeTab === 1 && <HospitalInfo claimsType={claimsType} claimDetails={claimDetails}/>}

//             {/* Documents */}
//             {activeTab === 2 && 
//             <CentralRegionalDocuments />
//             }

//             {/* F.O Updates */}
//             {activeTab === 3 && <ReimburseCaseUpdate />}

//             {/* Agency QC */}
//             {activeTab === 4 && qcData?.recommendation !== '' && (
//               <ReimRegionalAgencyQC editable={true} />
//             )}

//             {/* Reg. QC Updates */}
//             {activeTab === (qcData?.recommendation !== '' ? 5 : 4) && (
//               <QcPreview
//                 dataRole="regional"
//                 previewRefresh={previewRefresh}
//                 buttonEnable={buttonEnable}
//               />
//             )}

//             {/* QC Updates */}
//             {activeTab === (qcData?.recommendation !== '' ? 6 : 5) && (
//               <QcPreview dataRole="central" buttonEnable={buttonEnable} />
//             )}

//             {/* Logs */}
//             {activeTab === (qcData?.recommendation !== '' ? 7 : 6) && (
//               <Logs claimsType={claimsType} />
//             )}
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default CentralCompletedForm;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Link,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Description as DescriptionIcon,
  LocalHospital as HospitalIcon,
  FolderOpen as FolderIcon,
  Update as UpdateIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
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
import claimsService from '../../services/claims.service';

const PAYMENT_LINK = 'https://payment.example.com';

const CentralCompletedForm: React.FC = () => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const [expanded, setExpanded] = useState<string | false>('panel1');

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
      const response = await claimsService.claimDetails(invId);
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

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Show Agency QC only if recommendation exists
  const showAgencyQC = qcData?.recommendation !== '';

  return (
    <Box sx={{ p: 3, bgcolor: '#F5F7FA', minHeight: '100vh' }}>
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Gradient Header */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
            color: 'white',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <AssignmentIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Investigation No:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 400 }}>
                  {investigationId}
                </Typography>
                {claimsTypelabel && (
                  <Chip
                    label={claimsTypelabel}
                    size="small"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                )}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Claim No:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 400 }}>
                  {sbiclaimNo || '-'}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  TPA Claim No:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 400 }}>
                  {claimNo || '-'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Payment Link */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Link
              href={PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#776BC5',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Make payment
            </Link>
          </Box>

          {/* Accordion 1: Pre-Auth Details / Claim Details */}
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleAccordionChange('panel1')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E0F2FE',
                borderRadius: 2,
                '&:hover': { bgcolor: '#BAE6FD' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DescriptionIcon sx={{ color: '#0284C7' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  {claimsType === 'cashless' ? 'Pre-Auth Details' : 'Claim Details'}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              {claimsType === 'cashless' ? (
                <PreAuth claimDetails={claimDetails} />
              ) : (
                <ClaimDetailsReim claimsType={claimsType} claimDetails={claimDetails} />
              )}
            </AccordionDetails>
          </Accordion>

          {/* Accordion 2: Insured & Hospital Details */}
          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleAccordionChange('panel2')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E0F2FE',
                borderRadius: 2,
                '&:hover': { bgcolor: '#BAE6FD' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <HospitalIcon sx={{ color: '#0284C7' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Insured & Hospital Details
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              <HospitalInfo claimsType={claimsType} claimDetails={claimDetails} />
            </AccordionDetails>
          </Accordion>

          {/* Accordion 3: Documents */}
          <Accordion
            expanded={expanded === 'panel3'}
            onChange={handleAccordionChange('panel3')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E0F2FE',
                borderRadius: 2,
                '&:hover': { bgcolor: '#BAE6FD' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FolderIcon sx={{ color: '#0284C7' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Documents
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              <CentralRegionalDocuments />
            </AccordionDetails>
          </Accordion>

          {/* Accordion 4: F.O Updates */}
          <Accordion
            expanded={expanded === 'panel4'}
            onChange={handleAccordionChange('panel4')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E0F2FE',
                borderRadius: 2,
                '&:hover': { bgcolor: '#BAE6FD' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UpdateIcon sx={{ color: '#0284C7' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  F.O Updates
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              <ReimburseCaseUpdate />
            </AccordionDetails>
          </Accordion>

          {/* Accordion 5: Agency QC (Conditional) */}
          {showAgencyQC && (
            <Accordion
              expanded={expanded === 'panel5'}
              onChange={handleAccordionChange('panel5')}
              sx={{
                mb: 2,
                borderRadius: 2,
                '&:before': { display: 'none' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: '#E0F2FE',
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#BAE6FD' },
                  minHeight: 56,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AssignmentIcon sx={{ color: '#0284C7' }} />
                  <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                    Agency QC
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
                <ReimRegionalAgencyQC editable={true} />
              </AccordionDetails>
            </Accordion>
          )}

          {/* Accordion 6: Reg. QC Updates */}
          <Accordion
            expanded={expanded === 'panel6'}
            onChange={handleAccordionChange('panel6')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E0F2FE',
                borderRadius: 2,
                '&:hover': { bgcolor: '#BAE6FD' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <VisibilityIcon sx={{ color: '#0284C7' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Reg. QC Updates
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              <QcPreview
                dataRole="regional"
                previewRefresh={previewRefresh}
                buttonEnable={buttonEnable}
              />
            </AccordionDetails>
          </Accordion>

          {/* Accordion 7: QC Updates */}
          <Accordion
            expanded={expanded === 'panel7'}
            onChange={handleAccordionChange('panel7')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E0F2FE',
                borderRadius: 2,
                '&:hover': { bgcolor: '#BAE6FD' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AssignmentIcon sx={{ color: '#0284C7' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  QC Updates
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              <QcPreview dataRole="central" buttonEnable={buttonEnable} />
            </AccordionDetails>
          </Accordion>

          {/* Accordion 8: Logs */}
          <Accordion
            expanded={expanded === 'panel8'}
            onChange={handleAccordionChange('panel8')}
            sx={{
              mb: 2,
              borderRadius: 2,
              '&:before': { display: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: '#E0F2FE',
                borderRadius: 2,
                '&:hover': { bgcolor: '#BAE6FD' },
                minHeight: 56,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ArticleIcon sx={{ color: '#0284C7' }} />
                <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Logs
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, bgcolor: 'white' }}>
              <Logs claimsType={claimsType} />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CentralCompletedForm;