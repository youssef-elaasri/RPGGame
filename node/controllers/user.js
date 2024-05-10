const bcrypt = require('bcrypt');
const jws = require('jws');
const SECRET_KEY = "9Pc1HZsfUH4Y6bx8+8bIudMm7r8J3y7jQx40yCFtZVg=";
const db = require('../db');
const { playerIds } = require('../multiplayer/socket');

function validPassword (password) {
    return /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)
}

module.exports = {
    async register(req, res) {
        const { username, password, email } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'You must specify the username, the email, and the password.' });
        }

        if (!validPassword(password)) {
            return res.status(400).json({ error: 'Weak password!'});
        }

        bcrypt.hash(password, 2, (err, hash) => {
            if (err) {
                return res.status(500).json({error: err});
            }
            // Insert user into database
            const registerQuery = 'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)';
            db.query(registerQuery, [username, hash, email], async (error, results) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({error: 'Username or email already exists.'});
                    } else {
                        console.error('Database error:', error);
                        return res.status(500).json({error: 'Internal server error.'});
                    }
                }
                const userId = results.insertId;
                try {
                // Create default save point
                await db.query('INSERT INTO saved_games (user_id, map_id, player_x, player_y) VALUES (?, (SELECT map_id FROM maps WHERE map_name = ? LIMIT 1), ?, ?)',
                    [userId, "testroom", 272, 160]);
                res.status(201).json({message: 'User registered successfully and default game state set'});

                } catch (err) {
                    console.error('Error setting default game state:', err);
                    res.status(500).json({error: 'Failed to set default game state.'});
                }
            });
        });
    },
    async login(req, res) {
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password must be provided.' });
        }

        try {
            const query = 'SELECT * FROM users WHERE username = ? limit 1';

            db.query(query, [username], async (error, users) => {
                if (error) {
                    console.error('Database error during login:', error);
                    return res.status(500).json({ error: 'Internal server error during login.' });
                }
                if (users.length === 0) {
                    return res.status(401).json({error: 'User not found'});
                }

                const user = users[0];

                // Check if the account is already connected elsewhere
                const isAlreadyConnected = Object.values(playerIds).some(p => p.playerId === user.user_id);
                if (isAlreadyConnected) {
                    return res.status(409).json({error: 'User already connected'});
                }

                // Compare password
                const match = await bcrypt.compare(password, user.password_hash);

                if (match) {
                    // Correctly use `jwt.sign` to generate the token
                    const token = jws.sign({header: {alg: 'HS256'}, payload: user.user_id, secret: SECRET_KEY})

                    // Include user.user_id in the response
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token,
                        userId: user.user_id,
                        email: user.email,
                        username: user.username
                    });
                } else {
                    return res.status(401).json({error: 'Password is incorrect'});
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({error: 'Internal Server Error'});
        }
    },
    verifyToken(req, res, next) {
        if (!req.headers || !req.headers.hasOwnProperty('x-access-token')) {
            throw {code: 403, message: 'Token missing'}
        }

        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(403).json({ error: 'A token is required for authentication' });
        }
        try {
            const userId = jws.decode(token).payload;
            // Token payload contains the userId
            console.log(userId)
            console.log("params :" + req.params.userId )
            if (userId !== req.params.userId) {
                return res.status(401).json({ error: 'Unauthorized: Token does not match user' });
            }
            req.user = userId;
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
    },
    async userExists(req, res, next) {
        const query = 'SELECT * FROM users WHERE user_id = ? LIMIT 1';
        db.query(query, [req.user], (error, users) => {
            if (error) {
                return res.status(500).json({error: 'Database error'});
            }
            if (users.length === 0) {
                return res.status(403).json({error: 'Valid token but user not found in database'});
            }
            next();
        });
    },
    async changePassword(req, res) {
        const { currentPassword, newPassword } = req.body;
        const userId = req.params.userId;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both current and new passwords are required.' });
        }

        if (!validPassword(newPassword)) {
            return res.status(400).json({ error: 'Weak new password!' });
        }

        const query = 'SELECT password_hash FROM users WHERE user_id = ? LIMIT 1';

        db.query(query, [userId], (error, results) => {
            if (error) {
                console.error('Database error during password change:', error);
                return res.status(500).json({ error: 'Internal server error during password change.' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'User not found' });
            }

            const user = results[0];

            bcrypt.compare(currentPassword, user.password_hash, (err, match) => {
                if (err) {
                    return res.status(500).json({ error: 'Error verifying current password' });
                }

                if (!match) {
                    return res.status(401).json({ error: 'Current password is incorrect' });
                }

                // Current password matches, proceed with updating to the new password
                bcrypt.hash(newPassword, 2, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error hashing new password' });
                    }

                    // Update user's password in the database
                    const updateQuery = 'UPDATE users SET password_hash = ? WHERE user_id = ?';
                    db.query(updateQuery, [hash, userId], (error, results) => {
                        if (error) {
                            console.error('Database error while updating password:', error);
                            return res.status(500).json({ error: 'Internal server error while updating password.' });
                        }

                        res.status(200).json({ message: 'Password changed successfully.' });
                    });
                });
            });
        });
    }
}