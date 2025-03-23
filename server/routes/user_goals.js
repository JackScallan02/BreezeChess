const express = require('express');
const db = require('../db'); // Your Knex instance
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        let goals = await db('user_goals');
        res.status(200).json(goals);
    } catch (error) {
        console.error('Error getting user goals:', error.message);
        res.status(500).json({ error: `Failed to get user goals : ${error.message}` });
    }
});

router.post('/', async (req, res) => {

    let { user_id, goal_ids } = req.body;

    // Validate request data
    if (!user_id || !goal_ids) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const user_goals = [];
        for (const goal_id of goal_ids) {
            const [user_goal] = await db('user_goals').insert({
                user_id,
                goal_id
            }).returning('*');
            user_goals.concat(user_goal);
        }
        return res.status(201).json(user_goals);
    } catch (error) {
        console.error('Error inserting user goal(s):', error.message);
        return res.status(500).json({ error: `Failed to insert user goal(s): ${error.message}` });
    }
});



module.exports = router;
