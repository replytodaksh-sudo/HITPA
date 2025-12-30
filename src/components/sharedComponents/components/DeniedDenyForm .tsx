import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import DropdownService from '../../../services/dropdown.service';

/**
 * DeniedDenyForm Component
 * Read-only display of denial reasons from agency
 * Shows why the agency denied the case (for Regional Manager review)
 */
const DeniedDenyForm: React.FC = () => {
  const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
  const roleName = sessionStorage.getItem('roleName') || '';

  // State
  const [loading, setLoading] = useState(false);
  const [denyReasonList, setDenyReasonList] = useState<any[]>([]);
  const [denialReasonValue, setDenialReasonValue] = useState('');
  const [deniedBy, setDeniedBy] = useState('');
  const [investigationId, setInvestigationId] = useState('');

  // Extract clean investigation ID
  useEffect(() => {
    if (paramInvestigationId) {
      const cleanId = paramInvestigationId.split('-')[0].trim();
      setInvestigationId(cleanId);
    }
  }, [paramInvestigationId]);

  // Fetch denial reasons when investigationId is available
  useEffect(() => {
    if (investigationId) {
      fetchDenyReasons();
    }
  }, [investigationId]);

  const fetchDenyReasons = async () => {
    setLoading(true);
    try {
      const response:any = await DropdownService.getDenyReasons(investigationId);
      
      if (response.data.statusCode === 0) {
        const payload = response.data.payload;
        
        // Set the list of reasons (with checked status)
        setDenyReasonList(payload.denialReasons || []);
        
        // Combine all denial reason texts
        const combinedReasons = [
          payload.denialReasonAgency || '',
          payload.denialReasonRegional || '',
          payload.denialDecisionReason || '',
          payload.denialReasonCentral || '',
        ]
          .filter(Boolean)
          .join('\n');
        
        setDenialReasonValue(combinedReasons);
        setDeniedBy(payload.deniedBy || '');
      }
    } catch (err) {
      console.error('Failed to fetch deny reasons:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress sx={{ color: '#2E5A96' }}/>
      </Box>
    );
  }

  return (
    <Card
      sx={{
        mb: 3,
        bgcolor: '#fff8e1',
        boxShadow: 2,
        borderLeft: '4px solid #ffa726',
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: '#6F62C2',
            fontSize: '14px',
          }}
        >
          Reason for denial {deniedBy && `(${deniedBy})`}
        </Typography>

        {/* Display selected denial reasons (read-only checkboxes) */}
        {denyReasonList.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {denyReasonList.map((denyReason) => (
              <FormControlLabel
                key={denyReason.reasonCode}
                control={
                  <Checkbox
                    checked={true}
                    disabled={true}
                    sx={{
                      color: '#6F62C2',
                      '&.Mui-checked': {
                        color: '#6F62C2',
                      },
                      '&.Mui-disabled': {
                        color: '#9e9e9e',
                      },
                    }}
                  />
                }
                label={denyReason.reason}
                sx={{
                  display: 'block',
                  mb: 1,
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.95rem',
                    color: 'text.primary',
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Display denial reason details (read-only textarea) */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            Denial Reason Details
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={denialReasonValue}
            disabled={true}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f5f5f5',
              },
              '& .Mui-disabled': {
                WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
              },
            }}
          />
        </Box>

        {/* Info message for Regional Manager */}
        {roleName === 'Regional Manager' && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: '#e3f2fd',
              borderRadius: 1,
              border: '1px solid #90caf9',
            }}
          >
            <Typography variant="body2" sx={{ color: '#1976d2' }}>
              <strong>Action Required:</strong> Please review the agency's denial reasons above and decide whether to accept or reject their decision.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DeniedDenyForm;