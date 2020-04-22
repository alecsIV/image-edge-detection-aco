/* -------------------------------------------------------------------------- */
/*                            Global variables file                           */
/* -------------------------------------------------------------------------- */

// The following function returns all the global variables needed throughtout the script
export default function initGlobals() {

/* ------------------------------ Events ----------------------------- */
    // Set up events
    const EventEmitter = require('events'); // get the events library
    const events = new EventEmitter(); // initialise the EventEmitter class

    global.events = events; // used to call js events to better manage the stages of the program

/* ---------------------------- Matrices globals ---------------------------- */

    //initialise global variables related to the matrices
    global.imageIntensityArray1d = new Array();
    global.imageIntensityArray = new Array();
    global.pheromoneMatrix = new Array();
    global.heuristicMatrix = new Array();

/* ----------------------------- Canvas globals ----------------------------- */
    // initialise canvases global variables
    global.canvasWidth = 0;
    global.canvasHeight = 0;

/* -------------------------- Visualisation states -------------------------- */

    // get visualisation toggle status
    global.toggleVisElem = document.getElementById('visualisation-toggle'); // select the toggle element
    global.toggleVisLabel = document.querySelector('.visualisation-toggle_label'); // select the toggle label
    toggleVisLabel.innerHTML = 'Visualisation on'; // set the initial label
    global.visualisation = toggleVisElem.checked; // get initial toggle status (set in HTML)

    toggleVisElem.addEventListener('click', (e) => {
        visualisation = e.target.checked; // get the toggle status at change (turned on/off)
        toggleVisLabel.innerHTML = `Visualisation ${(visualisation) ? 'on': 'off'}` // change toggle label
        events.emit('visualisation-toggled', visualisation); // emit an event when the toggle is interacted with 
    });

/* ------------------------- Parameter fields values ------------------------ */

    global.allUI = document.getElementsByClassName('ui-element'); //get all user input fields
    global.autoFields = true; //check if user input values are changed by the user
    global.currentParams = {}; // keeps all currently set user settings

/* ------------------------- Results Gallery global variables ------------------------- */

    global.pages = []; // keeps record of all results
    global.currentPage = 0; // keeps track of the currently viewed result
    global.previousPage = -1; // last page viewed before the current one
    global.savedParams = []; // keeps the used parameters for each result
}
