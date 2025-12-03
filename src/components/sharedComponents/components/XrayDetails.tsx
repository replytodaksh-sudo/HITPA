// ==================== COMPLETE XRAY DETAILS COMPONENT ====================
// All 4 parts combined into one working component

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  FormLabel,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Typography,
  Divider,
} from '@mui/material';

// ==================== INTERFACES ====================
interface XrayDetailsProps {
  isFormEditable?: boolean;
  previousData?: any;
  caseUpdateService?: any;
}

interface SectionData {
  visitDone: boolean | null;
  reportsVerified: boolean | null;
  finding: string;
}

interface VisibilityState {
  sonography: boolean;
  xray: boolean;
  mri: boolean;
  ctscan: boolean;
  bloodbank: boolean;
  physiotherapy: boolean;
}

interface CheckedState {
  sonography: boolean;
  xray: boolean;
  mri: boolean;
  ctscan: boolean;
  bloodbank: boolean;
  physiotherapy: boolean;
}

interface FormState {
  sonography: SectionData;
  xray: SectionData;
  mri: SectionData;
  ctscan: SectionData;
  bloodbank: SectionData;
  physiotherapy: SectionData;
  pathItem: any[];
}

// ==================== CONSTANTS ====================
const defaultSectionData: SectionData = {
  visitDone: null,
  reportsVerified: null,
  finding: '',
};

const ITEMS = [
  { value: 'sonography', label: 'Sonography', key: 'sonography' as keyof FormState },
  { value: 'xray', label: 'X-Ray', key: 'xray' as keyof FormState },
  { value: 'mri', label: 'MRI', key: 'mri' as keyof FormState },
  { value: 'ctscan', label: 'CT Scan', key: 'ctscan' as keyof FormState },
  { value: 'bloodbankvisit', label: 'Blood Bank Visit', key: 'bloodbank' as keyof FormState },
  {
    value: 'physiotherapycenter',
    label: 'Physiotherapy Centres',
    key: 'physiotherapy' as keyof FormState,
  },
];

// ==================== HELPER FUNCTIONS ====================
const getKeyFromValue = (value: string): keyof FormState | null => {
  const item = ITEMS.find((i) => i.value === value);
  return item ? item.key : null;
};

const getFieldNames = (key: keyof FormState) => {
  const fieldMap: any = {
    sonography: {
      visitDone: 'sonographyVisitDone',
      reportsVerified: 'sonographyReportsVerified',
      finding: 'sonographyFinding',
    },
    xray: {
      visitDone: 'xrayVisitDone',
      reportsVerified: 'xrayReportsVerified',
      finding: 'xrayFinding',
    },
    mri: {
      visitDone: 'mriVisitDone',
      reportsVerified: 'mriReportsVerified',
      finding: 'mriFinding',
    },
    ctscan: {
      visitDone: 'ctScanVisitDone',
      reportsVerified: 'ctScanReportsVerified',
      finding: 'ctScanFinding',
    },
    bloodbank: {
      visitDone: 'bloodBankVisitDone',
      reportsVerified: 'bloodBankReportsVerified',
      finding: 'bloodBankFinding',
    },
    physiotherapy: {
      visitDone: 'therapyVisitDone',
      reportsVerified: 'therapyReportsVerified',
      finding: 'therapyFinding',
    },
  };
  return fieldMap[key];
};

const getSectionTitle = (key: keyof FormState): string => {
  const titleMap: any = {
    sonography: 'Sonography',
    xray: 'X-Ray',
    mri: 'MRI',
    ctscan: 'CT Scan',
    bloodbank: 'Blood Bank',
    physiotherapy: 'Physiotherapy Centres',
  };
  return titleMap[key];
};

// ==================== DEFAULT SERVICE ====================
const defaultCaseUpdateStore: Record<string, any> = {};
const defaultCaseUpdateService = {
  setCaseUpdateVal: (key: string, value: any) => {
    defaultCaseUpdateStore[key] = value;
  },
  getCaseUpdateVal: (key: string) => {
    return defaultCaseUpdateStore[key];
  },
};

// ==================== MAIN COMPONENT ====================
const XrayDetails: React.FC<XrayDetailsProps> = ({
  isFormEditable = true,
  previousData = {},
  caseUpdateService = defaultCaseUpdateService,
}) => {
  // ===== STATE =====
  const [formState, setFormState] = useState<FormState>({
    sonography: { ...defaultSectionData },
    xray: { ...defaultSectionData },
    mri: { ...defaultSectionData },
    ctscan: { ...defaultSectionData },
    bloodbank: { ...defaultSectionData },
    physiotherapy: { ...defaultSectionData },
    pathItem: [],
  });

  const [visibility, setVisibility] = useState<VisibilityState>({
    sonography: false,
    xray: false,
    mri: false,
    ctscan: false,
    bloodbank: false,
    physiotherapy: false,
  });

  const [checked, setChecked] = useState<CheckedState>({
    sonography: false,
    xray: false,
    mri: false,
    ctscan: false,
    bloodbank: false,
    physiotherapy: false,
  });

  // ===== POPULATE DATA EFFECT =====
  useEffect(() => {
    if (previousData && Object.keys(previousData).length > 0) {
      const newFormState = { ...formState };
      const newVisibility = { ...visibility };
      const newChecked = { ...checked };

      // Sonography
      if (previousData.sonographyVisitDone != null) {
        newVisibility.sonography = true;
        newChecked.sonography = true;
        newFormState.sonography = {
          visitDone: previousData.sonographyVisitDone,
          reportsVerified: previousData.sonographyReportsVerified,
          finding: previousData.sonographyFinding || '',
        };
      }

      // X-Ray
      if (previousData.xrayVisitDone != null) {
        newVisibility.xray = true;
        newChecked.xray = true;
        newFormState.xray = {
          visitDone: previousData.xrayVisitDone,
          reportsVerified: previousData.xrayReportsVerified,
          finding: previousData.xrayFinding || '',
        };
      }

      // MRI
      if (previousData.mriVisitDone != null) {
        newVisibility.mri = true;
        newChecked.mri = true;
        newFormState.mri = {
          visitDone: previousData.mriVisitDone,
          reportsVerified: previousData.mriReportsVerified,
          finding: previousData.mriFinding || '',
        };
      }

      // CT Scan
      if (previousData.ctScanVisitDone != null) {
        newVisibility.ctscan = true;
        newChecked.ctscan = true;
        newFormState.ctscan = {
          visitDone: previousData.ctScanVisitDone,
          reportsVerified: previousData.ctScanReportsVerified,
          finding: previousData.ctScanFinding || '',
        };
      }

      // Blood Bank
      if (previousData.bloodBankVisitDone != null) {
        newVisibility.bloodbank = true;
        newChecked.bloodbank = true;
        newFormState.bloodbank = {
          visitDone: previousData.bloodBankVisitDone,
          reportsVerified: previousData.bloodBankReportsVerified,
          finding: previousData.bloodBankFinding || '',
        };
      }

      // Physiotherapy
      if (previousData.therapyVisitDone != null) {
        newVisibility.physiotherapy = true;
        newChecked.physiotherapy = true;
        newFormState.physiotherapy = {
          visitDone: previousData.therapyVisitDone,
          reportsVerified: previousData.therapyReportsVerified,
          finding: previousData.therapyFinding || '',
        };
      }

      // Path Item
      if (previousData.pathItem) {
        newFormState.pathItem = previousData.pathItem;
      }

      setFormState(newFormState);
      setVisibility(newVisibility);
      setChecked(newChecked);
      saveAllToCaseUpdateService(newFormState);
    }
  }, [previousData]);

  // ===== SAVE TO SERVICE =====
  const saveAllToCaseUpdateService = (state: FormState) => {
    Object.keys(state).forEach((key) => {
      if (key !== 'pathItem') {
        const sectionKey = key as keyof Omit<FormState, 'pathItem'>;
        const fieldNames = getFieldNames(sectionKey);
        caseUpdateService.setCaseUpdateVal(fieldNames.visitDone, state[sectionKey].visitDone);
        caseUpdateService.setCaseUpdateVal(
          fieldNames.reportsVerified,
          state[sectionKey].reportsVerified
        );
        caseUpdateService.setCaseUpdateVal(fieldNames.finding, state[sectionKey].finding);
      }
    });
    caseUpdateService.setCaseUpdateVal('pathItem', state.pathItem);
  };

  // ===== EVENT HANDLERS =====
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked: isChecked } = event.target;
    const key = getKeyFromValue(value);

    if (key && key !== 'pathItem') {
      setVisibility({ ...visibility, [key]: isChecked });
      setChecked({ ...checked, [key]: isChecked });
    }
  };

  const handleFieldUpdate = (
    sectionKey: keyof Omit<FormState, 'pathItem'>,
    fieldKey: 'visitDone' | 'reportsVerified' | 'finding',
    value: any
  ) => {
    const newFormState = {
      ...formState,
      [sectionKey]: {
        ...formState[sectionKey],
        [fieldKey]: value,
      },
    };
    setFormState(newFormState);

    const fieldNames = getFieldNames(sectionKey);
    caseUpdateService.setCaseUpdateVal(fieldNames[fieldKey], value);
  };

  // ===== RENDER SECTION =====
  const renderSection = (sectionKey: keyof Omit<FormState, 'pathItem'>) => {
    if (!visibility[sectionKey]) return null;

    const section = formState[sectionKey];
    const title = getSectionTitle(sectionKey);

    return (
      <Box key={sectionKey} sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          {title}
        </Typography>

        <Grid container spacing={3} sx={{ mb: 2 }}>
          {/* Visit Done */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FormLabel>Visit Done</FormLabel>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <RadioGroup
              row
              value={section.visitDone === null ? '' : String(section.visitDone)}
              onChange={(e) => handleFieldUpdate(sectionKey, 'visitDone', e.target.value === 'true')}
            >
              <FormControlLabel
                value="true"
                control={<Radio disabled={!isFormEditable} />}
                label="Yes"
              />
              <FormControlLabel
                value="false"
                control={<Radio disabled={!isFormEditable} />}
                label="No"
              />
            </RadioGroup>
          </Grid>

          {/* Reports Verified */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FormLabel>Reports verified</FormLabel>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <RadioGroup
              row
              value={section.reportsVerified === null ? '' : String(section.reportsVerified)}
              onChange={(e) =>
                handleFieldUpdate(sectionKey, 'reportsVerified', e.target.value === 'true')
              }
            >
              <FormControlLabel
                value="true"
                control={<Radio disabled={!isFormEditable} />}
                label="Yes"
              />
              <FormControlLabel
                value="false"
                control={<Radio disabled={!isFormEditable} />}
                label="No"
              />
            </RadioGroup>
          </Grid>
        </Grid>

        {/* Findings */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormLabel>Findings</FormLabel>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={section.finding}
              onChange={(e) => handleFieldUpdate(sectionKey, 'finding', e.target.value)}
              disabled={!isFormEditable}
            />
          </Grid>
        </Grid>
        <Divider sx={{ mt: 3 }} />
      </Box>
    );
  };

  // ===== RENDER =====
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* LEFT: Checkbox List */}
        <Grid size={{ xs: 12, md: 3 }}>
          <FormLabel sx={{ mb: 2, display: 'block', fontWeight: 'bold' }}>Item:</FormLabel>
          <Box>
            {ITEMS.map((item) => (
              <FormControlLabel
                key={item.value}
                control={
                  <Checkbox
                    value={item.value}
                    checked={checked[item.key as keyof CheckedState]}
                    onChange={handleCheckboxChange}
                    disabled={!isFormEditable}
                  />
                }
                label={item.label}
                sx={{ display: 'block', mb: 1 }}
              />
            ))}
          </Box>
        </Grid>

        {/* RIGHT: Dynamic Sections */}
        <Grid size={{ xs: 12, md: 9 }}>
          {renderSection('sonography')}
          {renderSection('xray')}
          {renderSection('mri')}
          {renderSection('ctscan')}
          {renderSection('bloodbank')}
          {renderSection('physiotherapy')}
        </Grid>
      </Grid>
    </Box>
  );
};

export default XrayDetails;