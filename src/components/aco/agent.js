export default class AntAgent {
    constructor(canvas){
        this.startPostition = this.getStartingPostion(canvas); // x,y coordinates <- this should be random
        this.drawAgent(canvas);
    }

    getStartingPostion(canvas){
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        return {"x":x, "y":y}
    }

    drawAgent(canvas){
        const ctx = canvas.getContext('2d');
        ctx.fillRect(this.startPostition.x, this.startPostition.y, 1, 1);
    }
}