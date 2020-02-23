import MatrixHelper from '../helpers/matrix-helper';
import AntAgent from './agent';

export default class ACO {
    constructor(image, canvas) {
        this.image = image;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.matrixHelper = new MatrixHelper();
        this.iterations = 4;
        this.L = 1700;
        this.l = 47;
        this.currentFrame = 1;

        this.resultDiv = document.querySelector('.binary-canvas-div');

        // generate initial pheromone and heuristic matrices
        this.matrixHelper.generateInitialMatrices();
        // create agents and position them randomly on the canvas
        this.initializeAgents();
    }

    initializeAgents() {
        this.agentCount = 560;
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
    }

    animate(x, y) {
        this.ctx.fillRect(x, y, 1, 1);
    }

    startSimulation() {
        console.log('%c Starting simulation ...', 'color: #bada55');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.heigth);
        this.agents.forEach((agent) => {
            for (let i = 0; i < this.L; i++) {
                const newCoordinates = agent.calculateNextStep(this.l);
                agent.moveTo(newCoordinates);
                if (agent.currentCoordinates == undefined) console.log('faulty', agent);
                this.ctx.fillRect(agent.currentCoordinates.y, agent.currentCoordinates.x, agent.agentSize, agent.agentSize);
                // if (agent.currentCoordinates.x === agent.previousCoordinates[agent.previousCoordinates.length - 1].x && agent.currentCoordinates.y === agent.previousCoordinates[agent.previousCoordinates.length - 1].y) i = this.L;
            }
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
    }

    createBinaryImage() {
        const width = 500,
            height = 500;
        let buffer = new Uint8ClampedArray(width * height * 4);
        let pheromoneAvg = 0;
        const temp = [];
        pheromoneMatrix.forEach((arr, x) => {
            // arr.reduce((a,b)=> a+b);
            arr.forEach((value, y) => {
                pheromoneAvg += value;
                if (value >= 1) temp.push(value);
            });
        });
        pheromoneAvg /= (pheromoneMatrix.length - 1);
        console.log('average', pheromoneAvg);
        console.log('average2', pheromoneAvg / 2);
        console.log('number of >=1', temp.length);

        const binaryCanvas = document.createElement('canvas');
        binaryCanvas.setAttribute('class', 'binary-canvas');
        binaryCanvas.setAttribute('width', '500');
        binaryCanvas.setAttribute('height', '500');
        const binCtx = binaryCanvas.getContext('2d');

        pheromoneMatrix.forEach((arr, x) => {
            arr.forEach((value, y) => {
                const pos = (x * width + y) * 4;
                const valueRGB = (value <= 0.002) ? 255 : 0;
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
