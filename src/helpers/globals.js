export default function initGlobals() {
    const EventEmitter = require('events');
    const events = new EventEmitter();

    //set global variables
    global.imageIntensityArray1d = new Array();
    global.imageIntensityArray = new Array();
    global.pheromoneMatrix = new Array();
    global.heuristicMatrix = new Array();
    global.canvasWidth = 0;
    global.canvasHeight = 0;

    // get animation toggle status
    global.animation = document.getElementById('animation-toggle').checked;
    document.getElementById('animation-toggle').addEventListener('click', (e) => {
        animation = e.toElement.checked;
    });

    // Parameter fields
    global.allUI = document.getElementsByClassName('ui-element'); //get all user input fields
    global.autoFields = true; //check if user input values are changed by the user
    global.events = events;
}
