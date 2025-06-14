import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches all countries from the API
 * @returns A promise that resolves to an array of all available countries.
 */
export const getPuzzles = async (filters: Object | undefined, count: number | undefined) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/puzzles/`, { filters, count }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch(error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'Failed to fetch puzzles.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to fetch puzzles. Please try again later.');
    }
  }
}