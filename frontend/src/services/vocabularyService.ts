import axios from 'axios';
import type{
    VocabularyItem,
    VocabularySearchParams,
    VocabularyCreatePayload,
    VocabularyUpdatePayload,
     } from '../types/vocabulary';

const API_BASE_URL = 'http://localhost:8000';

export const vocabularyService = {
    // Get a vocabulary by id
    getById: async (id: number): Promise<VocabularyItem> => {
        const response = await axios.get<VocabularyItem>(`${API_BASE_URL}/vocabulary/${id}`);
        return response.data;
        },

    // Search or list vocabulary items
    search: async (params?: VocabularySearchParams): Promise<VocabularyItem[]> => {
        const response = await axios.get<VocabularyItem[]>(`${API_BASE_URL}/vocabulary`, {params,});
        return response.data;
        },

    // Create a new vocabulary
    create: async (payload: VocabularyCreatePayload): Promise<VocabularyItem> => {
        const response = await axios.post<VocabularyItem>(`${API_BASE_URL}/vocabulary`, payload);
        return response.data;
        },

    // Update a vocabulary
    update: async (id:number, payload: VocabularyUpdatePayload): Promise<VocabularyItem> => {
        const response = await axios.patch<VocabularyItem>(`${API_BASE_URL}/vocabulary/${id}`, payload);
        return response.data;
        },

    // Delete a vocabulary
    delete: async (id:number): Promise<VocabularyItem> => {
        const response = await axios.delete<VocabularyItem>(`${API_BASE_URL}/vocabulary/${id}`);
        return response.data;
        },
    };