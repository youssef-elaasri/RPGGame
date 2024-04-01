class DirectionInput {
    constructor() {
        this.heldDirection = [];

        this.map = {
            "ArrowUp" : "up",
            "ArrowDown" : "down",
            "ArrowRight" : "right",
            "ArrowLeft" : "left",
        }
        this.init()
    }

    get direction() {
        return this.heldDirection[0];
    }


    init() {
        console.log("here")
        document.addEventListener("keydown",e => {
            const dir = this.map[e.code];
            if (dir && this.heldDirection.indexOf(dir) === -1) {
                this.heldDirection.unshift(dir);
            }
        });

        document.addEventListener("keyup", e=> {
            const dir = this.map[e.code];
            const index = this.heldDirection.indexOf(dir);
            if (index>-1) {
                this.heldDirection.splice(index,1);
            }
        });

        document.addEventListener('keydown', e => {
            if (e.key === ' ' && window.IDEdisplayed !== true) {
                e.preventDefault(); // Prevent any default action to ensure smooth behavior
                const nearbyNPC = window.currentMap.findNearbyNPC();
                if (nearbyNPC) {
                    window.currentNPC = nearbyNPC;
                    nearbyNPC.interact();
                }
            }
        });
    }
}
