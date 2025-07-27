import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET route to fetch all boards, optionally filtered by user ID
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;
        let boards;
        if (user_id) {
            boards = await db('user_boards').join('boards', 'user_boards.id', 'boards.id').where({ user_id }).select('whiteSquare', 'blackSquare', 'board_id').orderBy('board_id');
        } else {
            boards = await db('user_boards');
        }
        return res.status(200).json(boards);
    } catch (error) {
        console.error('Error getting a user\'s boards:', error.message);
        return res.status(500).json({ error: `Failed to get a user's boards: ${error.message}` });
    }
});

// GET route to fetch a board by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let board = await db('boards').where({ id }).first();
        return res.status(200).json(board);
    } catch (error) {
        console.error('Error getting board:', error.message);
        return res.status(500).json({ error: `Failed to get board: ${error.message}` });
    }
});

export default router;
