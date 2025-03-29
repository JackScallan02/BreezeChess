import axios from 'axios';
import { UserGoals } from '../types/usergoals';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch user goals with optional filtering by user_id.
 * @param user_id - The ID of the user to filter goals (optional).
 * @returns The list of user goals or an error message.
 */
export const getUserGoals = async (user_id?: number) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/user_goals`, {
      params: user_id ? { user_id } : {},
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'Failed to fetch user goals.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to fetch user goals. Please try again later.');
    }
  }
};

/**
 * Create user goals by sending a POST request to the API.
 * @param user_goals - The user goals object containing user_id and goal_ids.
 * @returns The created user goals or an error message.
 */
export const createUserGoals = async (user_goals: UserGoals) => {
  try {
    if (!user_goals || !user_goals.user_id || !user_goals.goal_ids || user_goals.goal_ids.length === 0) {
      throw new Error('Invalid user goals data. Ensure user_id and goal_ids are provided.');
    }

    const response = await apiClient.post(`${API_BASE_URL}/user_goals`, user_goals, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'Failed to create user goals.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to create user goals. Please try again later.');
    }
  }
};