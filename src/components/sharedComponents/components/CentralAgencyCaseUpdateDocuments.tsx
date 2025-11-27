import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { useParams, useSearchParams } from 'react-router-dom';
import { DocumentService } from '../../../services/document.service';
import { caseUpdateService } from '../../../services/caseupdate.service';

interface Document {
  documentID: string;
  documentTitle: string;
  fileLocation: string;
  fileType: string;
  createdBy?: string;
  createdOn?: string;
}

const CentralAgencyCaseUpdateDocuments: React.FC = () => {
  const { investigationId: paramInvestigationId } = useParams<{ investigationId: string }>();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const roleName = sessionStorage.getItem('roleName') || '';

  // State
  const [investigationId, setInvestigationId] = useState('');
  const [claimType, setClaimType] = useState<'cashless' | 'reim'>('cashless');
  const [documentArray, setDocumentArray] = useState<Document[]>([]);
  const [investigationDocsView, setInvestigationDocsView] = useState<Document[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Extract investigation ID and claim type
  useEffect(() => {
    if (paramInvestigationId) {
      const cleanId = paramInvestigationId.split('-')[0].trim();
      setInvestigationId(cleanId);
    }

    const claimTypeParam = searchParams.get('claimsType') as 'cashless' | 'reim';
    if (claimTypeParam) {
      setClaimType(claimTypeParam);
    }
  }, [paramInvestigationId, searchParams]);

  // Fetch documents when investigationId is available
  useEffect(() => {
    if (investigationId) {
      getInvestigationDocs();
      getSavedFormData();
    }
  }, [investigationId, claimType]);

  // Fetch all documents from Central, Regional, and Agency
  const getInvestigationDocs = async () => {
    setLoading(true);
    try {
      let allDocs: Document[] = [];

      // Fetch documents based on role
      if (
        roleName === 'Regional Manager' ||
        roleName === 'Agency Spoc' ||
        roleName === 'Central Manager' ||
        roleName === 'Field Officer'
      ) {
        // Regional Manager: Central + Regional
        if (roleName === 'Regional Manager') {
          const centralResponse:any = await DocumentService.viewInvestigationDocsView(
            'caseAssignmentCentral',
            investigationId
          );
          if (centralResponse.data.statusCode === 0) {
            allDocs = [...centralResponse.data.payload];
          }

          const regionalResponse:any = await DocumentService.viewInvestigationDocsView(
            'caseAssignmentRegional',
            investigationId
          );
          if (regionalResponse.data.statusCode === 0) {
            allDocs = [...allDocs, ...regionalResponse.data.payload];
          }
        }
        // Agency Spoc, Central Manager, Field Officer: Central + Regional + Agency
        else {
          const centralResponse:any = await DocumentService.viewInvestigationDocsView(
            'caseAssignmentCentral',
            investigationId
          );
          if (centralResponse.data.statusCode === 0) {
            allDocs = [...centralResponse.data.payload];
          }

          const regionalResponse:any = await DocumentService.viewInvestigationDocsView(
            'caseAssignmentRegional',
            investigationId
          );
          if (regionalResponse.data.statusCode === 0) {
            allDocs = [...allDocs, ...regionalResponse.data.payload];
          }

          const agencyResponse:any = await DocumentService.viewInvestigationDocsView(
            'caseAssignmentAgency',
            investigationId
          );
          if (agencyResponse.data.statusCode === 0) {
            allDocs = [...allDocs, ...agencyResponse.data.payload];
          }
        }
      }

      setDocumentArray(allDocs);

      // Fetch investigation documents
      const invDocsResponse:any = await DocumentService.viewInvestigationDocsView(
        'investigation',
        investigationId
      );
      if (invDocsResponse.data.statusCode === 0) {
        setInvestigationDocsView(invDocsResponse.data.payload);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  // Get saved form data
  const getSavedFormData = async () => {
    try {
      const response =
        claimType === 'cashless'
          ? await caseUpdateService.caseUpdatePreviousData(investigationId)
          : await caseUpdateService.caseUpdatePreviousDataReim(investigationId);
      // Data loaded successfully
    } catch (err) {
      console.error('Failed to fetch previous data:', err);
    }
  };

  // Get icon/image source based on file type
  const getImageSrc = (fileLocation: string, fileType: string): string => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
    const VIEW_DOCUMENT_URL = `${API_BASE_URL}/view-document?file=`;

    if (fileType === 'image/jpeg' || fileType === 'image/png') {
      return VIEW_DOCUMENT_URL + fileLocation;
    } else if (fileType === 'application/pdf') {
      return '/assets/images/pdf-icon.png';
    } else if (fileType === 'application/x-zip-compressed') {
      return '/assets/images/zip-file.png';
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return '/assets/images/google-docs.png';
    } else {
      return '/assets/images/google-docs.png';
    }
  };

  // Open document in new tab
  const openDocument = (fileLocation: string, documentID: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
    const url = `${API_BASE_URL}/view-document?file=${fileLocation}&documentId=${documentID}`;
    window.open(url, '_blank');
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      setError('Invalid file format. Only PDF, JPEG, GIF, PNG and TIFF file formats are supported.');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Upload document
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
    const existingDoc = investigationDocsView.find(
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
      const response:any = await DocumentService.uploadInvestigationDocs(
        'investigation',
        investigationId,
        selectedFile,
        false,
        documentTitle
      );

      if (response.data.statusCode === 0) {
        setSuccess('Document uploaded successfully!');
        
        // Reset form
        setDocumentTitle('');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Refresh documents
        await getInvestigationDocs();
      } else {
        setError(response.data.message || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response:any = await DocumentService.deleteDocument(documentId);
      if (response.data.statusCode === 0) {
        setSuccess('Document deleted successfully');
        await getInvestigationDocs();
      } else {
        setError('Failed to delete document');
      }
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
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
        {/* Left Section - Documents shared during case assignment */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Documents shared during case assignment
          </Typography>

          <Grid container spacing={2}>
            {documentArray.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No documents available
                </Typography>
              </Grid>
            )}

            {documentArray.map((doc) => (
              <Grid size={{ xs: 6, sm: 4 }} key={doc.documentID}>
                <Box
                  sx={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                    },
                  }}
                  onClick={() => openDocument(doc.fileLocation, doc.documentID)}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      bgcolor: '#fafafa',
                      borderRadius: 1,
                    }}
                  >
                    <img
                      src={getImageSrc(doc.fileLocation, doc.fileType)}
                      alt={doc.documentTitle}
                      style={{
                        maxWidth: '80px',
                        maxHeight: '80px',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      wordBreak: 'break-word',
                      fontSize: '0.75rem',
                    }}
                  >
                    {doc.documentTitle}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Section - Documents uploaded during Investigation */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Documents uploaded during Investigation
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {investigationDocsView.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No documents uploaded yet
                </Typography>
              </Grid>
            )}

            {investigationDocsView.map((doc) => (
              <Grid size={{ xs: 6, sm: 4 }} key={doc.documentID}>
                <Paper
                  sx={{
                    textAlign: 'center',
                    p: 1,
                    position: 'relative',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                    },
                  }}
                  variant="outlined"
                >
                  {/* Delete button */}
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

                  {/* Document thumbnail */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      margin: '0 auto',
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
                      src={getImageSrc(doc.fileLocation, doc.fileType)}
                      alt={doc.documentTitle}
                      style={{
                        maxWidth: '80px',
                        maxHeight: '80px',
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

                  {doc.createdBy && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: '#4d4c4c',
                        fontSize: '0.65rem',
                      }}
                    >
                      Uploaded by {doc.createdBy}
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
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Upload section */}
          <Box>
            <TextField
              fullWidth
              size="small"
              label="Document Title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Document title..."
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexDirection: 'column' }}>
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

              {selectedFile && (
                <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'flex-start' }}>
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </Typography>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !documentTitle.trim()}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  mt: 1,
                }}
              >
                {uploading ? <CircularProgress size={24} /> : 'Upload'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CentralAgencyCaseUpdateDocuments;