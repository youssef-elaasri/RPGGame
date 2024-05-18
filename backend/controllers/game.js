const { Op } = require('sequelize');
const User = require('../models/user');
const SavePoint = require('../models/savePoint');
const LobbySave = require('../models/lobbySave');
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
                    as: 'savePoint',
                    include: [{ model: Map, as: 'map' }],
                }],
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!user.savePoint) {
                return res.status(404).json({ error: 'No save point found for the user' });
            }

            const lastSavePoint = user.savePoint;

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

            // Check if a save point already exists for this user
            const existingSavePoint = await SavePoint.findOne({
                where: {
                    userId: userId
                }
            });

            let savePoint;
            if (existingSavePoint) {
                // Update the existing save point
                await existingSavePoint.update({
                    player_x: player_x,
                    player_y: player_y,
                    mapId: map.id
                });
                savePoint = existingSavePoint;
            } else {
                // Create a new save point if one does not exist
                savePoint = await SavePoint.create({
                    userId: userId,
                    mapId: map.id,
                    player_x: player_x,
                    player_y: player_y
                });
            }

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
    },
    async lobbySave (req, res) {
        const { userId } = req.params;
        const { mapName } = req.body;
        try {
            const map = await Map.findOne({ where: { map_name: mapName } });

            if (!map) {
                return res.status(404).json({ error: 'Map not found' });
            }

            const mapId = map.id

            if (!mapId) {
                return res.status(500).json({ error: 'Internal error : Map Id not found' });
            }

            // Check if a save point already exists for this user
            const existingSavePoint = await LobbySave.findOne({
                where: {
                    userId: userId
                },
            });

            let lobbySave;

            if (existingSavePoint) {
                // Update the existing save point
                await existingSavePoint.update({
                    mapId: map.id
                });
                lobbySave = existingSavePoint;
            } else {
                // Create a new save point if one does not exist
                lobbySave = await LobbySave.create({
                    userId: userId,
                    mapId: map.id,
                });
        }

            return res.status(201).json({ message: 'Lobby saved successfully', lobbySave });
        } catch (error) {
            console.error('Failed to save lobby:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    async lobbyLoad (req, res) {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        try {
            const user = await User.findByPk(userId, {
                include: [{
                    model: LobbySave,
                    as: 'lobbySave',
                    include: [{ model: Map, as: 'map' }],
                }],
            });

            if (!user.lobbySave) {
                return res.status(404).json({ error: 'Lobby save not found' });
            }
            return res.json(user.lobbySave.map.map_name);
        } catch (error) {
            console.error('Failed to retrieve lobby save:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
};