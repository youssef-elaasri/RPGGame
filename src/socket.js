let socket;
function initializeSocket() {
    // Connect to the server
    socket = io('http://localhost:8080');

    socket.on('connect', () => {
        console.log('Connected to the server!');
        // Send initial player data to the server
        const initialPlayerData = {
            playerId: window.Player.id,
            x: window.Player.x,
            y: window.Player.y,
            direction: window.Player.direction,
            map: window.currentMap.name
        };
        socket.emit('registerNewPlayer', initialPlayerData);

        // Set up a timer to send position updates every second
        setInterval(sendPlayerPosition, 20);
    });

    socket.on('playerMoved', function(data) {
        const player = window.currentMap.players.get(data.id);
        if (player) {
            // Update the player's position and other properties
            player.x = data.x;
            player.y = data.y;
            player.direction = data.direction;
        } else {
            if (data.id !== socket.id) { // Avoid adding itself
                window.currentMap.addPlayer(data);
            }
        }
    });

    // Get list of connected users upon login
    socket.on('existingPlayers', function(players) {
        // Add only players who are in the same map
        Object.values(players).forEach(player => {
            window.currentMap.addPlayer(player);
        });
    });

    socket.on('newPlayer', function(player) {
        console.log(player)
        window.currentMap.addPlayer(player);
    });

    // Remove player when he changes map or disconnects
    socket.on('playerDisconnected', function(data) {
        delete window.currentMap.players.delete(data.id);
    });


    socket.on('newMessage', function(data) {
        console.log("Message sent by :" + data.sender);
        displayMessage(data.message, data.sender);
    });

    // Handle server shutdown or disconnect
    socket.on('disconnect', function(reason) {
        console.log('Disconnected from server, reason:', reason);
        // Delay before reloading
        console.log("Reloading page in 5 seconds...");
        setTimeout(() => {
            window.location.reload();
        }, 5000); // Reload after 5 seconds delay
    });
}

function sendPlayerPosition() {
    const positionData = {
        x: window.Player.x,
        y: window.Player.y,
        direction: window.Player.direction,
    };
    socket.emit('updatePosition', positionData);
}