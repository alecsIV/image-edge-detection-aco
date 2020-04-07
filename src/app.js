import initGlobals from './helpers/globals';

initGlobals();

import ACO from './components/aco/aco-algorithm';
import EnvironmentImage from './components/environment-image';

const uploader = document.querySelector('#image-upload');
const image = document.querySelector('#image-source');
const imagePreview = document.querySelector('#image-preview');
const canvasBg = document.querySelector('#canvasBg');
const drawImageButton = document.querySelector('#draw-image-button');
const startSimulationButton = document.querySelector('#start-simulation');
const setDefaultsButton = document.querySelector('#defaults-button');
const loadingPulse = document.querySelector('.pulse');
const sysInfoPanel = document.querySelector('.sys-info-panel');
const simSettingsPanel = document.querySelector('.sim-settings-panel');
const legend = document.querySelector('.legend');
// const settingsContainers = document.querySelectorAll('.settings-pannels_container > details > div');

let envImage;
let algorithm;

//set canvasBg dimensions
canvasWidth = canvasBg.width;
canvasHeight = canvasBg.clientHeight;

// Buttons and HTML events
const drawImageButtonDefaultText = 'Draw Image';
const drawImageButtonActiveText = 'Reset';
const context = canvasBg.getContext('2d');

// settingsContainers.forEach((container)=>{
//     container.classList.add('disabled');
// });

disableInputs(true);

uploader.addEventListener('change', function() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawImageButton.setAttribute('disabled', 'disabled');
    startSimulationButton.setAttribute('disabled', 'disabled');
    const file = this.files[0];
    if (this.files && this.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            image.setAttribute('src', this.result);
            imagePreview.setAttribute('src', this.result);
        })
        reader.readAsDataURL(file)
        drawImageButton.removeAttribute('disabled');
        drawImageButton.innerHTML = drawImageButtonDefaultText;
    } else {
        image.setAttribute('src', '');
        imagePreview.setAttribute('src', './assets/NoImg.png');
    }
});

drawImageButton.addEventListener('click', () => {
    if (drawImageButton.innerHTML === drawImageButtonActiveText) {
        events.emit('reset');
    } else if (image) {
        envImage = new EnvironmentImage(image, canvasBg);
        algorithm = new ACO(envImage);
        algorithm.reset();
        startSimulationButton.removeAttribute('disabled');
        drawImageButton.innerHTML = (drawImageButtonActiveText);
        events.emit('drawn-image');
    }
});

Object.values(allUI).forEach((element) => {
    element.onchange = () => {
        setDefaultsButton.removeAttribute('disabled');
        startSimulationButton.removeAttribute('disabled');
        algorithm.reset();
    };
});

startSimulationButton.addEventListener('click', () => {
    startSimulationButton.setAttribute('disabled', 'disabled');
    algorithm.updateGlobalParams(); // set global parameters based on user input
    algorithm.startSimulation();
});

setDefaultsButton.addEventListener('click', () => {
    algorithm.reset('full');
    setDefaultsButton.setAttribute('disabled', 'disabled')
});

loadingPulse.addEventListener('click', () => {
    events.emit('stop-simulation');
    algorithm.stop();
});

events.on('start-simulation', () => {
    startSimulationButton.style.display = 'none';
    loadingPulse.style.display = 'block';
    document.body.style.cursor = 'wait';
    sysInfoPanel.setAttribute('open', 'open');
    legend.style.display = 'block';
});
events.on('stop-simulation', () => {
    startSimulationButton.style.display = 'block';
    startSimulationButton.removeAttribute('disabled');
    loadingPulse.style.display = 'none';
    document.body.style.cursor = 'auto';
});

events.on('drawn-image', () => {
    simSettingsPanel.setAttribute('open', 'open');
    disableInputs(false);
});

events.on('reset', () => {
    drawImageButton.setAttribute('disabled', 'disabled');
    startSimulationButton.setAttribute('disabled', 'disabled');
    drawImageButton.innerHTML = drawImageButtonDefaultText;
    algorithm.reset('full');
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    events.emit('stop-simulation');
});

// Functions //
function disableInputs(disabled) {
    for (let item of allUI) {
        if (disabled) item.setAttribute('disabled', 'disabled');
        else item.removeAttribute('disabled');
    }
}