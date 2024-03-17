class OverworldMap {
    
    constructor(config) {
        this.overworld = null;
        this.gameObjects = config.gameObjects || [];
        this.NPCs = config.NPCs || [];
        this.walls = config.walls || {};
        this.changeMap = config.changeMap || {};
        this.gameObjectsPosition = {}
        this.startPosition = config.startPosition || [0,0];
        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

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
        return this.walls[`${x},${y}`] || this.gameObjectsPosition[`${x},${y}`] || false;
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
    TestRoom: {
        lowerSrc: "images/maps/BG_test.png",
        gameObjects: {
            dog: new GameObject({
                src: "images/characters/dog.png",
                x: util.inGrid(2),
                y: util.inGrid(4),
            }),
        },
        NPCs: {
            ElProfesor: new NPC({
                name : "El Profesor",
                dialogues : ["Hello!", "Welcome to INP Legends."],
                x: util.inGrid(9),
                y:util.inGrid(3)
            }),
            Heisenberg: new NPC({
                name : "Heisenberg",
                dialogues : [
                    "Psst...",
                    "Did you hear about this new revolutionary feature ?",
                    "You can now talk to characters."
                ],
                x: util.inGrid(7),
                y:util.inGrid(3)
            }),
        },
        walls : {
            [util.asGridCoord(0,-1)] : true,
            [util.asGridCoord(0,0)] : true,
            [util.asGridCoord(1,-1)] : true,
            [util.asGridCoord(1,0)] : true,
        },
        changeMap : {
            [util.asGridCoord(4,-1)] : ["kitchen",[util.inGrid(3),util.inGrid(7)]],
            [util.asGridCoord(5,-1)] : ["kitchen",[util.inGrid(4),util.inGrid(7)]],
        },
    },

    kitchen : {
        lowerSrc : "images/maps/kitchen.png",
        changeMap : {
            [util.asGridCoord(3,8)] : ["TestRoom", [util.inGrid(4),util.inGrid(0)]],
            [util.asGridCoord(4,8)] : ["TestRoom", [util.inGrid(5),util.inGrid(0)]],
        },
    }
}