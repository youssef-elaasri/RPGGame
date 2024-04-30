const util = {
    toggleFullscreen() {
        let elem = document.querySelector('.game-window');
        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    },
    gameInit(userId) {
        const mainWorld = new MainWorld({
                element: document.querySelector(".game-container")
            }
        );
        mainWorld.init(userId);
    },
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
            src: "src/images/characters/dog.png",
        });

        window.shcoolFloor = new GameObject({
            src : "src/images/sprites/shcoolFloor.png"
        })

        window.whiteSpace = new GameObject({
            src : "src/images/sprites/whiteSpace.png",
            isMounted : true,
        })

        window.leftDownShcoolwall = new GameObject({
            src : "src/images/sprites/shcoolWall/leftDownShcoolwall.png",
            isMounted : true
        })

        window.rightDownShcoolWall = new GameObject({
            src : "src/images/sprites/shcoolWall/rightDownShcoolWall.png",
            isMounted : true
        })

        window.downShcoolWall = new GameObject({
            src : "src/images/sprites/shcoolWall/downShcoolWall.png",
            isMounted : true
        })

        window.leftShcoolWall = new GameObject({
            src : "src/images/sprites/shcoolWall/leftShcoolWall.png",
            isMounted : true
        })

        window.rightShcoolWall = new GameObject({
            src : "src/images/sprites/shcoolWall/rightShcoolWall.png",
            isMounted : true
        })

        window.shcoolWall = new GameObject({
            src : "src/images/sprites/shcoolWall/shcoolWall.png",
            isMounted : true
        })

        window.closet31 = new GameObject({
            src : "src/images/sprites/closet/31.png",
            isMounted : true
        })

        window.closet32 = new GameObject({
            src : "src/images/sprites/closet/32.png",
            isMounted : true
        })

        window.closet21 = new GameObject({
            src : "src/images/sprites/closet/21.png",
            isMounted : true
        })

        window.closet22 = new GameObject({
            src : "src/images/sprites/closet/22.png",
            isMounted : true
        })

        window.closet11 = new GameObject({
            src : "src/images/sprites/closet/11.png",
            isMounted : true
        })

        window.closet12 = new GameObject({
            src : "src/images/sprites/closet/12.png",
            isMounted : true
        })

        window.chalkboard11 = new GameObject({
            src : "src/images/sprites/chalkboard/11.png",
            isMounted : true
        })

        window.chalkboard12 = new GameObject({
            src : "src/images/sprites/chalkboard/12.png",
            isMounted : true
        })

        window.chalkboard13 = new GameObject({
            src : "src/images/sprites/chalkboard/13.png",
            isMounted : true
        })

        window.chalkboard21 = new GameObject({
            src : "src/images/sprites/chalkboard/21.png",
            isMounted : true
        })

        window.chalkboard22 = new GameObject({
            src : "src/images/sprites/chalkboard/22.png",
            isMounted : true
        })

        window.chalkboard23 = new GameObject({
            src : "src/images/sprites/chalkboard/23.png",
            isMounted : true
        })

        window.classRoomFloor = new GameObject({
            src : "src/images/sprites/classRoomFloor.png",
        })

        window.leftTable = new GameObject({
            src : "src/images/sprites/table/left.png",
            isMounted : true,
        })

        window.rightTable = new GameObject({
            src : "src/images/sprites/table/right.png",
            isMounted : true,
        })

        window.chair1 = new GameObject({
            src : "src/images/sprites/chair/chair1.png",
            isMounted : true,
        })

        window.chair2 = new GameObject({
            src : "src/images/sprites/chair/chair2.png",
            isMounted : true,
        })

        window.door11 = new GameObject({
            src : "src/images/sprites/door/11.png",
            isMounted : true,
        })

        window.door21 = new GameObject({
            src : "src/images/sprites/door/21.png",
            isMounted : true,
        })

        window.door31 = new GameObject({
            src : "src/images/sprites/door/31.png",
            isMounted : true,
        })

        window.painting = new GameObject({
            src : "src/images/sprites/painting.png",
            isMounted : true,
        })

        window.bookcase11 = new GameObject({
            src : "src/images/sprites/bookcase/11.png",
            isMounted : true,
        })

        window.bookcase12 = new GameObject({
            src : "src/images/sprites/bookcase/12.png",
            isMounted : true,
        })

        window.bookcase13 = new GameObject({
            src : "src/images/sprites/bookcase/13.png",
            isMounted : true,
        })

        window.bookcase21 = new GameObject({
            src : "src/images/sprites/bookcase/21.png",
            isMounted : true,
        })

        window.bookcase22 = new GameObject({
            src : "src/images/sprites/bookcase/22.png",
            isMounted : true,
        })

        window.bookcase23 = new GameObject({
            src : "src/images/sprites/bookcase/23.png",
            isMounted : true,
        })

        window.bookcase31 = new GameObject({
            src : "src/images/sprites/bookcase/31.png",
            isMounted : true,
        })

        window.bookcase32 = new GameObject({
            src : "src/images/sprites/bookcase/32.png",
            isMounted : true,
        })

        window.bookcase33 = new GameObject({
            src : "src/images/sprites/bookcase/33.png",
            isMounted : true,
        })

        window.stall = new GameObject({
            src : "src/images/sprites/stall.png",
            isMounted : true,
        })

        window.closedDoor1 = new GameObject({
            src : "src/images/sprites/closedDoor/1.png",
            isMounted : true,
        })

        window.closedDoor2 = new GameObject({
            src : "src/images/sprites/closedDoor/2.png",
            isMounted : true,
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
            else if (red === 177 && green === 0 && blue === 2) {
                this.addObject(mapName,window.chalkboard22,"chalkboard22" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 177 && green === 0 && blue === 3) {
                this.addObject(mapName,window.chalkboard11,"chalkboard11" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 177 && green === 0 && blue === 4) {
                this.addObject(mapName,window.chalkboard12,"chalkboard12" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 177 && green === 0 && blue === 5) {
                this.addObject(mapName,window.chalkboard13,"chalkboard13" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 0 && green === 177 && blue === 0) {
                this.addObject(mapName,window.classRoomFloor,"classRoomFloor" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 0 && green === 0 && blue === 177) {
                this.addObject(mapName,window.leftTable,"leftTable" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 0 && green === 1 && blue === 177) {
                this.addObject(mapName,window.rightTable,"rightTable" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 0 && green === 2 && blue === 177) {
                this.addObject(mapName,window.chair1,"chair1" + nameIndex, x,y);
                nameIndex++;
            }

            else if (red === 0 && green === 3 && blue === 177) {
                this.addObject(mapName,window.chair2,"chair2" + nameIndex, x,y);
                nameIndex++;
            }

            else if (red === 177 && green === 177 && blue === 0) {
                this.addObject(mapName,window.door11,"door11" + nameIndex, x,y);
                nameIndex++;
            }

            else if (red === 177 && green === 177 && blue === 1) {
                this.addObject(mapName,window.door21,"door21" + nameIndex, x,y);
                nameIndex++;
            }

            else if (red === 177 && green === 177 && blue === 2) {
                this.addObject(mapName,window.door31,"door31" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 177 && green === 177 && blue === 3) {
                this.addObject(mapName,window.closedDoor1,"closedDoor1" + nameIndex, x,y);
                nameIndex++;
            }

            else if (red === 177 && green === 177 && blue === 4) {
                this.addObject(mapName,window.closedDoor2,"closedDoor2" + nameIndex, x,y);
                nameIndex++;
            }

            else if (red === 177 && green === 0 && blue === 177) {
                this.addObject(mapName,window.painting,"painting" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 0 && green === 177 && blue === 177) {
                this.addObject(mapName,window.bookcase11,"bookcase11" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 1 && green === 177 && blue === 177) {
                this.addObject(mapName,window.bookcase12,"bookcase12" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 2 && green === 177 && blue === 177) {
                this.addObject(mapName,window.bookcase13,"bookcase13" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 3 && green === 177 && blue === 177) {
                this.addObject(mapName,window.bookcase21,"bookcase21" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 4 && green === 177 && blue === 177) {
                this.addObject(mapName,window.bookcase22,"bookcase22" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 5 && green === 177 && blue === 177) {
                this.addObject(mapName,window.bookcase23,"bookcase23" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 6 && green === 177 && blue === 177) {
                this.addObject(mapName,window.bookcase31,"bookcase31" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 7 && green === 177 && blue === 177) {
                this.addObject(mapName,window.bookcase32,"bookcase32" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 8 && green === 177 && blue === 177) {
                this.addObject(mapName,window.bookcase33,"bookcase33" + nameIndex, x,y);
                nameIndex++;
            }
            else if (red === 177 && green === 177 && blue === 177) {
                this.addObject(mapName,window.stall,"stall" + nameIndex, x,y);
                nameIndex++;
            }

          }

        }
    },
    displayIDE(exercice, doerId) {
        document.getElementById('closeBtn').classList.remove("hidden");
        toggleButtons();
        // add the div of the editor and the run button
        const gameWindow = document.getElementById('gameWindow');

        // Create the 'editor' div
        const editorDiv = document.createElement('div');
        editorDiv.className = 'editor'; // Add class name
        editorDiv.id = 'editor'; // Add id

        // Append the 'editor' div to the 'game-window' div
        gameWindow.appendChild(editorDiv);


        //add the exercice as a comment in the IDE
        if(exercice)
            editorDiv.innerHTML += exercice;

        // Create the 'button-container' div
        const buttonContainerDiv = document.createElement('div');
        buttonContainerDiv.className = 'button-container'; // Add class name

        // On click function
        let onclick = () => executeTests(doerId);

        // Create the button element
        const button = document.createElement('button');
        button.className = 'btn'; // Add class name
        button.textContent = 'Run'; // Set the text inside the button
        button.onclick = onclick;
        // Append the button to the 'button-container' div
        buttonContainerDiv.appendChild(button);

        // Finally, append the 'button-container' div to the 'game-window' div
        gameWindow.appendChild(buttonContainerDiv);


        window.editor = ace.edit("editor");
        window.editor.setTheme("ace/theme/monokai");
        window.editor.session.setMode("ace/mode/python");
        window.IDEdisplayed = true;
        window.Player.isPlayerControlled = false;
    },
    deleteIDE () {
        toggleButtons();
        const editorDiv = document.getElementById('editor');
        if (editorDiv) {
            editorDiv.remove();
        }
        const buttonContainers = document.getElementsByClassName('button-container');
        if (buttonContainers.length > 0) {
            // Removes the first (and assumed only) button container found
            buttonContainers[0].remove();
        }
        window.IDEdisplayed = false;
    },
    runChallenge (config) {
        if (config.flags) {
            for (let flag in config.flags) {
                if (!window.Player.storyFlags[config.flags[flag]]) {
                    return
                }
            }
        }
        if(window.Player.storyFlags[config.fileName])
            return;
        fetch('http://localhost:8080/python_script', {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({file: config.fileName})
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Response not ok")
        }

        return response.text();
    })
    .then(data => {
        util.displayIDE(data, config.NPCname)
    })
    .catch(error => {
        console.error('fetch operation failed: ', error);
    })

    let runHandler = e =>{
        fetch('http://localhost:8080/python', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                script: window.editor.getSession().getValue(),
                level: config.fileName
            })
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Response not ok")
            }
            return response.text();
        })
        .then(data => {
            console.log();
            if(data === '0'){
                window.Player.storyFlags[config.fileName] = true;
                window.currentMap.NPCs[e.detail.doerId].challenge = null;
            }            
        })
        .catch(error => {
            console.error('fetch operation failed: ', error);
        })

        document.removeEventListener('run', runHandler);
    }

    document.addEventListener("run", runHandler);

        
        window.Player.isPlayerControlled = true;
        window.IDEdisplayed = false;
    },
    closeIDE () {
        document.getElementById('closeBtn').classList.add("hidden");
        window.Player.isPlayerControlled = true;
        this.deleteIDE();
    },
    togglePlayerControlled(){
        window.Player.isPlayerControlled = !window.Player.isPlayerControlled;
    }
}

function executeTests(doerId) {

    util.emitEvent('run',{doerId: doerId})
    window.currentNPC.currentDialogueIndex = 0;
    window.currentNPC = null;
    util.closeIDE();
    //window.IDEdisplayed = false;

}