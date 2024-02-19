class Sprite {
    // Sprite is a computer graphic which may be moved on-screen and otherwise manipulated as a single entity.

    constructor(config){
        //Set this image

        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }
        
        //Reference the game object
        this.gameObject = config.gameObject;

    }

    draw(ctx){
        // calcuations can be redone
        const x = this.gameObject.x * 16;
        const y = this.gameObject.y * 16;

        ctx.drawImage(
            this.image,
            0, 0, //top left of the cut
            16, 32, // cut's dimensions
            x,  y,    // top left of the postion where the object is put
            16, 32 // size of the postion where the object is put 
        )
    }

}