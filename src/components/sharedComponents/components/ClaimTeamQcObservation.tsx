import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Select,
    MenuItem,
    Checkbox,
    Typography,
    Paper,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { QCUpdateService } from '../../../services/qcupdate.service';
import { agencyService } from '../../../services/agency.service';
import { AcceptAssignService } from '../../../services/acceptassign.service';
import { QuestionService } from '../../../services/question.service';
import { DocumentService } from '../../../services/document.service';

interface ClaimTeamQcObservationProps {
    previewValues: any;
    buttonEnable: boolean;
    dataRole?: string;
    claimType?: string;
    onRefresh?: () => void;
}

const ClaimTeamQcObservation: React.FC<ClaimTeamQcObservationProps> = ({
    previewValues,
    buttonEnable,
    dataRole,
    claimType,
    onRefresh
}) => {
    const { investigationId } = useParams<{ investigationId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirectTo');

    const roleName = sessionStorage.getItem('roleName') || '';

    // ========== STATE VARIABLES (40+ states) ==========

    // 1. Main QC Observations
    const [qcObservations, setQcObservations] = useState('');
    const [finalDecision, setFinalDecision] = useState('');

    // 2. Queries & Remarks
    const [queryRM, setQueryRM] = useState(''); // Query to Regional Manager
    const [queryCM, setQueryCM] = useState(''); // Reply to Central Query
    const [centralQuery, setCentralQuery] = useState(''); // Central Query (read-only)
    const [payableRemarks, setPayableRemarks] = useState('');
    const [lowminiremarks, setLowminiremarks] = useState('');
    const [queryRemark, setQueryRemark] = useState('');
    const [queryTxt, setQueryTxt] = useState('');
    const [repadiateRemarks, setRepadiateRemarks] = useState('');
    const [suspectedCaseFindings, setSuspectedCaseFindings] = useState('');

    // 3. Ground of Rejection Arrays
    const [groundOfRejection, setGroundOfRejection] = useState<string[]>([]);
    const [groundOfRejectionFraud, setGroundOfRejectionFraud] = useState<string[]>([]);
    const [groundOfRejectionExclusion2, setGroundOfRejectionExclusion2] = useState<string[]>([]);
    const [groundOfRejectionMisrepresentation2, setGroundOfRejectionMisrepresentation2] = useState<string[]>([]);

    // 4. Ground of Rejection Dropdown Data
    const [groundOfRegection, setGroundOfRegection] = useState<any[]>([]);
    const [groundOfRegectionFraud, setGroundOfRegectionFraud] = useState<any[]>([]);
    const [groundOfRejectionExclusion, setGroundOfRejectionExclusion] = useState<any[]>([]);
    const [groundOfRejectionMisrepresentation, setGroundOfRejectionMisrepresentation] = useState<any[]>([]);

    // 5. Agency/FO Assignment
    const [agencyCode, setAgencyCode] = useState('');
    const [agencyRadioValue, setAgencyRadioValue] = useState(0);
    const [agencyList, setAgencyList] = useState<any[]>([]);
    const [systemSuggestedAgencyList, setSystemSuggestedAgencyList] = useState<any[]>([]);
    const [fieldOfficerList, setFieldOfficerList] = useState<any[]>([]);
    const [performanceIndex, setPerformanceIndex] = useState<any>(null);

    // 6. Regional Team Assignment (Central Manager)
    const [userCodeForRegionalManager, setUserCodeForRegionalManager] = useState<string | null>(null);
    const [regionalTeamMembers, setRegionalTeamMembers] = useState<any[]>([]);

    // 7. Questions
    const [selectedForInseredQues, setSelectedForInseredQues] = useState<string[]>([]);
    const [forInsuredQuestions, setForInsuredQuestions] = useState<any[]>([]);
    const [selectedTreatingdctrInseredQues, setSelectedTreatingdctrInseredQues] = useState<string[]>([]);
    const [forTreatingDoctorQuestions, setForTreatingDoctorQuestions] = useState<any[]>([]);
    const [customForInsuredQuestionList, setCustomForInsuredQuestionList] = useState<any[]>([]);
    const [customForTreatingDoctorQuestionList, setCustomForTreatingDoctorQuestionList] = useState<any[]>([]);

    // 8. Custom Questions Modal State
    const [customQuestions, setCustomQuestions] = useState<any[]>([{ questionName: '', questionIsCustom: false }]);
    const [customQuestionsTDctr, setCustomQuestionsTDctr] = useState<any[]>([{ questionName: '', questionIsCustom: false }]);

    // 9. Question Limits
    const [totalForInsuredQues, setTotalForInsuredQues] = useState(0);
    const [totalTDctrQues, setTotalTDctrQues] = useState(0);
    const [maxAddexidedForInsured, setMaxAddexidedForInsured] = useState(false);
    const [maxAddexidedForTDctr, setMaxAddexidedForTDctr] = useState(false);

    // 10. Documents
    const [documentTitle, setDocumentTitle] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [investigationDocsView, setInvestigationDocsView] = useState<any[]>([]);
    const [documentArray, setDocumentArray] = useState<any[]>([]);
    const [documentsCodes, setDocumentsCodes] = useState<string[]>([]);
    const [documentNames, setDocumentNames] = useState<string[]>([]);

    // 11. Instructions & Misc
    const [acceptInstruction, setAcceptInstruction] = useState('');
    const [prevInvestigatorReport, setPrevInvestigatorReport] = useState('');

    // 12. Recommendation to Central QC (Regional Manager)
    const [qcOb, setQcOb] = useState<any>({
        policyCancellation: null,
        hospitalBlacklisted: null,
        hospitalDepanelled: null,
        hospitalCautionTagged: null,
        insuredBlacklisted: null,
        insuredCautionTagged: null,
        policyFraud: null,
        treatingDoctorFraud: null,
        pathologistFraud: null,
        chemistFraud: null,
        pathologyLabFraud: null,
        corporateTaggedFraud: null,
        legalActionInitiated: null
    });

    // 13. Regional QC Data (Central Manager)
    const [recdCenQC, setRecdCenQC] = useState<any>(null);

    // 14. Modal States
    const [insuredQuestionsModalOpen, setInsuredQuestionsModalOpen] = useState(false);
    const [treatingDoctorQuestionsModalOpen, setTreatingDoctorQuestionsModalOpen] = useState(false);
    const [customInsuredQuestionsModalOpen, setCustomInsuredQuestionsModalOpen] = useState(false);
    const [customTDctrQuestionsModalOpen, setCustomTDctrQuestionsModalOpen] = useState(false);

    // 15. Dropdown Options
    const qcObservationsdropdownOptions = roleName === 'Central Manager' ? [
        { label: "Select", value: "" },
        { label: "Respond to Claims Team", value: "Respond to Claims Team" },
        { label: "Raise query to Regional QC manager", value: "Raise query to Regional QC manager" }
    ] : [
        { label: "Select", value: "" },
        { label: "Respond to Claims Team", value: "Respond to Claims Team" },
        { label: "Rework", value: "Rework" },
        { label: "Reassign", value: "Reassign" },
        { label: "Response to Central QC Query", value: "Response to Central QC Query" }
    ];

    const finalDecisionOptions = [
        { label: "Select", value: "" },
        { label: "Payable", value: "Payable" },
        { label: "Repudiate", value: "Repudiate" },
        { label: "Loss Minimization", value: "Loss Minimization" },
        { label: "Queries to be raised", value: "Queries to be raised" },
    ];

    useEffect(() => {
        initializeComponent();
    }, []);

    useEffect(() => {
        if (previewValues) {
            populateFromPreviewValues();
        }
    }, [previewValues]);

    const populateFromPreviewValues = () => {
        if (!previewValues) return;

        // 1. Main fields
        setQcObservations(previewValues.qcObservations || '');
        setQueryRM(previewValues.queryWithRegionalQC || '');
        setQueryCM(previewValues.queriesQuery || '');
        setFinalDecision(previewValues.finalDecision || '');
        setPayableRemarks(previewValues.queriesRemarks || '');
        setQueryRemark(previewValues.queryRemarks || '');
        setQueryTxt(previewValues.queryTxt || '');
        setRepadiateRemarks(previewValues.repudiateFraudulentRemarks || '');
        setSuspectedCaseFindings(previewValues.suspectedCaseFindings || '');
        setLowminiremarks(previewValues.lossMinimizationRemarks || '');

        // 2. Special case: Queries to be raised
        if (previewValues.qcObservations === "Respond to Claims Team" &&
            previewValues.finalDecision === "Queries to be raised") {
            setQueryRemark(previewValues.queriesRemarks || '');
            setQueryTxt(previewValues.queriesQuery || '');
        }

        // 3. Ground of Rejection Arrays
        if (previewValues.groundRejectionQCDTO?.groundRejectionQCViewDTOs) {
            const codes = previewValues.groundRejectionQCDTO.groundRejectionQCViewDTOs.map(
                (o: any) => o.groundRejectionCode
            );
            setGroundOfRejection(codes);
        }

        if (previewValues.groundRejectionFraudulentQCDTO?.groundRejectionFraudulentQCViewDTOs) {
            const codes = previewValues.groundRejectionFraudulentQCDTO.groundRejectionFraudulentQCViewDTOs.map(
                (o: any) => o.groundRejectionFraudulentCode
            );
            setGroundOfRejectionFraud(codes);
        }

        if (previewValues.groundRejectionExclusionQCDTO?.groundRejectionExclusionDTO) {
            const codes = previewValues.groundRejectionExclusionQCDTO.groundRejectionExclusionDTO.map(
                (o: any) => o.groundRejectionExclusionCode
            );
            setGroundOfRejectionExclusion2(codes);
        }

        if (previewValues.groundRejectionMisrepresentQCDTO?.groundRejectionMisrepresentationDTO) {
            const codes = previewValues.groundRejectionMisrepresentQCDTO.groundRejectionMisrepresentationDTO.map(
                (o: any) => o.groundRejectionMisrepresentCode
            );
            setGroundOfRejectionMisrepresentation2(codes);
        }
    };

    const initializeComponent = async () => {
        // 1. Fetch ground details
        await fetchGroundDetails();
        await fetchGroundFraudDetails();
        await fetchGroundExclusionDetails();
        await fetchGroundMisrepresentationDetails();

        // 2. Fetch agencies/FOs based on role
        if (roleName === 'Agency Spoc') {
            await fetchAllFieldOfficer();
        } else {
            await fetchAllAgencies();
            await fetchAllSystemSuggestedAgencies();
        }

        // 3. Fetch regional users (Central Manager only)
        if (roleName === 'Central Manager') {
            await fetchRegionalUsers();
        }

        // 4. Fetch questions
        await fetchForInsuredQuestions();

        // 5. Fetch documents
        await fetchInvestigationDocs();

        // 6. Get existing QC data
        await getData();
    };

    // ========== FETCH GROUND OF REJECTION LISTS ==========
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
            console.error('Error fetching ground fraud details:', error);
        }
    };

    const fetchGroundExclusionDetails = async () => {
        try {
            const response = await QCUpdateService.getGroundExclusionDetails();
            if (response.statusCode === 0) {
                setGroundOfRejectionExclusion(response.payload);
            }
        } catch (error) {
            console.error('Error fetching ground exclusion details:', error);
        }
    };

    const fetchGroundMisrepresentationDetails = async () => {
        try {
            const response = await QCUpdateService.getMisrepresentationFraudDetails();
            if (response.statusCode === 0) {
                setGroundOfRejectionMisrepresentation(response.payload);
            }
        } catch (error) {
            console.error('Error fetching ground misrepresentation details:', error);
        }
    };

    // ========== FETCH AGENCIES/FOs ==========
    const fetchAllAgencies = async () => {
        try {
            const response = await agencyService.fetchAllAgency();
            if (response.statusCode === 0) {
                setAgencyList(response.payload);
            }
        } catch (error) {
            console.error('Error fetching agencies:', error);
        }
    };

    const fetchAllSystemSuggestedAgencies = async () => {
        try {
            const response = await agencyService.getSystemSuggestedAgency();
            if (response.statusCode === 0) {
                setSystemSuggestedAgencyList(response.payload);
            }
        } catch (error) {
            console.error('Error fetching system suggested agencies:', error);
        }
    };

    const fetchAllFieldOfficer = async () => {
        try {
            const response = await agencyService.fetchAllFieldOfficer();
            if (response.statusCode === 0) {
                setFieldOfficerList(response.payload);
            }
        } catch (error) {
            console.error('Error fetching field officers:', error);
        }
    };

    // ========== FETCH REGIONAL USERS (Central Manager) ==========
    const fetchRegionalUsers = async () => {
        try {
            const response = await AcceptAssignService.getRegionalUsers();
            if (response.statusCode === 0) {
                setRegionalTeamMembers(response.payload);
            }
        } catch (error) {
            console.error('Error fetching regional users:', error);
        }
    };

    // ========== FETCH QUESTIONS ==========
    const fetchForInsuredQuestions = async () => {
        try {
            const response = await QuestionService.getQuestions('CO0115', investigationId || '');
            if (response.statusCode === 0) {
                setForInsuredQuestions(response.payload.questionResponseDTOs);

                // Mark already added questions
                const alreadyAdded = response.payload.questionResponseDTOs
                    .filter((q: any) => q.alreadyAdded)
                    .map((q: any) => q.questionCode);
                setSelectedForInseredQues(alreadyAdded);

                // Fetch treating doctor questions
                await fetchTreatingDoctorQuestions();
            }
        } catch (error) {
            console.error('Error fetching insured questions:', error);
        }
    };

    const fetchTreatingDoctorQuestions = async () => {
        try {
            const response = await QuestionService.getQuestions('CO0116', investigationId || '');
            if (response.statusCode === 0) {
                setForTreatingDoctorQuestions(response.payload.questionResponseDTOs);

                // Mark already added questions
                const alreadyAdded = response.payload.questionResponseDTOs
                    .filter((q: any) => q.alreadyAdded)
                    .map((q: any) => q.questionCode);
                setSelectedTreatingdctrInseredQues(alreadyAdded);
            }
        } catch (error) {
            console.error('Error fetching treating doctor questions:', error);
        }
    };

    // ========== FETCH DOCUMENTS ==========
    const fetchInvestigationDocs = async () => {
        try {
            if (roleName === 'Regional Manager' || roleName === 'Agency Spoc') {
                // Fetch both central and regional docs
                const centralResponse = await DocumentService.viewInvestigationDocsView(
                    'caseAssignmentCentral',
                    investigationId || ''
                );

                if (centralResponse.statusCode === 0) {
                    setDocumentArray(centralResponse.payload);

                    const regionalResponse = await DocumentService.viewInvestigationDocsView(
                        'caseAssignmentRegional',
                        investigationId || ''
                    );

                    if (regionalResponse.statusCode === 0) {
                        setDocumentArray(prev => [...prev, ...regionalResponse.payload]);
                    }
                }
            } else {
                // Central Manager - fetch only central docs
                const uploadDuring = roleName === 'Regional Manager'
                    ? 'caseAssignmentRegional'
                    : roleName === 'Agency Spoc'
                        ? 'caseAssignmentAgency'
                        : 'caseAssignmentCentral';

                const response = await DocumentService.viewInvestigationDocsView(
                    uploadDuring,
                    investigationId || ''
                );

                if (response.statusCode === 0) {
                    setInvestigationDocsView(response.payload);
                }
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    // ========== GET EXISTING QC DATA ==========
    const getData = async () => {
        try {
            const tabName = roleName === 'Regional Manager'
                ? 'regionalQC'
                : 'centralQC';

            const response = await QCUpdateService.qcUpdatePreview(
                investigationId || '',
                tabName
            );

            if (response.statusCode === 0) {
                setRecdCenQC(response.payload);
                setCentralQuery(response.payload.queryWithRegionalQC || '');
            }
        } catch (error) {
            console.error('Error fetching QC data:', error);
        }
    };

    // ========== PERFORMANCE INDEX ==========
    const getPerformanceIndex = async () => {
        if (!agencyCode) return;

        try {
            const response = await agencyService.getPerformanceIndex(agencyCode);
            if (response.statusCode === 0) {
                setPerformanceIndex(response.payload);
            }
        } catch (error) {
            console.error('Error fetching performance index:', error);
        }
    };

    // Trigger performance index fetch when agency changes
    useEffect(() => {
        if (agencyCode) {
            getPerformanceIndex();
        }
    }, [agencyCode]);

    // ========== HELPER FUNCTION ==========
    const getRealData = (value: boolean) => {
        return value ? "Yes" : "No";
    };

    const handleGroundRejectionChange = (code: string, checked: boolean) => {
        if (checked) {
            setGroundOfRejection([...groundOfRejection, code]);
        } else {
            setGroundOfRejection(groundOfRejection.filter(item => item !== code));

            // Clear child selections if unchecking parent
            if (groundOfRejection.length === 0) {
                setGroundOfRejectionFraud([]);
                setGroundOfRejectionExclusion2([]);
                setGroundOfRejectionMisrepresentation2([]);
            }
        }
    };

    const handleGroundRejectionFraudChange = (code: string, checked: boolean) => {
        if (checked) {
            setGroundOfRejectionFraud([...groundOfRejectionFraud, code]);
        } else {
            setGroundOfRejectionFraud(groundOfRejectionFraud.filter(item => item !== code));
        }
    };

    const handleGroundRejectionExclusionChange = (code: string, checked: boolean) => {
        if (checked) {
            setGroundOfRejectionExclusion2([...groundOfRejectionExclusion2, code]);
        } else {
            setGroundOfRejectionExclusion2(groundOfRejectionExclusion2.filter(item => item !== code));
        }
    };

    const handleGroundRejectionMisChange = (code: string, checked: boolean) => {
        if (checked) {
            setGroundOfRejectionMisrepresentation2([...groundOfRejectionMisrepresentation2, code]);
        } else {
            setGroundOfRejectionMisrepresentation2(groundOfRejectionMisrepresentation2.filter(item => item !== code));
        }
    };

    const getImageSrc = (fileLocation: string, fileType: string) => {
        if (fileType === 'image/jpeg' || fileType === 'image/png') {
            return `/api/documents/view?location=${fileLocation}`;
        } else if (fileType === 'application/pdf') {
            return '/assets/images/pdf-icon.png';
        } else if (fileType === 'application/x-zip-compressed') {
            return '/assets/images/zip-file.png';
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return '/assets/images/google-docs.png';
        } else {
            return '/assets/images/google-docs.png';
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/gif', 'image/tiff'];
            if (validTypes.includes(file.type)) {
                const fileList = new DataTransfer();
                fileList.items.add(file);
                setSelectedFiles(fileList.files);
            } else {
                alert('Invalid file format. Only PDF, JPEG, GIF and TIFF file formats are supported.');
            }
        }
    };

    const handleUpload = async () => {
        if (!documentTitle || !selectedFiles) {
            alert('Please provide document title and select a file');
            return;
        }

        // Check for duplicate title
        if (documentNames.includes(documentTitle)) {
            alert('A document with this title already exists');
            return;
        }

        try {
            const uploadDuring = roleName === 'Regional Manager'
                ? 'caseAssignmentRegional'
                : roleName === 'Agency Spoc'
                    ? 'caseAssignmentAgency'
                    : 'caseAssignmentCentral';

            const response = await DocumentService.uploadInvestigationDocs(
                uploadDuring,
                investigationId || '',
                selectedFiles[0],
                false,
                documentTitle
            );

            if (response.statusCode === 0) {
                const uploadedDoc = response.payload[0];
                setDocumentsCodes([...documentsCodes, uploadedDoc.documentID]);
                setInvestigationDocsView([...investigationDocsView, uploadedDoc]);
                setDocumentNames([...documentNames, documentTitle]);

                // Reset form
                setDocumentTitle('');
                setSelectedFiles(null);

                alert('Document uploaded successfully!');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Failed to upload document');
        }
    };

    const handleDeleteDocument = async (documentId: string, docTitle: string, index: number) => {
        try {
            const response = await DocumentService.deleteDocument(documentId);
            if (response.statusCode === 0) {
                setInvestigationDocsView(investigationDocsView.filter((_, i) => i !== index));
                setDocumentsCodes(documentsCodes.filter(item => item !== documentId));
                setDocumentNames(documentNames.filter(item => item !== docTitle));
                alert('Document deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Failed to delete document');
        }
    };


    // src/components/QCUpdate/ClaimTeamQcObservation.tsx
    // PART 7: Submit Logic + Modals - THE GRAND FINALE!

    // ========== QUESTION LIMIT TRACKING ==========
    const maxQuesAddedForInsured = (count: number, status: boolean) => {
        if (status) {
            setTotalForInsuredQues(prev => prev + count);
            if (totalForInsuredQues + count >= 15) {
                setMaxAddexidedForInsured(true);
            }
        } else {
            setTotalForInsuredQues(prev => prev - count);
            if (totalForInsuredQues - count < 15) {
                setMaxAddexidedForInsured(false);
            }
        }
    };

    const maxQuesAddedForTDctr = (count: number, status: boolean) => {
        if (status) {
            setTotalTDctrQues(prev => prev + count);
            if (totalTDctrQues + count >= 15) {
                setMaxAddexidedForTDctr(true);
            }
        } else {
            setTotalTDctrQues(prev => prev - count);
            if (totalTDctrQues - count < 15) {
                setMaxAddexidedForTDctr(false);
            }
        }
    };

    // ========== QUESTION SELECTION HANDLERS ==========
    const handleInsuredQuestionChange = (questionCode: string, checked: boolean) => {
        if (checked) {
            setSelectedForInseredQues([...selectedForInseredQues, questionCode]);
            maxQuesAddedForInsured(1, true);
        } else {
            setSelectedForInseredQues(selectedForInseredQues.filter(q => q !== questionCode));
            maxQuesAddedForInsured(1, false);
        }
    };

    const handleTreatingDoctorQuestionChange = (questionCode: string, checked: boolean) => {
        if (checked) {
            setSelectedTreatingdctrInseredQues([...selectedTreatingdctrInseredQues, questionCode]);
            maxQuesAddedForTDctr(1, true);
        } else {
            setSelectedTreatingdctrInseredQues(selectedTreatingdctrInseredQues.filter(q => q !== questionCode));
            maxQuesAddedForTDctr(1, false);
        }
    };

    // ========== CUSTOM QUESTIONS HANDLERS ==========
    const handleAddCustomQuestion = () => {
        setCustomQuestions([...customQuestions, { questionName: '', questionIsCustom: false }]);
        maxQuesAddedForInsured(1, true);
    };

    const handleDeleteCustomQuestion = (index: number) => {
        setCustomQuestions(customQuestions.filter((_, i) => i !== index));
        maxQuesAddedForInsured(1, false);
    };

    const handleAddCustomQuestionTDctr = () => {
        setCustomQuestionsTDctr([...customQuestionsTDctr, { questionName: '', questionIsCustom: false }]);
        maxQuesAddedForTDctr(1, true);
    };

    const handleDeleteCustomQuestionTDctr = (index: number) => {
        setCustomQuestionsTDctr(customQuestionsTDctr.filter((_, i) => i !== index));
        maxQuesAddedForTDctr(1, false);
    };

    const handleSubmitCustomInsuredQuestions = async () => {
        try {
            const response = await QuestionService.addQuestion({
                questionTypeCode: 'CO0115',
                questions: customQuestions
            });

            if (response.statusCode === 0) {
                setCustomForInsuredQuestionList([...customForInsuredQuestionList, ...response.payload]);
                alert('Custom questions added successfully!');
                setCustomInsuredQuestionsModalOpen(false);
                setCustomQuestions([{ questionName: '', questionIsCustom: false }]);
            }
        } catch (error) {
            console.error('Error adding custom questions:', error);
            alert('Failed to add custom questions');
        }
    };

    const handleSubmitCustomTDctrQuestions = async () => {
        try {
            const response = await QuestionService.addQuestion({
                questionTypeCode: 'CO0116',
                questions: customQuestionsTDctr
            });

            if (response.statusCode === 0) {
                setCustomForTreatingDoctorQuestionList([...customForTreatingDoctorQuestionList, ...response.payload]);
                alert('Custom questions added successfully!');
                setCustomTDctrQuestionsModalOpen(false);
                setCustomQuestionsTDctr([{ questionName: '', questionIsCustom: false }]);
            }
        } catch (error) {
            console.error('Error adding custom questions:', error);
            alert('Failed to add custom questions');
        }
    };

    // ========== MAIN SUBMIT (QC OBSERVATIONS) ==========
    const handleQcSubmit = async () => {
        try {
            const qcObservationData: any = {
                qcUpdateID: localStorage.getItem('qcUpdateID'),
                qcObservations
            };

            // Build payload based on selection
            if (qcObservations === 'Respond to Claims Team') {
                qcObservationData.finalDecision = finalDecision;

                if (finalDecision === 'Payable') {
                    qcObservationData.queriesRemarks = payableRemarks;
                } else if (finalDecision === 'Repudiate') {
                    qcObservationData.repudiateFraudulentRemarks = repadiateRemarks;
                    qcObservationData.groundRejectionQCDTO = { groundRejectionCode: groundOfRejection };
                    qcObservationData.groundRejectionFraudulentQCDTO = { groundRejectionFraudulentCode: groundOfRejectionFraud };
                    qcObservationData.groundRejectionMisrepresentQCDTO = { groundRejectionMisrepresentCode: groundOfRejectionMisrepresentation2 };
                    qcObservationData.groundRejectionExclusionQCDTO = { groundRejectionExclusionCode: groundOfRejectionExclusion2 };
                } else if (finalDecision === 'Suspected Case') {
                    qcObservationData.suspectedCaseFindings = suspectedCaseFindings;
                } else if (finalDecision === 'Loss Minimization') {
                    qcObservationData.lossMinimizationRemarks = lowminiremarks;
                } else if (finalDecision === 'Queries to be raised') {
                    qcObservationData.queriesRemarks = queryRemark;
                    qcObservationData.queriesQuery = queryTxt;
                }

                // Add recommendations (merge qcOb object)
                Object.assign(qcObservationData, qcOb);

            } else if (qcObservations === 'Raise query to Regional QC manager') {
                qcObservationData.queryWithRegionalQC = queryRM;
                qcObservationData.userCodeForRegionalManager = userCodeForRegionalManager;
            } else if (qcObservations === 'Response to Central QC Query') {
                qcObservationData.queryWithRegionalQC = centralQuery;
                qcObservationData.queriesQuery = queryCM;
            } else if (qcObservations === 'Rework') {
                qcObservationData.queriesRemarks = payableRemarks;
            }

            console.log('Submitting QC Observation:', qcObservationData);

            const response = await QCUpdateService.addQCObservations(
                qcObservationData,
                investigationId || '',
                documentsCodes
            );

            if (response.statusCode === 0) {
                alert('QC Observations submitted successfully!');
                localStorage.clear();
                navigate(redirectTo || '/admin/dashboard');
            }
        } catch (error) {
            console.error('Error submitting QC observation:', error);
            alert('Failed to submit QC observation');
        }
    };

    // ========== REASSIGN SUBMIT (Regional Manager) ==========
    const handleReassignSubmit = async () => {
        // Validation
        if (!agencyCode || !acceptInstruction) {
            alert('Please fill all mandatory fields: Agency and Instructions');
            return;
        }

        try {
            const allQuestions = [
                ...selectedForInseredQues,
                ...selectedTreatingdctrInseredQues,
                ...customForInsuredQuestionList,
                ...customForTreatingDoctorQuestionList
            ];

            const assignData = {
                investigationId: investigationId || '',
                agencyCodes: [agencyCode],
                questionCodes: allQuestions,
                acceptInstruction,
                prevInvestigatorReport,
                reassignCase: 'yes'
            };

            const response = await AcceptAssignService.assign(assignData, documentsCodes);

            if (response.statusCode === 0) {
                alert('Case reassigned successfully!');
                navigate(redirectTo || '/admin/dashboard');
            } else {
                alert(response.message || 'Failed to reassign case');
            }
        } catch (error) {
            console.error('Error reassigning case:', error);
            alert('Failed to reassign case');
        }
    };

    // ========== REASSIGN SUBMIT (Agency Spoc) ==========
    const handleReassignSubmitAgency = async () => {
        // Validation
        if (!agencyCode || !acceptInstruction) {
            alert('Please fill all mandatory fields: Field Officer and Instructions');
            return;
        }

        try {
            const allQuestions = [
                ...selectedForInseredQues,
                ...selectedTreatingdctrInseredQues,
                ...customForInsuredQuestionList,
                ...customForTreatingDoctorQuestionList
            ];

            const assignData = {
                investigationId: investigationId || '',
                agencyCodes: [agencyCode],
                questionCodes: allQuestions,
                acceptInstruction,
                prevInvestigatorReport,
                uploadedDuring: 'caseAssignment',
                reassignCase: 'yes'
            };

            const response = await AcceptAssignService.assignFO(assignData, documentsCodes);

            if (response.statusCode === 0) {
                alert('Case reassigned to Field Officer successfully!');
                navigate(redirectTo || '/admin/dashboard');
            }
        } catch (error) {
            console.error('Error reassigning to FO:', error);
            alert('Failed to reassign case');
        }
    };

    // ========== SUBMIT BUTTON (Add to JSX at end) ==========
    // Add this after all sections (after Reassign section)

    {/* Main Submit Button (not for Reassign) */ }

    {/* ========== COMPONENT COMPLETE! ========== */ }

    // ========== CONTINUE TO PART 2 FOR DATA POPULATION ==========

    // src/components/QCUpdate/ClaimTeamQcObservation.tsx
    // PART 3: QC Observations Section JSX
    // Add this to the return statement

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>

                {/* 1. QC Observations Dropdown */}
                <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 2 }}>
                            <Typography>QC Observations</Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={qcObservations}
                                    onChange={(e) => {
                                        setQcObservations(e.target.value);
                                        // Reset userCodeForRegionalManager if not "Raise query"
                                        if (e.target.value !== 'Raise query to Regional QC manager') {
                                            setUserCodeForRegionalManager(null);
                                        }
                                    }}
                                    disabled={!buttonEnable}
                                >
                                    {qcObservationsdropdownOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                {/* 2. Raise query to Regional QC manager (Central Manager only) */}
                {qcObservations === 'Raise query to Regional QC manager' && (
                    <>
                        {/* Regional Team Member Selection */}
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 2 }}>
                                    <Typography>Assigning investigation to internal team</Typography>
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={userCodeForRegionalManager || ''}
                                            onChange={(e) => setUserCodeForRegionalManager(e.target.value)}
                                            disabled={!buttonEnable}
                                        >
                                            <MenuItem value="">--- Choose Regional Team Member ---</MenuItem>
                                            {regionalTeamMembers.map((member) => (
                                                <MenuItem key={member.userCode} value={member.userCode}>
                                                    {member.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Query Textarea */}
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 2 }}>
                                    <Typography>Query</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        value={queryRM}
                                        onChange={(e) => setQueryRM(e.target.value)}
                                        disabled={!buttonEnable}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </>
                )}

                {/* 3. Response to Central QC Query (Regional Manager) */}
                {qcObservations === 'Response to Central QC Query' && (
                    <>
                        {/* Central Query (Read-only) */}
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 2 }}>
                                    <Typography>Central Query</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        value={centralQuery}
                                        disabled
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Reply to Central Query */}
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 2 }}>
                                    <Typography>Reply to Central Query</Typography>
                                </Grid>
                                <Grid size={{ xs: 8 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        value={queryCM}
                                        onChange={(e) => setQueryCM(e.target.value)}
                                        disabled={!buttonEnable}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </>
                )}

                {/* 4. Rework (Regional Manager) */}
                {qcObservations === 'Rework' && (
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 2 }}>
                                <Typography>Remarks</Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={5}
                                    value={payableRemarks}
                                    onChange={(e) => setPayableRemarks(e.target.value)}
                                    disabled={!buttonEnable}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* ========== CONTINUE TO PART 4 FOR FINAL DECISION SECTION ========== */}
                {/* Part 4 will handle "Respond to Claims Team" → Final Decision dropdown */}

                {/* 5. Respond to Claims Team → Final Decision */}
                {qcObservations === 'Respond to Claims Team' && (
                    <>
                        {/* Final Decision Dropdown */}
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 2 }}>
                                    <Typography>Final Decision</Typography>
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={finalDecision}
                                            onChange={(e) => setFinalDecision(e.target.value)}
                                            disabled={!buttonEnable}
                                        >
                                            {finalDecisionOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* A. PAYABLE */}
                        {finalDecision === 'Payable' && (
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 2 }}>
                                        <Typography>Remarks</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 4 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            value={payableRemarks}
                                            onChange={(e) => setPayableRemarks(e.target.value)}
                                            disabled={!buttonEnable}
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* B. LOSS MINIMIZATION */}
                        {finalDecision === 'Loss Minimization' && (
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 2 }}>
                                        <Typography>Remarks</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 4 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            value={lowminiremarks}
                                            onChange={(e) => setLowminiremarks(e.target.value)}
                                            disabled={!buttonEnable}
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* C. QUERIES TO BE RAISED */}
                        {finalDecision === 'Queries to be raised' && (
                            <>
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 2 }}>
                                            <Typography>Remarks</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 4 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                value={queryRemark}
                                                onChange={(e) => setQueryRemark(e.target.value)}
                                                disabled={!buttonEnable}
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 2 }}>
                                            <Typography>Query</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 4 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                value={queryTxt}
                                                onChange={(e) => setQueryTxt(e.target.value)}
                                                disabled={!buttonEnable}
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </>
                        )}

                        {/* D. SUSPECTED CASE */}
                        {finalDecision === 'Suspected Case' && (
                            <Box sx={{ mb: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 2 }}>
                                        <Typography>Findings*</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 8 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={5}
                                            value={suspectedCaseFindings}
                                            onChange={(e) => setSuspectedCaseFindings(e.target.value)}
                                            disabled={!buttonEnable}
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* E. REPUDIATE - Ground of Rejection */}
                        {finalDecision === 'Repudiate' && (
                            <>
                                {/* Main Ground of Rejection */}
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 2 }}>
                                            <Typography>Ground of rejection</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 4 }}>
                                            <Paper variant="outlined" sx={{ p: 2 }}>
                                                {groundOfRegection.map((rejection) => (
                                                    <FormControlLabel
                                                        key={rejection.groundRejectionCode}
                                                        control={
                                                            <Checkbox
                                                                checked={groundOfRejection.includes(rejection.groundRejectionCode)}
                                                                onChange={(e) => handleGroundRejectionChange(rejection.groundRejectionCode, e.target.checked)}
                                                                disabled={!buttonEnable}
                                                            />
                                                        }
                                                        label={rejection.groundRejection}
                                                    />
                                                ))}
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Fraudulent (if GR0395 selected) */}
                                {groundOfRejection.includes('GR0395') && (
                                    <Box sx={{ mb: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 2 }}>
                                                <Typography>Ground of rejection Fraud</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 4 }}>
                                                <Paper variant="outlined" sx={{ p: 2 }}>
                                                    {groundOfRegectionFraud.map((rejection) => (
                                                        <FormControlLabel
                                                            key={rejection.groundRejectionFraudulentCode}
                                                            control={
                                                                <Checkbox
                                                                    checked={groundOfRejectionFraud.includes(rejection.groundRejectionFraudulentCode)}
                                                                    onChange={(e) => handleGroundRejectionFraudChange(rejection.groundRejectionFraudulentCode, e.target.checked)}
                                                                    disabled={!buttonEnable}
                                                                />
                                                            }
                                                            label={rejection.groundRejectionFraudulent}
                                                        />
                                                    ))}
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* Exclusion (if GR0393 selected) */}
                                {groundOfRejection.includes('GR0393') && (
                                    <Box sx={{ mb: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 2 }}>
                                                <Typography>Ground of rejection Exclusion</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 4 }}>
                                                <Paper variant="outlined" sx={{ p: 2 }}>
                                                    {groundOfRejectionExclusion.map((rejection) => (
                                                        <FormControlLabel
                                                            key={rejection.groundRejectionExclusionCode}
                                                            control={
                                                                <Checkbox
                                                                    checked={groundOfRejectionExclusion2.includes(rejection.groundRejectionExclusionCode)}
                                                                    onChange={(e) => handleGroundRejectionExclusionChange(rejection.groundRejectionExclusionCode, e.target.checked)}
                                                                    disabled={!buttonEnable}
                                                                />
                                                            }
                                                            label={rejection.groundRejectionExclusion}
                                                        />
                                                    ))}
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* Misrepresentation (if GR0394 selected) */}
                                {groundOfRejection.includes('GR0394') && (
                                    <Box sx={{ mb: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 2 }}>
                                                <Typography>Ground of rejection Misrepresentation</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 4 }}>
                                                <Paper variant="outlined" sx={{ p: 2 }}>
                                                    {groundOfRejectionMisrepresentation.map((rejection) => (
                                                        <FormControlLabel
                                                            key={rejection.groundRejectionMisrepresentCode}
                                                            control={
                                                                <Checkbox
                                                                    checked={groundOfRejectionMisrepresentation2.includes(rejection.groundRejectionMisrepresentCode)}
                                                                    onChange={(e) => handleGroundRejectionMisChange(rejection.groundRejectionMisrepresentCode, e.target.checked)}
                                                                    disabled={!buttonEnable}
                                                                />
                                                            }
                                                            label={rejection.groundRejectionMisrepresent}
                                                        />
                                                    ))}
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* Repudiate Remarks */}
                                <Box sx={{ mb: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 2 }}>
                                            <Typography>Remark</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 4 }}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                value={repadiateRemarks}
                                                onChange={(e) => setRepadiateRemarks(e.target.value)}
                                                disabled={!buttonEnable}
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </>
                        )}

                        {/* ========== CONTINUE TO PART 5 FOR RECOMMENDATION TO CENTRAL QC ========== */}
                    </>
                )}

                {/* F. RECOMMENDATION TO CENTRAL QC (if Final Decision is selected) */}
                {finalDecision !== '' && finalDecision !== null && (
                    <>
                        {/* REGIONAL MANAGER VIEW - Simple Form */}
                        {(roleName === 'Regional Manager' || roleName === 'Regional QC') && (
                            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Recommendation to Central QC
                                </Typography>

                                <Grid container spacing={3}>
                                    {/* Row 1 */}
                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Policy cancellation</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.policyCancellation ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, policyCancellation: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Hospital to be blacklisted</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.hospitalBlacklisted ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, hospitalBlacklisted: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 2 */}
                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Hospital to be Depanelled (applicable only if network - system validations)</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.hospitalDepanelled ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, hospitalDepanelled: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Hospital to be caution tagged</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.hospitalCautionTagged ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, hospitalCautionTagged: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 3 */}
                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Insured to be blacklisted</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.insuredBlacklisted ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, insuredBlacklisted: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Insured to be caution tagged</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.insuredCautionTagged ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, insuredCautionTagged: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 4 */}
                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Policy to be tagged as fraud</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.policyFraud ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, policyFraud: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Treating doctor be tagged as Fraud / caution</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.treatingDoctorFraud ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, treatingDoctorFraud: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 5 */}
                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Pathologist be tagged as Fraud / caution</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.pathologistFraud ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, pathologistFraud: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Chemist to be tagged as Fraud/ caution</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.chemistFraud ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, chemistFraud: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 6 */}
                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Pathology lab to be tagged as fraud / caution</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.pathologyLabFraud ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, pathologyLabFraud: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Corporate (applicable only in group policy) to be tagged as Fraud/ caution</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.corporateTaggedFraud ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, corporateTaggedFraud: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Row 7 */}
                                    <Grid size={{ xs: 3 }}>
                                        <Typography>Legal Action to be initiated</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 3 }}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={qcOb.legalActionInitiated ?? ''}
                                                onChange={(e) => setQcOb({ ...qcOb, legalActionInitiated: e.target.value === 'true' })}
                                                disabled={!buttonEnable}
                                            >
                                                <MenuItem value="">Select</MenuItem>
                                                <MenuItem value="true">Yes</MenuItem>
                                                <MenuItem value="false">No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}

                        {/* CENTRAL MANAGER VIEW - Comparison Table */}
                        {(roleName === 'Central Manager' || roleName === 'Central QC') && (
                            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Recommendation to Central QC
                                </Typography>

                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Reg. QC update</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Central Decision</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {/* Policy cancellation */}
                                            <TableRow>
                                                <TableCell>Policy cancellation</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.regpolicyCancellation)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.policyCancellation ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, policyCancellation: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>

                                            {/* Hospital to be blacklisted */}
                                            <TableRow>
                                                <TableCell>Hospital to be blacklisted</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.reghospitalBlacklisted)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.hospitalBlacklisted ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, hospitalBlacklisted: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>

                                            {/* Hospital to be Depanelled */}
                                            <TableRow>
                                                <TableCell>Hospital to be Depanelled</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.reghospitalDepanelled)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.hospitalDepanelled ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, hospitalDepanelled: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>

                                            {/* Hospital caution tagged */}
                                            <TableRow>
                                                <TableCell>Hospital to be caution tagged</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.reghospitalCautionTagged)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.hospitalCautionTagged ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, hospitalCautionTagged: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>

                                            {/* Insured blacklisted */}
                                            <TableRow>
                                                <TableCell>Insured to be blacklisted</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.reginsuredBlacklisted)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.insuredBlacklisted ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, insuredBlacklisted: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>

                                            {/* Insured caution tagged */}
                                            <TableRow>
                                                <TableCell>Insured to be caution tagged</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.reginsuredCautionTagged)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.insuredCautionTagged ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, insuredCautionTagged: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>

                                            {/* Policy fraud */}
                                            <TableRow>
                                                <TableCell>Policy to be tagged as fraud</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.regpolicyFraud)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.policyFraud ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, policyFraud: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>

                                            {/* Treating doctor fraud */}
                                            <TableRow>
                                                <TableCell>Treating doctor be tagged as Fraud / caution</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.regtreatingDoctorFraud)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.treatingDoctorFraud ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, treatingDoctorFraud: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>

                                            {/* Pathologist fraud */}
                                            <TableRow>
                                                <TableCell>Pathologist be tagged as Fraud / caution</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.regpathologistFraud)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.pathologistFraud ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, pathologistFraud: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>

                                            {/* Chemist fraud */}
                                            <TableRow>
                                                <TableCell>Chemist to be tagged as Fraud/ caution</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.regchemistFraud)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.chemistFraud ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, chemistFraud: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>

                                            {/* Pathology lab fraud */}
                                            <TableRow>
                                                <TableCell>Pathology lab to be tagged as fraud / caution</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.regpathologyLabFraud)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.pathologyLabFraud ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, pathologyLabFraud: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>

                                            {/* Corporate fraud */}
                                            <TableRow>
                                                <TableCell>Corporate to be tagged as Fraud/ caution</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.regcorporateTaggedFraud)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.corporateTaggedFraud ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, corporateTaggedFraud: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>

                                            {/* Legal action */}
                                            <TableRow>
                                                <TableCell>Legal Action to be initiated</TableCell>
                                                <TableCell align="center">{getRealData(recdCenQC?.reglegalActionInitiated)}</TableCell>
                                                <TableCell>
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={qcOb.legalActionInitiated ?? ''}
                                                            onChange={(e) => setQcOb({ ...qcOb, legalActionInitiated: e.target.value === 'true' })}
                                                            disabled={!buttonEnable}
                                                        >
                                                            <MenuItem value="">Select</MenuItem>
                                                            <MenuItem value="true">Yes</MenuItem>
                                                            <MenuItem value="false">No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        )}
                    </>
                )}

                {/* ========== CONTINUE TO PART 6 FOR REASSIGN SECTION ========== */}

                {/* G. REASSIGN SECTION (Regional Manager) */}
                {qcObservations === 'Reassign' && (
                    <Box sx={{ mb: 3 }}>
                        {/* Share Previous Investigator Report */}
                        <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={prevInvestigatorReport === 'yes'}
                                        onChange={(e) => setPrevInvestigatorReport(e.target.checked ? 'yes' : 'no')}
                                        disabled={!buttonEnable}
                                    />
                                }
                                label="Share previous investigators report"
                            />
                        </Box>

                        <Grid container spacing={3}>
                            {/* LEFT: Agency Selection */}
                            <Grid size={{ xs: 6 }}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Assigning investigation to Agency
                                    </Typography>

                                    {/* Radio: System Suggested vs Manual */}
                                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                                        <RadioGroup
                                            value={agencyRadioValue}
                                            onChange={(e) => setAgencyRadioValue(Number(e.target.value))}
                                        >
                                            <FormControlLabel
                                                value={0}
                                                control={<Radio />}
                                                label="System Suggested Agencies"
                                                disabled={!buttonEnable}
                                            />
                                            <FormControlLabel
                                                value={1}
                                                control={<Radio />}
                                                label="Choose Agency for Investigation"
                                                disabled={!buttonEnable}
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                    {/* Manual Agency Selection */}
                                    {agencyRadioValue === 1 && (
                                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                            <Select
                                                value={agencyCode}
                                                onChange={(e) => setAgencyCode(e.target.value)}
                                                disabled={!buttonEnable}
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

                                    {/* System Suggested Agencies Table */}
                                    {agencyRadioValue === 0 && (
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>#</TableCell>
                                                        <TableCell>Agency Name</TableCell>
                                                        <TableCell>Applied Rule</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {systemSuggestedAgencyList.map((agency) => (
                                                        <TableRow key={agency.agencyCode}>
                                                            <TableCell>
                                                                <Radio
                                                                    checked={agencyCode === agency.agencyCode}
                                                                    onChange={() => setAgencyCode(agency.agencyCode)}
                                                                    disabled={!buttonEnable}
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
                                </Paper>
                            </Grid>

                            {/* RIGHT: Performance Index */}
                            <Grid size={{ xs: 6 }}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                                        Performance index
                                    </Typography>

                                    {performanceIndex && (
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Total No.cases assigned in last 2 days</TableCell>
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
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Investigation Documents */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Investigation Documents for reference<span style={{ color: 'red' }}>*</span>
                            </Typography>

                            <Grid container spacing={3}>
                                {/* Left: Shared Documents (if Regional Manager/Agency Spoc) */}
                                {(roleName === 'Regional Manager' || roleName === 'Agency Spoc') && (
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {roleName === 'Regional Manager'
                                                ? 'Documents shared during case assignment'
                                                : 'Documents shared during central & regional case assignment'}
                                        </Typography>

                                        <Grid container spacing={2}>
                                            {documentArray.map((doc, index) => (
                                                <Grid size={{ xs: 3 }} key={index}>
                                                    <Box
                                                        sx={{
                                                            cursor: 'pointer',
                                                            textAlign: 'center',
                                                            '&:hover': { opacity: 0.7 }
                                                        }}
                                                        onClick={() => window.open(`/api/documents/view?location=${doc.fileLocation}&documentId=${doc.documentID}`, '_blank')}
                                                    >
                                                        <img
                                                            src={getImageSrc(doc.fileLocation, doc.fileType)}
                                                            alt={doc.documentTitle}
                                                            style={{ width: 80, height: 80 }}
                                                        />
                                                        <Typography variant="caption" display="block">
                                                            {doc.documentTitle}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                )}

                                {/* Right: Uploaded Documents */}
                                <Grid size={{ xs: roleName === 'Central Manager' ? 12 : 6 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {roleName === 'Central Manager' && 'Documents uploaded during central case assignment *'}
                                        {roleName === 'Regional Manager' && 'Documents uploaded during regional case assignment *'}
                                        {roleName === 'Agency Spoc' && 'Documents uploaded during agency case assignment *'}
                                    </Typography>

                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        {investigationDocsView.map((doc, index) => (
                                            <Grid size={{ xs: 3 }} key={index}>
                                                <Box sx={{ position: 'relative' }}>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ position: 'absolute', right: 0, top: 0, zIndex: 1 }}
                                                        onClick={() => handleDeleteDocument(doc.documentID, doc.documentTitle, index)}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                    <Box
                                                        sx={{
                                                            cursor: 'pointer',
                                                            textAlign: 'center',
                                                            '&:hover': { opacity: 0.7 }
                                                        }}
                                                        onClick={() => window.open(`/api/documents/view?location=${doc.fileLocation}&documentId=${doc.documentID}`, '_blank')}
                                                    >
                                                        <img
                                                            src={getImageSrc(doc.fileLocation, doc.fileType)}
                                                            alt={doc.documentTitle}
                                                            style={{ width: 80, height: 80 }}
                                                        />
                                                        <Typography variant="caption" display="block">
                                                            {doc.documentTitle}
                                                        </Typography>
                                                        <Typography variant="caption" display="block" color="text.secondary">
                                                            Uploaded By {doc.createdBy}
                                                            <br />
                                                            {new Date(doc.createdOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {/* Upload New Document */}
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Document title..."
                                        value={documentTitle}
                                        onChange={(e) => setDocumentTitle(e.target.value)}
                                        sx={{ mb: 1 }}
                                        disabled={!buttonEnable}
                                    />
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.gif,.tiff"
                                            onChange={handleFileSelect}
                                            style={{ flex: 1 }}
                                            disabled={!buttonEnable}
                                        />
                                        <Button variant="contained" onClick={handleUpload} disabled={!buttonEnable}>
                                            Upload
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Questionnaire for investigation */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Questionaire for investigation<span style={{ color: 'red' }}>*</span>
                            </Typography>

                            {/* For Insured */}
                            <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                <Grid size={{ xs: 2 }}>
                                    <Typography>For Insured</Typography>
                                </Grid>
                                <Grid size={{ xs: 2 }}>
                                    <Button
                                        variant="text"
                                        onClick={() => setInsuredQuestionsModalOpen(true)}
                                        disabled={!buttonEnable}
                                    >
                                        Add from question bank
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 2 }}>
                                    <Typography>{selectedForInseredQues.length} selected</Typography>
                                </Grid>
                                <Grid size={{ xs: 2 }}>
                                    <Button
                                        variant="text"
                                        onClick={() => setCustomInsuredQuestionsModalOpen(true)}
                                        disabled={!buttonEnable}
                                    >
                                        Add custom question
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 2 }}>
                                    <Typography>
                                        {customForInsuredQuestionList.length} selected
                                        {customForInsuredQuestionList.length > 0 && (
                                            <Button
                                                size="small"
                                                onClick={() => setCustomForInsuredQuestionList([])}
                                                sx={{ ml: 1 }}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {/* For Treating Doctor */}
                            <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                                <Grid size={{ xs: 2 }}>
                                    <Typography>For Treating Doctor</Typography>
                                </Grid>
                                <Grid size={{ xs: 2 }}>
                                    <Button
                                        variant="text"
                                        onClick={() => setTreatingDoctorQuestionsModalOpen(true)}
                                        disabled={!buttonEnable}
                                    >
                                        Add from question template
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 2 }}>
                                    <Typography>{selectedTreatingdctrInseredQues.length} selected</Typography>
                                </Grid>
                                <Grid size={{ xs: 2 }}>
                                    <Button
                                        variant="text"
                                        onClick={() => setCustomTDctrQuestionsModalOpen(true)}
                                        disabled={!buttonEnable}
                                    >
                                        Add custom question
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 2 }}>
                                    <Typography>
                                        {customForTreatingDoctorQuestionList.length} selected
                                        {customForTreatingDoctorQuestionList.length > 0 && (
                                            <Button
                                                size="small"
                                                onClick={() => setCustomForTreatingDoctorQuestionList([])}
                                                sx={{ ml: 1 }}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Instructions */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Instruction (if any)
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={acceptInstruction}
                                onChange={(e) => setAcceptInstruction(e.target.value)}
                                disabled={!buttonEnable}
                                size="small"
                            />
                        </Box>

                        {/* Submit Button for Reassign */}
                        <Box sx={{ mt: 3 }}>
                            {roleName === 'Regional Manager' && (
                                <Button
                                    variant="contained"
                                    color="info"
                                    onClick={handleReassignSubmit}
                                    disabled={!buttonEnable}
                                    sx={{ minWidth: 200 }}
                                >
                                    Submit
                                </Button>
                            )}
                            {roleName === 'Agency Spoc' && (
                                <Button
                                    variant="contained"
                                    color="info"
                                    onClick={handleReassignSubmitAgency}
                                    disabled={!buttonEnable}
                                    sx={{ minWidth: 200 }}
                                >
                                    Submit
                                </Button>
                            )}
                        </Box>
                    </Box>
                )}
                {roleName !== 'Super Admin' && qcObservations !== 'Reassign' && (
                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleQcSubmit}
                            disabled={
                                !buttonEnable ||
                                (qcObservations === 'Raise query to Regional QC manager' && !userCodeForRegionalManager)
                            }
                        >
                            Submit
                        </Button>
                    </Box>
                )}

                {/* ========== MODALS ========== */}

                {/* 1. INSURED QUESTIONS MODAL */}
                <Dialog
                    open={insuredQuestionsModalOpen}
                    onClose={() => setInsuredQuestionsModalOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        For Insured Questions
                        <IconButton
                            onClick={() => setInsuredQuestionsModalOpen(false)}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {forInsuredQuestions.map((question) => (
                            <FormControlLabel
                                key={question.questionCode}
                                control={
                                    <Checkbox
                                        checked={
                                            question.alreadyAdded ||
                                            selectedForInseredQues.includes(question.questionCode)
                                        }
                                        onChange={(e) => handleInsuredQuestionChange(question.questionCode, e.target.checked)}
                                        disabled={question.alreadyAdded || maxAddexidedForInsured}
                                    />
                                }
                                label={question.questionName}
                                sx={{ display: 'block', mb: 1 }}
                            />
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setInsuredQuestionsModalOpen(false)}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* 2. TREATING DOCTOR QUESTIONS MODAL */}
                <Dialog
                    open={treatingDoctorQuestionsModalOpen}
                    onClose={() => setTreatingDoctorQuestionsModalOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Treating doctor insured Questions
                        <IconButton
                            onClick={() => setTreatingDoctorQuestionsModalOpen(false)}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {forTreatingDoctorQuestions.map((question) => (
                            <FormControlLabel
                                key={question.questionCode}
                                control={
                                    <Checkbox
                                        checked={
                                            question.alreadyAdded ||
                                            selectedTreatingdctrInseredQues.includes(question.questionCode)
                                        }
                                        onChange={(e) => handleTreatingDoctorQuestionChange(question.questionCode, e.target.checked)}
                                        disabled={question.alreadyAdded || maxAddexidedForTDctr}
                                    />
                                }
                                label={question.questionName}
                                sx={{ display: 'block', mb: 1 }}
                            />
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setTreatingDoctorQuestionsModalOpen(false)}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* 3. CUSTOM INSURED QUESTIONS MODAL */}
                <Dialog
                    open={customInsuredQuestionsModalOpen}
                    onClose={() => setCustomInsuredQuestionsModalOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Add custom question
                        <IconButton
                            onClick={() => setCustomInsuredQuestionsModalOpen(false)}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Question</TableCell>
                                        <TableCell>Add Question to Bank</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customQuestions.map((q, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={q.questionName}
                                                    onChange={(e) => {
                                                        const updated = [...customQuestions];
                                                        updated[index].questionName = e.target.value;
                                                        setCustomQuestions(updated);
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={q.questionIsCustom}
                                                    onChange={(e) => {
                                                        const updated = [...customQuestions];
                                                        updated[index].questionIsCustom = e.target.checked;
                                                        setCustomQuestions(updated);
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    onClick={handleAddCustomQuestion}
                                                    disabled={maxAddexidedForInsured}
                                                >
                                                    +Add
                                                </Button>
                                                {customQuestions.length > 1 && (
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleDeleteCustomQuestion(index)}
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSubmitCustomInsuredQuestions} variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* 4. CUSTOM TREATING DOCTOR QUESTIONS MODAL */}
                <Dialog
                    open={customTDctrQuestionsModalOpen}
                    onClose={() => setCustomTDctrQuestionsModalOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Add custom question
                        <IconButton
                            onClick={() => setCustomTDctrQuestionsModalOpen(false)}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Question</TableCell>
                                        <TableCell>Add Question to Bank</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customQuestionsTDctr.map((q, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={q.questionName}
                                                    onChange={(e) => {
                                                        const updated = [...customQuestionsTDctr];
                                                        updated[index].questionName = e.target.value;
                                                        setCustomQuestionsTDctr(updated);
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={q.questionIsCustom}
                                                    onChange={(e) => {
                                                        const updated = [...customQuestionsTDctr];
                                                        updated[index].questionIsCustom = e.target.checked;
                                                        setCustomQuestionsTDctr(updated);
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    onClick={handleAddCustomQuestionTDctr}
                                                    disabled={maxAddexidedForTDctr}
                                                >
                                                    +Add
                                                </Button>
                                                {customQuestionsTDctr.length > 1 && (
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleDeleteCustomQuestionTDctr(index)}
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSubmitCustomTDctrQuestions} variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Paper>
    );

    // ========== HELPER FUNCTIONS FOR PART 3 ==========

    // Already included in onChange handler above:
    // When qcObservations changes, reset userCodeForRegionalManager if needed
};

export default ClaimTeamQcObservation;