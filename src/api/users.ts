import axios from 'axios';
import { UserParams, CreateUserData } from '../types/user';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches users with optional filtering.
 * @param params - The query parameters for filtering users.
 * @returns A list of users or an error message.
 */
export const getUsers = async (params: UserParams) => {
  try {
    const response = await apiClient.get('/users/', { params });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'An error occurred when getting users.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to connect to the server. Please try again later.');
    }
  }
};

/**
 * Fetches a user by ID.
 * @param id - The ID of the user to fetch.
 * @returns The user data or an error message.
 */
export const getUserById = async (id: number) => {
  if (!id || typeof id !== 'number') {
    throw new Error('Invalid user ID. Please provide a valid number.');
  }

  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'An error occurred when getting user by id.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to connect to the server. Please try again later.');
    }  }
};

/**
 * Creates a new user.
 * @param userData - The data for the new user.
 * @returns The created user or an error message.
 */
export const createUser = async (userData: CreateUserData) => {

  if (!userData) {
    throw new Error('User data is required to create a user.');
  }

  if (userData.uid === null) {
    throw new Error('uid is required to create a user.');
  }

  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'An error occurred when creating a user.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to connect to the server. Please try again later.');
    }  }
};

/**
 * Updates a user by ID.
 * @param id - The ID of the user to update.
 * @param params - The update parameters.
 * @returns A success message or an error message.
 */
export const updateUser = async (id: number, params: Object) => {
  if (!id || !params || Object.keys(params).length === 0) {
    throw new Error('User ID and update parameters are required.');
  }

  try {
    const response = await apiClient.patch(`/users/${id}`, params);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'An error occurred when patching the user.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to connect to the server. Please try again later.');
    }  }
};

/**
 * Given a username, check if it already exists
 * @param username - The username to check.
 * @returns A success message or an error message.
 */
export const checkUsernameExists = async (username: string) => {
  if (!username) {
    throw new Error('Username is required to check existence.');
  }

  try {
    const response = await apiClient.get('/users/exists', { params: { username } });
    return response.data.exists;
  } catch (error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'An error occurred when checking username existence.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to connect to the server. Please try again later.');
    }
  }
}

/**
 * Get the user info from a user id. Optionally include query parameters
 * @param id - The ID of the user to get the user info from.
 * @param params - The query parameters.
 * @returns The user info object or an error message.
 */
export const getUserInfo = async (id: number, queryParams: string) => {
  if (!id || typeof id !== 'number') {
    throw new Error('Invalid user ID. Please provide a valid number.');
  }

  try {
    const response = await apiClient.get(`/users/${id}/info${queryParams}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data.error}`);
      throw new Error(error.response.data.error || 'An error occurred when getting user info.');
    } else {
      console.error('Network or server error:', error.message);
      throw new Error('Failed to connect to the server. Please try again later.');
    }
  }
}