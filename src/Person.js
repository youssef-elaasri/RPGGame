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
        this.storyFlags = config.storyFlags || {};
        this.id = config.id || -1;
    }

    update(state){
        if(this.remainingMovement > 0) {
            this.updatePosition();
        }
        else {


            // case : the character can move and have an arrow pressed
            if (this.isPlayerControlled && state.arrow &&!state.map.isCutscenePlaying) {
                this.startBehavior(state, {
                    type : "walk",
                    direction : state.arrow,
                })
            }
            this.updateSprite(state);
        }
    }

    startBehavior(state, behavior) {
        // set character direction to whatever behavior has
        this.direction = behavior.direction;
        if (behavior.type === "walk" ) {

            // stop if the space is not free
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                if(behavior.retry){
                    setTimeout(() => this.startBehavior(state, behavior), 10)
                }
                return;
            }

            // walk
            //state.map.moveWall(this.x, this.y, this.direction)
            this.remainingMovement = 16;

            this.updateSprite(state);
        }
        else if (behavior.type === "stand"){
            setTimeout(()=>{
                util.emitEvent("PersonStandingComplete", {
                    doerId: this.id
                })
            }, behavior.time)
        }
    }

    updatePosition(){
        const [property, change] = this.directions[this.direction];
        this[property] += change;
        this.remainingMovement -= 1;

        if(this.remainingMovement === 0){
            // Person finished walking!
            util.emitEvent("PersonWalkingComplete", {
                doerId: this.id
            })
        }
    }

    updateSprite() {
        if (this.remainingMovement > 0) {
            this.sprite.setAnimation("walk-" + this.direction);
            return;
        }
        this.sprite.setAnimation("idle-" + this.direction)
    }
}