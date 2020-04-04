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

    elem.value = `Execution time: ${seconds}s`;
}

module.exports = {
    loadingBar,
    elapsedTime
}
