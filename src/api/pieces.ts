import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch a user's owned boards
 * @param user_id - The ID of the user to query the pieces from (optional). Otherwise will get all pieces
 * @returns The list of pieces or an error message.
 */
export const getPieces = async (user_id?: number) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/pieces`, {
      params: user_id ? { user_id }: {},
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'Failed to fetch pieces.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to fetch pieces. Please try again later.');
    }
  }
};