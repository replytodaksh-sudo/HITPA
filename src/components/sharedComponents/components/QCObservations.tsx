// QCObservations.tsx - Part 1: Main Component Structure & Basic QC Observations
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    FormControl,
    FormLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Paper,
    Typography,
    Checkbox,
    FormGroup,
    FormControlLabel,
    ListItemText,
    Chip,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from '@mui/material';
import QCUpdateService from '../../../services/qcupdate.service';
import alertService from '../../../services/alertService';
import DocumentsService from '../../../services/document.service';
import { apiUrls } from '../../../constants/apiConstants';
import CloseIcon from '@mui/icons-material/Close';
import AcceptAgencies from './acceptAgency';

interface FinalDecisionSectionsProps {
    finalDecision: string;
    payableRemarks: string;
    setPayableRemarks: (value: string) => void;
    lowMiniRemarks: string;
    setLowMiniRemarks: (value: string) => void;
    queryRemark: string;
    setQueryRemark: (value: string) => void;
    queryTxt: string;
    setQueryTxt: (value: string) => void;
    repadiateRemarks: string;
    setRepadiateRemarks: (value: string) => void;
    suspectedCaseFindings: string;
    setSuspectedCaseFindings: (value: string) => void;
    groundOfRejection: string[];
    setGroundOfRejection: (value: string[]) => void;
    isDisabled: boolean;
}



// Import child components (will create these next)
// import GroundRejectionSelector from './GroundRejectionSelector';
// import DocumentUploadSection from './DocumentUploadSection';
// import QuestionBankManager from './QuestionBankManager';
// import AgencyAssignmentSection from './AgencyAssignmentSection';
// import RecommendationsSection from './RecommendationsSection';

/**
 * Interfaces
 */
interface QCObservationsProps {
    previewValues?: any;
    buttonEnable?: boolean;
    onChangeTab?: (value: boolean) => void;
    claimSubmitted?: boolean;
}

interface QCObservation {
    qcObservations: string;
    qcUpdateID: string;
    finalDecision: string;
    queriesRemarks: string;
    queriesQuery: string;
    queryWithRegionalQC: string;
    repudiateFraudulentRemarks: string;
    repudiateFraudulent: string;
    suspectedCaseFindings: string;
    lossMinimizationRemarks: string;
    assignedToUser: string;
    agencyCodes?: string[];
    questionCodes: string[];
    payableRemarks: string;
    acceptInstruction: any;
    prevInvestigatorReport: string;
    groundRejectionQCDTO?: any;
    groundRejectionFraudulentQCDTO?: any;
    groundRejectionMisrepresentQCDTO?: any;
    groundRejectionExclusionQCDTO?: any;
    claimType: string;
    policyCancellation?: boolean;
    hospitalBlacklisted?: boolean;
    hospitalDepanelled?: boolean;
    hospitalCautionTagged?: boolean;
    insuredBlacklisted?: boolean;
    insuredCautionTagged?: boolean;
    policyFraud?: boolean;
    pathologistFraud?: boolean;
    chemistFraud?: boolean;
    pathologyLabFraud?: boolean;
    corporateTaggedFraud?: boolean;
    legalActionInitiated?: boolean;
    treatingDoctorFraud?: boolean;
}

/**
 * Main QCObservations Component
 */
const QCObservations: React.FC<QCObservationsProps> = ({
    previewValues: propPreviewValues,
    buttonEnable = true,
    onChangeTab,
    claimSubmitted
}) => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Basic State
    const [investigationId, setInvestigationId] = useState('');
    const [roleName, setRoleName] = useState('');
    const [claimType, setClaimType] = useState('');
    const [editAble, setEditAble] = useState<string | null>(null);
    const [previewValues, setPreviewValues] = useState<any>(propPreviewValues || null);
    const [redirectTo, setRedirectTo] = useState('');

    // QC Observations State
    const [qcObservations, setQcObservations] = useState('');
    const [qcObservationOptions, setQcObservationOptions] = useState<any[]>([]);
    const [finalDecision, setFinalDecision] = useState('');
    const [queryRM, setQueryRM] = useState('');
    const [queryCM, setQueryCM] = useState('');
    const [centralQuery, setCentralQuery] = useState('');
    const [payableRemarks, setPayableRemarks] = useState('');
    const [lowMiniRemarks, setLowMiniRemarks] = useState('');
    const [queryRemark, setQueryRemark] = useState('');
    const [queryTxt, setQueryTxt] = useState('');
    const [repadiateRemarks, setRepadiateRemarks] = useState('');
    const [suspectedCaseFindings, setSuspectedCaseFindings] = useState('');

    // Recommendation State
    const [recommendations, setRecommendations] = useState({
        policyCancellation: '',
        hospitalBlacklisted: '',
        hospitalDepanelled: '',
        hospitalCautionTagged: '',
        insuredBlacklisted: '',
        insuredCautionTagged: '',
        policyFraud: '',
        treatingDoctorFraud: '',
        pathologistFraud: '',
        chemistFraud: '',
        pathologyLabFraud: '',
        corporateTaggedFraud: '',
        legalActionInitiated: '',
    });

    // Document & Question State
    const [documentsCodes, setDocumentsCodes] = useState<string[]>([]);
    const [selectedForInsuredQues, setSelectedForInsuredQues] = useState<string[]>([]);
    const [selectedTreatingDctrQues, setSelectedTreatingDctrQues] = useState<string[]>([]);
    const [customForInsuredQuestions, setCustomForInsuredQuestions] = useState<string[]>([]);
    const [customForTreatingDoctorQuestions, setCustomForTreatingDoctorQuestions] = useState<string[]>([]);

    // Agency/Assignment State
    const [agencyCode, setAgencyCode] = useState();
    const [acceptInstruction, setAcceptInstruction] = useState('');
    const [prevInvestigatorReport, setPrevInvestigatorReport] = useState('no');


    // QCObservations - Part 3: Ground Rejection Selection Logic
    // Add this section to your main component

    // ============================================
    // PART 3: GROUND REJECTION STATE & FETCHING
    // ============================================

    const [groundOfRejection, setGroundOfRejection] = useState<string[]>([]); // ✅ Should be array
    const [groundOfRejectionFraud, setGroundOfRejectionFraud] = useState<string[]>([]);
    const [groundOfRejectionExclusion, setGroundOfRejectionExclusion] = useState<string[]>([]); // ✅ Add this
    const [groundOfRejectionExclusion1, setGroundOfRejectionExclusion1] = useState<string[]>([]); // ✅ Add this
    const [groundOfRejectionMisrepresentation, setGroundOfRejectionMisrepresentation] = useState<string[]>([]);
    const [groundOfRejectionMisrepresentation1, setGroundOfRejectionMisrepresentation1] = useState<string[]>([]);

    // Add these states to your main component (after existing states)
    const [groundOfRegection, setGroundOfRegection] = useState<any[]>([]);
    const [groundOfRegectionFraud, setGroundOfRegectionFraud] = useState<any[]>([]);
    const [documentTitle, setDocumentTitle] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [investigationDocsView, setInvestigationDocsView] = useState<any[]>([]);
    const [documentArray, setDocumentArray] = useState<any[]>([]);
    const [documentNames, setDocumentNames] = useState<string[]>([]);

    // Add these useEffect hooks
    useEffect(() => {
        if (investigationId && roleName) {
            fetchInvestigationDocs();
        }
    }, [investigationId, roleName]);

    // Add these useEffect hooks to fetch ground details
    useEffect(() => {
        const fetchGroundDetails = async () => {
            try {
                const response = await QCUpdateService.getGroundDetails();
                if (response.statusCode === 0) {
                    setGroundOfRegection(response.payload);
                }
            } catch (error) {
                console.error('Error fetching ground details:', error);
            }
        };

        const fetchGroundFraudDetails = async () => {
            try {
                const response = await QCUpdateService.getGroundFraudDetails();
                if (response.statusCode === 0) {
                    setGroundOfRegectionFraud(response.payload);
                }
            } catch (error) {
                console.error('Error fetching fraud details:', error);
            }
        };

        const fetchGroundExclusionDetails = async () => {
            try {
                const response = await QCUpdateService.getGroundExclusionDetails();
                if (response.statusCode === 0) {
                    setGroundOfRejectionExclusion1(response.payload);
                }
            } catch (error) {
                console.error('Error fetching exclusion details:', error);
            }
        };

        const fetchGroundMisrepresentationDetails = async () => {
            try {
                const response = await QCUpdateService.getMisrepresentationFraudDetails();
                if (response.statusCode === 0) {
                    setGroundOfRejectionMisrepresentation1(response.payload);
                }
            } catch (error) {
                console.error('Error fetching misrepresentation details:', error);
            }
        };

        fetchGroundDetails();
        fetchGroundFraudDetails();
        fetchGroundExclusionDetails();
        fetchGroundMisrepresentationDetails();
    }, []);

    // Helper functions for checkboxes
    const isGroundRejectionFraudChecked = (rejection: any) => {
        return groundOfRejectionFraud.indexOf(rejection.groundRejectionFraudulentCode) > -1;
    };

    const isGroundRejectionExclusionChecked = (rejection: any) => {
        return groundOfRejectionExclusion.indexOf(rejection.groundRejectionExclusionCode) > -1;
    };

    const isGroundRejectionMisrepreChecked = (rejection: any) => {
        return groundOfRejectionMisrepresentation.indexOf(rejection.groundRejectionMisrepresentCode) > -1;
    };

    // Handler functions
    const handleGroundRejectionFraudChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const value = event.target.value;
        console.log("value", value, event.target.checked, groundOfRejectionFraud, groundOfRegectionFraud)
        if (event.target.checked) {
            setGroundOfRejectionFraud([...groundOfRejectionFraud, value]);
        } else {
            setGroundOfRejectionFraud(groundOfRejectionFraud.filter(item => item !== value));
        }
    };

    const handleGroundRejectionExclusionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        console.log("value", value, event.target.checked, groundOfRejectionExclusion, groundOfRejectionExclusion)

        if (event.target.checked) {
            setGroundOfRejectionExclusion([...groundOfRejectionExclusion, value]);
        } else {
            setGroundOfRejectionExclusion(groundOfRejectionExclusion.filter(item => item !== value));
        }
    };

    const handleGroundRejectionMisrepresentationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        console.log("value", value, event.target.checked, groundOfRejectionMisrepresentation)
        if (event.target.checked) {
            setGroundOfRejectionMisrepresentation
            setGroundOfRejectionMisrepresentation([...groundOfRejectionMisrepresentation, value]);
        } else {
            setGroundOfRejectionMisrepresentation(groundOfRejectionMisrepresentation.filter(item => item !== value));
        }
    };

    // Final Decision Options
    const finalDecisionOptions = [
        { label: 'Select', value: '' },
        { label: 'Payable', value: 'Payable' },
        { label: 'Repudiate', value: 'Repudiate' },
        { label: 'Loss Minimization', value: 'Loss Minimization' },
        { label: 'Queries to be raised', value: 'Queries to be raised' },
    ];

    /**
     * Initialize component
     */
    useEffect(() => {
        const role = sessionStorage.getItem('roleName') || '';
        const editable = sessionStorage.getItem('qcNonEdit');
        const type = searchParams.get('claimsType') || '';
        const redirect = searchParams.get('redirectTo') || '';

        setRoleName(role);
        setEditAble(editable === 'undefined' ? null : editable);
        setClaimType(type);
        setRedirectTo(redirect);

        if (paramInvestigationId) {
            const cleanId = paramInvestigationId.split(' ')[0];
            setInvestigationId(cleanId);
        }
    }, [paramInvestigationId, searchParams]);

    /**
     * Populate QC Observations dropdown options based on role and investigation type
     */
    useEffect(() => {
        if (!roleName) return;

        if (roleName === 'Central Manager') {
            setQcObservationOptions([
                { label: 'Select', value: '' },
                { label: 'Accept Report', value: 'Accept Report' },
                { label: 'Raise query to Regional QC manager', value: 'Raise query to Regional QC manager' },
            ]);
        } else if (roleName === 'Regional Manager') {
            if (previewValues?.investigationType === 'Full case allocation' || claimType === 'cashless') {
                setQcObservationOptions([
                    { label: 'Select', value: '' },
                    { label: 'Accept Report', value: 'Accept Report' },
                    { label: 'Rework', value: 'Rework' },
                    // { label: 'Reassign', value: 'Reassign' },
                    { label: 'Response to Central QC Query', value: 'Response to Central QC Query' },
                ]);
            } else if (
                previewValues?.investigationType === 'Split case allocation' ||
                previewValues?.investigationType === 'Part verification'
            ) {
                setQcObservationOptions([
                    { label: 'Select', value: '' },
                    { label: 'Accept Report', value: 'Accept Report' },
                    // { label: 'Reassign', value: 'Reassign' },
                    { label: 'Response to Central QC Query', value: 'Response to Central QC Query' },
                ]);
            } else {
                // Default for cashless
                setQcObservationOptions([
                    { label: 'Select', value: '' },
                    { label: 'Accept Report', value: 'Accept Report' },
                    { label: 'Rework', value: 'Rework' },
                    // { label: 'Reassign', value: 'Reassign' },
                    { label: 'Response to Central QC Query', value: 'Response to Central QC Query' },
                ]);
            }
        }
    }, [roleName, previewValues, claimType]);

    /**
     * Populate form fields from preview values
     */
    useEffect(() => {
        console.log('Prop Preview Values:', propPreviewValues);
        if (!propPreviewValues) return;

        setPreviewValues(propPreviewValues);
        setQcObservations(propPreviewValues.qcObservations || '');
        setQueryRM(propPreviewValues.queryWithRegionalQC || '');
        setQueryCM(propPreviewValues.queriesQuery || '');
        setFinalDecision(propPreviewValues.finalDecision || '');
        setPayableRemarks(propPreviewValues.queriesRemarks || '');
        setQueryRemark(propPreviewValues.queryRemarks || '');
        setQueryTxt(propPreviewValues.queryTxt || '');
        setRepadiateRemarks(propPreviewValues.repudiateFraudulentRemarks || '');
        setSuspectedCaseFindings(propPreviewValues.suspectedCaseFindings || '');
        setLowMiniRemarks(propPreviewValues.lossMinimizationRemarks || '');

        // Populate ground rejections
        if (propPreviewValues.groundRejectionQCDTO?.groundRejectionQCViewDTOs) {
            const codes = propPreviewValues.groundRejectionQCDTO.groundRejectionQCViewDTOs.map(
                (o: any) => o.groundRejectionCode
            );
            setGroundOfRejection(codes);
        }

        if (propPreviewValues.groundRejectionFraudulentQCDTO?.groundRejectionFraudulentQCViewDTOs) {
            const codes = propPreviewValues.groundRejectionFraudulentQCDTO.groundRejectionFraudulentQCViewDTOs.map(
                (o: any) => o.groundRejectionFraudulentCode
            );
            setGroundOfRejectionFraud(codes);
        }

        if (propPreviewValues.groundRejectionExclusionQCDTO?.groundRejectionExclusionDTO) {
            const codes = propPreviewValues.groundRejectionExclusionQCDTO.groundRejectionExclusionDTO.map(
                (o: any) => o.groundRejectionExclusionCode
            );
            setGroundOfRejectionExclusion(codes);
        }

        if (propPreviewValues.groundRejectionMisrepresentQCDTO?.groundRejectionMisrepresentationDTO) {
            const codes = propPreviewValues.groundRejectionMisrepresentQCDTO.groundRejectionMisrepresentationDTO.map(
                (o: any) => o.groundRejectionMisrepresentCode
            );
            setGroundOfRejectionMisrepresentation(codes);
        }

        // Populate recommendations
        console.log('Prop Preview Values:', propPreviewValues.policyCancellation);
        // setRecommendations({
        //     policyCancellation: propPreviewValues.policyCancellation === null
        //         ? ''
        //         : String(Boolean(propPreviewValues.policyCancellation)),
        //     hospitalBlacklisted: propPreviewValues.hospitalBlacklisted === null ? '' : String(Boolean(propPreviewValues.hospitalBlacklisted) ? 'true' : 'false'),
        //     hospitalDepanelled: propPreviewValues.hospitalDepanelled ? 'true' : 'false',
        //     hospitalCautionTagged: propPreviewValues.hospitalCautionTagged ? 'true' : 'false',
        //     insuredBlacklisted: propPreviewValues.insuredBlacklisted ? 'true' : 'false',
        //     insuredCautionTagged: propPreviewValues.insuredCautionTagged ? 'true' : 'false',
        //     policyFraud: propPreviewValues.policyFraud ? 'true' : 'false',
        //     treatingDoctorFraud: propPreviewValues.treatingDoctorFraud ? 'true' : 'false',
        //     pathologistFraud: propPreviewValues.pathologistFraud ? 'true' : 'false',
        //     chemistFraud: propPreviewValues.chemistFraud ? 'true' : 'false',
        //     pathologyLabFraud: propPreviewValues.pathologyLabFraud ? 'true' : 'false',
        //     corporateTaggedFraud: propPreviewValues.corporateTaggedFraud ? 'true' : 'false',
        //     legalActionInitiated: propPreviewValues.legalActionInitiated ? 'true' : 'false',
        // });
        setRecommendations({
            policyCancellation:
                propPreviewValues.policyCancellation === null
                    ? ''
                    : String(Boolean(propPreviewValues.policyCancellation)),

            hospitalBlacklisted:
                propPreviewValues.hospitalBlacklisted === null
                    ? ''
                    : String(Boolean(propPreviewValues.hospitalBlacklisted)),

            hospitalDepanelled:
                propPreviewValues.hospitalDepanelled === null
                    ? ''
                    : String(Boolean(propPreviewValues.hospitalDepanelled)),

            hospitalCautionTagged:
                propPreviewValues.hospitalCautionTagged === null
                    ? ''
                    : String(Boolean(propPreviewValues.hospitalCautionTagged)),

            insuredBlacklisted:
                propPreviewValues.insuredBlacklisted === null
                    ? ''
                    : String(Boolean(propPreviewValues.insuredBlacklisted)),

            insuredCautionTagged:
                propPreviewValues.insuredCautionTagged === null
                    ? ''
                    : String(Boolean(propPreviewValues.insuredCautionTagged)),

            policyFraud:
                propPreviewValues.policyFraud === null
                    ? ''
                    : String(Boolean(propPreviewValues.policyFraud)),

            treatingDoctorFraud:
                propPreviewValues.treatingDoctorFraud === null
                    ? ''
                    : String(Boolean(propPreviewValues.treatingDoctorFraud)),

            pathologistFraud:
                propPreviewValues.pathologistFraud === null
                    ? ''
                    : String(Boolean(propPreviewValues.pathologistFraud)),

            chemistFraud:
                propPreviewValues.chemistFraud === null
                    ? ''
                    : String(Boolean(propPreviewValues.chemistFraud)),

            pathologyLabFraud:
                propPreviewValues.pathologyLabFraud === null
                    ? ''
                    : String(Boolean(propPreviewValues.pathologyLabFraud)),

            corporateTaggedFraud:
                propPreviewValues.corporateTaggedFraud === null
                    ? ''
                    : String(Boolean(propPreviewValues.corporateTaggedFraud)),

            legalActionInitiated:
                propPreviewValues.legalActionInitiated === null
                    ? ''
                    : String(Boolean(propPreviewValues.legalActionInitiated)),
        });

    }, [propPreviewValues]);

    /**
     * Fetch central query data
     */
    useEffect(() => {
        if (!investigationId || !roleName) return;

        const fetchCentralQuery = async () => {
            try {
                let tabName = '';
                if (roleName === 'Regional Manager') {
                    tabName = 'regionalQC';
                } else if (roleName === 'Central QC') {
                    tabName = 'centralQC';
                }

                const response = await QCUpdateService.qcUpdatePreview(investigationId, tabName);
                if (response.statusCode === 0) {
                    setCentralQuery(response.payload.queryWithRegionalQC || '');
                }
            } catch (error) {
                console.error('Error fetching central query:', error);
            }
        };

        fetchCentralQuery();
    }, [investigationId, roleName]);

    /**
     * Handle QC Observations submission
     */
    /**
 * FIXED: QC Observations Submit Handler
 * This shows the corrected payload structure for the backend
 */

    // ============================================
    // CORRECTED SUBMIT HANDLER
    // ============================================

    // const handleSubmit = async () => {
    //     try {
    //         // Build QC observation object with CORRECT structure
    //         const qcOb: QCObservation = {
    //             qcObservations,
    //             qcUpdateID: localStorage.getItem('qcUpdateID') || '',
    //             finalDecision: finalDecision || '',
    //             queriesRemarks: '',
    //             queriesQuery: '',
    //             repudiateFraudulent: "",
    //             queryWithRegionalQC: '',
    //             repudiateFraudulentRemarks: '',
    //             suspectedCaseFindings: '',
    //             lossMinimizationRemarks: '',
    //             assignedToUser: '',
    //             agencyCodes: agencyCode ? [agencyCode] : [], // FIX: Ensure it's always an array
    //             questionCodes: [
    //                 ...selectedForInsuredQues,
    //                 ...selectedTreatingDctrQues,
    //                 ...customForInsuredQuestions,
    //                 ...customForTreatingDoctorQuestions,
    //             ],
    //             payableRemarks,
    //             acceptInstruction,
    //             prevInvestigatorReport,
    //             claimType,
    //         };

    //         // ============================================
    //         // PART 1: Handle Different QC Observation Types
    //         // ============================================

    //         if (qcObservations === 'Accept Report') {
    //             qcOb.finalDecision = finalDecision;

    //             if (finalDecision === 'Payable') {
    //                 qcOb.queriesRemarks = payableRemarks;
    //             } else if (finalDecision === 'Repudiate') {
    //                 qcOb.repudiateFraudulentRemarks = repadiateRemarks;


    //                 console.log('groundOfRejection', groundOfRejection);
    //                 console.log('groundOfRejectionFraud', groundOfRejectionFraud);
    //                 console.log('groundOfRejectionExclusion', groundOfRejectionExclusion);
    //                 console.log('groundOfRejectionMisrepresentation', groundOfRejectionMisrepresentation);


    //                 // FIX: Send ground rejections in correct structure
    //                 if (groundOfRejection) {
    //                     qcOb.groundRejectionQCDTO = {
    //                         groundRejectionCode: groundOfRejection,
    //                     };
    //                 }

    //                 // FIX: Send fraud rejections in correct structure
    //                 if (Array.isArray(groundOfRejectionFraud) && groundOfRejectionFraud.length > 0) {
    //                     qcOb.groundRejectionFraudulentQCDTO = {
    //                         groundRejectionFraudulentCode: [...groundOfRejectionFraud]
    //                         // groundRejectionFraudulentQCViewDTOs: groundOfRejectionFraud && groundOfRejectionFraud.map((code) => ({
    //                         //     groundRejectionFraudulentCode: code,
    //                         // })),
    //                     };
    //                 } else {
    //                     qcOb.groundRejectionFraudulentQCDTO = {
    //                         groundRejectionFraudulentCode: []
    //                     }
    //                 }
    //                 // FIX: Send exclusion rejections in correct structure
    //                 if (Array.isArray(groundOfRejectionExclusion) && groundOfRejectionExclusion.length > 0) {
    //                     qcOb.groundRejectionExclusionQCDTO = {
    //                         groundRejectionExclusionCode: [...groundOfRejectionExclusion]
    //                         // groundRejectionExclusionDTO: groundOfRejectionExclusion && groundOfRejectionExclusion.map((code) => ({
    //                         //     groundRejectionExclusionCode: code,
    //                         // })),
    //                     };
    //                 } else {
    //                     qcOb.groundRejectionExclusionQCDTO = {
    //                         groundRejectionExclusionCode: []
    //                     }
    //                 }
    //                 // FIX: Send misrepresentation rejections in correct structure
    //                 if (Array.isArray(groundOfRejectionMisrepresentation) && groundOfRejectionMisrepresentation.length > 0) {
    //                     qcOb.groundRejectionMisrepresentQCDTO = {
    //                         groundRejectionMisrepresentCode: [...groundOfRejectionMisrepresentation]
    //                         // groundRejectionMisrepresentationDTO: groundOfRejectionMisrepresentation && groundOfRejectionMisrepresentation.map((code) => ({
    //                         //     groundRejectionMisrepresentCode: code,
    //                         // })),
    //                     };
    //                 } else {
    //                     qcOb.groundRejectionMisrepresentQCDTO = {
    //                         groundRejectionMisrepresentCode: []
    //                     }
    //                 }
    //             } else if (finalDecision === 'Loss Minimization') {
    //                 qcOb.lossMinimizationRemarks = lowMiniRemarks;
    //             } else if (finalDecision === 'Queries to be raised') {
    //                 qcOb.queriesRemarks = queryRemark;
    //                 qcOb.queriesQuery = queryTxt;
    //             }

    //             // ============================================
    //             // PART 2: Add Recommendations (Convert to Boolean)
    //             // ============================================

    //             qcOb.policyCancellation = recommendations.policyCancellation === 'true';
    //             qcOb.hospitalBlacklisted = recommendations.hospitalBlacklisted === 'true';
    //             qcOb.hospitalDepanelled = recommendations.hospitalDepanelled === 'true';
    //             qcOb.hospitalCautionTagged = recommendations.hospitalCautionTagged === 'true';
    //             qcOb.insuredBlacklisted = recommendations.insuredBlacklisted === 'true';
    //             qcOb.insuredCautionTagged = recommendations.insuredCautionTagged === 'true';
    //             qcOb.policyFraud = recommendations.policyFraud === 'true';
    //             qcOb.treatingDoctorFraud = recommendations.treatingDoctorFraud === 'true';
    //             qcOb.pathologistFraud = recommendations.pathologistFraud === 'true';
    //             qcOb.chemistFraud = recommendations.chemistFraud === 'true';
    //             qcOb.pathologyLabFraud = recommendations.pathologyLabFraud === 'true';
    //             qcOb.corporateTaggedFraud = recommendations.corporateTaggedFraud === 'true';
    //             qcOb.legalActionInitiated = recommendations.legalActionInitiated === 'true';
    //         } else if (qcObservations === 'Raise query to Regional QC manager') {
    //             qcOb.queryWithRegionalQC = queryRM;
    //         } else if (qcObservations === 'Response to Central QC Query') {
    //             qcOb.queryWithRegionalQC = centralQuery;
    //             qcOb.queriesQuery = queryCM;
    //         } else if (qcObservations === 'Rework') {
    //             qcOb.queriesRemarks = payableRemarks;
    //         } else if (qcObservations === 'Reassign') {
    //             // For reassign, agencyCode should already be set
    //             // Add any additional remarks if needed
    //             qcOb.queriesRemarks = payableRemarks || '';
    //         }

    //         // ============================================
    //         // PART 3: Log the Payload for Verification
    //         // ============================================

    //         console.log('=== QC OBSERVATIONS PAYLOAD ===');
    //         console.log('=== DOCUMENT CODES ===');
    //         console.log('Document Codes:', documentsCodes);
    //         console.log('============================');

    //         console.log("qwertyuiop", qcOb);
    //         // ============================================
    //         // PART 4: Submit to Backend
    //         // ============================================

    //         const response: any = await QCUpdateService.addQCObservations(
    //             qcOb,
    //             investigationId,
    //             documentsCodes // Pass document codes separately
    //         );

    //         if (response.statusCode === 0) {
    //             alertService.showAlertSuccess('QC Observations submitted successfully');

    //             // Navigate based on observation type
    //             if (
    //                 qcObservations === 'Raise query to Regional QC manager' ||
    //                 qcObservations === 'Response to Central QC Query' ||
    //                 qcObservations === 'Rework' ||
    //                 qcObservations === 'Reassign'
    //             ) {
    //                 if (redirectTo) {
    //                     navigate(redirectTo);
    //                 } else {
    //                     navigate('/admin/dashboard');
    //                 }
    //             } else if (onChangeTab) {
    //                 onChangeTab(true);
    //             }
    //         } else if (response.statusCode === 4004) {
    //             // Partial success
    //             alertService.showAlertSuccess(response.message);
    //         } else {
    //             alertService.showAlertError(response.message || 'Failed to submit QC observations');
    //         }
    //     } catch (error) {
    //         console.error('Error submitting QC observations:', error);

    //         // Log the error payload for debugging
    //         if (error instanceof Error) {
    //             console.error('Error Details:', error.message);
    //         }

    //         alertService.showAlertError('Failed to submit QC observations. Check console for details.');
    //     }
    // };

    // Fixed handleSubmit function based on Angular onqcSubmit2
    // This includes all the validation and logic from the Angular version

    const handleSubmit = async () => {
        try {
            let value = "";

            // ============================================
            // PART 1: Handle Split Case Allocation
            // ============================================
            if (previewValues.investigationType === 'Split case allocation') {
                const allVisitsDone = (
                    previewValues.hospitalVisitStatus === 'Done' &&
                    previewValues.insuredVisitStatus === 'Done' &&
                    previewValues.employerVisitStatus === 'Done'
                );
                const isCentralManager = roleName === 'Central Manager';

                if (allVisitsDone || isCentralManager) {
                    // Proceed with submission for split case
                    await submitQCObservations();
                } else {
                    // Build pending visits message
                    if (
                        previewValues.hospitalVisitStatus === 'Pending' ||
                        previewValues.hospitalVisitStatus === '' ||
                        previewValues.hospitalVisitStatus === null
                    ) {
                        value = value + "Hospital Visit Pending";
                    }
                    if (
                        previewValues.insuredVisitStatus === 'Pending' ||
                        previewValues.insuredVisitStatus === '' ||
                        previewValues.insuredVisitStatus === null
                    ) {
                        value = value + " Insured Visit Pending";
                    }
                    if (
                        previewValues.employerVisitStatus === 'Pending' ||
                        previewValues.employerVisitStatus === '' ||
                        previewValues.employerVisitStatus === null
                    ) {
                        value = value + " Employer Visit Pending";
                    }

                    alertService.showAlertError(value);
                    return;
                }
            } else {
                // ============================================
                // PART 2: Handle Non-Split Case Allocation
                // ============================================
                await submitQCObservations();
            }
        } catch (error) {
            console.error('Error submitting QC observations:', error);
            if (error instanceof Error) {
                console.error('Error Details:', error.message);
            }
            alertService.showAlertError('Failed to submit QC observations. Check console for details.');
        }
    };

    // ============================================
    // Main Submit Function
    // ============================================
    const submitQCObservations = async () => {
        // Build QC observation object
        const qcOb: QCObservation = {
            qcObservations,
            qcUpdateID: localStorage.getItem('qcUpdateID') || '',
            finalDecision: '',
            queriesRemarks: '',
            queriesQuery: '',
            repudiateFraudulent: '',
            queryWithRegionalQC: '-',
            repudiateFraudulentRemarks: '',
            suspectedCaseFindings: '',
            lossMinimizationRemarks: '',
            assignedToUser: '',
            agencyCodes: [],
            questionCodes: [],
            payableRemarks: '',
            acceptInstruction: null,
            prevInvestigatorReport: '',
            claimType: '',
        };

        // ============================================
        // PART 1: Handle Different QC Observation Types
        // ============================================
        if (qcObservations === 'Accept Report') {
            qcOb.finalDecision = finalDecision;

            if (finalDecision === 'Payable') {
                qcOb.queriesRemarks = payableRemarks;
            } else if (finalDecision === 'Repudiate') {
                qcOb.repudiateFraudulentRemarks = repadiateRemarks;
            } else if (finalDecision === 'Suspected Case') {
                qcOb.suspectedCaseFindings = suspectedCaseFindings;
            } else if (finalDecision === 'Loss Minimization') {
                qcOb.lossMinimizationRemarks = lowMiniRemarks;
            } else if (finalDecision === 'Queries to be raised') {
                qcOb.queriesRemarks = queryRemark;
                qcOb.queriesQuery = queryTxt;
            }
        } else if (qcObservations === 'Raise query to Regional QC manager') {
            qcOb.queryWithRegionalQC = queryRM;
        } else if (qcObservations === 'Response to Central QC Query') {
            qcOb.queryWithRegionalQC = centralQuery;
            qcOb.queriesQuery = queryCM;
        } else if (qcObservations === 'Rework') {
            qcOb.queriesRemarks = payableRemarks;
        } else if (qcObservations === 'Reassign') {
            qcOb.queriesRemarks = payableRemarks || '';
        }

        // ============================================
        // PART 2: Validate Mandatory Fields
        // ============================================
        // if (
        //     agencyCode === '' ||
        //     investigationDocsView.length === 0 ||
        //     selectedTreatingDctrQues.length === 0 ||
        //     selectedForInsuredQues.length === 0 ||
        //     acceptInstruction == null
        // ) {
        //     alertService.showAlertError('Please fill all mandatory fields');
        //     console.log('Missing mandatory fields:', {
        //         agencyCode,
        //         investigationDocsView: investigationDocsView.length,
        //         selectedTreatingDctrQues: selectedTreatingDctrQues.length,
        //         selectedForInsuredQues: selectedForInsuredQues.length,
        //         acceptInstruction,
        //         investigationType: previewValues.investigationType,
        //     });
        //     return;
        // }

        // ============================================
        // PART 3: Build Question Codes and Agency Codes
        // ============================================
        const combinedQuestionCodes = [
            ...selectedTreatingDctrQues,
            ...customForInsuredQuestions,
            ...selectedForInsuredQues,
            ...customForTreatingDoctorQuestions,
        ];

        // ============================================
        // PART 4: Add Recommendations (Only for non-split OR Accept Report)
        // ============================================
        if (previewValues.investigationType !== 'Split case allocation') {
            // Convert string 'true'/'false' to boolean
            qcOb.policyCancellation = recommendations.policyCancellation === 'true';
            qcOb.hospitalBlacklisted = recommendations.hospitalBlacklisted === 'true';
            qcOb.hospitalDepanelled = recommendations.hospitalDepanelled === 'true';
            qcOb.hospitalCautionTagged = recommendations.hospitalCautionTagged === 'true';
            qcOb.insuredBlacklisted = recommendations.insuredBlacklisted === 'true';
            qcOb.insuredCautionTagged = recommendations.insuredCautionTagged === 'true';
            qcOb.policyFraud = recommendations.policyFraud === 'true';
            qcOb.treatingDoctorFraud = recommendations.treatingDoctorFraud === 'true';
            qcOb.pathologistFraud = recommendations.pathologistFraud === 'true';
            qcOb.chemistFraud = recommendations.chemistFraud === 'true';
            qcOb.pathologyLabFraud = recommendations.pathologyLabFraud === 'true';
            qcOb.corporateTaggedFraud = recommendations.corporateTaggedFraud === 'true';
            qcOb.legalActionInitiated = recommendations.legalActionInitiated === 'true';
        }

        // ============================================
        // PART 5: Populate Final Object
        // ============================================
        // qcOb.assignedToUser = assignedToUser;
        qcOb.assignedToUser = '';
        qcOb.agencyCodes = agencyCode ? [agencyCode] : [];
        qcOb.questionCodes = combinedQuestionCodes;
        qcOb.payableRemarks = payableRemarks;
        qcOb.acceptInstruction = acceptInstruction;
        qcOb.prevInvestigatorReport = prevInvestigatorReport;
        qcOb.claimType = claimType;

        // ============================================
        // PART 6: Add Ground Rejections (Only for Repudiate)
        // ============================================
        if (finalDecision === 'Repudiate') {

            // Ground rejection
            if (groundOfRejection) {
                qcOb.groundRejectionQCDTO = {
                    groundRejectionCode: [groundOfRejection],
                };
            }

            // Fraudulent rejections
            qcOb.groundRejectionFraudulentQCDTO = {
                groundRejectionFraudulentCode:
                    Array.isArray(groundOfRejectionFraud) && groundOfRejectionFraud.length > 0
                        ? [...groundOfRejectionFraud]
                        : [],
            };

            // Exclusion rejections
            qcOb.groundRejectionExclusionQCDTO = {
                groundRejectionExclusionCode:
                    Array.isArray(groundOfRejectionExclusion) && groundOfRejectionExclusion.length > 0
                        ? [...groundOfRejectionExclusion]
                        : [],
            };

            // Misrepresentation rejections
            qcOb.groundRejectionMisrepresentQCDTO = {
                groundRejectionMisrepresentCode:
                    Array.isArray(groundOfRejectionMisrepresentation) &&
                        groundOfRejectionMisrepresentation.length > 0
                        ? [...groundOfRejectionMisrepresentation]
                        : [],
            };
        }

        // ============================================
        // PART 7: Log Payload
        // ============================================
        console.log('=== QC OBSERVATIONS PAYLOAD ===');
        console.log('Document Codes:', documentsCodes);
        console.log('Full Payload:', JSON.stringify(qcOb));
        console.log('============================');

        // ============================================
        // PART 8: Submit to Backend
        // ============================================
        const response: any = await QCUpdateService.addQCObservations(
            qcOb,
            investigationId,
            documentsCodes
        );

        if (response.statusCode === 0) {
            console.log('Payload Data:', JSON.stringify(response.payload));
            alertService.showAlertSuccess('QC Observations submitted successfully');

            // Navigate based on observation type
            if (
                qcObservations === 'Raise query to Regional QC manager' ||
                qcObservations === 'Response to Central QC Query' ||
                qcObservations === 'Rework' ||
                qcObservations === 'Reassign'
            ) {
                console.log('redirectTo', redirectTo);
                // if (redirectTo) {
                //     navigate(redirectTo);
                // } else {
                //     navigate('/admin/dashboard');
                // }
                if (redirectTo) {
                    navigate(redirectTo.replace('/investigation', ''));
                } else {
                    navigate('/admin/dashboard');
                }
            } else {
                // For other observation types, trigger tab change
                if (onChangeTab) {
                    onChangeTab(true);
                }
            }
        } else if (response.statusCode === 4004) {
            // Partial success
            alertService.showAlertSuccess(response.message);
        } else {
            alertService.showAlertError(response.message || 'Failed to submit QC observations');
        }
    };


    const isDisabled = editAble === 'Non-Editable' || claimSubmitted;

    // Fetch investigation documents
    const fetchInvestigationDocs = async () => {
        try {
            if (roleName === 'Regional Manager') {
                // Fetch central documents
                const centralResponse = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentCentral',
                    investigationId
                );
                if (centralResponse.statusCode === 0) {
                    setDocumentArray(centralResponse.payload);
                }

                // Fetch regional documents
                const regionalResponse = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentRegional',
                    investigationId
                );
                if (regionalResponse.statusCode === 0) {
                    setDocumentArray((prev) => [...prev, ...regionalResponse.payload]);
                }
            } else if (roleName === 'Agency Spoc') {
                // Fetch central documents
                const centralResponse = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentCentral',
                    investigationId
                );
                if (centralResponse.statusCode === 0) {
                    setDocumentArray(centralResponse.payload);
                }

                // Fetch regional documents
                const regionalResponse = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentRegional',
                    investigationId
                );
                if (regionalResponse.statusCode === 0) {
                    setDocumentArray((prev) => [...prev, ...regionalResponse.payload]);
                }
            } else {
                const uploadDuring =
                    roleName === 'Regional Manager'
                        ? 'caseAssignmentRegional'
                        : roleName === 'Agency Spoc'
                            ? 'caseAssignmentAgency'
                            : roleName === 'Central Manager'
                                ? 'caseAssignmentCentral'
                                : '';

                if (uploadDuring) {
                    const response = await DocumentsService.viewInvestigationDocsView(
                        uploadDuring,
                        investigationId
                    );
                    if (response.statusCode === 0) {
                        setInvestigationDocsView(response.payload);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching investigation docs:', error);
        }
    };

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/gif',
            'image/tiff',
        ];

        if (allowedTypes.includes(file.type)) {
            setSelectedFiles(event.target.files);
        } else {
            alertService.showAlertError(
                'Invalid file format. Only PDF, JPEG, GIF and TIFF file formats are supported.'
            );
            event.target.value = ''; // Reset input
        }
    };

    // Upload document
    const handleDocumentUpload = async () => {
        if (!documentTitle || !selectedFiles) {
            alertService.showAlertError('Please provide document title and select a file');
            return;
        }

        // Check for duplicate document title
        if (documentNames.includes(documentTitle)) {
            alertService.showAlertError('A document with this title already exists');
            return;
        }

        try {
            const uploadDuring =
                roleName === 'Regional Manager'
                    ? 'caseAssignmentRegional'
                    : roleName === 'Agency Spoc'
                        ? 'caseAssignmentAgency'
                        : roleName === 'Central Manager'
                            ? 'caseAssignmentCentral'
                            : '';

            const response: any = await DocumentsService.uploadInvestigationDocs(
                uploadDuring,
                investigationId,
                selectedFiles[0],
                false,
                documentTitle
            );

            if (response.statusCode === 0) {
                const uploadedDoc = response.payload[0];

                // Add to documents codes
                setDocumentsCodes([...documentsCodes, uploadedDoc.documentID]);

                // Add to investigation docs view
                setInvestigationDocsView([...investigationDocsView, uploadedDoc]);

                // Add to document names
                setDocumentNames([...documentNames, documentTitle]);

                // Clear form
                setDocumentTitle('');
                setSelectedFiles(null);

                // Reset file input
                const fileInput = document.getElementById('documentFileInput') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }

                alertService.showAlertSuccess('Document uploaded successfully');
            } else if (response.statusCode === 4005) {
                alertService.showAlertError(response.message);
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            alertService.showAlertError('Failed to upload document');
        }
    };

    // Delete document
    const handleDocumentDelete = async (documentId: string, docTitle: string, index: number) => {
        try {
            const response = await DocumentsService.deleteDocument(documentId);

            if (response.statusCode === 0) {
                // Remove from documents codes
                setDocumentsCodes(documentsCodes.filter((id) => id !== documentId));

                // Remove from investigation docs view
                const updatedDocs = [...investigationDocsView];
                updatedDocs.splice(index, 1);
                setInvestigationDocsView(updatedDocs);

                // Remove from document names
                setDocumentNames(documentNames.filter((name) => name !== docTitle));

                alertService.showAlertSuccess('Document deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            alertService.showAlertError('Failed to delete document');
        }
    };

    // Open document
    const openDocument = (fileLocation: string, documentID: string) => {
        const url = `${apiUrls.viewDocument}${fileLocation}&documentId=${documentID}`;
        window.open(url, '_blank');
    };

    // Get image source for thumbnail
    const getImageSrc = (fileLocation: string) => {
        return `${apiUrls.viewDocument}${fileLocation}`;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                {/* QC Observations Dropdown */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel sx={{ mb: 1, fontWeight: 600 }}>QC Observations</FormLabel>
                    <Select
                        value={qcObservations}
                        onChange={(e) => setQcObservations(e.target.value)}
                        disabled={isDisabled}
                    >
                        {qcObservationOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Raise query to Regional QC manager */}
                {qcObservations === 'Raise query to Regional QC manager' && (
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Query</FormLabel>
                        <TextField
                            multiline
                            rows={5}
                            value={queryRM}
                            onChange={(e) => setQueryRM(e.target.value)}
                            disabled={isDisabled}
                        />
                    </FormControl>
                )}

                {/* Response to Central QC Query */}
                {qcObservations === 'Response to Central QC Query' && (
                    <>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Central Query</FormLabel>
                            <TextField
                                multiline
                                rows={5}
                                value={centralQuery}
                                disabled
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Reply to Central Query</FormLabel>
                            <TextField
                                multiline
                                rows={5}
                                value={queryCM}
                                onChange={(e) => setQueryCM(e.target.value)}
                                disabled={isDisabled}
                            />
                        </FormControl>
                    </>
                )}

                {/* Accept Report - Final Decision */}
                {qcObservations === 'Accept Report' && (
                    <>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Final Decision</FormLabel>
                            <Select
                                value={finalDecision}
                                onChange={(e) => setFinalDecision(e.target.value)}
                                disabled={isDisabled}
                            >
                                {finalDecisionOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box>
                            {/* Payable - Remarks */}
                            {finalDecision === 'Payable' && (
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Remarks</FormLabel>
                                    <TextField
                                        multiline
                                        rows={5}
                                        value={payableRemarks}
                                        onChange={(e) => setPayableRemarks(e.target.value)}
                                        disabled={isDisabled}
                                        placeholder="Enter remarks for payable decision..."
                                    />
                                </FormControl>
                            )}

                            {/* Loss Minimization - Remarks */}
                            {finalDecision === 'Loss Minimization' && (
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Remarks</FormLabel>
                                    <TextField
                                        multiline
                                        rows={5}
                                        value={lowMiniRemarks}
                                        onChange={(e) => setLowMiniRemarks(e.target.value)}
                                        disabled={isDisabled}
                                        placeholder="Enter remarks for loss minimization..."
                                    />
                                </FormControl>
                            )}

                            {/* Queries to be raised - Remarks & Query */}
                            {finalDecision === 'Queries to be raised' && (
                                <>
                                    <FormControl fullWidth sx={{ mb: 3 }}>
                                        <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Remarks</FormLabel>
                                        <TextField
                                            multiline
                                            rows={5}
                                            value={queryRemark}
                                            onChange={(e) => setQueryRemark(e.target.value)}
                                            disabled={isDisabled}
                                            placeholder="Enter remarks..."
                                        />
                                    </FormControl>
                                    <FormControl fullWidth sx={{ mb: 3 }}>
                                        <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Query</FormLabel>
                                        <TextField
                                            multiline
                                            rows={5}
                                            value={queryTxt}
                                            onChange={(e) => setQueryTxt(e.target.value)}
                                            disabled={isDisabled}
                                            placeholder="Enter query text..."
                                        />
                                    </FormControl>
                                </>
                            )}

                            {/* Repudiate - Ground of Rejection will be handled by GroundRejectionSelector component */}
                            {/* The GroundRejectionSelector component will be rendered separately in the main component */}

                            {/* Repudiate - Remarks */}
                            {/* {finalDecision === 'Repudiate' && (
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Remark</FormLabel>
                                    <TextField
                                        multiline
                                        rows={5}
                                        value={repadiateRemarks}
                                        onChange={(e) => setRepadiateRemarks(e.target.value)}
                                        disabled={isDisabled}
                                        placeholder="Enter repudiation remarks..."
                                    />
                                </FormControl>
                            )} */}

                            {/* Suspected Case - Findings */}
                            {finalDecision === 'Suspected Case' && (
                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
                                        Findings <Typography component="span" color="error">*</Typography>
                                    </FormLabel>
                                    <TextField
                                        multiline
                                        rows={5}
                                        value={suspectedCaseFindings}
                                        onChange={(e) => setSuspectedCaseFindings(e.target.value)}
                                        disabled={isDisabled}
                                        placeholder="Enter suspected case findings..."
                                        required
                                    />
                                </FormControl>
                            )}
                        </Box>
                    </>

                )}



                {qcObservations === 'Accept Report' && finalDecision === 'Repudiate' && (
                    <>
                        {/* Ground of Rejection - Main Selection */}
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Ground of rejection</FormLabel>
                            <Select
                                value={groundOfRejection}
                                onChange={(e) => setGroundOfRejection(e.target.value as string[])}
                                disabled={isDisabled}
                            >
                                {groundOfRegection.map((rejection) => (
                                    <MenuItem
                                        key={rejection.groundRejectionCode}
                                        value={rejection.groundRejectionCode}
                                    >
                                        <ListItemText primary={rejection.groundRejection} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Ground of Rejection - Fraud (GR0395) */}
                        {groundOfRejection.indexOf('GR0395') > -1 && (
                            <Box sx={{ mb: 3 }}>
                                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Ground of rejection Fraud
                                    </Typography>
                                    <FormGroup>
                                        {groundOfRegectionFraud.map((rejection) => (
                                            <FormControlLabel
                                                key={rejection.groundRejectionFraudulentCode}
                                                control={
                                                    <Checkbox
                                                        checked={isGroundRejectionFraudChecked(rejection)}
                                                        onChange={handleGroundRejectionFraudChange}

                                                        value={rejection.groundRejectionFraudulentCode}
                                                        disabled={isDisabled}
                                                    />
                                                }
                                                label={rejection.groundRejectionFraudulent}
                                            />
                                        ))}
                                    </FormGroup>
                                </Paper>
                            </Box>
                        )}

                        {/* Ground of Rejection - Exclusion (GR0393) */}
                        {groundOfRejection.indexOf('GR0393') > -1 && (
                            <Box sx={{ mb: 3 }}>
                                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Ground of rejection Exclusion
                                    </Typography>
                                    <FormGroup>
                                        {groundOfRejectionExclusion1.map((rejection: any) => (
                                            <FormControlLabel
                                                key={rejection.groundRejectionExclusionCode}
                                                control={
                                                    <Checkbox
                                                        checked={isGroundRejectionExclusionChecked(rejection)}
                                                        onChange={handleGroundRejectionExclusionChange}
                                                        value={rejection.groundRejectionExclusionCode}
                                                        disabled={isDisabled}
                                                    />
                                                }
                                                label={rejection.groundRejectionExclusion}
                                            />
                                        ))}
                                    </FormGroup>
                                </Paper>
                            </Box>
                        )}

                        {/* Ground of Rejection - Misrepresentation (GR0394) */}
                        {groundOfRejection.indexOf('GR0394') > -1 && (
                            <Box sx={{ mb: 3 }}>
                                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Ground of rejection Misrepresentation
                                    </Typography>
                                    <FormGroup>
                                        {groundOfRejectionMisrepresentation1.map((rejection: any) => (
                                            <FormControlLabel
                                                key={rejection.groundRejectionMisrepresentCode}
                                                control={
                                                    <Checkbox
                                                        checked={isGroundRejectionMisrepreChecked(rejection)}
                                                        onChange={handleGroundRejectionMisrepresentationChange}
                                                        value={rejection.groundRejectionMisrepresentCode}
                                                        disabled={isDisabled}
                                                    />
                                                }
                                                label={rejection.groundRejectionMisrepresent}
                                            />
                                        ))}
                                    </FormGroup>
                                </Paper>
                            </Box>
                        )}

                        {/* Repudiate Remarks */}
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Remark</FormLabel>
                            <TextField
                                multiline
                                rows={5}
                                value={repadiateRemarks}
                                onChange={(e) => setRepadiateRemarks(e.target.value)}
                                disabled={isDisabled}
                                placeholder="Enter repudiation remarks..."
                            />
                        </FormControl>
                    </>
                )}


                {qcObservations === 'Accept Report' && finalDecision !== '' && finalDecision !== null && (
                    <Box sx={{ mb: 3 }}>
                        <Paper sx={{ p: 3, bgcolor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1f2937' }}>
                                Recommendation to Central QC
                            </Typography>

                            {/* FOR REGIONAL MANAGER - Simple Yes/No dropdowns */}
                            {(roleName === 'Regional Manager' || roleName === 'Regional QC') && (
                                <Grid container spacing={3}>
                                    {/* Row 1 */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Policy cancellation
                                            </FormLabel>
                                            <Select
                                                value={recommendations.policyCancellation}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    policyCancellation: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Hospital to be blacklisted
                                            </FormLabel>
                                            <Select
                                                value={recommendations.hospitalBlacklisted}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    hospitalBlacklisted: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 2 */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Hospital to be Depanelled (applicable only if network - system validations)
                                            </FormLabel>
                                            <Select
                                                value={recommendations.hospitalDepanelled}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    hospitalDepanelled: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Hospital to be caution tagged
                                            </FormLabel>
                                            <Select
                                                value={recommendations.hospitalCautionTagged}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    hospitalCautionTagged: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 3 */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Insured to be blacklisted
                                            </FormLabel>
                                            <Select
                                                value={recommendations.insuredBlacklisted}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    insuredBlacklisted: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Insured to be caution tagged
                                            </FormLabel>
                                            <Select
                                                value={recommendations.insuredCautionTagged}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    insuredCautionTagged: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 4 */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Policy to be tagged as fraud
                                            </FormLabel>
                                            <Select
                                                value={recommendations.policyFraud}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    policyFraud: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Treating doctor be tagged as Fraud / caution
                                            </FormLabel>
                                            <Select
                                                value={recommendations.treatingDoctorFraud}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    treatingDoctorFraud: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 5 */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Pathologist be tagged as Fraud / caution
                                            </FormLabel>
                                            <Select
                                                value={recommendations.pathologistFraud}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    pathologistFraud: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Chemist to be tagged as Fraud/ caution
                                            </FormLabel>
                                            <Select
                                                value={recommendations.chemistFraud}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    chemistFraud: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 6 */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Pathology lab to be tagged as fraud / caution
                                            </FormLabel>
                                            <Select
                                                value={recommendations.pathologyLabFraud}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    pathologyLabFraud: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Corporate (applicable only in group policy) to be tagged as Fraud/ caution
                                            </FormLabel>
                                            <Select
                                                value={recommendations.corporateTaggedFraud}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    corporateTaggedFraud: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 7 */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth>
                                            <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>
                                                Legal Action to be initiated
                                            </FormLabel>
                                            <Select
                                                value={recommendations.legalActionInitiated}
                                                onChange={(e) => setRecommendations({
                                                    ...recommendations,
                                                    legalActionInitiated: e.target.value
                                                })}
                                                disabled={isDisabled}
                                                size="small"
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            )}

                            {/* FOR CENTRAL MANAGER - Comparison Table */}
                            {(roleName === 'Central Manager' || roleName === 'Central QC') && previewValues && (
                                <Box>
                                    {/* Helper function to get Yes/No text */}
                                    {(() => {
                                        const getRealData = (value: boolean) => value ? 'Yes' : 'No';

                                        return (
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell><strong>Recommendation</strong></TableCell>
                                                            <TableCell align="center"><strong>Reg. QC Update</strong></TableCell>
                                                            <TableCell align="center"><strong>Central Decision</strong></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {/* Each row shows Regional QC value vs Central selection */}
                                                        <TableRow>
                                                            <TableCell>Policy cancellation</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.regpolicyCancellation)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.policyCancellation}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, policyCancellation: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Hospital to be blacklisted</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.reghospitalBlacklisted)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.hospitalBlacklisted}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, hospitalBlacklisted: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Hospital to be Depanelled ( applicable only if network - system validations)</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.reghospitalDepanelled)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.hospitalDepanelled}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, hospitalDepanelled: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Hospital to be caution tagged</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.reghospitalCautionTagged)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.hospitalCautionTagged}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, hospitalCautionTagged: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Insured to be blacklisted</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.reginsuredBlacklisted)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.insuredBlacklisted}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, insuredBlacklisted: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Insured to be caution tagged</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.reginsuredCautionTagged)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.insuredCautionTagged}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, insuredCautionTagged: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Policy to be tagged as fraud</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.regpolicyFraud)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.policyFraud}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, policyFraud: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Treating doctor be tagged as Fraud / caution</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.regtreatingDoctorFraud)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.treatingDoctorFraud}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, treatingDoctorFraud: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Pathologist be tagged as Fraud / caution</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.regpathologistFraud)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.pathologistFraud}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, pathologistFraud: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Chemist to be tagged as Fraud/ caution</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.regchemistFraud)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.chemistFraud}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, chemistFraud: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Pathology lab to be tagged as fraud / caution</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.regpathologyLabFraud)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.pathologyLabFraud}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, pathologyLabFraud: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Corporate (applicable only in group policy) to be tagged as Fraud/ caution</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.regcorporateTaggedFraud)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.corporateTaggedFraud}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, corporateTaggedFraud: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Legal Action to be initiated</TableCell>
                                                            <TableCell align="center">{getRealData(previewValues.reglegalActionInitiated)}</TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={recommendations.legalActionInitiated}
                                                                    onChange={(e) => setRecommendations({ ...recommendations, legalActionInitiated: e.target.value })}
                                                                    size="small"
                                                                    fullWidth
                                                                >
                                                                    <MenuItem value="">Select</MenuItem>
                                                                    <MenuItem value="true">Yes</MenuItem>
                                                                    <MenuItem value="false">No</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                        {/* Repeat for all 12 fields... */}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        );
                                    })()}
                                </Box>
                            )}
                        </Paper>
                    </Box>
                )}


                {qcObservations === 'Reassign' && previewValues?.investigationType !== 'Part verification' && (
                    <AcceptAgencies />
                )}

                {qcObservations === 'Rework' && (
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Remarks</FormLabel>
                        <TextField
                            multiline
                            rows={5}
                            value={payableRemarks}
                            onChange={(e) => setPayableRemarks(e.target.value)}
                            disabled={isDisabled}
                        />
                    </FormControl>
                )}

                {!claimSubmitted && roleName !== 'Super Admin' && !editAble && buttonEnable && qcObservations !== 'Reassign' && (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            mt: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            px: 4,
                            py: 1.5,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                            },
                        }}
                    >
                        Submit
                    </Button>
                )}
            </Paper>
        </Box>
    );
};

export default QCObservations;