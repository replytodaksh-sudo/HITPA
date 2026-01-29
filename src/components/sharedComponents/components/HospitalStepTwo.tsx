// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
// import {
//     Box,
//     Card,
//     CardContent,
//     Button,
//     List,
//     ListItem,
//     ListItemText,
//     Grid,
// } from '@mui/material';
// import HospitalOtherObservation from './HospitalOtherObservation';
// import XrayDetails from './XrayDetails';
// import TreatingDoctorDetails from './TreatingDoctorDetails';
// import PathologyDetails from './PathologyDetails';
// import HospitalDetails from './HospitalDetails';
// import ChemistDetailsComponent from './ChemistDetailsComponent';
// import ReimService from '../../../services/reim.service';
// import { caseUpdateService } from '../../../services/reimCaseUpdateService';
// import reimcaseUpdateService from '../../../services/reim-case-update.service';
// import { notificationService } from '../../../utils/notification.service';

// // ==================== INTERFACES ====================
// interface TabCheck {
//     employeerVisit: boolean;
//     hospitalVisit: boolean;
//     insuredPersonVisit: boolean;
// }

// interface MenuItem {
//     label: string;
//     value: string;
// }

// interface HospitalStepTwoProps {
//     buttonEnable?: boolean;
//     previousData?: any;
//     onChangeTab?: any;
// }


// const messages = {
//     hospVerifySaved: 'Hospital verification saved successfully',
//     hospVerifySubmit: 'Hospital verification submitted successfully',
// };

// // ==================== MAIN COMPONENT ====================
// const HospitalStepTwo: React.FC<HospitalStepTwoProps> = ({
//     buttonEnable = true,
//     previousData = {},
//     onChangeTab
// }) => {
//     const { investigationId } = useParams<{ investigationId: string }>();
//     const navigate = useNavigate();
//     const [searchParams] = useSearchParams();

//     const acceptAssignId = searchParams.get('acceptAssignId');

//     // Menu items
//     const menuList: MenuItem[] = [
//         { label: 'Treating Doctor Verification', value: 'treatingDoctorVerification' },
//         { label: 'Chemist Verification', value: 'chemistVerification' },
//         { label: 'Pathologist Verification', value: 'pathologyVerification' },
//         {
//             label: 'X-Ray/Sonography/MRI/CT Scan/Blood Bank Visit/Physiotherapy Centres Verification',
//             value: 'centreVerification',
//         },
//         { label: 'Hospital Rating', value: 'hospitalRating' },
//         { label: 'Any Other Observations/Findings', value: 'otherObservations' },
//     ];

//     // State
//     const [selectedMenu, setSelectedMenu] = useState<MenuItem>(menuList[0]);
//     const [tabCheck, setTabCheck] = useState<TabCheck>({
//         employeerVisit: false,
//         hospitalVisit: false,
//         insuredPersonVisit: false,
//     });
//     const [loading, setLoading] = useState(false);

//     // Load tab details on mount
//     useEffect(() => {
//         if (investigationId) {
//             const cleanId = investigationId.split(' ')[0];
//             ReimService.getTabDetails(cleanId, 'caseUpdate').then((data) => {
//                 if (data.statusCode === 0) {
//                     setTabCheck(data.payload);
//                 }
//             });
//         }
//     }, [investigationId]);

//     // Build step two payload
//     const buildStepTwoPayload = (btnAction: string) => {
//         const payload: any = {
//             reCaseUpdateTreatingDocterDetailsDTO: caseUpdateService.getCaseUpdateVal(
//                 'reCaseUpdateTreatingDocterDetailsDTO'
//             ),
//             reCaseUpdateReferralDocterDetailsDTO: caseUpdateService.getCaseUpdateVal(
//                 'reCaseUpdateReferralDocterDetailsDTO'
//             ),
//             labExist: caseUpdateService.getCaseUpdateVal('labExist'),
//             chemistExist: caseUpdateService.getCaseUpdateVal('chemistExist'),
//             activeReCaseID: localStorage.getItem('activeReCaseID'),
//             acceptAssignId: acceptAssignId,
//             sonographyVisitDone: caseUpdateService.getCaseUpdateVal('sonographyVisitDone'),
//             sonographyReportsVerified: caseUpdateService.getCaseUpdateVal('sonographyReportsVerified'),
//             sonographyFinding: caseUpdateService.getCaseUpdateVal('sonographyFinding'),
//             pathItem: caseUpdateService.getCaseUpdateVal('pathItem'),
//             xrayVisitDone: caseUpdateService.getCaseUpdateVal('xrayVisitDone'),
//             xrayReportsVerified: caseUpdateService.getCaseUpdateVal('xrayReportsVerified'),
//             xrayFinding: caseUpdateService.getCaseUpdateVal('xrayFinding'),
//             mriVisitDone: caseUpdateService.getCaseUpdateVal('mriVisitDone'),
//             mriReportsVerified: caseUpdateService.getCaseUpdateVal('mriReportsVerified'),
//             mriFinding: caseUpdateService.getCaseUpdateVal('mriFinding'),
//             ctScanVisitDone: caseUpdateService.getCaseUpdateVal('ctScanVisitDone'),
//             ctScanReportsVerified: caseUpdateService.getCaseUpdateVal('ctScanReportsVerified'),
//             ctScanFinding: caseUpdateService.getCaseUpdateVal('ctScanFinding'),
//             bloodBankVisitDone: caseUpdateService.getCaseUpdateVal('bloodBankVisitDone'),
//             bloodBankReportsVerified: caseUpdateService.getCaseUpdateVal('bloodBankReportsVerified'),
//             bloodBankFinding: caseUpdateService.getCaseUpdateVal('bloodBankFinding'),
//             therapyVisitDone: caseUpdateService.getCaseUpdateVal('therapyVisitDone'),
//             therapyReportsVerified: caseUpdateService.getCaseUpdateVal('therapyReportsVerified'),
//             therapyFinding: caseUpdateService.getCaseUpdateVal('therapyFinding'),
//             hospitalFeedback: caseUpdateService.getCaseUpdateVal('hospitalFeedback'),
//             hospitalRemark: caseUpdateService.getCaseUpdateVal('hospitalRemark'),
//             anyOtherObservationFinding: caseUpdateService.getCaseUpdateVal('anyOtherObservationFinding'),
//             btnAction: btnAction,
//         };

//         // Conditional fields based on lab and chemist existence
//         const labExists = caseUpdateService.getCaseUpdateVal('labExist');
//         const chemExists = caseUpdateService.getCaseUpdateVal('chemistExist');

//         if (labExists === false) {
//             payload.labExistFinding = caseUpdateService.getCaseUpdateVal('labExistFinding');
//         }
//         if (chemExists === false) {
//             payload.chemistExistFinding = caseUpdateService.getCaseUpdateVal('chemistExistFinding');
//         }
//         if (labExists === true) {
//             payload.reCaseUpdatePathologyDetailsDTO = caseUpdateService.getCaseUpdateVal(
//                 'reCaseUpdatePathologyDetailsDTO'
//             );
//         }
//         if (chemExists === true) {
//             payload.reCaseUpdateChemistDetailsDTO = caseUpdateService.getCaseUpdateVal(
//                 'reCaseUpdateChemistDetailsDTO'
//             );
//         }

//         // Treating doctor statement collected
//         const tDrStatementCollected = caseUpdateService.getCaseUpdateVal('treatingDrStatementCollected');
//         payload.treatingDrStatementCollected = tDrStatementCollected;

//         if (tDrStatementCollected === true) {
//             payload.treatingDrStatementCollectedDiscrepanciesFound = caseUpdateService.getCaseUpdateVal(
//                 'treatingDrStatementCollectedDiscrepanciesFound'
//             );
//             payload.treatingDrStatementCollectedPEDNoted = caseUpdateService.getCaseUpdateVal(
//                 'treatingDrStatementCollectedPEDNoted'
//             );
//             payload.treatingDrStatementCollectedDiscrepanciesFinding = caseUpdateService.getCaseUpdateVal(
//                 'treatingDrStatementCollectedDiscrepanciesFinding'
//             );
//             payload.treatingDrStatementCollectedPEDNotedFinding = caseUpdateService.getCaseUpdateVal(
//                 'treatingDrStatementCollectedPEDNotedFinding'
//             );
//         }
//         if (tDrStatementCollected === false) {
//             payload.treatingDrStatementCollectedReason = caseUpdateService.getCaseUpdateVal(
//                 'treatingDrStatementCollectedReason'
//             );
//         }

//         // Referral doctor statement collected
//         const rDrStatementCollected = caseUpdateService.getCaseUpdateVal('referralDrStatementCollected');
//         payload.referralDrStatementCollected = rDrStatementCollected;

//         if (rDrStatementCollected === true) {
//             payload.referralDrStatementCollectedDiscrepanciesFound = caseUpdateService.getCaseUpdateVal(
//                 'referralDrStatementCollectedDiscrepanciesFound'
//             );
//             payload.referralDrStatementCollectedPEDNoted = caseUpdateService.getCaseUpdateVal(
//                 'referralDrStatementCollectedPEDNoted'
//             );
//             payload.referralDrStatementCollectedDiscrepanciesFinding = caseUpdateService.getCaseUpdateVal(
//                 'referralDrStatementCollectedDiscrepanciesFinding'
//             );
//             payload.referralDrStatementCollectedPEDNotedFinding = caseUpdateService.getCaseUpdateVal(
//                 'referralDrStatementCollectedPEDNotedFinding'
//             );
//         }
//         if (rDrStatementCollected === false) {
//             payload.referralDrStatementCollectedReason = caseUpdateService.getCaseUpdateVal(
//                 'referralDrStatementCollectedReason'
//             );
//         }

//         return payload;
//     };
// console.log("poiuytre3wq", caseUpdateService.getAllValues())
//     // Save handler
//     const saveStepTwo = async () => {
//         // setLoading(true);
//         const cleanId = investigationId?.split(' ')[0] || '';
//         const payload = buildStepTwoPayload('saveasdraft');
//         console.log("12346u", payload)
//         // try {
//         //     const data: any = await reimcaseUpdateService.addHospitalVerifyTwo(payload, cleanId);
//         //     if (data.statusCode === 0) {
//         //         notificationService.showAlertSuccess(messages.hospVerifySaved);
//         //         onChangeTab(true);
//         //     } else {
//         //         notificationService.showAlertError(data.message);
//         //     }
//         // } catch (error) {
//         //     notificationService.showAlertError('Error saving hospital verification');
//         // } finally {
//         //     setLoading(false);
//         // }
//     };

//     // Submit handler
//     const submitStepTwo = async () => {
//         setLoading(true);
//         const cleanId = investigationId?.split(' ')[0] || '';
//         const payload = buildStepTwoPayload('submittoqc');

//         try {
//             const data: any = await reimcaseUpdateService.addHospitalVerifyTwo(payload, cleanId);
//             if (data.statusCode === 0) {
//                 notificationService.showAlertSuccess(messages.hospVerifySubmit);
//                 onChangeTab(true);
//                 // navigate('/admin/dashboard');
//             } else {
//                 notificationService.showAlertError(data.message);
//             }
//         } catch (error) {
//             notificationService.showAlertError('Error submitting hospital verification');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Render selected menu content
//     const renderContent = () => {
//         switch (selectedMenu.value) {
//             case 'treatingDoctorVerification':
//                 return (<TreatingDoctorDetails
//                     buttonEnable={buttonEnable}
//                     previousData={previousData}
//                     title="Treating Doctor Details"
//                 />
//                 );
//             case 'chemistVerification':
//                 return <ChemistDetailsComponent buttonEnable={buttonEnable} previousData={previousData}/>;
//             case 'pathologyVerification':
//                 return <PathologyDetails buttonEnable={buttonEnable} previousData={previousData} />;
//             case 'centreVerification':
//                 return <XrayDetails isFormEditable={buttonEnable} previousData={previousData} />;
//             case 'hospitalRating':
//                 return <HospitalDetails isFormEditable={buttonEnable} previousData={previousData} />;
//             case 'otherObservations':
//                 return (
//                     <HospitalOtherObservation isFormEditable={buttonEnable} previousData={previousData} />
//                 );
//             default:
//                 return null;
//         }
//     };
//     console.log('Render HospitalStepTwo', buttonEnable, tabCheck);
//     return (
//         <Box>
//             <Card>
//                 <CardContent>
//                     <Grid container spacing={3}>
//                         {/* Left Menu */}
//                         <Grid size={{ xs: 12, md: 3 }}>
//                             <List
//                                 sx={{
//                                     p: 0,
//                                     '& .MuiListItem-root': {
//                                         backgroundColor: '#eee',
//                                         color: 'black',
//                                         cursor: 'pointer',
//                                         mb: 0.5,
//                                         borderRadius: 1,
//                                         transition: 'all 0.2s',
//                                         '&:hover': {
//                                             backgroundColor: '#ccc',
//                                         },
//                                         '&.active': {
//                                             backgroundColor: '#6770d2',
//                                             color: 'white !important',
//                                         },
//                                     },
//                                 }}
//                             >
//                                 {menuList.map((menu) => (
//                                     <ListItem
//                                         key={menu.value}
//                                         onClick={() => setSelectedMenu(menu)}
//                                         className={selectedMenu.value === menu.value ? 'active' : ''}
//                                         sx={{ color: "#fff", wordBreak: "break-word" }}
//                                     >
//                                         <ListItemText
//                                             primary={menu.label}
//                                             primaryTypographyProps={{
//                                                 fontSize: '0.9rem',
//                                                 fontWeight: selectedMenu.value === menu.value ? 600 : 400,
//                                             }}
//                                         />
//                                     </ListItem>
//                                 ))}
//                             </List>
//                         </Grid>

//                         {/* Right Content */}
//                         <Grid size={{ xs: 12, md: 9 }}>
//                             <Box>{renderContent()}</Box>
//                         </Grid>
//                     </Grid>

//                     {/* Action Buttons */}
//                     {buttonEnable && (
//                         <Box sx={{ mt: 4, textAlign: 'right' }}>
//                             {/* Case 1: Only hospital visit, no employer and insured */}
//                             {!tabCheck.employeerVisit &&
//                                 tabCheck.hospitalVisit &&
//                                 !tabCheck.insuredPersonVisit && (
//                                     <>
//                                         <Button
//                                             variant="contained"
//                                             onClick={saveStepTwo}
//                                             disabled={loading}
//                                             sx={{ mr: 2 }}
//                                         >
//                                             Save
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             onClick={submitStepTwo}
//                                             disabled={loading}
//                                             sx={{
//                                                 background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
//                                                 '&:hover': {
//                                                     background: 'linear-gradient(135deg, #5568D3 0%, #63408B 100%)',
//                                                 },
//                                             }}
//                                         >
//                                             Submit to QC
//                                         </Button>
//                                     </>
//                                 )}

//                             {/* Case 2: Hospital visit with insured, no employer */}
//                             {!tabCheck.employeerVisit && tabCheck.hospitalVisit && tabCheck.insuredPersonVisit && (
//                                 <Button variant="contained" onClick={saveStepTwo} disabled={loading}>
//                                     Save
//                                 </Button>
//                             )}

//                             {/* Case 3: Employer and hospital visit, no insured */}
//                             {tabCheck.employeerVisit && tabCheck.hospitalVisit && !tabCheck.insuredPersonVisit && (
//                                 <Button variant="contained" onClick={saveStepTwo} disabled={loading}>
//                                     Save
//                                 </Button>
//                             )}

//                             {/* Case 4: All three visits */}
//                             {tabCheck.employeerVisit && tabCheck.hospitalVisit && tabCheck.insuredPersonVisit && (
//                                 <Button variant="contained" onClick={saveStepTwo} disabled={loading}>
//                                     Save
//                                 </Button>
//                             )}
//                         </Box>
//                     )}
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// };

// export default HospitalStepTwo;




import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemText,
    Grid,
} from '@mui/material';
import HospitalOtherObservation from './HospitalOtherObservation';
import XrayDetails from './XrayDetails';
import TreatingDoctorDetails from './TreatingDoctorDetails';
import PathologyDetails from './PathologyDetails';
import HospitalDetails from './HospitalDetails';
import ChemistDetailsComponent from './ChemistDetailsComponent';
import ReimService from '../../../services/reim.service';
import reimcaseUpdateService from '../../../services/reim-case-update.service';
import { notificationService } from '../../../utils/notification.service';

// ==================== INTERFACES ====================
interface TabCheck {
    employeerVisit: boolean;
    hospitalVisit: boolean;
    insuredPersonVisit: boolean;
}

interface MenuItem {
    label: string;
    value: string;
}

interface HospitalStepTwoProps {
    buttonEnable?: boolean;
    previousData?: any;
    onChangeTab?: any;
}

interface DoctorRow {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    contactNo?: string;
    regNo?: string;
    qualification?: string;
    stream?: string;
    fraud?: boolean;
}

interface PathologyDetail {
    isPathologist?: boolean;
    pathologistName?: string;
    pathologistContactNumber?: string;
    pathologistRegistrationNumber?: string;
    pathologistFeedback?: string;
    pathologistFinding?: string;
    labReportVerified?: boolean;
    labReportVerifiedReason?: string;
    labReportVerifiedObservation?: string;
    labReportVerifiedObservationDetails?: string;
    labReportVerifiedFinding?: string;
    pathFraud?: boolean;
    labInHouse?: boolean;
    labName?: string;
    labAddress?: string;
    labState?: string;
    labCity?: string;
    labPin?: string;
    labLicenceNumber?: string;
    labGstNum?: string;
}

interface ChemistDetails {
    chemistName: string;
    chemistAddress: string;
    chemistState: string;
    chemistCity: string;
    chemistLicenceNumber: string;
    chemistGSTNo: string;
    chemistBillVerified?: boolean;
    chemistBillVerifiedObservation?: string;
    chemistBillVerifiedObservationDetails?: string;
    chemistBillVerifiedReason?: string;
    chemistPurchaseCollected?: boolean;
    chemistPurchaseCollectedObservation?: string;
    chemistPurchaseCollectedObservationFinding?: string;
    chemistPurchaseCollectedReason?: string;
    chemistStatementCollect?: boolean;
    chemistStatementCollectReason?: string;
    chemistFraud?: boolean;
}

interface HospitalFormState {
    // Treating Doctor
    reCaseUpdateTreatingDocterDetailsDTO: DoctorRow[];
    treatingDrStatementCollected: boolean | null;
    treatingDrStatementCollectedDiscrepanciesFound: boolean | null;
    treatingDrStatementCollectedDiscrepanciesFinding: string;
    treatingDrStatementCollectedPEDNoted: boolean | null;
    treatingDrStatementCollectedPEDNotedFinding: string;
    treatingDrStatementCollectedReason: string;

    // Referral Doctor
    reCaseUpdateReferralDocterDetailsDTO: DoctorRow[];
    referralDrStatementCollected: boolean | null;
    referralDrStatementCollectedDiscrepanciesFound: boolean | null;
    referralDrStatementCollectedDiscrepanciesFinding: string;
    referralDrStatementCollectedPEDNoted: boolean | null;
    referralDrStatementCollectedPEDNotedFinding: string;
    referralDrStatementCollectedReason: string;

    // Lab & Chemist
    labExist: boolean | null;
    labExistFinding: string;
    chemistExist: boolean | null;
    chemistExistFinding: string;

    // Pathology
    reCaseUpdatePathologyDetailsDTO: PathologyDetail[];
    pathItem: any;

    // Chemist
    reCaseUpdateChemistDetailsDTO: ChemistDetails[];

    // X-ray/Sonography/MRI/CT Scan/Blood Bank/Therapy
    sonographyVisitDone: boolean | null;
    sonographyReportsVerified: boolean | null;
    sonographyFinding: string;
    xrayVisitDone: boolean | null;
    xrayReportsVerified: boolean | null;
    xrayFinding: string;
    mriVisitDone: boolean | null;
    mriReportsVerified: boolean | null;
    mriFinding: string;
    ctScanVisitDone: boolean | null;
    ctScanReportsVerified: boolean | null;
    ctScanFinding: string;
    bloodBankVisitDone: boolean | null;
    bloodBankReportsVerified: boolean | null;
    bloodBankFinding: string;
    therapyVisitDone: boolean | null;
    therapyReportsVerified: boolean | null;
    therapyFinding: string;

    // Hospital Rating
    hospitalFeedback: string;
    hospitalRemark: string;

    // Other Observations
    anyOtherObservationFinding: string;
}

const messages = {
    hospVerifySaved: 'Hospital verification saved successfully',
    hospVerifySubmit: 'Hospital verification submitted successfully',
};

// ==================== MAIN COMPONENT ====================
const HospitalStepTwo: React.FC<HospitalStepTwoProps> = ({
    buttonEnable = true,
    previousData = {},
    onChangeTab
}) => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const acceptAssignId = searchParams.get('acceptAssignId');

    // Menu items
    const menuList: MenuItem[] = [
        { label: 'Treating Doctor Verification', value: 'treatingDoctorVerification' },
        { label: 'Chemist Verification', value: 'chemistVerification' },
        { label: 'Pathologist Verification', value: 'pathologyVerification' },
        {
            label: 'X-Ray/Sonography/MRI/CT Scan/Blood Bank Visit/Physiotherapy Centres Verification',
            value: 'centreVerification',
        },
        { label: 'Hospital Rating', value: 'hospitalRating' },
        { label: 'Any Other Observations/Findings', value: 'otherObservations' },
    ];

    // State
    const [selectedMenu, setSelectedMenu] = useState<MenuItem>(menuList[0]);
    const [tabCheck, setTabCheck] = useState<TabCheck>({
        employeerVisit: false,
        hospitalVisit: false,
        insuredPersonVisit: false,
    });
    const [loading, setLoading] = useState(false);

    // Form State - All data now managed in parent
    const [formState, setFormState] = useState<HospitalFormState>({
        // Treating Doctor
        reCaseUpdateTreatingDocterDetailsDTO: [{}],
        treatingDrStatementCollected: null,
        treatingDrStatementCollectedDiscrepanciesFound: null,
        treatingDrStatementCollectedDiscrepanciesFinding: '',
        treatingDrStatementCollectedPEDNoted: null,
        treatingDrStatementCollectedPEDNotedFinding: '',
        treatingDrStatementCollectedReason: '',

        // Referral Doctor
        reCaseUpdateReferralDocterDetailsDTO: [],
        referralDrStatementCollected: null,
        referralDrStatementCollectedDiscrepanciesFound: null,
        referralDrStatementCollectedDiscrepanciesFinding: '',
        referralDrStatementCollectedPEDNoted: null,
        referralDrStatementCollectedPEDNotedFinding: '',
        referralDrStatementCollectedReason: '',

        // Lab & Chemist
        labExist: null,
        labExistFinding: '',
        chemistExist: null,
        chemistExistFinding: '',

        // Pathology
        reCaseUpdatePathologyDetailsDTO: [],
        pathItem: null,

        // Chemist
        reCaseUpdateChemistDetailsDTO: [],

        // X-ray/Sonography/MRI/CT Scan/Blood Bank/Therapy
        sonographyVisitDone: null,
        sonographyReportsVerified: null,
        sonographyFinding: '',
        xrayVisitDone: null,
        xrayReportsVerified: null,
        xrayFinding: '',
        mriVisitDone: null,
        mriReportsVerified: null,
        mriFinding: '',
        ctScanVisitDone: null,
        ctScanReportsVerified: null,
        ctScanFinding: '',
        bloodBankVisitDone: null,
        bloodBankReportsVerified: null,
        bloodBankFinding: '',
        therapyVisitDone: null,
        therapyReportsVerified: null,
        therapyFinding: '',

        // Hospital Rating
        hospitalFeedback: '',
        hospitalRemark: '',

        // Other Observations
        anyOtherObservationFinding: '',
    });

    // Load tab details on mount
    useEffect(() => {
        if (investigationId) {
            const cleanId = investigationId.split(' ')[0];
            ReimService.getTabDetails(cleanId, 'caseUpdate').then((data) => {
                if (data.statusCode === 0) {
                    setTabCheck(data.payload);
                }
            });
        }
    }, [investigationId]);

    // Populate form state from previousData
    useEffect(() => {
        console.log("previousData", previousData)
        if (previousData && Object.keys(previousData).length > 0) {
            setFormState(prevState => ({
                ...prevState,
                // Treating Doctor
                reCaseUpdateTreatingDocterDetailsDTO: previousData.reCaseUpdateTreatingDocterDetailsDTO || [{}],
                treatingDrStatementCollected: previousData.treatingDrStatementCollected ?? null,
                treatingDrStatementCollectedDiscrepanciesFound: previousData.treatingDrStatementCollectedDiscrepanciesFound ?? null,
                treatingDrStatementCollectedDiscrepanciesFinding: previousData.treatingDrStatementCollectedDiscrepanciesFinding || '',
                treatingDrStatementCollectedPEDNoted: previousData.treatingDrStatementCollectedPEDNoted ?? null,
                treatingDrStatementCollectedPEDNotedFinding: previousData.treatingDrStatementCollectedPEDNotedFinding || '',
                treatingDrStatementCollectedReason: previousData.treatingDrStatementCollectedReason || '',

                // Referral Doctor
                reCaseUpdateReferralDocterDetailsDTO: previousData.reCaseUpdateReferralDocterDetailsDTO || [],
                referralDrStatementCollected: previousData.referralDrStatementCollected ?? null,
                referralDrStatementCollectedDiscrepanciesFound: previousData.referralDrStatementCollectedDiscrepanciesFound ?? null,
                referralDrStatementCollectedDiscrepanciesFinding: previousData.referralDrStatementCollectedDiscrepanciesFinding || '',
                referralDrStatementCollectedPEDNoted: previousData.referralDrStatementCollectedPEDNoted ?? null,
                referralDrStatementCollectedPEDNotedFinding: previousData.referralDrStatementCollectedPEDNotedFinding || '',
                referralDrStatementCollectedReason: previousData.referralDrStatementCollectedReason || '',

                // Lab & Chemist
                labExist: previousData.labExist ?? null,
                labExistFinding: previousData.labExistFinding || '',
                chemistExist: previousData.chemistExist ?? null,
                chemistExistFinding: previousData.chemistExistFinding || '',

                // Pathology
                reCaseUpdatePathologyDetailsDTO: previousData.reCaseUpdatePathologyDetailsDTO || [],
                pathItem: previousData.pathItem || null,

                // Chemist
                reCaseUpdateChemistDetailsDTO: previousData.reCaseUpdateChemistDetailsDTO || [],

                // X-ray/Sonography/MRI/CT Scan/Blood Bank/Therapy
                sonographyVisitDone: previousData.sonographyVisitDone ?? null,
                sonographyReportsVerified: previousData.sonographyReportsVerified ?? null,
                sonographyFinding: previousData.sonographyFinding || '',
                xrayVisitDone: previousData.xrayVisitDone ?? null,
                xrayReportsVerified: previousData.xrayReportsVerified ?? null,
                xrayFinding: previousData.xrayFinding || '',
                mriVisitDone: previousData.mriVisitDone ?? null,
                mriReportsVerified: previousData.mriReportsVerified ?? null,
                mriFinding: previousData.mriFinding || '',
                ctScanVisitDone: previousData.ctScanVisitDone ?? null,
                ctScanReportsVerified: previousData.ctScanReportsVerified ?? null,
                ctScanFinding: previousData.ctScanFinding || '',
                bloodBankVisitDone: previousData.bloodBankVisitDone ?? null,
                bloodBankReportsVerified: previousData.bloodBankReportsVerified ?? null,
                bloodBankFinding: previousData.bloodBankFinding || '',
                therapyVisitDone: previousData.therapyVisitDone ?? null,
                therapyReportsVerified: previousData.therapyReportsVerified ?? null,
                therapyFinding: previousData.therapyFinding || '',

                // Hospital Rating
                hospitalFeedback: previousData.hospitalFeedback || '',
                hospitalRemark: previousData.hospitalRemark || '',

                // Other Observations
                anyOtherObservationFinding: previousData.anyOtherObservationFinding || '',
            }));
        }
    }, [previousData]);

    // Update form state - generic handler
    const updateFormState = (field: keyof any, value: any) => {
        setFormState(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    // Build step two payload from state
    const buildStepTwoPayload = (btnAction: string) => {
        const payload: any = {
            reCaseUpdateTreatingDocterDetailsDTO: formState.reCaseUpdateTreatingDocterDetailsDTO,
            reCaseUpdateReferralDocterDetailsDTO: formState.reCaseUpdateReferralDocterDetailsDTO,
            labExist: formState.labExist,
            chemistExist: formState.chemistExist,
            activeReCaseID: localStorage.getItem('activeReCaseID'),
            acceptAssignId: acceptAssignId,
            sonographyVisitDone: formState.sonographyVisitDone,
            sonographyReportsVerified: formState.sonographyReportsVerified,
            sonographyFinding: formState.sonographyFinding,
            pathItem: formState.pathItem,
            xrayVisitDone: formState.xrayVisitDone,
            xrayReportsVerified: formState.xrayReportsVerified,
            xrayFinding: formState.xrayFinding,
            mriVisitDone: formState.mriVisitDone,
            mriReportsVerified: formState.mriReportsVerified,
            mriFinding: formState.mriFinding,
            ctScanVisitDone: formState.ctScanVisitDone,
            ctScanReportsVerified: formState.ctScanReportsVerified,
            ctScanFinding: formState.ctScanFinding,
            bloodBankVisitDone: formState.bloodBankVisitDone,
            bloodBankReportsVerified: formState.bloodBankReportsVerified,
            bloodBankFinding: formState.bloodBankFinding,
            therapyVisitDone: formState.therapyVisitDone,
            therapyReportsVerified: formState.therapyReportsVerified,
            therapyFinding: formState.therapyFinding,
            hospitalFeedback: formState.hospitalFeedback,
            hospitalRemark: formState.hospitalRemark,
            anyOtherObservationFinding: formState.anyOtherObservationFinding,
            btnAction: btnAction,
        };

        // Conditional fields based on lab and chemist existence
        if (formState.labExist === false) {
            payload.labExistFinding = formState.labExistFinding;
        }
        if (formState.chemistExist === false) {
            payload.chemistExistFinding = formState.chemistExistFinding;
        }
        if (formState.labExist === true) {
            payload.reCaseUpdatePathologyDetailsDTO = formState.reCaseUpdatePathologyDetailsDTO;
        }
        if (formState.chemistExist === true) {
            payload.reCaseUpdateChemistDetailsDTO = formState.reCaseUpdateChemistDetailsDTO;
        }

        // Treating doctor statement collected
        payload.treatingDrStatementCollected = formState.treatingDrStatementCollected;

        if (formState.treatingDrStatementCollected === true) {
            payload.treatingDrStatementCollectedDiscrepanciesFound = formState.treatingDrStatementCollectedDiscrepanciesFound;
            payload.treatingDrStatementCollectedPEDNoted = formState.treatingDrStatementCollectedPEDNoted;
            payload.treatingDrStatementCollectedDiscrepanciesFinding = formState.treatingDrStatementCollectedDiscrepanciesFinding;
            payload.treatingDrStatementCollectedPEDNotedFinding = formState.treatingDrStatementCollectedPEDNotedFinding;
        }
        if (formState.treatingDrStatementCollected === false) {
            payload.treatingDrStatementCollectedReason = formState.treatingDrStatementCollectedReason;
        }

        // Referral doctor statement collected
        payload.referralDrStatementCollected = formState.referralDrStatementCollected;

        if (formState.referralDrStatementCollected === true) {
            payload.referralDrStatementCollectedDiscrepanciesFound = formState.referralDrStatementCollectedDiscrepanciesFound;
            payload.referralDrStatementCollectedPEDNoted = formState.referralDrStatementCollectedPEDNoted;
            payload.referralDrStatementCollectedDiscrepanciesFinding = formState.referralDrStatementCollectedDiscrepanciesFinding;
            payload.referralDrStatementCollectedPEDNotedFinding = formState.referralDrStatementCollectedPEDNotedFinding;
        }
        if (formState.referralDrStatementCollected === false) {
            payload.referralDrStatementCollectedReason = formState.referralDrStatementCollectedReason;
        }

        return payload;
    };

    // Save handler
    const saveStepTwo = async () => {
        setLoading(true);
        const cleanId = investigationId?.split(' ')[0] || '';
        const payload = buildStepTwoPayload('saveasdraft');
        console.log("Save Payload:", payload);

        try {
            const data: any = await reimcaseUpdateService.addHospitalVerifyTwo(payload, cleanId);
            if (data.statusCode === 0) {
                notificationService.showAlertSuccess(messages.hospVerifySaved);
                onChangeTab(true);
            } else {
                notificationService.showAlertError(data.message);
            }
        } catch (error) {
            notificationService.showAlertError('Error saving hospital verification');
        } finally {
            setLoading(false);
        }
    };

    // Submit handler
    const submitStepTwo = async () => {
        setLoading(true);
        const cleanId = investigationId?.split(' ')[0] || '';
        const payload = buildStepTwoPayload('submittoqc');

        try {
            const data: any = await reimcaseUpdateService.addHospitalVerifyTwo(payload, cleanId);
            if (data.statusCode === 0) {
                notificationService.showAlertSuccess(messages.hospVerifySubmit);
                onChangeTab(true);
                // navigate('/admin/dashboard');
            } else {
                notificationService.showAlertError(data.message);
            }
        } catch (error) {
            notificationService.showAlertError('Error submitting hospital verification');
        } finally {
            setLoading(false);
        }
    };

    // Render selected menu content
    const renderContent = () => {
        switch (selectedMenu.value) {
            case 'treatingDoctorVerification':
                return (
                    <TreatingDoctorDetails
                        buttonEnable={buttonEnable}
                        formState={formState}
                        updateFormState={updateFormState}
                        title="Treating Doctor Details"
                    />
                );
            case 'chemistVerification':
                return (
                    <ChemistDetailsComponent
                        buttonEnable={buttonEnable}
                        formState={formState}
                        updateFormState={updateFormState}
                    />
                );
            case 'pathologyVerification':
                return (
                    <PathologyDetails
                        buttonEnable={buttonEnable}
                        formState={formState}
                        updateFormState={updateFormState}
                    />
                );
            case 'centreVerification':
                return (
                    <XrayDetails
                        isFormEditable={buttonEnable}
                        formState={formState}
                        updateFormState={updateFormState}
                    />
                );
            case 'hospitalRating':
                return (
                    <HospitalDetails
                        isFormEditable={buttonEnable}
                        formState={formState}
                        updateFormState={updateFormState}
                    />
                );
            case 'otherObservations':
                return (
                    <HospitalOtherObservation
                        isFormEditable={buttonEnable}
                        formState={formState}
                        updateFormState={updateFormState}
                    />
                );
            default:
                return null;
        }
    };

    console.log('Form State:', formState);

    return (
        <Box>
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        {/* Left Menu */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <List
                                sx={{
                                    p: 0,
                                    '& .MuiListItem-root': {
                                        backgroundColor: '#eee',
                                        color: 'black',
                                        cursor: 'pointer',
                                        mb: 0.5,
                                        borderRadius: 1,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            backgroundColor: '#ccc',
                                        },
                                        '&.active': {
                                            backgroundColor: '#6770d2',
                                            color: 'white !important',
                                        },
                                    },
                                }}
                            >
                                {menuList.map((menu) => (
                                    <ListItem
                                        key={menu.value}
                                        onClick={() => setSelectedMenu(menu)}
                                        className={selectedMenu.value === menu.value ? 'active' : ''}
                                        sx={{ color: "#fff", wordBreak: "break-word" }}
                                    >
                                        <ListItemText
                                            primary={menu.label}
                                            primaryTypographyProps={{
                                                fontSize: '0.9rem',
                                                fontWeight: selectedMenu.value === menu.value ? 600 : 400,
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>

                        {/* Right Content */}
                        <Grid size={{ xs: 12, md: 9 }}>
                            <Box>{renderContent()}</Box>
                        </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    {buttonEnable && (
                        <Box sx={{ mt: 4, textAlign: 'right' }}>
                            {/* Case 1: Only hospital visit, no employer and insured */}
                            {!tabCheck.employeerVisit &&
                                tabCheck.hospitalVisit &&
                                !tabCheck.insuredPersonVisit && (
                                    <>
                                        <Button
                                            variant="contained"
                                            onClick={saveStepTwo}
                                            disabled={loading}
                                            sx={{ mr: 2 }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={submitStepTwo}
                                            disabled={loading}
                                            sx={{
                                                background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5568D3 0%, #63408B 100%)',
                                                },
                                            }}
                                        >
                                            Submit to QC
                                        </Button>
                                    </>
                                )}

                            {/* Case 2: Hospital visit with insured, no employer */}
                            {!tabCheck.employeerVisit && tabCheck.hospitalVisit && tabCheck.insuredPersonVisit && (
                                <Button variant="contained" onClick={saveStepTwo} disabled={loading}>
                                    Save
                                </Button>
                            )}

                            {/* Case 3: Employer and hospital visit, no insured */}
                            {tabCheck.employeerVisit && tabCheck.hospitalVisit && !tabCheck.insuredPersonVisit && (
                                <Button variant="contained" onClick={saveStepTwo} disabled={loading}>
                                    Save
                                </Button>
                            )}

                            {/* Case 4: All three visits */}
                            {tabCheck.employeerVisit && tabCheck.hospitalVisit && tabCheck.insuredPersonVisit && (
                                <Button variant="contained" onClick={saveStepTwo} disabled={loading}>
                                    Save
                                </Button>
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default HospitalStepTwo;