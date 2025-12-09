// import { apiService } from "./api.service";

// export const DocumentsService = {
//   // ... existing methods

//   uploadInvestigationDocs: (
//     uploadDuring: string, invsClaimId: string, uploadFile: File, multipleItem: boolean, fileName: string
//   ) => {
//     const formData = new FormData();
//     formData.append("uploadDuring", uploadDuring);
//     formData.append("invClaimId", invsClaimId.trim());
//     formData.append("multiItems", String(multipleItem));
//     formData.append("files", uploadFile);
//     formData.append("documentTitle", fileName);

//     return apiService.post(
//       `/documents/uploadInvestigationDocument`,
//       formData
//     );
//   },

//   viewDocuments: (type: string, invsClaimId: string) =>
//     apiService.get(`documents/getAllDocumentsByUploadedDuring?uploadedDuring=${type}&invClaimId=${invsClaimId.split('-')[0]}`),

//   viewInvestigationDocsView: (uploadDuring: string, invsClaimId: string) =>
//     apiService.get(
//       `/documents/getAllDocumentsByUploadedDuring?uploadedDuring=${uploadDuring}&invClaimId=${invsClaimId.split('-')[0]}`
//     ),

//   deleteDocument: (documentId: string) =>
//     apiService.delete(`/documents/deleteDocumentById?documentID=${documentId}`),
  
//   downloadPDF: (invid:any, pdfType:any, claimType:any) =>
//     apiService.post(`/claims/getPDFDetails?invClaimId=${invid}&pdfType=${pdfType}&claimType=${claimType}`),
// };



// File: src/services/documents.service.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================

/**
 * Document View Response
 */
export interface Document {
  documentId?: string;
  documentTitle?: string;
  documentType?: string;
  documentPath?: string;
  uploadedDuring?: string;
  uploadedBy?: string;
  uploadedDate?: string;
  fileSize?: number;
  fileExtension?: string;
  [key: string]: any;
}

/**
 * Documents Response
 */
export interface DocumentsResponse {
  statusCode: number;
  message?: string;
  payload?: Document[] | any;
}

/**
 * Document Upload Response
 */
export interface DocumentUploadResponse {
  statusCode: number;
  message?: string;
  payload?: {
    documentId?: string;
    documentPath?: string;
    [key: string]: any;
  };
}

/**
 * Document Delete Response
 */
export interface DocumentDeleteResponse {
  statusCode: number;
  message?: string;
  payload?: any;
}

/**
 * PDF Download Response
 */
export interface PDFDownloadResponse {
  statusCode: number;
  message?: string;
  payload?: any;
}

// ==================== SERVICE ====================

export class DocumentsService {
  /**
   * View documents by type and investigation/claim ID
   * @param type - Type of document (e.g., 'preAuth', 'caseUpdate', 'qcUpdate')
   * @param invClaimId - Investigation/Claim ID (will be cleaned)
   * @returns Promise with document list
   */
  static async viewDocuments(
    type: string,
    invClaimId: string
  ): Promise<DocumentsResponse> {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvClaimId = invClaimId.split('-')[0];
      
      const response = await apiService.get(apiUrls.docsView, {
        uploadedDuring: type,
        invClaimId: cleanInvClaimId,
      });
      return response;
    } catch (error) {
      console.error('Error in viewDocuments:', error);
      throw error;
    }
  }

  /**
   * Upload investigation documents
   * @param uploadDuring - Upload stage (e.g., 'preAuth', 'caseUpdate')
   * @param invClaimId - Investigation/Claim ID (will be trimmed)
   * @param uploadFile - File to upload
   * @param multipleItem - Whether multiple items are being uploaded
   * @param fileName - Document title/name
   * @param onUploadProgress - Optional progress callback
   * @returns Promise with upload result
   */
  static async uploadInvestigationDocs(
    uploadDuring: string,
    invClaimId: string,
    uploadFile: File,
    multipleItem: boolean,
    fileName: string,
    onUploadProgress?: (progressEvent: ProgressEvent) => void
  ): Promise<DocumentUploadResponse> {
    try {
      // Trim investigation ID
      const cleanInvClaimId = invClaimId.trim();
      
      // Create FormData
      const additionalData = {
        uploadDuring: uploadDuring,
        invClaimId: cleanInvClaimId,
        multiItems: String(multipleItem),
        documentTitle: fileName,
      };

      const response = await apiService.uploadFile(
        apiUrls.uploadInvestigationDocs,
        uploadFile,
        additionalData,
        onUploadProgress
      );
      
      return response;
    } catch (error) {
      console.error('Error in uploadInvestigationDocs:', error);
      throw error;
    }
  }

  /**
   * Upload multiple investigation documents
   * @param uploadDuring - Upload stage
   * @param invClaimId - Investigation/Claim ID
   * @param files - Array of files to upload
   * @param fileNames - Array of document titles
   * @param onUploadProgress - Optional progress callback
   * @returns Promise with upload result
   */
  static async uploadMultipleInvestigationDocs(
    uploadDuring: string,
    invClaimId: string,
    files: File[],
    fileNames: string[],
    onUploadProgress?: (progressEvent: ProgressEvent) => void
  ): Promise<DocumentUploadResponse> {
    try {
      // Trim investigation ID
      const cleanInvClaimId = invClaimId.trim();
      
      // Create FormData manually for multiple files
      const formData = new FormData();
      formData.append('uploadDuring', uploadDuring);
      formData.append('invClaimId', cleanInvClaimId);
      formData.append('multiItems', 'true');
      
      // Append all files
      files.forEach((file, index) => {
        formData.append('files', file);
        if (fileNames[index]) {
          formData.append('documentTitles', fileNames[index]);
        }
      });

      // Use uploadFiles method
      const response = await apiService.uploadFiles(
        apiUrls.uploadInvestigationDocs,
        files,
        {
          uploadDuring: uploadDuring,
          invClaimId: cleanInvClaimId,
          multiItems: 'true',
          documentTitles: fileNames.join(','),
        },
        onUploadProgress
      );
      
      return response;
    } catch (error) {
      console.error('Error in uploadMultipleInvestigationDocs:', error);
      throw error;
    }
  }

  /**
   * View investigation documents (alias for viewDocuments)
   * @param type - Type of document
   * @param invClaimId - Investigation/Claim ID (will be cleaned)
   * @returns Promise with document list
   */
  static async viewInvestigationDocsView(
    type: string,
    invClaimId: string
  ): Promise<DocumentsResponse> {
    // This is the same as viewDocuments in the Angular version
    return this.viewDocuments(type, invClaimId);
  }

  /**
   * Delete a document by ID
   * @param documentId - Document ID to delete
   * @returns Promise with deletion result
   */
  static async deleteDocument(
    documentId: string
  ): Promise<DocumentDeleteResponse> {
    try {
      const response = await apiService.delete(`${apiUrls.deleteDocument}?documentID=${documentId}`);
      return response;
    } catch (error) {
      console.error('Error in deleteDocument:', error);
      throw error;
    }
  }

  /**
   * Download PDF report
   * @param invId - Investigation ID
   * @param pdfType - Type of PDF (e.g., 'ReportEmployer', 'ReportInsured')
   * @param claimType - Type of claim ('cashless' or 'reim')
   * @returns Promise with PDF download result
   */
  static async downloadPDF(
    invId: string,
    pdfType: string,
    claimType: string
  ): Promise<PDFDownloadResponse> {
    try {
      // Note: Investigation ID is NOT cleaned here (as per Angular version)
      const response = await apiService.post(
        `${apiUrls.getPDFDetails}?invClaimId=${invId}&pdfType=${pdfType}&claimType=${claimType}`,
        null
      );
      return response;
    } catch (error) {
      console.error('Error in downloadPDF:', error);
      throw error;
    }
  }

  /**
   * Download PDF and open in new tab
   * @param invId - Investigation ID
   * @param pdfType - Type of PDF
   * @param claimType - Type of claim
   * @returns Promise that opens PDF in new tab
   */
  static async downloadPDFAndOpen(
    invId: string,
    pdfType: string,
    claimType: string
  ): Promise<void> {
    try {
      // First, trigger the PDF generation
      await this.downloadPDF(invId, pdfType, claimType);
      
      // Then open the PDF URL in new tab
      const pdfUrl = `${apiUrls.getPDFDetails}?invClaimId=${invId}&pdfType=${pdfType}&claimType=${claimType}`;
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error in downloadPDFAndOpen:', error);
      throw error;
    }
  }

  /**
   * Get document by ID
   * @param documentId - Document ID
   * @returns Promise with document details
   */
  static async getDocumentById(
    documentId: string
  ): Promise<DocumentsResponse> {
    try {
      const response = await apiService.get(`${apiUrls.docsView}/${documentId}`);
      return response;
    } catch (error) {
      console.error('Error in getDocumentById:', error);
      throw error;
    }
  }

  /**
   * Download document file
   * @param documentId - Document ID
   * @param fileName - File name for download
   * @returns Promise that downloads the file
   */
  static async downloadDocumentFile(
    documentId: string,
    fileName: string
  ): Promise<void> {
    try {
      await apiService.downloadFile(
        `${apiUrls.docsView}/download`,
        fileName,
        { documentId }
      );
    } catch (error) {
      console.error('Error in downloadDocumentFile:', error);
      throw error;
    }
  }
}

// Export as default for convenience
export default DocumentsService;