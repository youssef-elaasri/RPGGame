const IDE = {
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
        if (exercice)
            editorDiv.innerHTML += exercice;

        // Create the 'button-container' div
        const buttonContainerDiv = document.createElement('div');
        buttonContainerDiv.className = 'button-container'; // Add class name

        // On click function
        let onclick = () => this.executeTests(doerId);

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
    deleteIDE() {
        const editorDiv = document.getElementById('editor');
        if (editorDiv) {
            editorDiv.remove();
        }
        const buttonContainers = document.getElementsByClassName('button-container');
        if (buttonContainers.length > 0) {
            // Removes the first (and assumed only) button container found
            buttonContainers[0].remove();
        }
    },
    runChallenge(config) {
        if (config.flags) {
            for (let flag in config.flags) {
                if (!window.Player.storyFlags[config.flags[flag]]) {
                    return
                }
            }
        }
        if (window.Player.storyFlags[config.fileName])
            return;
        fetch('http://localhost:8080/python_script', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({file: config.fileName})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Response not ok")
                }

                return response.text();
            })
            .then(data => {
                this.displayIDE(data, config.NPCname)
            })
            .catch(error => {
                console.error('fetch operation failed: ', error);
            })

        let runHandler = e => {
            fetch('http://localhost:8080/python', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    script: window.editor.getSession().getValue(),
                    level: config.fileName
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Response not ok")
                    }
                    return response.text();
                })
                .then(data => {
                    console.log();
                    if (data === '0') {
                        window.Player.storyFlags[config.fileName] = true;
                        window.currentMap.NPCs[e.detail.doerId].challenge = null;
                        addCompletedStage(config.fileName)
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
    closeIDE() {
        document.getElementById('closeBtn').classList.add("hidden");
        window.Player.isPlayerControlled = true;
        window.IDEdisplayed = false;
        toggleButtons();
        this.deleteIDE();
    },
    executeTests(doerId) {
        util.emitEvent('run', {doerId: doerId})
        window.currentNPC.currentDialogueIndex = 0;
        window.currentNPC = null;
        this.closeIDE();
    }
}