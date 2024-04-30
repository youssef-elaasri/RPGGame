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
            adventurer : new NPC({
                name : "adventurer",
                src : "src/images/NPCS/adventurer.png",
                dialogues : {
                    "convert_to_float" : [
                        "Analysis of the output initiated...", 
                        "Processing complete.",
                        "The function has successfully restored data integrity for our experimental results.",
                        "You have neutralized one of the AI’s disruptive tactics.",
                        "With the data corrected, I recommend deploying diagnostic scripts to identify further system anomalies.",
                        "Your proficiency with algorithms will be paramount.",
                    ]
                },
                defaultDialogue : [
                    "Greetings, User! My programming has detected anomalies in data processing modules due to sabotage by the rogue AI.",
                    "I require human intelligence to correct these errors.",
                    "The AI has jumbled the numerical outputs of our experiments, intermixing valid numerical strings with gibberish.", 
                    "We need to filter and convert these readings to utilize them in restoring system functionalities.",
                    "In cases of failed conversion, replace it with None.",
                    "This will allow my systems to identify and disregard corrupt data while maintaining array integrity for further analysis.",
                    "Please proceed with the following template. Adapt it as necessary to ensure robust data cleansing."
                ],
                x: util.inGrid(15),
                y:util.inGrid(10),
                challenge : () => util.runChallenge({
                    fileName : "convert_to_float",
                    NPCname: "adventurer"
                })
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