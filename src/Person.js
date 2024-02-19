class Person extends GameObject {
    constructor(config){
        super(config);
        this.remainingMovement = 16;
        this.directions = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    update(state){
        this.updatePosition();
    }

    updatePosition(){
        if(this.remainingMovement > 0) {
            const [property, change] = this.directions[this.direction];
            this[property] += change;
            this.remainingMovement -= 1;
        }
    }
}