let socket;
function initializeSocket() {
    // Connect to the server
    socket = io('http://localhost:8080');

    socket.on('connect', () => {
        console.log('Connected to the server!');
        // Send initial player data to the server
        const initialPlayerData = {
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
            player.map = data.map;
        }
    });

    // Get list of connected users upon login
    socket.on('existingPlayers', function(players) {
        Object.values(players).forEach(player => {
            console.log(player)
            if (player.id !== socket.id) { // Avoid adding itself
                window.currentMap.addPlayer(player);
            }
        });
    });

    socket.on('newPlayer', function(player) {
        window.currentMap.addPlayer(player);
    });

    socket.on('playerDisconnected', function(data) {
        console.log("Player disconnected:", data.id);
        delete window.currentMap.players[data.id];
    });


    socket.on('newMessage', function(data) {
        console.log("Message sent by :" + data.sender);
        displayMessage(data.message, data.sender);
    });
}

function sendPlayerPosition() {
    const positionData = {
        x: window.Player.x,
        y: window.Player.y,
        direction: window.Player.direction,
        map: window.currentMap.name
    };
    socket.emit('updatePosition', positionData);
}