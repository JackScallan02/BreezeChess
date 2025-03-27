const express = require('express');
const db = require('../db');
const router = express.Router();
const Joi = require('joi');

// Validation middleware
const validateUserGoals = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number().integer().required(),
        goal_ids: Joi.array().items(Joi.number().integer()).min(1).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// GET route with optional filtering by user_id
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;
        const query = db('user_goals');
        if (user_id) {
            query.where({ user_id });
        }
        const goals = await query;
        res.status(200).json(goals);
    } catch (error) {
        console.error('Error getting user goals:', error.message);
        res.status(500).json({ error: `Failed to get user goals: ${error.message}` });
    }
});

// POST route to insert user goals
router.post('/', validateUserGoals, async (req, res) => {

    let { user_id, goal_ids } = req.body;

    // Validate request data
    if (!user_id || !goal_ids) {
        return res.status(400).json({ error: 'Missing required fields' });
    } else if (!Array.isArray(goal_ids) || goal_ids.length === 0) {
        return res.status(400).json({ error: 'goal_ids must be a non-empty array' });
    }

    try {
        const user_goals = [];
        await db.transaction(async (trx) => {
            for (const goal_id of goal_ids) {
                const [user_goal] = await trx('user_goals').insert({
                    user_id,
                    goal_id
                }).returning('*');
                user_goals.push(user_goal);
            }
        });
        return res.status(201).json(user_goals);
    } catch (error) {
        console.error('Error inserting user goal(s):', error.message);
        if (error.code === '23503') { // PostgreSQL foreign key violation
            return res.status(400).json({ error: 'Invalid user_id or goal_id' });
        }
        return res.status(500).json({ error: `Failed to insert user goal(s): ${error.message}` });
    }
});

module.exports = router;
