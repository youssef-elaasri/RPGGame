class GameObject {
    constructor(config){
        // Object position (in px)
        this.x = config.x || 0;
        this.y = config.y || 0;
        // Direction of object
        this.direction = config.direction || "down";
        // Sprite object
        this.sprite = new Sprite({
            gameObject : this,
            src: config.src ||"images/characters/hero.png" // If the user is lazy and doesn't give an image put the image of Alex by default... bcs we love Alex
        })
    }

    upgradeDirection (direction){
        this.direction  = direction;
    }

    // Most game objects don't really need to be updated actually :)
    update(){
        
    }
}