export default class PheromoneMatrix {
    constructor(image) {
        this.iMax = imageIntensityArray.reduce((a, b) => a + b) / imageIntensityArray.length;
        this.currentPheromoneMatrix = this.setup(image);
    }

    setup(image) {
        const imageWidth = image.width;
        const imageHeight = image.height;
        const initialPheromoneValue = 0.0001;
        const pheromoneMatrix = new Array(2);
        const heuristicMatrix = new Array(2);
        for (let i = 0; i < imageHeight; i++) {
            pheromoneMatrix[i] = [];
            heuristicMatrix[i] = [];
            for (let j = 0; j < imageWidth; j++) {
                pheromoneMatrix[i][j] = initialPheromoneValue;
                heuristicMatrix[i][j] = this.heuristicInformationForPixel(i, j);
            }
        }
        return pheromoneMatrix;
    }

    heuristicInformationForPixel(i, j) {
        const x = 5,
            y = 5;
        return 1 / this.iMax
    }

    getMaxIntensityValueForPixel(i, j) {
        const x = 3,
            y = 3;
        let a, b, c, d;
        a= imageIntensityArray
    }
}
