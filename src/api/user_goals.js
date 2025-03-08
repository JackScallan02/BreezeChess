import axios from 'axios';

export const createUserGoals = async (user_goals) => {
    try {
      if (user_goals === undefined) {
        throw Error('Need to provide user data')
      }
      const response = await axios.post(`http://localhost:9001/user_goals`, user_goals, {
        headers: {
            'Content-Type': 'application/json',
        },
      });
      console.log("RESPONSE: ", response);
      return response.data
    } catch(error) {
      console.error('There was an error creating user: ', error);
      return error;
    }
}