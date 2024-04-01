const express = require('express');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const cors = require('cors');
app.use(cors()); // This will allow all CORS requests

// Use the routes
app.use(userRoutes);
app.use(gameRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
