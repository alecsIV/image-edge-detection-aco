export default class MatrixHelper {
    constructor() {
        this.iMax = imageIntensityArray1d.reduce((a, b) => a + b) / imageIntensityArray1d.length;
    }

    generateInitialMatrices() {
        global.initialPheromoneValue = 0.0001;
        for (let i = 0; i < canvasWidth; i++) {
            pheromoneMatrix[i] = [];
            heuristicMatrix[i] = [];
            for (let j = 0; j < canvasHeight; j++) {
                pheromoneMatrix[i][j] = initialPheromoneValue;
                heuristicMatrix[i][j] = this.heuristicInformationForPixel(i, j);
            }
        }
        console.log('%c heuristicMatrix', 'color: #24c95a', heuristicMatrix);
    }

    resetPheromoneMatrix(){
        for (let i = 0; i < canvasWidth; i++) {
            pheromoneMatrix[i] = [];
            for (let j = 0; j < canvasHeight; j++) {
                pheromoneMatrix[i][j] = initialPheromoneValue;
            }
        }
    }

    heuristicInformationForPixel(i, j) {
        return 1 / this.iMax * (this.getMaxIntensityValueForPixel(i, j));
    }

    getMaxIntensityValueForPixel(i, j) {
        let a, b, c, d;
        const arrLength = imageIntensityArray.length;
        const negI = (i > 0 ? 1 : 0);
        const negJ = (j > 0 ? 1 : 0);
        const posI = (i < arrLength - 1 ? 1 : 0);
        const posJ = (j < arrLength - 1 ? 1 : 0);

        a = Math.abs(imageIntensityArray[i - negI][j - negJ] - imageIntensityArray[i + posI][j + posJ]);
        b = Math.abs(imageIntensityArray[i - 0][j - negJ] - imageIntensityArray[i + 0][j + posJ]);
        c = Math.abs(imageIntensityArray[i + posI][j + posJ] - imageIntensityArray[i - negI][j - negJ]);
        d = Math.abs(imageIntensityArray[i - negI][j - 0] - imageIntensityArray[i + posI][j + 0]);

        return a > b ? (a > c ? (a > d ? a : d) : c) : b;
    }
}
