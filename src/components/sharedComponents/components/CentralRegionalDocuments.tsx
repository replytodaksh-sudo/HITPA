// import React, { useState, useEffect, useRef } from 'react';
// import {
//     Box,
//     Button,
//     Card,
//     CardContent,
//     Grid,
//     TextField,
//     Typography,
//     IconButton,
//     CircularProgress,
//     Alert,
// } from '@mui/material';
// import {
//     Delete as DeleteIcon,
//     CloudUpload as UploadIcon,
//     Visibility as ViewIcon,
// } from '@mui/icons-material';
// import { useParams } from 'react-router-dom';
// import { DocumentsService } from '../../../services/document.service';
// import { caseUpdateService } from '../../../services/caseupdate.service';
// import { apiUrls } from '../../../constants/apiConstants';

// interface CentralRegionalDocumentsProps {
//     claimType?: 'cashless' | 'reim';
// }

// interface Document {
//     documentID: string;
//     documentTitle: string;
//     fileLocation: string;
//     fileType: string;
//     createdBy?: string;
//     createdOn?: string;
// }

// const CentralRegionalDocuments: React.FC<CentralRegionalDocumentsProps> = ({
//     claimType = 'cashless',
// }) => {
//     const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const roleName = sessionStorage.getItem('roleName') || '';
//     const formIsEditable = Boolean(sessionStorage.getItem('formEditable'));

//     // State
//     const [investigationId, setInvestigationId] = useState('');
//     const [documentArray, setDocumentArray] = useState<Document[]>([]);
//     const [investigationDocsView, setInvestigationDocsView] = useState<Document[]>([]);
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [documentTitle, setDocumentTitle] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [uploading, setUploading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

//     // Extract clean investigation ID
//     useEffect(() => {
//         if (paramInvestigationId) {
//             const cleanId = paramInvestigationId.split('-')[0].trim();
//             setInvestigationId(cleanId);
//         }
//     }, [paramInvestigationId]);

//     // Fetch documents when investigationId is available
//     useEffect(() => {
//         if (investigationId) {
//             getInvestigationDocs();
//             getSavedFormData();
//         }
//     }, [investigationId]);

//     // Fetch all documents from Central, Regional, and Agency
//     const getInvestigationDocs = async () => {
//         setLoading(true);
//         try {
//             let allDocs: Document[] = [];

//             // Fetch documents based on role
//             if (
//                 roleName === 'Regional Manager' ||
//                 roleName === 'Agency Spoc' ||
//                 roleName === 'Central Manager' ||
//                 roleName === 'Field Officer'
//             ) {
//                 // Fetch Central documents
//                 const centralResponse: any = await DocumentsService.viewInvestigationDocsView(
//                     'caseAssignmentCentral',
//                     investigationId
//                 );
//                 if (centralResponse.statusCode === 0) {
//                     allDocs = [...centralResponse.payload];
//                 }

//                 // Fetch Regional documents
//                 const regionalResponse: any = await DocumentsService.viewInvestigationDocsView(
//                     'caseAssignmentRegional',
//                     investigationId
//                 );
//                 if (regionalResponse.statusCode === 0) {
//                     allDocs = [...allDocs, ...regionalResponse.payload];
//                 }

//                 // Fetch Agency documents
//                 const agencyResponse: any = await DocumentsService.viewInvestigationDocsView(
//                     'caseAssignmentAgency',
//                     investigationId
//                 );
//                 if (agencyResponse.statusCode === 0) {
//                     allDocs = [...allDocs, ...agencyResponse.payload];
//                 }
//             }

//             setDocumentArray(allDocs);

//             // Fetch investigation documents
//             const invDocsResponse: any = await DocumentsService.viewInvestigationDocsView(
//                 'investigation',
//                 investigationId
//             );
//             if (invDocsResponse.statusCode === 0) {
//                 setInvestigationDocsView(invDocsResponse.payload);
//             }
//         } catch (err) {
//             console.error('Failed to fetch documents:', err);
//             setError('Failed to load documents');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Get saved form data
//     const getSavedFormData = async () => {
//         try {
//             const response =
//                 claimType === 'cashless'
//                     ? await caseUpdateService.caseUpdatePreviousData(investigationId)
//                     : await caseUpdateService.caseUpdatePreviousDataReim(investigationId);

//             // Data loaded successfully (can use response.data.payload if needed)
//         } catch (err) {
//             console.error('Failed to fetch previous data:', err);
//         }
//     };

//     // Get icon/image source based on file type
//     const getImageSrc = async (fileLocation: string, fileType: string, doc: any) => {

//         const token = sessionStorage.getItem("token");

//         const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
//         const url = `${API_BASE_URL}${apiUrls.viewDocument}?docLocation=${encodeURIComponent(
//             doc.fileLocation
//         )}&documentId=${doc.documentID}`;

//         const response = await fetch(url, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         if (!response.ok) {
//             throw new Error("Failed to load document");
//         }
//         // console.log('response', response);
//         // const blob = await response.blob();
//         // return URL.createObjectURL(blob);
//         return response.url;

//         // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
//         // const VIEW_DOCUMENT_URL = `${API_BASE_URL}/view-document?file=`;

//         // if (fileType === 'image/jpeg' || fileType === 'image/png') {
//         //     return VIEW_DOCUMENT_URL + fileLocation;
//         // } else if (fileType === 'application/pdf') {
//         //     return '/assets/images/pdf-icon.png';
//         // } else if (fileType === 'application/x-zip-compressed') {
//         //     return '/assets/images/zip-file.png';
//         // } else if (
//         //     fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
//         //     fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//         // ) {
//         //     return '/assets/images/google-docs.png';
//         // } else {
//         //     return '/assets/images/google-docs.png';
//         // }
//     };

//     // Load image URLs for documents
//     useEffect(() => {
//         const loadImages = async () => {
//             const urls: Record<string, string> = {};
//             for (const doc of documentArray) {
//                 try {
//                     const url = await getImageSrc(doc.fileLocation, doc.fileType, doc);
//                     urls[doc.documentID] = url;
//                 } catch (err) {
//                     console.error(`Failed to load image for ${doc.documentID}:`, err);
//                 }
//             }
//             setImageUrls(urls);
//         };
//         if (documentArray.length > 0) {
//             loadImages();
//         }
//     }, [documentArray]);

//     // Load image URLs for investigation documents
//     useEffect(() => {
//         const loadImages = async () => {
//             const urls: Record<string, string> = {};
//             for (const doc of investigationDocsView) {
//                 try {
//                     const url = await getImageSrc(doc.fileLocation, doc.fileType, doc);
//                     urls[doc.documentID] = url;
//                 } catch (err) {
//                     console.error(`Failed to load image for ${doc.documentID}:`, err);
//                 }
//             }
//             setImageUrls((prev) => ({ ...prev, ...urls }));
//         };
//         if (investigationDocsView.length > 0) {
//             loadImages();
//         }
//     }, [investigationDocsView]);

//     // Open document in new tab
//     const openDocument = (fileLocation: string, documentID: string) => {
//         const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
//         const url = `${API_BASE_URL}/view-document?file=${fileLocation}&documentId=${documentID}`;
//         window.open(url, '_blank');
//     };

//     // Handle file selection
//     const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (!file) return;
//         setDocumentTitle(file.name)
//         const validTypes = [
//             'application/pdf',
//             'image/jpeg',
//             'image/gif',
//             'image/tiff',
//             'image/png',
//         ];

//         if (validTypes.includes(file.type)) {
//             setSelectedFile(file);
//             setError('');
//         } else {
//             setError('Invalid file format. Only PDF, JPEG, GIF, PNG and TIFF file formats are supported.');
//             setSelectedFile(null);
//             if (fileInputRef.current) {
//                 fileInputRef.current.value = '';
//             }
//         }
//     };

//     // Upload document
//     const handleUpload = async () => {
//         if (!documentTitle.trim()) {
//             setError('Please enter a document title');
//             return;
//         }

//         if (!selectedFile) {
//             setError('Please select a file to upload');
//             return;
//         }

//         // Check if document title already exists
//         const existingDoc = investigationDocsView.find(
//             (doc) => doc.documentTitle === documentTitle
//         );
//         if (existingDoc) {
//             setError('A document with this title already exists');
//             return;
//         }

//         setUploading(true);
//         setError('');
//         setSuccess('');

//         try {
//             const response: any = await DocumentsService.uploadInvestigationDocs(
//                 'investigation',
//                 investigationId,
//                 selectedFile,
//                 false,
//                 documentTitle
//             );

//             if (response.statusCode === 0) {
//                 setSuccess('Document uploaded successfully!');

//                 // Reset form
//                 setDocumentTitle('');
//                 setSelectedFile(null);
//                 if (fileInputRef.current) {
//                     fileInputRef.current.value = '';
//                 }

//                 // Refresh documents
//                 await getInvestigationDocs();
//             } else {
//                 setError(response.message || 'Upload failed');
//             }
//         } catch (err: any) {
//             setError(err.message || 'Failed to upload document');
//         } finally {
//             setUploading(false);
//         }
//     };

//     // Delete document
//     const handleDeleteDocument = async (documentId: string) => {
//         if (!window.confirm('Are you sure you want to delete this document?')) {
//             return;
//         }

//         try {
//             const response: any = await DocumentsService.deleteDocument(documentId);
//             if (response.statusCode === 0) {
//                 setSuccess('Document deleted successfully');
//                 await getInvestigationDocs();
//             } else {
//                 setError('Failed to delete document');
//             }
//         } catch (err) {
//             setError('Failed to delete document');
//         }
//     };

//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//                 <CircularProgress sx={{ color: '#2E5A96' }} />
//             </Box>
//         );
//     }

//     return (
//         <Box sx={{ p: 3 }}>
//             {error && (
//                 <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
//                     {error}
//                 </Alert>
//             )}

//             {success && (
//                 <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
//                     {success}
//                 </Alert>
//             )}

//             <Grid container spacing={3}>
//                 {/* Left Section - Documents shared during case assignment */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Card elevation={2}>
//                         <CardContent>
//                             <Typography
//                                 variant="h6"
//                                 gutterBottom
//                                 sx={{ color: '#6F62C2', fontWeight: 600, mb: 3 }}
//                             >
//                                 Documents shared during case assignment
//                             </Typography>

//                             <Grid container spacing={2}>
//                                 {documentArray.length === 0 && (
//                                     <Grid size={{ xs: 12 }}>
//                                         <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
//                                             No documents available
//                                         </Typography>
//                                     </Grid>
//                                 )}

//                                 {documentArray.map((doc) => (
//                                     <Grid size={{ xs: 6, sm: 4, md: 3 }} key={doc.documentID}>
//                                         <Box
//                                             sx={{
//                                                 textAlign: 'center',
//                                                 cursor: 'pointer',
//                                                 p: 1,
//                                                 borderRadius: 1,
//                                                 '&:hover': {
//                                                     bgcolor: '#f5f5f5',
//                                                 },
//                                             }}
//                                             onClick={() => openDocument(doc.fileLocation, doc.documentID)}
//                                         >
//                                             <Box
//                                                 sx={{
//                                                     width: '100%',
//                                                     height: 80,
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                     mb: 1,
//                                                     bgcolor: '#fafafa',
//                                                     borderRadius: 1,
//                                                 }}
//                                             >
//                                                 <img
//                                                     src={imageUrls[doc.documentID] || ''}
//                                                     alt={doc.documentTitle}
//                                                     style={{
//                                                         maxWidth: '100%',
//                                                         maxHeight: '100%',
//                                                         objectFit: 'contain',
//                                                     }}
//                                                 />
//                                             </Box>
//                                             <Typography
//                                                 variant="caption"
//                                                 sx={{
//                                                     display: 'block',
//                                                     wordBreak: 'break-word',
//                                                     fontSize: '0.75rem',
//                                                 }}
//                                             >
//                                                 {doc.documentTitle}
//                                             </Typography>
//                                         </Box>
//                                     </Grid>
//                                 ))}
//                             </Grid>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 {/* Right Section - Documents uploaded during Investigation */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Card elevation={2}>
//                         <CardContent>
//                             <Typography
//                                 variant="h6"
//                                 gutterBottom
//                                 sx={{ color: '#6F62C2', fontWeight: 600, mb: 3 }}
//                             >
//                                 Documents uploaded during Investigation
//                             </Typography>

//                             <Grid container spacing={2} sx={{ mb: 3 }}>
//                                 {investigationDocsView.length === 0 && (
//                                     <Grid size={{ xs: 12 }}>
//                                         <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
//                                             No documents uploaded yet
//                                         </Typography>
//                                     </Grid>
//                                 )}

//                                 {investigationDocsView.map((doc) => (
//                                     <Grid size={{ xs: 12, sm: 4, md: 4 }} key={doc.documentID}>
//                                         <Box
//                                             sx={{
//                                                 textAlign: 'center',
//                                                 p: 1,
//                                                 borderRadius: 1,
//                                                 position: 'relative',
//                                                 border: '1px solid #e0e0e0',
//                                                 '&:hover': {
//                                                     bgcolor: '#f5f5f5',
//                                                 },
//                                             }}
//                                         >
//                                             {/* Delete button */}
//                                             <IconButton
//                                                 size="small"
//                                                 sx={{
//                                                     position: 'absolute',
//                                                     top: 4,
//                                                     right: 4,
//                                                     bgcolor: 'white',
//                                                     '&:hover': { bgcolor: '#ffebee' },
//                                                 }}
//                                                 onClick={() => handleDeleteDocument(doc.documentID)}
//                                             >
//                                                 <DeleteIcon fontSize="small" color="error" />
//                                             </IconButton>

//                                             {/* Document thumbnail */}
//                                             <Box
//                                                 sx={{
//                                                     width: '100%',
//                                                     height: 80,
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                     mb: 1,
//                                                     bgcolor: '#fafafa',
//                                                     borderRadius: 1,
//                                                     cursor: 'pointer',
//                                                 }}
//                                                 onClick={() => openDocument(doc.fileLocation, doc.documentID)}
//                                             >
//                                                 <img
//                                                     src={imageUrls[doc.documentID] || ''}
//                                                     alt={doc.documentTitle}
//                                                     style={{
//                                                         maxWidth: '100%',
//                                                         maxHeight: '100%',
//                                                         objectFit: 'contain',
//                                                     }}
//                                                 />
//                                             </Box>

//                                             {/* Document info */}
//                                             <Typography
//                                                 variant="caption"
//                                                 sx={{
//                                                     display: 'block',
//                                                     wordBreak: 'break-word',
//                                                     fontSize: '0.75rem',
//                                                     fontWeight: 600,
//                                                     mb: 0.5,
//                                                 }}
//                                             >
//                                                 {doc.documentTitle}
//                                             </Typography>

//                                             {doc.createdBy && (
//                                                 <Typography
//                                                     variant="caption"
//                                                     sx={{
//                                                         display: 'block',
//                                                         color: 'text.secondary',
//                                                         fontSize: '0.65rem',
//                                                     }}
//                                                 >
//                                                     Uploaded by {doc.createdBy}
//                                                     {doc.createdOn && (
//                                                         <>
//                                                             <br />
//                                                             {new Date(doc.createdOn).toLocaleDateString('en-GB', {
//                                                                 day: 'numeric',
//                                                                 month: 'short',
//                                                                 year: 'numeric',
//                                                             })}
//                                                         </>
//                                                     )}
//                                                 </Typography>
//                                             )}
//                                         </Box>
//                                     </Grid>
//                                 ))}
//                             </Grid>

//                             {/* Upload section */}
//                             <Box>
//                                 <TextField
//                                     fullWidth
//                                     size="small"
//                                     label="Document Title"
//                                     value={documentTitle}
//                                     onChange={(e) => setDocumentTitle(e.target.value)}
//                                     placeholder="Enter document title..."
//                                     sx={{ mb: 2 }}
//                                 />

//                                 <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//                                     <Button
//                                         variant="outlined"
//                                         component="label"
//                                         fullWidth
//                                         startIcon={<UploadIcon />}
//                                     >
//                                         Choose File
//                                         <input
//                                             ref={fileInputRef}
//                                             type="file"
//                                             hidden
//                                             accept=".pdf,.jpg,.jpeg,.png,.gif,.tiff"
//                                             onChange={handleFileSelect}
//                                         />
//                                     </Button>

//                                     <Button
//                                         variant="contained"
//                                         onClick={handleUpload}
//                                         disabled={uploading || !selectedFile || !documentTitle.trim()}
//                                         sx={{
//                                             minWidth: 120,
//                                             background: 'linear-gradient(45deg, #6F62C2 30%, #9C89E3 90%)',
//                                             color: "#fff !important",
//                                         }}
//                                     >
//                                         {uploading ? <CircularProgress size={24} sx={{ color: '#2E5A96' }} /> : 'Upload'}
//                                     </Button>
//                                 </Box>

//                                 {selectedFile && (
//                                     <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
//                                         Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
//                                     </Typography>
//                                 )}
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default CentralRegionalDocuments;




import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    IconButton,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { useParams, useSearchParams } from 'react-router-dom';
import { DocumentsService } from '../../../services/document.service';
import { caseUpdateService } from '../../../services/caseupdate.service';
import { apiUrls } from '../../../constants/apiConstants';

interface DocumentsProps {
    claimType?: 'cashless' | 'reim';
    showCaseAssignmentDocs?: boolean;
    documentsCodes?: string[];
    setDocumentsCodes?: (codes: string[]) => void;
    onDocsUpdate?: () => void;
    onDocumentsUploaded?: (docs: any[]) => void;
    documentArray?: any // true for case assignment, false for investigation only
}

interface Document {
    documentID: string;
    documentTitle: string;
    fileLocation: string;
    fileType: string;
    createdBy?: string;
    createdOn?: string;
}

const UnifiedDocumentComponent: React.FC<DocumentsProps> = ({
    claimType = 'cashless',
    showCaseAssignmentDocs = true,
    documentsCodes,
    setDocumentsCodes,
    onDocsUpdate,
    onDocumentsUploaded,
    documentArray
}) => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const roleName = sessionStorage.getItem('roleName') || '';
    const token = sessionStorage.getItem('token') || '';

    // State Management
    const [investigationId, setInvestigationId] = useState('');
    const [actualClaimType, setActualClaimType] = useState<'cashless' | 'reim'>(claimType);
    const [caseAssignmentDocs, setCaseAssignmentDocs] = useState<Document[]>([]);
    const [investigationDocs, setInvestigationDocs] = useState<Document[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documentTitle, setDocumentTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

    // Extract investigation ID and claim type
    useEffect(() => {
        if (paramInvestigationId) {
            const cleanId = paramInvestigationId.split('-')[0].trim();
            setInvestigationId(cleanId);
        }

        const urlClaimType = searchParams.get('claimsType') as 'cashless' | 'reim';
        if (urlClaimType) {
            setActualClaimType(urlClaimType);
        }
    }, [paramInvestigationId, searchParams]);

    // Fetch documents when investigationId is available
    useEffect(() => {
        if (investigationId) {
            fetchAllDocuments();
            fetchSavedFormData();
        }
    }, [investigationId, actualClaimType]);

    /**
     * Fetch all documents based on role and component configuration
     */
    const fetchAllDocuments = async () => {
        setLoading(true);
        try {
            let allCaseAssignmentDocs: Document[] = [];

            // Fetch case assignment documents if enabled
            if (showCaseAssignmentDocs) {
                // Always fetch Central documents
                const centralResponse: any = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentCentral',
                    investigationId
                );
                if (centralResponse?.statusCode === 0 && centralResponse?.payload) {
                    allCaseAssignmentDocs = [...centralResponse.payload];
                }

                // Fetch Regional documents
                const regionalResponse: any = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentRegional',
                    investigationId
                );
                if (regionalResponse?.statusCode === 0 && regionalResponse?.payload) {
                    allCaseAssignmentDocs = [...allCaseAssignmentDocs, ...regionalResponse.payload];
                }

                // Fetch Agency documents (for applicable roles)
                if (
                    roleName === 'Agency Spoc' ||
                    roleName === 'Central Manager' ||
                    roleName === 'Field Officer'
                ) {
                    const agencyResponse: any = await DocumentsService.viewInvestigationDocsView(
                        'caseAssignmentAgency',
                        investigationId
                    );
                    if (agencyResponse?.statusCode === 0 && agencyResponse?.payload) {
                        allCaseAssignmentDocs = [...allCaseAssignmentDocs, ...agencyResponse.payload];
                    }
                }
            }

            setCaseAssignmentDocs(allCaseAssignmentDocs);

            // Fetch investigation documents
            const invDocsResponse: any = await DocumentsService.viewInvestigationDocsView(
                'investigation',
                investigationId
            );
            if (invDocsResponse?.statusCode === 0 && invDocsResponse?.payload) {
                setInvestigationDocs(invDocsResponse.payload);
            }
        } catch (err) {
            console.error('Failed to fetch documents:', err);
            setError('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch saved form data
     */
    const fetchSavedFormData = async () => {
        try {
            const response =
                actualClaimType === 'cashless'
                    ? await caseUpdateService.caseUpdatePreviousData(investigationId)
                    : await caseUpdateService.caseUpdatePreviousDataReim(investigationId);
            // Data loaded successfully
        } catch (err) {
            console.error('Failed to fetch previous data:', err);
        }
    };

    /**
     * Get image source with proper authentication and caching
     */
    const getImageSrc = async (fileLocation: string, fileType: string, doc: Document) => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
            const url = `${API_BASE_URL}${apiUrls.viewDocument}?docLocation=${encodeURIComponent(
                fileLocation
            )}&documentId=${doc.documentID}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to load document');
            }

            return response.url;
        } catch (err) {
            console.error(`Failed to load image for ${doc.documentID}:`, err);
            // Return placeholder icon based on file type
            return getPlaceholderIcon(fileType);
        }
    };

    /**
     * Get placeholder icon based on file type
     */
    const getPlaceholderIcon = (fileType: string): string => {
        if (fileType === 'application/pdf') {
            return '/assets/images/pdf-icon.png';
        } else if (fileType === 'application/x-zip-compressed') {
            return '/assets/images/zip-file.png';
        } else if (
            fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            return '/assets/images/google-docs.png';
        }
        return '/assets/images/google-docs.png';
    };

    /**
     * Pre-load all document images with caching
     */
    useEffect(() => {
        const loadImages = async () => {
            const urls: Record<string, string> = {};
            const allDocs = [...caseAssignmentDocs, ...investigationDocs];

            for (const doc of allDocs) {
                try {
                    const url = await getImageSrc(doc.fileLocation, doc.fileType, doc);
                    urls[doc.documentID] = url;
                } catch (err) {
                    console.error(`Failed to load image for ${doc.documentID}:`, err);
                    urls[doc.documentID] = getPlaceholderIcon(doc.fileType);
                }
            }

            setImageUrls(urls);
        };

        if (caseAssignmentDocs.length > 0 || investigationDocs.length > 0) {
            loadImages();
        }
    }, [caseAssignmentDocs, investigationDocs, token]);

    /**
     * Open document in new tab
     */
    const openDocument = (fileLocation: string, documentID: string) => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const url = `${API_BASE_URL}/view-document?file=${fileLocation}&documentId=${documentID}`;
        window.open(url, '_blank');
    };

    /**
     * Handle file selection
     */
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setDocumentTitle(file.name);

        const validTypes = [
            'application/pdf',
            'image/jpeg',
            'image/gif',
            'image/tiff',
            'image/png',
        ];

        if (validTypes.includes(file.type)) {
            setSelectedFile(file);
            setError('');
        } else {
            setError('Invalid file format. Only PDF, JPEG, GIF, PNG and TIFF are supported.');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    /**
     * Handle document upload
     */
    const handleUpload = async () => {
        if (!documentTitle.trim()) {
            setError('Please enter a document title');
            return;
        }

        if (!selectedFile) {
            setError('Please select a file to upload');
            return;
        }

        // Check if document title already exists
        const existingDoc = investigationDocs.find(
            (doc) => doc.documentTitle === documentTitle
        );
        if (existingDoc) {
            setError('A document with this title already exists');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        try {
            const response: any = await DocumentsService.uploadInvestigationDocs(
                'investigation',
                investigationId,
                selectedFile,
                false,
                documentTitle
            );

            if (response?.statusCode === 0) {
                setSuccess('Document uploaded successfully!');
                const uploadedDoc = response.payload[0];
                // Reset form
                setDocumentTitle('');
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                if (setDocumentsCodes && documentsCodes) {
                    setDocumentsCodes([...documentsCodes, uploadedDoc.documentID]);
                }
                // Refresh documents
                await fetchAllDocuments();
            } else {
                setError(response?.message || 'Upload failed');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    /**
     * Handle document deletion
     */
    const handleDeleteDocument = async (documentId: string) => {
        if (!window.confirm('Are you sure you want to delete this document?')) {
            return;
        }

        try {
            const response: any = await DocumentsService.deleteDocument(documentId);
            if (response?.statusCode === 0) {
                setSuccess('Document deleted successfully');
                await fetchAllDocuments();
            } else {
                setError('Failed to delete document');
            }
        } catch (err) {
            setError('Failed to delete document');
        }
    };

    /**
     * Render document grid
     */
    const renderDocumentGrid = (documents: Document[], isInvestigation: boolean = false) => (
        <Grid container spacing={2}>
            {documents.length === 0 && (
                <Grid size={{ xs: 12 }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: 'center', py: 4 }}
                    >
                        No documents {isInvestigation ? 'uploaded yet' : 'available'}
                    </Typography>
                </Grid>
            )}

            {documents.map((doc) => (
                <Grid size={{ xs: 6, sm: 4, md: isInvestigation ? 3 : 3 }} key={doc.documentID}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            p: 1,
                            borderRadius: 1,
                            position: 'relative',
                            border: isInvestigation ? '1px solid #e0e0e0' : 'none',
                            '&:hover': {
                                bgcolor: '#f5f5f5',
                            },
                        }}
                    >
                        {/* Delete button for investigation docs */}
                        {isInvestigation && (
                            <IconButton
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    bgcolor: 'white',
                                    '&:hover': { bgcolor: '#ffebee' },
                                }}
                                onClick={() => handleDeleteDocument(doc.documentID)}
                            >
                                <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                        )}

                        {/* Document thumbnail */}
                        <Box
                            sx={{
                                width: '100%',
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1,
                                bgcolor: '#fafafa',
                                borderRadius: 1,
                                cursor: 'pointer',
                            }}
                            onClick={() => openDocument(doc.fileLocation, doc.documentID)}
                        >
                            <img
                                src={imageUrls[doc.documentID] || ''}
                                alt={doc.documentTitle}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                }}
                            />
                        </Box>

                        {/* Document info */}
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                wordBreak: 'break-word',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                mb: 0.5,
                            }}
                        >
                            {doc.documentTitle}
                        </Typography>

                        {isInvestigation && doc.createdBy && (
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    color: 'text.secondary',
                                    fontSize: '0.65rem',
                                }}
                            >
                                {doc.createdBy}
                                {doc.createdOn && (
                                    <>
                                        <br />
                                        {new Date(doc.createdOn).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </>
                                )}
                            </Typography>
                        )}
                    </Box>
                </Grid>
            ))}
        </Grid>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#2E5A96' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Case Assignment Documents */}
                {showCaseAssignmentDocs && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ color: '#6F62C2', fontWeight: 600, mb: 3 }}
                                >
                                    Documents shared during case assignment
                                </Typography>

                                {renderDocumentGrid(caseAssignmentDocs, false)}
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Investigation Documents */}
                <Grid size={{ xs: 12, md: showCaseAssignmentDocs ? 6 : 12 }}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ color: '#6F62C2', fontWeight: 600, mb: 3 }}
                            >
                                Documents uploaded during Investigation
                            </Typography>

                            {renderDocumentGrid(investigationDocs, true)}

                            {/* Upload Section */}
                            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 600, mb: 2 }}
                                >
                                    Upload New Document
                                </Typography>

                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Document Title"
                                    value={documentTitle}
                                    onChange={(e) => setDocumentTitle(e.target.value)}
                                    placeholder="Enter document title..."
                                    sx={{ mb: 2 }}
                                />

                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        startIcon={<UploadIcon />}
                                    >
                                        Choose File
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            hidden
                                            accept=".pdf,.jpg,.jpeg,.png,.gif,.tiff"
                                            onChange={handleFileSelect}
                                        />
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={handleUpload}
                                        disabled={uploading || !selectedFile || !documentTitle.trim()}
                                        sx={{
                                            minWidth: 120,
                                            background: 'linear-gradient(45deg, #6F62C2 30%, #9C89E3 90%)',
                                            color: '#fff !important',
                                        }}
                                    >
                                        {uploading ? (
                                            <CircularProgress size={24} sx={{ color: 'white' }} />
                                        ) : (
                                            'Upload'
                                        )}
                                    </Button>
                                </Box>

                                {selectedFile && (
                                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UnifiedDocumentComponent;