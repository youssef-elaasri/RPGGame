class OverworldMap {
    
    constructor(config) {
        this.overworld = null;

        this.gameObjects = config.gameObjects || {};
        this.NPCs = config.NPCs || [];
        
        this.walls = config.walls || {};
        this.changeMap = config.changeMap || {};
        
        //this.gameObjectsPosition = {}
        
        this.startPosition = config.startPosition || [0,0];
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.isCutScenePlaying = false;

    }

    drawLowerImage(ctx) {
        ctx.drawImage(
            this.lowerImage,
            util.inGrid(14.5) - window.Player.x,
            util.inGrid(7.5) - window.Player.y,
        );
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x,y} = util.nextPosition(currentX,currentY,direction);
        return this.walls[`${x},${y}`] || false;
    }

    addWall(x, y){
        this.walls[`${x},${y}`] = true;
    }

    removeWall(x, y){
        delete this.walls[`${x},${y}`];
    }

    moveWall(prevX, prevY, direction){
        this.removeWall(prevX, prevY);
        const {x, y} = util.nextPosition(prevX, prevY, direction);
        this.addWall(x,y);
    }

    mountObjects(){
        // TODO: determine what objects should be mounted
        Object.keys(this.gameObjects).forEach(key =>{
            let gameObject = this.gameObjects[key];
            gameObject.id = key;
            gameObject.mount(this)
        })
        Object.keys(this.NPCs).forEach(key =>{
            let npc = this.NPCs[key];
            npc.id = key;
            npc.mount(this)
        })
    
    }

    findNearbyNPC() {
        // Iterate through NPCs to find one within interaction range of the player
        for (let npc of Object.values(this.NPCs)) { // fixme : 30 can be adjusted !!!!
            if (Math.abs(npc.x - window.Player.x) <= 16 && Math.abs(npc.y - window.Player.y) <= 16) {
                return npc;
            }
        }
        return null;
    }

    updateMap() {
        const newMap = this.changeMap[`${window.Player.x},${window.Player.y}`]
        if (newMap) {
            this.overworld.startMap(window.OverworldMaps[newMap[0]]);
            window.Player.x = newMap[1][0];
            window.Player.y = newMap[1][1];
        }
    }

}


window.OverworldMaps = {
    CPP: {
        lowerSrc: "images/maps/whitepic.png",
        gameObjects: {
        },
        NPCs: {
            /* ElProfesor: new NPC({
                name : "El Profesor",
                dialogues : ["Hello!", "Welcome to INP Legends."],
                x: util.inGrid(9),
                y:util.inGrid(3),
                behaviorLoop: [
                    { type: "walk", direction: "right"},
                    { type: "walk", direction: "right"},
                    { type: "stand", direction:"right", time: 1000},
                    { type: "walk", direction:"right"},
                    { type: "walk", direction: "right"},
                    { type: "stand", direction:"right", time: 1000},
                    { type: "stand", direction:"left", time: 2000},
                    { type: "walk", direction:"left"},
                    { type: "walk", direction:"left"},
                    { type: "stand", direction:"left", time: 800},
                    { type: "walk", direction:"left"},
                    { type: "walk", direction:"left"},
                    { type: "stand", direction:"left", time: 800},
                    { type: "stand", direction:"right", time: 3000},


                ]
            }), */
            Heisenberg: new NPC({
                name : "Heisenberg",
                dialogues : [
                    "Psst...",
                    "You're late to class.",
                    "To reach the classroom you need to go down the  go on the right."
                ],
                x: util.inGrid(15),
                y:util.inGrid(10),
                behaviorLoop:[
                    {type: "stand", direction:"left", time:1000},
                    {type: "stand", direction:"right", time:2500},
                    {type: "stand", direction:"down", time:3000},
                    {type: "stand", direction:"right", time:800},

                ]
            }),
            Professor: new NPC({
                name : "prof",
                dialogues : [
                    "HEY YOU!",
                    "Why are you always late to class?",
                    "You must solve this puzzle!"
                ],
                x: util.inGrid(45),
                y:util.inGrid(23),
                challenge: () => {
                    fetch('http://localhost:8080/python_script', {
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({file: 'hello_world'})
                })
                .then(response => {
                    if(!response.ok){
                        throw new Error("Response not ok")
                    }

                    return response.text();
                })
                .then(data => {
                    util.displayIDE(data, 'Professor')
                })
                .catch(error => {
                    console.error('fetch operation failed: ', error);
                })

                let runHandler = e =>{
                    fetch('http://localhost:8080/python', {
                        method:'POST',
                        headers:{
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            script: window.editor.getSession().getValue(),
                            level: 'hello_world'
                        })
                    })
                    .then(response => {
                        if(!response.ok){
                            throw new Error("Response not ok")
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log();
                        if(data === '1'){
                            
                            window.currentMap.NPCs[e.detail.doerId].dialogues = [
                                "You've failed miserably.",
                                "But since I'm feeling kind today, I'll let you try again."
                            ];
                        }
                        else{
                            window.currentMap.NPCs[e.detail.doerId].dialogues = [
                                "Good job.",
                            ];
                            window.currentMap.NPCs[e.detail.doerId].challenge = null;
                        }

                        console.log(e.detail.doerId.dialogues);
                        
                        
                    })
                    .catch(error => {
                        console.error('fetch operation failed: ', error);
                    })

                    document.removeEventListener('run', runHandler);
                }

                document.addEventListener("run", runHandler);

                    
                }
            }),
        },
        walls : {
        },
        changeMap : {
            [util.asGridCoord(4,-1)] : ["kitchen",[util.inGrid(3),util.inGrid(7)]],
            [util.asGridCoord(5,-1)] : ["kitchen",[util.inGrid(4),util.inGrid(7)]],
        },
    },

    kitchen : {
        lowerSrc : "images/maps/kitchen.png",
        changeMap : {
            [util.asGridCoord(3,8)] : ["CPP", [util.inGrid(4),util.inGrid(0)]],
            [util.asGridCoord(4,8)] : ["CPP", [util.inGrid(5),util.inGrid(0)]],
        },
    }
}