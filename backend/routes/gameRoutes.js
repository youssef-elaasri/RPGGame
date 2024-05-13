const express = require('express');
const game = require('../controllers/game');

const router = express.Router({ mergeParams: true }); // mergeParams is useful to not lose :userId which is defined in the general route in router.js

// Game routes
router.get('/load', game.loadGame);
router.post('/save', game.saveGame);


router.get('/loadLobby', game.lobbyLoad);
router.post('/saveLobby', game.lobbySave);

module.exports = router;