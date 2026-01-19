import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
  Modal,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { DocumentsService } from '../../../services/document.service';
import { apiUrls } from '../../../constants/apiConstants';

// Constants
const VALID_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/gif', 'image/tiff'];
const SUPPORTED_FORMATS = 'PDF, JPEG, GIF, TIFF';
const MAX_FILE_SIZE = 50; // MB

// Types
interface DocumentData {
  documentID: string;
  fileType: string;
  fileLocation: string;
  documentTitle: string;
  uploadedDuring: string;
  createdBy: string;
}

interface DocumentUploadProps {
  roleName: string;
  investigationId: string;
  investigationDocs?: DocumentData[];
  documentArray?: DocumentData[];
  documentsCodes: string[];
  setDocumentsCodes: (codes: string[]) => void;
  onDocsUpdate: () => void;
  onDocumentsUploaded?: (docs: DocumentData[]) => void;
}

/**
 * DocumentPreview Component - Renders image or PDF preview
 */
const DocumentPreview: React.FC<{ document: DocumentData | null }> = ({ document }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem('token');

  React.useEffect(() => {
    if (!document) return;

    let objectUrl: string;
    setLoading(true);

    const fetchFile = async () => {
      try {
        const completeURL = `${import.meta.env.VITE_API_BASE_URL}${apiUrls.viewDocument}${encodeURIComponent(
          document.fileLocation
        )}&documentId=${document.documentID}`;

        const response = await fetch(completeURL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const blob = await response.blob();
        const fixedBlob = new Blob([blob], { type: document.fileType });

        objectUrl = URL.createObjectURL(fixedBlob);
        setPreviewUrl(objectUrl);
      } catch (err) {
        console.error('Preview fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [document, token]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!previewUrl) return null;

  // Image Preview
  if (document?.fileType?.startsWith('image/')) {
    return (
      <img
        src={previewUrl}
        alt="Document preview"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    );
  }

  // PDF Preview
  if (document?.fileType === 'application/pdf') {
    return (
      <iframe
        src={previewUrl}
        title="PDF Preview"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    );
  }

  return null;
};

/**
 * DocumentCard Component - Displays individual document
 */
const DocumentCard: React.FC<{
  doc: DocumentData;
  onDelete: (id: string) => void;
  onPreview: (doc: DocumentData) => void;
}> = ({ doc, onDelete, onPreview }) => {
  return (
    <Grid size={{ xs: 6, sm: 4, md: 3 }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
          },
        }}
      >
        <CardMedia
          sx={{
            height: 150,
            bgcolor: 'grey.200',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => onPreview(doc)}
        >
          <DocumentPreview document={doc} />
        </CardMedia>

        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography variant="body2" noWrap title={doc.documentTitle} sx={{ fontWeight: 500 }}>
            {doc.documentTitle}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {doc.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}
          </Typography>
        </CardContent>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton
            size="small"
            onClick={() => onDelete(doc.documentID)}
            title="Delete document"
            sx={{
              bgcolor: 'error.light',
              '&:hover': { bgcolor: 'error.main', color: 'white' },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Card>
    </Grid>
  );
};

/**
 * FileUploadSection Component - Handles document upload
 */
const FileUploadSection: React.FC<{
  documentTitle: string;
  selectedFile: File | null;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onTitleChange: (title: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
}> = ({
  documentTitle,
  selectedFile,
  uploading,
  fileInputRef,
  onTitleChange,
  onFileSelect,
  onUpload,
}) => {
  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          p: 3,
          border: '2px dashed #ccc',
          borderRadius: 2,
          bgcolor: '#fafafa',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: '#f0f7ff',
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
          Upload New Document
        </Typography>

        <TextField
          fullWidth
          label="Document Title"
          value={documentTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g., Medical Report, Claim Form"
          sx={{ mb: 2 }}
          disabled={uploading}
          size="small"
        />

        <Box
          sx={{
            mb: 2,
            p: 2,
            border: '1px solid #ddd',
            borderRadius: 1,
            bgcolor: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: selectedFile ? 'success.light' : 'grey.100',
            },
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={onFileSelect}
            accept=".pdf,.jpg,.jpeg,.gif,.tiff"
            style={{ display: 'none' }}
            disabled={uploading}
          />
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            sx={{ whiteSpace: 'nowrap' }}
            size="small"
          >
            Choose File
          </Button>
          <Typography
            variant="body2"
            color={selectedFile ? 'success.main' : 'textSecondary'}
            sx={{ flex: 1, fontSize: '0.875rem' }}
          >
            {selectedFile
              ? `✓ ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`
              : 'No file selected'}
          </Typography>
        </Box>

        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
          Supported: {SUPPORTED_FORMATS} (Max: {MAX_FILE_SIZE} MB)
        </Typography>

        <Button
          variant="contained"
          onClick={onUpload}
          disabled={!documentTitle || !selectedFile || uploading}
          fullWidth
          sx={{ position: 'relative' }}
        >
          {uploading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Uploading...
            </>
          ) : (
            'Upload Document'
          )}
        </Button>
      </Box>
    </Grid>
  );
};

/**
 * Main DocumentUpload Component
 */
const DocumentUpload: React.FC<DocumentUploadProps> = ({
  roleName,
  investigationId,
  investigationDocs = [],
  documentArray = [],
  documentsCodes,
  setDocumentsCodes,
  onDocsUpdate,
  onDocumentsUploaded,
}) => {
  // State
  const [documentTitle, setDocumentTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use documentArray if provided, otherwise use investigationDocs
  const [uploadedDocs, setUploadedDocs] = useState<DocumentData[]>(
    documentArray.length > 0 ? documentArray : investigationDocs
  );

  /**
   * Get upload directory based on role
   */
  const getUploadDirectory = useCallback((): string => {
    switch (roleName) {
      case 'Regional Manager':
        return 'caseAssignmentRegional';
      case 'Agency Spoc':
        return 'caseAssignmentAgency';
      default:
        return 'caseAssignmentCentral';
    }
  }, [roleName]);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDocumentTitle(file.name);

    if (!VALID_FILE_TYPES.includes(file.type)) {
      setError(`Invalid file format. Only ${SUPPORTED_FORMATS} are supported.`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError('');
  }, []);

  /**
   * Handle document upload
   */
  const handleUpload = useCallback(async () => {
    if (!documentTitle || !selectedFile) {
      setError('Please provide document title and select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response: any = await DocumentsService.uploadInvestigationDocs(
        getUploadDirectory(),
        investigationId,
        selectedFile,
        false,
        documentTitle
      );

      if (response?.statusCode === 0 && response?.payload?.length > 0) {
        const uploadedDoc = response.payload[0];

        const newDoc: DocumentData = {
          documentID: uploadedDoc.documentID,
          fileType: uploadedDoc.fileType,
          fileLocation: uploadedDoc.fileLocation,
          documentTitle: uploadedDoc.documentTitle,
          uploadedDuring: uploadedDoc.uploadedDuring,
          createdBy: uploadedDoc.createdBy,
        };

        const updatedDocs = [...uploadedDocs, newDoc];
        setUploadedDocs(updatedDocs);
        setDocumentsCodes([...documentsCodes, uploadedDoc.documentID]);

        // Reset form
        setDocumentTitle('');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        onDocsUpdate();
        if (onDocumentsUploaded) {
          onDocumentsUploaded(updatedDocs);
        }
      } else {
        setError(response?.message || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [documentTitle, selectedFile, documentsCodes, uploadedDocs, getUploadDirectory, investigationId, onDocsUpdate, onDocumentsUploaded, setDocumentsCodes]);

  /**
   * Handle document deletion
   */
  const handleDelete = useCallback(async (documentId: string) => {
    try {
      const response: any = await DocumentsService.deleteDocument(documentId);

      if (response?.statusCode === 0) {
        const updatedDocs = uploadedDocs.filter((doc) => doc.documentID !== documentId);
        setUploadedDocs(updatedDocs);
        setDocumentsCodes(documentsCodes.filter((code) => code !== documentId));

        onDocsUpdate();
        if (onDocumentsUploaded) {
          onDocumentsUploaded(updatedDocs);
        }

        setError('');
      } else {
        setError(response?.message || 'Failed to delete document');
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting document');
      console.error('Error deleting document:', err);
    }
  }, [uploadedDocs, documentsCodes, onDocsUpdate, onDocumentsUploaded, setDocumentsCodes]);

  // Memoize document list to prevent unnecessary re-renders
  const documentList = useMemo(
    () =>
      uploadedDocs.map((doc) => (
        <DocumentCard
          key={doc.documentID}
          doc={doc}
          onDelete={handleDelete}
          onPreview={setSelectedDocument}
        />
      )),
    [uploadedDocs, handleDelete]
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Investigation Documents for reference <span style={{ color: 'red' }}>*</span>
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* Document Cards */}
        {uploadedDocs.length > 0 && documentList}

        {/* Upload Section */}
        <FileUploadSection
          documentTitle={documentTitle}
          selectedFile={selectedFile}
          uploading={uploading}
          fileInputRef={fileInputRef}
          onTitleChange={setDocumentTitle}
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
        />
      </Grid>

      {/* Preview Modal */}
      <Dialog
        open={Boolean(selectedDocument)}
        onClose={() => setSelectedDocument(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            height: '80vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'grey.100',
          }}
        >
          <Typography variant="h6">{selectedDocument?.documentTitle}</Typography>
          <IconButton
            onClick={() => setSelectedDocument(null)}
            size="small"
            sx={{
              '&:hover': {
                bgcolor: 'error.light',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            overflow: 'auto',
          }}
        >
          {selectedDocument && <DocumentPreview document={selectedDocument} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DocumentUpload;