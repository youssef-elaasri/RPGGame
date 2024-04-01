class OverworldEvent{
    constructor({map, event}){
        this.map = map;
        this.event = event
    }

    stand(resolve){

    }

    walk(resolve){
        const doer = this.map.NPCs[this.event.doer] || this.map.gameObjects[this.event.doer]
        console.log(`${this.event.doer} is going to walk`);
        doer.startBehavior({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction
        })

        const completeHandler = e => {
            if(e.detail.doerId == this.event.doer){
                console.log('I"m done walking');
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }

        document.addEventListener("PersonWalkingComplete", completeHandler)
    }

    init(){
        return new Promise(resolve =>{
            this[this.event.type](resolve)
        })
    }
}