const express = require('express');
const cors = require('cors');


// Initialize the express application
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Allow all CORS requests

// Importing router
const router = require('./routes/router');
app.use(router); // Use the router

// Docker Manager

// Starting the server
const PORT = process.env.PORT || 8080; // Consolidated port configuration
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
