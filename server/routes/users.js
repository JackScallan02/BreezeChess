const express = require('express');
const db = require('../db'); // Your Knex instance
const router = express.Router();


// GET route to fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await db('users');
        res.status(200).json(users); // Send all users as JSON response
    } catch (error) {
        console.error('Error getting users:', error.message);
        res.status(500).json({ error: `Failed to get users : ${error.message}` });
    }
});

// Insert new user into the 'users' table
router.post('/', async (req, res) => {
    const { uuid, username, email, password } = req.body;

    // Validate request data
    if (!uuid || !username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Insert data into 'users' table
        const [newUser] = await db('users').insert({
            uuid,
            username,
            is_new_user: true,
            email,
            password,
        }).returning('*');  // Return the newly inserted user

        // Respond with the newly inserted user
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error inserting user:', error.message);
        res.status(500).json({ error: `Failed to insert user : ${error.message}` });
    }
});

module.exports = router;
