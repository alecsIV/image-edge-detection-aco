import PheromoneMatrix from './pheromone-matrix';
export default class ACO {
    constructor(image) {
        this.getPheromoneMatrix(image);
    }
    
    getPheromoneMatrix(image) {
        this.pheromoneMatrixClass = new PheromoneMatrix(image);
        this.pheromoneMatrix = this.pheromoneMatrixClass.currentPheromoneMatrix;
    }

    // createImageMatrix(image) {
    //     const numberOfPixels =  image.data.length / 4;

    // }
}
