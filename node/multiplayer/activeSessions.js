let playerIds = {}; // Stores socket.id to playerId mappings

module.exports = {
    addPlayerId: (socketId, playerId) => {
        playerIds[socketId] = playerId;
    },
    removePlayerId: (socketId) => {
        delete playerIds[socketId];
    },
    isPlayerConnected: (playerId) => {
        return Object.values(playerIds).includes(playerId);
    },
    getAllPlayerIds: () => playerIds
};