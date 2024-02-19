class MainWorld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    init() {
        // Dimensions for the rectangle
        const rectWidth = 352;
        const rectHeight = 198;

        // Calculating the center position
        const centerX = (this.canvas.width - rectWidth) / 2;
        const centerY = (this.canvas.height - rectHeight) / 2;

        // Set the color of the rectangle
        this.ctx.fillStyle = 'green';

        // Draw the rectangle at the center
        this.ctx.fillRect(centerX, centerY, rectWidth, rectHeight);
    }
}
