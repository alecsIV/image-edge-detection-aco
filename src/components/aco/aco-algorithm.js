import MatrixHelper from '../helpers/matrix-helper';
import AntAgent from './agent';

export default class ACO {
    constructor(image, canvas) {
        this.image = image;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.matrixHelper = new MatrixHelper();
        this.iterations = 4;
        this.currentFrame = 1;

        this.resultDiv = document.querySelector('.binary-canvas-div');

        // generate initial pheromone and heuristic matrices
        this.matrixHelper.generateInitialMatrices();
        // create agents and position them randomly on the canvas
        this.initializeAgents();
    }

    initializeAgents() {
        this.agentCount = 20000;
        this.agents = [];
        console.log('%c pheromoneMatrix', 'color: #24c95a', pheromoneMatrix);
        for (let i = 0; i < this.agentCount; i++) {
            this.agents[i] = new AntAgent(this.canvas);
            this.initialDraw(this.agents[i].currentCoordinates)
        };
        console.log('%c Agents', 'color: #24c95a', this.agents);
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
            this.ctx.fillRect(agent.currentCoordinates.y, agent.currentCoordinates.x, agent.agentSize, agent.agentSize);
        });

        // update pheromone values
        this.agents.forEach(agent => {
            agent.updatePheromoneLevel(agent);
        });

        if (this.currentFrame !== this.iterations) {
            this.currentFrame++;
            window.requestAnimationFrame(this.startSimulation.bind(this));
        } else {
            console.log('%c END ANIMATION', 'color: #c92424');
            this.createBinaryImage();
        }
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

    createBinaryImage() {
        const width = 500,
            height = 500;
        let buffer = new Uint8ClampedArray(width * height * 4);

        const binaryCanvas = document.createElement('canvas');
        binaryCanvas.setAttribute('class', 'binary-canvas');
        binaryCanvas.setAttribute('width', '500');
        binaryCanvas.setAttribute('height', '500');
        const binCtx = binaryCanvas.getContext('2d');

        pheromoneMatrix.forEach((arr, x) => {
            arr.forEach((value, y) => {
                const pos = (x * width + y) * 4;
                const valueRGB = (value <= 0.0002) ? 255 : 0;
                buffer[pos] = valueRGB; // some R value [0, 255]
                buffer[pos + 1] = valueRGB; // some G value
                buffer[pos + 2] = valueRGB // some B value
                buffer[pos + 3] = 255; // set alpha channel
            })
        });

        // create imageData object
        const idata = binCtx.createImageData(width, height);

        // set our buffer as source
        idata.data.set(buffer);

        // update canvas with new data
        binCtx.putImageData(idata, 0, 0);
        this.resultDiv.appendChild(binaryCanvas);

    }
}
