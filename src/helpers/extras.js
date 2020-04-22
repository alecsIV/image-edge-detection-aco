function loadingBar(completed, total) {
    const elem = document.getElementById("bar");
    const elemText = document.getElementsByClassName("bar-percentage");
    let width = (completed / total) * 100;
    if (width >= 100) {
        elem.style.width = Math.floor(width) + "%";
        elemText[0].innerHTML = Math.floor(width) + "%";
        elem.style.borderRadius = '34px'
        return;
    } else {
        elem.style.borderRadius = '34px 0 0 34px';
        elem.style.width = Math.floor(width) + "%";
        elemText[0].innerHTML = Math.floor(width) + "%";
        width++;
    }
}

function elapsedTime(start, end) {
    const elem = document.getElementById("elapsed-time");
    let timeDiff = end - start;
    timeDiff /= 1000;


    // get seconds 
    let seconds = Math.round(timeDiff);

    // get minutes
    let minutes = 0;
    minutes = Math.floor(seconds / 60);
    if (seconds === 60) {
        seconds = 0;
    }

    elem.value = `${minutes}m ${seconds}s`;
}

let intervalId = null;
let totalTime = 0;
let diff = null;

function timer() {
    const elem = document.getElementById("elapsed-time");
    let start = Date.now();
    let minutes = Math.floor(totalTime / 60000);
    let secondsSoFar = totalTime % 60000;
    console.log('timeSofar', secondsSoFar);
    intervalId = setInterval(function() {
        diff = secondsSoFar + Date.now() - start; // milliseconds elapsed since start
        let seconds = Math.floor(diff / 1000); // in seconds
        minutes += Math.floor(seconds / 60); // in minutes
        if (seconds >= 60) {
            start = Date.now();
            seconds = 0;
            secondsSoFar = 0;
        }
        totalTime = diff + (minutes * 60000);
        elem.value = `${minutes}m ${seconds}s`;
    }, 1000);
}

function stopTimer(pause) {
    if (pause !== 'pause') totalTime = 0;
    clearInterval(intervalId);
    // diff = (saveTime) ? diff : null; // check if time needs to be saved
    // console.log('diff', diff);
    // return diff; // return last time before stop
}

module.exports = {
    loadingBar,
    elapsedTime,
    timer,
    stopTimer
}
