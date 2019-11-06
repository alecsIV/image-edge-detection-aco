import PheromoneMatrix from './pheromone-matrix';
import AntAgent from './agent';

export default class ACO {
    constructor(image, canvas) {
        this.getPheromoneMatrix(image);
        this.image = image;
        this.canvas = canvas;
        this.initializeAgents();
    }
    
    getPheromoneMatrix(image) {
        this.pheromoneMatrixClass = new PheromoneMatrix(image);
        this.pheromoneMatrix = this.pheromoneMatrixClass.currentPheromoneMatrix;
    }

    initializeAgents() {
        this.agentCount = 500;
        this.agents = [];
        for(let i = 0; i < this.agentCount - 1; i++){
            this.agents[i] = new AntAgent(this.canvas);
        };
        console.log('Agents', this.agents);
    }

    // createImageMatrix(image) {
    //     const numberOfPixels =  image.data.length / 4;

    // }
}
