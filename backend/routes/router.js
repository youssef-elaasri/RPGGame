const express = require('express');
const user = require('../controllers/user');
const userRoutes = require('./userRoutes');
const gameRoutes = require('./gameRoutes');
const challengeRoutes = require('./challengeRoutes')

const router = express.Router();

// Apply common middleware
router.use('/api/users/:userId', user.verifyToken, user.userExists);

// Use specific routers
router.use(userRoutes);
router.use('/api/users/:userId', gameRoutes);
router.use(challengeRoutes);

module.exports = router;
