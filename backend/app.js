const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Allow all CORS requests
app.use(cors());

// Serve static files (like images) from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Import and use router from the routes directory
const router = require('./routes/router');
app.use(router);

// Export the configured app to be used by server.js
module.exports = app;
