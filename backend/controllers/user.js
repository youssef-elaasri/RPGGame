const bcrypt = require('bcrypt');
const jws = require('jws');
const User = require('../models/user');
const Map = require('../models/map');
const SavePoint = require('../models/savePoint'); // Ensure correct casing
const { TOKENSECRET } = process.env; // Corrected destructuring
const { playerIds } = require('../multiplayer/socket');

function validPassword(password) {
    return /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)
}

module.exports = {
    async register(req, res) {
        const { username, password, email } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'You must specify the username, the email, and the password.' });
        }

        if (!validPassword(password)) {
            return res.status(400).json({ error: 'Weak password!' });
        }

        try {
            const hash = await bcrypt.hash(password, 10);
            const user = await User.create({ username, password_hash: hash, email });

            const map = await Map.findOne({ where: { map_name: 'CPP' } });
            if (!map) {
                return res.status(500).json({ error: 'Internal server error - Default map not found.' });
            }

            await SavePoint.create({
                userId: user.id,
                mapId: map.id,
                player_x: 272,
                player_y: 160
            });

            res.status(201).json({ message: 'User registered successfully and default game state set' });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ error: 'Username or email already exists.' });
            }
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    async login(req, res) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password must be provided.' });
        }

        try {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Check if the account is already connected elsewhere
            const isAlreadyConnected = Object.values(playerIds).some(p => p.playerId === user.id);
            if (isAlreadyConnected) {
                return res.status(409).json({ error: 'User already connected' });
            }

            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                const token = jws.sign({ header: { alg: 'HS256' }, payload: user.id, secret: TOKENSECRET });
                res.status(200).json({
                    message: 'Authentication successful',
                    token,
                    userId: user.id,
                    email: user.email,
                    username: user.username
                });
            } else {
                return res.status(401).json({ error: 'Password is incorrect' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    verifyToken(req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(403).json({ error: 'A token is required for authentication' });
        }
        try {
            if (!jws.verify(token, 'HS256', TOKENSECRET)) {
                return res.status(401).json({ error: 'Unauthorized: Invalid token' });
            }
            const decoded = jws.decode(token);
            if (!decoded) {
                return res.status(500).json({ error: 'Internal server error - Token decoding failed' });
            }
            const userId = decoded.payload;
            if (userId !== req.params.userId) {
                return res.status(401).json({ error: 'Unauthorized: Token does not match user' });
            }
            req.user = userId;
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
    },

    async changePassword(req, res) {
        const { currentPassword, newPassword } = req.body;
        const user = req.user;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both current and new passwords are required.' });
        }

        if (!validPassword(newPassword)) {
            return res.status(400).json({ error: 'Weak new password!' });
        }

        try {
            const match = await bcrypt.compare(currentPassword, user.password_hash);
            if (!match) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }

            const hash = await bcrypt.hash(newPassword, 10);
            user.password_hash = hash;
            await user.save();
            res.status(200).json({ message: 'Password changed successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    async userExists(req, res, next) {
        const userId = req.params.userId;

        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
