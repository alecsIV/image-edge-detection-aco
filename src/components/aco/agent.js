export default class AntAgent {
    constructor(canvas, coordinates) {
        this.canvas = canvas;
        this.startPostition = coordinates; // x,y coordinates <- this should be random
        this.currentCoordinates = this.startPostition;
        this.previousCoordinates = [];
        this.agentSize = 1;
    }

    getRandomPosition() {
        const x = Math.floor(Math.random() * this.canvas.width);
        const y = Math.floor(Math.random() * this.canvas.height);
        return {
            x: x,
            y: y
        };
    }

    depositPheromone(coordinates) {
        const medians = [];
        coordinates.forEach(pixel => {
            const matrixSize = pheromoneMatrix.length - 1,
                x = pixel.x,
                y = pixel.y,
                neighbourIntensities = [];

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const notOutOfBounds =
                        x + i > -1 &&
                        x + i < matrixSize &&
                        y + j > -1 &&
                        y + j < matrixSize;
                    if (notOutOfBounds) {
                        neighbourIntensities.push(heuristicMatrix[x + i][y + j]);
                    }
                }
            }
            medians.push(this.calcMedian(neighbourIntensities));
        });
        const medDiff = medians[0] - medians[1];
        pheromoneMatrix[coordinates[0].x][coordinates[0].y] += (heuristicMatrix[coordinates[0].x][coordinates[0].y] >= tNoiseFilt) ? nConstPD + (pConstPD * medDiff) / 255 : 0;
        // pheromoneMatrix[coordinates[0].x][coordinates[0].y] =(heuristicMatrix[coordinates[0].x][coordinates[0].y] >= tNoiseFilt)? heuristicMatrix[coordinates[0].x][coordinates[0].y] : 0;
    }

    calcMedian(arr) {
        const mid = Math.floor(arr.length / 2),
            nums = [...arr].sort((a, b) => a - b);
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    }

    calculateNextStep() {
        let currentMaxProbability = 0,
            maxProbabilityIndex = 0,
            sumProducts = 0,
            visited = false;

        const phProducts = [],
            neighbourNodeCoordinates = [],
            x = this.currentCoordinates.x,
            y = this.currentCoordinates.y,
            matrixSize = pheromoneMatrix.length - 1,
            pCLen = this.previousCoordinates.length;

        // find the pheromone and heuristic product
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const outOfBounds =
                    x + i > -1 && x + i < matrixSize && y + j > -1 && y + j < matrixSize;
                visited = false;
                if (i !== 0 && j !== 0 && outOfBounds) {
                    for (let k = 1; k < (antMemLen > pCLen ? pCLen : antMemLen); k++) {
                        if (
                            this.previousCoordinates[pCLen - k].x === x + i &&
                            this.previousCoordinates[pCLen - k].y === y + j
                        ) {
                            visited = true;
                            k = antMemLen + 1; // exit the loop to prevent agent looping
                        }
                    }
                    if (!visited) {
                        const productValue =
                            Math.pow(pheromoneMatrix[x + i][y + j], alpha) *
                            Math.pow(heuristicMatrix[x + i][y + j], beta);
                        phProducts.push(productValue);

                        //find the sum of all products from the neighbourhood
                        sumProducts += productValue;
                    } else {
                        phProducts.push("visited");
                    }
                    neighbourNodeCoordinates.push({
                        x: x + i,
                        y: y + j
                    });
                }
            }
        }

        //find the maximum probability for next move
        phProducts.forEach((product, i) => {
            //check if not the previous pixel
            let notPrevious = product !== "visited";
            const result =
                sumProducts !== 0 && notPrevious ? Math.abs(product / sumProducts) : 0;

            if (result > currentMaxProbability && notPrevious) {
                currentMaxProbability = result;
                maxProbabilityIndex = i;
            }
        });

        if (currentMaxProbability === 0) {
            maxProbabilityIndex = 99;
        }

        if (maxProbabilityIndex === 99) {
            this.previousCoordinates = [];
            const newPositions = this.getRandomPosition();
            return {
                newCoordinates: newPositions,
                newAnt: true
            };
        } else return {
            newCoordinates: neighbourNodeCoordinates[maxProbabilityIndex],
            newAnt: false
        };
    }

    moveTo(coordinates, newAnt) {
        if (!newAnt) {
            this.depositPheromone([this.currentCoordinates, coordinates]);
            this.previousCoordinates.push(this.currentCoordinates);
        } else this.previousCoordinates = [];
        this.currentCoordinates = coordinates;
    }
}
