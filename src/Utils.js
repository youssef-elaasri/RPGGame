

// Method used by the fullscreen icon
function toggleFullscreen() {
    var elem = document.querySelector('.game-window');
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

const util = {
    inGrid(n) {
        return n*16;    
    },
    asGridCoord(x,y) {
        return `${x*16},${y*16}`;
    },
    nextPosition(initialX, initialY, direction) {
        let x = initialX;
        let y = initialY;
        const size = 16;
        if (direction === "left") {
            x -= size;
        }
        else if (direction === "right") {
            x += size;
        }
        else if (direction === "up") {
            y -= size;
        }
        else if (direction === "down") {
            y += size;
        }
        return {x,y};
    },
    setGameObjectsPosition() {
        const map = window.currentMap;
        map.gameObjectsPosition = {};
        for (let key in map.gameObjects) {
            let object = map.gameObjects[key];
            if (!object.isPlayerControlled) {
                let gridCoord = `${object.x},${object.y}`;
                map.gameObjectsPosition[gridCoord] = true;
            }
        }

        for (let key in map.NPCs) {
            let object = map.NPCs[key];
            if (!object.isPlayerControlled) {
                let gridCoord = `${object.x},${object.y}`;
                map.gameObjectsPosition[gridCoord] = true;
            }
        }
    },
    oppositeDirection(currentDirection) {
        const opposites = {
            "up": "down",
            "down": "up",
            "left": "right",
            "right": "left",
        };

        return opposites[currentDirection] || null;
    },

    emitEvent(name, detail){
        const event = new CustomEvent(name, {detail});
        document.dispatchEvent(event);
    },

    addObject(mapName,object, objectName, x, y) {
        window.OverworldMaps[mapName].gameObjects[objectName] = new GameObject({
            src: object.sprite.image.src,
            x: this.inGrid(x),
            y: this.inGrid(y),
        })
        if (object.isMounted) {
            window.OverworldMaps[mapName].walls[`${this.inGrid(x)},${this.inGrid(y-1)}`] = true;
        }
    },

    crateMap(mapName, image) {
        // Create an off-screen canvas
        const offScreenCanvas = document.createElement('canvas');
        const offCtx = offScreenCanvas.getContext('2d');

        // Set off-screen canvas size to image size
        offScreenCanvas.width = image.width;
        offScreenCanvas.height = image.height;

        // Draw the image onto the off-screen canvas
        offCtx.drawImage(image, 0, 0);

        // Get the image data from the off-screen canvas
        const imageData = offCtx.getImageData(0, 0, offScreenCanvas.width, offScreenCanvas.height);
        const data = imageData.data;
        let nameIndex = 0;
        for (let y = 0; y < offScreenCanvas.height; y++) {
            for (let x = 0; x < offScreenCanvas.width; x++) {
              const index = (y * offScreenCanvas.width + x) * 4;
              const red = data[index];
              const green = data[index + 1];
              const blue = data[index + 2];
              const alpha = data[index + 3];
            
            if (red === 0 && green === 0 && blue === 0) {
                this.addObject(mapName,window.mountain11,"mountain11" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 255 && green === 255 && blue === 255) {
                this.addObject(mapName,window.vault1,"vault1" + nameIndex, x,y);
                nameIndex++;
            }
          }

        }
    }

}