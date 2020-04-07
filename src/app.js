import initGlobals from './helpers/globals';

initGlobals();

import ACO from './components/aco/aco-algorithm';
import EnvironmentImage from './components/environment-image';
import {
    loadingBar
} from './helpers/extras';

const uploader = document.querySelector('#image-upload');
const uploaderLabel = document.querySelector('#image-upload+label');
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
const processParams = document.querySelectorAll('.process-params>input');
const elapsedTime = document.querySelector('#elapsed-time');
// const settingsContainers = document.querySelectorAll('.settings-pannels_container > details > div');

let envImage;
let algorithm;
let uploadedYet = false;

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
        if (uploadedYet) {
            reset();
            resetInputs();
        }
        drawImageButton.removeAttribute('disabled');
        drawImageButton.innerHTML = drawImageButtonDefaultText;
        uploadedYet = true;
    } else {
        image.setAttribute('src', '');
        imagePreview.setAttribute('src', './assets/NoImg.png');
    }
});

drawImageButton.addEventListener('click', () => {
    drawImageButton.blur();
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
    algorithm.setDefaultValues();
    algorithm.reset();
    setDefaultsButton.setAttribute('disabled', 'disabled');
});

loadingPulse.addEventListener('click', () => {
    events.emit('stop-simulation');
});

events.on('start-simulation', () => {
    startSimulationButton.style.display = 'none';
    loadingPulse.style.display = 'block';
    document.body.style.cursor = 'wait';
    sysInfoPanel.setAttribute('open', 'open');
    legend.style.display = 'block';
    drawImageButton.removeAttribute('disabled')
    disableInputs('true');
    setDefaultsButton.setAttribute('disabled', 'disabled');
    // disableUpload(true);
});

events.on('stop-simulation', () => {
    startSimulationButton.style.display = 'block';
    startSimulationButton.removeAttribute('disabled');
    loadingPulse.style.display = 'none';
    document.body.style.cursor = 'auto';
    algorithm.stop();
});

events.on('drawn-image', () => {
    drawImageButton.setAttribute('disabled', 'disabled')
    simSettingsPanel.setAttribute('open', 'open');
    disableInputs(false);
});

events.on('reset', () => {
    reset();
    // disableUpload(false);
});

// Functions //
function disableInputs(disabled) {
    for (let item of allUI) {
        if (disabled) item.setAttribute('disabled', 'disabled');
        else item.removeAttribute('disabled');
    }
}

function reset() {
    events.emit('stop-simulation');

    resetParams();
    algorithm.setDefaultValues();
    algorithm.reset();
    legend.style.display = 'none';
    setDefaultsButton.setAttribute('disabled', 'disabled')
    events.emit('drawn-image');
}

function resetInputs() {
    for (let item of allUI) {
        item.value = 0;
        item.setAttribute('disabled', 'disabled')
    }
}

function resetParams() {
    for (let item of processParams) {
        item.value = 0;
    }
    loadingBar(0, 100);
    elapsedTime.value = '0m 0s';
}

function disableUpload(disabled) {
    if (disabled) {
        uploaderLabel.classList.add('disabled');
        uploader.setAttribute('disabled', 'disabled');
    } else {
        uploaderLabel.classList.remove('disabled');
        uploader.removeAttribute('disabled');
    }
}
