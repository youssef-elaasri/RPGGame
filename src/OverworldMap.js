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
}


window.OverworldMaps = {
    TestRoom: {
        lowerSrc: "images/maps/landProto.png",
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
                dialogues : ["Hello"],
                x: util.inGrid(9),
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