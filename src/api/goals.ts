import axios from 'axios';
import { Goal } from '../types/goal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches goals from the API. Might want to provide params in future
 * @returns A promise that resolves to an array of all available goals.
 */
export const getGoals = async () => {
  try {
    const response = await apiClient.get<Goal[]>(`${API_BASE_URL}/goals/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch(error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'Failed to fetch goals.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to fetch goals. Please try again later.');
    }
  }
}