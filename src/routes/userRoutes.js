const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "9Pc1HZsfUH4Y6bx8+8bIudMm7r8J3y7jQx40yCFtZVg=";
const db = require('../db');
const router = express.Router();

router.post('/api/auth/register', async (req, res) => {
    const { username, password, email } = req.body;

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        // Insert user into database
        const query = 'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)';
        db.query(query, [username, hash, email], (error, results)    => {
            if (error) {
                return res.status(400).json({ error: 'Error registering user' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

router.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?'; // Assumes user_id is also selected here
    db.query(query, [username], (error, users) => {
        if (error) {
            return res.status(500).json({ error });
        }
        if (users.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = users[0];

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (result) {
                // Here, use user.user_id to refer to the user's ID
                const token = jwt.sign({ userId: user.user_id }, SECRET_KEY, { expiresIn: '1h' });
                // Include user.user_id in the response
                return res.status(200).json({
                    message: 'Authentication successful',
                    token,
                    userId: user.user_id // Make sure this matches the column name in your database
                });
            } else {
                return res.status(401).json({ message: 'Password is incorrect' });
            }
        });
    });
});


module.exports = router;
