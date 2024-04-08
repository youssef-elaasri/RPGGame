const express = require('express');
const user = require('../controllers/user');

const router = express.Router({ mergeParams: true });

// User routes
router.post('/register', user.register);
router.post('/login', user.login);

router.post('/api/users/:userId/change-password', user.changePassword);

module.exports = router;