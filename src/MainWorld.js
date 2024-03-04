class MainWorld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        window.currentMap = null;
        window.dialogueIsShowing = false;
    }
    
    drawGrid() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const tileSize = 16;
        // Set the stroke style for the grid lines
        this.ctx.strokeStyle = '#ccc'; // Light grey for grid lines

        // Loop through each grid cell
        for (let x = 0; x <= width; x += tileSize) {
            for (let y = 0; y <= height; y += tileSize) {
                // Draw a rectangle for each grid cell
                this.ctx.strokeRect(x, y, tileSize, tileSize);
            }
        }
    }
    
    startGameLoop() {
        const step = () => {

            // This clears the canva each time so there are no unwanted frames left
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            // Draw Lower layer
            window.currentMap.drawLowerImage(this.ctx);

            // Update game objects
            Object.values(window.currentMap.gameObjects).forEach(object => {
                object.update({
                    arrow : this.directionInput.direction,
                    map : window.currentMap,
                });
            })

            // Update player
            window.Player.update({
                arrow : this.directionInput.direction,
                map : window.currentMap,
            });

            // initialize the gameObject position
            util.setGameObjectsPosition(window.currentMap);

            window.upperObjects = [];
            window.drawingLowerObjects = false;

            //Draw game object
            Object.values(window.currentMap.gameObjects).forEach(object => {
                object.sprite.draw(this.ctx);
            })

            window.Player.sprite.draw(this.ctx);

            // draw all the NPCs
            Object.values(window.currentMap.NPCs).forEach(object => {
                object.sprite.draw(this.ctx);
            })

            window.drawingLowerObjects = true;
            // draw the hero
            window.Player.sprite.draw(this.ctx);


            //draw the upper objects and NPCs
            for (let key in window.upperObjects) {
                let object = window.upperObjects[key];
                object.draw(this.ctx);
            }

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    init() {
        /* The Player */
        window.Player = new Person({
            isPlayerControlled : true,
            x: util.inGrid(10),
            y:util.inGrid(10)
        });

        window.currentMap = new OverworldMap(window.OverworldMaps.TestRoom);
        this.directionInput = new DirectionInput();

        this.startGameLoop();
        
    }

}
