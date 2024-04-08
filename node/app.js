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
        this.docker.buildImage();
    
    }

    configureRoutes(){
        this.ping();
        this.scriptIntercept();
        this.scriptGet();
    }

    ping(){
        app.get('/ping', (req, res) => {
            res.status(200).send({data:'pong'})
        })
    }

    scriptIntercept(){
        app.post('/python', (req, res) => {
            const pythonScript = req.body.script;
            fs.writeFileSync(`python_scripts/${req.body.level}_suggested.py`, pythonScript);
            this.docker.runContainer(`${req.body.level}`)
            .then(object => res.status(200).send(`${object.statusCode}`))
            
        })
    }

    scriptGet(){
        app.post('/python_script', (req,res)=>{
            let filePath = `python_scripts/${req.body.file}.py`
            fs.readFile(filePath, 'utf8', (err,data) => {
                if(err){
                    console.error('Error reading file: ', err);
                    return;
                }
                res.status(200).send(data)
            })
        })
    }
}

inpLegends = new App({
    port: 8080,
    image: 'app_image'
});
