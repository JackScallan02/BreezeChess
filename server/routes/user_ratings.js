import express from 'express';
import db from '../db.js';
import Joi from 'joi';

const router = express.Router();

// Validation middleware
const validateUserRating = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number().integer().required(),
        category_id: Joi.number().integer().required(),
        rating: Joi.number().integer().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// GET route with optional filtering by user_id, and category_id
router.get('/', async (req, res) => {
    try {
        const { user_id, category_id } = req.query;
        const query = db('user_ratings');
        if ((user_id !== undefined) && (category_id === undefined)) {
            // only user_id provided
            query.where({ user_id });
        } else if (user_id !== undefined) {
            // user_id and category_id provided
            query.where({ user_id }).andWhere({category_id});
        } else if (category_id !== undefined) {
            // only category_id provided
            query.where({ category_id });
        }
        const user_ratings = await query;
        return res.status(200).json(user_ratings);
    } catch (error) {
        console.error('Error getting user ratings:', error.message);
        return res.status(500).json({ error: `Failed to get user ratings: ${error.message}` });
    }
});

// PUT route to insert user rating for a specified user if it exists, else create it (UPSERT)
router.put('/', validateUserRating, async (req, res) => {
    try {
        const { user_id, category_id, rating } = req.body;

        const user = await db('users').where({ id: user_id }).first();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const category = await db('rating_categories').where({ id: category_id }).first();
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        } 
        
        // Upsert
        const ratingUpdate = await db('user_ratings').insert({
          user_id,
          category_id,
          rating
        }).onConflict(['user_id', 'category_id']).merge().returning('user_id'); // updates rating if conflict happens

        if (!ratingUpdate) {
            return res.status(400).json({ error: 'Failed to update rating' });
        }

        return res.status(201).json(ratingUpdate);

    } catch (error) {
        console.error('Error updating user rating:', error.message);
        return res.status(500).json({ error: `Failed to update rating: ${error.message}` });
    }
});

export default router;