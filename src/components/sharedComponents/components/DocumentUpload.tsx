// // import React, { useState, useRef } from 'react';
// // import {
// //     Box,
// //     Button,
// //     TextField,
// //     Typography,
// //     Grid,
// //     Card,
// //     CardMedia,
// //     CardContent,
// //     IconButton,
// //     Alert,
// // } from '@mui/material';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import DescriptionIcon from '@mui/icons-material/Description';
// // import { DocumentsService } from '../../../services/document.service';

// // interface DocumentUploadProps {
// //     roleName: string;
// //     investigationId: string;
// //     investigationDocs: any[];
// //     documentsCodes: string[];
// //     setDocumentsCodes: (codes: string[]) => void;
// //     onDocsUpdate: () => void;
// //     onDocumentsUploaded?: any
// // }

// // const DocumentUpload: React.FC<DocumentUploadProps> = ({
// //     roleName,
// //     investigationId,
// //     investigationDocs,
// //     documentsCodes,
// //     setDocumentsCodes,
// //     onDocsUpdate,
// // }) => {
// //     const [documentTitle, setDocumentTitle] = useState('');
// //     const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //     const [error, setError] = useState('');
// //     const fileInputRef = useRef<HTMLInputElement>(null);

// //     const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
// //         const file = event.target.files?.[0];
// //         if (!file) return;

// //         const validTypes = [
// //             'application/pdf',
// //             'image/jpeg',
// //             'image/gif',
// //             'image/tiff',
// //         ];

// //         if (!validTypes.includes(file.type)) {
// //             setError('Invalid file format. Only PDF, JPEG, GIF and TIFF are supported.');
// //             return;
// //         }

// //         setSelectedFile(file);
// //         setError('');
// //     };

// //     const handleUpload = async () => {
// //         if (!documentTitle || !selectedFile) {
// //             setError('Please provide document title and select a file');
// //             return;
// //         }

// //         try {
// //             const uploadDuring =
// //                 roleName === 'Regional Manager'
// //                     ? 'caseAssignmentRegional'
// //                     : roleName === 'Agency Spoc'
// //                         ? 'caseAssignmentAgency'
// //                         : 'caseAssignmentCentral';

// //             const response: any = await DocumentsService.uploadInvestigationDocs(
// //                 uploadDuring,
// //                 investigationId,
// //                 selectedFile,
// //                 false,
// //                 documentTitle
// //             );

// //             if (response.statusCode === 0) {
// //                 const newDocCode = response.payload[0].documentID;
// //                 setDocumentsCodes([...documentsCodes, newDocCode]);
// //                 onDocsUpdate();

// //                 // Reset form
// //                 setDocumentTitle('');
// //                 setSelectedFile(null);
// //                 if (fileInputRef.current) {
// //                     fileInputRef.current.value = '';
// //                 }

// //                 alert('Document uploaded successfully');
// //             } else {
// //                 setError(response.message || 'Upload failed');
// //             }
// //         } catch (err: any) {
// //             setError(err.message || 'Upload failed');
// //         }
// //     };

// //     const handleDelete = async (documentId: string, index: number) => {
// //         try {
// //             const response: any = await DocumentsService.deleteDocument(documentId);
// //             if (response.statusCode === 0) {
// //                 setDocumentsCodes(documentsCodes.filter((code) => code !== documentId));
// //                 onDocsUpdate();
// //                 alert('Document deleted successfully');
// //             }
// //         } catch (err) {
// //             console.error('Error deleting document:', err);
// //         }
// //     };

// //     const getDocumentIcon = (fileType: string) => {
// //         if (fileType?.includes('image')) {
// //             return null; // Show actual image
// //         }
// //         return <DescriptionIcon sx={{ fontSize: 60 }} />;
// //     };

// //     return (
// //         <Box sx={{ mb: 3 }}>
// //             <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
// //                 Investigation Documents for reference <span style={{ color: 'red' }}>*</span>
// //             </Typography>

// //             {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

// //             <Grid container spacing={2}>
// //                 {/* Uploaded Documents Display */}
// //                 {investigationDocs.map((doc, index) => (
// //                     <Grid size={{ xs: 6, sm: 4, md: 3 }} key={doc.documentID}>
// //                         <Card>
// //                             <CardMedia>
// //                                 {doc.fileType?.includes('image') ? (
// //                                     <img
// //                                         src={doc.fileLocation}
// //                                         alt={doc.documentTitle}
// //                                         style={{ width: '100%', height: 150, objectFit: 'cover' }}
// //                                     />
// //                                 ) : (
// //                                     <Box
// //                                         sx={{
// //                                             height: 150,
// //                                             display: 'flex',
// //                                             alignItems: 'center',
// //                                             justifyContent: 'center',
// //                                             bgcolor: 'grey.200',
// //                                         }}
// //                                     >
// //                                         {getDocumentIcon(doc.fileType)}
// //                                     </Box>
// //                                 )}
// //                             </CardMedia>
// //                             <CardContent>
// //                                 <Typography variant="body2" noWrap>
// //                                     {doc.documentTitle}
// //                                 </Typography>
// //                                 <IconButton
// //                                     size="small"
// //                                     onClick={() => handleDelete(doc.documentID, index)}
// //                                     sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white' }}
// //                                 >
// //                                     <DeleteIcon color="error" />
// //                                 </IconButton>
// //                             </CardContent>
// //                         </Card>
// //                     </Grid>
// //                 ))}

// //                 {/* Upload New Document */}
// //                 <Grid size={{ xs: 12 }}>
// //                     <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
// //                         <TextField
// //                             fullWidth
// //                             label="Document Title"
// //                             value={documentTitle}
// //                             onChange={(e) => setDocumentTitle(e.target.value)}
// //                             sx={{ mb: 2 }}
// //                         />
// //                         <input
// //                             ref={fileInputRef}
// //                             type="file"
// //                             onChange={handleFileSelect}
// //                             accept=".pdf,.jpg,.jpeg,.gif,.tiff"
// //                             style={{ marginBottom: 16 }}
// //                         />
// //                         <Button
// //                             variant="contained"
// //                             onClick={handleUpload}
// //                             disabled={!documentTitle || !selectedFile}
// //                         >
// //                             Upload Documentt
// //                         </Button>
// //                     </Box>
// //                 </Grid>
// //             </Grid>
// //         </Box>
// //     );
// // };

// // export default DocumentUpload;





// import React, { useState, useRef } from 'react';
// import {
//     Box,
//     Button,
//     TextField,
//     Typography,
//     Grid,
//     Card,
//     CardMedia,
//     CardContent,
//     IconButton,
//     Alert,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     CircularProgress,
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import DescriptionIcon from '@mui/icons-material/Description';
// import OpenInNewIcon from '@mui/icons-material/OpenInNew';
// import { DocumentsService } from '../../../services/document.service';
// import { apiUrls } from '../../../constants/apiConstants';

// interface DocumentData {
//     documentID: string;
//     fileType: string;
//     fileLocation: string;
//     documentTitle: string;
//     uploadedDuring: string;
//     createdBy: string;
// }

// interface DocumentUploadProps {
//     roleName: string;
//     investigationId: string;
//     investigationDocs: DocumentData[];
//     documentsCodes: string[];
//     setDocumentsCodes: (codes: string[]) => void;
//     onDocsUpdate: () => void;
//     onDocumentsUploaded?: (docs: DocumentData[]) => void;
//     documentArray?: any
// }

// const DocumentUpload: React.FC<DocumentUploadProps> = ({
//     roleName,
//     investigationId,
//     investigationDocs,
//     documentsCodes,
//     setDocumentsCodes,
//     onDocsUpdate,
//     onDocumentsUploaded,
//     documentArray
// }) => {
//     const [documentTitle, setDocumentTitle] = useState('');
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [selectedFile1, setSelectedFile1] = useState<any[]>([]);
//     const [error, setError] = useState('');
//     const [uploadedDocs, setUploadedDocs] = useState<DocumentData[]>(documentArray || investigationDocs || []);
//     const [uploading, setUploading] = useState(false);
//     const [previewOpen, setPreviewOpen] = useState(false);
//     const [previewDoc, setPreviewDoc] = useState<DocumentData | null>(null);
//     const [previewFile, setPreviewFile] = useState<string | null>(null);
//     const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (!file) return;
//         setDocumentTitle(file.name)
//         const validTypes = [
//             'application/pdf',
//             'image/jpeg',
//             'image/gif',
//             'image/tiff',
//         ];

//         if (!validTypes.includes(file.type)) {
//             setError('Invalid file format. Only PDF, JPEG, GIF and TIFF are supported.');
//             setSelectedFile(null);
//             return;
//         }

//         setSelectedFile(file);
//         setSelectedFile1([...selectedFile1, file]);
//         setError('');
//     };

//     const handleUpload = async () => {
//         if (!documentTitle || !selectedFile) {
//             setError('Please provide document title and select a file');
//             return;
//         }

//         setUploading(true);
//         try {
//             const uploadDuring =
//                 roleName === 'Regional Manager'
//                     ? 'caseAssignmentRegional'
//                     : roleName === 'Agency Spoc'
//                         ? 'caseAssignmentAgency'
//                         : 'caseAssignmentCentral';

//             const response: any = await DocumentsService.uploadInvestigationDocs(
//                 uploadDuring,
//                 investigationId,
//                 selectedFile,
//                 false,
//                 documentTitle
//             );

//             if (response?.statusCode === 0 && response?.payload?.length > 0) {
//                 const uploadedDoc = response.payload[0];

//                 // Create preview from selected file (blob URL)
//                 const filePreviewUrl = URL.createObjectURL(selectedFile);

//                 // Add new document to the list
//                 const newDoc: DocumentData = {
//                     documentID: uploadedDoc.documentID,
//                     fileType: uploadedDoc.fileType,
//                     fileLocation: uploadedDoc.fileLocation,
//                     documentTitle: uploadedDoc.documentTitle,
//                     uploadedDuring: uploadedDoc.uploadedDuring,
//                     createdBy: uploadedDoc.createdBy,
//                 };

//                 const updatedDocs = [...uploadedDocs, newDoc];
//                 setUploadedDocs(updatedDocs);

//                 // Update document codes
//                 setDocumentsCodes([...documentsCodes, uploadedDoc.documentID]);

//                 // Show preview immediately after successful upload
//                 setPreviewDoc(newDoc);
//                 setPreviewFile(filePreviewUrl);
//                 // setPreviewOpen(true);

//                 // Call callbacks
//                 onDocsUpdate();
//                 if (onDocumentsUploaded) {
//                     onDocumentsUploaded(updatedDocs);
//                 }

//                 // Reset form
//                 setDocumentTitle('');
//                 setSelectedFile(null);
//                 if (fileInputRef.current) {
//                     fileInputRef.current.value = '';
//                 }

//                 setError('');
//             } else {
//                 setError(response?.message || 'Upload failed');
//             }
//         } catch (err: any) {
//             setError(err.message || 'Upload failed');
//             console.error('Upload error:', err);
//         } finally {
//             setUploading(false);
//         }
//     };

//     const handleDelete = async (documentId: string) => {
//         try {
//             const response: any = await DocumentsService.deleteDocument(documentId);
//             if (response?.statusCode === 0) {
//                 // Remove from uploaded docs
//                 const updatedDocs = uploadedDocs.filter((doc) => doc.documentID !== documentId);
//                 setUploadedDocs(updatedDocs);

//                 // Remove from document codes
//                 setDocumentsCodes(documentsCodes.filter((code) => code !== documentId));

//                 onDocsUpdate();
//                 if (onDocumentsUploaded) {
//                     onDocumentsUploaded(updatedDocs);
//                 }

//                 alert('Document deleted successfully');
//             } else {
//                 setError(response?.message || 'Failed to delete document');
//             }
//         } catch (err: any) {
//             setError(err.message || 'Error deleting document');
//             console.error('Error deleting document:', err);
//         }
//     };

//     const handleOpenPreview = async (doc: DocumentData) => {
//         // For newly uploaded docs, use blob URL, for others use API response
//         let previewUrl: string;
//         if (doc.fileLocation.startsWith('blob:')) {
//             previewUrl = doc.fileLocation;
//         } else {
//             previewUrl = await getImageUrl(doc.fileLocation, doc);
//         }

//         setPreviewDoc(doc);
//         setPreviewFile(previewUrl);
//         setPreviewOpen(true);
//     };

//     const handleClosePreview = () => {
//         setPreviewOpen(false);
//         setPreviewDoc(null);
//     };

//     const handleDownload = (fileLocation: string, fileName: string) => {
//         // Open in new tab for viewing
//         window.open(fileLocation, '_blank');
//     };

//     // const getImageUrl = (fileLocation: string, doc: any) => {
//     //     if (!fileLocation) return "";

//     //     // If backend already gives a full URL
//     //     if (fileLocation.startsWith("http")) {
//     //         return fileLocation;
//     //     }

//     //     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
//     //     const VIEW_DOCUMENT_URL = `${API_BASE_URL}${apiUrls.viewDocument}`;

//     //     console.log('Getting image URL for document:', `${VIEW_DOCUMENT_URL}?docLocation=${encodeURIComponent(
//     //         fileLocation
//     //     )}&documentId=${doc.documentID}`);

//     //     return `${VIEW_DOCUMENT_URL}?docLocation=${encodeURIComponent(
//     //         fileLocation
//     //     )}&documentId=${doc.documentID}`;
//     // };

//     const getImageUrl = async (fileLocation: string, doc: any) => {
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

//         const blob = await response.blob();
//         return URL.createObjectURL(blob);
//     };


//     // const getImageUrl = (fileLocation: string, doc: any) => {
//     //     // If it's a full path from the server, construct the proper URL
//     //     if (fileLocation.startsWith('http')) {
//     //         return fileLocation;
//     //     }

//     //     // If it's a relative path, append to API base URL
//     //     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
//     //     const VIEW_DOCUMENT_URL = `${API_BASE_URL}${apiUrls.viewDocument}`;
//     //     console.log('Getting image URL for document:', VIEW_DOCUMENT_URL + fileLocation + "&documentId=" + doc.documentID);
//     //     return VIEW_DOCUMENT_URL + fileLocation + "&documentId=" + doc.documentID;
//     // };

//     const isImageFile = (fileType: string) => fileType?.includes('image');

//     const isPdfFile = (fileType: string) => fileType?.includes('pdf');

//     React.useEffect(() => {
//         const loadImageUrls = async () => {
//             const urls: Record<string, string> = {};
//             for (const doc of uploadedDocs) {
//                 if (isImageFile(doc.fileType) && !imageUrls[doc.documentID]) {
//                     try {
//                         urls[doc.documentID] = await getImageUrl(doc.fileLocation, doc);
//                     } catch (err) {
//                         console.error(`Failed to load image for ${doc.documentID}:`, err);
//                     }
//                 }
//             }
//             if (Object.keys(urls).length > 0) {
//                 setImageUrls((prev) => ({ ...prev, ...urls }));
//             }
//         };
//         loadImageUrls();
//     }, [uploadedDocs]);

//     console.log('Uploaded Docs:', uploadedDocs, investigationDocs, documentArray);
//     return (
//         <Box sx={{ mb: 3 }}>
//             <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//                 Investigation Documents for reference <span style={{ color: 'red' }}>*</span>
//             </Typography>

//             {error && (
//                 <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
//                     {error}
//                 </Alert>
//             )}

//             <Grid container spacing={2}>
//                 {/* Uploaded Documents Display */}
//                 {uploadedDocs && uploadedDocs.length > 0 && (
//                     uploadedDocs.map((doc, index) => {
//                         // For newly uploaded doc, store blob URL temporarily
//                         const isNewlyUploaded = index === uploadedDocs.length - 1 && previewFile;

//                         return (
//                             <Grid size={{ xs: 6, sm: 4, md: 3 }} key={doc.documentID}>
//                                 <Card
//                                     sx={{
//                                         height: '100%',
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         position: 'relative',
//                                         transition: 'transform 0.2s, boxShadow 0.2s',
//                                         '&:hover': {
//                                             transform: 'translateY(-4px)',
//                                             boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
//                                         },
//                                     }}
//                                 >
//                                     <CardMedia sx={{ height: 150, bgcolor: 'grey.200', overflow: 'hidden' }}>
//                                         {isImageFile(doc.fileType) ? (
//                                             <img
//                                                 src={imageUrls[doc.documentID] || ''}
//                                                 alt={doc.documentTitle}
//                                                 style={{
//                                                     width: '100%',
//                                                     height: '100%',
//                                                     objectFit: 'cover',
//                                                     cursor: 'pointer',
//                                                 }}
//                                                 // onClick={() => handleOpenPreview(doc)}
//                                                 onError={(e) => {
//                                                     console.error('Thumbnail load error:', e);
//                                                     (e.target as HTMLImageElement).style.display = 'none';
//                                                 }}
//                                             />
//                                         ) : isPdfFile(doc.fileType) ? (
//                                             <Box
//                                                 sx={{
//                                                     height: '100%',
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                     flexDirection: 'column',
//                                                     bgcolor: 'primary.light',
//                                                     cursor: 'pointer',
//                                                 }}
//                                             // onClick={() => handleOpenPreview(doc)}
//                                             >
//                                                 <DescriptionIcon sx={{ fontSize: 60, color: 'primary.main' }} />
//                                                 <Typography variant="caption" sx={{ mt: 1, color: 'primary.main' }}>
//                                                     PDF
//                                                 </Typography>
//                                             </Box>
//                                         ) : (
//                                             <Box
//                                                 sx={{
//                                                     height: '100%',
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                     bgcolor: 'grey.300',
//                                                     cursor: 'pointer',
//                                                 }}
//                                                 onClick={() => handleOpenPreview(doc)}
//                                             >
//                                                 <DescriptionIcon sx={{ fontSize: 60, color: 'grey.600' }} />
//                                             </Box>
//                                         )}
//                                     </CardMedia>

//                                     <CardContent sx={{ flexGrow: 1, pb: 1 }}>
//                                         <Typography
//                                             variant="body2"
//                                             noWrap
//                                             title={doc.documentTitle}
//                                             sx={{ fontWeight: 500 }}
//                                         >
//                                             {doc.documentTitle}
//                                         </Typography>
//                                         <Typography variant="caption" color="textSecondary">
//                                             {doc.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}
//                                         </Typography>
//                                     </CardContent>

//                                     <Box sx={{ display: 'flex', gap: 0.5, p: 1, justifyContent: 'flex-end' }}>
//                                         <IconButton
//                                             size="small"
//                                             onClick={() => handleOpenPreview(doc)}
//                                             title="Preview"
//                                             sx={{
//                                                 bgcolor: 'info.light',
//                                                 '&:hover': { bgcolor: 'info.main', color: 'white' },
//                                             }}
//                                         >
//                                             <OpenInNewIcon fontSize="small" />
//                                         </IconButton>
//                                         <IconButton
//                                             size="small"
//                                             onClick={() => handleDelete(doc.documentID)}
//                                             title="Delete"
//                                             sx={{
//                                                 bgcolor: 'error.light',
//                                                 '&:hover': { bgcolor: 'error.main', color: 'white' },
//                                             }}
//                                         >
//                                             <DeleteIcon fontSize="small" />
//                                         </IconButton>
//                                     </Box>
//                                 </Card>
//                             </Grid>
//                         );
//                     })
//                 )}

//                 {/* Upload New Document Section */}
//                 <Grid size={{ xs: 12 }}>
//                     <Box
//                         sx={{
//                             p: 3,
//                             border: '2px dashed #ccc',
//                             borderRadius: 2,
//                             bgcolor: '#fafafa',
//                             transition: 'all 0.3s',
//                             '&:hover': {
//                                 borderColor: 'primary.main',
//                                 bgcolor: 'primary.lighter',
//                             },
//                         }}
//                     >
//                         <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
//                             Upload New Document
//                         </Typography>

//                         <TextField
//                             fullWidth
//                             label="Document Title"
//                             value={documentTitle}
//                             onChange={(e) => setDocumentTitle(e.target.value)}
//                             placeholder="e.g., Medical Report, Claim Form"
//                             sx={{ mb: 2 }}
//                             disabled={uploading}
//                         />

//                         <Box
//                             sx={{
//                                 mb: 2,
//                                 p: 2,
//                                 border: '1px solid #ddd',
//                                 borderRadius: 1,
//                                 bgcolor: 'white',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: 2,
//                                 cursor: 'pointer',
//                                 transition: 'all 0.2s',
//                                 '&:hover': {
//                                     bgcolor: selectedFile ? 'success.light' : 'grey.100',
//                                 },
//                             }}
//                         >
//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 onChange={handleFileSelect}
//                                 accept=".pdf,.jpg,.jpeg,.gif,.tiff"
//                                 style={{ display: 'none' }}
//                                 disabled={uploading}
//                             />
//                             <Button
//                                 variant="outlined"
//                                 onClick={() => fileInputRef.current?.click()}
//                                 disabled={uploading}
//                                 sx={{ whiteSpace: 'nowrap' }}
//                             >
//                                 Choose File
//                             </Button>
//                             <Typography
//                                 variant="body2"
//                                 color={selectedFile ? 'success.main' : 'textSecondary'}
//                                 sx={{ flex: 1 }}
//                             >
//                                 {selectedFile
//                                     ? `✓ ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`
//                                     : 'No file selected'}
//                             </Typography>
//                         </Box>

//                         <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
//                             Supported formats: PDF, JPEG, GIF, TIFF (Max file size: 50 MB)
//                         </Typography>

//                         <Button
//                             variant="contained"
//                             onClick={handleUpload}
//                             disabled={!documentTitle || !selectedFile || uploading}
//                             fullWidth
//                             sx={{ position: 'relative' }}
//                         >
//                             {uploading ? (
//                                 <>
//                                     <CircularProgress size={24} sx={{ position: 'absolute', left: 16 }} />
//                                     Uploading...
//                                 </>
//                             ) : (
//                                 'Upload Document'
//                             )}
//                         </Button>
//                     </Box>
//                 </Grid>
//             </Grid>

//             {/* Preview Dialog */}
//             <Dialog
//                 open={previewOpen}
//                 onClose={handleClosePreview}
//                 maxWidth="md"
//                 fullWidth
//             >
//                 <DialogTitle>
//                     {previewDoc?.documentTitle}
//                 </DialogTitle>
//                 <DialogContent>
//                     {previewDoc && previewFile && (
//                         <Box sx={{ my: 2 }}>
//                             {isImageFile(previewDoc.fileType) ? (
//                                 <img
//                                     src={previewFile}
//                                     alt={previewDoc.documentTitle}
//                                     style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }}
//                                     onError={(e) => {
//                                         console.error('Preview image load error:', e);
//                                         (e.target as HTMLImageElement).style.display = 'none';
//                                     }}
//                                 />
//                             ) : isPdfFile(previewDoc.fileType) ? (
//                                 <Box
//                                     sx={{
//                                         p: 3,
//                                         textAlign: 'center',
//                                         bgcolor: 'grey.100',
//                                         borderRadius: 1,
//                                     }}
//                                 >
//                                     <DescriptionIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
//                                     <Typography variant="h6" sx={{ mb: 2 }}>
//                                         {previewDoc.documentTitle}
//                                     </Typography>
//                                     <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
//                                         Document uploaded successfully!
//                                     </Typography>
//                                     <Button
//                                         variant="contained"
//                                         onClick={() =>
//                                             window.open(previewFile, '_blank')
//                                         }
//                                     >
//                                         Open PDF
//                                     </Button>
//                                 </Box>
//                             ) : (
//                                 <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 1 }}>
//                                     <Typography variant="body2">
//                                         Document uploaded successfully!
//                                     </Typography>
//                                     <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
//                                         File Type: {previewDoc.fileType}
//                                     </Typography>
//                                     <Button
//                                         variant="contained"
//                                         sx={{ mt: 2 }}
//                                         onClick={() =>
//                                             window.open(previewFile, '_blank')
//                                         }
//                                     >
//                                         Open File
//                                     </Button>
//                                 </Box>
//                             )}
//                         </Box>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     {previewDoc && (
//                         <>
//                             <Button
//                                 variant="outlined"
//                                 onClick={() =>
//                                     window.open(previewFile!, '_blank')
//                                 }
//                             >
//                                 Open in New Tab
//                             </Button>
//                             <Button onClick={handleClosePreview} variant="contained">
//                                 Done
//                             </Button>
//                         </>
//                     )}
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default DocumentUpload;



// // createdBy: "112233"
// // createdOn: null
// // documentID: "202611595445574REOBLRZ70K0001"
// // documentTitle: "sachin-all-century_742e59230.jpg"
// // errorMsg: ""
// // fileData: null
// // fileLocation: "/home/ubuntu/test/uploads/20260115_095445_sachin-all-century_742e59230.jpg"
// // fileName: null
// // fileSize: null
// // fileType: "image/jpeg"
// // uploadedDuring: "caseAssignmentRegional"



// // createdBy: "ALOP  MHATRE "
// // createdOn: "2026-01-15T08:42:58.098+00:00"
// // documentID: "202611521257981G6UUQ3ZZOU0001"
// // documentTitle: "img"
// // errorMsg: ""
// // fileData: null
// // fileLocation: "C:/uploadFile/20260115_141257_img_2.jpg"
// // fileName: "20260115_141257_img_2.jpg"
// // fileSize: null
// // fileType: "image/jpeg"
// // uploadedDuring: "caseAssignmentRegional"









// CaseUpdateDocuments.tsx - Complete React Component
// Converted from Angular CentralAgencyCaseUpdateDocumentsComponent

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Paper,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DocumentsService from '../../../services/document.service';
import alertService from '../../../services/alertService';
import { apiUrls } from '../../../constants/apiConstants';
import caseUpdateService from '../../../services/caseupdate.service';

// ============================================
// INTERFACES
// ============================================

interface Document {
    documentID: string;
    documentTitle: string;
    fileLocation: string;
    fileType: string;
    createdBy?: string;
    createdOn?: string;
}


const message = {
    docTitleMention: 'Please enter document title',
    selectDocument: 'Please select a document',
    alreadyExistFileName: 'File name already exists',
    uploadSuccess: 'Document uploaded successfully',
    documentDeleted: 'Document deleted successfully',
};

// ============================================
// MAIN COMPONENT
// ============================================

const CaseUpdateDocuments: React.FC<any> = ({
}) => {
    const { investigationId: paramInvestigationId } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const claimType = searchParams.get('claimsType');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // State
    const [investigationId, setInvestigationId] = useState<string>('');
    const [documentArray, setDocumentArray] = useState<Document[]>([]);
    const [investigationDocsView, setInvestigationDocsView] = useState<Document[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [documentTitle, setDocumentTitle] = useState<string>('');
    const [roleName, setRoleName] = useState<string>('');
    const [formIsEditable, setFormIsEditable] = useState<boolean>(false);
    const [previousData, setPreviousData] = useState<any>(null);

    // ============================================
    // LIFECYCLE HOOKS
    // ============================================

    useEffect(() => {
        getRole();
        getInvestigationId();
        checkFormEditable();
    }, []);

    useEffect(() => {
        if (investigationId) {
            getInvestigationDocs();
            getSavedFormData();
        }
    }, [investigationId, roleName]);

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    const getRole = () => {
        const role = sessionStorage.getItem('roleName') || '';
        setRoleName(role);
        console.log('Role:', role);
    };

    const checkFormEditable = () => {
        const editable = Boolean(sessionStorage.getItem('formEditable'));
        setFormIsEditable(editable);
    };

    const getInvestigationId = () => {
        if (paramInvestigationId) {
            const invId = paramInvestigationId.split(' ')[0];
            setInvestigationId(invId);
        }
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // ============================================
    // DOCUMENT FUNCTIONS
    // ============================================

    const getInvestigationDocs = async () => {
        // if (!documentService) return;

        try {
            let combinedDocs: Document[] = [];

            // Fetch documents based on role
            if (roleName === 'Regional Manager') {
                // Central docs
                const centralDocs = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentCentral',
                    investigationId
                );
                if (centralDocs.statusCode === 0) {
                    combinedDocs = centralDocs.payload;
                }

                // Regional docs
                const regionalDocs = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentRegional',
                    investigationId
                );
                if (regionalDocs.statusCode === 0) {
                    combinedDocs = [...combinedDocs, ...regionalDocs.payload];
                }
            }
            else if (roleName === 'Agency Spoc') {
                // Central docs
                const centralDocs = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentCentral',
                    investigationId
                );
                if (centralDocs.statusCode === 0) {
                    combinedDocs = centralDocs.payload;
                }

                // Regional docs
                const regionalDocs = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentRegional',
                    investigationId
                );
                if (regionalDocs.statusCode === 0) {
                    combinedDocs = [...combinedDocs, ...regionalDocs.payload];
                }

                // Agency docs
                const agencyDocs = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentAgency',
                    investigationId
                );
                if (agencyDocs.statusCode === 0) {
                    combinedDocs = [...combinedDocs, ...agencyDocs.payload];
                }
            }
            else if (roleName === 'Central Manager' || roleName === 'Field Officer') {
                // Central docs
                const centralDocs = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentCentral',
                    investigationId
                );
                if (centralDocs.statusCode === 0) {
                    combinedDocs = centralDocs.payload;
                }

                // Regional docs
                const regionalDocs = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentRegional',
                    investigationId
                );
                if (regionalDocs.statusCode === 0) {
                    combinedDocs = [...combinedDocs, ...regionalDocs.payload];
                }

                // Agency docs
                const agencyDocs = await DocumentsService.viewInvestigationDocsView(
                    'caseAssignmentAgency',
                    investigationId
                );
                if (agencyDocs.statusCode === 0) {
                    combinedDocs = [...combinedDocs, ...agencyDocs.payload];
                }
            }

            setDocumentArray(combinedDocs);

            // Fetch investigation documents
            const investigationDocs = await DocumentsService.viewInvestigationDocsView(
                'investigation',
                investigationId
            );
            if (investigationDocs.statusCode === 0) {
                setInvestigationDocsView(investigationDocs.payload);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const openDocuments = (fileLocation: string, documentID: string) => {
        console.log('documentID:', documentID);
        const url = `${apiUrls.viewDocument}${fileLocation}&documentId=${documentID}`;
        window.open(url, '_blank');
    };

    const setImageSrc = (fileLocation: string, fileType: string): string => {
        if (fileType === 'image/jpeg' || fileType === 'image/png') {
            return `${apiUrls.viewDocument}${fileLocation}`;
        } else if (fileType === 'application/pdf') {
            return '../healthinv/assets/images/pdf-icon.png';
        } else if (fileType === 'application/x-zip-compressed') {
            return '../healthinv/assets/images/zip-file.png';
        } else if (
            fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            return '../healthinv/assets/images/google-docs.png';
        } else {
            return '../healthinv/assets/images/google-docs.png';
        }
    };

    const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const fileType = files[0].type;
            console.log('File type:', fileType);

            if (
                fileType === 'application/pdf' ||
                fileType === 'image/jpeg' ||
                fileType === 'image/gif' ||
                fileType === 'image/tiff'
            ) {
                setSelectedFiles(files);
            } else {
                if (alertService) {
                    alertService.showAlertSuccess(
                        'Invalid file format. Only PDF, JPEG, GIF and TIFF file formats are supported.'
                    );
                }
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    const upload = async () => {
        if (!DocumentsService || !alertService) return;

        // Validation
        const existingFileName = investigationDocsView.filter(
            (doc) => doc.documentTitle === documentTitle
        );

        if (!documentTitle) {
            alertService.showAlertSuccess(message.docTitleMention);
            return;
        }

        if (!selectedFiles || selectedFiles.length === 0) {
            alertService.showAlertSuccess(message.selectDocument);
            return;
        }

        if (existingFileName.length > 0) {
            alertService.showAlertSuccess(message.alreadyExistFileName);
            return;
        }

        try {
            const response = await DocumentsService.uploadInvestigationDocs(
                'investigation',
                investigationId,
                selectedFiles[0],
                false,
                documentTitle
            );

            if (response.statusCode === 0) {
                await getInvestigationDocs();
                alertService.showAlertSuccess(message.uploadSuccess);

                // Reset fields
                setDocumentTitle('');
                setSelectedFiles(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } catch (error) {
            console.error('Error uploading document:', error);
        }
    };

    const deleteDocument = async (documentId: string) => {
        // if (!documentService || !alertService) return;

        try {
            const response = await DocumentsService.deleteDocument(documentId);

            if (response.statusCode === 0) {
                await getInvestigationDocs();
                alertService.showAlertSuccess(message.documentDeleted);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const getSavedFormData = async () => {
        // if (!caseUpdateService) return;

        try {
            let response;

            if (claimType === 'cashless') {
                response = await caseUpdateService.caseUpdatePreviousData(investigationId);
            } else if (claimType === 'reim') {
                response = await caseUpdateService.caseUpdatePreviousDataReim(investigationId);
            }

            if (response) {
                setPreviousData(response.payload);
            }
        } catch (error) {
            console.error('Error fetching previous data:', error);
        }
    };

    // ============================================
    // RENDER
    // ============================================
console.log('Document Array:', documentArray);
    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Documents shared during case assignment */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Documents shared during case assignment
                    </Typography>
                    <Grid container spacing={2}>
                        {documentArray.map((doc) => (
                            <Grid size={{ xs: 6, md: 4 }} key={doc.documentID}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            boxShadow: 3,
                                        },
                                    }}
                                    onClick={() => openDocuments(doc.fileLocation, doc.documentID)}
                                >
                                    <Box
                                        sx={{
                                            height: 80,
                                            width: 80,
                                            mx: 'auto',
                                            mb: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <img
                                            src={setImageSrc(doc.fileLocation, doc.fileType)}
                                            alt={doc.documentTitle}
                                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                                        />
                                    </Box>
                                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                        {doc.documentTitle}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Documents uploaded during Investigation */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Documents uploaded during Investigation
                    </Typography>
                    <Grid container spacing={2}>
                        {investigationDocsView.map((doc) => (
                            <Grid size={{ xs: 6, md: 4 }} key={doc.documentID}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        textAlign: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            right: 4,
                                            bgcolor: 'error.main',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: 'error.dark',
                                            },
                                            width: 24,
                                            height: 24,
                                        }}
                                        onClick={() => deleteDocument(doc.documentID)}
                                    >
                                        <CloseIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                    <Box
                                        sx={{
                                            height: 80,
                                            width: 80,
                                            mx: 'auto',
                                            mb: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => openDocuments(doc.fileLocation, doc.documentID)}
                                    >
                                        <img
                                            src={setImageSrc(doc.fileLocation, doc.fileType)}
                                            alt={doc.documentTitle}
                                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                                        />
                                    </Box>
                                    <Typography variant="body2" sx={{ wordBreak: 'break-word', mb: 1 }}>
                                        {doc.documentTitle}
                                    </Typography>
                                    {doc.createdBy && (
                                        <Typography
                                            variant="caption"
                                            sx={{ color: '#4d4c4c', display: 'block', fontSize: 14 }}
                                        >
                                            Uploaded By {doc.createdBy}
                                            <br />
                                            {formatDate(doc.createdOn || '')}
                                        </Typography>
                                    )}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Upload Section */}
                    <Box sx={{ mt: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Document title..."
                            value={documentTitle}
                            onChange={(e) => setDocumentTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                type="file"
                                inputRef={fileInputRef}
                                onChange={selectFile}
                                inputProps={{
                                    accept: '.pdf,.jpeg,.jpg,.gif,.tiff',
                                }}
                                sx={{ flex: 1 }}
                            />
                            <Button variant="contained" onClick={upload}>
                                Upload
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CaseUpdateDocuments;

// ============================================
// USAGE EXAMPLE
// ============================================

/*
import CaseUpdateDocuments from './CaseUpdateDocuments';
import { documentService, caseUpdateService, alertService } from './services';

function App() {
  return (
    <CaseUpdateDocuments
      documentService={documentService}
      caseUpdateService={caseUpdateService}
      alertService={alertService}
    />
  );
}
*/