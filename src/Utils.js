
// Method used by the fullscreen icon
function toggleFullscreen() {
    var elem = document.querySelector('.game-window');
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

const util = {
    inGrid(n) {
        return n*16;    
    },
    asGridCoord(x,y) {
        return `${x*16},${y*16}`;
    },
    nextPosition(initalX, initalY, direction) {
        let x = initalX;
        let y = initalY;
        const size = 16;
        if (direction == "left") {
            x -= size;
        }
        else if (direction == "right") {
            x += size;
        }
        else if (direction == "up") {
            y -= size;
        }
        else if (direction == "down") {
            y += size;
        }
        return {x,y};
    }
}