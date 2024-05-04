module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('player_move', (data) => {
            console.log('Player move:', data);
            socket.broadcast.emit('player_moved', data);
        });

        socket.on('sendMessage', (data) => {
            console.log("Received message from: " + data.sender);
            socket.broadcast.emit('newMessage', data);
        });
    });

    return io;
};