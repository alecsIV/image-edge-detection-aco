//set global variables
global.imageIntensityArray1d = new Array();
global.imageIntensityArray = new Array();
global.pheromoneMatrix = new Array();
global.heuristicMatrix = new Array();
global.canvasWidth = 0;
global.canvasHeight = 0;

// get animation toggle status
global.animation = document.getElementById('animation-toggle').checked;
document.getElementById('animation-toggle').addEventListener('click', (e)=>{
    animation = e.toElement.checked;
});

// Parameter fields
global.allUI = document.getElementsByClassName('ui-element'); //get all user input fields
global.autoFields = true; //check if user input values are changed by the user

import ACO from './components/aco/aco-algorithm';
import EnvironmentImage from './components/environment-image';

const d3 = require('d3');
const uploader = document.querySelector('#image-upload');
const image = document.querySelector('#image-source');
const imagePreview = document.querySelector('#image-preview');
const canvasBg = document.querySelector('#canvasBg');
// const canvasFg = document.querySelector('#canvasFg');
const drawImageButton = document.querySelector('#draw-image-button');
const startSimulationButton = document.querySelector('#start-simulation');
const setDefaultsButton = document.querySelector('#defaults-button');

let envImage;
let algorithm;

const svgW = 500
const svgH = 500
const svg = d3.select('.d3-container').append('svg').attr('width', svgW).attr('height', svgH);

//set canvasBg dimensions
canvasWidth = canvasBg.width;
canvasHeight = canvasBg.clientHeight;
// Buttons and HTML events
const drawImageButtonDefaultText = 'Draw Image';
const drawImageButtonActiveText = 'Reset';
const context = canvasBg.getContext('2d');
uploader.addEventListener('change', function() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
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
        // context.globalCompositeOperation = 'source-over';
        envImage = new EnvironmentImage(image, canvasBg);
        // context.globalCompositeOperation = 'destination-over';
        algorithm = new ACO(envImage, svg);
        algorithm.reset();
        startSimulationButton.removeAttribute('disabled');
        drawImageButton.innerHTML = (drawImageButtonActiveText);
    }
});

Object.values(allUI).forEach((element) => {
    // element.addEventListener('change', setDefaultsButton.removeAttribute('disabled'));
    element.onchange = () => {
        setDefaultsButton.removeAttribute('disabled');
        startSimulationButton.removeAttribute('disabled');
        // context.clearRect(0, 0, canvasWidth, canvasHeight);
        algorithm.reset();
    };
});

startSimulationButton.addEventListener('click', () => {
    startSimulationButton.setAttribute('disabled', 'disabled');
    // resetSimulationButton.style.display = 'block';
    algorithm.updateGlobalParams(); // set global parameters based on user input
    algorithm.startSimulation();
});

setDefaultsButton.addEventListener('click', () => {
    algorithm.setDefaultValues();
    algorithm.reset();
    setDefaultsButton.setAttribute('disabled', 'disabled')
});
