function loadingBar(completed, total) {
    const elem = document.getElementById("myBar");
    let width = (completed / total) * 100;
    if (width >= 100) {
        return;
    } else {
        width++;
        elem.style.width = Math.floor(width) + "%";
        elem.innerHTML = Math.floor(width) + "%";
    }
}

function elapsedTime(start, end) {
    const elem = document.getElementById("elapsed-time");
    let timeDiff = end - start;
    timeDiff /= 1000;

    // get seconds 
    const seconds = Math.round(timeDiff);

    elem.value = `${seconds}s`;
}

let intervalId = null;

function timer() {
    const elem = document.getElementById("elapsed-time");
    const start = Date.now();
    intervalId = setInterval(function() {
        let delta = Date.now() - start; // milliseconds elapsed since start
        delta = Math.floor(delta / 1000); // in seconds
        elem.value = `${delta}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(intervalId);
}

module.exports = {
    loadingBar,
    elapsedTime,
    timer,
    stopTimer
}
