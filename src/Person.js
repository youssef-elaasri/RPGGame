class Person extends GameObject {
    constructor(config){
        super(config);
        this.remainingMovement = 0; // In pixels 
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

    move(e) {
        if (this.remainingMovement == 0) {            
            switch(e.key) {
                case "ArrowUp": this.direction = "up"; break;
                case "ArrowDown": this.direction = "down"; break;
                case "ArrowLeft": this.direction = "left"; break;
                case "ArrowRight": this.direction = "right"; break;
            }
            this.remainingMovement += 16;
        }
    }
}