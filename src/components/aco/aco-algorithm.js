import MatrixHelper from "../helpers/matrix-helper";
import AntAgent from "./agent";

export default class ACO {
    constructor(image, svg) {
        this.image = image;
        this.svg = svg;
        this.canvas = document.querySelector('#canvasFg');
        this.canvasW = this.canvas.getBoundingClientRect().width;
        this.canvasH = this.canvas.getBoundingClientRect().height;
        this.ctx = this.canvas.getContext("2d");
        this.matrixHelper = new MatrixHelper();
        this.currentFrame = 1;
        this.animationCount = 0;

        this.resultDiv = document.querySelector(".binary-canvas-div");

        // generate initial pheromone and heuristic matrices
        this.matrixHelper.generateInitialMatrices();
        this.iMax = this.matrixHelper.iMax;

        this.setDefaultValues() // set default values for the parameters

        this.agentCount = 0;

        //for debug
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
            'antCount': Math.sqrt(this.image.width * this.image.height),
            'numAntMov': Math.round(Math.round(3 * Math.sqrt(this.image.width * this.image.height))),
            'antMemLen': Math.round(Math.sqrt(2 * (this.image.width + this.image.height)) / 500 * this.iMax),
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
        // this.ctx.globa
        console.log('agentsCount', antCount);
        console.log('Num Ant Movements:', numAntMov);
        console.log('Ant memory length:', antMemLen);
        this.agents = [];
        console.log("%c pheromoneMatrix", "color: #24c95a", pheromoneMatrix);
        for (let i = 0; i < antCount; i++) {
            this.agents[i] = new AntAgent(this.canvas);
            this.initialDraw(this.agents[i].currentCoordinates);
        }
        this.circles = this.svg.selectAll('cirlce');
        // console.log(this.circles.forEach);
        console.log("%c Agents", "color: #24c95a", this.agents);
    }

    initialDraw(coordinates) {
        this.svg.append('circle')
            .attr('cx', coordinates.x)
            .attr('cy', coordinates.y)
            .attr('r', 1);
        // this.ctx.fillRect(coordinates.x, coordinates.y, 1, 1);
    }

    // drawAgent(agent) {
    //     this.ctx.fillRect(agent.currentCoordinates.x, agent.currentCoordinates.y);
    // }

    // animate(x, y) {
    //     this.ctx.fillRect(x, y, 1, 1);
    // }

    startSimulation() {
        // for (let j = 1; j <= iterations; j++) {
        console.log("%c Iteration: ", "color: #bada55", this.currentFrame);
        console.log('numant', numAntMov);
        // numAntMov = Number(numAntMov);
        // this.agents.forEach(agent => {
        // this.requestId = undefined;
        // this.animationCount = 0;
        // this.requestId = window.requestAnimationFrame(this.animateMoves.bind(this, agent));
        // });
        this.createBinaryImage();

        this.interval = setInterval(this.animateMoves.bind(this), 1);

        // if (this.currentFrame !== iterations) {
        //     console.log('currentFrame', this.currentFrame);
        //     console.log('iterations', typeof iterations);
        //     console.log('bool',this.currentFrame !== iterations );
        //     this.currentFrame++;
        //     // this.tempViewPM();
        //     window.requestAnimationFrame(this.startSimulation.bind(this));
        // } else {
        //     console.log("%c END ANIMATION", "color: #c92424");
        //     this.createBinaryImage();
        // }
        // }

    }

    animateMoves() {
        const agent = this.agents[this.agentCount];
        this.animationCount++;
        const i = this.animationCount;

        if (this.animationCount >= numAntMov) {
            this.animationCount = 0;
            this.agentCount++;
        }
        if (this.agentCount >= this.agents.length) {
            // update pheromone values
            pheromoneMatrix.forEach((val, x) => {
                val.forEach((arr, y) => {
                    this.updatePheromoneLevel(this.agents, x, y);
                    this.ctx.fillStyle = `rgba(66, 33, 123, ${pheromoneMatrix[x][y]})`;
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
                this.createBinaryImage();
                clearInterval(this.interval);
            } else {
                this.currentFrame++;
                this.agentCount = 0;
                this.animationCount = 0;
                console.log("%c Iteration: ", "color: #bada55", this.currentFrame);
                this.createBinaryImage();
                // this.tempViewPM();
            }
        } else {
            // for (let i = 0; i < numAntMov; i++) {
            // this.ctx.clearRect(agent.currentCoordinates.x, agent.currentCoordinates.y, agent.agentSize, agent.agentSize);
            // this.textCurr.value = `current coordins: ${agent.currentCoordinates}`
            // const circle = this.svg.select(`circle[cx="${agent.currentCoordinates.x}"][cy="${agent.currentCoordinates.y}"]`);
            const newCoordinates = [...agent.calculateNextStep()];
            agent.moveTo(newCoordinates[0], newCoordinates[1]);
            if (agent.currentCoordinates == undefined) console.log("faulty", agent);
            // circle.transition().attr("transform", `translate(${agent.currentCoordinates.x}, ${agent.currentCoordinates.y})`).duration(1000);
            // this.textNew.value = `new coordins: ${agent.currentCoordinates}`
            if (animation) {
                this.ctx.fillRect(
                    agent.currentCoordinates.y,
                    agent.currentCoordinates.x,
                    1,
                    1
                );
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const matrixSize = pheromoneMatrix.length - 1;
                        const notOutOfBounds =
                            agent.currentCoordinates.y + i > -1 &&
                            agent.currentCoordinates.y + i < matrixSize &&
                            agent.currentCoordinates.x + j > -1 &&
                            agent.currentCoordinates.x + j < matrixSize;
                        if (notOutOfBounds) {
                            this.ctx.fillStyle = `rgba(66, 33, 123, ${pheromoneMatrix[agent.currentCoordinates.x + j][agent.currentCoordinates.y + i]})`;
                            this.ctx.fillRect(
                                agent.currentCoordinates.y + i,
                                agent.currentCoordinates.x + j,
                                1,
                                1
                            );
                        }
                    }
                }
            }
            if (newCoordinates[1]) {
                this.agentCount++;
                this.animationCount = numAntMov; // checks if a new ant is generated and exits loop
            }
        }
        if (agent !== undefined) {
            this.textCurr.value = this.agentCount;
            this.textNew.value = this.animationCount;
            this.textX.value = agent.currentCoordinates.x;
            this.textY.value = agent.currentCoordinates.y;
        }
    }

    // animateMoves(agent) {
    //         // this.ctx.clearRect(agent.currentCoordinates.x, agent.currentCoordinates.y, agent.agentSize, agent.agentSize);
    //         const newCoordinates = [...agent.calculateNextStep()];
    //         agent.moveTo(newCoordinates[0], newCoordinates[1]);
    //         if (agent.currentCoordinates == undefined) console.log("faulty", agent);
    //         this.ctx.fillRect(
    //             agent.currentCoordinates.y,
    //             agent.currentCoordinates.x,
    //             agent.agentSize,
    //             agent.agentSize
    //         );
    //         if (newCoordinates[1]) this.animationCount = numAntMov; // checks if a new ant is generated and exits loop
    //         // if (agent.currentCoordinates.x === agent.previousCoordinates[agent.previousCoordinates.length - 1].x && agent.currentCoordinates.y === agent.previousCoordinates[agent.previousCoordinates.length - 1].y) i = numAntMov;
    //     // if(this.animationCount <= numAntMov) {
    //     //     this.animationCount++;
    //     //     this.requestId = window.requestAnimationFrame(this.animateMoves.bind(this, agent));
    //     // }
    //     // else {
    //     //     window.cancelAnimationFrame(this.requestId);
    //     //     this.requestId = undefined;
    //     //     return;
    //     // }
    // }

    updatePheromoneLevel(agents, x, y) {
        // const curX = agent.currentCoordinates.x;
        // const curY = agent.currentCoordinates.y;
        let sumHeuristics = 0;
        agents.forEach(agent => {
            if (agent.previousCoordinates[x] && agent.previousCoordinates[y]) {
                sumHeuristics += heuristicMatrix[x][y] >= tNoiseFilt ? heuristicMatrix[x][y] : 0;
            }
        });
        // agent.previousCoordinates.forEach(prevPosition => {
        //   sumHeuristics +=
        //     heuristicMatrix[prevPosition.x][prevPosition.y] >= tNoiseFilt
        //       ? heuristicMatrix[prevPosition.x][prevPosition.y]
        //       : 0;
        // });
        // agent.previousCoordinates.forEach(prevPosition => {
        const newPheromoneLevel = (1 - roPEvRate) * pheromoneMatrix[x][y] + sumHeuristics;
        pheromoneMatrix[x][y] = newPheromoneLevel;
        // });
    }

    tempViewPM() {
        let buffer = new Uint8ClampedArray(this.canvasW * this.canvasH * 4);

        pheromoneMatrix.forEach((arr, x) => {
            arr.forEach((value, y) => {
                const pos = (x * this.canvasW + y) * 4;
                const valueRGB = value <= initialPheromoneValue ? 255 : 66;
                buffer[pos] = valueRGB; // some R value [0, 255]
                buffer[pos + 1] = valueRGB; // some G value
                buffer[pos + 2] = valueRGB; // some B value
                buffer[pos + 3] = 50; // set alpha channel
            });
        });

        const idata = this.ctx.createImageData(this.canvasW, this.canvasH);

        // set our buffer as source
        idata.data.set(buffer);

        // update canvas with new data
        this.ctx.putImageData(idata, 0, 0);
    }

    createBinaryImage() {
        const width = this.canvasW,
            height = this.canvasH;
        let buffer = new Uint8ClampedArray(width * height * 4);
        let pheromoneAvg = 0;
        pheromoneMatrix.forEach((arr, x) => {
            // arr.reduce((a,b)=> a+b);
            arr.forEach((value, y) => {
                pheromoneAvg += value;
            });
        });
        pheromoneAvg = pheromoneAvg / pheromoneMatrix.length;
        console.log("average", pheromoneAvg);
        console.log("average2", pheromoneAvg / 2);

        const binaryCanvas = document.createElement("canvas");
        binaryCanvas.setAttribute("class", "binary-canvas");
        binaryCanvas.setAttribute("width", this.canvasW);
        binaryCanvas.setAttribute("height", this.canvasH);
        const binCtx = binaryCanvas.getContext("2d");

        pheromoneMatrix.forEach((arr, x) => {
            arr.forEach((value, y) => {
                const pos = (x * width + y) * 4;
                const valueRGB = value <= initialPheromoneValue ? 255 : 0;
                buffer[pos] = valueRGB; // some R value [0, 255]
                buffer[pos + 1] = valueRGB; // some G value
                buffer[pos + 2] = valueRGB; // some B value
                buffer[pos + 3] = 255; // set alpha channel
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
