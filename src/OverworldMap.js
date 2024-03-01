class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;


        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
    }

    drawLowerImage(ctx) {
        ctx.drawImage(this.lowerImage,0,0);
    }

    drawUpperImage(ctx) {
        ctx.drawImage(this.upperImage,0,0);
    }
}


window.OverworldMaps = {
    TestRoom: {
        lowerSrc: "lower-src.png",
        gameObjects: {
            hero: new Person({
                isPlayerControlled : true,
                x: util.inGrid(5),
                y:util.inGrid(0)
            }),

            npc1: new Person({
                x: util.inGrid(5),
                y:util.inGrid(3),
                src: "images/alex.png"
            })
        }
    }
}