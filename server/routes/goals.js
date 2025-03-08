const express = require('express');
const db = require('../db'); // Your Knex instance
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        let goals = await db('goals');
        return res.status(200).json(goals);
    } catch (error) {
        console.error('Error getting goals:', error.message);
        return res.status(500).json({ error: `Failed to get goals : ${error.message}` });
    }
});

module.exports = router;
