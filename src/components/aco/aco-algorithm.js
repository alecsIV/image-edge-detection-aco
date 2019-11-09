import MatrixHelper from '../helpers/matrix-helper';
import AntAgent from './agent';

export default class ACO {
    constructor(image, canvas) {
        this.image = image;
        this.canvas = canvas;
        this.matrixHelper = new MatrixHelper();

        // generate initial pheromone and heuristic matrices
        this.matrixHelper.generateInitialMatrices(image);
        // create agents and position them randomly on the canvas
        this.initializeAgents();
    }

    initializeAgents() {
        this.agentCount = 500;
        this.agents = [];
        for (let i = 0; i < this.agentCount - 1; i++) {
            this.agents[i] = new AntAgent(this.canvas);
            this.drawAgent(this.canvas, this.agents[i].currentCoordinates)
        };
        console.log('Agents', this.agents);
    }


    drawAgent(canvas, coordinates) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(coordinates.x, coordinates.y, 1, 1);
        ctx.fillRect(coordinates.x, coordinates.y, 1, 1);
    }

    startSimulation() {
        const iterations = 5;

        for (let i = 0; i < iterations; i++) {
            this.agents.forEach(agent => {
                agent.calculateNextStep();
            });
        }
    }
}
