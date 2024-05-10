const { Op } = require('sequelize');
const User = require('../models/user');
const SavePoint = require('../models/savePoint');
const Map = require('../models/map');
const CompletedStage = require('../models/completedStage');

module.exports = {
    async loadGame(req, res) {
        const userId = req.params.userId;
        console.log("Loading Game for player:", userId);

        try {
            const user = await User.findByPk(userId, {
                include: [{
                    model: SavePoint,
                    as: 'savePoints',
                    include: [{ model: Map, as: 'map' }],
                    order: [['created_at', 'DESC']],
                    limit: 1,
                }],
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!user.savePoints || user.savePoints.length === 0) {
                return res.status(404).json({ error: 'No save point found for the user' });
            }

            const lastSavePoint = user.savePoints[0];

            const map = lastSavePoint.map;

            const completedStages = await CompletedStage.findAll({
                where: { userId },
                attributes: ['flag'],
            });

            res.json({
                mapName: map.map_name,
                playerX: lastSavePoint.player_x,
                playerY: lastSavePoint.player_y,
                completedStages: completedStages.map(stage => stage.flag),
            });
        } catch (error) {
            console.error('Error retrieving user last game:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },


    async saveGame(req, res) {
        const userId = req.params.userId;
        const { mapName, player_x, player_y, completedStages } = req.body;
        console.log("Saving Game for player:", userId);

        // Basic validation to ensure required parameters are provided
        if (!mapName || player_x == null || player_y == null) {
            return res.status(400).json({ error: 'Missing required fields: mapName, player_x, player_y' });
        }

        try {
            // Ensure that mapName matches case and query parameter in the database
            const map = await Map.findOne({ where: { map_name: mapName } });
            if (!map) {
                return res.status(404).json({ error: 'Map not found' });
            }

            // Create a new save point using consistent field naming as defined in your Sequelize model
            const savePoint = await SavePoint.create({
                userId: parseInt(userId), // Make sure userId is correctly typed as an integer
                mapId: map.id, // Use camelCase as likely defined in your Sequelize model
                player_x: player_x,
                player_y: player_y
            });

            // Handle completed stages if provided
            if (completedStages && completedStages.length > 0) {
                const stageData = completedStages.map(flag => ({ userId: parseInt(userId), flag }));
                await CompletedStage.bulkCreate(stageData, {
                    updateOnDuplicate: ['flag']
                });
            }

            res.status(201).json({ message: 'Save point created successfully', saveId: savePoint.id });
        } catch (error) {
            console.error('Error saving game:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};