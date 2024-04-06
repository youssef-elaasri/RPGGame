const express = require('express');
const user = require('../controllers/user');
const userRoutes = require('./userRoutes');
const gameRoutes = require('./gameRoutes');

const router = express.Router();

// Apply common middleware
router.use('/api/', user.verifyToken, user.userExists);

// Use specific routers
router.use(userRoutes);
router.use('/api/users/:userId', gameRoutes);

module.exports = router;
