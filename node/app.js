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



//

const Docker = require('./dockerManager');
const fs = require('fs');

// Middleware for parsing json. We love json <3
app.use(express.json());
app.use(cors());

class App {
    constructor(config){
        app.listen(
            config.port,
            () => console.log(`app is alive on http://localhost:${config.port}`)
        )
        this.docker = new Docker({image : config.image});
        this.configureRoutes();
    
    }

    configureRoutes(){
        this.ping();
        this.scriptIntercept();
    }

    ping(){
        app.get('/ping', (req, res) => {
            res.status(200).send({data:'pong'})
        })
    }

    scriptIntercept(){
        app.post('/python', (req, res) => {
             const pythonScript = req.body.script;
             fs.writeFileSync('python_scripts/script.py', pythonScript);
             this.docker.runContainer('script')
                 .then(output => res.status(200).send(output))
            
        })
    }
}

inpLegends = new App({
    port: 8080,
    image: 'app_image'
});
