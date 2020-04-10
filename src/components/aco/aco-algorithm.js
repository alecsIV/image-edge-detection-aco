import MatrixHelper from "../../helpers/matrix-helper";
import AntAgent from "./agent";
import ResultsGallery from '../results-gallery/results-gallery';
import {
    loadingBar,
    elapsedTime,
    timer,
    stopTimer
} from '../../helpers/extras';

export default class ACO {
    constructor(image) {
        this.image = image;
        this.canvas = document.querySelector('#canvasFg');
        this.canvasW = this.canvas.getBoundingClientRect().width;
        this.canvasH = this.canvas.getBoundingClientRect().height;
        this.canvasArea = this.canvasW * this.canvasH;
        this.ctx = this.canvas.getContext("2d");
        this.matrixHelper = new MatrixHelper();
        this.resultsGallery = new ResultsGallery;

        this.currentFrame = 1;
        this.animationCount = 0;
        this.agentCount = 0;
        this.paused = false;

        // generate initial pheromone and heuristic matrices
        this.matrixHelper.generateInitialMatrices();
        this.iMax = this.matrixHelper.iMax;

        this.setDefaultValues() // set default values for the parameters

        // Simulation stats
        this.textIter = document.querySelector('#iter-text');
        this.textCurr = document.querySelector('#curr-text');
        this.textNew = document.querySelector('#new-text');
        this.textX = document.querySelector('#x-text');
        this.textY = document.querySelector('#y-text');
    }

    init() {
        this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
        this.updateGlobalParams();
        this.initializeAgents();
        this.currentFrame = 1;
        this.animationIntervalId = null;
    }

    reset(full) {
        clearInterval(this.animationIntervalId);
        this.lastTime = stopTimer(false);
        this.matrixHelper.resetPheromoneMatrix();
        if (full === 'full') {
            this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
            this.currentFrame = 1;
            this.animationIntervalId = null;
        } else this.init();
    }

    stop() {
        this.paused = true;
        clearInterval(this.animationIntervalId);
        this.lastTime = stopTimer(true);
    }

    //set default algorithm param values
    setDefaultValues() {
        this.defaultParams = {
            'iterations': 3,
            'antCount': Math.round(Math.sqrt(this.image.width * this.image.height)),
            'numAntMov': Math.round(Math.round(3 * Math.sqrt(this.image.width * this.image.height))),
            'antMemLen': Math.round(Math.sqrt(2 * (this.image.width + this.image.height))),
            'nConstPD': 2,
            'pConstPD': 10,
            'tNoiseFilt': 0.1,
            'roPEvRate': 0.02,
            'alpha': 2,
            'beta': 2
        }

        Object.keys(this.defaultParams).forEach(key => {
            window[key] = Number(this.defaultParams[key]); // save the currently used vars globally 
            window.allUI[key].value = window[key];
        });
    }
    updateGlobalParams() {
        Object.keys(this.defaultParams).forEach(key => {
            window[key] = Number(window.allUI[key].value);
        });
    }

    initializeAgents() {
        console.log('agentsCount', antCount);
        console.log('Num Ant Movements:', numAntMov);
        console.log('Ant memory length:', antMemLen);
        const density = Math.round(this.canvasArea / antCount);
        console.log('density', density);
        console.log('cvw', this.canvasW);
        this.agents = [];
        console.log("%c pheromoneMatrix", "color: #24c95a", pheromoneMatrix);
        for (let i = 0; i < antCount; i++) {
            const x = Math.floor(i * density / this.canvasW);
            const y = (i * density) - (x * this.canvasW);
            this.agents[i] = new AntAgent(this.canvas, {
                x: x,
                y: y
            });
            this.ctx.fillRect(this.agents[i].currentCoordinates.y, this.agents[i].currentCoordinates.x, 2, 1);
        }
        console.log("%c Agents", "color: #24c95a", this.agents);
    }

    startSimulation() {
        console.log("%c Simulation start: ", "color: #bada55");
        events.emit('start-simulation');
        if (!this.paused) this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
        if (animation) {
            timer((this.lastTime) ? this.lastTime : null); // check if timer has been stopped
            this.animationIntervalId = setInterval(this.animateMoves.bind(this), 1);
        } else {
            events.emit('simulation-without-animation');
            setTimeout(() => this.noAnimationMoves(), 500);
        }
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
        }
        console.log("%c END ANIMATION", "color: #c92424");
        loadingBar(iterations, iterations);
        this.resultsGallery.createBinaryImage();
        elapsedTime(start, Date.now());
        events.emit('simulation-complete');
    }

    animateMoves() {
        const agent = this.agents[this.agentCount];
        this.animationCount++;

        if (this.animationCount >= numAntMov) {
            loadingBar(this.agentCount + ((this.agents.length - 1) * (this.currentFrame - 1)), (this.agents.length - 1) * iterations);
            this.animationCount = 0;
            this.agentCount++;
        }
        if (this.agentCount >= this.agents.length) {
            // update pheromone values
            pheromoneMatrix.forEach((val, y) => {
                val.forEach((arr, x) => {
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
                this.resultsGallery.createBinaryImage();
                clearInterval(this.animationIntervalId);
                events.emit('simulation-complete');
            } else {
                console.log("%c Iteration: ", "color: #bada55", this.currentFrame);
                this.currentFrame++;
                this.agentCount = 0;
                this.animationCount = 0;
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

}
