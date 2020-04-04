export default class MatrixHelper {
    constructor() {
        this.iMax = imageIntensityArray1d.reduce((a, b) => a + b) / imageIntensityArray1d.length;
    }

    generateInitialMatrices() {
        global.initialPheromoneValue = 0.0001;
        for (let x = 0; x < canvasWidth; x++) {
            pheromoneMatrix[x] = [];
            heuristicMatrix[x] = [];
            for (let y = 0; y < canvasHeight; y++) {
                pheromoneMatrix[x][y] = initialPheromoneValue;
                heuristicMatrix[x][y] = this.heuristicInformationForPixel(x, y);
            }
        }
        console.log('%c heuristicMatrix', 'color: #24c95a', heuristicMatrix);
    }

    resetPheromoneMatrix(){
        for (let x = 0; x < canvasWidth; x++) {
            pheromoneMatrix[x] = [];
            for (let y = 0; y < canvasHeight; y++) {
                pheromoneMatrix[x][y] = initialPheromoneValue;
            }
        }
    }

    heuristicInformationForPixel(x, y) {
        return 1 / this.iMax * (this.getMaxIntensityValueForPixel(x, y));
    }

    getMaxIntensityValueForPixel(x, y) {
        let a, b, c, d;
        const arrLength = imageIntensityArray.length;
        const negI = (x > 0 ? 1 : 0);
        const negJ = (y > 0 ? 1 : 0);
        const posI = (x < arrLength - 1 ? 1 : 0);
        const posJ = (y < arrLength - 1 ? 1 : 0);

        a = Math.abs(imageIntensityArray[x - negI][y - negJ] - imageIntensityArray[x + posI][y + posJ]);
        b = Math.abs(imageIntensityArray[x - 0][y - negJ] - imageIntensityArray[x + 0][y + posJ]);
        c = Math.abs(imageIntensityArray[x + posI][y + posJ] - imageIntensityArray[x - negI][y - negJ]);
        d = Math.abs(imageIntensityArray[x - negI][y - 0] - imageIntensityArray[x + posI][y + 0]);

        return a > b ? (a > c ? (a > d ? a : d) : c) : b;
    }
}
