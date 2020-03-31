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
    const time = end - start;
    elem.value = `Execution time: ${time}`);
}

module.exports = {
    loadingBar,
    elapsedTime
}
