let socket;
function initializeSocket() {
    // Connect to the server
    socket = io('http://localhost:8080');
    socket.on('connect', () => {
        console.log('Connected to the server!');
        // Emit events or handle data
    });

    socket.on('player_moved', function(data){
        console.log('Player moved', data);
        // Update the game world based on this data
        sendMove(window.Player.x, window.Player.y)
    });

    socket.on('newMessage', function(data) {
        console.log("Message sent by :" + data.sender);
        displayMessage(data.message, data.sender);
    });
}


// You can emit events like this:
function sendMove(x, y) {
    socket.emit('player_move', { x: x, y: y });
}