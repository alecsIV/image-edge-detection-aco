import PheromoneMatrix from './pheromone-matrix';
import AntAgent from './agent';

export default class ACO {
    constructor(image, canvas) {
        // this.getPheromoneMatrix(image);
        this.image = image;
        this.canvas = canvas;
        this.initializeAgents();
    }
    
    // getPheromoneMatrix(image) {
    //     this.pheromoneMatrixClass = new PheromoneMatrix(image);
    //     this.pheromoneMatrix = this.pheromoneMatrixClass.currentPheromoneMatrix;
    // }

    initializeAgents() {
        this.agentCount = 5000;
        this.agents = [];
        for(let i = 0; i < this.agentCount - 1; i++){
            this.agents[i] = new AntAgent(this.canvas, this.image.getIntensityArray());
            this.drawAgent(this.canvas, this.agents[i].currentCoordinates)
        };
        console.log('Agents', this.agents);
    }


    drawAgent(canvas, coordinates) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(coordinates.x, coordinates.y, 1, 1);
        ctx.fillRect(coordinates.x, coordinates.y, 1, 1);
    }

    startSimulation(){
        console.log(this.agents[0].getIntensityArray(this.agents[0].currentCoordinates))       
    }


    // createImageMatrix(image) {
    //     const numberOfPixels =  image.data.length / 4;

    // }
}
