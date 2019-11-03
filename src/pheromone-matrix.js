export default class PheromoneMatrix {
    constructor(imageMatrix) {
        this.setup(imageMatrix);
    }

    setup(imageMatrix) {
        const initialPheromoneValue = 0.0001;
        const pheromoneMatrix = [];
        for(let i = 0; i < imageMatrix.length/4; i++){
            pheromoneMatrix.push(initialPheromoneValue);
        }
        console.log('pheromone init matrix', pheromoneMatrix);
    }
}
