const {
    GPU
} = require('gpu.js');

//set global variables
global.imageIntensityArray1d = new Array();
global.imageIntensityArray = new Array();
global.pheromoneMatrix = new Array();
global.heuristicMatrix = new Array();
global.canvasWidth = 0;
global.canvasHeight = 0;

import ACO from './components/aco/aco-algorithm';
import EnvironmentImage from './components/environment-image';

const uploader = document.querySelector('#image-upload');
const image = document.querySelector('#image-source');
const imagePreview = document.querySelector('#image-preview');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('webgl');
// const canvasGLCont = document.querySelector('.regl');
const drawImageButton = document.querySelector('#draw-image-button');
const startSimulationButton = document.querySelector('#start-simulation');

let envImage;
let algorithm;

const gpu = new GPU({
    canvas,
    context: context
});
const render = gpu.createKernel(function(x) {
        this.color(this.thread.x / 500, this.thread.y / 500, x[0], 1);
    })
    .setOutput([500, 500])
    .setGraphical(true);
// const canvas = render.getCanvas();
console.log('canvas', canvas);
// document.querySelector('.canvas-container').appendChild(canvas);

//set canvas dimensions
canvasWidth = canvas.width;
canvasHeight = canvas.clientHeight;
// Buttons and HTML events
const drawImageButtonDefaultText = 'Draw Image';
const drawImageButtonActiveText = 'Reset';
uploader.addEventListener('change', function() {
    // const context = canvas.getContext('2d');
    context.clear(context.DEPTH_BUFFER_BIT)
    drawImageButton.setAttribute('disabled', 'disabled');
    startSimulationButton.setAttribute('disabled', 'disabled');
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            image.setAttribute('src', this.result);
            imagePreview.setAttribute('src', this.result);
        })
        reader.readAsDataURL(file)
        drawImageButton.removeAttribute('disabled');
        drawImageButton.innerHTML = drawImageButtonDefaultText;
    }
});

drawImageButton.addEventListener('click', () => {
    if (image) {
        envImage = new EnvironmentImage(image, canvas);
        algorithm = new ACO(envImage, canvas);
        startSimulationButton.removeAttribute('disabled');
        drawImageButton.innerHTML = (drawImageButtonActiveText);
    }
});

startSimulationButton.addEventListener('click', () => {
    algorithm.startSimulation();
});
