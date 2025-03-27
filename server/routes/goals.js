const express = require('express');
const db = require('../db'); // Your Knex instance
const router = express.Router();

// GET route to fetch all goals
router.get('/', async (req, res) => {
    try {
        let goals = await db('goals');
        if (goals.length === 0) {
            return res.status(404).json({ message: 'No goals found' });
        }
        return res.status(200).json(goals);
    } catch (error) {
        console.error('Error getting goals:', error.message);
        return res.status(500).json({ error: `Failed to get goals : ${error.message}` });
    }
});

module.exports = router;
