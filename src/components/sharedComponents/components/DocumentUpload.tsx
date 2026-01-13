import React, { useState, useRef } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import { DocumentsService } from '../../../services/document.service';

interface DocumentUploadProps {
    roleName: string;
    investigationId: string;
    investigationDocs: any[];
    documentsCodes: string[];
    setDocumentsCodes: (codes: string[]) => void;
    onDocsUpdate: () => void;
    onDocumentsUploaded?: any
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
    roleName,
    investigationId,
    investigationDocs,
    documentsCodes,
    setDocumentsCodes,
    onDocsUpdate,
}) => {
    const [documentTitle, setDocumentTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validTypes = [
            'application/pdf',
            'image/jpeg',
            'image/gif',
            'image/tiff',
        ];

        if (!validTypes.includes(file.type)) {
            setError('Invalid file format. Only PDF, JPEG, GIF and TIFF are supported.');
            return;
        }

        setSelectedFile(file);
        setError('');
    };

    const handleUpload = async () => {
        if (!documentTitle || !selectedFile) {
            setError('Please provide document title and select a file');
            return;
        }

        try {
            const uploadDuring =
                roleName === 'Regional Manager'
                    ? 'caseAssignmentRegional'
                    : roleName === 'Agency Spoc'
                        ? 'caseAssignmentAgency'
                        : 'caseAssignmentCentral';

            const response: any = await DocumentsService.uploadInvestigationDocs(
                uploadDuring,
                investigationId,
                selectedFile,
                false,
                documentTitle
            );

            if (response.statusCode === 0) {
                const newDocCode = response.payload[0].documentID;
                setDocumentsCodes([...documentsCodes, newDocCode]);
                onDocsUpdate();

                // Reset form
                setDocumentTitle('');
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                alert('Document uploaded successfully');
            } else {
                setError(response.message || 'Upload failed');
            }
        } catch (err: any) {
            setError(err.message || 'Upload failed');
        }
    };

    const handleDelete = async (documentId: string, index: number) => {
        try {
            const response: any = await DocumentsService.deleteDocument(documentId);
            if (response.statusCode === 0) {
                setDocumentsCodes(documentsCodes.filter((code) => code !== documentId));
                onDocsUpdate();
                alert('Document deleted successfully');
            }
        } catch (err) {
            console.error('Error deleting document:', err);
        }
    };

    const getDocumentIcon = (fileType: string) => {
        if (fileType?.includes('image')) {
            return null; // Show actual image
        }
        return <DescriptionIcon sx={{ fontSize: 60 }} />;
    };
console.log('investigationDocs', documentTitle, selectedFile);
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Investigation Documents for reference <span style={{ color: 'red' }}>*</span>
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2}>
                {/* Uploaded Documents Display */}
                {investigationDocs.map((doc, index) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={doc.documentID}>
                        <Card>
                            <CardMedia>
                                {doc.fileType?.includes('image') ? (
                                    <img
                                        src={doc.fileLocation}
                                        alt={doc.documentTitle}
                                        style={{ width: '100%', height: 150, objectFit: 'cover' }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            height: 150,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'grey.200',
                                        }}
                                    >
                                        {getDocumentIcon(doc.fileType)}
                                    </Box>
                                )}
                            </CardMedia>
                            <CardContent>
                                <Typography variant="body2" noWrap>
                                    {doc.documentTitle}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => handleDelete(doc.documentID, index)}
                                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white' }}
                                >
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {/* Upload New Document */}
                <Grid size={{ xs: 12 }}>
                    <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                        <TextField
                            fullWidth
                            label="Document Title"
                            value={documentTitle}
                            onChange={(e) => setDocumentTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileSelect}
                            accept=".pdf,.jpg,.jpeg,.gif,.tiff"
                            style={{ marginBottom: 16 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleUpload}
                            disabled={!documentTitle || !selectedFile}
                        >
                            Upload Document
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DocumentUpload;