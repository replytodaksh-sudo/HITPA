import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Link,
  Divider,
  Chip,
} from '@mui/material';
import {
  Download,
  Description,
  Info,
  DateRange,
} from '@mui/icons-material';
import moment from 'moment';
import { caseInfoService } from '../../../services/caseinfo.service';
import { encryptionService } from '../../../utils/encryption.service';
import { sessionService } from '../../../utils/session.service';

interface CaseInfo {
  caseType?: string;
  investigationType?: string;
  assignedBy?: string;
  intimationDate?: string;
  automatedTriggerScore?: string;
  fraudPredictiveScore?: string;
  manualTriggerChecklist?: string;
  centralRemarks?: string;
  rmRemarks?: string;
  agencyspocRemarks?: string;
  previousVendorinvestigationReport?: string;
  claimsRemarks?: string;
}

const CaseInfoComponent: React.FC = () => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const claimsType = searchParams.get('claimsType');

  const [caseInfo, setCaseInfo] = useState<CaseInfo | null>(null);
  const [reportDueDate, setReportDueDate] = useState<string>('-');
  const [loading, setLoading] = useState<boolean>(true);

  const userRole = sessionService.getOther('roleName') || 'Regional Manager';

  useEffect(() => {
    if (investigationId) {
      getCaseInfoDetails();
    }
  }, [investigationId, claimsType]);

  const getCaseInfoDetails = async () => {
    if (!investigationId) return;

    setLoading(true);
    try {
      // Extract investigation ID (remove any trailing spaces/text)
      const cleanInvestigationId = investigationId.split(' ')[0];

      let response;
      if (claimsType === 'cashless') {
        response = await caseInfoService.getCaseInfoDetails(cleanInvestigationId);
      } else {
        response = await caseInfoService.getCaseInfoDetailsReim(cleanInvestigationId);
      }

      if (response.statusCode === 0 && response.payload) {
        const data = response.payload;

        // Format intimation date
        const formattedIntimationDate = moment(data.intimationDate).format('YYYY-MM-DD hh:mm:ss a');
        setCaseInfo({
          ...data,
          intimationDate: formattedIntimationDate,
        });

        // Calculate report due date
        if (data.intimationDate && data.intimationDate !== '-') {
          calculateReportDueDate(data.intimationDate);
        }
      }
    } catch (error) {
      console.error('Error fetching case info:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateReportDueDate = (intimationDate: string) => {
    const intimationMoment = moment(intimationDate);

    if (claimsType === 'cashless') {
      if (userRole === 'Regional Manager' || userRole === 'Central Manager') {
        setReportDueDate(intimationMoment.add(48, 'hours').format('YYYY-MM-DD hh:mm:ss a'));
      } else if (userRole === 'Agency SPOC' || userRole === 'Field Officer') {
        setReportDueDate(intimationMoment.add(24, 'hours').format('YYYY-MM-DD hh:mm:ss a'));
      }
    } else if (claimsType === 'reim') {
      if (userRole === 'Regional Manager' || userRole === 'Central Manager') {
        setReportDueDate(intimationMoment.add(15, 'days').format('YYYY-MM-DD hh:mm:ss a'));
      } else if (userRole === 'Agency SPOC' || userRole === 'Field Officer') {
        setReportDueDate(intimationMoment.add(10, 'days').format('YYYY-MM-DD hh:mm:ss a'));
      }
    }
  };

  const decrypt = (value?: string): string => {
    if (!value || value === '-') {
      return '-';
    }
    return encryptionService.decryptJAVA(value);
  };

  const renderInvestigationTriggers = () => {
    const triggers = [];
    
    if (caseInfo?.automatedTriggerScore && caseInfo.automatedTriggerScore !== '-') {
      triggers.push(decrypt(caseInfo.automatedTriggerScore));
    }
    if (caseInfo?.fraudPredictiveScore && caseInfo.fraudPredictiveScore !== '-') {
      triggers.push(decrypt(caseInfo.fraudPredictiveScore));
    }
    if (caseInfo?.manualTriggerChecklist && caseInfo.manualTriggerChecklist !== '-') {
      triggers.push(decrypt(caseInfo.manualTriggerChecklist));
    }

    return triggers.length > 0 ? triggers.join(', ') : '-';
  };

  const InfoRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: '0.875rem',
            color: 'text.secondary',
          }}
        >
          {label}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            color: 'text.primary',
            textAlign: { xs: 'left', sm: 'right' },
            wordBreak: 'break-word',
          }}
        >
          {value || '-'}
        </Typography>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ mt: 3, textAlign: 'center', py: 4 }}>
        <Typography>Loading case information...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* Main Case Information Card */}
      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #F0F8FF 0%, #E6F2FF 100%)',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #D0E8FF',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Info sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Case Information
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoRow label="Case Type" value={caseInfo?.caseType} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                    }}
                  >
                    Investigation Triggers
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem',
                      color: 'text.primary',
                      textAlign: { xs: 'left', sm: 'right' },
                    }}
                  >
                    {renderInvestigationTriggers()}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoRow label="Investigation Type" value={caseInfo?.investigationType} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoRow label="Central Manager Remarks" value={decrypt(caseInfo?.centralRemarks)} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoRow label="Assigned by" value={decrypt(caseInfo?.assignedBy)} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoRow label="Regional Manager Remarks" value={decrypt(caseInfo?.rmRemarks)} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoRow label="Intimation Date" value={caseInfo?.intimationDate} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoRow label="Agency SPOC Remarks" value={caseInfo?.agencyspocRemarks} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoRow label="Report due date" value={reportDueDate} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoRow 
                label="Previous vendor investigation report" 
                value={caseInfo?.previousVendorinvestigationReport} 
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                }}
              >
                Trigger
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.primary',
                  textAlign: { xs: 'left', sm: 'right' },
                }}
              >
                {decrypt(caseInfo?.claimsRemarks)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Letter Formats Card */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, #F0F8FF 0%, #E6F2FF 100%)',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #D0E8FF',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Description sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Letter Formats
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.7)',
                  mb: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                >
                  Consent letter
                </Typography>
                <Link
                  href="#"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <Download sx={{ fontSize: 18, mr: 0.5 }} />
                  Download
                </Link>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.7)',
                  mb: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                >
                  Hospital application letter
                </Typography>
                <Link
                  href="#"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <Download sx={{ fontSize: 18, mr: 0.5 }} />
                  Download
                </Link>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                >
                  Vendor authorization letter
                </Typography>
                <Link
                  href="#"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <Download sx={{ fontSize: 18, mr: 0.5 }} />
                  Download
                </Link>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CaseInfoComponent;