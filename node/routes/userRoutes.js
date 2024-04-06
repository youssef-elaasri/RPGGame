const express = require('express');
const user = require('../controllers/user');

const router = express.Router();

// User routes
router.post('/register', user.register);
router.post('/login', user.login);

module.exports = router;