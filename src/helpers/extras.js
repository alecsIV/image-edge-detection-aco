/* -------------------------------------------------------------------------- */
/*                              Helper functions                              */
/* -------------------------------------------------------------------------- */

/* ------------------------------- Loading bar ------------------------------ */

function loadingBar(completed, total) {
    const elem = document.getElementById("bar");
    const elemText = document.getElementsByClassName("bar-percentage");
    let width = (completed / total) * 100;
    if (width >= 100) {
        elem.style.width = Math.floor(width) + "%";
        elemText[0].innerHTML = Math.floor(width) + "%";
        elem.style.borderRadius = '34px' // make bar into circle to fill the space
        return;
    } else {
        elem.style.borderRadius = '34px 0 0 34px'; // have bar edges rounded and sharp
        elem.style.width = Math.floor(width) + "%";
        elemText[0].innerHTML = Math.floor(width) + "%";
        width++;
    }
}

/* ------------------------------ Elapsed time static ------------------------------ */

// shows the elapsed time at the end of the algorithm, used when visualisations are off

function elapsedTime(start, end) {
    //get elapsed time from start to end
    const elem = document.getElementById("elapsed-time");
    let timeDiff = end - start;

    // get seconds 
    timeDiff /= 1000;
    let seconds = Math.round(timeDiff);

    // get minutes
    let minutes = 0;
    minutes = Math.floor(seconds / 60);

    // reset seconds counter
    if (seconds === 60) {
        seconds = 0;
    }

    elem.value = `${minutes}m ${seconds}s`; // show the minutes and seconds
}

/* --------------------------- Elapsed time timer --------------------------- */

// shows the current time of execution of the algorithm, used when visualisations are on

// functions variables
let intervalId = null;
let totalTime = 0; // keeps the time so far
let diff = null; // diffrence between start and end times

function timer() {
    // count time
    const elem = document.getElementById("elapsed-time");
    let start = Date.now(); // start time
    let minutes = Math.floor(totalTime / 60000); 
    let secondsSoFar = totalTime % 60000;

    // count loop with 1s interval (counts every second)
    intervalId = setInterval(function() {
        diff = secondsSoFar + Date.now() - start; // milliseconds elapsed since start
        let seconds = Math.floor(diff / 1000); // in seconds
        minutes += Math.floor(seconds / 60); // in minutes

        // reset seconds counter
        if (seconds >= 60) {
            start = Date.now();
            seconds = 0;
            secondsSoFar = 0;
        }
        // keep the time in case of a pause 
        totalTime = diff + (minutes * 60000);

        // show the minutes and seconds
        elem.value = `${minutes}m ${seconds}s`;
    }, 1000);
}

// stop functionality
function stopTimer(pause) {
    // check if paused
    if (pause !== 'pause') totalTime = 0; // if not pause, resets the saved time
    clearInterval(intervalId); // resets the count loop 
}
/* -------------------------------------------------------------------------- */

module.exports = {
    loadingBar,
    elapsedTime,
    timer,
    stopTimer
}
