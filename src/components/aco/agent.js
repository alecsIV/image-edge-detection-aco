export default class AntAgent {
    constructor(image, canvas){
        this.image = image;
        this.canvas = canvas;
        this.startPostition = this.getStartingPostion(); // x,y coordinates <- this should be random
        this.drawAgent();
    }

    getStartingPostion(){
        const x = Math.floor(Math.random() * this.canvas.width);
        const y = Math.floor(Math.random() * this.canvas.height);
        return {"x":x, "y":y}
    }

    drawAgent(){
        const ctx = this.canvas.getContext('2d');
        console.log('x: ', this.startPostition.x, 'y: ', this.startPostition.y);
        ctx.fillRect(this.startPostition.x, this.startPostition.y, 1, 1);
    }
}