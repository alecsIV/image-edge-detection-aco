export default class ResultsGallery {
    constructor() {
        const canvas = document.querySelector('#canvasFg');
        this.canvasW = canvas.getBoundingClientRect().width;
        this.canvasH = canvas.getBoundingClientRect().height;
        this.resultDiv = document.querySelector(".binary-canvas-holder"); // select target div

        // Set gallery controls
        this.initialiseGalleryControls();
    }

    initialiseGalleryControls() {
        this.resultDivOverlays = document.querySelector(".overlays");
        this.leftArrow = document.querySelector(".arrow.left");
        this.rightArrow = document.querySelector(".arrow.right");
        this.itemCount = document.querySelector(".item-count");
        this.paramDetails = document.querySelector(".param-details");

        this.leftArrow.addEventListener('click', () => events.emit('prev-image'));
        this.rightArrow.addEventListener('click', () => events.emit('next-image'));
    }

    createBinaryImage() {
        const width = this.canvasW,
            height = this.canvasH;
        let buffer = new Uint8ClampedArray(width * height * 4);

        const binaryCanvas = document.createElement("canvas");
        binaryCanvas.setAttribute("class", "binary-canvas");
        binaryCanvas.setAttribute("width", width);
        binaryCanvas.setAttribute("height", height);
        const binCtx = binaryCanvas.getContext("2d");

        pheromoneMatrix.forEach((arr, x) => {
            arr.forEach((value, y) => {
                if (value > initialPheromoneValue) {
                    const pos = (x * height + y) * 4;
                    const valueRGB = 0;
                    buffer[pos] = valueRGB; // some R value [0, 255]
                    buffer[pos + 1] = valueRGB; // some G value
                    buffer[pos + 2] = valueRGB; // some B value
                    buffer[pos + 3] = 255; // set alpha channel
                }
            });
        });

        // create imageData object
        const idata = binCtx.createImageData(width, height);

        // set our buffer as source
        idata.data.set(buffer);

        // update canvas with new data
        binCtx.putImageData(idata, 0, 0);

        // hide previous canvas
        if (this.resultDiv.lastChild) {
            // this.resultDiv.lastChild.style.zIndex = -1;
            this.resultDiv.lastChild.style.opacity = 0;
        }

        this.addToGallery(binaryCanvas);
    }

    addToGallery(binaryCanvas) {
        if (this.resultDiv.childElementCount > 1) {
            for (let item of this.resultDiv.children) {
                item.style.opacity = 0;
            }
        }
        this.resultDiv.appendChild(binaryCanvas);
        console.log('pagesbf push', pages);
        pages.push(this.resultDiv.lastChild);
        console.log('pagesaft push', pages);
        this.showControls();
    }

    showControls() {
        const childCount = this.resultDiv.childElementCount;

        if (childCount > 1) {
            this.resultDivOverlays.style.display = 'block';
            this.itemCount.innerHTML = `${currentPage + 1} / ${childCount}`
        }

        switch (currentPage) {
            case 0:
                this.rightArrow.style.display = 'block';
                this.leftArrow.style.display = 'none';
                break;
            case pages.length - 1:
                this.leftArrow.style.display = 'block';
                this.rightArrow.style.display = 'none';
                break;
            default:
                this.leftArrow.style.display = 'block';
                this.rightArrow.style.display = 'block';
                break;
        }
    }

    updatePreview() {
        console.log('current', currentPage);
        // console.log('pages', pages);
        // console.log('pages[previousPage]', pages[previousPage]);
        // console.log('pages[currentPage]', pages[currentPage]);
        this.showControls();
        pages[previousPage].style.opacity = 0;
        pages[currentPage].style.opacity = 1;
    }

    nextPage() {
        if (currentPage < pages.length - 1) {
            previousPage = currentPage;
            currentPage++;
        }
        this.updatePreview();
    }

    prevPage() {
        if (currentPage > 0) {
            previousPage = currentPage;
            currentPage--;
        }
        this.updatePreview();
    }
}
