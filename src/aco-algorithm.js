import PheromoneMatrix from './pheromone-matrix';
export default class ACO {
    constructor(imageMatrix) {
        this.getPheromoneMatrix(imageMatrix);
    }
    
    getPheromoneMatrix(imageMatrix) {
        this.pheromoneMatrixClass = new PheromoneMatrix(imageMatrix);
        this.pheromoneMatrix = this.pheromoneMatrix.currentPheromoneMatrix;
    }
}
