class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.NPCs = config.NPCs || [];
        this.walls = config.walls || {};
        this.gameObjectsPosition = {}

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
                dialogues : ["Hello", "Hey maaaan"],
                x: util.inGrid(9),
                y:util.inGrid(3)
            }),
            Heisenberg: new NPC({
                name : "Heisenberg",
                dialogues : ["Do you want some blue meth?"],
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
    },
}