export default class ResultsGallery {
    constructor() {
        const canvas = document.querySelector('#canvasFg');
        this.canvasW = canvas.getBoundingClientRect().width;
        this.canvasH = canvas.getBoundingClientRect().height;
        this.resultDiv = document.querySelector(".binary-canvas-holder"); // select target div

        // Set gallery controls
        this.initGalleryControls();
        this.initStateVars();
    }

    initGalleryControls() {
        this.resultDivOverlays = document.querySelector(".overlays");
        this.leftArrow = document.querySelector(".arrow.left");
        this.rightArrow = document.querySelector(".arrow.right");
        this.itemCount = document.querySelector(".item-count");
        this.paramDetailsButton = document.querySelector(".param-details-button");
        this.paramDetails = document.querySelector(".param-details");

        this.leftArrow.addEventListener('click', () => this.prevPage());
        this.rightArrow.addEventListener('click', () => this.nextPage());
        this.paramDetailsButton.addEventListener('click', () => this.viewParams());
    }

    initStateVars() {
        this.isParamsPanelOpen = false;
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

        pheromoneMatrix.forEach((arr, y) => {
            arr.forEach((value, x) => {
                if (value > initialPheromoneValue) {
                    const pos = (y * height + x) * 4;
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
        if (this.resultDiv.childElementCount > 0) {
            for (let item of this.resultDiv.children) {
                item.style.opacity = 0;
            }
        }
        //add image canvas to array
        this.resultDiv.appendChild(binaryCanvas);

        // store canvas positioning in gallery
        pages.push(this.resultDiv.lastChild);
        currentPage = pages.length - 1;

        this.saveParams(); // save current simulation parameters
        this.updatePreview(); // update the view of the gallery element
    }

    showControls() {
        const childCount = this.resultDiv.childElementCount;
        this.resultDivOverlays.style.display = 'block';
        this.itemCount.innerHTML = `${currentPage + 1} / ${childCount}`

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

        if (childCount === 1) {
            this.rightArrow.style.display = 'none';
            this.leftArrow.style.display = 'none';
        }
    }

    updatePreview() {
        if (previousPage > -1) pages[previousPage].style.opacity = 0;
        pages[currentPage].style.opacity = 1;
        this.showControls();
        this.loadParams();
    }

    nextPage() {
        if (currentPage < pages.length) {
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

    saveParams() {
        const paramsToSave = [];
        Object.values(allUI).forEach((element) => {
            const elementObj = {};
            elementObj.value = element.value;
            elementObj.id = element.id;
            elementObj.name = element.name;
            paramsToSave.push(elementObj);
        });
        savedParams.push(paramsToSave);
    }

    loadParams() {
        this.paramDetails.innerHTML = ''; // clear previous params

        //loop through saved simulation parameters for the image in view and add them to the html element
        savedParams[currentPage].forEach(element => {
            const span = document.createElement('span');
            span.setAttribute('class', 'param-details-element');
            span.setAttribute('id', `${element.id}-saved`);
            span.innerHTML = `${element.name}: ${element.value}`;
            this.paramDetails.appendChild(span);
        });
    }
    viewParams() {
        if (!this.isParamsPanelOpen) {
            // Show/hide views
            this.paramDetailsButton.style.display = 'none';
            this.paramDetails.style.display = 'block';
        } else {
            // Show/hide views
            this.paramDetailsButton.style.display = 'block';
            this.paramDetails.style.display = 'none';
        }
    }
}
