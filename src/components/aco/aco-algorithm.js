import MatrixHelper from '../helpers/matrix-helper';
import AntAgent from './agent';

export default class ACO {
    constructor(image, canvas) {
        this.image = image;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.matrixHelper = new MatrixHelper();

        // generate initial pheromone and heuristic matrices
        this.matrixHelper.generateInitialMatrices(image);
        // create agents and position them randomly on the canvas
        this.initializeAgents();
    }

    initializeAgents() {
        this.agentCount = 500;
        this.agents = [];
        console.log('pheromoneMatrix', pheromoneMatrix);
        for (let i = 0; i < this.agentCount - 1; i++) {
            this.agents[i] = new AntAgent(this.canvas);
            this.initialDraw(this.agents[i].currentCoordinates)
        };
        console.log('Agents', this.agents);
    }

    initialDraw(coordinates) {
        this.ctx.fillRect(coordinates.x, coordinates.y, 1, 1);
    }


    drawAgent(agent) {
        const xPrev = agent.previousCoordinates[agent.previousCoordinates.length - 1].x;
        const yPrev = agent.previousCoordinates[agent.previousCoordinates.length - 1].y;
        const x = agent.currentCoordinates.x;
        const y = agent.currentCoordinates.y;
        this.ctx.beginPath();
        this.ctx.moveTo(xPrev, yPrev);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        // let dx = agent.currentCoordinates.x - agent.previousCoordinates[agent.previousCoordinates.length - 1].x;
        // let dy = agent.currentCoordinates.y - agent.previousCoordinates[agent.previousCoordinates.length - 1].y;
        // let maxD = (Math.max(Math.abs(dx), Math.abs(dy)) == Math.abs(dx)) ? Math.abs(dx) : Math.abs(dy);
        // while (maxD > 0) {
        //     console.log('test', maxD);
        //     requestAnimationFrame(() => this.animate(agent.currentCoordinates.x + dx, agent.currentCoordinates.y + dy));
        //     maxD--;
        //     (dx > 0)? dx-- : dx++;
        //     (dy > 0)? dy-- : dy++;
        // }
        // this.ctx.clearRect(coordinates.x, coordinates.y, 1, 1);
    }

    animate(x, y) {
        this.ctx.fillRect(x, y, 1, 1);
    }

    // drawNewAgentPosition(coordinates){
    //     this.ctx.fillRect(coordinates.x, coordinates.y)
    // }

    startSimulation() {
        const iterations = 25;
        for (let i = 0; i < iterations; i++) {
            this.agents.forEach((agent, i) => {
                const newCoordinates = agent.calculateNextStep();
                agent.moveTo(newCoordinates);
                if (agent.currentCoordinates == undefined) console.log('faulty', agent);
                this.drawAgent(agent);
            });
        }
        this.waitSeconds(500);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.agents.forEach((agent, i) => {
            if (i === 20) console.log('faulty', agent);
            this.ctx.fillRect(agent.currentCoordinates.x, agent.currentCoordinates.y, agent.agentSize, agent.agentSize);
        });
    }
    waitSeconds(iMilliSeconds) {
        var counter= 0
            , start = new Date().getTime()
            , end = 0;
        while (counter < iMilliSeconds) {
            end = new Date().getTime();
            counter = end - start;
        }
    }
}
