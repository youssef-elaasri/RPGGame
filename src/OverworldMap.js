class OverworldMap {
    
    constructor(config) {
        this.overworld = null;
        this.name = config.name || "";
        this.gameObjects = config.gameObjects || {};

        this.NPCs = config.NPCs || [];
        this.players = new Map();

        this.walls = config.walls || {};
        this.changeMap = config.changeMap || {};

        //this.gameObjectsPosition = {}

        this.startPosition = config.startPosition || [0,0];
        this.lowerImage = new Image();
        // this.lowerImage.src = config.lowerSrc;

        this.isCutScenePlaying = false;
        this.lobbyDoor = config.lobbyDoor;

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


    async updateMap() {
        const newMap = this.changeMap[`${window.Player.x},${window.Player.y}`];
    
        if (!newMap) return;
    
        const mapName = newMap[0];
        const newCoordinates = newMap[1];
    
        // Function to update player position and change map
        const updateMapAndPlayerPosition = (mapKey, x, y) => {
            this.overworld.startMap(window.OverworldMaps[mapKey]);
            window.Player.x = x;
            window.Player.y = y;
        };
    
        if (mapName === "lobby") {
            try {
                // Save last map when entering the lobby
                await saveLobby(window.currentMap.name);
                updateMapAndPlayerPosition(mapName, newCoordinates[0], newCoordinates[1]);
                saveGame()
                .then(socket.emit('changeMap', mapName))
            } catch (error) {
                console.error('Failed to save lobby:', error);
            }
        } else if (window.currentMap.name === 'lobby') {
            try {
                const res = await loadLobby();
                console.log(res);
                updateMapAndPlayerPosition(res, window.OverworldMaps[res].lobbyDoor[0], window.OverworldMaps[res].lobbyDoor[1]);
                saveGame()
                .then(socket.emit('changeMap', res))
            } catch (error) {
                console.error('Failed to load lobby:', error);
            }
        } else {
            updateMapAndPlayerPosition(mapName, newCoordinates[0], newCoordinates[1]);
            saveGame()
                .then(socket.emit('changeMap', mapName))
        }
    }

    addPlayer(data) {
        this.players.set(data.id ,
                        new Person({
                            isMounted : true,
                            x: data.x,
                            y: data.y,
                            direction: data.direction}));
    }

}


window.OverworldMaps = {
    CPP: {
        name: "CPP",
        gameObjects: {
        },
        NPCs: {
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
                challenge : () => IDE.runChallenge({
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
                challenge: () => IDE.runChallenge({
                    fileName : "tri_batiments",
                    NPCname : "facilityManager",
                    flags : ["chiffrement_cesar"]
                }),
            }),
            achraf : new NPC ({
                name : "achraf",
                src : "src/images/NPCS/achraf.png",
                dialogues : {
                    "distribution_energie" : ["Perfect, that’s exactly what we needed.",
                    "You've really pulled through for us.",
                    "With the schools back up, we can start to rebuild what we lost."],
                    "tri_batiments" : ["Ah, just in time. We're in a tight spot here.",
                    "The AI's sabotage left us with a limited supply of energy and a long list of buildings that need power, especially our schools.", 
                    "Your task will be crucial.",
                    "You need to program the energy distribution system to maximize the number of buildings receiving power with the energy we have left.",
                    "Here’s what you need to do.",
                    "We have a list of buildings sorted by their energy needs.", 
                    "Your job is to write a function called distribution_energie.",
                    "It takes two parameters: a list of buildings and the remaining energy.",
                    "For each building, if we have enough energy left to meet its consumption, we power it up and subtract its energy need from our total reserves.", 
                    "You need to return a list of the buildings that got powered.",
                    "This is where you'll work.", 
                    "The function skeleton is already set up.", 
                    "Just fill in the logic according to the plan I described. Let's get those schools running again."
                ]
                },
                defaultDialogue : [
                    "..."
                ],
                x: util.inGrid(10),
                y:util.inGrid(23),
                challenge: () => IDE.runChallenge({
                    fileName : "distribution_energie",
                    NPCname : "Achraf",
                    flags : ["tri_batiments"]
                }),

            })
        },
        walls : {
        },
        changeMap : {
            [util.asGridCoord(14,7)] : ["lobby",[util.inGrid(13),util.inGrid(21)]],
            [util.asGridCoord(27,48)] : ["E3",[util.inGrid(4),util.inGrid(1)]],
            [util.asGridCoord(28,48)] : ["E3",[util.inGrid(4),util.inGrid(1)]],
            [util.asGridCoord(29,48)] : ["E3",[util.inGrid(4),util.inGrid(1)]],
        },
        lobbyDoor : [util.inGrid(14),util.inGrid(8)]
    },

    lobby : {
        name: "lobby",
        gameObjects: {
        },
        walls : {
        },
        changeMap : {
            [util.asGridCoord(12,22)] : [null, null],
            [util.asGridCoord(13,22)] : [null, null],
        },
    },
    E3 : {
        name : "E3",
        gameObjects : {},
        NPCs : {},
        walls: {},
        changeMap : {
            [util.asGridCoord(4,0)] : ["CPP",[util.inGrid(28),util.inGrid(47)]],
            [util.asGridCoord(13,0)] : ["lobby",[util.inGrid(13),util.inGrid(21)]],
            [util.asGridCoord(7,14)] : ["felma",[util.inGrid(4),util.inGrid(1)]],
            [util.asGridCoord(8,14)] : ["felma",[util.inGrid(4),util.inGrid(1)]],
        },
        lobbyDoor : [util.inGrid(13),util.inGrid(1)]
    },
    felma : {
        name : "felma",
        gameObjects : {},
        NPCs : {},
        walls: {},
        changeMap : {
            [util.asGridCoord(4,0)] : ["CPP",[util.inGrid(28),util.inGrid(47)]],
            [util.asGridCoord(13,0)] : ["lobby",[util.inGrid(13),util.inGrid(21)]],
            [util.asGridCoord(7,14)] : ["papet",[util.inGrid(4),util.inGrid(1)]],
            [util.asGridCoord(8,14)] : ["papet",[util.inGrid(4),util.inGrid(1)]],
        }
    },
    papet : {
        name : "papet",
        gameObjects : {},
        NPCs : {},
        walls: {},
        changeMap : {
            [util.asGridCoord(4,0)] : ["CPP",[util.inGrid(28),util.inGrid(47)]],
            [util.asGridCoord(13,0)] : ["lobby",[util.inGrid(13),util.inGrid(21)]],
            [util.asGridCoord(7,14)] : ["GI",[util.inGrid(4),util.inGrid(1)]],
            [util.asGridCoord(8,14)] : ["GI",[util.inGrid(4),util.inGrid(1)]],
        }
    },
    GI : {
        name : "GI",
        gameObjects : {},
        NPCs : {},
        walls: {},
        changeMap : {
            [util.asGridCoord(4,0)] : ["CPP",[util.inGrid(28),util.inGrid(47)]],
            [util.asGridCoord(13,0)] : ["lobby",[util.inGrid(13),util.inGrid(21)]],
            [util.asGridCoord(7,14)] : ["polytech",[util.inGrid(4),util.inGrid(1)]],
            [util.asGridCoord(8,14)] : ["polytech",[util.inGrid(4),util.inGrid(1)]],
        }
    },
    polytech : {
        name : "polytech",
        gameObjects : {},
        NPCs : {},
        walls: {},
        changeMap : {
            [util.asGridCoord(4,0)] : ["CPP",[util.inGrid(28),util.inGrid(47)]],
            [util.asGridCoord(13,0)] : ["lobby",[util.inGrid(13),util.inGrid(21)]],
            [util.asGridCoord(7,14)] : ["IAE",[util.inGrid(4),util.inGrid(1)]],
            [util.asGridCoord(8,14)] : ["IAE",[util.inGrid(4),util.inGrid(1)]],
        }
    },
    IAE : {
        name : "IAE",
        gameObjects : {},
        NPCs : {},
        walls: {},
        changeMap : {
            [util.asGridCoord(4,0)] : ["CPP",[util.inGrid(28),util.inGrid(47)]],
            [util.asGridCoord(13,0)] : ["lobby",[util.inGrid(13),util.inGrid(21)]],
            [util.asGridCoord(7,14)] : ["imag",[util.inGrid(4),util.inGrid(1)]],
            [util.asGridCoord(8,14)] : ["imag",[util.inGrid(4),util.inGrid(1)]],
        }
    },
    imag : {
        name : "imag",
        gameObjects : {},
        NPCs : {},
        walls: {},
        changeMap : {
            [util.asGridCoord(4,0)] : ["CPP",[util.inGrid(28),util.inGrid(47)]],
            [util.asGridCoord(13,0)] : ["lobby",[util.inGrid(13),util.inGrid(21)]],
        }
    },
}
