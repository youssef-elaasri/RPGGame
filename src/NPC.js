class NPC extends Person {
    constructor(config) {
        super(config);
        this.name = name;
        this.dialogues = config.dialogues || []; // Array of dialogue strings
        this.currentDialogueIndex = 0; // To track which dialogue to show
        this.isInteractable = config.isInteractable || true; // Whether the player can interact with the NPC
        this.autoMovePattern = config.autoMovePattern || true; // Automated movement pattern!
        this.autoMoveIndex = 0; // Current step in the automated movement pattern
        this.defaultDialogue = config.defaultDialogue || []
        this.challenge = config.challenge;
        this.currentDialogue = [];
    }

    incrementDialogue() {
        this.currentDialogueIndex++; // Advance the dialogue index
        this.showDialogue(); // Show the next piece of dialogue or hide if at the end
    }
     showDialogue() {
        const dialogueContainer = document.querySelector('.dialogue-container');
        const dialogueText = document.querySelector('.dialogue-text');
        dialogueText.textContent = '';
        dialogueContainer.classList.remove('hidden');
        dialogueText.textContent = this.currentDialogue[this.currentDialogueIndex];
        window.dialogueIsShowing = true;
        window.Player.isPlayerControlled = false;
    }

     hideDialogue() {
        const dialogueContainer = document.querySelector('.dialogue-container');
        dialogueContainer.classList.add('hidden');
        const dialogueText = document.querySelector('.dialogue-text');
        dialogueText.textContent = '';
        window.dialogueIsShowing = false;
    }

    selectDialogue() {
        for (const key in this.dialogues) {
            if (key in window.Player.storyFlags) {
                this.currentDialogue = this.dialogues[key];
                return;
            }
        }
        this.currentDialogue = this.defaultDialogue;
    }

    interact() {
        this.selectDialogue();
        if (this.currentDialogueIndex < this.currentDialogue.length) {
            this.showDialogue();
            this.currentDialogueIndex = this.currentDialogueIndex + 1;
        } else if (this.currentDialogueIndex === this.currentDialogue.length) {
            this.hideDialogue();
            console.log(this.challenge);
            if(this.challenge){
                this.challenge();
            }
            window.Player.isPlayerControlled = true;
            this.currentDialogueIndex = 0;
            
        }
    }

    update(state) {
        super.update(state); // Call the parent class's update method
        this.autoMove(); // Add logic for automated movement
    }

    autoMove() {
        if (this.autoMovePattern && this.remainingMovement === 0) {
            // Example of a simple automated movement pattern
            const move = this.autoMovePattern[this.autoMoveIndex];
            if (move) {
                this.direction = move;
                this.remainingMovement = 16; // Move 16 pixels in the current direction
                this.autoMoveIndex = (this.autoMoveIndex + 1) % this.autoMovePattern.length;
            }
        }
    }

    updateSprite(state) {
        if (this.autoMovePattern) {
            super.updateSprite(state); // For now, just use the Person class's logic
        }
    }
}
