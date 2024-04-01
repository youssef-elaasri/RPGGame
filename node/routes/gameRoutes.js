const express = require('express');
const db = require('../db');
const router = express.Router();

// Route for saving a completed stage
router.post('/stage/complete', (req, res) => {
    // Implement stage completion saving logic here
});

router.get('/api/users/:userId/last-game', (req, res) => {
    const userId = req.params.userId;

    // Query the database to get the user's last map and position
    const query = "SELECT m.map_name, s.player_x, s.player_y FROM saved_games s INNER JOIN maps m ON m.map_id = s.map_id WHERE s.user_id = ? ORDER BY s.created_at DESC LIMIT 1;";

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error retrieving user last game:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Check if the user's last game was found
        if (results.length === 0) {
            return res.status(404).json({ error: 'User or last game not found' });
        }

        // Extract the last map and position from the database results
        const { map_name, player_x, player_y } = results[0];

        // Send the last map and position as the response
        res.json({ mapName: map_name, playerX: player_x, playerY: player_y });
    });
});


router.post('/api/users/:userId/saves', (req, res) => {
    const userId = req.params.userId;
    const { mapName, player_x, player_y } = req.body;

    // Basic validation to ensure required parameters are provided
    if (!mapName || player_x == null || player_y == null) {
        return res.status(400).json({ error: 'Missing required fields: mapName, player_x, player_y' });
    }

    const query =
        'INSERT INTO saved_games (user_id, map_id, player_x, player_y) '
      + 'VALUES (?, (SELECT map_id FROM maps WHERE map_name = ? LIMIT 1), ?, ?);';

    db.query(query, [userId, mapName, player_x, player_y], (error, results) => {
        if (error) {
            console.error('Error creating saving point:', error);
            // This error might also occur if the map_name does not exist, so you might want to check for that case explicitly.
            return res.status(500).json({ error: 'Internal server error or map not found' });
        }

        // Check if the map was found and the saving point was created successfully
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Map not found or saving point not created' });
        }

        res.status(201).json({ message: 'Saving point created successfully', saveId: results.insertId });
    });
});


module.exports = router;
