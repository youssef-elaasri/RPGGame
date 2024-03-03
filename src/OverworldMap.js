class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;


        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage,
            util.inGrid(14.5) - cameraPerson.x,
            util.inGrid(7.5) - cameraPerson.y,
        );
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage,
            util.inGrid(14.5) - cameraPerson.x,
            util.inGrid(7.5) - cameraPerson.y,
        );
    }

    isSpaceTaken(currentX, currentY, direction) {
        const {x,y} = util.nextPosition(currentX,currentY,direction);
        return this.walls[`${x},${y}`] || false;
    }
}


window.OverworldMaps = {
    TestRoom: {
        lowerSrc: "images/maps/landProto.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                isPlayerControlled : true,
                x: util.inGrid(5),
                y:util.inGrid(0)
            }),

            dog: new GameObject({
                src: "images/characters/dog.png",
                x: util.inGrid(2),
                y: util.inGrid(4),
            }),
        },

        walls : {
            [util.asGridCoord(0,-1)] : true,
            [util.asGridCoord(0,0)] : true,
            [util.asGridCoord(1,-1)] : true,
            [util.asGridCoord(1,0)] : true,
        }
    }
}