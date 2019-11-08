export default class AntAgent {
    constructor(canvas) {
        this.startPostition = this.getStartingPostion(canvas); // x,y coordinates <- this should be random
        this.currentCoordinates = this.startPostition;
        this.agentSize = 1;
        this.canvasWidth = canvas.width;
    }

    getStartingPostion(canvas) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        return {
            "x": x,
            "y": y
        }
    }

    getNeighbourPixels(){
        var x = 4, y = 0, columns = 5, scale = 1, i 
        
    }

    // getPixelIntensityAt(coordinates){
    //     let x = coordinates.x;
    //     let y = coordinates.y;
    //     let i;

    //     x = Math.floor(x / this.agentSize);
    //     y = Math.floor(y / this.agentSize);
    //     i = (y === 0) ? 0 : this.canvasWidth * y;
    //     i = i + x; 
    //     console.log('canvasW: ', this.canvasWidth);
    //     console.log('i: ', i);
    //     console.log('intensity at x: ', x, ' y:', y, ' is', imageIntensityArray[i]);
    //     return imageIntensityArray[i];
    // }

    moveUp() {
        if (this.currentCoordinates.y !== 0) {
            this.currentCoordinates.y = this.currentCoordinates.y - 1;
        }
    }
    moveDown() {
        if (this.currentCoordinates.y !== 0) {
            this.currentCoordinates.y = this.currentCoordinates.y + 1;
        }
    }
    moveLeft() {
        if (this.currentCoordinates.x !== 0) {
            this.currentCoordinates.x = this.currentCoordinates.x - 1;
        }
    }
    moveRight() {
        if (this.currentCoordinates.x !== 0) {
            this.currentCoordinates.x = this.currentCoordinates.x + 1;
        }
    }
}
