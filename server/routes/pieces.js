import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET route to fetch all pieces, optionally filtered by user ID
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;
        let pieces;
        if (user_id) {
            pieces = await db('user_pieces').join('pieces', 'user_pieces.piece_id', 'pieces.id').where({ user_id })
                .select('rarity', 'piece_id', 'acquired_at', 'name as piece_name', 'description').orderBy('piece_id');
        } else {
            pieces = await db('pieces').select();
        }
        return res.status(200).json(pieces);
    } catch (error) {
        console.error('Error getting pieces:', error.message);
        return res.status(500).json({ error: `Failed to get pieces: ${error.message}` });
    }
});

// GET route to fetch a piece by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let piece = await db('pieces').where({ id }).first();
        return res.status(200).json(piece);
    } catch (error) {
        console.error('Error getting piece:', error.message);
        return res.status(500).json({ error: `Failed to get piece: ${error.message}` });
    }
});

export default router;
