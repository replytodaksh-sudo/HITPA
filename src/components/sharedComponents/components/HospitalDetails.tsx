// // src/components/CaseUpdate/HospitalDetails.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   Box,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   Typography,
//   Paper,
//   Grid
// } from '@mui/material';
// import { caseUpdateService } from '../../../services/reimCaseUpdateService';

// interface HospitalDetailsProps {
//   isInsuredVisit?: boolean;
//   isFormEditable: boolean;
//   previousData?: any;
// }

// const HospitalDetails: React.FC<HospitalDetailsProps> = ({
//   isInsuredVisit,
//   isFormEditable,
//   previousData
// }) => {
//   const { investigationId } = useParams<{ investigationId: string }>();

//   const [hospitalFeedBack, setHospitalFeedBack] = useState('Select');
//   const [hospitalRemarks, setHospitalRemarks] = useState('');

//   // Populate data from previousData
//   useEffect(() => {
//     if (previousData) {
//       populateData();
//     }
//   }, [previousData]);

//   const populateData = () => {
//     if (!previousData) return;

//     setHospitalFeedBack(previousData.hospitalFeedback || 'Select');
//     caseUpdateService.setCaseUpdateVal("hospitalFeedback", previousData.hospitalFeedback)
//     setHospitalRemarks(previousData.hospitalRemark || '');
//     caseUpdateService.setCaseUpdateVal("hospitalRemark", previousData.hospitalRemark)
//   };

//   // Get submit data (to be called by parent component)
//   const getSubmitData = () => {
//     return {
//       hospitalFeedBack,
//       hospitalRemarks,
//       activeCaseID: localStorage.getItem('activeCaseID')
//     };
//   };

//   return (
//     <Paper sx={{ p: 3 }}>
//       <Typography variant="h6" gutterBottom sx={{ fontSize: '14px', fontWeight: 'bold' }}>
//         Hospital Rating
//       </Typography>

//       {/* Hospital Feedback */}
//       <Box sx={{ mb: 3 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid size={{ xs: 2 }}>
//             <Typography>Hospital Feedback</Typography>
//           </Grid>
//           <Grid size={{ xs: 2 }}>
//             <FormControl fullWidth size="small">
//               <Select
//                 value={hospitalFeedBack}
//                 onChange={(e) => { setHospitalFeedBack(e.target.value); caseUpdateService.setCaseUpdateVal("hospitalFeedback", e.target.value) }}
//                 disabled={!isFormEditable}
//               >
//                 <MenuItem value="Select">Select</MenuItem>
//                 <MenuItem value="Good">Good</MenuItem>
//                 <MenuItem value="Caution">Caution</MenuItem>
//                 <MenuItem value="Fraud">Fraud</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid>
//       </Box>

//       {/* Hospital Remarks */}
//       <Box sx={{ mb: 3 }}>
//         <Grid container spacing={2}>
//           <Grid size={{ xs: 2 }}>
//             <Typography>Hospital Remarks</Typography>
//           </Grid>
//           <Grid size={{ xs: 10 }}>
//             <TextField
//               fullWidth
//               multiline
//               rows={10}
//               placeholder="Hospital Remarks"
//               value={hospitalRemarks}
//               onChange={(e) => { setHospitalRemarks(e.target.value); caseUpdateService.setCaseUpdateVal("hospitalRemark", e.target.value) }}
//               disabled={!isFormEditable}
//               size="small"
//             />
//           </Grid>
//         </Grid>
//       </Box>
//     </Paper>
//   );
// };

// export default HospitalDetails;





import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';

interface HospitalFormState {
  hospitalRemark: string;
  hospitalFeedback:string;
  [key: string]: any;
}

interface HospitalOtherObservationProps {
  isFormEditable: boolean;
  formState: HospitalFormState;
  updateFormState: (field: keyof HospitalFormState, value: any) => void;
}

const HospitalOtherObservation: React.FC<HospitalOtherObservationProps> = ({
  isFormEditable,
  formState,
  updateFormState
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '14px', fontWeight: 'bold' }}>
        Hospital Rating
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 2 }}>
            <Typography>Hospital Feedback</Typography>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <FormControl fullWidth size="small">
              <Select
                value={formState.hospitalFeedback || ''}
                onChange={(e) => updateFormState('hospitalFeedback', e.target.value)}
                disabled={!isFormEditable}
              >
                <MenuItem value="Select">Select</MenuItem>
                <MenuItem value="Good">Good</MenuItem>
                <MenuItem value="Caution">Caution</MenuItem>
                <MenuItem value="Fraud">Fraud</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              value={formState.hospitalRemark || ''}
              onChange={(e) => updateFormState('hospitalRemark', e.target.value)}
              disabled={!isFormEditable}
              size="small"
              fullWidth
              multiline
              rows={10}
              placeholder="Hospital Remarks"
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default HospitalOtherObservation;