class NPC extends Person {
    constructor(config) {
        super(config);
        this.name = name;
        this.dialogues = config.dialogues || []; // Array of dialogue strings
        this.currentDialogueIndex = 0; // To track which dialogue to show
        this.isInteractable = config.isInteractable || true; // Whether the player can interact with the NPC
        this.autoMovePattern = config.autoMovePattern || null; // Automated movement pattern!
        this.autoMoveIndex = 0; // Current step in the automated movement pattern
    }

    interact() {
        // Method to handle interaction with the player
        if (this.dialogues.length > 0) {
            const dialogue = this.dialogues[this.currentDialogueIndex];
            console.log(dialogue); // Display the dialogue - replace with your game's dialogue display logic
            this.currentDialogueIndex = (this.currentDialogueIndex + 1) % this.dialogues.length;
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
