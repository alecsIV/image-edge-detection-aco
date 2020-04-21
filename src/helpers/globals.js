// The following function returns all the global variables needed throughtout the script
export default function initGlobals() {
    // Set up Events
    const EventEmitter = require('events');
    const events = new EventEmitter();

    global.events = events; // used to call js events to better manage the stages of the program

    //set global variables related to the matrices
    global.imageIntensityArray1d = new Array();
    global.imageIntensityArray = new Array();
    global.pheromoneMatrix = new Array();
    global.heuristicMatrix = new Array();
    global.canvasWidth = 0;
    global.canvasHeight = 0;

    // get visualisation toggle status
    global.toggleVisElem = document.getElementById('visualisation-toggle');
    global.toggleVisLabel = document.querySelector('.visualisation-toggle_label');
    toggleVisLabel.innerHTML = 'Visualisation on';
    global.visualisation = toggleVisElem.checked;

    toggleVisElem.addEventListener('click', (e) => {
        visualisation = e.target.checked;
        toggleVisLabel.innerHTML = `Visualisation ${(visualisation) ? 'on': 'off'}` // change toggle label
        events.emit('visualisation-toggled', visualisation);
    });

    // Parameter fields values
    global.allUI = document.getElementsByClassName('ui-element'); //get all user input fields
    global.autoFields = true; //check if user input values are changed by the user
    global.currentParams = {};

    // Results Gallery params
    global.pages = [];
    global.currentPage = 0;
    global.previousPage = -1;
    global.savedParams = [];
}
