const http = require('http');
const socketIo = require('socket.io');
const app = require('./app'); // Import the configured Express app

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Properly configure Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "*",  // Allow any origin
        methods: ["GET", "POST"],  // Allow GET and POST methods
        credentials: true  // Allow cookies and headers to be sent
    }
});

// Set up the socket for multiplayer mode
const { setupSocket } = require('./multiplayer/socket');
setupSocket(io);

// Read the PORT from environment variables or use 8080 as a fallback
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
