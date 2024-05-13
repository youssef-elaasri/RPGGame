// This will help store connected users
const players = {}; // This will be sent to all connected users
const playerIds = {}; // Store logged users ids only in the backend for security reasons

function setupSocket (io) {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Receive initial data from a client
        socket.on('registerNewPlayer', (playerData) => {
            // Register the newly logged in player
            players[socket.id] = {
                id: socket.id,
                x: playerData.x,
                y: playerData.y,
                direction: playerData.direction,
                map: playerData.map,
            };
            playerIds[socket.id] = {playerId: playerData.playerId}
            // Send existing players to the newly connected client
            socket.emit('existingPlayers', players);
            // Broadcast new player data to other clients
            socket.broadcast.emit('newPlayer', players[socket.id]);
        });

        // Handle other updates like position changes
        socket.on('updatePosition', (data) => {
            const player = players[socket.id];
            if (player) {
                // Update the player information on the server side with validated data
                player.x = data.x;
                player.y = data.y;
                player.direction = data.direction;
                player.map = data.map;

                // Prepare structured data to send to other clients
                const updatedData = {
                    id: socket.id,
                    x: player.x,
                    y: player.y,
                    direction: player.direction,
                    map: player.map
                };

                // Notify all other clients about this player's movement
                socket.broadcast.emit('playerMoved', updatedData);
            }
        });

        // Handle player disconnection
        socket.on('disconnect', () => {
            console.log('A user disconnected');
            // Remove player from server storage
            delete players[socket.id];
            delete playerIds[socket.id];
            // Notify other clients
            socket.broadcast.emit('playerDisconnected', { id: socket.id });
        });

        // Handle messages
        socket.on('sendMessage', (data) => {
            console.log("Received message from: " + data.sender);
            socket.broadcast.emit('newMessage', data);
        });
    });

    return io;
};

module.exports = {
    setupSocket,
    players,
    playerIds
};