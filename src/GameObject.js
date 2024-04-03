class GameObject {
    constructor(config){
        this.id = null;
        this.isMounted = false;
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
        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;
    }

    mount(map){
        this.isMounted = true;
        map.addWall(this.x, this.y);

        // kick off the behavior loop

        setTimeout(() => {
            this.startBehaviorLoop(map);
        }, 10)
    }


    async startBehaviorLoop(map){

        if(map.isCutScenePlaing || this.behaviorLoop.length === 0)
            return;

        let event = this.behaviorLoop[this.behaviorLoopIndex]

        event.doer = this.id;

        // create an event instance to handle it
        const eventhandler = new OverworldEvent({map, event: event})
        await eventhandler.init();

        // Increment the index by one and making sure it loops
        this.behaviorLoopIndex = (this.behaviorLoopIndex + 1) % this.behaviorLoop.length;
        
        // Repeat
        this.startBehaviorLoop(map)

    }

    upgradeDirection (direction){
        this.direction  = direction;
    }

    // Most game objects don't really need to be updated actually :)
    update(){
        
    }

}
