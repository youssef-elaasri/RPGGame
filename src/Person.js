class Person extends GameObject {
    constructor(config){
        super(config);
        this.remainingMovement = 0; // In pixels 
        this.isPlayerControlled = config.isPlayerControlled || false;
        this.directions = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    update(state){
        this.updatePosition();
        this.updateSprite(state);

        if (this.isPlayerControlled && this.remainingMovement === 0 && state.arrow) {
            this.direction = state.arrow;
            this.remainingMovement = 16;
        }
    }

    updatePosition(){
        if(this.remainingMovement > 0) {
            const [property, change] = this.directions[this.direction];
            this[property] += change;
            this.remainingMovement -= 1;
        }
    }

    updateSprite(state) {
        //console.log("idle" + this.direction);
        if (this.isPlayerControlled && this.remainingMovement === 0 && !state.arrow) {
            this.sprite.setAnimation("idle-" + this.direction)
            return
        }
        this.sprite.setAnimation("walk-" + this.direction)
    }
}