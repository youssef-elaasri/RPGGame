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
        const step = () => {

            //Draw Lower layer
            this.map.drawLowerImage(this.ctx);

            //Draw game object
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    
                });
                object.sprite.draw(this.ctx);
            })
            
            // Draw the grid FOR DEBUG PURPOSES
            this.drawGrid();

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    init() {
        this.map = new OverworldMap(window.OverworldMaps.TestRoom)
        this.startGameLoop();
        
    }

}
