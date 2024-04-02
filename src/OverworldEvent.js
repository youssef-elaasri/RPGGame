class OverworldEvent{
    constructor({map, event}){
        this.map = map;
        this.event = event
    }

    stand(resolve){
        const doer = this.map.NPCs[this.event.doer] || this.map.gameObjects[this.event.doer]
        doer.startBehavior({
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time
        })

        const completeHandler = e => {
            if(e.detail.doerId == this.event.doer){
                document.removeEventListener("PersonStandingComplete", completeHandler);
                resolve();
            }
        }        
        document.addEventListener("PersonStandingComplete", completeHandler)
    }

    walk(resolve){
        const doer = this.map.NPCs[this.event.doer] || this.map.gameObjects[this.event.doer]
        doer.startBehavior({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true,
        })

        const completeHandler = e => {
            if(e.detail.doerId == this.event.doer){
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