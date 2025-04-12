import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET route to fetch all countries
router.get('/', async (req, res) => {
    try {
        let countries = await db('countries');
        if (countries.length === 0) {
            return res.status(404).json({ message: 'No countries found' });
        }
        return res.status(200).json(countries);
    } catch (error) {
        console.error('Error getting countries:', error.message);
        return res.status(500).json({ error: `Failed to get countries : ${error.message}` });
    }
});

export default router;
