import axios from 'axios';

export const getUsers = async () => {
  try {
    const response = await axios.get('http://localhost:9001/users');
    return response.data
  } catch(error) {
    console.error('There was an error fetching users:', error);
  }
}

export const getUserById = async (uid) => {
  try {
    if (uid === undefined) {
      throw Error('Need to specify a uid')
    }
    const response = await axios.get(`http://localhost:9001/users/${uid}`);
    return response.data
  } catch(error) {
    console.error('There was an error fetching users:', error);
    return error;
  }
}

export const createUser = async (user) => {
  try {
    if (user === undefined) {
      throw Error('Need to provide a user object')
    }
    console.log("USER: ", user);
    const response = await axios.post(`http://localhost:9001/users`, user, {
      headers: {
          'Content-Type': 'application/json',
      },
    });
    return response.data
  } catch(error) {
    console.error('There was an error creating user:', error);
    return error;
  }
}