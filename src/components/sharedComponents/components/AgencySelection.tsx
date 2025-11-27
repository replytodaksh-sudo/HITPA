import React from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';

interface AgencySelectionProps {
  roleName: string;
  agencyRadioValue: number;
  setAgencyRadioValue: (value: number) => void;
  agencyCode: string;
  setAgencyCode: (code: string) => void;
  agencyList: any[];
  systemSuggestedAgencies: any[];
  fieldOfficerList: any[];
  performanceIndex: any;
  onAgencyChange: (code: string) => void;
}

const AgencySelection: React.FC<AgencySelectionProps> = ({
  roleName,
  agencyRadioValue,
  setAgencyRadioValue,
  agencyCode,
  setAgencyCode,
  agencyList,
  systemSuggestedAgencies,
  fieldOfficerList,
  performanceIndex,
  onAgencyChange,
}) => {
  const handleAgencyCodeChange = (code: string) => {
    setAgencyCode(code);
    onAgencyChange(code);
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            {roleName === 'Regional Manager' && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Assigning investigation to Agency
                </Typography>
                <RadioGroup
                  value={agencyRadioValue}
                  onChange={(e) => setAgencyRadioValue(Number(e.target.value))}
                >
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="System Suggested Agencies"
                  />
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Choose Agency for Investigation"
                  />
                </RadioGroup>
              </>
            )}

            {roleName === 'Agency Spoc' && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Assigning investigation to Field Officer
                </Typography>
                <RadioGroup
                  value={agencyRadioValue}
                  onChange={(e) => setAgencyRadioValue(Number(e.target.value))}
                >
                  <FormControlLabel
                    value={11}
                    control={<Radio />}
                    label="Choose Field Officer for investigation"
                  />
                </RadioGroup>
              </>
            )}

            {/* Manual Agency Selection */}
            {agencyRadioValue === 1 && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Select
                  value={agencyCode}
                  onChange={(e) => handleAgencyCodeChange(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">--- Choose Agency ---</MenuItem>
                  {agencyList.map((agency) => (
                    <MenuItem key={agency.agencyCode} value={agency.agencyCode}>
                      {agency.agencyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Field Officer Selection */}
            {agencyRadioValue === 11 && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Select
                  value={agencyCode}
                  onChange={(e) => setAgencyCode(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">--- Choose Field Officer ---</MenuItem>
                  {fieldOfficerList.map((officer) => (
                    <MenuItem key={officer.userCode} value={officer.userCode}>
                      {officer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* System Suggested Agencies Table */}
            {agencyRadioValue === 0 && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Agency Name</TableCell>
                      <TableCell>Applied Rule</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {systemSuggestedAgencies.map((agency) => (
                      <TableRow key={agency.agencyCode}>
                        <TableCell>
                          <Radio
                            checked={agencyCode === agency.agencyCode}
                            onChange={() => handleAgencyCodeChange(agency.agencyCode)}
                            value={agency.agencyCode}
                          />
                        </TableCell>
                        <TableCell>{agency.agencyName}</TableCell>
                        <TableCell>{agency.ruleCode}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Performance Index */}
      {roleName === 'Regional Manager' && performanceIndex && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                Performance Index
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Total No. cases assigned in last 2 days</TableCell>
                      <TableCell>{performanceIndex.totalNoOfCases}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Open Cases</TableCell>
                      <TableCell>{performanceIndex.openCases}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Last Month Hit Ratio</TableCell>
                      <TableCell>{performanceIndex.lastMonthHitRatio}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average Rating</TableCell>
                      <TableCell>{performanceIndex.averageRating}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default AgencySelection;
