import axios from 'axios';
import { Country } from '../types/country';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9001';

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
export const getCountries = async () => {
  try {
    const response = await apiClient.get<Country[]>(`${API_BASE_URL}/countries/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch(error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'Failed to fetch countries.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to fetch countries. Please try again later.');
    }
  }
}