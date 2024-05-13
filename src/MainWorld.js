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

            // update map
            window.currentMap.updateMap();

            // Update game objects, NPCs and players
            Object.values(window.currentMap.gameObjects).forEach(object => {
                object.update({
                    arrow : this.directionInput.direction,
                    map : window.currentMap,
                });
            })
            Object.values(window.currentMap.NPCs).forEach(object => {
                object.update({
                    arrow : this.directionInput.direction,
                    map : window.currentMap,
                });
            })
            window.currentMap.players.forEach((value, key) => {
                value.update({
                    arrow : value.direction,
                    map : window.currentMap,
                });
            });

            // Update player
            window.Player.update({
                arrow : this.directionInput.direction,
                map : window.currentMap,
            });

            // initialize the gameObject position
            // util.setGameObjectsPosition(window.currentMap);

            window.upperObjects = [];
            window.drawingLowerObjects = false;

            //Draw game object
            Object.values(window.currentMap.gameObjects).forEach(object => {
                object.sprite.draw(this.ctx);
            })

            //window.Player.sprite.draw(this.ctx);

            // draw all the NPCs
            Object.values(window.currentMap.NPCs).forEach(object => {
                object.sprite.draw(this.ctx);
            })

            // draw all the players
            window.currentMap.players.forEach((value, key) => {
                value.sprite.draw(this.ctx);
            });


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

    startMap(mapConfig) {
        window.currentMap = new OverworldMap(mapConfig);
        window.currentMap.overworld = this;
        window.currentMap.mountObjects();
    }

    async init(userId) {
        try {
            // Load the saved game state for the given user
            const gameState = await loadGame(userId);

            // Convert loaded stages to a dictionary with true as value
            const flags = gameState.completedStages.reduce((acc, flag) => {
                addCompletedStage(flag)
                acc[flag] = true;
                return acc;
            }, {});

            console.log(flags);
            // If a saved game state exists, use it to initialize the player and map
            window.Player = new Person({
                isPlayerControlled: true,
                x: gameState.playerX, // Use the loaded X position
                y: gameState.playerY, // Use the loaded Y position
                id: userId,
                storyFlags: flags,
            });

            util.createAllObjects();

            util.prepareMAP("TestRoom",'src/images/maps/CPP.png' );
            util.prepareMAP("kitchen",'src/images/maps/E3.png' );

            
            this.startMap(window.OverworldMaps[gameState.mapName]);

            // Start capturing direction input
            this.directionInput = new DirectionInput();

            // Initialize socket for multiplayer stuff
            initializeSocket();

            // Start the game loop
            this.startGameLoop();
        } catch (error) {
            console.error('Failed to initialize game:', error);
            // Handle initialization failure (e.g., show an error message to the user)
        }
    }


}
