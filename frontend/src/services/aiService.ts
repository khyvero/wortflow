import axios from 'axios';
import type{
    AICompletionRequest, AICompletionResponse,
    ImageRequest, ImageResponse } from '../types/ai';

const API_BASE_URL = 'http://localhost:8000';

export const aiService = {
    // generate metadata for word
    generateCompletion: async ( payload: AICompletionRequest): Promise<AICompletionResponse> => {
        const response = await axios.post<AICompletionResponse>(`${API_BASE_URL}/ai/completion`, payload);
        return response.data;
    },

// generate image for word
    generateImage: async ( payload: ImageRequest): Promise<ImageResponse> => {
        const response = await axios.post<ImageResponse>(`${API_BASE_URL}/ai/image`, payload);
        return response.data;
    }
};