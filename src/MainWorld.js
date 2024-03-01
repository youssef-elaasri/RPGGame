class MainWorld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
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
        const cameraPerson = this.map.gameObjects.hero;
        const step = () => {

            // This clears the canva each time so the are no unwanted frames left
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            //Draw Lower layer
            this.map.drawLowerImage(this.ctx);

            //Draw game object
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow : this.directionInput.direction
                });
                object.sprite.draw(this.ctx, cameraPerson);

            })

            this.map.drawUpperImage(this.ctx)
            
            // Draw the grid FOR DEBUG PURPOSES
            this.drawGrid();

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    init() {
        this.map = new OverworldMap(window.OverworldMaps.TestRoom);
        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.startGameLoop();
        
    }

}
