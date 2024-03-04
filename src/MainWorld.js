class MainWorld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
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
            this.map.drawLowerImage(this.ctx);

            // Update game objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow : this.directionInput.direction,
                    map : this.map,
                });
            })

            // Update player
            window.Player.update({
                arrow : this.directionInput.direction,
                map : this.map,
            });

            // initialize the gameObject position
            util.setGameObjectsPosition(this.map);

            //Draw game object
            Object.values(this.map.gameObjects).forEach(object => {
                object.sprite.draw(this.ctx);
            })

            window.Player.sprite.draw(this.ctx);

            Object.values(this.map.NPCs).forEach(object => {
                object.sprite.draw(this.ctx);
            })

            this.map.drawUpperImage(this.ctx)

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
            x: util.inGrid(5),
            y:util.inGrid(0)
        });

        this.map = new OverworldMap(window.OverworldMaps.TestRoom);
        this.directionInput = new DirectionInput();

        document.addEventListener('keydown', e => {
            if (e.key === ' ') {
                if (e.key === ' ') {
                    e.preventDefault(); // Prevent any default action to ensure smooth behavior
                    const nearbyNPC = this.map.findNearbyNPC();
                    if (nearbyNPC) {
                        if (window.dialogueIsShowing) {
                            nearbyNPC.incrementDialogue();
                        } else {
                            nearbyNPC.interact();
                        }
                    }
                }

            }
        });

        this.startGameLoop();
        
    }

}
