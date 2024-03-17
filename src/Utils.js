
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
    displayIDE() {
        // add the div of the editor and the run button
        const gameWindow = document.getElementById('gameWindow');

        // Create the 'editor' div
        const editorDiv = document.createElement('div');
        editorDiv.className = 'editor'; // Add class name
        editorDiv.id = 'editor'; // Add id

        // Append the 'editor' div to the 'game-window' div
        gameWindow.appendChild(editorDiv);

        // Create the 'button-container' div
        const buttonContainerDiv = document.createElement('div');
        buttonContainerDiv.className = 'button-container'; // Add class name

        // Create the button element
        const button = document.createElement('button');
        button.className = 'btn'; // Add class name
        button.textContent = 'Run'; // Set the text inside the button
        button.setAttribute('onclick', 'executeTests()'); // Set the onclick attribute to call the 'executeTests' function

        // Append the button to the 'button-container' div
        buttonContainerDiv.appendChild(button);

        // Finally, append the 'button-container' div to the 'game-window' div
        gameWindow.appendChild(buttonContainerDiv);


        window.editor = ace.edit("editor");
        window.editor.setTheme("ace/theme/monokai");
        window.editor.session.setMode("ace/mode/python");
        window.IDEdisplayed = true;
    },
    deleteIDE () {
        const editorDiv = document.getElementById('editor');
        if (editorDiv) {
            editorDiv.remove();
        }
        const buttonContainers = document.getElementsByClassName('button-container');
        if (buttonContainers.length > 0) {
            // Removes the first (and assumed only) button container found
            buttonContainers[0].remove();
        }
    }
}

function executeTests() {
    $.ajax({
        url : "app/tester.php",
        method: "POST",
        data: {
            code : window.editor.getSession().getValue()
        },
        success : function (response) {
            $(".output").text((response))
        }
    });
    window.Player.isPlayerControlled = true;
    window.currentNPC.currentDialogueIndex = 0;
    window.currentNPC = null;
    util.deleteIDE();
    window.IDEdisplayed = false;

}