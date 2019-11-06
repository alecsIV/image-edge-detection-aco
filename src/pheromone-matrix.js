export default class PheromoneMatrix {
    constructor(image) {
        this.currentPheromoneMatrix = this.setup(image);
    }

    setup(image) {
        const imageWidth = image.width;
        const imageHeight = image.height;
        const initialPheromoneValue = 0.0001;
        const pheromoneMatrix = new Array(2);
        for (let i = 0; i < imageHeight; i++) {
            pheromoneMatrix[i] = []
            for (let j = 0; j < imageWidth; j++) {
                pheromoneMatrix[i][j] = initialPheromoneValue;
            }
        }
        return pheromoneMatrix; 
    }
}
