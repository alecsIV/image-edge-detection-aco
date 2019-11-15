export default class AntAgent {
    constructor(canvas) {
        this.startPostition = this.getStartingPostion(canvas); // x,y coordinates <- this should be random
        this.currentCoordinates = this.startPostition;
        this.previousCoordinates = [];
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
            y = this.currentCoordinates.y,
            matrixSize = pheromoneMatrix.length - 1;

        //save current coordinates as previous
        this.previousCoordinates.push(this.currentCoordinates);
        // find the pheromone and heuristic product
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const outOfBounds = (((x + i) > -1 && (x + i) < matrixSize) && ((y + j) > -1) && (y + j) < matrixSize);
                if ((i !== 0 || j !== 0) && outOfBounds) {
                    phProducts.push(pheromoneMatrix[x + i][y + j] * heuristicMatrix[x + i][y + j]);
                    neighbourNodeCoordinates.push({
                        "x": x + i,
                        "y": y + j
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

    moveTo(coordinates) {
        this.currentCoordinates = coordinates;
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
