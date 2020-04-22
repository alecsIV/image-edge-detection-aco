/* -------------------------------------------------------------------------- */
/*                                Agent object                                */
/* -------------------------------------------------------------------------- */

export default class AntAgent {
    constructor(canvas, coordinates) {
        this.canvas = canvas;
        this.startPostition = coordinates; // x,y coordinates from aco-algorithm.js
        this.currentCoordinates = this.startPostition;
        this.previousCoordinates = []; // used to store previours coordinates
        this.agentSize = 1; // the agent size on the canvas (1 pixel for accuracy)
    }

    getRandomPosition() {
        // calculate a random position for an agent on the canvas
        const x = Math.floor(Math.random() * this.canvas.width);
        const y = Math.floor(Math.random() * this.canvas.height);
        return {
            x: x,
            y: y
        };
    }

    depositPheromone(coordinates) {
        // deposit pheromone at passed pixel
        // the passed coordinates are the current and the just passed ones

        // calculate the median intensities of the curent node and the passed node as well as the nodes from their neighbourhoods 
        const medians = [];
        coordinates.forEach(pixel => {
            const matrixSize = pheromoneMatrix.length - 1,
                x = pixel.x,
                y = pixel.y,
                neighbourIntensities = [];

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    // canvas bounds
                    const notOutOfBounds =
                        x + i > -1 &&
                        x + i < matrixSize &&
                        y + j > -1 &&
                        y + j < matrixSize;

                    // get the neighbourhood intensity values
                    if (notOutOfBounds) {
                        neighbourIntensities.push(heuristicMatrix[x + i][y + j]);
                    }
                }
            }
            medians.push(this.calcMedian(neighbourIntensities)); // calculate medians
        });
        //calculate the difference between the two median intensities 
        const medDiff = medians[0] - medians[1];

        // calculate pheromone deposition at node
        // based on equation 1 from Ricardo Contreras et al.'s (2013) article
        pheromoneMatrix[coordinates[0].x][coordinates[0].y] += (heuristicMatrix[coordinates[0].x][coordinates[0].y] >= tNoiseFilt) ? nConstPD + (pConstPD * medDiff) / 255 : 0;
    }

    calcMedian(arr) {
        // calculate medians
        const mid = Math.floor(arr.length / 2),
            nums = [...arr].sort((a, b) => a - b);
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    }

    calculateNextStep() {
        // get the next step an ant should move to

        let currentMaxProbability = 0,
            maxProbabilityIndex = 0,
            sumProducts = 0,
            visited = false;

        // phProducts stands for array of pheromone and heuristic products
        // pCLen stands for the length of the previous coordinates array
        const phProducts = [],
            neighbourNodeCoordinates = [],
            x = this.currentCoordinates.x,
            y = this.currentCoordinates.y,
            matrixSize = pheromoneMatrix.length - 1,
            pCLen = this.previousCoordinates.length;

        // find the pheromone and heuristic product
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                // canvas bounds
                const outOfBounds =
                    x + i > -1 && x + i < matrixSize && y + j > -1 && y + j < matrixSize;
                visited = false; // keep track of visited nodes

                // calculate values for all nodes but the current one
                if (i !== 0 && j !== 0 && outOfBounds) {
                    // see if a pixel is visited by checking the saved nodes in the ant's memory
                    // antMemLen defines how far back into the ants memory should be checked
                    for (let k = 1; k < (antMemLen > pCLen ? pCLen : antMemLen); k++) {
                        // check if a node is visited
                        if (
                            this.previousCoordinates[pCLen - k].x === x + i &&
                            this.previousCoordinates[pCLen - k].y === y + j
                        ) {
                            visited = true; // mark as visited
                            k = antMemLen + 1; // exit the loop to prevent agent looping
                        }
                    }
                    if (!visited) {
                        // calculate the product of the pheromone and heuristic
                        // based on equation 4 from Liu and Fang's (2015) article 
                        const productValue =
                            Math.pow(pheromoneMatrix[x + i][y + j], alpha) *
                            Math.pow(heuristicMatrix[x + i][y + j], beta);
                        phProducts.push(productValue);

                        //find the sum of all products from the neighbourhood
                        sumProducts += productValue;
                    } else {
                        phProducts.push("visited");
                    }
                    // save all neighbourhood coordinates of a pixel 
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

            // check if the result is bigger than the noise filter
            if (result >= tNoiseFilt) {
                if (result > currentMaxProbability && notPrevious) {
                    currentMaxProbability = result;
                    maxProbabilityIndex = i; // set the index of the neighbour with highest intensity
                }
            }
        });

        // check if there is no high probability and respawn ant
        if (currentMaxProbability === 0) {
            maxProbabilityIndex = 99;
        }

        // respawn ant
        if (maxProbabilityIndex === 99) {
            this.previousCoordinates = []; // reset ant's memory
            const newPositions = this.getRandomPosition(); // get new random coordinates for the ant's new position
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
        // move ant to a new location

        // check if ant is not respawned
        if (!newAnt) {
            this.depositPheromone([this.currentCoordinates, coordinates]);
            this.previousCoordinates.push(this.currentCoordinates);
        } else this.previousCoordinates = [];
        this.currentCoordinates = coordinates; // move ant to new coordinates
    }
}
