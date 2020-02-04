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

        //find the maximum probability for next move
        phProducts.forEach((product, i) => {
            const result = Math.abs(product / sumProducts);
            //check if not the previous pixel
            let notPrevious = true;
            if (this.previousCoordinates.length > 0) {
                notPrevious = (x + 1 !== this.previousCoordinates[this.previousCoordinates.length - 1].x) && (y + 1 !== this.previousCoordinates[this.previousCoordinates.length - 1].y);
            }

            if (result > currentMaxProbability && notPrevious) {
                currentMaxProbability = result;
                maxProbabilityIndex = i;
            }
        });

        //save current coordinates as previous
        this.previousCoordinates.push(this.currentCoordinates);

        return neighbourNodeCoordinates[maxProbabilityIndex]
    }

    moveTo(coordinates) {
        this.currentCoordinates = coordinates;
    }

    updatePheromoneLevel(agent) {
        const curX = agent.currentCoordinates.x;
        const curY = agent.currentCoordinates.y;
        let sumHeuristics = 0;
        agent.previousCoordinates.forEach(prevPosition => {
            sumHeuristics += heuristicMatrix[prevPosition.x][prevPosition.y];
        })
        const newPheromoneLevel = (1 - 0.5) * pheromoneMatrix[curX][curY] + sumHeuristics;
        pheromoneMatrix[agent.currentCoordinates.x][agent.currentCoordinates.y] = newPheromoneLevel;
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
