class GameObject {
    constructor(config){
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.sprite = new Sprite({
            gameObject : this,
            src: config.src ||"images/alex.png" // If the user is lazy and doesn't give an image put the image of Alex by default... bcs we love Alex
        })
    }
}