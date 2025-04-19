import axios from 'axios';
import { RatingCategory } from '../types/ratingcategories';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches all rating categories from the API
 * @returns A promise that resolves to an array of all available rating categories.
 */
export const getRatingCategories = async () => {
  try {
    const response = await apiClient.get<Array<RatingCategory>>(`${API_BASE_URL}/rating_categories/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch(error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'Failed to fetch rating categories.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to fetch rating categories. Please try again later.');
    }
  }
}