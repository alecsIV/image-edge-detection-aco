import MatrixHelper from '../helpers/matrix-helper';
import AntAgent from './agent';

export default class ACO {
    constructor(image, canvas) {
        this.image = image;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.matrixHelper = new MatrixHelper();
        this.iterations = 2;
        this.currentFrame = 1;
        this.L = 560;
        this.currentMove = 0;

        this.resultDiv = document.querySelector('.canvas-result-container');
        this.resultCanvas = document.querySelector('.canvas-result');

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
        // for (let i = 0; i < this.iterations; i++) {
        console.log('%c Starting simulation ...', 'color: #bada55');
        // // Store the current transformation matrix
        // this.ctx.save();

        // // Use the identity matrix while clearing the canvas
        // this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // // Restore the transform
        // this.ctx.restore();
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.heigth);
        this.agents.forEach((agent) => {
            // window.requestAnimationFrame(() => {
                for (let j = 0; j < this.L; j++) {
                    const newCoordinates = agent.calculateNextStep();
                    agent.moveTo(newCoordinates);
                    if (agent.currentCoordinates == undefined) console.log('faulty', agent);
                    this.ctx.fillRect(agent.currentCoordinates.y, agent.currentCoordinates.x, agent.agentSize, agent.agentSize)
                }
            // });
            // this.executeAntMovements(agent);
            // console.log('agent', agent);
        });

        // update pheromone values
        this.agents.forEach(agent => {
            agent.updatePheromoneLevel(agent);
        });

        if (this.currentFrame < this.iterations) {
            //     console.log('%c END OF SIMULATION', 'color: #c92424');
            //     this.createBinaryImage();
            // }
            this.currentFrame++;
            window.requestAnimationFrame(this.startSimulation.bind(this));
        } else {
            console.log('%c END ANIMATION', 'color: #c92424');
            this.createBinaryImage();
        }
        // }
    }

    executeAntMovements(agent) {
        // console.log('agent2', agent);
        for (let i = 0; i < this.L; i++) {
                    // Store the current transformation matrix
        this.ctx.save();

        // Use the identity matrix while clearing the canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Restore the transform
        this.ctx.restore();
            const newCoordinates = agent.calculateNextStep();
            agent.moveTo(newCoordinates);
            if (agent.currentCoordinates == undefined) console.log('faulty', agent);
            this.ctx.fillRect(agent.currentCoordinates.y, agent.currentCoordinates.x, agent.agentSize, agent.agentSize);
            agent.moves++;
            // if (this.currentMove < this.L) {
            //     agent.moves++;
            //     this.currentMove++;
            //     // window.requestAnimationFrame(this.executeAntMovements.bind(this, agent));
            // } else {
            //     console.log('FINISHED ANIMATING');
            //     // window.cancelAnimationFrame(window.requestAnimationFrame(this.executeAntMovements));
            //     this.currentMove = 0;
            //     return;
            // }
        }
    }

    createBinaryImage() {
        console.log('HERE');
        const width = 500,
            height = 500;
        let buffer = new Uint8ClampedArray(width * height * 4);

        const resultCtx = this.resultCanvas.getContext('2d');
        resultCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)

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
        const idata = resultCtx.createImageData(width, height);

        // set our buffer as source
        idata.data.set(buffer);

        // update canvas with new data
        resultCtx.putImageData(idata, 0, 0);
    }
}
