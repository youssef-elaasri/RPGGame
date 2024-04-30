const db = require("../db");


module.exports = {
    async loadGame(req, res) {
        const userId = req.params.userId;
        console.log("Loading Game for player : " + userId)

        // Query the database to get the user's last map and position
        const queryGame = "SELECT m.map_name, s.player_x, s.player_y FROM saved_games s INNER JOIN maps m ON m.map_id = s.map_id WHERE s.user_id = ? ORDER BY s.created_at DESC LIMIT 1;";

        // Query to get the user's completed stages
        const queryStages = "SELECT flag FROM completed_stages WHERE user_id = ?;";

        db.query(queryGame, [userId], (error, results) => {
            if (error) {
                console.error('Error retrieving user last game:', error);
                return res.status(500).json({error: 'Internal server error'});
            }

            if (results.length === 0) {
                return res.status(404).json({error: 'User or last game not found'});
            }

            const {map_name, player_x, player_y} = results[0];

            // Query for completed stages
            db.query(queryStages, [userId], (stageError, stageResults) => {
                if (stageError) {
                    console.error('Error retrieving completed stages:', stageError);
                    // Continue sending the response even if stage data fails to load
                }
                const completedStages = stageResults ? stageResults.map(stage => stage.flag) : [];

                console.log(completedStages)
                // Send the last map, position, and completed stages as the response
                res.json({mapName: map_name, playerX: player_x, playerY: player_y, completedStages});
            });
        });
    },
    async saveGame(req, res) {
        const userId = req.params.userId;
        const {mapName, player_x, player_y, completedStages} = req.body;
        console.log("Saving Game for player : " + userId)
        // Basic validation to ensure required parameters are provided
        if (!mapName || player_x == null || player_y == null) {
            return res.status(400).json({error: 'Missing required fields: mapName, player_x, player_y'});
        }

        const queryGame =
            'INSERT INTO saved_games (user_id, map_id, player_x, player_y) '
            + 'VALUES (?, (SELECT map_id FROM maps WHERE map_name = ? LIMIT 1), ?, ?);';

        db.query(queryGame, [userId, mapName, player_x, player_y], (error, results) => {
            if (error) {
                console.error('Error saving game:', error);
                return res.status(500).json({error: 'Internal server error or map not found'});
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({error: 'Map not found or saving point not created'});
            }

            if (completedStages && completedStages.length > 0) {
                // Handle multiple stages
                completedStages.forEach(stage => {
                    const queryStage = 'INSERT INTO completed_stages (user_id, flag) VALUES (?, ?) ON DUPLICATE KEY UPDATE flag=flag;';
                    db.query(queryStage, [userId, stage], (stageError) => {
                        if (stageError) {
                            console.error('Error saving completed stage:', stageError);
                        }
                    });
                });
            }

            res.status(201).json({message: 'Saving point created successfully', saveId: results.insertId});
        });
    }
}