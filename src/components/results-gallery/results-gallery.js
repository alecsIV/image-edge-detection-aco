/* -------------------------------------------------------------------------- */
/*                               Results gallery                              */
/* -------------------------------------------------------------------------- */

export default class ResultsGallery {
    constructor() {
        const canvas = document.querySelector('#canvasFg');
        this.canvasW = canvas.getBoundingClientRect().width;
        this.canvasH = canvas.getBoundingClientRect().height;
        this.resultDiv = document.querySelector(".binary-canvas-holder"); // select target div

        // Set gallery controls
        this.initGalleryControls();
    }

    initGalleryControls() {
        // Overlay controls
        this.resultDivOverlays = document.querySelector(".overlays");
        this.leftArrow = document.querySelector(".arrow.left");
        this.rightArrow = document.querySelector(".arrow.right");
        this.itemCount = document.querySelector(".item-count");
        this.paramDetailsButton = document.querySelector(".param-details-button");
        this.paramDetails = document.querySelector(".param-details");

        //create close button
        this.paramDetailsCloseButton = document.createElement('button');
        this.paramDetailsCloseButton.setAttribute('class', 'close-button');
        this.paramDetailsCloseButton.innerHTML = 'x';

        // button event listeners
        this.leftArrow.addEventListener('click', () => this.prevPage());
        this.rightArrow.addEventListener('click', () => this.nextPage());
        this.paramDetailsButton.addEventListener('click', () => this.toggleParamsPanel('open'));
        this.paramDetailsCloseButton.addEventListener('click', () => this.toggleParamsPanel('close'));
    }

    createBinaryImage() {
        // Create a binary image from pheromone matrix information

        const width = this.canvasW,
            height = this.canvasH;
        let buffer = new Uint8ClampedArray(width * height * 4); // used to hold canvas pixel informaition 

        const binaryCanvas = document.createElement("canvas");
        binaryCanvas.setAttribute("class", "binary-canvas");
        binaryCanvas.setAttribute("width", width);
        binaryCanvas.setAttribute("height", height);
        const binCtx = binaryCanvas.getContext("2d");

        pheromoneMatrix.forEach((arr, y) => {
            arr.forEach((value, x) => {
                // check if the pheromone intensity value is higher than the initial pheromone value to define drawing (black) or background colour (white)
                const valueRGB = (value > initialPheromoneValue) ? 0 : 255;
                const pos = (y * height + x) * 4; // positioning (multiplied by 4 as there are 4 values for each pixel - RGBA)
                buffer[pos] = valueRGB; //  R value 
                buffer[pos + 1] = valueRGB; //  G value
                buffer[pos + 2] = valueRGB; //  B value
                buffer[pos + 3] = 255; // set alpha channel
                // }
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
            this.resultDiv.lastChild.style.opacity = 0;
        }

        this.addToGallery(binaryCanvas); // add the binary image to the gallery
    }

    addToGallery(binaryCanvas) {
        if (this.resultDiv.childElementCount > 0) {
            for (let item of this.resultDiv.children) {
                item.style.opacity = 0; // hide all previous gallery images
            }
        }
        //add binary image canvas to the HTML
        this.resultDiv.appendChild(binaryCanvas);

        // store canvas and its position positioning in the global arrays
        pages.push(this.resultDiv.lastChild);
        currentPage = pages.length - 1;

        this.saveParams(); // save current simulation parameters
        this.updatePreview(); // update the view of the gallery element
    }

    showControls() {
        // show overlay controls
        const childCount = this.resultDiv.childElementCount;
        this.resultDivOverlays.style.display = 'block';
        this.itemCount.innerHTML = `${currentPage + 1} / ${childCount}`; // page numbers

        // arrows behaviour
        switch (currentPage) {
            case 0:
                // first image
                this.rightArrow.style.display = 'block';
                this.leftArrow.style.display = 'none';
                break;
            case pages.length - 1:
                // last image
                this.leftArrow.style.display = 'block';
                this.rightArrow.style.display = 'none';
                break;
            default:
                // all images in between
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
        // update the image preview
        if (previousPage > -1) pages[previousPage].style.opacity = 0;
        pages[currentPage].style.opacity = 1;

        this.showControls();
        this.loadParams(); // load saved params for image
    }

    nextPage() {
        // go to next page
        if (currentPage < pages.length - 1) {
            previousPage = currentPage;
            currentPage++;
        }
        this.updatePreview();
    }

    prevPage() {
        // go to previous page
        if (currentPage > 0) {
            previousPage = currentPage;
            currentPage--;
        }
        this.updatePreview();
    }

    saveParams() {
        // save current image parameters 
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
        // load image parameters
        this.paramDetails.innerHTML = ''; // clear previous params

        //loop through saved simulation parameters for the image in view and add them to the html element
        savedParams[currentPage].forEach(element => {
            const span = document.createElement('span');
            span.setAttribute('class', 'param-details-element');
            span.setAttribute('id', `${element.id}-saved`);
            span.innerHTML = `${element.name}: ${element.value}`;
            this.paramDetails.appendChild(span);
        });
        this.paramDetails.appendChild(this.paramDetailsCloseButton);
    }

    toggleParamsPanel(action) {
        // open the parameters overlay panel
        if (action === 'open') {
            // Show parameters
            this.paramDetailsButton.style.display = 'none';
            this.paramDetails.style.display = 'block';
        } else {
            // Hide parameters
            this.paramDetailsButton.style.display = 'block';
            this.paramDetails.style.display = 'none';
        }
    }
}
