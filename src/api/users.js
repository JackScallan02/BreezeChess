import axios from 'axios';

export const getUsers = async () => {
  try {
    const response = await axios.get('http://localhost:9001/users'); // URL of the GET route
    return response.data
  } catch(error) {
    console.error('There was an error fetching users:', error);
  }
}