const bcrypt = require('bcrypt');
const jws = require('jws');
const SECRET_KEY = "9Pc1HZsfUH4Y6bx8+8bIudMm7r8J3y7jQx40yCFtZVg=";
const db = require('../db');

function validPassword (password) {
    return /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)
}

module.exports = {
    async register(req, res) {
        const {username, password, email} = req.body;

        bcrypt.hash(password, 2, (err, hash) => {
            if (err) {
                return res.status(500).json({error: err});
            }
            // Insert user into database
            const query = 'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)';
            db.query(query, [username, hash, email], (error, results) => {
                if (error) {
                    return res.status(400).json({error: 'Error registering user'});
                }
                res.status(201).json({message: 'User registered successfully'});
            });
        });
    },
    async login(req, res) {
        const {username, password} = req.body;
        try {
            const query = 'SELECT * FROM users WHERE username = ?';

            db.query(query, [username], async (error, users) => {
                if (users.length === 0) {
                    return res.status(401).json({message: 'User not found'});
                }
                if (users.length > 1) {
                    return res.status(500).json({error: 'Internal error : multiple users found'});
                }

                const user = users[0];

                // Compare password
                const match = await bcrypt.compare(password, user.password_hash);

                if (match) {
                    // Correctly use `jwt.sign` to generate the token
                    const token = jws.sign({header: {alg: 'HS256'}, payload: username, secret: SECRET_KEY})

                    // Include user.user_id in the response
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token,
                        userId: user.user_id
                    });
                } else {
                    return res.status(401).json({message: 'Password is incorrect'});
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

        if (!jws.verify(req.headers['x-access-token'], 'HS256', SECRET_KEY)) {
            throw {code: 403, message: 'Token invalid'}
        }
        // Le payload du token contient le login de l'utilisateur
        // On modifie l'objet requête pour mettre le login à disposition pour les middleware suivants
        req.login = jws.decode(req.headers['x-access-token']).payload

        next()
    },
    async userExists(req, res, next) {
        const query = 'SELECT * FROM users WHERE username = ? LIMIT 1';
        db.query(query, [req.login], (error, users) => {
            if (error) {
                return res.status(500).json({error: 'Database error'});
            }
            if (users.length === 0) {
                return res.status(403).json({message: 'Valid token but user not found in database'});
            }
            next();
        });
    }
}