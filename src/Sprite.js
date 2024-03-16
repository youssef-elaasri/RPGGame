class Sprite {
    // Sprite is a computer graphic which may be moved on-screen and otherwise manipulated as a single entity.

    constructor(config){

        // In this part we store all the animations information

        // The actual plausible animations
        this.animations = config.animations || {
            "idle-down": [[0,0]],
            "idle-left": [[0,1]],
            "idle-right": [[0,2]],
            "idle-up": [[0,3]],
            "walk-down": [[0,0], [1,0]],
            "walk-left": [[0,1], [1,1]],
            "walk-right": [[0,2], [1,2]],
            "walk-up": [[0,3], [1,3]],


        }
        // The current animation
        this.currentAnimation = config.currentAnimation || "idle-down"
        // Finally, The actual frame
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 32
        this.animationFrameProgress = this.animationFrameLimit;

        //Set this image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }
        
        //Reference the game object
        this.gameObject = config.gameObject;


    }

    get frame(){
        return this.animations[this.currentAnimation][this.currentAnimationFrame]
    }

    updateAnimationProgress(){
        // Downtick frame progress
        if(this.animationFrameProgress > 0){
            this.animationFrameProgress--;
            return;
        }

        // Reset frame progress
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame++;

        if(this.frame == undefined){
            this.currentAnimationFrame = 0;
        }
    }
    
    setAnimation(animation){
        if(this.currentAnimation === animation) return;
        this.currentAnimation = animation;
        this.currentAnimationFrame = 0;
        this.animationFrameProgress = this.animationFrameLimit


    }

    draw(ctx){
        if (this.gameObject.y < window.Player.y || window.drawingLowerObjects) {
            // calcuations can be redone
            const x = this.gameObject.x - window.Player.x + util.inGrid(14.5);
            const y = this.gameObject.y - window.Player.y + util.inGrid(7.5);
            const [frameX, frameY] = this.frame;
            // console.log(this.currentAnimation + " " + this.frame + " ")

            ctx.drawImage(
                this.image,
                frameX * 16, frameY * 32, //top left of the cut
                16, 32, // cut's dimensions
                x,  y,    // top left of the postion where the object is put
                16, 32 // size of the postion where the object is put 
        )
    
        this.updateAnimationProgress();
        }
        else {
            window.upperObjects.push(this);
        }
    }

}