export default class MatrixHelper {
    constructor() {
        this.iMax = imageIntensityArray1d.reduce((a, b) => a + b) / imageIntensityArray1d.length;
        // this.currentPheromoneMatrix = this.generateInitialMatrices(image);
    }

    generateInitialMatrices() {
        const initialPheromoneValue = 0.0001;
        for (let i = 0; i < canvasHeight; i++) {
            pheromoneMatrix[i] = [];
            heuristicMatrix[i] = [];
            for (let j = 0; j < canvasWidth; j++) {
                pheromoneMatrix[i][j] = initialPheromoneValue;
                heuristicMatrix[i][j] = this.heuristicInformationForPixel(i, j);
            }
        }
        console.log('heuristicMatrix: ', heuristicMatrix);
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
        if (i === 1 && j === 1) {
            console.log('arrLength', arrLength);
            console.log('image intensity array: ', imageIntensityArray);
            console.table({
                'negI': negI,
                'negJ': negJ,
                'posI': posI,
                'posJ': posJ
            });
        }

        a = Math.abs(imageIntensityArray[i - negI][j - negJ] - imageIntensityArray[i + posI][j + posJ]);
        b = Math.abs(imageIntensityArray[i - 0][j - negJ] - imageIntensityArray[i + 0][j + posJ]);
        c = Math.abs(imageIntensityArray[i + posI][j + posJ] - imageIntensityArray[i - negI][j - negJ]);
        d = Math.abs(imageIntensityArray[i - negI][j - 0] - imageIntensityArray[i + posI][j + 0]);

        return a > b ? (a > c ? (a > d ? a : d) : c) : b;
    }
}
