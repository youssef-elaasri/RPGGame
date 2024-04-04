

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

    createAllObjects() {
        window.dog = new GameObject({
            src: "images/characters/dog.png",
        });

        window.shcoolFloor = new GameObject({
            src : "images/sprites/shcoolFloor.png"
        })

        window.whiteSpace = new GameObject({
            src : "images/sprites/whiteSpace.png",
            isMounted : true,
        })

        window.leftDownShcoolwall = new GameObject({
            src : "images/sprites/shcoolWall/leftDownShcoolwall.png",
            isMounted : true
        })
        
        window.rightDownShcoolWall = new GameObject({
            src : "images/sprites/shcoolWall/rightDownShcoolWall.png",
            isMounted : true
        })

        window.downShcoolWall = new GameObject({
            src : "images/sprites/shcoolWall/downShcoolWall.png",
            isMounted : true
        })

        window.leftShcoolWall = new GameObject({
            src : "images/sprites/shcoolWall/leftShcoolWall.png",
            isMounted : true
        })

        window.rightShcoolWall = new GameObject({
            src : "images/sprites/shcoolWall/rightShcoolWall.png",
            isMounted : true
        })

        window.shcoolWall = new GameObject({
            src : "images/sprites/shcoolWall/shcoolWall.png",
            isMounted : true
        })

        window.closet31 = new GameObject({
            src : "images/sprites/closet/31.png",
            isMounted : true
        })

        window.closet32 = new GameObject({
            src : "images/sprites/closet/32.png",
            isMounted : true
        })

        window.closet21 = new GameObject({
            src : "images/sprites/closet/21.png",
            isMounted : true
        })

        window.closet22 = new GameObject({
            src : "images/sprites/closet/22.png",
            isMounted : true
        })

        window.closet11 = new GameObject({
            src : "images/sprites/closet/11.png",
            isMounted : true
        })

        window.closet12 = new GameObject({
            src : "images/sprites/closet/12.png",
            isMounted : true
        })

        window.chalkboard11 = new GameObject({
            src : "images/sprites/chalkboard/11.png",
            isMounted : true
        })

        window.chalkboard12 = new GameObject({
            src : "images/sprites/chalkboard/12.png",
            isMounted : true
        })

        window.chalkboard13 = new GameObject({
            src : "images/sprites/chalkboard/13.png",
            isMounted : true
        })

        window.chalkboard21 = new GameObject({
            src : "images/sprites/chalkboard/21.png",
            isMounted : true
        })

        window.chalkboard22 = new GameObject({
            src : "images/sprites/chalkboard/22.png",
            isMounted : true
        })

        window.chalkboard23 = new GameObject({
            src : "images/sprites/chalkboard/23.png",
            isMounted : true
        })
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
                this.addObject(mapName,window.whiteSpace,"whiteSpace" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 255 && green === 255 && blue === 255) {
                this.addObject(mapName,window.shcoolFloor,"shcoolFloor" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red ===0 && green === 255 && blue === 0) {
                this.addObject(mapName,window.leftDownShcoolwall,"leftDownShcoolwall" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red ===0 && green === 0 && blue === 255) {
                this.addObject(mapName,window.rightDownShcoolWall,"rightDownShcoolWall" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red ===255 && green === 0 && blue === 0) {
                this.addObject(mapName,window.downShcoolWall,"downShcoolWall" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red ===255 && green === 0 && blue === 255) {
                this.addObject(mapName,window.leftShcoolWall,"leftShcoolWall" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 0 && green === 255 && blue === 255) {
                this.addObject(mapName,window.rightShcoolWall,"rightShcoolWall" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 255 && green === 255 && blue === 0) {
                this.addObject(mapName,window.shcoolWall,"shcoolWall" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 4 && green === 0 && blue === 0) {
                this.addObject(mapName,window.closet31,"closet31" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 0 && green === 4 && blue === 0) {
                this.addObject(mapName,window.closet32,"closet32" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 0 && green === 0 && blue === 4) {
                this.addObject(mapName,window.closet21,"closet21" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 4 && green === 4 && blue === 0) {
                this.addObject(mapName,window.closet22,"closet22" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 4 && green === 0 && blue === 4) {
                this.addObject(mapName,window.closet11,"closet11" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 0 && green === 4 && blue === 4) {
                this.addObject(mapName,window.closet12,"closet2" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 177 && green === 0 && blue === 0) {
                this.addObject(mapName,window.chalkboard21,"chalkboard21" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 177 && green === 0 && blue === 1) {
                this.addObject(mapName,window.chalkboard23,"chalkboard23" + nameIndex, x,y);
                nameIndex++;
            }
          }

        }
    }

}