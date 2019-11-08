global.imageIntensityArray1d = new Array();
global.imageIntensityArray = new Array();
global.pheromoneMatrix = new Array();
global.heuristicMatrix = new Array();

import ACO from './components/aco/aco-algorithm';
import EnvironmentImage from './components/environment-image';

const uploader = document.querySelector('#image-upload');
const image = document.querySelector('#image-source');
const imagePreview = document.querySelector('#image-preview');
const canvas = document.querySelector('#canvas');
const drawImageButton = document.querySelector('#draw-image-button');
const startSimulationButton = document.querySelector('#start-simulation');

let envImage;
let algorithm;

// Buttons and HTML events
uploader.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            image.setAttribute('src', this.result);
            imagePreview.setAttribute('src', this.result);
        })
        reader.readAsDataURL(file)
        drawImageButton.removeAttribute('disabled');
    }
});

drawImageButton.addEventListener('click', () => {
    if (image) {
        envImage = new EnvironmentImage(image, canvas);
        algorithm = new ACO(envImage, canvas);
        startSimulationButton.removeAttribute('disabled');
    }
});

startSimulationButton.addEventListener('click', () => {
    algorithm.startSimulation();
});
