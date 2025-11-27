import type { AxiosResponse } from 'axios';
import { apiService } from './api.service';

export const QuestionService = {
    getQuestions: (questionType: string, invClaimId: string): any => {
        return apiService.get(
            `/questionairy/getQuestions?questionType=${questionType}&invClaimId=${invClaimId.split('-')[0]}`
        );
    },
    addQuestion: (data: any) => apiService.get(`/questionairy/addQuestion`, data),
    // downloadQuestion: (invClaimId: string, questionType: string) => apiService.get(`/questionairy/addQuestion`, data),
    downloadQuestion: (invClaimId: string, questionType: string) => {
        apiService.get(`claims/getClaimsDataByInvClaimIdForPDF?invClaimId=${invClaimId.split(' ')[0]}&questionType=${questionType}`);
    }
}