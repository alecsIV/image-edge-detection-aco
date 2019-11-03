import PheromoneMatrix from './pheromone-matrix';
export default class ACO {
    constructor(imageMatrix) {
        this.pheromoneMatrix = new PheromoneMatrix();
        console.log('PHEROMONE ACO', this.pheromoneMatrix);
    }
}
