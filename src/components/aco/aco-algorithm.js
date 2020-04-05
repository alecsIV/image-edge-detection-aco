import MatrixHelper from "../../helpers/matrix-helper";
import AntAgent from "./agent";
import {
    loadingBar,
    elapsedTime,
    timer,
    stopTimer
} from '../../extras/extras';

export default class ACO {
    constructor(image) {
        this.image = image;
        this.canvas = document.querySelector('#canvasFg');
        this.canvasW = this.canvas.getBoundingClientRect().width;
        this.canvasH = this.canvas.getBoundingClientRect().height;
        this.canvasArea = this.canvasW * this.canvasH;
        this.ctx = this.canvas.getContext("2d");
        this.matrixHelper = new MatrixHelper();
        this.currentFrame = 1;
        this.animationCount = 0;
        this.agentCount = 0;

        this.resultDiv = document.querySelector(".binary-canvas-div");

        // generate initial pheromone and heuristic matrices
        this.matrixHelper.generateInitialMatrices();
        this.iMax = this.matrixHelper.iMax;

        this.setDefaultValues() // set default values for the parameters


        //for debug
        this.textIter = document.querySelector('#iter-text');
        this.textCurr = document.querySelector('#curr-text');
        this.textNew = document.querySelector('#new-text');
        this.textX = document.querySelector('#x-text');
        this.textY = document.querySelector('#y-text');
    }

    reset() {
        this.matrixHelper.resetPheromoneMatrix();
        this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
        this.updateGlobalParams();
        this.initializeAgents();
        this.currentFrame = 1;
        clearInterval(this.interval);
    }

    setDefaultValues() {
        this.defaultParams = {
            'iterations': 3,
            'antCount': Math.round(Math.sqrt(this.image.width * this.image.height)),
            'numAntMov': Math.round(Math.round(3 * Math.sqrt(this.image.width * this.image.height))),
            'antMemLen': Math.round(Math.sqrt(2 * (this.image.width + this.image.height)) / 500 * this.iMax) * 3,
            'nConstPD': 2,
            'pConstPD': 10,
            'tNoiseFilt': 0.1,
            'roPEvRate': 0.02,
            'alpha': 2,
            'beta': 2
        }

        Object.keys(this.defaultParams).forEach(key => {
            window[key] = Number(this.defaultParams[key]);
            window.allUI[key].value = window[key];
        });
    }

    updateGlobalParams() {
        Object.keys(this.defaultParams).forEach(key => {
            window[key] = Number(window.allUI[key].value);
        });
        console.log('Updated iterations:', iterations);
    }

    initializeAgents() {
        console.log('agentsCount', antCount);
        console.log('Num Ant Movements:', numAntMov);
        console.log('Ant memory length:', antMemLen);
        const density = Math.round(this.canvasArea / antCount);
        console.log('density', density);
        this.agents = [];
        console.log("%c pheromoneMatrix", "color: #24c95a", pheromoneMatrix);
        for (let i = 0; i < antCount; i++) {
            const y = Math.floor(i * density / this.canvasW);
            const x = (i * density) - (y * this.canvasW);
            this.agents[i] = new AntAgent(this.canvas, {
                x: x,
                y: y
            });
            this.ctx.fillRect(this.agents[i].currentCoordinates.y, this.agents[i].currentCoordinates.x, 1, 1);
        }
        console.log("%c Agents", "color: #24c95a", this.agents);
    }

    startSimulation() {
        console.log("%c Simulation start: ", "color: #bada55");
        console.log('numant', numAntMov);
        if (animation) {
            timer();
            this.interval = setInterval(this.animateMoves.bind(this), 1);
        } else this.noAnimationMoves();
    }

    noAnimationMoves() {
        const start = Date.now();
        for (this.currentFrame; this.currentFrame < iterations; this.currentFrame++) {
            console.log("%c Iteration: ", "color: #bada55", this.currentFrame);
            this.agents.forEach(agent => {
                for (let i = 0; i < numAntMov; i++) {
                    const {
                        newCoordinates,
                        newAnt
                    } = agent.calculateNextStep();
                    agent.moveTo(newCoordinates, newAnt);
                    if (agent.currentCoordinates == undefined) console.log("faulty", agent);
                    if (newAnt) i = numAntMov;
                }
            });

            // update pheromone values
            pheromoneMatrix.forEach((val, x) => {
                val.forEach((arr, y) => {
                    this.updatePheromoneLevel(this.agents, x, y);
                });
            });
            loadingBar(this.currentFrame, iterations);
        }
        console.log("%c END ANIMATION", "color: #c92424");
        this.createBinaryImage();
        elapsedTime(start, Date.now());
    }

    animateMoves() {
        const agent = this.agents[this.agentCount];
        this.animationCount++;

        if (this.animationCount >= numAntMov) {
            loadingBar(this.agentCount + ((this.agents.length - 1) * (this.currentFrame - 1)), (this.agents.length - 1) * iterations);
            this.animationCount = 0;
            this.agentCount++;
            // elapsedTime(start, Date.now());
        }
        if (this.agentCount >= this.agents.length) {
            // update pheromone values
            pheromoneMatrix.forEach((val, x) => {
                val.forEach((arr, y) => {
                    this.updatePheromoneLevel(this.agents, x, y);
                    this.ctx.fillStyle = `rgba(0, 255, 0, ${pheromoneMatrix[x][y]})`;
                    this.ctx.fillRect(
                        y,
                        x,
                        1,
                        1
                    );
                });
            });
            if (this.currentFrame >= iterations) {
                console.log("%c END ANIMATION", "color: #c92424");
                stopTimer();
                // elapsedTime(start, Date.now());
                this.createBinaryImage();
                clearInterval(this.interval);
            } else {
                console.log("%c Iteration: ", "color: #bada55", this.currentFrame);
                this.currentFrame++;
                this.agentCount = 0;
                this.animationCount = 0;
                this.createBinaryImage();
            }
        } else {
            const {
                newCoordinates,
                newAnt
            } = agent.calculateNextStep();
            agent.moveTo(newCoordinates, newAnt);
            if (agent.currentCoordinates == undefined) console.log("faulty", agent);
            if (this.animationCount % 10 === 0) {
                if (pheromoneMatrix[agent.currentCoordinates.x][agent.currentCoordinates.y] <= initialPheromoneValue) {
                    this.ctx.fillStyle = `rgba(66, 33, 123, 255)`;
                } else {
                    this.ctx.fillStyle = `rgba(237, 0, 1, 255)`;
                }
                if (agent.previousCoordinates.length > 10) {
                    for (let k = 1; k < 10; k++) {
                        this.ctx.fillRect(
                            agent.previousCoordinates[agent.previousCoordinates.length - k].y,
                            agent.previousCoordinates[agent.previousCoordinates.length - k].x,
                            1,
                            1
                        );
                    }
                }
                this.ctx.fillRect(
                    agent.currentCoordinates.y,
                    agent.currentCoordinates.x,
                    1,
                    1
                );
            }
            if (newAnt) {
                this.animationCount = numAntMov; // checks if a new ant is generated and exits loop
            }
        }
        if (agent !== undefined) {
            this.textIter.value = this.currentFrame;
            this.textCurr.value = this.agentCount;
            this.textNew.value = this.animationCount;
            this.textX.value = agent.currentCoordinates.x;
            this.textY.value = agent.currentCoordinates.y;
        }
        // elapsedTime(start, Date.now());
    }

    updatePheromoneLevel(agents, x, y) {
        let sumPheromone = 0;
        agents.forEach(agent => {
            if (agent.previousCoordinates[x] && agent.previousCoordinates[y]) {
                sumPheromone += pheromoneMatrix[x][y] >= tNoiseFilt ? pheromoneMatrix[x][y] : 0;
            }
        });
        const newPheromoneLevel = (1 - roPEvRate) * pheromoneMatrix[x][y] + sumPheromone;
        pheromoneMatrix[x][y] = newPheromoneLevel;
    }

    createBinaryImage() {
        const width = this.canvasW,
            height = this.canvasH;
        let buffer = new Uint8ClampedArray(width * height * 4);

        const binaryCanvas = document.createElement("canvas");
        binaryCanvas.setAttribute("class", "binary-canvas");
        binaryCanvas.setAttribute("width", width);
        binaryCanvas.setAttribute("height", height);
        const binCtx = binaryCanvas.getContext("2d");

        pheromoneMatrix.forEach((arr, x) => {
            arr.forEach((value, y) => {
                if (value > initialPheromoneValue) {
                    const pos = (x * height + y) * 4;
                    const valueRGB = 0;
                    buffer[pos] = valueRGB; // some R value [0, 255]
                    buffer[pos + 1] = valueRGB; // some G value
                    buffer[pos + 2] = valueRGB; // some B value
                    buffer[pos + 3] = 255; // set alpha channel
                }
            });
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
