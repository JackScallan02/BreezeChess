const express = require('express');
const db = require('../db'); // Your Knex instance
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const users = await db('users');
        res.status(200).json(users); // Send all users as JSON response
    } catch (error) {
        console.error('Error getting users:', error.message);
        res.status(500).json({ error: `Failed to get users : ${error.message}` });
    }
});

router.get('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await db('users').where({ uid }).first();
        if (!user) {
            return res.status(200).json({ error: 'User not found' });
        }
        res.status(200).json(user); // Send all users as JSON response
    } catch (error) {
        console.error('Error getting user:', error.message);
        res.status(500).json({ error: `Failed to get user : ${error.message}` });
    }
});

router.post('/', async (req, res) => {
    let { uid, username, email, password } = req.body;

    // Validate request data
    if (!uid || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Insert data into 'users' table
        if (!username) username = null;
        if (!password) password = null;

        const [newUser] = await db('users').insert({
            uid,
            email,
            username: username,
            password: password,
            is_new_user: true,
        }).returning('*');  // Return the newly inserted user

        // Respond with the newly inserted user
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error inserting user:', error.message);
        res.status(500).json({ error: `Failed to insert user : ${error.message}` });
    }
});


router.put('/', async (req, res) => {
    try {
        const { id, ...updates } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const result = await db('users').where({ id }).update(updates);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully'});

    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: `Failed to update user : ${error.message}` });
    }
});

module.exports = router;
