class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.NPCs = config.NPCs || [];

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;


        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
    }

    drawLowerImage(ctx) {
        ctx.drawImage(
            this.lowerImage,
            util.inGrid(14.5) - window.Player.x,
            util.inGrid(7.5) - window.Player.y,
        );
    }

    drawUpperImage(ctx) {
        ctx.drawImage(
            this.upperImage,
            util.inGrid(14.5) - window.Player.x,
            util.inGrid(7.5) - window.Player.y,
        );
    }
}


window.OverworldMaps = {
    TestRoom: {
        //lowerSrc: "images/maps/faf55f064bb110349ee55ec7ebfcd66e.png",
        lowerSrc: "images/maps/landProto.png",
        upperSrc: "",
        gameObjects: {
            // hero: new Person({
            //     isPlayerControlled : true,
            //     x: util.inGrid(5),
            //     y:util.inGrid(0)
            // }),

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
        }
    }
}