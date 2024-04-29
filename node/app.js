const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Docker = require('./dockerManager');
const path = require('path');

// Initialize the express application
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Allow all CORS requests

// Importing router
const router = require('./routes/router');
app.use(router); // Use the router

// Docker Manager
const docker = new Docker({ image: 'app_image'});

// Define routes
function configureRoutes() {
    app.get('/ping', (req, res) => {
        docker.createVolume("dockerodeVolume", 5);
        res.status(200).send({ data: 'pong' });
    });

    app.post('/python', (req, res) => {
        if (!req.body.script || !req.body.level) {
            return res.status(400).send('Script or level not specified');
        }

        const filename = `${req.body.level}_suggested.py`;  // Save as "hello_world.py"
        const filePath = path.join(__dirname, 'python_scripts', filename);

        try {
            fs.writeFileSync(filePath, req.body.script, 'utf8');
            console.log(`Script written to ${filename}`);
        } catch (error) {
            console.error('Error writing file:', error);
            return res.status(500).send('Failed to write script');
        }

        docker.runContainer(`${req.body.level}`)
            .then(object => res.status(200).send(`${object.statusCode}`))
            .catch(error => {
                console.error('Docker error:', error);
                res.status(500).send('Failed to run Docker container');
            });
    });

    app.post('/python_script', (req, res) => {
        if (!req.body.file) {
            return res.status(400).send('No file specified');
        }

        const filePath = path.join(__dirname, 'python_scripts', `${req.body.file}.py`);

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return err.code === 'ENOENT' ?
                    res.status(404).send('File not found') :
                    res.status(500).send('Error reading file');
            }
            res.status(200).send(data);
        });
    });

}

configureRoutes();
docker.buildImage();
docker.createVolume("mySecretVolume", 5);
// Starting the server
const PORT = process.env.PORT || 8080; // Consolidated port configuration
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
