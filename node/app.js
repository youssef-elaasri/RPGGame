const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Allow all CORS requests

const router = require('./routes/router');
app.use(router);

const server = http.createServer(app);

// Properly configure Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "*",  // Allow any origin
        methods: ["GET", "POST"],  // Allow GET and POST methods
        credentials: true  // Allow cookies and headers to be sent
    }
});

// Pass the initialized 'io' to the module
require('./socket')(io);  // Link Socket.IO configuration

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
