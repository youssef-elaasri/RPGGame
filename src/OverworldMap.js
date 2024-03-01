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

        }
    }
}