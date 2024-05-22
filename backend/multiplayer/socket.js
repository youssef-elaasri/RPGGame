// This will help store connected users
const players = {}; // This will be sent to all connected users
const playerIds = {}; // Store logged users ids only in the backend for security reasons

function setupSocket (io) {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Receive initial data from a client
        socket.on('registerNewPlayer', (playerData) => {
            players[socket.id] = {
                id: socket.id,
                x: playerData.x,
                y: playerData.y,
                username: playerData.username,
                direction: playerData.direction,
                map: playerData.map,
            };
            playerIds[socket.id] = { playerId: playerData.playerId };

            // Join the player to a room named after their current map
            socket.join(playerData.map);

            // Send existing players in the same map to the newly connected client
            const playersInSameMap = Object.values(players).filter(p => p.id !== socket.id && p.map === playerData.map);
            socket.emit('existingPlayers', playersInSameMap);

            // Broadcast new player data to other clients in the same map
            socket.to(playerData.map).emit('newPlayer', players[socket.id]);
        });

        /// Handle other updates like position changes
        socket.on('updatePosition', (data) => {
            if (players[socket.id]) {
                players[socket.id].x = data.x;
                players[socket.id].y = data.y;
                players[socket.id].direction = data.direction;

                // Notify all other clients in the same map about this player's movement
                socket.to(players[socket.id].map).emit('playerMoved', players[socket.id]);
            }
        });

        // Handle map changes
        socket.on('changeMap', (newMap) => {
            const oldMap = players[socket.id].map;
            players[socket.id].map = newMap;
            // Change rooms
            socket.leave(oldMap);
            socket.join(newMap);

            // Notify players in the old map about the departure
            socket.to(oldMap).emit('playerDisconnected', { id: socket.id });

            // Notify players in the new map about the new player
            socket.to(newMap).emit('newPlayer', players[socket.id]);

            // Send existing players in the same map to the player
            const playersInSameMap = Object.values(players).filter(p => p.id !== socket.id && p.map === newMap);
            socket.emit('existingPlayers', playersInSameMap);
        });

        // Handle messages
        socket.on('sendMessage', (data) => {
            const map = players[socket.id].map;
            console.log("Received message from: " + data.sender + " in map: " + map);
            socket.to(map).emit('newMessage', data);
        });

        // Handle player disconnection
        socket.on('disconnect', () => {
            if (players[socket.id]) {
                const map = players[socket.id].map;
                delete players[socket.id];
                delete playerIds[socket.id];
                // Notify other clients in the same map
                socket.to(map).emit('playerDisconnected', { id: socket.id });
            }
        });
    });

    return io;
}

module.exports = {
    setupSocket,
    players,
    playerIds
};