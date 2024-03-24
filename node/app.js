const Docker = require('./dockerManager')
const express = require('express');
const fs = require('fs')
const cors = require('cors')


const app = express();

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
            this.docker.buildImageAndRunContainer('script')
            .then(output => res.status(200).send(output))
            
        })
    }
}

inpLegends = new App({
    port: 8080,
    image: 'app_image'
});


