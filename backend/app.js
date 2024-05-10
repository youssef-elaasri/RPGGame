const express = require('express');
const cors = require('cors');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Allow all CORS requests
app.use(cors());

// Import and use router from the routes directory
const router = require('./routes/router');
app.use(router);

// Export the configured app to be used by server.js
module.exports = app;
