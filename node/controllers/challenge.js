const fs = require('fs');
const path = require('path');

const Docker = require('../dockerManager'); // Assume Docker-related functions are in this module
const docker = new Docker({ image: 'app_image'});

docker.buildImage();
docker.createVolume("mySecretVolume", 1048576); //10MB


module.exports = {
    async python(req, res) {
        if (!req.body.script || !req.body.level) {
            return res.status(400).send('Script or level not specified');
        }

        const filename = `${req.body.level}_suggested.py`;
        const filePath = path.join(__dirname, '..', 'python_scripts', filename);

        try {
            fs.writeFileSync(filePath, req.body.script, 'utf8');
            console.log(`Script written to ${filename}`);
        } catch (error) {
            console.error('Error writing file:', error);
            return res.status(500).send('Failed to write script');
        }

        docker.runContainer(`${req.body.level}`,  'python_scripts', 'mySecretVolume')
            .then(object => res.status(200).send(`${object.statusCode}`))
            .catch(error => {
                console.error('Docker error:', error);
                res.status(500).send('Failed to run Docker container');
            });
    },
    async pythonScript(req, res) {
        if (!req.body.file) {
            return res.status(400).send('No file specified');
        }

        const filePath = path.join(__dirname, '..', 'python_scripts', `${req.body.file}.py`);

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return err.code === 'ENOENT' ?
                    res.status(404).send('File not found') :
                    res.status(500).send('Error reading file');
            }
            res.status(200).send(data);
        })
    }
}


