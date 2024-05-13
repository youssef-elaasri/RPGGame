const bcrypt = require('bcrypt');
const jws = require('jws');
const User = require('../models/user');
const Map = require('../models/map');
const savePoint = require('../models/savePoint');
const SECRET_KEY = "9Pc1HZsfUH4Y6bx8+8bIudMm7r8J3y7jQx40yCFtZVg=";
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

            // Assuming 'testroom' map is already created and its ID is known
            const map = await Map.findOne({ where: { map_name: 'testroom' } });
            await savePoint.create({
                UserId: user.id,
                MapId: map.id,
                player_x: 272,
                player_y: 160
            });

            res.status(201).json({ message: 'User registered successfully and default game state set' });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ error: 'Username or email already exists.' });
            }
            console.error('Error during registration:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    },

    async login(req, res) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password must be provided.' });
        }

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
            const token = jws.sign({ header: { alg: 'HS256' }, payload: user.id, secret: SECRET_KEY });
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
    },

    verifyToken(req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(403).json({ error: 'A token is required for authentication' });
        }
        try {
            const userId = jws.decode(token).payload;
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
        const userId = req.params.userId;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both current and new passwords are required.' });
        }

        if (!validPassword(newPassword)) {
            return res.status(400).json({ error: 'Weak new password!' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const match = await bcrypt.compare(currentPassword, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        user.password_hash = hash;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully.' });
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
            console.error('Error checking if user exists:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
