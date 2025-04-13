import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET route to fetch all rating categories
router.get('/', async (req, res) => {
    try {
        let rating_categories = await db('rating_categories');
        if (rating_categories.length === 0) {
            return res.status(404).json({ message: 'No rating_categories found' });
        }
        return res.status(200).json(rating_categories);
    } catch (error) {
        console.error('Error getting rating categories:', error.message);
        return res.status(500).json({ error: `Failed to get rating categories : ${error.message}` });
    }
});

export default router;
