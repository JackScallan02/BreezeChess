import axios from 'axios';

export const getGoals = async (params) => {
  try {
    params = params || {};
    const response = await axios.get(`http://localhost:9001/goals/`, {
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data
  } catch(error) {
    console.error('There was an error fetching goals: ', error);
    return error;
  }
}