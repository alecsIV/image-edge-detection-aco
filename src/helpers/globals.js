export default function initGlobals() {
    const EventEmitter = require('events');
    const events = new EventEmitter();

    global.events = events;

    //set global variables
    global.imageIntensityArray1d = new Array();
    global.imageIntensityArray = new Array();
    global.pheromoneMatrix = new Array();
    global.heuristicMatrix = new Array();
    global.canvasWidth = 0;
    global.canvasHeight = 0;

    // get animation toggle status
    global.animationElem = document.getElementById('animation-toggle');
    global.animationLabel = document.querySelector('.animation-toggle_label');
    animationLabel.innerHTML = 'Animation on';
    global.animation = animationElem.checked;

    animationElem.addEventListener('click', (e) => {
        animation = e.toElement.checked;
        animationLabel.innerHTML = `Animation ${(animation) ? 'on': 'off'}`
        events.emit(`animation-${animation}`);
        events.emit('animation-toggle');
    });

    // Parameter fields
    global.allUI = document.getElementsByClassName('ui-element'); //get all user input fields
    global.autoFields = true; //check if user input values are changed by the user

    // Gallery
    global.pages = [];
    global.currentPage = 0;
    global.previousPage = 0;
}
