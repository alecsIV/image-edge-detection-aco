import ACO from './aco-algorithm';

const uploader = document.querySelector('#image-upload');
const image = document.querySelector('#image-source');
const imagePreview = document.querySelector('#image-preview');
const canvas = document.querySelector('#canvas');
const makeMatrixButton = document.querySelector('#make-matrix-button')
const matrixContainer = document.querySelector('.matrix-container');



uploader.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            image.setAttribute('src', this.result);
            imagePreview.setAttribute('src', this.result);
        })
        reader.readAsDataURL(file)
        makeMatrixButton.removeAttribute('disabled');
    }
});

makeMatrixButton.addEventListener('click', function () {
    console.log(image);
    if (image) {
        const imageMatrix = getMatrix(image);
        let algorithm = new ACO(imageMatrix);
        console.log(imageMatrix);
        // imageMatrix.forEach(element => {
        //     matrixContainer.innerHTML += element;
        // });
        // matrixContainer.innerHTML = getMatrix(image);
    }
});

function getMatrix(img) {
    const ctx = canvas.getContext('2d');
    drawImageProp(ctx, img, 0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    console.log(imgData);
    return imgData;
}

function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    const iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih)

    let nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill    
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
}
