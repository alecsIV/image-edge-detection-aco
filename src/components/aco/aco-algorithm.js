import MatrixHelper from '../helpers/matrix-helper';
import AntAgent from './agent';

export default class ACO {
    constructor(image, canvas) {
        this.image = image;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.matrixHelper = new MatrixHelper();
        this.iterations = 200;
        this.currentFrame = 0;

        // generate initial pheromone and heuristic matrices
        this.matrixHelper.generateInitialMatrices();
        // create agents and position them randomly on the canvas
        this.initializeAgents();
    }

    initializeAgents() {
        this.agentCount = 5;
        this.agents = [];
        console.log('pheromoneMatrix', pheromoneMatrix);
        for (let i = 0; i < this.agentCount; i++) {
            this.agents[i] = new AntAgent(this.canvas);
            this.initialDraw(this.agents[i].currentCoordinates)
        };
        console.log('Agents', this.agents);
    }

    initialDraw(coordinates) {
        this.ctx.fillRect(coordinates.x, coordinates.y, 1, 1);
    }


    drawAgent(agent) {
        this.ctx.fillRect(agent.currentCoordinates.x, agent.currentCoordinates.y);

        // const xPrev = agent.previousCoordinates[agent.previousCoordinates.length - 1].x;
        // const yPrev = agent.previousCoordinates[agent.previousCoordinates.length - 1].y;
        // const x = agent.currentCoordinates.x;
        // const y = agent.currentCoordinates.y;
        // this.ctx.beginPath();
        // this.ctx.moveTo(xPrev, yPrev);
        // this.ctx.lineTo(x, y);
        // this.ctx.stroke();
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
        console.log('%c Starting simulation ...', 'color: #bada55');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.heigth);
        this.agents.forEach((agent) => {
            const newCoordinates = agent.calculateNextStep();
            agent.moveTo(newCoordinates);
            if (agent.currentCoordinates == undefined) console.log('faulty', agent);
            this.ctx.fillRect(agent.currentCoordinates.x, agent.currentCoordinates.y, agent.agentSize, agent.agentSize);
        });

        // update pheromone values
        this.agents.forEach(agent => {
            console.log('%c AGENT:', 'color: #981b1b', agent);
            agent.updatePheromoneLevel(agent);
        });

        console.log('Current frame: ', this.currentFrame);

        if (this.currentFrame !== this.iterations) {
            this.currentFrame++;
            window.requestAnimationFrame(this.startSimulation.bind(this));
        } else console.log('END ANIMATION');
        // this.agents.forEach((agent) => {
        //     const foreachLoop = agent.previousCoordinates.forEach((prevPosition, i) => {
        //         if (i < agent.previousCoordinates.length - 1) {
        //             this.ctx.fillRect(prevPosition.x, agent.previousCoordinates[i+1].y, 1, 1);
        //             window.requestAnimationFrame(foreachLoop);
        //         } else {
        //             this.ctx.fillRect(prevPosition.x, agent.currentCoordinates.y, 1, 1);
        //             window.requestAnimationFrame(foreachLoop);
        //         }
        //     });

        // });
    }
}
