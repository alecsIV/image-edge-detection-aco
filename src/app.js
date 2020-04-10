import initGlobals from './helpers/globals';

initGlobals();

import ACO from './components/aco/aco-algorithm';
import EnvironmentImage from './components/environment-image/environment-image';
import {
    loadingBar
} from './helpers/extras';

// get html elements
const body = document.querySelector('body');
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
const processParams = document.querySelectorAll('.process-params>input');
const elapsedTime = document.querySelector('#elapsed-time');
const performanceDisclaimer = document.querySelector('.performance-disclaimer');
const pushBackScreen = document.querySelector('.push-back-screen');

// set variables
let envImage;
let algorithm;
let uploadedYet = false;
// Buttons and HTML events
const drawImageButtonDefaultText = 'Upload';
const drawImageButtonActiveText = 'Reset';
const context = canvasBg.getContext('2d');


//get canvasBg dimensions
canvasWidth = canvasBg.width;
canvasHeight = canvasBg.clientHeight;

// Disable initial state of dynamic elements
animationElem.setAttribute('disabled', 'disabled');
disableInputs(true);


// Image uploader input behaviour
uploader.addEventListener('change', function() {
    const file = this.files[0];
    // Check if a file is uploaded
    if (this.files && this.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            image.setAttribute('src', this.result);
            imagePreview.setAttribute('src', this.result);
        })
        reader.readAsDataURL(file)
        if (uploadedYet) {
            events.emit('revert-initial-state');
        }
        drawImageButton.removeAttribute('disabled');
        drawImageButton.innerHTML = drawImageButtonDefaultText;
        uploadedYet = true;
    }
});

// upload/reset button behaviour
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
        animationElem.removeAttribute('disabled');
        events.emit('drawn-image');
    }
});

// track user input changes and  
Object.values(allUI).forEach((element) => {
    element.onchange = () => {
        setDefaultsButton.removeAttribute('disabled');
        startSimulationButton.removeAttribute('disabled');
        algorithm.reset();
    };
});

// start simulation button behaviour
startSimulationButton.addEventListener('click', () => {
    startSimulationButton.setAttribute('disabled', 'disabled');
    algorithm.updateGlobalParams(); // set global parameters based on user input
    algorithm.startSimulation();
});

// reset user inputs to default
setDefaultsButton.addEventListener('click', () => {
    algorithm.setDefaultValues();
    algorithm.reset();
    setDefaultsButton.setAttribute('disabled', 'disabled');
});

loadingPulse.addEventListener('click', () => {
    // pause simulation
    events.emit('stop-simulation');
});

// Events to trigger changes according to the program state //
// Put system into intial state
events.on('revert-initial-state', () => {
    events.emit('stop-simulation');
    disableButtons();
    resetInfoStats();
    resetInputs();
    algorithm.reset();
});

// State of the program at simulation start
events.on('start-simulation', () => {
    drawImageButton.removeAttribute('disabled')
    setDefaultsButton.setAttribute('disabled', 'disabled');
    startSimulationButton.style.display = 'none';
    loadingPulse.style.display = 'block';

    sysInfoPanel.setAttribute('open', 'open');
    document.body.style.cursor = 'wait';
    legend.style.display = 'block';
    disableInputs('true');
});

// Show loading screen when animation is disabled
events.on('simulation-without-animation', () => {
    pushBackScreen.style.display = 'block';
    body.style.overflow = 'hidden';
});

// State of the program at simulation pause
events.on('stop-simulation', () => {
    startSimulationButton.style.display = 'block';
    startSimulationButton.removeAttribute('disabled');
    loadingPulse.style.display = 'none';
    document.body.style.cursor = 'auto';

    algorithm.stop();
});

// State of the program at simulation complete
events.on('simulation-complete', () => {
    console.log('Simulation Complete');
    // initial state of buttons
    loadingPulse.style.display = 'none';
    startSimulationButton.style.display = 'block';
    startSimulationButton.setAttribute('disabled', 'disabled');
    drawImageButton.setAttribute('active', 'active');

    // return to main screen from loading
    document.body.style.cursor = 'auto';
    pushBackScreen.style.display = 'none';
    body.style.overflow = 'auto';

    // enable user inputs
    disableInputs(false);
});


events.on('drawn-image', () => {
    drawImageButton.setAttribute('disabled', 'disabled')
    simSettingsPanel.setAttribute('open', 'open');

    disableInputs(false);
});


events.on('reset', () => {
    reset('full');
});

events.on('animation-false', () => {
    performanceDisclaimer.style.display = 'block';
});

events.on('animation-true', () => {
    performanceDisclaimer.style.display = 'none';
});

events.on('animation-toggle', () => {
    reset();
});

// Functions //
function disableInputs(disabled) {
    for (let item of allUI) {
        if (disabled) item.setAttribute('disabled', 'disabled');
        else item.removeAttribute('disabled');
    }
}

function reset(full = null) {
    events.emit('stop-simulation');
    resetInfoStats();
    if (full) {
        algorithm.setDefaultValues();
        algorithm.reset();
        legend.style.display = 'none';
        setDefaultsButton.setAttribute('disabled', 'disabled');
    }
    animationElem.removeAttribute('disabled');
    events.emit('drawn-image');
}

function resetInputs() {
    for (let item of allUI) {
        item.value = 0;
        item.setAttribute('disabled', 'disabled');
    }
    setDefaultsButton.setAttribute('disabled', 'disabled');
}

function resetInfoStats() {
    for (let item of processParams) {
        item.value = 0;
    }
    loadingBar(0, 100);
    elapsedTime.value = '0m 0s';
    legend.style.display = 'none';
}

function disableButtons() {
    drawImageButton.setAttribute('disabled', 'disabled')
    startSimulationButton.setAttribute('disabled', 'disabled');
    animationElem.setAttribute('disabled', 'disabled');
}

function unlockFields() {

}
