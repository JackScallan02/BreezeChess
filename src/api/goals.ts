import axios from 'axios';

export const getGoals = async () => {
  // Currently gets all goals. Might want to provide params in future
  try {
    const response = await axios.get(`http://localhost:9001/goals/`, {
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