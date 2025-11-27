import { apiService } from "./api.service";

export const DocumentService = {
  // ... existing methods

  uploadInvestigationDocs: (
    uploadDuring: string, invsClaimId: string, uploadFile: File, multipleItem: boolean, fileName: string
  ) => {
    const formData = new FormData();
    formData.append("uploadDuring", uploadDuring);
    formData.append("invClaimId", invsClaimId.trim());
    formData.append("multiItems", String(multipleItem));
    formData.append("files", uploadFile);
    formData.append("documentTitle", fileName);

    return apiService.post(
      `/documents/uploadInvestigationDocument`,
      formData
    );
  },

  viewDocuments: (type: string, invsClaimId: string) =>
    apiService.get(`documents/getAllDocumentsByUploadedDuring?uploadedDuring=${type}&invClaimId=${invsClaimId.split('-')[0]}`),

  viewInvestigationDocsView: (uploadDuring: string, invsClaimId: string) =>
    apiService.get(
      `/documents/getAllDocumentsByUploadedDuring?uploadedDuring=${uploadDuring}&invClaimId=${invsClaimId.split('-')[0]}`
    ),

  deleteDocument: (documentId: string) =>
    apiService.delete(`/documents/deleteDocumentById?documentID=${documentId}`),
  
  downloadPDF: (invid:any, pdfType:any, claimType:any) =>
    apiService.post(`/claims/getPDFDetails?invClaimId=${invid}&pdfType=${pdfType}&claimType=${claimType}`),
};

