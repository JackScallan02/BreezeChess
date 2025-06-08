import express from 'express';
import axios from 'axios';

const router = express.Router();

// Get the puzzles service URL from the environment variables
const PUZZLE_SERVICE_URL = process.env.PUZZLE_SERVICE_URL;

if (!PUZZLE_SERVICE_URL) {
  console.error("FATAL ERROR: PUZZLE_SERVICE_URL is not defined in the environment.");
  process.exit(1); // Exit if the configuration is missing
}

/**
 * @description Route to proxy a request to the puzzles service for retrieving puzzles.
 */
router.post('/', async (req, res) => {
  try {
    console.log(`Forwarding request to puzzles service at ${PUZZLE_SERVICE_URL}/process`);

    // The data to send to the puzzles service
    const requestData = {
      filters: req.body.filters || {},
      count: req.body.count || 1,
    };

    // Docker networking resolves 'http://puzzle_service:8000'.
    const serviceResponse = await axios.post(`${PUZZLE_SERVICE_URL}/getPuzzles`, requestData);

    // Send the response from the puzzles service back to the original client
    res.status(200).json(serviceResponse.data);

  } catch (error) {
    let errorMessage = "An unknown error occurred while communicating with the puzzles service.";
    let statusCode = 500;

    if (error.response) {
      console.error('Error from Puzzles Service:', error.response.data);
      errorMessage = error.response.data.detail || 'Error from puzzles service';
      statusCode = error.response.status;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from Puzzles Service:', error.request);
      errorMessage = 'The puzzles service did not respond.';
      statusCode = 504; // Gateway Timeout
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Axios Error:', error.message);
      errorMessage = error.message;
    }

    res.status(statusCode).json({ success: false, error: errorMessage });
  }
});

export default router;
