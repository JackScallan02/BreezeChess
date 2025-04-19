import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch user ratings with optional filtering by user_id or category_id.
 * @param user_id - The ID of the user to filter user ratings (optional).
 * @returns The list of user ratings or an error message.
 */
export const getUserRatings = async (user_id?: number) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/user_ratings`, {
      params: user_id ? { user_id } : {},
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'Failed to fetch user ratings.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to fetch user ratings. Please try again later.');
    }
  }
};