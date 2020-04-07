function loadingBar(completed, total) {
    const elem = document.getElementById("myBar");
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
let diff = null;

function timer(lastDiff) {
    console.log('lastDiff', lastDiff);
    const elem = document.getElementById("elapsed-time");
    let start = Date.now();
    let minutes = 0;
    intervalId = setInterval(function() {
        diff = (lastDiff) ? lastDiff + Date.now() - start : Date.now() - start; // milliseconds elapsed since start
        let seconds = Math.floor(diff / 1000); // in seconds
        minutes += Math.floor(seconds / 60);
        if (seconds === 60) {
            start = Date.now();
            seconds = 0;
        }
        elem.value = `${minutes}m ${seconds}s`;
    }, 1000);
}

function stopTimer(saveTime) {
    console.log('saveTime', saveTime);
    clearInterval(intervalId);
    diff = (saveTime) ? diff : null;
    console.log('diff', diff);
    return diff; // return last time before stop
}

module.exports = {
    loadingBar,
    elapsedTime,
    timer,
    stopTimer
}
