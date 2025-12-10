// ============================================================================
// FILE: src/services/notesService.ts
// Notes Service - React/TypeScript version
// ============================================================================

import { apiUrls } from '../constants/apiConstants';
import apiService from './api.service';

// ==================== INTERFACES ====================

export interface Note {
  id?: string;
  investigationId?: string;
  content?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  noteType?: string;
  priority?: string;
  status?: string;
  [key: string]: any;
}

export interface AddNotePayload {
  content: string;
  noteType?: string;
  priority?: string;
  tags?: string[];
  attachments?: string[];
  [key: string]: any;
}

export interface NotesResponse {
  statusCode: number;
  message?: string;
  payload?: Note | Note[] | null;
}

// ==================== SERVICE ====================

export const notesService = {
  /**
   * Add a new note to an investigation
   * @param payload - Note data to be added
   * @param investigationId - Investigation ID
   * @returns Promise with the created note
   * 
   * @example
   * const noteData = {
   *   content: 'Hospital verified, documents submitted',
   *   noteType: 'investigation',
   *   priority: 'high'
   * };
   * const response = await notesService.addNotes(noteData, 'INV-123');
   */
  addNotes: async (
    payload: AddNotePayload,
    investigationId: string
  ): Promise<NotesResponse> => {
    try {
      const response = await apiService.post<Note>(
        apiUrls.addNotes,
        payload,
        {
          params: { investigationId },
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error in addNotes:', error);
      throw error;
    }
  },

  /**
   * Get all notes for an investigation
   * @param investigationId - Investigation/Claim ID
   * @returns Promise with array of notes
   * 
   * @example
   * const response = await notesService.getNotes('INV-123');
   * if (response.statusCode === 0) {
   *   console.log('Notes:', response.payload);
   * }
   */
  getNotes: async (investigationId: string): Promise<NotesResponse> => {
    try {
      const response = await apiService.get<Note[]>(
        apiUrls.getNotes,
        {
          invClaimId: investigationId,
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error in getNotes:', error);
      throw error;
    }
  },
};

export default notesService;
