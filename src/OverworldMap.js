class OverworldMap {
    
    constructor(config) {
        this.overworld = null;
        this.name = config.name || "";
        this.gameObjects = config.gameObjects || [];

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
        for (let npc of Object.values(this.NPCs)) { // Fixme : 30 can be adjusted !!!!
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
    TestRoom: {
        name: "TestRoom",
        lowerSrc: "src/images/maps/whitepic.png",
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
            securityChief: new NPC({
                name : "securityChief",
                src : "src/images/NPCS/securityChief.png",
                dialogues : {
                    "chiffrement_cesar" : ["Impressive work!", 
                                            "You've resecured our systems and learned a valuable skill in the process. Your ability to handle such a crisis is commendable.",
                                            "As a token of our gratitude, I will tell you a secret to know more about problem solving",
                                            "you see the class at the right ?",
                                            "there you can find a Facility Manager who you can help solving some problem and gain more knowledge"],
                },
                defaultDialogue : ["Thank goodness you're here!",
                "We've suffered a major security breach. Our access systems have been compromised, and sensitive data is at risk.",
                "We need to secure our communications using the Caesar cipher.",
                "It's simple but effective. You need to write a Python function that can encrypt messages given to you by our department heads.",
                "It shifts each letter in the message by a predetermined number down the alphabet.",
                "For example, with a shift of 3, 'A' becomes 'D'.",
                "You'll need to make sure the shift wraps around the end of the alphabet and keeps the letter casing the same."],
                x: util.inGrid(15),
                y:util.inGrid(10),
                challenge : () => util.runChallenge({
                    fileName : "chiffrement_cesar",
                    NPCname: "securityChief"
                })
            }),
            facilityManager: new NPC({
                name : "facilityManager",
                src : "src/images/NPCS/facilityManager.png",
                dialogues : {
                    "tri_batiments" : ["Excellent work! Now, let's allocate the energy accordingly and bring back power where it's needed most.",
                                        "to do that you must talk with Achraf, you will find him in the left classroom.",
                                        "he is a bit stupid, so just try to be nice with him"
                ],
                    "chiffrement_cesar" : ["We're in a dire situation. ",
                    "Our main power grid has been sabotaged, causing blackouts in crucial buildings.",
                    "We need your expertise to manage this crisis efficiently.",
                    "We have a limited amount of energy available, and multiple buildings need power." ,
                    "Each building has a specific energy need and a level of importance.",
                    "Your task is to allocate our scarce resources to maximize the overall importance of the buildings that get powered.",
                    "Start by writing a function that sorts the buildings.",
                    "We need them ordered by the ratio of their importance to energy consumption. The higher the ratio, the higher the priority."
                ],
                },
                defaultDialogue : [
                    "We're in a dire situation. ",
                     "Our main power grid has been sabotaged, causing blackouts in crucial buildings.",
                    "but never mind, I think there is a lot of people here who need your help more than I do"
                ],
                x: util.inGrid(45),
                y:util.inGrid(23),
                challenge: () => util.runChallenge({
                    fileName : "tri_batiments",
                    NPCname : "facilityManager",
                    flags : ["chiffrement_cesar"]
                }),
            }),
            achraf : new NPC ({
                name : "achraf",
                src : "src/images/NPCS/achraf.png",
                dialogues : {
                    
                },
                defaultDialogue : [
                    "..."
                ],
                x: util.inGrid(10),
                y:util.inGrid(23),

            })
        },
        walls : {
        },
        changeMap : {
            [util.asGridCoord(4,-1)] : ["kitchen",[util.inGrid(3),util.inGrid(7)]],
            [util.asGridCoord(5,-1)] : ["kitchen",[util.inGrid(4),util.inGrid(7)]],
        },
    },

    kitchen : {
        name: "Kitchen",
        lowerSrc : "images/maps/kitchen.png",
        changeMap : {
            [util.asGridCoord(3,8)] : ["CPP", [util.inGrid(4),util.inGrid(0)]],
            [util.asGridCoord(4,8)] : ["CPP", [util.inGrid(5),util.inGrid(0)]],
        },
    }
}