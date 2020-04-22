/* -------------------------------------------------------------------------- */
/*                           ACO algorithm main file                          */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

import AntAgent from "./agent";
import MatrixHelper from '../../helpers/matrix-helper';
import {
    loadingBar,
    elapsedTime,
    timer,
    stopTimer
} from '../../helpers/extras';

/* -------------------------------------------------------------------------- */

export default class ACO {
    constructor(image, resultsGallery) {

/* ------------------------ Get environment settings ------------------------ */

        this.image = image; // get uploaded image information
        this.canvas = document.querySelector('#canvasFg'); // get the drawing layer of the canvas to preserve the background
        this.canvasW = this.canvas.getBoundingClientRect().width; // get the canvas width
        this.canvasH = this.canvas.getBoundingClientRect().height; // get the canvas height
        this.canvasArea = this.canvasW * this.canvasH; // get canvas area
        this.ctx = this.canvas.getContext("2d"); // get the canvas context

/* -------------------------- Get external classes -------------------------- */

        this.matrixHelper = new MatrixHelper; // initialise the matrix helper 
        this.resultsGallery = resultsGallery; // get the already initialised results gallery class from app.js

/* --------------------- Visualisation control variables -------------------- */

        this.currentFrame = 1; // set the current frame of the animation loop
        this.animationCount = 0; // set the animation step of an ant
        this.agentCount = 0; // set the currently drawn agent
        this.paused = false; // true if the algorithm is paused

/* ------------ Generate initial pheromone and heuristic matrices ----------- */

        this.matrixHelper.generateInitialMatrices(); // generate the initial matrices

/* ----------------- Set default user input values for image ---------------- */

        this.setDefaultValues() // set default values for the parameters

/* ---------------------------- Simulation stats ---------------------------- */

        this.textIter = document.querySelector('#iter-text'); // current iteration
        this.textCurr = document.querySelector('#ant-text'); // current ant
        this.textNew = document.querySelector('#step-text');  // current step
        this.textX = document.querySelector('#x-text'); // current x coordinate
        this.textY = document.querySelector('#y-text'); // current y coordinate
    }

    init() {
        // initialise - called when an image is uploaded
        this.ctx.clearRect(0, 0, this.canvasW, this.canvasH); // refresh canvas
        this.updateGlobalParams();
        this.initializeAgents();
        this.currentFrame = 1;
        this.animationIntervalId = null;
    }

    reset(full) {
        // reset the algorithm
        clearInterval(this.animationIntervalId); // stop the animation loop
        stopTimer(); // stop elapsed time timer
        this.matrixHelper.resetPheromoneMatrix(); // reset pheromone matrix
        if (full === 'full') {
            // reset fully - used when image is changed
            this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
            this.currentFrame = 1;
            this.animationIntervalId = null;
        } else this.init();
    }

    stop() {
        // pause functionality
        this.paused = true;
        clearInterval(this.animationIntervalId);
        stopTimer('pause'); // pause elapsed time timer
    }

    setDefaultValues() {
        //sets the default algorithm parameter values
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
        // updates the algorithm parameters according to user input
        Object.keys(this.defaultParams).forEach(key => {
            window[key] = Number(window.allUI[key].value);
        });
    }

    initializeAgents() {
        const density = Math.round(this.canvasArea / antCount); // calculates density at which ants should be positioned
        this.agents = []; // initialise agents array

        console.log("%c pheromoneMatrix", "color: #24c95a", pheromoneMatrix); //show pheromone matrix in console log

        /* counts trough all the agents calculates each's position,
        draws them on the canvas and adds them to the array of agents*/
        for (let i = 0; i < antCount; i++) {
            const x = Math.floor(i * density / this.canvasW);
            const y = (i * density) - (x * this.canvasW);
            this.agents[i] = new AntAgent(this.canvas, {
                x: x,
                y: y
            });
            this.ctx.fillRect(this.agents[i].currentCoordinates.y, this.agents[i].currentCoordinates.x, 2, 1);
        }

        console.log("%c Agents", "color: #24c95a", this.agents); // show list of agents in console log
    }

    startSimulation() {
        console.log("%c Simulation start: ", "color: #bada55"); // show simulation start in the browser console

        events.emit('start-simulation'); // emit an event to mark the start of the simulation

        if (!this.paused) this.ctx.clearRect(0, 0, this.canvasW, this.canvasH); // clears the canvas if the algorithm is restarted

        // defines the way in which the algorithm will work, depending on the visualisation toggle
        if (visualisation) {
            timer(); // check if timer has been stopped
            this.animationIntervalId = setInterval(this.animateMoves.bind(this), 1); // starts the canvas drawing loop
        } else {
            events.emit('simulation-without-visualisation'); // emits an event to mark the start of the algorithm without visualisations, used to show the loading screen
            setTimeout(() => this.noAnimationMoves(), 500); // start the algorithm with a javascript loop for faster performance
        }
    }

    noAnimationMoves() {
        const start = Date.now(); // mark the starting time of the algorithm

        // start the construction process 
        for (this.currentFrame; this.currentFrame < iterations; this.currentFrame++) {
            console.log("%c Iteration: ", "color: #bada55", this.currentFrame); // show the current iteration in the browser console

            // ant movement for all agents
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

            // update pheromone values after all ants have moved
            pheromoneMatrix.forEach((val, x) => {
                val.forEach((arr, y) => {
                    this.updatePheromoneLevel(this.agents, x, y);
                });
            });
        }
        console.log("%c Iteration: ", "color: #bada55", this.currentFrame); // show the current iteration in the browser console
        console.log("%c END OF ALGORITHM", "color: #c92424"); // indicate the end of the algorithm in the console
        loadingBar(iterations, iterations); // update the laoding bar status
        this.resultsGallery.createBinaryImage(); // trigger the creation of a result image
        elapsedTime(start, Date.now()); // calculate the elapsed time
        events.emit('simulation-complete'); // emit an event to mark the end of the simulation of the algorithm
    }

    animateMoves() {
        // show visualisations
        // as javascript loop occupies the whole event thread, animation of canvas elements is done in a functional programming way

        const agent = this.agents[this.agentCount]; // get the current agent to draw
        this.animationCount++; // necessary for the incrementation of drawing frame

        if (this.animationCount >= numAntMov) {
            // case if ant moves have finished
            loadingBar(this.agentCount + ((this.agents.length - 1) * (this.currentFrame - 1)), (this.agents.length - 1) * iterations); // update the loading bar
            this.animationCount = 0; // reset the animation frame
            this.agentCount++; // go to next agent
        }
        if (this.agentCount >= this.agents.length) {
            // case if the agents have finished

            // update pheromone values
            pheromoneMatrix.forEach((val, y) => {
                val.forEach((arr, x) => {
                    this.updatePheromoneLevel(this.agents, x, y);
                    this.ctx.fillStyle = `rgba(0, 255, 0, ${pheromoneMatrix[x][y]})`; // set style for high pheromone values after iteration
                    this.ctx.fillRect(
                        y,
                        x,
                        1,
                        1
                    );
                });// high pheromone values in green 
            });
            if (this.currentFrame >= iterations) {
                // case if this was the last iteration
                console.log("%c END ANIMATION", "color: #c92424"); // Mark end of animation in the console
                stopTimer(); // stop elapsed time timer
                this.resultsGallery.createBinaryImage(); // add the result to the gallery
                clearInterval(this.animationIntervalId); // stop the animation loop
                events.emit('simulation-complete'); // emit an event marking the end of the simulation of the algorithm
            } else {
                // case if the current iteration is finished and there are more left
                this.currentFrame++; // go to next frame
                this.agentCount = 0; // start from 1st agent
                this.animationCount = 0; // refresh animation frames
            }
        } else {
            const {
                newCoordinates,
                newAnt
            } = agent.calculateNextStep(); // get the next ant move info
            agent.moveTo(newCoordinates, newAnt); // move the agent to new location
            if (this.animationCount % 10 === 0) {
                //draw 10 pixel movements at once for faster visualisation
                if (pheromoneMatrix[agent.currentCoordinates.x][agent.currentCoordinates.y] <= initialPheromoneValue) {
                    this.ctx.fillStyle = `rgba(66, 33, 123, 255)`; // set style for normal ant trails
                } else {
                    this.ctx.fillStyle = `rgba(237, 0, 1, 255)`; // set style for high pheromone values
                }
                if (agent.previousCoordinates.length > 10) {
                    // draw 10 ant movements on canvas
                    for (let k = 1; k < 10; k++) {
                        this.ctx.fillRect(
                            agent.previousCoordinates[agent.previousCoordinates.length - k].y,
                            agent.previousCoordinates[agent.previousCoordinates.length - k].x,
                            1,
                            1
                        );
                    }
                }
                // draw current ant position
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
            // update the simulation information values
            this.textIter.value = this.currentFrame;
            this.textCurr.value = this.agentCount;
            this.textNew.value = this.animationCount;
            this.textX.value = agent.currentCoordinates.x;
            this.textY.value = agent.currentCoordinates.y;
        }
    }

    updatePheromoneLevel(agents, x, y) {
        // update pheromone values according to equation with evaporation
        let sumPheromone = 0;
        agents.forEach(agent => {
            if (agent.previousCoordinates[x] && agent.previousCoordinates[y]) {
                sumPheromone += (pheromoneMatrix[x][y] >= tNoiseFilt) ? pheromoneMatrix[x][y] : 0;
            }
        });
        const newPheromoneLevel = (1 - roPEvRate) * pheromoneMatrix[x][y] + sumPheromone;
        pheromoneMatrix[x][y] = newPheromoneLevel;
    }

}
