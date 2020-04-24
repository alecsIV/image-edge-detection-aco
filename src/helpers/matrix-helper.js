/* -------------------------------------------------------------------------- */
/*                          Matrices helper functions                         */
/* -------------------------------------------------------------------------- */

export default class MatrixHelper {
    constructor() {
        this.iMax = imageIntensityArray1d.reduce((a, b) => a + b) / imageIntensityArray1d.length; // get the mean value
    }

    generateInitialMatrices() {
        // construct the initial matrices (2d arrays)
        for (let x = 0; x < canvasHeight; x++) {
            pheromoneMatrix[x] = [];
            heuristicMatrix[x] = [];
            for (let y = 0; y < canvasWidth; y++) {
                pheromoneMatrix[x][y] = initialPheromoneValue;
                heuristicMatrix[x][y] = this.heuristicInformationForPixel(x, y);
            }
        }
        // FOR DEBUGGING : Heuristuc matrix
        // console.log('%c heuristicMatrix', 'color: #24c95a', heuristicMatrix); // print the matrix in the console
    }

    resetPheromoneMatrix() {
        // reset the pheromone matrix to its initial state
        for (let x = 0; x < canvasHeight; x++) {
            pheromoneMatrix[x] = [];
            for (let y = 0; y < canvasWidth; y++) {
                pheromoneMatrix[x][y] = initialPheromoneValue;
            }
        }
    }

    heuristicInformationForPixel(x, y) {
        // get the heuristic information for a given pixel
        return (1 / this.iMax) * (this.getMaxIntensityValueForPixel(x, y));
    }

    getMaxIntensityValueForPixel(x, y) {
        // calculate heuristic information for a pixel given its 5x5 neighbourhood
        // based on equation 5 from Liu and Fang's (2015) article 
        const arrLength = imageIntensityArray.length - 1;
        const neighbourhoodIntensities = [];

        // loop through the whole 5x5 neighbourhood
        for (let u = 0; u <= 2; u++) {
            for (let v = -2; v <= 2; v++) {
                // bound limits
                const boundX = (x > 1 ? ((x < arrLength - 1)? u : 0) : 0);
                const boundY = (y > 1 ? ((y < arrLength - 1)? v : 0) : 0);
                // calculate values based on the mirror principle
                neighbourhoodIntensities.push(Math.abs(imageIntensityArray[x - boundX][y - boundY] - imageIntensityArray[x + boundX][y + boundY]));
            }
        }
        return Math.max(...neighbourhoodIntensities); // get the maximum intensity value from the pixel's neighbourhood
    }
}
