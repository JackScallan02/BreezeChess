import express from 'express';
import db from '../db.js';
import Joi from 'joi';
import bcryptjs from 'bcryptjs';

// If this ever gets updated, make sure to update the users test seed
const saltRounds = 11;

const router = express.Router();

// Middleware to validate user data
const validateUser = (req, res, next) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        username: Joi.string().optional().allow(null),
        email: Joi.string().email().required(),
        password: Joi.string().optional().allow(null),
        provider: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// GET route to check if the username already exists
router.get('/exists', async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }
        const countUsers = await db('users').whereRaw('LOWER(username) = ?', username.toLowerCase());
        if (countUsers.length === 0) {
            return res.status(200).json({ exists: false });
        }
        return res.status(200).json({ exists: true });

    } catch (error) {
        console.error('Error checking username existence:', error.message);
        return res.status(500).json({ error: `Failed to check username existence: ${error.message}` });
    }
});

// GET route to fetch users with optional filtering, pagination, and sorting
router.get('/', async (req, res) => {
    try {
        const { uid, email, password, limit = 10, offset = 0, sort_by = 'id', order = 'asc' } = req.query;

        if (uid || email) {
            const user = await db('users').where(uid ? { uid } : { email }).first();
            if (!user || Object.keys(user).length === 0) {
                // Don't want to return a 404 and crash the app
                return res.status(200).json({ error: 'User not found' });
            }

            if (password) {
                if (!user.password) {
                    return res.status(401).json({ error: 'User does not have a password' });
                }

                // Handles sign in verification, but only if a password is provided
                const match = await bcryptjs.compare(password, user.password);
                if (!match) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
            }
            return res.status(200).json(user);
        }

        const users = await db('users')
            .select('id', 'uid', 'username', 'email', 'provider', 'is_new_user')
            .limit(limit)
            .offset(offset)
            .orderBy(sort_by, order);

        return res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error.message);
        return res.status(500).json({ error: `Failed to get users: ${error.message}` });
    }
});


// GET route to fetch a user's info by user id.
// Optional query parameters:
//   include=country — includes country_name and iso_code
//   include=boards — includes selected board info
router.get('/:id/info', async (req, res) => {
    const userId = req.params.id;
    const includeCountry = req.query.include?.includes('country');
    const includeBoard = req.query.include?.includes('boards');

    try {
        // Start building base query
        let query = db('user_info')
            .join('users', 'user_info.user_id', 'users.id')
            .where('users.id', userId);

        // Always select user_info columns
        let columns = ['user_info.*'];

        // Conditionally join countries
        if (includeCountry) {
            query = query.leftJoin('countries', 'user_info.country_id', 'countries.id');
            columns.push(
                'countries.name as country_name',
                'countries.iso_code as country_code'
            );
        }

        // Conditionally join selected board via user_boards and boards
        if (includeBoard) {
            query = query
                .leftJoin('user_boards', function () {
                    this.on('user_boards.user_id', '=', 'user_info.user_id')
                        .andOn('user_boards.board_id', '=', 'user_info.selected_board_id');
                })
                .leftJoin('boards', 'boards.id', 'user_boards.board_id');

            columns.push(
                'boards.name as board_name',
                'boards.description as board_description',
                'boards.rarity as board_rarity',
                'boards.whiteSquare',
                'boards.blackSquare',
                'user_boards.acquired_at as board_acquired_at'
            );
        }

        const userInfo = await query.select(columns).first();

        if (!userInfo) {
            return res.status(404).json({ error: 'User info not found' });
        }

        return res.status(200).json(userInfo);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Failed to get user info: ${error.message}` });
    }
});

// GET route to fetch a user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db('users').where({ id }).first();
        if (!user || Object.keys(user).length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error.message);
        return res.status(500).json({ error: `Failed to get user : ${error.message}` });
    }
});

// POST route to create a new user
router.post('/', validateUser, async (req, res) => {
    const { uid, username, email, password, provider } = req.body;

    let hashedPassword;
    if (password) {
        hashedPassword = await bcryptjs.hash(password, saltRounds);
    }

    try {
        const newUser = await db.transaction(async trx => {
            // 1. Insert into users
            const [createdUser] = await trx('users')
                .insert({
                    uid,
                    email,
                    provider,
                    username: username || null,
                    password: hashedPassword || null,
                    is_new_user: true,
                })
                .returning('*');

            if (!createdUser) {
                throw new Error('Failed to create user');
            }

            // 2. Fetch default boards
            const defaultBoards = await trx('boards')
                .select('id')
                .where('name', 'Default');

            if (defaultBoards.length === 0) {
                throw new Error('No default boards found');
            }

            await trx('user_boards').insert(
                defaultBoards.map(board => ({
                    user_id: createdUser.id,
                    board_id: board.id,
                }))
            );

            // 3. Fetch default pieces (includes color + type)
            const defaultPieces = await trx('pieces')
                .select('id', 'type', 'image_url', 'color')
                .where('name', 'Default');

            if (defaultPieces.length === 0) {
                throw new Error('No default pieces found');
            }

            // Add all pieces to user_pieces
            await trx('user_pieces').insert(
                defaultPieces.map(piece => ({
                    user_id: createdUser.id,
                    piece_id: piece.id,
                }))
            );

            // 4. Build selected_pieces mapping based on color
            const selectedPieces = { 'w': {}, 'b': {} };
            for (const piece of defaultPieces) {
                selectedPieces[piece.color][piece.type] = piece.id;
            }

            // 5. Insert into user_info
            await trx('user_info').insert({
                user_id: createdUser.id,
                country_id: 182,
                selected_pieces: selectedPieces,
            });

            return createdUser;
        });

        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Error inserting user:', error.message);
        return res.status(500).json({ error: `Failed to insert user: ${error.message}` });
    }
});



// PATCH route to update a user
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.password) {
            // Hash the password, if provided
            const hashedPassword = await bcryptjs.hash(updates.password, saltRounds);
            updates.password = hashedPassword;
        }

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'Update params object is required' });
        }

        const result = await db('users').where({ id }).update(updates);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error.message);
        return res.status(500).json({ error: `Failed to update user: ${error.message}` });
    }
});

router.patch('/:id/info', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'Update params object is required' });
        }

        const result = await db('user_info').where('user_id', id).update(updates);
        if (!result) {
            return res.status(404).json({ error: 'User info not found' });
        }
        return res.status(200).json({ message: 'User info updated successfully' });
    } catch (error) {
        console.error('Error updating user info:', error.message);
        return res.status(500).json({ error: `Failed to update user info: ${error.message}` });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db('users').where({ id }).del();
        if (!result) {
            return res.status(404).json({ error: 'User was not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        return res.status(500).json({ error: `Failed to delete user: ${error.message}` });
    }
})

export default router;