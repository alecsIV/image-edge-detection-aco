export default class AntAgent {
    constructor(canvas) {
        this.startPostition = this.getStartingPostion(canvas); // x,y coordinates <- this should be random
        this.currentCoordinates = this.startPostition;
        this.agentSize = 1;
    }

    getStartingPostion(canvas) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        return {
            "x": x,
            "y": y
        }
    }

    calculateNextStep() {
        let currentMaxProbability = 0,
            maxProbabilityIndex = 0;

        const neighbourhoodSize = 9,
            phProducts = [],
            neighbourNodeCoordinates = [],
            x = this.currentCoordinates.x,
            y = this.currentCoordinates.y;

        // find the pheromone and heuristic product
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; i++) {
                if (i !== 0 && j !== 0) {
                    phProducts.push(pheromoneMatrix[x + i][y + j] * heuristicMatrix[x + i][y + j]);
                    neighbourNodeCoordinates.push({
                        'x': x + i,
                        'y': y + i
                    });
                }
            }
        }

        //find the sum of all products from the neighbourhood
        const sumProducts = phProducts.reduce((a, b) => a + b, 0);

        //find the maximum probability
        phProducts.forEach((product, i) => {
            const result = Math.abs(product / sumProducts);

            if (result > currentMaxProbability) {
                currentMaxProbability = result;
                maxProbabilityIndex = i;
            }
        });

        return neighbourNodeCoordinates[maxProbabilityIndex]
    }

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

    // old way of getting intensity at each pixel
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
}
