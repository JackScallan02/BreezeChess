import express from 'express';
import db from '../db.js';
import Joi from 'joi';

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
        const { uid, email, limit = 10, offset = 0, sort_by = 'id', order = 'asc' } = req.query;

        if (uid || email) {
            const user = await db('users').where(uid ? { uid } : { email }).first();
            if (!user || Object.keys(user).length === 0) {
                // Don't want to return a 404 and crash the app
                return res.status(200).json({ error: 'User not found' });
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
// Optional query parameter to include country name/code
router.get('/:id/info', async (req, res) => {
    const userId = req.params.id;
    const includeCountry = req.query.include && req.query.include.includes('country'); // Check if country is requested
  
    try {
      let query = db('user_info')
        .join('users', 'user_info.user_id', 'users.id')
        .where('users.id', userId);
  
      // Conditionally join the countries table if requested
      if (includeCountry) {
        query = query.join('countries', 'user_info.country_id', 'countries.id')
                     .select('user_info.*', 'countries.name as country_name', 'countries.iso_code as country_code');
      } else {
        query = query.select('user_info.*');
      }
  
      const userInfo = await query.first();
  
      if (!userInfo || Object.keys(userInfo).length === 0) {
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

    try {
        const [newUser] = await db('users').insert({
            uid,
            email,
            provider,
            username: username || null,
            password: password || null,
            is_new_user: true,
        }).returning('*');

        if (!newUser) {
            return res.status(400).json({ error: 'Failed to create user' });
        }

        // Create a new user_info entry for the new user
        await db('user_info').insert({
            user_id: newUser.id,
            country_id: 183, // Default to 'United States' for now...
        }).returning('*');

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

export default router;