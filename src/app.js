import initGlobals from './helpers/globals';

initGlobals();

import ACO from './components/aco/aco-algorithm';
import EnvironmentImage from './components/environment-image';

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
        algorithm = new ACO(envImage);
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
    algorithm.reset();
    setDefaultsButton.setAttribute('disabled', 'disabled')
});
