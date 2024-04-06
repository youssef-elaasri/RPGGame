const express = require('express');
const game = require('../controllers/game');

const router = express.Router({ mergeParams: true });

// Game routes
router.get('/load', game.loadGame); // Changed from '/api/users/:userId/load' to '/load' since '/api/users/:userId' is now factored out to the base router
router.post('/save', game.saveGame); // Changed from '/api/users/:userId/save' to '/save' for the same reason

// Route for saving a completed stage
// router.post('/stage/complete', )

module.exports = router;