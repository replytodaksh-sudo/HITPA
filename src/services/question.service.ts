// import type { AxiosResponse } from 'axios';
// import { apiService } from './api.service';

// export const QuestionService = {
//     getQuestions: (questionType: string, invClaimId: string): any => {
//         return apiService.get(
//             `/questionairy/getQuestions?questionType=${questionType}&invClaimId=${invClaimId.split('-')[0]}`
//         );
//     },
//     addQuestion: (data: any) => apiService.get(`/questionairy/addQuestion`, data),
//     // downloadQuestion: (invClaimId: string, questionType: string) => apiService.get(`/questionairy/addQuestion`, data),
//     downloadQuestion: (invClaimId: string, questionType: string) => {
//         apiService.get(`claims/getClaimsDataByInvClaimIdForPDF?invClaimId=${invClaimId.split(' ')[0]}&questionType=${questionType}`);
//     }
// }

// ============================================================================
// FILE: src/services/questionaryService.ts
// Questionary Service - React/TypeScript version
// ============================================================================

import { apiUrls } from '../constants/apiConstants';
import apiService from './api.service';

// ==================== INTERFACES ====================

export interface Question {
  id?: string;
  questionText?: string;
  questionType?: string;
  answer?: string;
  options?: string[];
  isRequired?: boolean;
  order?: number;
  investigationId?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  [key: string]: any;
}

export interface QuestionModel {
  questionText: string;
  questionType: string;
  investigationId: string;
  answer?: string;
  options?: string[];
  isRequired?: boolean;
  category?: string;
  [key: string]: any;
}

export interface QuestionsResponse {
  statusCode: number;
  message?: string;
  payload?: Question[] | null;
}

export interface QuestionResponse {
  statusCode: number;
  message?: string;
  payload?: Question | null;
}

export interface DownloadResponse {
  statusCode: number;
  message?: string;
  payload?: string | null; // HTML/text content
}

// ==================== SERVICE ====================

export const QuestionService = {
  getQuestions: async (
    questionType: string,
    invClaimId: string
  ): Promise<QuestionsResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvClaimId = invClaimId.split('-')[0];
      
      const response = await apiService.get<Question[]>(
        `${apiUrls.forQuestions}${questionType}&invClaimId=${cleanInvClaimId}`
      );
      
      return response;
    } catch (error) {
      console.error('Error in getQuestions:', error);
      throw error;
    }
  },

  downloadQuestion: async (
    invClaimId: string,
    questionType: string
  ): Promise<DownloadResponse> => {
    try {
      // Clean investigation ID (remove suffix after space)
      const cleanInvClaimId = invClaimId.split(' ')[0];
      
      const response = await apiService.get<string>(
        apiUrls.downloadUrl,
        {
          invClaimId: cleanInvClaimId,
          questionType,
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error in downloadQuestion:', error);
      throw error;
    }
  },

  downloadQuestionAsFile: async (
    invClaimId: string,
    questionType: string,
    filename: string = 'questions.html'
  ): Promise<void> => {
    try {
      const response = await QuestionService.downloadQuestion(invClaimId, questionType);
      
      if (response.statusCode === 0 && response.payload) {
        // Create blob and download
        const blob = new Blob([response.payload], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        console.log('✅ Question downloaded:', filename);
      } else {
        throw new Error(response.message || 'Failed to download questions');
      }
    } catch (error) {
      console.error('Error downloading question file:', error);
      throw error;
    }
  },

  addQuestion: async (questionModel: QuestionModel): Promise<QuestionResponse> => {
    try {
      const response = await apiService.post<Question>(
        apiUrls.addQuestion,
        questionModel
      );
      
      return response;
    } catch (error) {
      console.error('Error in addQuestion:', error);
      throw error;
    }
  },
};

export default QuestionService;

