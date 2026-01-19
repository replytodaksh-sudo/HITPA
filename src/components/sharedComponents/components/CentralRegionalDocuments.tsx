// // UnifiedDocumentComponent.tsx - Refactored and Optimized
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
    Modal,
} from '@mui/material';
import {
    Close,
    Delete as DeleteIcon,
    CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { useParams, useSearchParams } from 'react-router-dom';
import { DocumentsService } from '../../../services/document.service';
import { caseUpdateService } from '../../../services/caseupdate.service';
import { apiUrls } from '../../../constants/apiConstants';

// ============================================
// TYPES & INTERFACES
// ============================================

interface Document {
    documentID: string;
    documentTitle: string;
    fileLocation: string;
    fileType: string;
    createdBy?: string;
    createdOn?: string;
}

interface DocumentsProps {
    claimType?: 'cashless' | 'reim';
    showCaseAssignmentDocs?: boolean;
    documentsCodes?: string[];
    setDocumentsCodes?: (codes: string[]) => void;
    onDocsUpdate?: () => void;
    onDocumentsUploaded?: (docs: Document[]) => void;
}

interface AlertState {
    type: 'success' | 'error';
    message: string;
}

// ============================================
// CONSTANTS
// ============================================

const VALID_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/gif',
    'image/tiff',
    'image/png',
];

const UPLOAD_DURING_MAP: Record<string, string> = {
    'Regional Manager': 'caseAssignmentRegional',
    'Agency Spoc': 'caseAssignmentAgency',
    'Central Manager': 'caseAssignmentCentral',
};

const ROLES_WITH_AGENCY_DOCS = ['Agency Spoc', 'Central Manager', 'Field Officer'];

// ============================================
// DOCUMENT PREVIEW COMPONENT (Memoized)
// ============================================

const DocumentPreview = React.memo<{ document: Document }>(({ document }) => {
    const token = sessionStorage.getItem('token');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let objectUrl: string;
        let isMounted = true;

        const fetchFile = async () => {
            try {
                const completeURL = `${import.meta.env.VITE_API_BASE_URL}${apiUrls.viewDocument
                    }${encodeURIComponent(document.fileLocation)}&documentId=${document.documentID}`;

                const res = await fetch(completeURL, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error(`HTTP error ${res.status}`);

                const blob = await res.blob();

                // Fix MIME type if needed
                const fixedBlob = document.fileType
                    ? new Blob([blob], { type: document.fileType })
                    : blob;

                objectUrl = URL.createObjectURL(fixedBlob);

                if (isMounted) {
                    setPreviewUrl(objectUrl);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Preview fetch failed:', err);
                if (isMounted) setLoading(false);
            }
        };

        fetchFile();

        return () => {
            isMounted = false;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [document.fileLocation, document.documentID, document.fileType, token]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (!previewUrl) return null;

    // Image preview
    if (document.fileType?.startsWith('image/')) {
        return (
            <img
                src={previewUrl}
                alt={document.documentTitle}
                style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    display: 'block',
                }}
                onError={() => setPreviewUrl(null)}
            />
        );
    }

    // PDF preview
    if (document.fileType === 'application/pdf') {
        return (
            <iframe
                src={previewUrl}
                title={document.documentTitle}
                style={{
                    width: '100%',
                    height: '500px',
                    border: 'none',
                }}
            />
        );
    }

    return <Typography variant="caption">Preview not available</Typography>;
});

DocumentPreview.displayName = 'DocumentPreview';

// ============================================
// DOCUMENT CARD COMPONENT (Memoized)
// ============================================

interface DocumentCardProps {
    document: Document;
    isInvestigation: boolean;
    onDelete?: (id: string) => void;
    onPreview?: (doc: Document) => void;
}

const DocumentCard = React.memo<DocumentCardProps>(
    ({ document, isInvestigation, onDelete, onPreview }) => {
        return (
            <Box
                sx={{
                    textAlign: 'center',
                    p: 1.5,
                    borderRadius: 1,
                    position: 'relative',
                    border: isInvestigation ? '1px solid #e0e0e0' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                        bgcolor: '#f5f5f5',
                        transform: 'translateY(-2px)',
                        boxShadow: isInvestigation ? 2 : 0,
                    },
                }}
                onClick={() => onPreview?.(document)}
            >
                {/* Delete button */}
                {isInvestigation && onDelete && (
                    <IconButton
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'white',
                            zIndex: 1,
                            '&:hover': { bgcolor: '#ffebee' },
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(document.documentID);
                        }}
                    >
                        <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                )}

                {/* Thumbnail */}
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
                        overflow: 'hidden',
                    }}
                >
                    <DocumentPreview document={document} />
                </Box>

                {/* Title */}
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
                    {document.documentTitle}
                </Typography>

                {/* Metadata */}
                {isInvestigation && document.createdBy && (
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            color: 'text.secondary',
                            fontSize: '0.65rem',
                        }}
                    >
                        {document.createdBy}
                        {document.createdOn && (
                            <>
                                <br />
                                {new Date(document.createdOn).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </>
                        )}
                    </Typography>
                )}
            </Box>
        );
    }
);

DocumentCard.displayName = 'DocumentCard';

// ============================================
// MAIN COMPONENT
// ============================================

const UnifiedDocumentComponent: React.FC<DocumentsProps> = ({
    claimType = 'cashless',
    showCaseAssignmentDocs = true,
    documentsCodes = [],
    setDocumentsCodes,
    onDocsUpdate,
    onDocumentsUploaded,
}) => {
    const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
    const [searchParams] = useSearchParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Session data
    const roleName = useMemo(() => sessionStorage.getItem('roleName') || '', []);

    // State
    const [investigationId, setInvestigationId] = useState('');
    const [actualClaimType, setActualClaimType] = useState<'cashless' | 'reim'>(claimType);
    const [caseAssignmentDocs, setCaseAssignmentDocs] = useState<Document[]>([]);
    const [investigationDocs, setInvestigationDocs] = useState<Document[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documentTitle, setDocumentTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [alert, setAlert] = useState<AlertState | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

    // ============================================
    // EFFECTS
    // ============================================

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

    // Fetch documents when investigationId changes
    useEffect(() => {
        if (investigationId) {
            fetchAllDocuments();
            fetchSavedFormData();
        }
    }, [investigationId]);

    // ============================================
    // HANDLERS
    // ============================================

    const fetchAllDocuments = useCallback(async () => {
        setLoading(true);
        try {
            const results = await Promise.all([
                showCaseAssignmentDocs
                    ? fetchCaseAssignmentDocuments()
                    : Promise.resolve([]),
                fetchInvestigationDocuments(),
            ]);

            setCaseAssignmentDocs(results[0]);
            setInvestigationDocs(results[1]);
            onDocsUpdate?.();
        } catch (err) {
            console.error('Failed to fetch documents:', err);
            setAlert({ type: 'error', message: 'Failed to load documents' });
        } finally {
            setLoading(false);
        }
    }, [investigationId, showCaseAssignmentDocs, roleName]);

    const fetchCaseAssignmentDocuments = async (): Promise<Document[]> => {
        const sources = [
            { type: 'caseAssignmentCentral', condition: true },
            { type: 'caseAssignmentRegional', condition: true },
            {
                type: 'caseAssignmentAgency',
                condition: ROLES_WITH_AGENCY_DOCS.includes(roleName),
            },
        ];

        const docs: Document[] = [];

        for (const source of sources) {
            if (!source.condition) continue;

            try {
                const response: any = await DocumentsService.viewInvestigationDocsView(
                    source.type,
                    investigationId
                );

                if (response?.statusCode === 0 && response?.payload) {
                    docs.push(...response.payload);
                }
            } catch (err) {
                console.error(`Failed to fetch ${source.type} documents:`, err);
            }
        }

        return docs;
    };

    const fetchInvestigationDocuments = async (): Promise<Document[]> => {
        try {
            const response: any = await DocumentsService.viewInvestigationDocsView(
                'investigation',
                investigationId
            );

            return response?.statusCode === 0 && response?.payload ? response.payload : [];
        } catch (err) {
            console.error('Failed to fetch investigation documents:', err);
            return [];
        }
    };

    const fetchSavedFormData = async () => {
        try {
            const fetchFn =
                actualClaimType === 'cashless'
                    ? caseUpdateService.caseUpdatePreviousData
                    : caseUpdateService.caseUpdatePreviousDataReim;

            await fetchFn(investigationId);
        } catch (err) {
            console.error('Failed to fetch previous data:', err);
        }
    };

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setDocumentTitle(file.name);

        if (VALID_FILE_TYPES.includes(file.type)) {
            setSelectedFile(file);
            setAlert(null);
        } else {
            setAlert({
                type: 'error',
                message: 'Invalid file format. Only PDF, JPEG, GIF, PNG and TIFF are supported.',
            });
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, []);

    const handleUpload = useCallback(async () => {
        // Validation
        if (!documentTitle.trim()) {
            setAlert({ type: 'error', message: 'Please enter a document title' });
            return;
        }

        if (!selectedFile) {
            setAlert({ type: 'error', message: 'Please select a file to upload' });
            return;
        }

        const existingDoc = investigationDocs.find(
            (doc) => doc.documentTitle === documentTitle
        );
        if (existingDoc) {
            setAlert({ type: 'error', message: 'A document with this title already exists' });
            return;
        }

        setUploading(true);
        setAlert(null);

        try {
            const uploadDuring = UPLOAD_DURING_MAP[roleName] || 'investigation';

            const response: any = await DocumentsService.uploadInvestigationDocs(
                uploadDuring,
                investigationId,
                selectedFile,
                false,
                documentTitle
            );

            if (response?.statusCode === 0) {
                setAlert({ type: 'success', message: 'Document uploaded successfully!' });

                const uploadedDoc = response.payload[0];

                // Update document codes
                if (setDocumentsCodes) {
                    setDocumentsCodes([...documentsCodes, uploadedDoc.documentID]);
                }

                // Notify parent
                onDocumentsUploaded?.([uploadedDoc]);

                // Reset form
                setDocumentTitle('');
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                // Refresh documents
                await fetchAllDocuments();
            } else {
                setAlert({ type: 'error', message: response?.message || 'Upload failed' });
            }
        } catch (err: any) {
            setAlert({ type: 'error', message: err.message || 'Failed to upload document' });
        } finally {
            setUploading(false);
        }
    }, [
        documentTitle,
        selectedFile,
        investigationDocs,
        roleName,
        investigationId,
        documentsCodes,
        setDocumentsCodes,
        onDocumentsUploaded,
        fetchAllDocuments,
    ]);

    const handleDeleteDocument = useCallback(
        async (documentId: string) => {
            if (!window.confirm('Are you sure you want to delete this document?')) {
                return;
            }

            try {
                const response: any = await DocumentsService.deleteDocument(documentId);

                if (response?.statusCode === 0) {
                    setAlert({ type: 'success', message: 'Document deleted successfully' });
                    await fetchAllDocuments();
                } else {
                    setAlert({ type: 'error', message: 'Failed to delete document' });
                }
            } catch (err) {
                setAlert({ type: 'error', message: 'Failed to delete document' });
            }
        },
        [fetchAllDocuments]
    );

    // ============================================
    // RENDER HELPERS
    // ============================================

    const renderDocumentGrid = useCallback(
        (documents: Document[], isInvestigation: boolean = false) => (
            <Grid container spacing={2}>
                {documents.length === 0 ? (
                    <Grid size={{ xs: 12 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textAlign: 'center', py: 4 }}
                        >
                            No documents {isInvestigation ? 'uploaded yet' : 'available'}
                        </Typography>
                    </Grid>
                ) : (
                    documents.map((doc) => (
                        <Grid size={{ xs: 6, sm: 4, md: 4 }} key={doc.documentID}>
                            <DocumentCard
                                document={doc}
                                isInvestigation={isInvestigation}
                                onDelete={isInvestigation ? handleDeleteDocument : undefined}
                                onPreview={setSelectedDocument}
                            />
                        </Grid>
                    ))
                )}
            </Grid>
        ),
        [handleDeleteDocument]
    );

    // ============================================
    // RENDER
    // ============================================

    return (
        <Box sx={{ p: 3 }}>
            {/* Alert Messages */}
            {alert && (
                <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
                    {alert.message}
                </Alert>
            )}

            {/* Loading State */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && (
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
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
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

                                    <Box sx={{ display: 'flex', gap: 2 }}>
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
                                            disabled={
                                                uploading || !selectedFile || !documentTitle.trim()
                                            }
                                            sx={{
                                                minWidth: 120,
                                                background:
                                                    'linear-gradient(45deg, #6F62C2 30%, #9C89E3 90%)',
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
                                        <Typography
                                            variant="caption"
                                            sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
                                        >
                                            Selected: {selectedFile.name} (
                                            {(selectedFile.size / 1024).toFixed(2)} KB)
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Preview Modal */}
            <Modal
                open={Boolean(selectedDocument)}
                onClose={() => setSelectedDocument(null)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        p: 2,
                    }}
                >
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                            zIndex: 1,
                        }}
                        onClick={() => setSelectedDocument(null)}
                    >
                        <Close sx={{ color: 'white' }} />
                    </IconButton>

                    {selectedDocument && <DocumentPreview document={selectedDocument} />}
                </Box>
            </Modal>
        </Box>
    );
};

export default UnifiedDocumentComponent;