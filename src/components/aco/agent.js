export default class AntAgent {
    constructor(canvas) {
        this.canvas = canvas;
        this.startPostition = this.getStartingPostion(); // x,y coordinates <- this should be random
        this.currentCoordinates = this.startPostition;
        this.previousCoordinates = [];
        this.agentSize = 1;
    }

    getStartingPostion() {
        const x = Math.floor(Math.random() * this.canvas.width);
        const y = Math.floor(Math.random() * this.canvas.height);
        return {
            "x": x,
            "y": y
        }
    }

    calculateNextStep(antMemLen) {
        let currentMaxProbability = 0,
            maxProbabilityIndex = 0,
            sumProducts = 0,
            visited = false;



        const neighbourhoodSize = 9,
            phProducts = [],
            neighbourNodeCoordinates = [],
            x = this.currentCoordinates.x,
            y = this.currentCoordinates.y,
            matrixSize = pheromoneMatrix.length - 1,
            alpha = 10,
            beta = 10,
            pCLen = this.previousCoordinates.length;

        // find the pheromone and heuristic product
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const outOfBounds = (((x + i) > -1 && (x + i) < matrixSize) && ((y + j) > -1) && (y + j) < matrixSize);
                visited = false;
                if ((i !== 0 || j !== 0) && outOfBounds) {
                    for (let k = 1; k < ((antMemLen > pCLen) ? pCLen : antMemLen); k++) {
                        if (this.previousCoordinates[pCLen - k].x === x + i && this.previousCoordinates[pCLen - k].y === y + j) {
                            visited = true;
                        }
                    }
                    if (!visited) {
                        const productValue = Math.pow(pheromoneMatrix[x + i][y + j], alpha) * Math.pow(heuristicMatrix[x + i][y + j], beta);
                        phProducts.push(productValue);

                        //find the sum of all products from the neighbourhood
                        sumProducts += productValue;
                    } else {
                        phProducts.push('visited');
                    }
                    // if (this.previousCoordinates.length > 0 && this.previousCoordinates[this.previousCoordinates.length - 1].x === x + i && this.previousCoordinates[this.previousCoordinates.length - 1].y === y + j) {
                    //     phProducts.push('visited');
                    // } else {
                    //     const productValue = Math.pow(pheromoneMatrix[x + i][y + j], alpha) * Math.pow(heuristicMatrix[x + i][y + j], beta);
                    //     phProducts.push(productValue);

                    //     //find the sum of all products from the neighbourhood
                    //     sumProducts += productValue;
                    // }
                    neighbourNodeCoordinates.push({
                        "x": x + i,
                        "y": y + j
                    });
                }
            }
        }

        //find the maximum probability for next move
        phProducts.forEach((product, i) => {
            //check if not the previous pixel
            let notPrevious = (product !== 'visited');
            // if (!notPrevious) console.log('index', i);
            const result = (sumProducts !== 0 && notPrevious) ? Math.abs(product / sumProducts) : 0;

            if (result > currentMaxProbability && notPrevious) {
                currentMaxProbability = result;
                maxProbabilityIndex = i;
            } else if (result === 0 && notPrevious) {
                maxProbabilityIndex = 99;
                // const randomValue = Math.floor(Math.random() * (neighbourNodeCoordinates.length - 1));
                // maxProbabilityIndex = (phProducts[randomValue] !== 'visited') ? randomValue : ((randomValue > 0) ? randomValue - 1 : randomValue + 1);
            } else {
                maxProbabilityIndex = 88;
            }

        });

        //save current coordinates as previous
        this.previousCoordinates.push(this.currentCoordinates);
        // console.log('maxProbabilityIndex', maxProbabilityIndex);
        // console.log('neighbourNodeCoordinates[maxProbabilityIndex]', neighbourNodeCoordinates[maxProbabilityIndex]);
        // console.log('neighbourNodeCoordinates', neighbourNodeCoordinates);
        if (maxProbabilityIndex === 99) {
            const newPositions = this.getStartingPostion();
            return newPositions;
        } else if (maxProbabilityIndex === 88) {
            return this.currentCoordinates;
        } else return neighbourNodeCoordinates[maxProbabilityIndex];
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
        const newPheromoneLevel = (1 - 0.02) * pheromoneMatrix[curX][curY] + sumHeuristics;
        pheromoneMatrix[agent.currentCoordinates.x][agent.currentCoordinates.y] = newPheromoneLevel;
    }
}
