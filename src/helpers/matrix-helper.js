export default class MatrixHelper {
    constructor() {
        this.iMax = imageIntensityArray1d.reduce((a, b) => a + b) / imageIntensityArray1d.length;
    }

    generateInitialMatrices() {
        global.initialPheromoneValue = 0.0001;
        for (let x = 0; x < canvasHeight; x++) {
            pheromoneMatrix[x] = [];
            heuristicMatrix[x] = [];
            for (let y = 0; y < canvasWidth; y++) {
                pheromoneMatrix[x][y] = initialPheromoneValue;
                heuristicMatrix[x][y] = this.heuristicInformationForPixel(x, y);
            }
        }
        console.log('%c heuristicMatrix', 'color: #24c95a', heuristicMatrix);
    }

    resetPheromoneMatrix() {
        for (let x = 0; x < canvasHeight; x++) {
            pheromoneMatrix[x] = [];
            for (let y = 0; y < canvasWidth; y++) {
                pheromoneMatrix[x][y] = initialPheromoneValue;
            }
        }
    }

    heuristicInformationForPixel(x, y) {
        return (1 / this.iMax) * (this.getMaxIntensityValueForPixel(x, y));
    }

    getMaxIntensityValueForPixel(x, y) {
        const arrLength = imageIntensityArray.length - 1;
        const neighbourhoodIntensities = [];

        for (let u = 0; u <= 2; u++) {
            for (let v = -2; v <= 2; v++) {
                const boundX = (x > 1 ? ((x < arrLength - 1)? u : 0) : 0);
                const boundY = (y > 1 ? ((y < arrLength - 1)? v : 0) : 0);
                neighbourhoodIntensities.push(Math.abs(imageIntensityArray[x - boundX][y - boundY] - imageIntensityArray[x + boundX][y + boundY]));
            }
        }
        return Math.max(...neighbourhoodIntensities);
    }
}
