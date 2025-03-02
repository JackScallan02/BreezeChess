import axios from 'axios';

export const getUsers = async (params) => {
  try {
    params = params || {};
    const response = await axios.get(`http://localhost:9001/users/`, {
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data
  } catch(error) {
    console.error('There was an error fetching users: ', error);
    return error;
  }
}

export const getUserById = async (id) => {
  try {
    if (id === undefined) {
      throw new Error("Need to provide an id")
    }
    const response = await axios.get(`http://localhost:9001/users/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data
  } catch(error) {
    console.error('There was an error fetching users: ', error);
    return error;
  }
}

export const createUser = async (userData) => {
  try {
    if (userData === undefined) {
      throw Error('Need to provide user data')
    }
    const response = await axios.post(`http://localhost:9001/users`, userData, {
      headers: {
          'Content-Type': 'application/json',
      },
    });
    return response.data
  } catch(error) {
    console.error('There was an error creating user: ', error);
    return error;
  }
}

export const updateUser = async (id, params) => {
  try {
    if (id === undefined || !params || Object.keys(params).length === 0) {
      throw Error('Need to provide an id and params');
    }
    const response = await axios.put(`http://localhost:9001/users`, {id, ...params}, {
      headers: {
          'Content-Type': 'application/json',
      },
    });
    return response.data
  } catch (error) {
    console.error('There was an error updating user: ', error);
    return error;
  }
}